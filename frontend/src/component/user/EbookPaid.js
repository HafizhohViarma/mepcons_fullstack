import React from 'react'
import SidebarUser from './SidebarUser'
import '../../style.css'; 

const EbookPaid = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarUser/>

      {/* Content Area */}
      <div className="content mt-5">
        <h2>
            Ebook Saya
        </h2>
        <small>Klik untuk melihat ebook, menonton video, atau melihat jadwal kelas yang Anda ikuti. Tingkatkan Keahlian Teknik Anda dengan Kelas Terintegrasi</small>
      </div>
    </div>
  )
}

export default EbookPaid