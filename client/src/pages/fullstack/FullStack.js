import React from 'react';
import './FullStack.css';

function FullStack() {
  const projects = [
    {
      id: 1,
      title: 'Personal Website',
      description: 'A full-stack personal website built with React and Node.js',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      github: 'https://github.com/yourusername/personal-website',
      demo: 'https://your-website.com'
    },
    // Add more projects
  ];

  return (
    <div className="fullstack-page">
      <h1>Full Stack Projects</h1>
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tech-stack">
              {project.technologies.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
            <div className="project-links">
              <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">Live Demo</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FullStack; 