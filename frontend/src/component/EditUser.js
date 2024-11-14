import React, { useState, useEffect } from 'react';
import SidebarList from './SidebarList';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";

const EditUser = () => {
  const { id_user } = useParams(); 
  const navigate = useNavigate();
  
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telp, setTelp] = useState('');
  const [profil, setProfil] = useState(null);
  const [level, setLevel] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserById = async () => {
        try {
            const response = await axios.get(`http://localhost:8082/api/users/${id_user}`);
            const user = response.data;
            setNama(user.nama);
            setEmail(user.email);
            setTelp(user.telp);
            setLevel(user.level);
        } catch (error) {
            setError(error.response ? error.response.data.message : error.message);
            console.error('Gagal mengambil data pengguna:', error);
        }
    };
    getUserById();
}, [id_user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('email', email);
    formData.append('telp', telp);
    formData.append('level', level);
    if (profil) {
      formData.append('profil', profil);
    }

    try {
      await axios.put(`http://localhost:8082/api/users/${id_user}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/user'); // Kembali ke halaman user setelah berhasil update
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      console.error('Gagal memperbarui data pengguna:', error);
    }
  };
  return (
    <div className="dashboard">
        <SidebarList/>

        <div className="content" style={{ padding: '30px' }}>
            <Link to="/user">
            <button className="btn btn-warning"><IoMdArrowBack /> Kembali</button>
            </Link>
            <h2 className="text-center">Edit User</h2>
            {error && <p className="text-danger">Error: {error}</p>}

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-group mb-3">
            <label>Nama</label>
            <input
              type="text"
              className="form-control"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Telp</label>
            <input
              type="text"
              className="form-control"
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Profil</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setProfil(e.target.files[0])}
              accept="image/*"
            />
          </div>
          <div className="form-group mb-3">
            <label>Level</label>
            <select
              className="form-control"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary mt-3">Update User</button>
        </form>
        </div>
    </div>
  )
}

export default EditUser