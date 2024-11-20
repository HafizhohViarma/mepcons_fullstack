import Footer from '../landing/Footer';
import React, { useEffect, useState } from 'react';
import logo from '../../img/mepcons_metro-logo.png';
import axios from 'axios';
import '../../landing.css';
import ModalVideo from './ModalVideo'; 
import ModalEbook from './ModalEbook';

const DaftarVideo = () => {
  const [video, setVideo] = useState([]);
  const [ebook, setEbook] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [isEbookModalOpen, setIsEbookModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header_area');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    getVideo();
    getEbook();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getVideo = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/videos');
      setVideo(response.data);
      setFilteredVideos(response.data);  // Initialize filtered videos
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const getEbook = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/ebooks');
      setEbook(response.data);
      setFilteredEbooks(response.data);  // Initialize filtered ebooks
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching ebook:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const openModal = (videos) => {
    setSelectedVideo(videos);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const openEbookModal = (ebookItem) => {
    setSelectedEbook(ebookItem);
    setIsEbookModalOpen(true);
  };

  const closeEbookModal = () => {
    setIsEbookModalOpen(false);
    setSelectedEbook(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    // Filter videos based on search term
    const filteredVideos = video.filter(v => 
      v.judul_video.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter ebooks based on search term
    const filteredEbooks = ebook.filter(e => 
      e.judul_ebook.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredVideos(filteredVideos);
    setFilteredEbooks(filteredEbooks);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    setIsLoggedIn(!!token);
    setUserId(storedUserId);
    getVideo();
    getEbook();
  }, []);

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
                  <a className="nav-link" href="/">Beranda</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/daftar-kelas">Daftar Kelas</a>
                </li>
                {isLoggedIn && userId ? (
                  <>
                    <li className="nav-item">
                      <a className="nav-link" href="/profile">Profile</a>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <a className="nav-link" href="/login">Masuk / Daftar</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <section className="daftar-kelas">
        <div className="container">
          <div className="card-full">
            <div className="card-content-see">
              <h1 className="card-title-see">Daftar Video</h1>
              <p className="card-subtitle text-center">
                Kelas ini dirancang untuk memberikan pemahaman mendalam tentang teknik terbaru, dipandu oleh pengajar berpengalaman dari MEPCONS. Anda bisa memilih untuk mengikuti seluruh kelas, atau hanya membeli materi video dan ebook sesuai kebutuhan Anda. Pilih paket yang sesuai dengan kebutuhan Anda. Dapatkan diskon khusus jika membeli materi video dan ebook sekaligus, atau ikuti seluruh kelas untuk pengalaman belajar yang lengkap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section>
        <div className="container search">
          <form method="POST" onSubmit={handleSearchSubmit} className="input-group mb-3">
            <input 
              type="text" 
              value={searchTerm} 
              onChange={handleSearchChange} 
              placeholder="Cari video / e-book..." 
              className="form-control rounded" 
            />
            <button type="submit" className="btn btn-outline-primary">Cari</button>
          </form>
        </div>
      </section>

      {/* Video List */}
      <section className="video_section mb-5">
        <div className="container">
          <div className="row mt-5">
            <strong className="text-center mb-5">Daftar Video</strong>
            {filteredVideos.map((videos, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card">
                  <img src={videos.sampul_video} alt="Logo" className="poster-image card-img-top" />
                  <div className="card-body">
                    <h4 className="card-title">{videos.judul_video}</h4>
                    <div className="d-flex justify-content-between align-items-center">
                      <button onClick={() => openModal(videos)} className="btn btn-primary">Detail</button>
                      <p className="text-danger mb-0">{formatPrice(videos.harga_video)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>        
      </section>

      <ModalVideo isOpen={isModalOpen} onClose={closeModal} videos={selectedVideo} />
      
      {/* E-book List */}
      <section className="ebook_section mb-5">
        <div className="container">
          <div className="row mt-5">
            <strong className="text-center mb-5">Daftar E-Book</strong>
            {filteredEbooks.map((e, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card">
                  <img src={e.sampul_ebook} alt="Logo" className="poster-image card-img-top" />
                  <div className="card-body">
                    <h3 className="card-title">{e.judul_ebook}</h3>
                    <div className="d-flex justify-content-between align-items-center">
                      <button onClick={() => openEbookModal(e)} className="btn btn-primary">Detail</button>
                      <p className="text-danger mb-0">{formatPrice(e.harga_ebook)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>        
      </section>

      <ModalEbook isOpen={isEbookModalOpen} onClose={closeEbookModal} ebook={selectedEbook} />

      <Footer />
    </div>
  );
};

export default DaftarVideo;
