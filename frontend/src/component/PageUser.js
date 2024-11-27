import SidebarList from './SidebarList';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const PageUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const BASE_URL = 'http://localhost:8082'; 

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      console.error('Gagal mengambil data pengguna:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedUserId(id);
    setShowConfirmModal(true);
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/users/${selectedUserId}`);
      getUsers();
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfileImageUrl = (profilePath) => {
    if (!profilePath) return null;

    if (profilePath.startsWith('http')) {
      return profilePath;
    }

    return `${BASE_URL}${profilePath}`;
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <SidebarList />

      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Daftar User</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Link to="/add-user">
            <button className="button is-primary">+ Add User</button>
          </Link>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              className="input"
              placeholder="Cari User..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: '300px', marginRight: '10px' }}
            />
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Telp</th>
              <th>Profil</th>
              <th>Level</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id_user}>
                  <td>{index + 1}</td>
                  <td>{user.nama}</td>
                  <td>{user.email}</td>
                  <td>{user.telp}</td>
                  <td>
                    {user.profil ? (
                      <img 
                        src={getProfileImageUrl(user.profil)} 
                        alt="Profil"
                        width="50"
                        height="50"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png'; // Add a default avatar image
                        }}
                      />
                    ) : (
                      <span>Tidak ada</span>
                    )}
                  </td>
                  <td>{user.level}</td>
                  <td>
                    <Link to={`/edit-user/${user.id_user}`}>
                      <button className="button is-small is-info mr-2"><FaRegEdit /> Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(user.id_user)}
                      className="button is-small is-danger"
                    >
                      <MdOutlineDelete /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Tidak ada data pengguna</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals remain unchanged */}
      {showConfirmModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowConfirmModal(false)}></div>
          <div className="modal-content">
            <div className="box">
              <p className="has-text-centered" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', color: 'red', marginRight: '55px' }}>✖️</span> Apakah Anda yakin ingin menghapus user ini?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setShowConfirmModal(false)} className="button">Batal</button>
                <button onClick={deleteUser} className="button is-danger">Hapus</button>
              </div>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowConfirmModal(false)}></button>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowSuccessModal(false)}></div>
          <div className="modal-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="box has-text-centered">
              <p style={{ fontSize: '1.5rem', color: 'green', marginBottom: '10px' }}>✔️</p>
              <p>User berhasil dihapus!</p>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowSuccessModal(false)}></button>
        </div>
      )}
    </div>
  );
};

export default PageUser;
