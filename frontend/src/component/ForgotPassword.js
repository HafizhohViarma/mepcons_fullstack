import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import logo from '../img/mepcons_metro-logo.png';
import axios from 'axios';
import '../login.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8082/api/users/request-reset-password', {
        email,
      });
      setMessage(response.data.message);
      setError('');
      navigate('/enter-otp', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request');
      setMessage('');
    }
  };

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" />
          <h1>Enter Your Email</h1>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error">{error}</p>}

          <div className="input-box">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <FaEnvelope className="icon" />
          </div>

          <button type="submit" className="login-btn">
            Enter OTP
          </button>

          <div className="register-link">
            <p>
              Remember your password?
              <a href="/login"> Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;