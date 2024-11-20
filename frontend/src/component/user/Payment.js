import React from 'react'
import SidebarUser from './SidebarUser'

const Payment = () => {
  return (
    <div className="dashboard">
        <SidebarUser/>
        <div className="content content mt-5">
        <h2 className="">
            Transaksi Saya
        </h2>
        <small>Pantau status transaksi Anda dan akses materi pembelajaran seperti video, e-book, atau jadwal kelas dengan mudah. ​​Jadilah ahli di bidang Anda dengan pengalaman belajar yang optimal.</small>

        <section className="mt-5">
            <table className="table is-fullwidth">
            <thead>
            <tr>
              <th>#</th>
              <th>Tipe Produk</th>
              <th>Judul Produk</th>
              <th>Harga</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
            </table>
        </section>
        </div>
    </div>
  )
}

export default Payment