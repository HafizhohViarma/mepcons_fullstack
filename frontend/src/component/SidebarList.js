import React, { useState } from 'react';
import '../style.css';
import logo from '../img/mepcons_metro-logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';

const SidebarList = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`hamburger-toggle ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
        <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isSidebarOpen ? 'active' : ''}`}>
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <ul className="menu">
          <li>
            <Link to="/admin">
              <i className="fas fa-tachometer-alt"></i>
              <span className="menu-text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/video">
              <i className="fas fa-video"></i>
              <span className="menu-text">Video</span>
            </Link>
          </li>
          <li>
            <Link to="/ebook">
              <i className="fas fa-book"></i>
              <span className="menu-text">Ebook</span>
            </Link>
          </li>
          <li>
            <Link to="/kelas">
              <i className="fas fa-chalkboard-teacher"></i>
              <span className="menu-text">Kelas</span>
            </Link>
          </li>
          <li>
            <Link to="/user">
              <i className="fas fa-users"></i>
              <span className="menu-text">User</span>
            </Link>
          </li>
          <li>
            <Link to="/testimoni">
              <i className="fas fa-comment-dots"></i>
              <span className="menu-text">Testimoni</span>
            </Link>
          </li>
          <li>
            <Link to="/transaksi">
              <i className="fas fa-shopping-cart"></i>
              <span className="menu-text">Transaksi</span>
            </Link>
          </li>
          <li onClick={handleLogout} className="ml-5">
            <i className="fas fa-sign-out-alt"></i>
            <span className="menu-text">Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarList;