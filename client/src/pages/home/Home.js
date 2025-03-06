import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCode, FaGamepad, FaUtensils, FaPlane, FaTools, FaGlobe } from 'react-icons/fa'
import { BiLogoReact, BiLogoNodejs, BiLogoMongodb } from 'react-icons/bi'
import { SiExpress, SiRedux, SiTypescript } from 'react-icons/si'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [testData, setTestData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch test data
  const fetchTestData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/test`)
      const data = await response.json()
      if (data.success) {
        setTestData(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to fetch test data')
      console.error('Fetch error:', err)
    }
  }

  // Load test data on component mount
  useEffect(() => {
    fetchTestData()
  }, [])

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('')
        fetchTestData() // Refresh the list
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to save message')
      console.error('Submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionClick = path => {
    navigate(path)
  }

  const sections = [
    {
      id: 'fullstack',
      title: 'Full Stack Development',
      description: 'Modern web applications built with React, Node.js, and MongoDB.',
      icon: <FaCode className='section-icon' />,
      path: '/fullstack',
      technologies: [
        { icon: <BiLogoReact />, name: 'React' },
        { icon: <BiLogoNodejs />, name: 'Node.js' },
        { icon: <BiLogoMongodb />, name: 'MongoDB' },
        { icon: <SiExpress />, name: 'Express' },
        { icon: <SiRedux />, name: 'Redux' },
        { icon: <SiTypescript />, name: 'TypeScript' },
      ],
      quickLinks: [
        { title: 'Projects', path: '/fullstack/projects' },
        { title: 'Blog Posts', path: '/fullstack/blog' },
        { title: 'Resources', path: '/fullstack/resources' },
      ],
    },
    {
      id: 'games',
      title: 'Game Development',
      description: 'Interactive web games and gaming projects.',
      icon: <FaGamepad className='section-icon' />,
      path: '/games',
      technologies: [
        { icon: '🎮', name: 'Unity' },
        { icon: '🕹️', name: 'Phaser' },
        { icon: '🎲', name: 'Three.js' },
      ],
      quickLinks: [
        { title: 'Play Games', path: '/games/play' },
        { title: 'Tutorials', path: '/games/tutorials' },
        { title: 'Showcase', path: '/games/showcase' },
      ],
    },
    {
      id: 'glbguides',
      title: 'Global Guides',
      description: 'Comprehensive guides for global knowledge and resources.',
      icon: <FaGlobe className='section-icon' />,
      path: '/glbguides',
      features: [
        { icon: '🌐', name: 'Global' },
        { icon: '📚', name: 'Guides' },
        { icon: '🔍', name: 'Resources' },
      ],
      quickLinks: [
        { title: 'Beginner Guides', path: '/glbguides?category=beginner' },
        { icon: '📚', title: 'Advanced Guides', path: '/glbguides?category=advanced' },
        { icon: '🔍', title: 'Resources', path: '/glbguides/resources' },
      ],
    },
    {
      id: 'travel',
      title: 'Travel Adventures',
      description: 'Exploring the world and sharing travel experiences.',
      icon: <FaPlane className='section-icon' />,
      path: '/travel',
      features: [
        { icon: '🗺️', name: 'Destinations' },
        { icon: '📸', name: 'Photos' },
        { icon: '✈️', name: 'Tips' },
      ],
      quickLinks: [
        { title: 'Destinations', path: '/travel/destinations' },
        { title: 'Photo Gallery', path: '/travel/gallery' },
        { title: 'Travel Tips', path: '/travel/tips' },
      ],
    },
    {
      id: 'food',
      title: 'Food & Cuisine',
      description: 'Culinary adventures and restaurant reviews.',
      icon: <FaUtensils className='section-icon' />,
      path: '/food',
      features: [
        { icon: '🍳', name: 'Recipes' },
        { icon: '🍽️', name: 'Reviews' },
        { icon: '📝', name: 'Tips' },
      ],
      quickLinks: [
        { title: 'Recipes', path: '/food/recipes' },
        { title: 'Reviews', path: '/food/reviews' },
        { title: 'Cooking Tips', path: '/food/tips' },
      ],
    },
    {
      id: 'tools',
      title: 'Developer Tools',
      description: 'Useful tools for developers: JSON formatter, encoders, and more.',
      icon: <FaTools className='section-icon' />,
      path: '/tools',
      tools: [
        { icon: '🔧', name: 'JSON Tools' },
        { icon: '🔐', name: 'Encoders' },
        { icon: '⚙️', name: 'Generators' },
      ],
      quickLinks: [
        { title: 'JSON Formatter', path: '/tools?tool=json' },
        { title: 'Base64 Converter', path: '/tools?tool=base64' },
        { title: 'Key Generator', path: '/tools?tool=session-key' },
      ],
    },
  ]

  return (
    <div className='home-page'>
      <header className='hero-section'>
        <h1>Welcome to DevLifeHub</h1>
        <p>Exploring the intersection of technology, travel, and lifestyle</p>
      </header>

      <main className='sections-container'>
        {sections.map(section => (
          <section key={section.id} className='content-section'>
            <div className='section-header'>
              {section.icon}
              <h2>{section.title}</h2>
            </div>

            <div className='section-content'>
              <div className='section-info'>
                <p className='section-description'>{section.description}</p>
                <button className='explore-button' onClick={() => handleSectionClick(section.path)}>
                  Explore {section.title}
                </button>
              </div>

              <div className='section-features'>
                {section.technologies && (
                  <div className='tech-stack'>
                    <h3>Technologies</h3>
                    <div className='tech-icons'>
                      {section.technologies.map((tech, index) => (
                        <div key={index} className='tech-item'>
                          <span className='tech-icon'>{tech.icon}</span>
                          <span className='tech-name'>{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(section.features || section.tools) && (
                  <div className='feature-list'>
                    <h3>Features</h3>
                    <div className='feature-icons'>
                      {(section.features || section.tools).map((feature, index) => (
                        <div key={index} className='feature-item'>
                          <span className='feature-icon'>{feature.icon}</span>
                          <span className='feature-name'>{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='quick-links'>
                <h3>Quick Links</h3>
                <div className='links-grid'>
                  {section.quickLinks.map((link, index) => (
                    <button key={index} className='quick-link-button' onClick={() => handleSectionClick(link.path)}>
                      {link.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* MongoDB Test Section */}
      {process.env.NODE_ENV === 'development' && (
        <section className='mongodb-test'>
          <h2>MongoDB Connection Test</h2>

          {/* Test Form */}
          <form onSubmit={handleSubmit} className='test-form'>
            <div className='form-group'>
              <input
                type='text'
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder='Enter a test message'
                required
              />
              <button type='submit' disabled={loading}>
                {loading ? 'Saving...' : 'Save to MongoDB'}
              </button>
            </div>
            {error && <div className='error-message'>{error}</div>}
          </form>

          {/* Display Test Data */}
          <div className='test-data'>
            <h3>Saved Messages:</h3>
            {testData.length > 0 ? (
              <ul>
                {testData.map(test => (
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
      )}
    </div>
  )
}

export default Home
