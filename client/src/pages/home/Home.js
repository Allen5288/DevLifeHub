import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleSectionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to My Personal Website</h1>
          <p>Full Stack Developer | Game Creator | Food & Travel Enthusiast</p>
        </div>
      </section>

      <section className="featured-sections">
        <h2>Explore My World</h2>
        <div className="sections-grid">
          <div className="section-card" onClick={() => handleSectionClick('/fullstack')}>
            <h3>Full Stack Projects</h3>
            <p>Explore my web development projects and technical solutions.</p>
          </div>
          <div className="section-card" onClick={() => handleSectionClick('/games')}>
            <h3>Games</h3>
            <p>Check out the games I've created and play them online.</p>
          </div>
          <div className="section-card" onClick={() => handleSectionClick('/menu')}>
            <h3>Menu</h3>
            <p>Discover my favorite recipes and cooking adventures.</p>
          </div>
          <div className="section-card" onClick={() => handleSectionClick('/travel')}>
            <h3>Travel</h3>
            <p>Join me on my journey exploring different places and cultures.</p>
          </div>
          <div className="section-card" onClick={() => handleSectionClick('/food')}>
            <h3>Food</h3>
            <p>Experience culinary delights and restaurant reviews.</p>
          </div>
        </div>
      </section>

      <section className="about">
        <h2>About Me</h2>
        <div className="about-content">
          <div className="profile-image">
            {/* Add your profile image here */}
          </div>
          <div className="bio">
            <p>I'm a passionate developer who loves creating web applications and games. 
               When I'm not coding, you can find me exploring new places, trying different cuisines, 
               or experimenting with recipes in my kitchen.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 