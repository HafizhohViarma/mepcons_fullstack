// ModalDetail.js
import React from 'react';
import logo from '../../img/mepcons_metro-logo.png';

const ModalKelas = ({ isOpen, onClose, kelas }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>×</span>
        <img src={logo} alt="Logo" className="modal-logo"/>
        <h3>Detail Kelas</h3>
        <h4>{kelas.judul_kelas}</h4>
        <p>{kelas.deskripsi_kelas}</p>
        <p className="text-danger">{kelas.harga_kelas}</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">Batal</button>
          <button className="btn btn-primary">Beli</button>
        </div>
      </div>
    </div>
  );
};

export default ModalKelas;
