import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import logo from '../img/mepcons_metro-logo.png';
import google from '../img/google-logo.png';
import '../login.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();  // Initialize navigate function

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8082/api/users/register', {
        nama: fullName,
        email: email,
        telp: phone,
        password: password,
        level: 'user'  // Pastikan level defaultnya adalah 'user'
      });
      setSuccess('Pendaftaran berhasil. Silakan login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError('Pendaftaran gagal. ' + (err.response?.data?.message || 'Coba lagi.'));
      setSuccess('');
    }
  };

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleRegister}>
          <img src={logo} alt="Logo" />
          <h1>Register Mepcons</h1>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div className="input-box">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <FaPhone className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          <button type="submit">Register</button>

          <div className="divider text-center">or</div>

          <button type="button" className="google-login-btn">
            <img src={google} alt="Google Icon" />
            Register with Google
          </button>

          <div className="login-link mt-2">
            <p>Already have an account?
              <a href="/"> Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
