import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <section className="section fullstack-section">
        <h2>Full Stack Knowledge</h2>
        <p>Explore various programming technologies and frameworks including JavaScript, React, Node.js, and more.</p>
        <Link to="/fullstack" className="section-link">Learn More</Link>
      </section>

      <section className="section games-section">
        <h2>Party Games</h2>
        <p>Discover fun party games to play with friends and family. New games added regularly!</p>
        <Link to="/games" className="section-link">Play Games</Link>
      </section>

      <section className="section menu-section">
        <h2>Cocktail Menu</h2>
        <p>Browse and order from our selection of craft cocktails. Perfect for your next party!</p>
        <Link to="/menu" className="section-link">View Menu</Link>
      </section>

      <section className="section travel-section">
        <h2>Travel Blog</h2>
        <p>Travel tips, guides, and personal experiences from around the world.</p>
        <Link to="/travel" className="section-link">Explore</Link>
      </section>

      <section className="section food-section">
        <h2>Food Blog</h2>
        <p>Cooking tips, recipes, and culinary adventures.</p>
        <Link to="/food" className="section-link">Get Cooking</Link>
      </section>

      <section className="section contact-section">
        <h2>Contact</h2>
        <p>Get in touch and connect with me on social media.</p>
        <Link to="/contact" className="section-link">Contact Me</Link>
      </section>
    </div>
  );
}

export default Home; 