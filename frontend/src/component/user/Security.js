import React, { useState } from 'react';
import SidebarUser from './SidebarUser';
import axios from 'axios';
import { TbPasswordUser } from "react-icons/tb";

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage('');
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match!');
      setMessageType('error');
      return;
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token'); // Adjust based on where you store your token
      
      const response = await axios.post(
        'http://localhost:8082/api/users/change-password', 
        {
          currentPassword,
          newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      setMessageType('success');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
      setMessageType('error');
    }
  };

  return (
    <div className="dashboard">
      <SidebarUser/>
      <div className="content">
        <div className="content-no-background mt-5">
          <a className="ml-5 mt-5 text-underline" href="/profile">
            <strong>Profile</strong>
          </a>
          <a className="ml-5 mt-5 text-underline" href="/security">
            <strong>Security</strong>
          </a>
          <div className="card-profile">
            <div className="card- mt-5">
              <h3 className="text-info"><TbPasswordUser /> Change Password</h3>
              <form onSubmit={handleResetPassword}>
                <div className="form-group mt-3">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                {message && (
                  <p className={`text-${messageType === 'success' ? 'success' : 'danger'} mt-2`}>
                    {message}
                  </p>
                )}
                <button type="submit" className="btn btn-info mt-3">
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;