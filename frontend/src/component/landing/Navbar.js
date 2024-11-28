import React, { useEffect, useState } from 'react';
import '../../landing.css'; 
import logo from '../../img/mepcons_metro-logo.png';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Set initial state to an empty string
  const [loading, setLoading] = useState(true); // For handling loading state
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  console.log('User ID:', userId); 
  console.log('Token:', token); 
  console.log('Username:', userName); 

  useEffect(() => {
    // Cek apakah token login ada di localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists

    if (token && userId) {
      // Fetch user details from API based on userId
      axios.get(`http://localhost:8082/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token for authentication
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => setLoading(false)); // Stop loading after API request completes
    } else {
      setLoading(false); // Stop loading if no token or userId
    }

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
  }, [userId]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header className="header_area">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <a className="navbar-brand logo_h" href="/">
              <img src={logo} alt="Logo" className="logo-image"/>
            </a>
            
            <button 
              className="navbar-toggler" 
              type="button" 
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
              <ul className="nav navbar-nav menu_nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/" onClick={() => setIsMenuOpen(false)}>
                    Beranda
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about-us" onClick={() => setIsMenuOpen(false)}>
                    Tentang Kami
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#testimoni" onClick={() => setIsMenuOpen(false)}>
                    Ulasan
                  </a>
                </li>
                {isLoggedIn && !loading ? (
                  <li className="nav-item">
                    <a className="nav-link" href="/profile/" onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </a>
                  </li>
                ) : (
                  <li className="nav-item">
                    <a className="nav-link" href="/login" onClick={() => setIsMenuOpen(false)}>
                      Masuk / Daftar
                    </a>
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