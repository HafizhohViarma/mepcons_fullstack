import SidebarList from './SidebarList'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io'

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telp: '',
    password: '',
    level: 'user'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Membuat FormData untuk menggabungkan data pengguna dan file
        const formDataToSend = new FormData();
        formDataToSend.append('nama', formData.nama);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('telp', formData.telp);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('level', formData.level);

        // Menambahkan foto profil jika ada
        if (profileImage) {
            formDataToSend.append('file', profileImage);
        }

        // Mengirimkan form data ke server
        const response = await fetch('http://localhost:8082/api/users/register', {
            method: 'POST',
            body: formDataToSend, // Mengirimkan formData yang berisi data pengguna dan file
        });

        if (response.ok) {
            const data = await response.json();
            console.log('User created:', data.user);
            navigate('/user');  // Redirect ke halaman user setelah sukses
        } else {
            const data = await response.json();
            setError(data.message); // Menampilkan error jika gagal
        }
    } catch (error) {
        setError('Terjadi kesalahan: ' + error.message);
    }
};

  return (
    <div className="dashboard">
      <SidebarList />
      <div className="content" style={{ padding: '30px' }}>
        <Link to="/user">
          <button className="btn btn-warning"><IoMdArrowBack /> Kembali</button>
        </Link>
        <h2 className="text-center">Add User</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nama">Nama</label>
            <input
              type="text"
              className="form-control"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telp">Telepon</label>
            <input
              type="text"
              className="form-control"
              id="telp"
              name="telp"
              value={formData.telp}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select
              className="form-control"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="profil">Foto Profil</label>
            <input
              type="file"
              className="form-control-file"
              id="profil"
              name="profil"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Simpan
          </button>
        </form>
    </div>
    </div>
  )
}

export default AddUser
