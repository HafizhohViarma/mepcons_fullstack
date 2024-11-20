    // src/component/SidebarList.js
    import React from 'react';
    import '../../style.css'; 
    import logo from '../../img/mepcons_metro-logo.png';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import { Link, useNavigate  } from 'react-router-dom';

    const SidebarUser = () => {
        const navigate = useNavigate();
        const handleLogout = () => {
            // Menampilkan konfirmasi logout
            const isConfirmed = window.confirm('Apakah Anda yakin ingin logout?');
            if (isConfirmed) {
              // Hapus data user dari localStorage jika konfirmasi OK
              localStorage.removeItem('userId');
              localStorage.removeItem('token'); // Jika ada token yang disimpan
        
              // Arahkan ke halaman home (/)
              navigate('/');
            }
          };
    return (
        <div className="sidebar">
        <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <ul className="menu">
            <li><i className="fas fa-user"></i><Link to="/profile"> Profile </Link></li>
            <li><i className="fas fa-video"></i><Link to="/video-paid"> Video Saya</Link></li> 
            <li><i className="fas fa-book"></i><Link to="/ebook-paid"> Ebook Saya</Link></li>
            <li><i className="fas fa-chalkboard-teacher"></i><Link to="/kelas-paid"> Kelas Saya</Link></li>
            <li><i className="fas fa-credit-card"></i><Link to="/payment">Pembayaran</Link></li>
            <li onClick={handleLogout} className="logout-button">
                <i className="fas fa-sign-out-alt"></i> Logout
            </li>
        </ul>
        </div>
    );
    };

    export default SidebarUser;
