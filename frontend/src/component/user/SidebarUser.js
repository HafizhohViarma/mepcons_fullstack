    // src/component/SidebarList.js
    import React from 'react';
    import '../../style.css'; 
    import logo from '../../img/mepcons_metro-logo.png';
    import '@fortawesome/fontawesome-free/css/all.min.css';
    import { Link } from 'react-router-dom';

    const SidebarUser = () => {
    return (
        <div className="sidebar">
        <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <ul className="menu">
            <li><i className="fas fa-tachometer-alt"></i><Link to="/service-purchased"> Dashboard </Link></li>
            <li><i className="fas fa-video"></i><Link to="/video-paid"> Video </Link></li> 
            <li><i className="fas fa-book"></i><Link to="/ebook-paid"> Ebook </Link></li>
            <li><i className="fas fa-chalkboard-teacher"></i><Link to="/kelas-paid"> Kelas </Link></li>
            <li><i className="fas fa-sign-out-alt mt-5"></i> Logout</li>
        </ul>
        </div>
    );
    };

    export default SidebarUser;
