import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SidebarList from './SidebarList';

const AddEbook = () => {
  const navigate = useNavigate();
  
  const [judulEbook, setJudulEbook] = useState('');
  const [deskripsiEbook, setDeskripsiEbook] = useState('');
  const [sampulEbook, setSampulEbook] = useState(null);
  const [fileEbook, setFileEbook] = useState(null);
  const [hargaEbook, setHargaEbook] = useState('');

  const handleFileChange = (e, type) => {
    if (type === 'sampul') {
      setSampulEbook(e.target.files[0]);
    } else if (type === 'ebook') {
      setFileEbook(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('judul_ebook', judulEbook);
    formData.append('deskripsi_ebook', deskripsiEbook);
    formData.append('harga_ebook', hargaEbook);
    if (sampulEbook) {
      formData.append('sampul_ebook', sampulEbook);
    }
    if (fileEbook) {
      formData.append('ebook_file', fileEbook);
    }

    try {
      await axios.post('http://localhost:8082/api/ebooks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/ebook'); // Arahkan ke halaman daftar e-book setelah berhasil menambah
    } catch (error) {
      console.error('Error adding ebook:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarList />

      <div className="content" style={{ padding: '30px' }}>
        <Link to="/ebook">
          <button className="button is-warning">Kembali</button>
        </Link>
        <h2 className="text-center">Form Tambah E-Book</h2>

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="field">
            <label className="label">Judul E-Book</label>
            <div className="control">
              <input 
                className="input" 
                type="text" 
                value={judulEbook} 
                onChange={(e) => setJudulEbook(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Deskripsi</label>
            <div className="control">
              <textarea 
                className="textarea" 
                value={deskripsiEbook} 
                onChange={(e) => setDeskripsiEbook(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Sampul E-Book</label>
            <div className="control">
              <input 
                className="input" 
                type="file" 
                onChange={(e) => handleFileChange(e, 'sampul')} 
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">File E-Book</label>
            <div className="control">
              <input 
                className="input" 
                type="file" 
                onChange={(e) => handleFileChange(e, 'ebook')} 
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Harga E-Book</label>
            <div className="control">
              <input 
                className="input" 
                type="number" 
                value={hargaEbook} 
                onChange={(e) => setHargaEbook(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button className="button is-primary" type="submit">Tambah E-Book</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEbook;
