import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import logo from '../img/mepcons_metro-logo.png';
import google from '../img/google-logo.png';
import '../login.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-body">
      <div className="wrapper">
        <form>
          <img src={logo} alt="Logo" />
          <h1>Register Mepcons</h1>

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

          <div className="divider">or</div>

          <button type="button" className="google-login-btn">
            <img src={google} alt="Google Icon" />
            Register with Google
          </button>

          <div className="login-link">
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
