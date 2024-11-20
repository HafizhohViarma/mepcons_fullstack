import React, { useState } from 'react';
import SidebarUser from './SidebarUser'

const Security = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }
    // Simulate sending data to the backend
    console.log('Password updated:', password);
    setMessage('Password updated successfully!');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="dashboard">
        <SidebarUser/>
        <div className="content">
        <div className="content-no-background mt-5">
        <a className="ml-5 mt-5 text-underline" href="/profile"><strong>Profile</strong></a>
          <a className="ml-5 mt-5 text-underline" href="/security"><strong>Security</strong></a>
          <div className="card-profile">
            <div className="card- mt-5">
            <h3 className="text-info">Reset Password</h3>
            <form onSubmit={handleResetPassword}>
                <div className="form-group mt-3">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {message && <p className="text-danger mt-2">{message}</p>}
                <button type="submit" className="btn btn-info mt-3">
                  Reset Password
                </button>
              </form>
            </div>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Security