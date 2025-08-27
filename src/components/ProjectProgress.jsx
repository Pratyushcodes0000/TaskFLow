import React from 'react';
import './ProjectProgress.css';
import { FaTasks, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const ProjectProgress = ({ progress, totalTasks, completedTasks }) => {
  console.log('ProjectProgress props:', { progress, totalTasks, completedTasks });

  const getProgressColor = (progress) => {
    if (progress === 0) return 'red';
    if (progress <= 25) return 'orange';
    if (progress <= 50) return 'yellow';
    if (progress <= 75) return 'green';
    return 'blue';
  };

  return (
    <div className="progress-container" style={{ 
      background: 'rgba(30, 30, 30, 0.8)',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1rem 0',
      width: '100%',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    }}>
      <div className="progress-header">
        <h3 className="progress-title">Project Progress</h3>
        <div className="progress-stats">
          <div className="progress-stat">
            <FaTasks />
            <span>Total Tasks: {totalTasks}</span>
          </div>
          <div className="progress-stat">
            <FaCheckCircle />
            <span>Completed: {completedTasks}</span>
          </div>
          <div className="progress-stat">
            <FaSpinner />
            <span>Remaining: {totalTasks - completedTasks}</span>
          </div>
        </div>
      </div>
      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${getProgressColor(progress)}`}
          style={{ 
            width: `${progress}%`,
            height: '100%',
            borderRadius: '6px',
            transition: 'width 0.3s ease, background-color 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
        />
        <div className="progress-percentage">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress; 