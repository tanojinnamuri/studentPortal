import React from 'react';
import "./style.css";

const ProjectCard = ({ name, image }) => {
  return (
    <div className="project-box">
      <img className="project-image" src={image} alt={name} />
      <h2 className="project-title">{name}</h2>
    </div>
  );
};

export default ProjectCard;
