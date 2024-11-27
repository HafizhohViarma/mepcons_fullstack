import React, { useState, useEffect } from 'react';
import SidebarUser from './SidebarUser';
import '../../style.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Gantilah useHistory dengan useNavigate

const EbookPaid = () => {
  const [paidEbook, setPaidEbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Gantilah useHistory dengan useNavigate

  useEffect(() => {
    const fetchPaidEbook = async () => {
      try {
        const userId = localStorage.getItem('userId'); 

        const response = await axios.get(`http://localhost:8082/api/transaksi/users/${userId}`);
        
        // Filter only settled video transactions
        const settledEbook = response.data.data.filter(
          transaction => transaction.status === 'settlement' && transaction.tipe_produk === 'ebook'
        );
        
        setPaidEbook(settledEbook);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch your ebooks');
        setLoading(false);
      }
    };

    fetchPaidEbook();
  }, []);

  const handleAccessClick = (ebookFileUrl) => {
    navigate('/ebook-viewer', {
      state: { pdfUrl: ebookFileUrl }
    });
  };  

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
        <h2>Ebook Saya</h2>
        <small>
          Klik untuk melihat ebook, menonton video, atau melihat jadwal kelas yang
          Anda ikuti. Tingkatkan Keahlian Teknik Anda dengan Kelas Terintegrasi
        </small>

        <section className="video_section mb-5 mt-5">
          <div className="container">
            <div className="row video">
              {paidEbook.length === 0 ? (
                <div className="col-12 text-center">
                  <p>Anda belum memiliki ebook yang dibeli</p>
                </div>
              ) : (
                paidEbook.map((ebook) => (
                  <div className="col-md-3 mb-4" key={ebook.id_transaksi}>
                    <div className="video-card">
                      {ebook.sampul ? (
                        <img
                          src={ebook.sampul}
                          alt={ebook.judul}
                          className="poster-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/400/320";
                          }}
                        />
                      ) : (
                        <img
                          src="/api/placeholder/400/320"
                          alt={ebook.judul}
                          className="poster-image"
                        />
                      )}
                      <p className="mt-2 mb-2">{ebook.judul}</p>
                      <div className="d-flex justify-content-between">
                        <button onClick={() => handleAccessClick(ebook.ebook_file)} className="btn btn-primary">Akses</button>
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

export default EbookPaid;
