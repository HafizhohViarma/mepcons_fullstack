import '../../landing.css'; 
import Navbar from './Navbar';
import personal1 from '../../img/personal1.png';
import personal2 from '../../img/personal2.png';
import personal3 from '../../img/personal3.png';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import ModalVideo from '../see/ModalVideo';
import ModalKelas from '../see/ModalKelas';
import ModalEbook from '../see/ModalEbook';


const LandingPage = () => {
  const [videos, setVideos] = useState([]);
  const [ebook, setEbook] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [testimoni, setTestimoni] = useState([]);
  const [videoCount, setVideoCount] = useState(0);
  const [kelasCount, setKelasCount] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/videos');
        setVideos(response.data.slice(0, 1)); 
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    getVideos();

    const getEbook = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/ebooks');
        setEbook(response.data.slice(0, 1)); 
      } catch (error) {
        console.error('Error fetching ebook:', error);
      }
    };
    getEbook();

    const getKelas = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/kelas');
        setKelas(response.data.slice(0, 1));
      } catch (error) {
        console.error('Error fetching kelas:', error);
      }
    };
    getKelas();

    const getTestimoni = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/testimoni');
        setTestimoni(response.data);
      } catch (error) {
        console.error('Error fetching testimoni:', error);
      }
    };
    getTestimoni();

    const fetchVideoCount = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/count/videos');
        setVideoCount(response.data.count);
      } catch (error) {
        console.error('Error fetching video count:', error);
      }
    };
    fetchVideoCount();

    const fetchKelasCount = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/count/kelas');
        setKelasCount(response.data.count);
      } catch (error) {
        console.error('Error fetching class count:', error);
      }
    };
    
    fetchKelasCount();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Fungsi untuk membuka modal video
  const openModalVideo = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  // Fungsi untuk membuka modal ebook
  const openModalEbook = (ebookItem) => {
    setSelectedEbook(ebookItem);
    setIsModalOpen(true);
  };

  // Fungsi untuk membuka modal kelas
  const openModalKelas = (kelasItem) => {
    setSelectedKelas(kelasItem);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setSelectedEbook(null);
    setSelectedKelas(null);
  };

  return (
    <div>
      <Navbar />
       
      {/* Banner Section */}
      <section className="home_banner_area">
        <div className="banner_inner">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="banner_content">
                  <h2 className="mt-4 mb-2">
                    Belajar AutoCAD dari Dasar hingga Mahir!
                  </h2>
                  <p>
                    Apakah Anda ingin menguasai AutoCAD untuk kebutuhan desain teknis, arsitektur, teknik sipil, mekanikal, dan elektrikal? Belajarlah bersama kami!
                  </p>
                  <div>
                  <Link to="/daftar-kelas" className="primary-btn mt-5 mb-sm-0 me-3">
                      <i className="bi bi-list"></i> Lihat Daftar Kelas
                  </Link>
                  <Link to="/daftar-video" className="primary-btn mt-3 mb-sm-0">
                      <i className="bi bi-play-circle"></i> Lihat Daftar Video & E-Book
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <section className="card_section">
        <div className="container card-container">
          <div className="row">
            <div className="col-md-4">
              <div className="card-item">
                <div className="card-icon">
                  <i className="fas fa-user"></i>
                </div>
                <div className="card-content">
                  <h4>400.000</h4>
                  <p>Pengguna</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-item">
                <div className="card-icon">
                  <i className="fas fa-video"></i>
                </div>
                <div className="card-content">
                  <h4>{videoCount}</h4>
                  <p>Video Pembelajaran</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-item">
                <div className="card-icon">
                  <i className="fas fa-graduation-cap"></i> 
                </div>
                <div className="card-content">
                <h4>{kelasCount}</h4>
                  <p>Kelas Terpadu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kelas Section */}
      <section className="kelas" id="kelas">
        <div className="container">
          <h2 className="text-center">Kelas / Produk Terpopuler</h2>
          <p>
            Kami menawarkan kelas yang dirancang khusus untuk meningkatkan keahlian teknik Anda. Baik Anda mencari pengetahuan dasar atau ingin mendalami topik spesifik, kami punya solusinya.
          </p>
        </div>
      </section>

      {/* Row menampilkan produk populer */}
      <section className="video_section mb-5">
        <div className="container">
          <div className="row video">
            {/* Video Section */}
            <div className="col-md-4">
              <h3 className="text-center mb-2">Video</h3>
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <div key={index}>
                    <img src={video.sampul_video} alt="Poster" className="poster-image" />
                    <h3 className="mt-2 mb-2">{video.judul_video}</h3>
                    <div className="d-flex justify-content-between">
                    <button onClick={() => openModalVideo(video)} className="btn-detail">
                      <i className="fas fa-hand-point-right"></i> Detail
                    </button>
                      <p className="text-danger">{formatPrice(video.harga_video)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">Tidak ada video tersedia</p>
              )}
            </div>

            {/* Ebook Section */}
            <div className="col-md-4">
              <h4 className="text-center mb-2">E-Book</h4>
              {ebook.length > 0 ? (
                ebook.map((item, index) => (
                  <div key={index}>
                    <img src={item.sampul_ebook} alt="Poster" className="poster-image" />
                    <h3 className="mt-2 mb-2">{item.judul_ebook}</h3>
                    <div className="d-flex justify-content-between">
                      <button onClick={() => openModalEbook(item)} className="btn-detail">
                      <i className="fas fa-hand-point-right"></i> Detail
                      </button>
                      <p className="text-danger">{formatPrice(item.harga_ebook)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">Tidak ada e-book tersedia</p>
              )}
            </div>

            {/* Kelas Section */}
            <div className="col-md-4">
              <h4 className="text-center mb-2">Kelas</h4>
              {kelas.length > 0 ? (
                kelas.map((kelasItem, index) => (
                  <div key={index}>
                    <img src={kelasItem.sampul_kelas} alt="Poster" className="poster-image" />
                    <h3 className="mt-2 mb-2">{kelasItem.judul_kelas}</h3>
                    <div className="d-flex justify-content-between">
                      <button onClick={() => openModalKelas(kelasItem)} className="btn-detail">
                      <i className="fas fa-hand-point-right"></i> Detail
                    </button>
                      <p className="text-danger">{formatPrice(kelasItem.harga_kelas)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">Tidak ada kelas tersedia</p>
              )}
            </div>
          <div className="text-center btn-akses">
            <Link to="/daftar-video" className="btn-detail2 mx-2">
                <i className="fas fa-video mr-1"></i> Akses Video & E-Book
            </Link>
            <Link to="/daftar-kelas" className="btn-detail2 mx-2">
                <i className="fas fa-user-plus mr-1"></i> Daftar Kelas
            </Link>
          </div>
        </div>        
        </div>        
      </section>

      {/* Modal untuk Video */}
      {selectedVideo && (
        <ModalVideo isOpen={isModalOpen} onClose={closeModal} videos={selectedVideo} />
      )}
      
      {/* Modal untuk Ebook */}
      {selectedEbook && (
        <ModalEbook isOpen={isModalOpen} onClose={closeModal} ebook={selectedEbook} />
      )}

      {/* Modal untuk Kelas */}
      {selectedKelas && (
        <ModalKelas isOpen={isModalOpen} onClose={closeModal} kelas={selectedKelas} />
      )}


      <section>
        <div className="container about" id="about-us">
        <h2 className="text-center">Tentang Kami</h2>
          <p>
          Metro Indonesian Software dan MEPCONS SolusiCAD telah bekerja sama untuk menghadirkan pendidikan teknik yang berkualitas tinggi. Dengan pengalaman panjang dalam dunia teknik dan pendidikan, kami berkomitmen untuk menyediakan pembelajaran yang mendalam dan praktis bagi semua peserta. Dari teori hingga praktik, kami memastikan bahwa setiap materi yang kami tawarkan relevan dengan kebutuhan industri saat ini.
          </p>
        <div className="row text-center mt-5 ">
          <div className="col-lg-4 col-md-6">
            <div className="image-box">
            <img src={personal1} alt="Logo" className="poster-image" />
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="image-box">
            <img src={personal2} alt="Logo" className="poster-image" />
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="image-box">
            <img src={personal3} alt="Logo" className="poster-image" />
            </div>
          </div>
          </div>
          </div>
      </section>
      
      {/* Section Manfaat */}
      <section className="manfaat">
        <div className="container">
          <h2 className="text-center">Kenapa Memilih Kami?</h2>
          <p className="text-center mb-5">Manfaat yang Anda Dapatkan</p>
          <div className="row">
            {/* Baris pertama dengan 3 card */}
            <div className="col-lg-4 col-md-6">
              <div className="single_feature text-center">
                <div className="icon">
                <i className="fas fa-graduation-cap"></i>
                </div>
                <h4 className="mt-3 mb-2">Pengajaran oleh Para Ahli</h4>
                <p className="text-light">Semua pengajar kami adalah profesional berpengalaman di bidang teknik, siap membimbing Anda melalui materi yang komprehensif.</p><br/>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single_feature text-center">
                <div className="icon"><i className="fas fa-book"></i></div>
                <h4 className="mt-3 mb-2">Materi yang Selalu Diperbarui</h4>
                <p className="text-light">Kami selalu memperbarui materi kami agar sesuai dengan perkembangan terbaru di industri teknik, memastikan Anda mendapatkan informasi yang paling relevan.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single_feature text-center">
                <div className="icon"><i className="fas fa-globe"></i></div>
                <h4 className="mt-3 mb-2">Akses Fleksibel</h4>
                <p className="text-light">Belajar dengan kecepatan Anda sendiri. Akses video, ebook, dan kelas kapan saja dan di mana saja.</p><br/><br/>
              </div>
            </div>
          </div>

          {/* Baris kedua dengan 2 card */}
          <div className="row mt-4">
            <div className="col-lg-6 col-md-6">
              <div className="single_feature text-center">
                <div className="icon"><i className="fas fa-users"></i></div>
                <h4 className="mt-3 mb-2">Komunitas yang Mendukung</h4>
                <p className="text-light">Bergabunglah dengan komunitas profesional teknik yang aktif dan berdedikasi untuk terus belajar dan berkembang bersama.</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="single_feature text-center">
                <div className="icon"><i className="fas fa-certificate"></i></div>
                <h4 className="mt-3 mb-2">Sertifikasi Resmi</h4>
                <p className="text-light">Dapatkan sertifikat resmi yang diakui setelah menyelesaikan kursus dan ujian yang disediakan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testi testimonials" id="testimoni">
      <div className="container">
        <div className="section-header">
          <h2 className="text-center">Apa Kata Mereka?</h2>
          <p className="text-center mb-5">Dengarkan kisah sukses dari para peserta yang telah meningkatkan keahlian mereka bersama kami.</p>

          <div className="testimonials-content">
            <Slider {...settings}>
              {testimoni.reduce((acc, testi, index) => {
                if (index % 2 === 0) {
                  acc.push([testi.sampul]); 
                } else {
                  acc[acc.length - 1].push(testi.sampul); 
                }
                return acc;
              }, []).map((slideImages, index) => (
                <div key={index} className="testimonial-slide d-flex justify-content-between">
                  {slideImages.map((image, imgIndex) => (
                    <div key={imgIndex} className="testimonials-item">
                      <img src={image} alt={`Testimonial ${imgIndex + 1}`} className="img-fluid" />
                    </div>
                  ))}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>

        <section>
          <Footer/>
        </section>
    </div>
  );
};

export default LandingPage;
