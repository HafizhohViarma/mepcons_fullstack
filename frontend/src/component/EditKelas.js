import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SidebarList from './SidebarList';
import { IoMdArrowBack } from "react-icons/io";

const EditKelas = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [judulKelas, setJudulKelas] = useState('');
  const [deskripsiKelas, setDeskripsiKelas] = useState('');
  const [sampulKelas, setSampulKelas] = useState(null);
  const [sampulKelasPreview, setSampulKelasPreview] = useState(null);
  const [jadwal, setJadwal] = useState('');
  const [hargaKelas, setHargaKelas] = useState('');

  const getKelasById = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/kelas/${id}`);
      const kelasData = response.data;
      setJudulKelas(kelasData.judul_kelas);
      setDeskripsiKelas(kelasData.deskripsi_kelas);
      setJadwal(kelasData.jadwal);
      setHargaKelas(kelasData.harga_kelas);
      setSampulKelasPreview(kelasData.sampul_kelas); // Set preview URL dari data yang ada
    } catch (error) {
      console.error('Error fetching kelas details:', error);
    }
  }, [id]);

  useEffect(() => {
    getKelasById();
  }, [getKelasById]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSampulKelas(file);
    setSampulKelasPreview(URL.createObjectURL(file)); // Tampilkan preview dari file yang baru dipilih
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('judul_kelas', judulKelas);
    formData.append('deskripsi_kelas', deskripsiKelas);
    formData.append('jadwal', jadwal);
    formData.append('harga_kelas', hargaKelas);
    if (sampulKelas) {
      formData.append('sampul_kelas', sampulKelas);
    }

    try {
      await axios.put(`http://localhost:8082/api/kelas/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/kelas');
    } catch (error) {
      console.error('Error updating kelas:', error);
    }
  };

  return (
    <div className="dashboard">
      <SidebarList />

      <div className="content" style={{ padding: '30px' }}>
        <Link to="/kelas">
          <button className="button is-warning"><IoMdArrowBack /> Kembali</button>
        </Link>
        <h2 className="text-center">Form Edit Kelas</h2>

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="field">
            <label className="label">Judul Kelas</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={judulKelas}
                onChange={(e) => setJudulKelas(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Deskripsi</label>
            <div className="control">
              <textarea
                className="textarea"
                value={deskripsiKelas}
                onChange={(e) => setDeskripsiKelas(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Sampul Kelas</label>
            <div className="control">
              <input className="input" type="file" onChange={handleFileChange} />
            </div>
            {sampulKelasPreview && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={sampulKelasPreview}
                  alt="Sampul Preview"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          <div className="field">
            <label className="label">Jadwal</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={jadwal}
                onChange={(e) => setJadwal(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Harga Kelas</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={hargaKelas}
                onChange={(e) => setHargaKelas(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button className="button is-primary" type="submit">Update Kelas</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditKelas;
