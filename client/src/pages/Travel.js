import React, { useState } from 'react';
import '../styles/Travel.css';

function Travel() {
  const [destinations] = useState([
    {
      id: 1,
      title: 'Japan Travel Guide',
      location: 'Japan',
      category: 'Asia',
      image: '/images/japan.jpg',
      description: 'Complete guide to exploring Japan, from traditional temples to modern cities.',
      highlights: [
        'Best time to visit',
        'Transportation tips',
        'Must-visit locations',
        'Local cuisine guide'
      ]
    },
    {
      id: 2,
      title: 'European Adventure',
      location: 'Various Countries',
      category: 'Europe',
      image: '/images/europe.jpg',
      description: 'How to plan the perfect European trip across multiple countries.',
      highlights: [
        'Inter-country travel',
        'Budget planning',
        'Cultural experiences',
        'Accommodation tips'
      ]
    },
    {
      id: 3,
      title: 'Southeast Asia Backpacking',
      location: 'Southeast Asia',
      category: 'Asia',
      image: '/images/southeast-asia.jpg',
      description: 'Ultimate backpacking guide for Southeast Asia adventures.',
      highlights: [
        'Backpacking essentials',
        'Route planning',
        'Local customs',
        'Budget tips'
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];

  const filteredDestinations = selectedCategory === 'All'
    ? destinations
    : destinations.filter(dest => dest.category === selectedCategory);

  return (
    <div className="travel-page">
      <div className="travel-header">
        <h1>Travel Guides & Tips</h1>
        <p>Discover amazing destinations and travel smarter with our comprehensive guides.</p>
      </div>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="destinations-grid">
        {filteredDestinations.map(destination => (
          <div key={destination.id} className="destination-card">
            <div className="destination-image">
              <img src={destination.image} alt={destination.title} />
              <span className="location-tag">{destination.location}</span>
            </div>
            <div className="destination-content">
              <h2>{destination.title}</h2>
              <p>{destination.description}</p>
              <div className="highlights">
                <h3>Highlights:</h3>
                <ul>
                  {destination.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <button className="read-more-btn">Read Full Guide</button>
            </div>
          </div>
        ))}
      </div>

      <div className="travel-tips-section">
        <h2>Essential Travel Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>Packing Smart</h3>
            <p>Learn how to pack efficiently for any type of trip.</p>
          </div>
          <div className="tip-card">
            <h3>Budget Planning</h3>
            <p>Tips for creating and sticking to your travel budget.</p>
          </div>
          <div className="tip-card">
            <h3>Safety First</h3>
            <p>Important safety tips for traveling abroad.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Travel; 