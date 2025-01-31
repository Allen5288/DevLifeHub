import React, { useState } from 'react';

function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
      setOutput('');
    }
  };

  return (
    <div className="tool-content">
      <h2>JSON Formatter & Validator</h2>
      <div className="tool-layout">
        <div className="input-section">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
          />
        </div>
        
        <div className="actions">
          <button onClick={formatJson}>Format</button>
          <button onClick={minifyJson}>Minify</button>
        </div>

        <div className="output-section">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <pre>{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default JsonFormatter; 