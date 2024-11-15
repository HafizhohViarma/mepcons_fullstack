import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from the URL's query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log("Token received:", token);

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token);
      // Navigate to the landing page
      navigate('/');
    } else {
      // If no token is found, navigate back to login
      navigate('/');
    }
  }, [navigate]);

  return <p>Authenticating...</p>;
};

export default AuthSuccess;