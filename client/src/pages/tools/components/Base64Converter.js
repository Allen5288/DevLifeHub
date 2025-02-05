import React, { useState } from 'react'

function Base64Converter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encode') // 'encode' or 'decode'

  const handleConversion = () => {
    try {
      if (mode === 'encode') {
        const encoded = btoa(input)
        setOutput(encoded)
      } else {
        const decoded = atob(input)
        setOutput(decoded)
      }
    } catch (error) {
      setOutput('Error: Invalid input for ' + mode)
    }
  }

  return (
    <div className='tool-content'>
      <h2>Base64 Encoder/Decoder</h2>
      <div className='tool-layout'>
        <div className='mode-selector'>
          <button className={mode === 'encode' ? 'active' : ''} onClick={() => setMode('encode')}>
            Encode
          </button>
          <button className={mode === 'decode' ? 'active' : ''} onClick={() => setMode('decode')}>
            Decode
          </button>
        </div>

        <div className='input-section'>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Enter text to ${mode}...`} />
        </div>

        <div className='actions'>
          <button onClick={handleConversion}>Convert</button>
        </div>

        <div className='output-section'>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  )
}

export default Base64Converter
