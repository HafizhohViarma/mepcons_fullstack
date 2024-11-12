import React, { useEffect, useState } from 'react';
import '../../landing.css'; 
import logo from '../../img/mepcons_metro-logo.png';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah token login ada di localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn ke true jika token ada

    const handleScroll = () => {
      const header = document.querySelector('.header_area');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Menampilkan alert konfirmasi sebelum logout
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout dari laman ini?");
    if (confirmLogout) {
      // Hapus token dari localStorage saat logout
      localStorage.removeItem('token');
      setIsLoggedIn(false); // Perbarui status login
      window.location.href = '/login'; // Alihkan ke halaman login
    }
  };

  return (
    <div>
      <header className="header_area">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <a className="navbar-brand logo_h" href="index.php">
              <img src={logo} alt="Logo" className="logo-image"/>
            </a>
            <div className="collapse navbar-collapse offset" id="navbarSupportedContent">
              <ul className="nav navbar-nav menu_nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/">Beranda</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about-us">Tentang Kami</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#testimoni">Ulasan</a>
                </li>
                {isLoggedIn && (
                  <li className="nav-item">
                    <a className="nav-link" href="/service-purchased">Saya</a>
                  </li>
                )}
                {isLoggedIn ? (
                  <li className="nav-item">
                    <button className="nav-link" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                ) : (
                  <li className="nav-item">
                    <a className="nav-link" href="/login">Masuk / Daftar</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
