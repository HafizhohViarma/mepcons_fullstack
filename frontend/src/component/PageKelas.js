import SidebarList from './SidebarList';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const PageKelas = () => {
  const [kelas, setKelas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedKelasId, setSelectedKelasId] = useState(null);

  useEffect(() => {
    getKelas();
  }, []);

  const getKelas = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/kelas');
      setKelas(response.data); 
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching class:', error); 
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedKelasId(id);
    setShowConfirmModal(true);
  };

  const deleteKelas = async () => {
    try {
      await axios.delete(`http://localhost:8082/api/kelas/${selectedKelasId}`);
      getKelas();
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      // Set a timeout to close the success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
      
    } catch (error) {
      console.log(error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredKelas = kelas.filter((kelasItem) =>
    kelasItem.judul_kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kelasItem.deskripsi_kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarList />

      {/* Content Area */}
      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Daftar Kelas</h1>
        
        {/* Button and Search Bar Container */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          {/* Add Kelas Button */}
          <Link to="/add-kelas">
            <button className="button is-primary">+ Add Kelas</button>
          </Link>

          {/* Search Input */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              className="input"
              placeholder="Cari Kelas..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: '300px', marginRight: '10px' }}
            />
          </div>
        </div>
        
        {/* Tabel Data Kelas */}
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Deskripsi</th>
              <th>Sampul</th>
              <th>Jadwal</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredKelas.map((kelas, index) => (
              <tr key={kelas.id_kelas}> 
                <td>{index + 1}</td>
                <td>{kelas.judul_kelas}</td>
                <td>{kelas.deskripsi_kelas}</td>
                <td>
                  <img src={kelas.sampul_kelas} alt="Sampul" width="100" />
                </td>
                <td>{kelas.jadwal}</td> 
                <td>{formatPrice(kelas.harga_kelas)}</td> 
                <td>
                  <Link to={`/edit-kelas/${kelas.id_kelas}`}>
                    <button className="button is-small is-info mb-2"><FaRegEdit /> Edit</button>
                  </Link>
                  <button 
                    onClick={() => handleDeleteClick(kelas.id_kelas)}
                    className="button is-small is-danger"><MdOutlineDelete /> Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showConfirmModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowConfirmModal(false)}></div>
          <div className="modal-content">
            <div className="box">
              <p className="has-text-centered" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', color: 'red', marginRight: '55px' }}>✖️</span> Apakah Anda yakin ingin menghapus kelas ini?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setShowConfirmModal(false)} className="button">Batal</button>
                <button onClick={deleteKelas} className="button is-danger">Hapus</button>
              </div>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowConfirmModal(false)}></button>
        </div>
      )}

      {/* Modal Sukses Hapus */}
      {showSuccessModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowSuccessModal(false)}></div>
          <div className="modal-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="box has-text-centered">
              <p style={{ fontSize: '1.5rem', color: 'green', marginBottom: '10px' }}>✔️</p>
              <p>Kelas berhasil dihapus!</p>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowSuccessModal(false)}></button>
        </div>
      )}
    </div>
  );
};

export default PageKelas;
