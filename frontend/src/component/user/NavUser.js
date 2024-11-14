import React, { useState, useRef, useEffect } from 'react';
import '../../style.css';

const NavUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(prevState => !prevState);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-user">
      <nav className="navbar-user-container">
        <div className="navbar-user-logo">
          <h2>Dashboard</h2>
        </div>
        
        <div className="navbar-right" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="user-button">
            User
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/logout">Logout</a></li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavUser;
