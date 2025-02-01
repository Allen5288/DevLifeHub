import React, { useState } from 'react';
import JsonFormatter from './components/JsonFormatter';
import Base64Converter from './components/Base64Converter';
import SessionKeyGenerator from './components/SessionKeyGenerator';
import JwtConfigGenerator from './components/JwtConfigGenerator';
import GoogleOAuthGenerator from './components/GoogleOAuthGenerator';
import ClassCalendar from './components/ClassCalendar';
import './Tools.css';

function Tools() {
  const [activeTool, setActiveTool] = useState('json');

  const tools = [
    { id: 'json', name: 'JSON Formatter' },
    { id: 'base64', name: 'Base64 Converter' },
    { id: 'session-key', name: 'Session Key Generator' },
    { id: 'jwt-config', name: 'JWT Config Generator' },
    { id: 'google-oauth', name: 'Google OAuth Config' },
    { id: 'class-calendar', name: 'Class Calendar' }
  ];

  return (
    <div className="tools-page">
      <h1>Developer Tools</h1>
      <p className="tools-description">A collection of useful tools for developers</p>

      <div className="tools-navigation">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => setActiveTool(tool.id)}
          >
            {tool.name}
          </button>
        ))}
      </div>

      <div className="tool-container">
        {activeTool === 'json' && <JsonFormatter />}
        {activeTool === 'base64' && <Base64Converter />}
        {activeTool === 'session-key' && <SessionKeyGenerator />}
        {activeTool === 'jwt-config' && <JwtConfigGenerator />}
        {activeTool === 'google-oauth' && <GoogleOAuthGenerator />}
        {activeTool === 'class-calendar' && <ClassCalendar />}
      </div>
    </div>
  );
}

export default Tools; 