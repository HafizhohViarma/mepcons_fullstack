import React, { useState, useEffect } from 'react';
import SidebarUser from './SidebarUser';
import '../../style.css';
import axios from 'axios';

const VideoPaid = () => {
  const [paidVideos, setPaidVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaidVideos = async () => {
      try {
        const userId = localStorage.getItem('userId'); 
        const response = await axios.get(`http://localhost:8082/api/transaksi/users/${userId}`);
        
        // Filter only settled video transactions
        const settledVideos = response.data.data.filter(
          transaction => transaction.status === 'settlement' && transaction.tipe_produk === 'video'
        );
        
        setPaidVideos(settledVideos);
        setLoading(false);
      } catch (err) {
        setError('Anda belum mengakses video manapun!');
        setLoading(false);
      }
    };

    fetchPaidVideos();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <SidebarUser />
        <div className="content mt-5">
          <p>Loading your videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <SidebarUser />
        <div className="content mt-5">
          <p className="text-danger ml-5">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <SidebarUser />

      <div className="content mt-5">
        <h2>Video Saya</h2>
        <small>
          Klik untuk melihat ebook, menonton video, atau melihat jadwal kelas yang
          Anda ikuti. Tingkatkan Keahlian Teknik Anda dengan Kelas Terintegrasi
        </small>

        <section className="video_section mb-5 mt-5">
          <div className="container">
            <div className="row video">
              {paidVideos.length === 0 ? (
                <div className="col-12 text-center">
                  <p>Anda belum memiliki video yang dibeli</p>
                </div>
              ) : (
                paidVideos.map((video) => (
                  <div className="col-md-3 mb-4" key={video.id_transaksi}>
                    <div className="video-card">
                      {video.sampul ? (
                        <img
                          src={video.sampul}
                          alt={video.judul}
                          className="poster-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/400/320";
                          }}
                        />
                      ) : (
                        <img
                          src="/api/placeholder/400/320"
                          alt={video.judul}
                          className="poster-image"
                        />
                      )}
                      <p className="mt-2 mb-2">{video.judul}</p>
                      <div className="d-flex justify-content-between">
                        <a href={`/akses-video/${video.id_video}`} className="btn-detail">
                          <i className="fas fa-play"></i> Akses
                        </a>
                        <p className="text-success">Purchased</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VideoPaid;