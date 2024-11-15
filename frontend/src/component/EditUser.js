import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SidebarList from './SidebarList';

const EditUser = () => {
  const { id } = useParams(); // Dapatkan id user dari parameter URL
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    nama: '',
    email: '',
    telp: '',
    level: '',
  });
  
  const [profil, setProfil] = useState(null); // Untuk menyimpan file profil baru
  
  // Mendapatkan data user saat komponen dimuat
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUserData({
          nama: response.data.nama,
          email: response.data.email,
          telp: response.data.telp,
          level: response.data.level
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [id]);

  // Fungsi untuk mengubah data selain profil gambar
  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:8082/api/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("User berhasil diupdate!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Fungsi untuk mengubah profil gambar
  const updateProfilePicture = async () => {
    if (!profil) {
      alert("Pilih gambar untuk diunggah.");
      return;
    }

    const formData = new FormData();
    formData.append('file', profil);

    try {
      await axios.post(`http://localhost:8082/api/users/upload-foto/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert("Profil gambar berhasil diupdate!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  // Menangani perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Menangani unggahan gambar profil
  const handleFileChange = (e) => {
    setProfil(e.target.files[0]);
  };

  // Fungsi untuk submit perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser();
    if (profil) {
      await updateProfilePicture();
    }
    navigate("/user"); // Arahkan kembali ke halaman users setelah update
  };

  return (
    <div className="dashboard">
      <SidebarList />
      <div className="content" style={{ padding: '30px' }}>
        <Link to="/user">
          <button className="btn btn-warning">Kembali</button>
        </Link>
        <h2 className="text-center">Edit User</h2>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="field">
            <label className="label">Nama</label>
            <input
              className="input"
              type="text"
              name="nama"
              value={userData.nama}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label className="label">Email:</label>
            <input
              className="input"
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label className="label">Telepon:</label>
            <input
              className="input"
              type="text"
              name="telp"
              value={userData.telp}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label className="label">Level:</label>
            <select
              className="form-control"
              name="level"
              value={userData.level}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="field">
            <h3>Update Profil Gambar</h3>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button type="submit" className="btn btn-primary mt-3">Update User</button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
