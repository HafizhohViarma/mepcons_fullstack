import React, { useState } from 'react';
import { FaKey } from 'react-icons/fa';
import logo from '../img/mepcons_metro-logo.png';
import axios from 'axios';
import '../login.css';
import { useNavigate, useLocation } from 'react-router-dom';

const EnterOTP = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ''; // Get the email from state or fallback to empty

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8082/api/users/verify-otp', {
        email,
        otp,
      });
      setMessage(response.data.message);
      setError('');
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
      setMessage('');
    }
  };

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" />
          <h1>Enter OTP</h1>
          <p className="text-center">We have sent an OTP to your email</p>
          
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error">{error}</p>}

          <div className="input-box">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <FaKey className="icon" />
          </div>

          <button type="submit" className="login-btn">
            Verify OTP
          </button>

          <div className="register-link">
            <p>
              Didn’t receive the OTP?
              <a href="/forgot-password"> Resend</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnterOTP;
