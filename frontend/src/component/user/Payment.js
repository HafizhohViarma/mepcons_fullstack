import React, { useState, useEffect } from 'react';
import SidebarUser from './SidebarUser';
import axios from 'axios';
import { MdPendingActions } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { TiCancelOutline } from "react-icons/ti";
import { GrStatusUnknown } from "react-icons/gr";

const Payment = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Adjust based on your auth implementation
        const response = await axios.get(`http://localhost:8082/api/transaksi/users/${userId}`);
        setTransactions(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Kamu belum melakukan transaksi apapun, lakukan transaksi untuk mengakses produk terbaik mu!');
        setLoading(false);
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, []);

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Function to render status with icons
  const renderStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="tag is-warning flex items-center"><MdPendingActions className="mr-1" /> Pending</span>;
      case 'settlement':
        return <span className="tag is-primary flex items-center"><GiConfirmed className="mr-1" /> Confirmed</span>;
      case 'cancel':
        return <span className="tag is-danger flex items-center"><TiCancelOutline className="mr-1" /> Rejected</span>;
      default:
        return <span className="tag flex items-center"><GrStatusUnknown className="mr-1" /> Unknown</span>;
    }
  };

  return (
    <div className="dashboard">
      <SidebarUser />
      <div className="content mt-5">
        <h2 className="text-2xl font-bold mb-2 ml-5">
          Transaksi Saya
        </h2>
        <small className="text-gray-600 block mb-6 ml-5">
          Pantau status transaksi Anda dan akses materi pembelajaran seperti video, e-book, atau jadwal kelas dengan mudah.
          Jadilah ahli di bidang Anda dengan pengalaman belajar maksimal.
        </small>

        <section className="mt-5">
          {loading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-4">No transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Tipe Produk</th>
                    <th className="px-4 py-2 text-left">Judul Produk</th>
                    <th className="px-4 py-2 text-left">Harga</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={transaction.id_transaksi} className="border-b">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 capitalize">{transaction.tipe_produk}</td>
                      <td className="px-4 py-2">{transaction.judul}</td>
                      <td className="px-4 py-2">{formatCurrency(transaction.harga)}</td>
                      <td className="px-4 py-2">{renderStatus(transaction.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Payment;
