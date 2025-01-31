import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch test data
  const fetchTestData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      if (data.success) {
        setTestData(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch test data');
      console.error('Fetch error:', err);
    }
  };

  // Load test data on component mount
  useEffect(() => {
    fetchTestData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('');
        fetchTestData(); // Refresh the list
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save message');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="section-card" onClick={() => handleSectionClick('/tools')}>
            <h3>Developer Tools</h3>
            <p>Useful tools for developers: JSON formatter, Base64 converter, and more.</p>
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

      {/* MongoDB Test Section */}
      <section className="mongodb-test">
        <h2>MongoDB Connection Test</h2>
        
        {/* Test Form */}
        <form onSubmit={handleSubmit} className="test-form">
          <div className="form-group">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a test message"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save to MongoDB'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>

        {/* Display Test Data */}
        <div className="test-data">
          <h3>Saved Messages:</h3>
          {testData.length > 0 ? (
            <ul>
              {testData.map((test) => (
                <li key={test._id}>
                  <span>{test.message}</span>
                  <small>{new Date(test.timestamp).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No messages yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home; 