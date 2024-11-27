import React, { useState, useEffect } from 'react';
import { FaUser, FaUserLock } from 'react-icons/fa';
import logo from '../img/mepcons_metro-logo.png';
import google from '../img/google-logo.png';
import '../login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Effect untuk menangani redirect dari Google OAuth
  useEffect(() => {
    const handleGoogleAuthRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const id_user = urlParams.get('id_user');
      const nama = urlParams.get('nama');
      const level = urlParams.get('level');

      if (token && id_user && nama && level) {
        // Simpan informasi ke localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', id_user);
        localStorage.setItem('userName', nama);
        localStorage.setItem('userLevel', level);

        // Hapus parameter query dari URL
        window.history.replaceState({}, document.title, "/login");

        // Redirect berdasarkan level user
        if (level === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }
    };

    handleGoogleAuthRedirect();
  }, []);

  // Handler untuk login biasa
  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8082/api/users/login', {
        email,
        password,
      });

      if (response.data.token) {
        // Decode token untuk mendapatkan informasi user
        const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
        
        // Simpan token dan informasi user ke localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', decodedToken.id);
        localStorage.setItem('userName', decodedToken.nama);
        localStorage.setItem('userLevel', decodedToken.level);

        // Redirect berdasarkan level user
        if (decodedToken.level === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }

  // Handler untuk login Google
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8082/auth/google';
  };

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" />
          <h1>Login Mepcons</h1>
          {error && <p className="error">{error}</p>}

          <div className="input-box">
            <input 
              type="text" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <FaUserLock className="icon" />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/forgot-password">Forgot Password</a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="google-login">
            <button 
              type="button" 
              className="google-login-btn" 
              onClick={handleGoogleLogin}
            >
              <img src={google} alt="Google icon" />
              Login with Google
            </button>
          </div>

          <div className="register-link">
            <p>
              Don't Have an Account?
              <a href="/register"> Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;