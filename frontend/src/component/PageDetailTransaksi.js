import React, { useState, useEffect } from 'react';
import SidebarList from './SidebarList';
import axios from 'axios';

const PageDetailTransaksi = () => {
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

  return (
    <div className="dashboard">
      <SidebarList />

      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Detail Transaksi / Penjualan</h1>
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>#</th>
                <th>Id Transaksi</th>
                <th>Order Id</th>
                <th>Judul Produk</th>
                <th>Payment (Metode Pembayaran)</th>
              </tr>
            </thead>
            <tbody>
            {transaction.map((item, index) => (
              <tr key={item.id_transaksi}>
                <td>{index + 1}</td>
                <td>{item.id_transaksi}</td>
                <td>{item.order_id}</td>
                <td>judul produk</td>
                <td>{item.payment}</td>
              </tr>
            ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

export default PageDetailTransaksi;
