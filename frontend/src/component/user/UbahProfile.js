import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarUser from './SidebarUser'

const UbahProfile = () => {
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        telp: '',
      });
      const [loading, setLoading] = useState(false);
      const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
      const navigate = useNavigate();
    
      useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get(`http://localhost:8082/api/users/${userId}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setFormData({
              nama: response.data.nama,
              email: response.data.email,
              telp: response.data.telp,
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUser();
      }, [userId]);
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await axios.put(
            `http://localhost:8082/api/users/${userId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
          );
          alert('Profile berhasil diperbarui');
          navigate('/profile'); // Redirect to dashboard
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('Terjadi kesalahan saat memperbarui profile');
        } finally {
          setLoading(false);
        }
      };
  return (
    <div className="dashboard">
        <SidebarUser/>
        <div className="content">
        <div className="content-no-background">
          <h2 className="ml-5 mt-5">Profile</h2>
          <div className="card-profile">
            <div className="card- mt-5">
            <h3 className="text-info">Ubah Profile</h3>
      <form onSubmit={handleSubmit} className="form-ubah-profile">
        <div className="form-group">
          <label>Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Telpon</label>
          <input
            type="tel"
            name="telp"
            value={formData.telp}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="button is-primary mt-3" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
            </div>
          </div>
        </div>
        </div>
    </div>
  )
}

export default UbahProfile