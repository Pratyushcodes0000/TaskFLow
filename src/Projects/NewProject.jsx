import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaChartLine } from 'react-icons/fa';
import './NewProject.css';
import axios from 'axios';

const NewProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    priority: 'medium',
    status: 'planning',
    type: 'group',
    members: [],
    tasks: [],
    tags: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    if (formData.startDate && formData.dueDate && new Date(formData.startDate) > new Date(formData.dueDate)) {
      newErrors.dueDate = 'Due date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const googleToken = localStorage.getItem('googleToken');
        const authToken = token || googleToken;

        if (!authToken) {
          console.error('No authentication token found');
          // Clear any existing invalid session data
          localStorage.removeItem('token');
          localStorage.removeItem('googleToken');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const response = await axios.post('http://localhost:8000/api/addproject', 
          {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            dueDate: formData.dueDate,
            startDate: formData.startDate,
            status: formData.status,
            type: formData.type,
            tags: formData.tags || []
          },
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          navigate('/ProjectsManagement');
        } else {
          console.error('Failed to create project:', response.data.message);
          setErrors(prev => ({
            ...prev,
            submit: response.data.message || 'Failed to create project'
          }));
        }
      } catch (error) {
        console.error('Error creating project:', error);
        if (error.response?.status === 401) {
          // Clear invalid session data
          localStorage.removeItem('token');
          localStorage.removeItem('googleToken');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          setErrors(prev => ({
            ...prev,
            submit: error.response?.data?.message || 'An error occurred while creating the project'
          }));
        }
      }
    }
  };

  return (
    <div className="new-project-container">
      <div className="new-project-header">
        <button className="back-button" onClick={() => navigate('/ProjectsManagement')}>
          <FaArrowLeft />
          Back to Projects
        </button>
        <h1>Create New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="new-project-form">
        <div className="form-section">
          <h2>Project Details</h2>
          <div className="form-group">
            <label htmlFor="title">Project Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              rows="4"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date *</label>
              <div className="date-input">
                <FaCalendarAlt />
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={errors.startDate ? 'error' : ''}
                />
              </div>
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <div className="date-input">
                <FaCalendarAlt />
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={errors.dueDate ? 'error' : ''}
                />
              </div>
              {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">Project Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="group">Group Project</option>
                <option value="individual">Individual Project</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={() => navigate('/ProjectsManagement')}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;
