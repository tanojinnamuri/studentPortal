import './sample.css';
import React, { useState, useEffect } from 'react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects/getAll')
      .then(response => response.json())
      .then(data => {
        console.log('Projects:', data);
        setProjects(data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
  
        <div className="project-list">
          {projects.map((project) => (
            <div className="project-card" key={project.id}>
              <h2>{project.name}</h2>
              <div className="project-details">
                <p><strong>Team Members:</strong> {project.teamMembers.join}</p>
                <p><strong>Creation Date:</strong> {project.creationDate}</p>
              </div>
              <div className="project-description">
                <p>{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      );
    
};

export default ProjectList;
