import React from 'react';
import logo from '../../img/mepcons-blue.png';
import { FaSquareCheck, FaShopify } from "react-icons/fa6";

const ModalEbook = ({ isOpen, onClose, ebook }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePurchase = async () => {
    const idUser = localStorage.getItem('userId'); // Ambil ID user dari localStorage
    if (!idUser) {
      // Arahkan ke halaman login jika userId tidak ditemukan
      alert('Anda perlu login untuk melanjutkan pembelian.');
      window.location.href = '/login'; // Ganti '/login' dengan URL halaman login Anda
      return;
    }

    try {
      const response = await fetch('http://localhost:8082/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_user: idUser, // Gunakan ID user yang valid
          id_ebook: ebook.id_ebook,
          tipe_produk: 'ebook',
          harga: ebook.harga_ebook,
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
        <h2 className='fw-bold'>{ebook.judul_ebook}</h2>
        <p>{ebook.deskripsi_ebook}</p><br></br>

        <p><FaSquareCheck /> Video Playback</p>
        <p><FaSquareCheck /> E-Certificate</p>
        <p><FaSquareCheck /> Free Konsultasi Pasca Training</p>

        <br></br>

        {/* Harga yang berada di kiri */}
        <p className="text-danger">{formatPrice(ebook.harga_ebook)}</p>

        {/* Tombol Batal dan Beli sejajar */}
        <div className="modal-buttons">
          <button onClick={onClose} className="btn btn-secondary">Batal</button>
          <button className="btn btn-primary" onClick={handlePurchase}>
            <FaShopify /> Beli
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEbook;
