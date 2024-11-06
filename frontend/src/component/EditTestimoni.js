import React, { useState, useEffect } from 'react';
import SidebarList from './SidebarList';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditTestimoni = () => {
  const [namaPeserta, setNamaPeserta] = useState('');
  const [testimoni, setTestimoni] = useState('');
  const [sampul, setSampul] = useState(null);
  const [existingSampul, setExistingSampul] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Mengambil id dari URL

  useEffect(() => {
    const fetchTestimoni = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/testimoni/${id}`);
        const data = response.data;
        setNamaPeserta(data.nama_peserta);
        setTestimoni(data.testimoni);
        setExistingSampul(data.sampul); // Misalkan data.sampul adalah URL gambar yang ada
      } catch (error) {
        console.error('Error fetching testimoni:', error);
      }
    };
    
    fetchTestimoni();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nama_peserta', namaPeserta);
    formData.append('testimoni', testimoni);
    if (sampul) {
      formData.append('sampul', sampul);
    }

    try {
      await axios.put(`http://localhost:8082/api/testimoni/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/testimoni'); // Mengarahkan pengguna ke halaman testimoni setelah pembaruan berhasil
    } catch (error) {
      console.error('Error updating testimoni:', error);
    }
  };

  return (
    <div className="dashboard">
      <SidebarList />
      <div className="content" style={{ padding: '30px' }}>
        <Link to="/testimoni">
          <button className="btn btn-warning">Kembali</button>
        </Link>
        <h2 className="text-center">Edit Testimoni</h2>
        <form onSubmit={handleSubmit}>
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
            />
            {existingSampul && (
              <img src={existingSampul} alt="Sampul Testimoni" style={{ width: '100px', marginTop: '10px' }} />
            )}
          </div>
          <button type="submit" className="btn btn-primary mt-3">Update Testimoni</button>
        </form>
      </div>
    </div>
  );
};

export default EditTestimoni;
