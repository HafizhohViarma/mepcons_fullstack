import React, { useState } from 'react';
import SidebarList from './SidebarList';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Menggunakan useNavigate dan Link
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoMdArrowBack } from "react-icons/io";

const AddTestimoni = () => {
  const [namaPeserta, setNamaPeserta] = useState('');
  const [testimoni, setTestimoni] = useState('');
  const [sampul, setSampul] = useState(null);
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nama_peserta', namaPeserta);
    formData.append('testimoni', testimoni);
    if (sampul) {
      formData.append('sampul', sampul);
    }

    try {
      await axios.post('http://localhost:8082/api/testimoni', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/testimoni'); // Mengarahkan pengguna ke halaman testimoni setelah pengiriman berhasil
    } catch (error) {
      console.error('Error creating testimoni:', error);
    }
  };

  return (
    <div className="dashboard">
      <SidebarList />
      <div className="content" style={{ padding: '30px' }}>
        <Link to="/testimoni">
          <button className="btn btn-warning"><IoMdArrowBack /> Kembali</button>
        </Link>
        <h2 className="text-center">Add Testimoni</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-group">
            <label>Nama Peserta</label>
            <input
              type="text"
              className="form-control"
              value={namaPeserta}
              onChange={(e) => setNamaPeserta(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Testimoni</label>
            <textarea
              className="form-control"
              value={testimoni}
              onChange={(e) => setTestimoni(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Sampul</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setSampul(e.target.files[0])}
              accept="image/*"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">+ Add Testimoni</button>
        </form>
      </div>
    </div>
  );
};

export default AddTestimoni;
