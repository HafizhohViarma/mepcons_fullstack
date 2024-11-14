import SidebarList from './SidebarList';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const PageUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/users');
      console.log('Data pengguna:', response.data);
      setUsers(response.data);
      console.log('Data pengguna:', response.data); // Debugging untuk memastikan data benar
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
      await axios.delete(`http://localhost:8082/api/users/${selectedUserId}`);
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


  return (
    <div className="dashboard">
      <SidebarList />

      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Daftar User</h1>

        <div style={{ marginBottom: '20px' }}>
          <Link to="/add-user">
            <button className="button is-primary">+ Add User</button>
          </Link>
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
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id_user}>
                  <td>{index + 1}</td>
                  <td>{user.nama}</td>
                  <td>{user.email}</td>
                  <td>{user.telp}</td>
                  <td>
                    {user.profil ? (
                      <img src={`http://localhost:8082${user.profil}`} alt="Profil" width="50" height="50" />
                    ) : (
                      'Tidak ada'
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
                  > <MdOutlineDelete />
                    Hapus
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

      {/* Modal Konfirmasi Hapus */}
      {showConfirmModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowConfirmModal(false)}></div>
          <div className="modal-content">
            <div className="box">
              <p className="has-text-centered" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', color: 'red', marginRight: '10px' }}>✖️</span> Apakah Anda yakin ingin menghapus video ini?
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

      {/* Modal Sukses Hapus */}
      {showSuccessModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowSuccessModal(false)}></div>
          <div className="modal-content">
            <div className="box has-text-centered">
              <p style={{ fontSize: '1.5rem', color: 'green', marginBottom: '10px' }}>✔️</p>
              <p>Video berhasil dihapus!</p>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowSuccessModal(false)}></button>
        </div>
      )}
    </div>
  );
};

export default PageUser;
