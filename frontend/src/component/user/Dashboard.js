import React from 'react'
import SidebarUser from './SidebarUser'
import '../../style.css'; 

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarUser/>

      {/* Content Area */}
      <div className="content">
        <div className="content-no-background">
          <h1 className="has-text-info">Hello,</h1>
          <p>
          Selamat datang di Dashboard Anda! Di sini, Anda dapat mengakses semua produk yang telah Anda beli, termasuk video pembelajaran, e-book, dan kelas eksklusif. Jelajahi dan manfaatkan sumber daya ini untuk memperdalam pengetahuan serta meningkatkan keterampilan Anda. Selamat belajar dan semoga sukses!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard