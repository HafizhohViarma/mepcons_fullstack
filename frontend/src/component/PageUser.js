import SidebarList from './SidebarList';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PageUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/users');
      setUsers(response.data);
      console.log('Data pengguna:', response.data); // Debugging untuk memastikan data benar
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      console.error('Gagal mengambil data pengguna:', error);
    }
  };

  return (
    <div className="dashboard">
      <SidebarList />

      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Daftar User</h1>

        <div style={{ marginBottom: '20px' }}>
          <button className="button is-primary">Add User</button>
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
                      <button className="button is-small is-info">Edit</button>
                    </Link>
                    <button className="button is-small is-danger">Hapus</button>
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
    </div>
  );
};

export default PageUser;
