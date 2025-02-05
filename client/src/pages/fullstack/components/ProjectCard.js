import React from 'react'

function ProjectCard({ project }) {
  return (
    <div className='project-card'>
      <h3>{project?.title || 'Project Title'}</h3>
      {/* Project card content will be added later */}
    </div>
  )
}

export default ProjectCard
