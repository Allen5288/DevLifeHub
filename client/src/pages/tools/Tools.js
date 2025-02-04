import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ToolsPage from './ToolsPage';
import JsonFormatterPage from './features/jsonFormatter/JsonFormatterPage';
import Base64ConverterPage from './features/base64/Base64ConverterPage';
import SessionKeyGeneratorPage from './features/sessionKey/SessionKeyGeneratorPage';
import JwtConfigGeneratorPage from './features/jwtConfig/JwtConfigGeneratorPage';
import GoogleOAuthGeneratorPage from './features/googleOAuth/GoogleOAuthGeneratorPage';
import ClassCalendarPage from './features/calendar/ClassCalendarPage';

function Tools() {
  return (
    <Routes>
      <Route path="/" element={<ToolsPage />} />
      <Route path="/json-formatter" element={<JsonFormatterPage />} />
      <Route path="/base64" element={<Base64ConverterPage />} />
      <Route path="/session-key" element={<SessionKeyGeneratorPage />} />
      <Route path="/jwt-config" element={<JwtConfigGeneratorPage />} />
      <Route path="/google-oauth" element={<GoogleOAuthGeneratorPage />} />
      <Route path="/calendar" element={<ClassCalendarPage />} />
    </Routes>
  );
}

export default Tools;