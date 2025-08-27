import React from 'react';
import { FaChartLine, FaClock, FaUsers, FaChartBar, FaColumns, FaFilePdf, FaBalanceScale, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-tagline">
            <span className="tagline-badge">New</span>
            <span className="tagline-text">AI-Powered Project Management</span>
          </div>
          <h1>TaskFlow</h1>
          <h2>Smart Project Management for Modern Teams</h2>
          <p className="hero-description">Automate time tracking, predict delays, and optimize team performance with AI-powered insights.</p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">Distribute</span>
              <span className="stat-label">Workload</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">40%</span>
              <span className="stat-label">Faster Delivery</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/login">
              <button className="primary-btn">
                Get Started
                <FaArrowRight className="btn-icon" />
              </button>
            </Link>
            <button className="secondary-btn">Watch Demo</button>
          </div>

          <div className="hero-features">
            <div className="feature-pill">
              <FaClock className="pill-icon" />
              <span>Automatic Time Tracking</span>
            </div>
            <div className="feature-pill">
              <FaChartLine className="pill-icon" />
              <span>AI Predictions</span>
            </div>
            <div className="feature-pill">
              <FaUsers className="pill-icon" />
              <span>Team Analytics</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="dashboard-preview">
            {/* Placeholder for dashboard screenshot */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaColumns className="feature-icon" />
            <h3>Kanban Board</h3>
            <p>Intuitive drag-and-drop task management with customizable columns to match your workflow.</p>
          </div>
          <div className="feature-card">
            <FaClock className="feature-icon" />
            <h3>Time Tracking</h3>
            <p>Automatic time logging when working on tasks, eliminating manual time entry.</p>
          </div>
          <div className="feature-card">
            <FaChartBar className="feature-icon" />
            <h3>Progress Analytics</h3>
            <p>Real-time charts and metrics showing team productivity and project velocity.</p>
          </div>
          <div className="feature-card">
            <FaCalendarAlt className="feature-icon" />
            <h3>Deadline Predictions</h3>
            <p>AI-powered algorithm estimates completion dates based on historical team performance.</p>
          </div>
          <div className="feature-card">
            <FaBalanceScale className="feature-icon" />
            <h3>Workload Balancer</h3>
            <p>Visual indicators showing team member capacity and workload distribution.</p>
          </div>
          <div className="feature-card">
            <FaFilePdf className="feature-icon" />
            <h3>Simple Reporting</h3>
            <p>Generate professional PDF reports for stakeholders with a single click.</p>
          </div>
        </div>
        
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="benefits-text">
            <h2>Transform Your Team's Productivity</h2>
            <ul className="benefits-list">
              <li>Reduce project delays by up to 40%</li>
              <li>Save 5+ hours per week on time tracking</li>
              <li>Improve team workload balance by 60%</li>
              <li>Make data-driven decisions with real-time insights</li>
            </ul>
          </div>
          <div className="benefits-image">
            {/* Placeholder for dashboard screenshot */}
            <div className="dashboard-preview"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Optimize Your Team's Workflow?</h2>
        <p>Join thousands of teams already using TaskFlow</p>
        <button className="primary-btn">Start Free Trial</button>
      </section>
    </div>
  );
};

export default LandingPage;