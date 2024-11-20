import React, { useEffect, useState } from 'react';
import SidebarUser from './SidebarUser';
import '../../style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ImProfile } from "react-icons/im"; 

const Dashboard = () => {
  const [user, setUser] = useState({});
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Use token for authentication
        });
        setUser(response.data); // Save user data to state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarUser />

      {/* Content Area */}
      <div className="content">
        <div className="content-no-background mt-5">
          <a className="ml-5 mt-5 text-underline" href="/profile"><strong>Profile</strong></a>
          <a className="ml-5 mt-5 text-underline" href="/security"><strong>Security</strong></a>
          <div className="card-profile">
            <div className="card- mt-5">
              <h3 className="text-info"><ImProfile /> Data Diri</h3>
              <label className="mb-1"><strong>Nama</strong></label><br></br>
              <label className="mb-3">{user.nama}</label><br></br>
              <label className="mb-1"><strong>Email</strong></label><br></br>
              <label className="mb-3">{user.email}</label> <br></br>
              <label className="mb-1"><strong>Telpon</strong></label><br></br>
              <label className="mb-3">{user.telp}</label> <br></br>
              <label className="mb-1"><strong>Alamat</strong></label><br></br>
              <label className="mb-3">-</label> <br></br>
              <label className="mb-1"><strong>Pekerjaan</strong></label><br></br>
              <label className="mb-3">-</label> <br></br>

              <Link to="/ubah-profile">
              <button className="button is-primary mt-4">Ubah Profile</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
