import React, { useState, useEffect } from 'react';
import '../../style.css';
import logo from '../../img/mepcons_metro-logo.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileImageUpload from './ProfileImageUpload';

const SidebarUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ nama: '', email: '', profil: '' });
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState('/default-avatar.png');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const userName = localStorage.getItem('userName'); 

    const getProfileImageUrl = (profilePath) => {
        if (!profilePath || profilePath === 'null') return '/default-avatar.png';
        if (profilePath.startsWith('http')) return profilePath;
        return `http://localhost:8082${profilePath}`;
    };

    const handleImageUpdate = (newImageUrl) => {
        setProfileImage(newImageUrl);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) {
                navigate('/');
                return;
            }
            try {
                const response = await axios.get('http://localhost:8082/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                    'User-ID': userId
                });
                const userData = response.data;
                setUser({
                    nama: userData.nama || userName,
                    email: userData.email,
                    profil: userData.profil
                });
                setProfileImage(getProfileImageUrl(userData.profil));
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                try {
                    const fallbackResponse = await axios.get(`http://localhost:8082/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser({
                        nama: fallbackResponse.data.nama || userName,
                        email: fallbackResponse.data.email,
                        profil: fallbackResponse.data.profil
                    });
                    setProfileImage(getProfileImageUrl(fallbackResponse.data.profil));
                } catch (fallbackError) {
                    console.error('Fallback fetch failed:', fallbackError);
                    setUser({
                        nama: userName || 'User',
                        email: 'Loading...',
                        profil: '/default-avatar.png'
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate, userName]);

    const handleLogout = () => {
        const isConfirmed = window.confirm('Apakah Anda yakin ingin logout?');
        if (isConfirmed) {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (loading) return <div className="sidebar"><div className="loading-spinner">Loading...</div></div>;

    return (
        <>
            {isMobile && (
                <div className={`hamburger-toggle ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
                    <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
            )}

            <div className={`sidebar-user ${isSidebarOpen ? 'active' : ''}`}>
                <div className="logo-user">
                    <img src={logo} alt="Logo" className="logo-image-user" />
                </div>
                <div className="user-profile">
                    <div className="user-avatar">
                        <ProfileImageUpload 
                            currentImage={profileImage}
                            onImageUpdate={handleImageUpdate}
                        />
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user.nama || 'User'}</div>
                        <div className="user-email">{user.email || 'Loading...'}</div>
                    </div>
                </div>
                <ul className="menu-user">
                    <li onClick={() => setIsSidebarOpen(false)}><i className="fas fa-user"></i><Link to="/profile">Profile</Link></li>
                    <li onClick={() => setIsSidebarOpen(false)}><i className="fas fa-video"></i><Link to="/video-paid">Video Saya</Link></li>
                    <li onClick={() => setIsSidebarOpen(false)}><i className="fas fa-book"></i><Link to="/ebook-paid">Ebook Saya</Link></li>
                    <li onClick={() => setIsSidebarOpen(false)}><i className="fas fa-chalkboard-teacher"></i><Link to="/kelas-paid">Kelas Saya</Link></li>
                    <li onClick={() => setIsSidebarOpen(false)}><i className="fas fa-credit-card"></i><Link to="/payment">Pembayaran</Link></li>
                    <li onClick={handleLogout} className="logout-button">
                        <i className="fas fa-sign-out-alt mr-5"></i> Logout
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SidebarUser;