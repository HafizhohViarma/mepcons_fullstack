import React, { useState } from 'react';
import { FaUser, FaUserLock } from "react-icons/fa";
import logo from '../img/mepcons_metro-logo.png';
import google from '../img/google-logo.png';
import '../login.css';
import axios from 'axios'; // import axios untuk HTTP request

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // untuk menyimpan pesan error jika login gagal

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8082/api/users/login', {
        email,
        password
      });

      // Jika login berhasil, simpan token ke local storage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        // Decode token untuk mendapatkan level pengguna
        const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
        const userLevel = decodedToken.level;

        // Periksa level pengguna (admin atau user)
        if (userLevel === 'admin') {
          window.location.href = '/admin'; // Arahkan ke halaman admin
        } else {
          window.location.href = '/'; // Arahkan ke halaman utama (user)
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  }

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" />
          <h1>Login Mepcons</h1>
          {error && <p className="error">{error}</p>} {/* tampilkan pesan error jika ada */}

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
            <a href="/">Forgot Password</a>
          </div>

          <button type="submit" className="login-btn">Login</button>

          <div className="google-login">
            <button className="google-login-btn">
              <img src={google} alt="Google icon" />
              Login with Google
            </button>
          </div>

          <div className="register-link">
            <p>Don't Have an Account?
              <a href="/register"> Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
