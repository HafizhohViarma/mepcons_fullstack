import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import logo from '../img/mepcons_metro-logo.png';
import axios from 'axios';
import '../login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8082/api/users/reset-password', {
        email: location.state.email,
        newPassword: password,
      });
      setMessage(response.data.message);
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setMessage('');
    }
  };

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" />
          <h1>Reset Password</h1>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error">{error}</p>}

          <div className="input-box">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          <button type="submit" className="login-btn">
            Reset Password
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

export default ResetPassword;
