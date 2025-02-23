import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import { Home, FullStack, Games, Menu, Travel, Food, Contact, Tools } from './pages'
import { Login, Register, ForgotPassword, ResetPassword } from './components/auth'
import Profile from './components/profile/Profile'
import './styles/App.css'
import './styles/global.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className='app'>
          <Navbar />
          <div className='main-content'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element={<ResetPassword />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/fullstack/*' element={<FullStack />} />
              <Route path='/games/*' element={<Games />} />
              <Route path='/menu/*' element={<Menu />} />
              <Route path='/travel/*' element={<Travel />} />
              <Route path='/food/*' element={<Food />} />
              <Route path='/tools/*' element={<Tools />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
