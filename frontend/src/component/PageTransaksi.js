import React from 'react'
import SidebarList from './SidebarList';

const PageTransaksi = () => {
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
              <th>Tanggal Transaksi</th>
              <th>Harga</th>
              <th>Status</th>
            </tr>
          </thead>
          </table>
      </div>
    </div>
  )
}

export default PageTransaksi