import React, { useState, useEffect } from 'react'
import SidebarUser from './SidebarUser'
import '../../style.css'; 
import axios from 'axios';

const KelasPaid = () => {
  const [paidKelas, setPaidKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaidKelas = async () => {
      try {
        const userId = localStorage.getItem('userId'); 

        const response = await axios.get(`http://localhost:8082/api/transaksi/users/${userId}`);
        
        // Filter only settled video transactions
        const settledKelas = response.data.data.filter(
          transaction => transaction.status === 'settlement' && transaction.tipe_produk === 'kelas'
        );
        
        setPaidKelas(settledKelas);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your class');
        setLoading(false);
      }
    };

    fetchPaidKelas();
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
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <SidebarUser />

      <div className="content mt-5">
        <h2>Kelas Saya</h2>
        <small>
          Klik untuk melihat ebook, menonton video, atau melihat jadwal kelas yang
          Anda ikuti. Tingkatkan Keahlian Teknik Anda dengan Kelas Terintegrasi
        </small>

        <section className="video_section mb-5 mt-5">
          <div className="container">
            <div className="row video">
              {paidKelas.length === 0 ? (
                <div className="col-12 text-center">
                  <p>Anda belum memiliki kelas yang dibeli</p>
                </div>
              ) : (
                paidKelas.map((kelas) => (
                  <div className="col-md-3 mb-4" key={kelas.id_transaksi}>
                    <div className="video-card">
                      {kelas.sampul ? (
                        <img
                          src={kelas.sampul}
                          alt={kelas.judul}
                          className="poster-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/400/320";
                          }}
                        />
                      ) : (
                        <img
                          src="/api/placeholder/400/320"
                          alt={kelas.judul}
                          className="poster-image"
                        />
                      )}
                      <p className="mt-2 mb-2">{kelas.judul}</p>
                      <div className="d-flex justify-content-between">
                        <a
                          href={`https://wa.me/6281286331922?text=Hello%20Admin,%20I%20would%20like%20to%20access%20the%20class%20${kelas.judul}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-detail"
                        >
                          Hubungi Admin
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

export default KelasPaid