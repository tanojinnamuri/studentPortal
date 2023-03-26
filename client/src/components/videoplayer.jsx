import ProjectCard from './ProjectCard';
import React, { useState, useEffect } from 'react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/projects/getAll')
      .then(response => response.json())
      .then(data => {
        console.log('Projects:', data);
        setProjects(data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="project-list">
      {projects.map((project) => {
        console.log('Project:', project);
        return (
          <ProjectCard
            key={project._id}
            name={project.name}
            image={project.abstract}
          />
        );
      })}
    </div>
  );
};

export default ProjectList;
