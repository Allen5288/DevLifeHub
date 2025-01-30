import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">My Personal Website</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/fullstack">Full Stack</Link></li>
        <li><Link to="/games">Games</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/travel">Travel</Link></li>
        <li><Link to="/food">Food</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar; 