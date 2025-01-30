import React from 'react';

function FullStack() {
  return (
    <div>
      <h2>Full Stack Projects</h2>
      {/* Projects will be added later */}
    </div>
  );
}

export default FullStack;

// Also export other components that might be needed elsewhere
export { ProjectCard } from './components/ProjectCard';
export { ProjectList } from './components/ProjectList';

export { default } from './FullStack'; 