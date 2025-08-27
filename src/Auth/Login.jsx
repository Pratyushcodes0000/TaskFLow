import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Login.css';

const Login = () => {
  const [loginError, setLoginError] = useState(null);
  const { user, isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google OAuth script only if not logged in
    if (!isAuthenticated) {
      const loadGoogleScript = () => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
          console.log('Google Client ID:', clientId);

          if (!clientId) {
            console.error('Google Client ID is missing. Please check your .env file.');
            setLoginError('Google authentication is not properly configured.');
            return;
          }

          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleLogin,
              auto_select: false,
              cancel_on_tap_outside: true,
              context: 'signin',
              ux_mode: 'popup',
              origin: window.location.origin
            });

            window.google.accounts.id.renderButton(
              document.getElementById('googleButton'),
              { 
                theme: 'outline', 
                size: 'large', 
                width: '100%',
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'center'
              }
            );
          } catch (error) {
            console.error('Error initializing Google Sign-In:', error);
            setLoginError('Failed to initialize Google Sign-In');
          }
        };

        script.onerror = () => {
          console.error('Failed to load Google Sign-In script');
          setLoginError('Failed to load Google Sign-In');
        };
      };

      loadGoogleScript();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoginError(null);
      console.log('Google Token received:', credentialResponse.credential ? 'Yes' : 'No');
      
      // Configure axios defaults
      axios.defaults.withCredentials = true;
      
      // Send token to backend
      const res = await axios.post('http://localhost:8000/api/auth/google', 
        { token: credentialResponse.credential },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      console.log('Server response:', res.data);
      
      if (!res.data || !res.data.user) {
        console.error('Invalid server response:', res.data);
        throw new Error('Invalid response from server');
      }

      const userData = res.data.user;
      console.log("Received user data:", userData);

      // Verify required fields
      if (!userData.name || !userData.email || !userData.picture) {
        console.error('Missing user data fields:', {
          hasName: !!userData.name,
          hasEmail: !!userData.email,
          hasPicture: !!userData.picture
        });
        throw new Error('Missing required user data');
      }

      // Store user data and Google token
      const userDataToStore = {
        name: userData.name,
        email: userData.email,
        picture: userData.picture
      };
      
      localStorage.setItem('googleToken', credentialResponse.credential);
      login(userDataToStore);
      navigate('/');
      
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK') {
        setLoginError('Cannot connect to the server. Please make sure the server is running.');
      } else {
        setLoginError(error.response?.data?.error || 'Login failed. Please try again.');
      }
    }
  };

  if (isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Welcome Back 👋</h1>
          <div className="logged-in-message">
            <p>You are already logged in as:</p>
            <div className="user-info">
              {user?.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="user-avatar"
                />
              )}
              <div className="user-details">
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back 👋</h1>
        <p className="subtitle">Please sign in to continue</p>

        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}

        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div id="googleButton" className="google-signin-button"></div>
        </form>
      </div>
    </div>
  );
};

export default Login;
