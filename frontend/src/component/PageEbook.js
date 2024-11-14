import SidebarList from './SidebarList';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const PageEbook = () => {
  const [ebook, setEbook] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedEbookId, setSelectedEbookId] = useState(null);

  useEffect(() => {
    getEbook();
  }, []);

  const getEbook = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/ebooks');
      setEbook(response.data); 
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching ebook:', error); // Tangani error
    }
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


  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarList />

      {/* Content Area */}
      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Daftar E-Book</h1>
        
        {/* Button Add E-Book */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/add-ebook">
            <button className="button is-primary">+ Add E-Book</button>
          </Link>
        </div>

        {/* Tabel Data E-Book */}
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
            {ebook.map((ebook, index) => (
              <tr key={ebook.id_ebook}> 
                <td>{index + 1}</td>
                <td>{ebook.judul_ebook}</td>
                <td>{ebook.deskripsi_ebook}</td>
                <td>
                  <img src={ebook.sampul_ebook} alt="Sampul" width="100" />
                </td>
                <td>
                  <a href={ebook.ebook_file} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </td>
                <td>{formatPrice(ebook.harga_ebook)}</td> 
                <td>
                  <Link to={`/edit-ebook/${ebook.id_ebook}`}>
                    <button className="button is-small is-info mb-2"><FaRegEdit />Edit</button>
                  </Link>
                  <button 
                  onClick={() => handleDeleteClick(ebook.id_ebook)}
                  className="button is-small is-danger"><MdOutlineDelete />Hapus</button>
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
                <span style={{ fontSize: '2rem', color: 'red', marginRight: '10px' }}>✖️</span> Apakah Anda yakin ingin menghapus E-Book ini?
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

      {/* Modal Sukses Hapus */}
      {showSuccessModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowSuccessModal(false)}></div>
          <div className="modal-content">
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
}

export default PageEbook;
