import React, { useState } from 'react'

function SessionKeyGenerator() {
  const [sessionKey, setSessionKey] = useState('')
  const [copied, setCopied] = useState(false)

  const generateKey = () => {
    // Generate 64 random bytes and convert to hex
    const array = new Uint8Array(64)
    window.crypto.getRandomValues(array)
    const key = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    setSessionKey(key)
    setCopied(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className='tool-content'>
      <h2>Session Secret Key Generator</h2>
      <p className='tool-description'>
        Generate a secure random key for Express session secret. This tool uses the Web Crypto API to generate
        cryptographically secure random values.
      </p>

      <div className='tool-layout'>
        <div className='actions'>
          <button onClick={generateKey} className='generate-btn'>
            Generate New Key
          </button>
        </div>

        {sessionKey && (
          <div className='output-section'>
            <div className='key-display'>
              <pre>{sessionKey}</pre>
              <button onClick={copyToClipboard} className={`copy-btn ${copied ? 'copied' : ''}`}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className='usage-example'>
              <h3>Usage in .env file:</h3>
              <pre>SESSION_SECRET_KEY='{sessionKey}'</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SessionKeyGenerator
