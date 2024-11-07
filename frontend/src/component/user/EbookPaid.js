import React from 'react'
import SidebarUser from './SidebarUser'
import '../../style.css'; 
import poster from '../../img/poster.jpg';

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

        <section className="video_section mb-5 mt-5">
          <div className="container">
            <div className="row video">
              <div className="col-md-3 mb-4">
                <div className="video-card">
                  <img src={poster} alt="Poster" className="poster-image" />
                  <h5 className="mt-2 mb-2">Masih UI saja ya ges</h5>
                  <div className="d-flex justify-content-between">
                    <a href="/akses-video" className="btn-detail">
                      <i className="fas fa-eye"></i> Akses
                    </a>
                    <p className="text-danger">Rp.240000</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="video-card">
                  <img src={poster} alt="Poster" className="poster-image" />
                  <h5 className="mt-2 mb-2">Masih UI saja ya ges</h5>
                  <div className="d-flex justify-content-between">
                    <a href="/akses-video" className="btn-detail">
                      <i className="fas fa-eye"></i> Akses
                    </a>
                    <p className="text-danger">Rp.240000</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="video-card">
                  <img src={poster} alt="Poster" className="poster-image" />
                  <h5 className="mt-2 mb-2">Masih UI saja ya ges</h5>
                  <div className="d-flex justify-content-between">
                    <a href="/akses-video" className="btn-detail">
                      <i className="fas fa-eye"></i> Akses
                    </a>
                    <p className="text-danger">Rp.240000</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="video-card">
                  <img src={poster} alt="Poster" className="poster-image" />
                  <h5 className="mt-2 mb-2">Masih UI saja ya ges</h5>
                  <div className="d-flex justify-content-between">
                    <a href="/akses-video" className="btn-detail">
                      <i className="fas fa-eye"></i> Akses
                    </a>
                    <p className="text-danger">Rp.240000</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="video-card">
                  <img src={poster} alt="Poster" className="poster-image" />
                  <h5 className="mt-2 mb-2">Masih UI saja ya ges</h5>
                  <div className="d-flex justify-content-between">
                    <a href="/akses-video" className="btn-detail">
                      <i className="fas fa-eye"></i> Akses
                    </a>
                    <p className="text-danger">Rp.240000</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-4">
                <div className="video-card">
                  <img src={poster} alt="Poster" className="poster-image" />
                  <h5 className="mt-2 mb-2">Masih UI saja ya ges</h5>
                  <div className="d-flex justify-content-between">
                    <a href="/akses-video" className="btn-detail">
                      <i className="fas fa-eye"></i> Akses
                    </a>
                    <p className="text-danger">Rp.240000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default EbookPaid