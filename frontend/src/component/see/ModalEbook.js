import React from 'react';
import logo from '../../img/mepcons-blue.png';
import { FaSquareCheck, FaShopify } from "react-icons/fa6";

const ModalEbook = ({ isOpen, onClose, e }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>×</span>
        <img src={logo} alt="Logo" className="modal-logo" />
        <h2 className='fw-bold'>{e.judul_ebook}</h2>
        <p>{e.deskripsi_ebook}</p><br></br>

        <p><FaSquareCheck /> Video Playback</p>
        <p><FaSquareCheck /> E-Certificate</p>
        <p><FaSquareCheck /> Free Konsultasi Pasca Training</p>

        <br>
        </br>

        {/* Harga yang berada di kiri */}
        <p className="text-danger">{formatPrice(e.harga_ebook)}</p>

        {/* Tombol Batal dan Beli sejajar */}
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">Batal</button>
          <button className="btn btn-primary"><FaShopify /> Beli</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEbook;
