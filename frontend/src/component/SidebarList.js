// src/component/SidebarList.js
import React from 'react';
import '../style.css'; 
import logo from '../img/mepcons_metro-logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';

const SidebarList = () => {
  const navigate = useNavigate(); // Mendapatkan fungsi navigate

  const handleLogout = () => {
    // Menampilkan alert konfirmasi sebelum logout
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (confirmLogout) {
      // Hapus token dari localStorage saat logout
      localStorage.removeItem('token');
      // Mengarahkan ke halaman login setelah logout
      navigate('/login');
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <ul className="menu">
        <li><i className="fas fa-tachometer-alt"></i><Link to="/admin"> Dashboard </Link></li>
        <li><i className="fas fa-video"></i><Link to="/video"> Video </Link></li> 
        <li><i className="fas fa-book"></i><Link to="/ebook"> Ebook </Link></li>
        <li><i className="fas fa-chalkboard-teacher"></i><Link to="/kelas"> Kelas </Link></li>
        <li><i className="fas fa-users"></i><Link to="/user"> User </Link></li>
        <li><i className="fas fa-comment-dots"></i><Link to="/testimoni"> Testimoni </Link></li>
        <li><i className="fas fa-shopping-cart"></i><Link to="/transaksi"> Transaksi </Link></li>
        <li>
          <i className="fas fa-sign-out-alt" onClick={handleLogout}></i> 
          <span style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default SidebarList;
