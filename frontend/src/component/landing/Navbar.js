import React, { useEffect } from 'react';
import '../../landing.css'; 
import logo from '../../img/mepcons_metro-logo.png';

const Navbar = () => {
  useEffect(() => {
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
                  <a className="nav-link" href="/landing-page">Beranda</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about-us">Tentang Kami</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#testimoni">Ulasan</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/service-purchased">Saya</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/">Masuk / Daftar</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
