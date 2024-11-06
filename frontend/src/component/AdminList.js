import React from 'react';
import '../style.css'; // Import CSS untuk styling
import SidebarList from './SidebarList';

const AdminList = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarList/>

      {/* Content Area */}
      <div className="content">
        <div className="content-no-background">
          <h1 className="has-text-info">Selamat Datang Admin</h1>
          <p>
            Hai Admin, selamat datang di dashboard pengelolaan situs kursus online AutoCAD. Anda dapat
            mengelola kursus, video, ebook, pengguna, dan laporan penjualan dengan mudah melalui panel ini.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminList;
