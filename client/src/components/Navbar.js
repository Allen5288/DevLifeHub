import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">DevLifeHub</Link>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-links ${isOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/fullstack" onClick={() => setIsOpen(false)}>FullStack</Link>
        <Link to="/games" onClick={() => setIsOpen(false)}>Games</Link>
        <Link to="/menu" onClick={() => setIsOpen(false)}>Menu</Link>
        <Link to="/travel" onClick={() => setIsOpen(false)}>Travel</Link>
        <Link to="/food" onClick={() => setIsOpen(false)}>Food</Link>
        <Link to="/tools" onClick={() => setIsOpen(false)}>Tools</Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        {isAuthenticated ? (
          <button className="auth-button" onClick={() => {
            logout();
            setIsOpen(false);
          }}>Logout</button>
        ) : (
          <Link to="/login" className="auth-button" onClick={() => setIsOpen(false)}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 