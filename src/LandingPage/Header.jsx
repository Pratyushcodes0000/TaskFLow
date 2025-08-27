import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Function to proxy the Google profile picture through our backend
  const getProxiedProfilePicture = (originalUrl) => {
    if (!originalUrl) return null;
    // If it's already a proxied URL, return as is
    if (originalUrl.includes('/api/proxy-image')) return originalUrl;
    // Otherwise, proxy it through our backend
    return `http://localhost:8000/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
  };

  useEffect(() => {
    // Check for user data in localStorage
    const storedUser = localStorage.getItem('user');
    console.log('Stored user data:', storedUser); // Debug log

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Parsed user data:', parsedUser); // Debug log
        
        if (parsedUser && parsedUser.email) {
          // Validate the picture URL
          if (parsedUser.picture) {
            // Check if the URL is valid
            try {
              new URL(parsedUser.picture);
              // Create a new user object with the proxied picture URL
              const userWithProxiedPicture = {
                ...parsedUser,
                picture: getProxiedProfilePicture(parsedUser.picture)
              };
              setUser(userWithProxiedPicture);
            } catch (e) {
              console.warn('Invalid picture URL:', parsedUser.picture);
              setUser({ ...parsedUser, picture: null });
            }
          } else {
            setUser(parsedUser);
          }
        } else {
          console.warn('Invalid user data format');
          localStorage.removeItem('user');
          localStorage.removeItem('googleToken');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('googleToken');
      }
    }
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('googleToken');
    setUser(null);
    setProfilePictureError(false);
    navigate('/login');
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleProfilePictureError = () => {
    console.warn('Profile picture failed to load');
    setProfilePictureError(true);
  };

  const renderProfileSection = () => {
    if (!user) {
      return (
        <>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <div className="profile-section">
            <FaUserCircle className="profile-icon" />
          </div>
        </>
      );
    }

    return (
      <>
        <Link to="/ProjectsManagement" className='nav-link'>
          My Projects
        </Link>
        <Link to="/settings" className="nav-link">
          Settings
        </Link>
        <Link to="/help" className="nav-link">
          Help
        </Link>
        <div className="profile-section" ref={dropdownRef}>
          <div className="profile-container" onClick={handleProfileClick}>
            {user.picture && !profilePictureError ? (
              <img 
                src={user.picture} 
                alt={user.name || 'User'} 
                className="profile-picture"
                onError={handleProfilePictureError}
                crossOrigin="anonymous"
              />
            ) : (
              <FaUserCircle className="profile-icon" />
            )}
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <span className="profile-name">{user.name || 'User'}</span>
                  <span className="profile-email">{user.email}</span>
                </div>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          TaskFlow
        </Link>
      </div>
      
      <div className="header-right">
        {renderProfileSection()}
      </div>
    </header>
  );
};

export default Header;