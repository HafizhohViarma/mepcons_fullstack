import React from 'react';
import logo from '../../img/mepcons-blue.png';
import { FaSquareCheck, FaShopify } from "react-icons/fa6";

const ModalVideo = ({ isOpen, onClose, videos }) => {
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
    const userName = localStorage.getItem('userName'); 
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
          id_video: videos.id_video,
          tipe_produk: 'video',
          harga: videos.harga_video,
          payment: 'midtrans',
          nama: userName,
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
        <h2 className='fw-bold'>{videos.judul_video}</h2>
        <p>{videos.keterangan_video}</p><br></br>

        <p><FaSquareCheck /> Video Playback</p>
        <p><FaSquareCheck /> E-Certificate</p>
        <p><FaSquareCheck /> Free Konsultasi Pasca Training</p>

        <br>
        </br>

        {/* Harga yang berada di kiri */}
        <p className="text-danger">{formatPrice(videos.harga_video)}</p>

        {/* Tombol Batal dan Beli sejajar */}
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">Batal</button>
          <button className="btn btn-primary" onClick={handlePurchase}><FaShopify /> Beli</button>
        </div>
      </div>
    </div>
  );
};

export default ModalVideo;
