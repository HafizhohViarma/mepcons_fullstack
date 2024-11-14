import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import SidebarList from './SidebarList';
import { IoMdArrowBack } from "react-icons/io";

const AddUser = () => {
    const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telp, setTelp] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('');
  const [profil, setProfil] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('email', email);
    formData.append('telp', telp);
    formData.append('password', password);
    formData.append('level', level);
    if (profil) {
      formData.append('profil', profil);
    }

    try {
      await axios.post('http://localhost:8082/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/user');
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="dashboard">
        <SidebarList/>

        <div className="content" style={{ padding: '30px' }}>
            <Link to="/user">
                <button className="button is-warning"><IoMdArrowBack /> Kembali</button>
            </Link>
            <h2 className="text-center">Add User</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="field">
          <label className="label">Nama</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">Telp</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="field">
          <label className="label">Level</label>
          <div className="control">
            <select
              className="input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="">Select Level</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
        
        <div className="field">
          <label className="label">Profil</label>
          <div className="control">
            <input
              type="file"
              className="input"
              onChange={(e) => setProfil(e.target.files[0])}
            />
          </div>
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>
        </div>
    </div>
  )
}

export default AddUser