import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ToolsPage from './ToolsPage'
import JsonFormatterPage from './features/jsonFormatter/JsonFormatterPage'
import Base64ConverterPage from './features/base64/Base64ConverterPage'
import SessionKeyGeneratorPage from './features/sessionKey/SessionKeyGeneratorPage'
import JwtConfigGeneratorPage from './features/jwtConfig/JwtConfigGeneratorPage'
import GoogleOAuthGeneratorPage from './features/googleOAuth/GoogleOAuthGeneratorPage'
import ClassCalendarPage from './features/calendar/ClassCalendarPage'
import CodeComparator from './features/CodeCompare/SalaryCalculatePage'
import SalaryCalculatePage from './features/salaryCalculateApp/SalaryCalculatePage'
import CurrencyExchangePage from './features/currencyExchange/CurrencyExchangePage'
import TodoPage from './features/todo/TodoPage'

function Tools() {
  return (
    <Routes>
      <Route path='/' element={<ToolsPage />} />
      <Route path='/json-formatter' element={<JsonFormatterPage />} />
      <Route path='/base64' element={<Base64ConverterPage />} />
      <Route path='/session-key' element={<SessionKeyGeneratorPage />} />
      <Route path='/jwt-config' element={<JwtConfigGeneratorPage />} />
      <Route path='/google-oauth' element={<GoogleOAuthGeneratorPage />} />
      <Route path='/calendar' element={<ClassCalendarPage />} />
      <Route path='/code-compare' element={<CodeComparator />} />
      <Route path='/salary-calculator' element={<SalaryCalculatePage />} />
      <Route path='/currency-exchange' element={<CurrencyExchangePage />} />
      <Route path='/todo' element={<TodoPage />} />
    </Routes>
  )
}

export default Tools
