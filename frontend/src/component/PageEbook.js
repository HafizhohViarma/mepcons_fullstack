import SidebarList from './SidebarList';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const PageEbook = () => {
  const [ebook, setEbook] = useState([]);
  const [filteredEbook, setFilteredEbook] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedEbookId, setSelectedEbookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filterEbook = useCallback(() => {
    const filtered = ebook.filter(e =>
      e.judul_ebook.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.deskripsi_ebook.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEbook(filtered);
  }, [searchQuery, ebook]);

  useEffect(() => {
    getEbook();
  }, []);

  useEffect(() => {
    filterEbook(); 
  }, [filterEbook]); 

  const getEbook = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/ebooks');
      setEbook(response.data);
      setFilteredEbook(response.data);
    } catch (error) {
      console.error('Error fetching ebook:', error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (id) => {
    setSelectedEbookId(id);
    setShowConfirmModal(true);
  };

  const deleteEbook = async () => {
    try {
      await axios.delete(`http://localhost:8082/api/ebooks/${selectedEbookId}`);
      getEbook();
      setShowConfirmModal(false);
      setShowSuccessModal(true);

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

  return (
    <div className="dashboard">
      <SidebarList />

      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Daftar E-Book</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link to="/add-ebook">
            <button className="button is-primary">+ Add E-Book</button>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              className="input"
              placeholder="Search e-books..."
              style={{ marginRight: '10px' }}
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>

        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Deskripsi</th>
              <th>Sampul</th>
              <th>File E-Book</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredEbook.map((e, index) => (
              <tr key={e.id_ebook}>
                <td>{index + 1}</td>
                <td>{e.judul_ebook}</td>
                <td>{e.deskripsi_ebook}</td>
                <td>
                  <img src={e.sampul_ebook} alt="Sampul" width="100" />
                </td>
                <td>
                  <a href={e.ebook_file} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </td>
                <td>{formatPrice(e.harga_ebook)}</td>
                <td>
                  <Link to={`/edit-ebook/${e.id_ebook}`}>
                    <button className="button is-small is-info mb-2"><FaRegEdit /> Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(e.id_ebook)}
                    className="button is-small is-danger"
                  >
                    <MdOutlineDelete /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowConfirmModal(false)}></div>
          <div className="modal-content">
            <div className="box">
              <p className="has-text-centered" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', color: 'red', marginRight: '55px' }}>✖️</span> Apakah Anda yakin ingin menghapus E-Book ini?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setShowConfirmModal(false)} className="button">Batal</button>
                <button onClick={deleteEbook} className="button is-danger">Hapus</button>
              </div>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowConfirmModal(false)}></button>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={()=> setShowSuccessModal(false)}></div>
          <div className="modal-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="box has-text-centered">
              <p style={{ fontSize: '1.5rem', color: 'green', marginBottom: '10px' }}>✔️</p>
              <p>E-Book berhasil dihapus!</p>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowSuccessModal(false)}></button>
        </div>
      )}
    </div>
  );
};

export default PageEbook;
