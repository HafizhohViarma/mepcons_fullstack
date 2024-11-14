import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SidebarList from './SidebarList';
import { IoMdArrowBack } from "react-icons/io";

const EditEbook = () => {
  const { id } = useParams(); // Get the ebook ID from the URL
  const navigate = useNavigate();

  const [judulEbook, setJudulEbook] = useState('');
  const [deskripsiEbook, setDeskripsiEbook] = useState('');
  const [sampulEbook, setSampulEbook] = useState(null);
  const [fileEbook, setFileEbook] = useState(null);
  const [hargaEbook, setHargaEbook] = useState('');

  // Wrap the function in useCallback to memoize it
  const getEbookById = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/ebooks/${id}`);
      const ebookData = response.data;
      setJudulEbook(ebookData.judul_ebook);
      setDeskripsiEbook(ebookData.deskripsi_ebook);
      setHargaEbook(ebookData.harga_ebook);
      // Optionally set the sampul and file if needed for display
    } catch (error) {
      console.error('Error fetching ebook:', error);
    }
  }, [id]); // Add id as a dependency

  useEffect(() => {
    getEbookById();
  }, [getEbookById]); // Use the memoized function here

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
      await axios.put(`http://localhost:8082/api/ebooks/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/ebook'); // Redirect to the ebook list after editing
    } catch (error) {
      console.error('Error updating ebook:', error);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarList />

      <div className="content" style={{ padding: '30px' }}>
        <Link to="/ebook">
          <button className="button is-warning"><IoMdArrowBack /> Kembali</button>
        </Link>
        <h2 className="text-center">Form Edit E-Book</h2>

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
              <button className="button is-primary" type="submit">Update E-Book</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEbook;
