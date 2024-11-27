import SidebarList from './SidebarList';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdPendingActions } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { TiCancelOutline } from "react-icons/ti";
import { GrStatusUnknown } from "react-icons/gr";

const PageTransaksi = () => {
  const [transaction, setTransaction] = useState([]);
  const [filterType, setFilterType] = useState(''); 

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/all');
        const transactions = response.data.data || [];
        if (filterType) {
          // Filter transaksi berdasarkan tipe produk jika filterType dipilih
          const filteredTransactions = transactions.filter(item => item.tipe_produk === filterType);
          setTransaction(filteredTransactions);
        } else {
          setTransaction(transactions); // Tampilkan semua transaksi jika filterType kosong
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransaction([]); // Set data ke array kosong jika gagal
      }
    };

    getTransaction(); // Memanggil fungsi getTransaction

  }, [filterType]); // Panggil getTransaction lagi setiap filter berubah

  const renderStatus = (status) => {
    switch(status) {
      case 'pending': return <span className="tag is-warning"><MdPendingActions /> Pending</span>;
      case 'settlement': return <span className="tag is-primary"><GiConfirmed /> Confirmed</span>;
      case 'tolak': return <span className="tag is-danger"><TiCancelOutline /> Rejected</span>;
      default: return <span className="tag"><GrStatusUnknown /> Unknown</span>;
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
        <h1 className="has-text-black text-center">Data Transaksi / Penjualan</h1>  

        {/* Filter by Tipe Produk */}
        <div className="field is-inline-block" style={{ marginBottom: '20px' }}>
          <label className="label" htmlFor="filterType">Filter by Tipe:</label>
          <div className="control">
            <div className="select">
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Semua</option>
                <option value="video">Video</option>
                <option value="kelas">Kelas</option>
                <option value="ebook">Ebook</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabel Data Transaksi */}
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Pengguna</th>
              <th>Tipe Produk</th>
              <th>Judul Produk</th>
              <th>Tanggal Transaksi</th>
              <th>Harga</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transaction.map((item, index) => (
              <tr key={item.id_transaksi}>
                <td>{index + 1}</td>
                <td>{item.nama_user || 'Nama tidak tersedia'}</td>
                <td>{item.tipe_produk}</td>
                <td>{item.judul_produk}</td>
                <td>{new Date(item.tgl_transaksi).toLocaleDateString()}</td>
                <td>{formatPrice(item.harga)}</td>
                <td>{renderStatus(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PageTransaksi;
