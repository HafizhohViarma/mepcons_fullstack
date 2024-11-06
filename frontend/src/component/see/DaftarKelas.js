import Footer from '../landing/Footer';
import '../../landing.css'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalDetail from './ModalKelas'; 
import logo from '../../img/mepcons_metro-logo.png';

const DaftarKelas = () => {
  const [kelas, setKelas] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header_area');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    getKelas();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getKelas = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/kelas');
      setKelas(response.data); 
    } catch (error) {
      console.error('Error fetching class:', error); 
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const openModal = (kelas) => {
    setSelectedKelas(kelas);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedKelas(null);
  };

  return (
    <div>
      <header className="header_area">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <a className="navbar-brand logo_h" href="index.php">
              <img src={logo} alt="Logo" className="logo-image"/>
            </a>
            <div className="collapse navbar-collapse offset" id="navbarSupportedContent">
              <ul className="nav navbar-nav menu_nav ml-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="/landing-page">Beranda</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/daftar-video">Daftar Video & E-Book</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/">Saya</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/">Masuk / Daftar</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <section className="daftar-kelas">
        <div className="container">
          <div className="card-full">
            <div className="card-content-see">
              <h1 className="card-title-see">Daftar Kelas</h1>
              <p className="card-subtitle text-center">
                Kelas ini dirancang untuk memberikan pemahaman mendalam tentang teknik terbaru, dipandu oleh pengajar berpengalaman dari MEPCONS. Anda bisa memilih untuk mengikuti seluruh kelas, atau hanya membeli materi video dan ebook sesuai kebutuhan Anda. Pilih paket yang sesuai dengan kebutuhan Anda. Dapatkan diskon khusus jika membeli materi video dan ebook sekaligus, atau ikuti seluruh kelas untuk pengalaman belajar yang lengkap.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container search">
          <form method="POST" action="" className="input-group mb-3">
            <input type="text" name="search" placeholder="Cari kelas..." className="form-control rounded"/>
            <button type="submit" className="btn btn-outline-primary">Cari</button>
          </form>
        </div>
      </section>

      <section className="kelas_section mb-5">
        <div className="container">
          <div className="row mt-5">
            {kelas.map((kelasBro, indexBos) => (
              <div className="col-md-4 mb-4" key={indexBos}>
                <div className="card">
                  <img src={kelasBro.sampul_kelas} alt="Logo" className="poster-image card-img-top" />
                  <div className="card-body">
                    <h3 className="card-title">{kelasBro.judul_kelas}</h3>
                    <div className="d-flex justify-content-between align-items-center">
                      <button onClick={() => openModal(kelasBro)} className="btn btn-primary">Detail</button>
                      <p className="text-danger mb-0">{formatPrice(kelasBro.harga_kelas)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ModalDetail isOpen={isModalOpen} onClose={closeModal} kelas={selectedKelas} />

      <section>
        <Footer/>
      </section>
    </div>
  );
}

export default DaftarKelas;
