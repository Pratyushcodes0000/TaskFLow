import React, { useState, useEffect } from 'react';
import { FaUsers, FaUser, FaPlus, FaEllipsisV, FaCalendarAlt, FaChartLine, FaCopy, FaSignInAlt, FaLock, FaUnlock } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './ProjectsManagement.css';
import ProjectProgress from '../components/ProjectProgress';

const ProjectsManagement = () => {
  const [activeTab, setActiveTab] = useState('group');
  const [projects, setProjects] = useState([]);
  const [showJoinCode, setShowJoinCode] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const googleToken = localStorage.getItem('googleToken');
    
    // Use the appropriate token
    const authToken = token || googleToken;
    if (authToken) {
      fetchProjects(authToken);
    }
  }, []);

  const fetchProjects = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/api/getAllProject',{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log('Projects data:', response.data.projects);
        setProjects(response.data.projects || []);
      } else {
        console.error('Failed to fetch projects:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('googleToken');
        navigate('/login');
      }
    }
  };

  const handleProjectClick = (projectId) => {
    if(activeTab === 'group'){
      navigate(`/projectsManagement/GroupDashboard/${projectId}`);
    }else if(activeTab === 'individual'){
      navigate(`/projectsManagement/IndivisualDashboard/${projectId}`);
    }
    
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleJoinProject = async (e) => {
    e.preventDefault();
    setJoinError('');
    
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('googleToken');
      const response = await axios.post(
        'http://localhost:8000/api/join-by-code',
        { code: joinCode },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setShowJoinModal(false);
        setJoinCode('');
        // Refresh projects list
        fetchProjects(token);
      }
    } catch (error) {
      setJoinError(error.response?.data?.message || 'Failed to join project');
    }
  };

  const toggleJoinByCode = async (projectId, currentStatus) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('googleToken');
      const response = await axios.patch(
        `http://localhost:8000/api/project/${projectId}/toggle-join`,
        { allowjoinByCode: !currentStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Refresh projects list
        fetchProjects(token);
      }
    } catch (error) {
      console.error('Error toggling join by code:', error);
    }
  };

  const ProjectCard = ({ project, isGroup }) => {
    console.log('Project data in card:', project);
    return (
      <div 
        className="project-card"
        onClick={() => handleProjectClick(project._id)}
      >
        <div className="project-header">
          <div className="project-title-section">
            <h3>{project.title || 'Untitled Project'}</h3>
            <span className={`priority-badge ${(project.priority || 'medium').toLowerCase()}`}>
              {project.priority || 'Medium'}
            </span>
          </div>
          <div className="project-actions">
            {isGroup && (
              <>
                <button 
                  className="action-button join-code-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Join code button clicked, project:', project);
                    setShowJoinCode(showJoinCode === project._id ? null : project._id);
                  }}
                  title={project.allowjoinByCode ? "Show Join Code" : "Join by code is disabled"}
                  disabled={!project.allowjoinByCode}
                >
                  <FaCopy />
                </button>
                <button 
                  className="action-button toggle-join-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleJoinByCode(project._id, project.allowjoinByCode);
                  }}
                  title={project.allowjoinByCode ? "Disable Join by Code" : "Enable Join by Code"}
                >
                  {project.allowjoinByCode ? <FaUnlock /> : <FaLock />}
                </button>
              </>
            )}
            <button 
              className="action-button"
              onClick={(e) => {
                e.stopPropagation();
                // Handle project actions
              }}
            >
              <FaEllipsisV />
            </button>
          </div>
        </div>

        {showJoinCode === project._id && project.allowjoinByCode && (
          <div className="join-code-tooltip" onClick={(e) => e.stopPropagation()}>
            <div className="join-code-content">
              <span>Join Code: {project.joincode || 'Not available'}</span>
              <button 
                className="copy-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (project.joincode) {
                    copyToClipboard(project.joincode);
                  }
                }}
                disabled={!project.joincode}
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <p className="project-description">{project.description || 'No description available'}</p>
        
        <div className="project-progress-container">
          <ProjectProgress
            progress={project.progress || 0}
            totalTasks={project.totalTasks || 0}
            completedTasks={project.completedTasks || 0}
          />
        </div>

        <div className="project-details">
          {isGroup && (
            <div className="project-members">
              <FaUsers />
              <span>{Array.isArray(project.members) ? project.members.length : 0} members</span>
            </div>
          )}
          <div className="project-tasks">
            <FaChartLine />
            <span>{project.completedTasks || 0}/{project.totalTasks || 0} tasks</span>
          </div>
          <div className="project-due-date">
            <FaCalendarAlt />
            <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}</span>
          </div>
          <div className="project-status">
            <span className={`status-badge ${(project.status || 'pending').toLowerCase().replace(' ', '-')}`}>
              {project.status || 'Pending'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="projects-management-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <div className="header-buttons">
          <button 
            className="join-project-button"
            onClick={() => setShowJoinModal(true)}
          >
            <FaSignInAlt />
            Join Project
          </button>
          <Link to="/NewProject" className="new-project-button">
            <FaPlus />
            New Project
          </Link>
        </div>
      </div>

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="join-modal" onClick={e => e.stopPropagation()}>
            <h2>Join Project</h2>
            <form onSubmit={handleJoinProject}>
              <div className="form-group">
                <label htmlFor="joinCode">Enter Project Code</label>
                <input
                  type="text"
                  id="joinCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter the project code"
                  required
                />
              </div>
              {joinError && <div className="error-message">{joinError}</div>}
              <div className="modal-buttons">
                <button type="button" className="cancel-button" onClick={() => setShowJoinModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Join Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="project-tabs">
        <button 
          className={`tab-button ${activeTab === 'group' ? 'active' : ''}`}
          onClick={() => setActiveTab('group')}
        >
          <FaUsers />
          Group Projects
        </button>
        <button 
          className={`tab-button ${activeTab === 'individual' ? 'active' : ''}`}
          onClick={() => setActiveTab('individual')}
        >
          <FaUser />
          Individual Projects
        </button>
      </div>

      <div className="projects-section">
        {activeTab === 'group' ? (
          <div className="projects-grid">
            {projects
              .filter(project => project.type === 'group')
              .map(project => (
                <ProjectCard key={project._id} project={project} isGroup={true} />
              ))}
          </div>
        ) : (
          <div className="projects-grid">
            {projects
              .filter(project => project.type === 'individual')
              .map(project => (
                <ProjectCard key={project._id} project={project} isGroup={false} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManagement;
