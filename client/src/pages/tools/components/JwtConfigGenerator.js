import React, { useState } from 'react';

function JwtConfigGenerator() {
  const [jwtConfig, setJwtConfig] = useState({
    secret: '',
    expiresIn: '7d',
    algorithm: 'HS256'
  });
  const [copied, setCopied] = useState(false);

  const generateSecret = () => {
    // Generate 32 random bytes for JWT secret
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const secret = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    setJwtConfig(prev => ({
      ...prev,
      secret
    }));
    setCopied(false);
  };

  const handleExpiryChange = (e) => {
    setJwtConfig(prev => ({
      ...prev,
      expiresIn: e.target.value
    }));
  };

  const handleAlgorithmChange = (e) => {
    setJwtConfig(prev => ({
      ...prev,
      algorithm: e.target.value
    }));
  };

  const copyToClipboard = () => {
    const configText = `JWT_SECRET='${jwtConfig.secret}'
JWT_EXPIRES_IN='${jwtConfig.expiresIn}'
JWT_ALGORITHM='${jwtConfig.algorithm}'`;

    navigator.clipboard.writeText(configText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const expiryOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '365d', label: '1 Year' }
  ];

  const algorithmOptions = [
    { value: 'HS256', label: 'HS256 (HMAC with SHA-256)' },
    { value: 'HS384', label: 'HS384 (HMAC with SHA-384)' },
    { value: 'HS512', label: 'HS512 (HMAC with SHA-512)' }
  ];

  return (
    <div className="tool-content">
      <h2>JWT Configuration Generator</h2>
      <p className="tool-description">
        Generate secure JWT configuration including secret key, expiration time, and signing algorithm.
      </p>

      <div className="tool-layout">
        <div className="config-options">
          <div className="option-group">
            <label>JWT Secret:</label>
            <div className="secret-input">
              <input 
                type="text" 
                value={jwtConfig.secret} 
                readOnly 
                placeholder="Click 'Generate Secret' to create a secure key"
              />
              <button onClick={generateSecret} className="generate-btn">
                Generate Secret
              </button>
            </div>
          </div>

          <div className="option-group">
            <label>Token Expiration:</label>
            <select value={jwtConfig.expiresIn} onChange={handleExpiryChange}>
              {expiryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <label>Signing Algorithm:</label>
            <select value={jwtConfig.algorithm} onChange={handleAlgorithmChange}>
              {algorithmOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {jwtConfig.secret && (
          <div className="output-section">
            <div className="config-display">
              <pre>
                {`JWT_SECRET='${jwtConfig.secret}'
JWT_EXPIRES_IN='${jwtConfig.expiresIn}'
JWT_ALGORITHM='${jwtConfig.algorithm}'`}
              </pre>
              <button 
                onClick={copyToClipboard}
                className={`copy-btn ${copied ? 'copied' : ''}`}
              >
                {copied ? 'Copied!' : 'Copy Config'}
              </button>
            </div>
            <div className="usage-example">
              <h3>Usage in your code:</h3>
              <pre>{`
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { 
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: process.env.JWT_ALGORITHM 
  }
);`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JwtConfigGenerator; 