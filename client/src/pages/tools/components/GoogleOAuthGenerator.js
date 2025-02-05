import React, { useState } from 'react'

function GoogleOAuthGenerator() {
  const [oauthConfig, setOauthConfig] = useState({
    clientId: '',
    clientSecret: '',
    callbackUrl: `${process.env.REACT_APP_API_URL}/auth/google/callback`,
  })
  const [copied, setCopied] = useState(false)

  const handleInputChange = e => {
    const { name, value } = e.target
    setOauthConfig(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const copyToClipboard = () => {
    const configText = `# Google OAuth
GOOGLE_CLIENT_ID='${oauthConfig.clientId}'
GOOGLE_CLIENT_SECRET='${oauthConfig.clientSecret}'
GOOGLE_CALLBACK_URL='${oauthConfig.callbackUrl}'`

    navigator.clipboard.writeText(configText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className='tool-content'>
      <h2>Google OAuth Configuration</h2>
      <p className='tool-description'>
        Configure Google OAuth credentials for your application. Get your credentials from the Google Cloud Console.
      </p>

      <div className='tool-layout'>
        <div className='config-options'>
          <div className='option-group'>
            <label>Client ID:</label>
            <input
              type='text'
              name='clientId'
              value={oauthConfig.clientId}
              onChange={handleInputChange}
              placeholder='Enter your Google Client ID'
              className='config-input'
            />
          </div>

          <div className='option-group'>
            <label>Client Secret:</label>
            <input
              type='text'
              name='clientSecret'
              value={oauthConfig.clientSecret}
              onChange={handleInputChange}
              placeholder='Enter your Google Client Secret'
              className='config-input'
            />
          </div>

          <div className='option-group'>
            <label>Callback URL:</label>
            <input
              type='text'
              name='callbackUrl'
              value={oauthConfig.callbackUrl}
              onChange={handleInputChange}
              placeholder={`{process.env.REACT_APP_API_URL}/auth/google/callback`}
              className='config-input'
            />
          </div>
        </div>

        {oauthConfig.clientId && oauthConfig.clientSecret && (
          <div className='output-section'>
            <div className='config-display'>
              <pre>
                {`# Google OAuth
GOOGLE_CLIENT_ID='${oauthConfig.clientId}'
GOOGLE_CLIENT_SECRET='${oauthConfig.clientSecret}'
GOOGLE_CALLBACK_URL='${oauthConfig.callbackUrl}'`}
              </pre>
              <button onClick={copyToClipboard} className={`copy-btn ${copied ? 'copied' : ''}`}>
                {copied ? 'Copied!' : 'Copy Config'}
              </button>
            </div>
            <div className='usage-example'>
              <h3>Setup Instructions:</h3>
              <ol className='setup-steps'>
                <li>
                  Go to{' '}
                  <a href='https://console.cloud.google.com/' target='_blank' rel='noopener noreferrer'>
                    Google Cloud Console
                  </a>
                </li>
                <li>Create a new project or select existing one</li>
                <li>Enable Google+ API and Google OAuth2 API</li>
                <li>Go to Credentials section</li>
                <li>Create OAuth client ID for Web application</li>
                <li>
                  Add authorized origins: <code>http://localhost:3000</code>
                </li>
                <li>
                  Add redirect URI: <code>${process.env.REACT_APP_API_URL}/auth/google/callback</code>
                </li>
                <li>Copy the generated Client ID and Client Secret</li>
                <li>Paste them in the fields above</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoogleOAuthGenerator
