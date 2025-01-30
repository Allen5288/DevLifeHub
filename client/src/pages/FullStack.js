import React from 'react';
import '../styles/FullStack.css';

function FullStack() {
  const technologies = [
    {
      category: 'Frontend',
      skills: [
        { name: 'HTML5', description: 'Structure and semantics of web content' },
        { name: 'CSS3', description: 'Styling and responsive design' },
        { name: 'JavaScript', description: 'Core programming language for web development' },
        { name: 'React', description: 'Frontend library for building user interfaces' },
        { name: 'Angular', description: 'Full-featured frontend framework' }
      ]
    },
    {
      category: 'Backend',
      skills: [
        { name: 'Node.js', description: 'JavaScript runtime for server-side development' },
        { name: 'Express.js', description: 'Web application framework for Node.js' },
        { name: 'RESTful APIs', description: 'Design and implementation of web services' }
      ]
    },
    {
      category: 'Database',
      skills: [
        { name: 'MongoDB', description: 'NoSQL database for modern applications' },
        { name: 'SQL', description: 'Relational database management' }
      ]
    }
  ];

  return (
    <div className="fullstack-page">
      <h1>Full Stack Development Journey</h1>
      <p className="intro">
        Explore my journey through various technologies and frameworks in web development.
        Here you'll find resources, tutorials, and insights about different aspects of
        full-stack development.
      </p>

      <div className="tech-sections">
        {technologies.map((tech, index) => (
          <div key={index} className="tech-category">
            <h2>{tech.category}</h2>
            <div className="skills-grid">
              {tech.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="skill-card">
                  <h3>{skill.name}</h3>
                  <p>{skill.description}</p>
                  <button className="learn-more-btn">Learn More</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FullStack; 