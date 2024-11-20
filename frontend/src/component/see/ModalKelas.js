import React from 'react';
import logo from '../../img/mepcons-blue.png';
import { FaSquareCheck, FaShopify } from "react-icons/fa6";

const ModalKelas = ({ isOpen, onClose, kelas }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePurchase = async () => {
    const idUser = localStorage.getItem('userId');  
    console.log('User ID:', idUser);
  
    if (!idUser) {
      alert('Anda perlu login untuk melanjutkan pembelian.');
      window.location.href = '/login'; 
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8082/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: idUser, // Gunakan ID user yang valid
          id_kelas: kelas.id_kelas,
          tipe_produk: 'kelas',
          harga: kelas.harga_kelas,
          payment: 'midtrans',
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        // Redirect ke URL Midtrans
        window.location.href = result.payment_url;
      } else {
        console.error('Gagal membuat transaksi:', result.message);
        alert('Transaksi gagal. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error saat membuat transaksi:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>×</span>
        <img src={logo} alt="Logo" className="modal-logo" />
        <h2 className='fw-bold'>{kelas.judul_kelas}</h2>
        <p>Jadwal : {kelas.jadwal}</p><br></br>
        <p>{kelas.deskripsi_kelas}</p><br></br>

        <p><FaSquareCheck /> Video Playback</p>
        <p><FaSquareCheck /> E-Certificate</p>
        <p><FaSquareCheck /> Free Konsultasi Pasca Training</p>

        <br>
        </br>

        {/* Harga yang berada di kiri */}
        <p className="text-danger">{formatPrice(kelas.harga_kelas)}</p>

        {/* Tombol Batal dan Beli sejajar */}
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">Batal</button>
          <button className="btn btn-primary" onClick={handlePurchase}><FaShopify /> Beli</button>
        </div>
      </div>
    </div>
  );
};

export default ModalKelas;
