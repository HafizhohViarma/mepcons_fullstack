import React from 'react';
import '../../landing.css'; 

const NavUser = () => {
  return (
    <div>
      <header className="header_area">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
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
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavUser;
