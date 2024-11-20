import SidebarList from './SidebarList';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdPendingActions } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { TiCancelOutline } from "react-icons/ti";
import { GrStatusUnknown } from "react-icons/gr";

const PageTransaksi = () => {
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    getTransaction();
  }, []);

  const getTransaction = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/all');
      setTransaction(response.data.transactions);
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching transactions:', error); 
    }
  };

  const renderStatus = (status) => {
    switch(status) {
      case 'pending': return <span className="tag is-warning"><MdPendingActions /> Pending</span>;
      case 'konfirmasi': return <span className="tag is-primary"><GiConfirmed /> Confirmed</span>;
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
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transaction.map((item, index) => (
              <tr key={item.id_transaksi}>
                <td>{index + 1}</td>
                <td>{item.user?.nama_user || 'Nama tidak tersedia'}</td>
                <td>{item.tipe_produk}</td>
                <td>{item.tipe_produk}</td>
                <td>{new Date(item.tgl_transaksi).toLocaleDateString()}</td>
                <td>{formatPrice(item.harga)}</td>
                <td>
                  {item.payment}
                </td>
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
