import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from the URL's query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const id_user = urlParams.get('id_user');
    const nama = urlParams.get('nama');
    console.log("Token received:", token);
    console.log("userID:", id_user);
    console.log("userName:", nama);

    
    if (token) {
      // Store the token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id_user);
      localStorage.setItem('userName', nama);

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