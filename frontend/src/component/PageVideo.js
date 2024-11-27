import SidebarList from './SidebarList';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const PageVideo = () => {
  const [videos, setVideos] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);

  // Memindahkan filterVideos ke dalam useCallback untuk menghindari infinite loop
  const filterVideos = useCallback(() => {
    const filtered = videos.filter(video => 
      video.judul_video.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.keterangan_video.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVideos(filtered);
  }, [searchQuery, videos]); // Dependencies untuk useCallback

  useEffect(() => {
    getVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [filterVideos]); // Sekarang filterVideos menjadi dependency

  const getVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/videos');
      setVideos(response.data);
      setFilteredVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSearch = () => {
    filterVideos();
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (id) => {
    setSelectedVideoId(id);
    setShowConfirmModal(true);
  };

  const deleteVideo = async () => {
    try {
      await axios.delete(`http://localhost:8082/api/videos/${selectedVideoId}`);
      getVideos();
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
      
    } catch (error) {
      console.log(error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="dashboard">
      <SidebarList />

      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Daftar Video</h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link to="/add-video">
            <button className="button is-primary">+ Add Video</button>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              className="input"
              placeholder="Search videos..."
              style={{ marginRight: '10px' }}
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
          </div>
        </div>

        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Deskripsi</th>
              <th>Sampul</th>
              <th>Video</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((video, index) => (
              <tr key={video.id_video}>
                <td>{index + 1}</td>
                <td>{video.judul_video}</td>
                <td>{video.keterangan_video}</td>
                <td>
                  <img src={video.sampul_video} alt="Sampul" width="100" />
                </td>
                <td>
                  <Link to={`/videos/${video.id_video}`}>
                    <button>Detail</button>
                  </Link>
                </td>
                <td>{formatPrice(video.harga_video)}</td>
                <td className="justify-content-center">
                  <Link to={`/edit-video/${video.id_video}`}>
                    <button className="button is-small is-info mb-2"><FaRegEdit /> Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(video.id_video)}
                    className="button is-small is-danger"
                  > <MdOutlineDelete />
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showConfirmModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowConfirmModal(false)}></div>
          <div className="modal-content">
            <div className="box">
              <p className="has-text-centered" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', color: 'red', marginRight: '55px' }}>✖️</span> Apakah Anda yakin ingin menghapus video ini?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setShowConfirmModal(false)} className="button">Batal</button>
                <button onClick={deleteVideo} className="button is-danger">Hapus</button>
              </div>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowConfirmModal(false)}></button>
        </div>
      )}

      {/* Modal Sukses Hapus */}
      {showSuccessModal && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowSuccessModal(false)}></div>
          <div className="modal-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div className="box has-text-centered">
              <p style={{ fontSize: '1.5rem', color: 'green', marginBottom: '10px' }}>✔️</p>
              <p>Video berhasil dihapus!</p>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowSuccessModal(false)}></button>
        </div>
      )}
    </div>
  );
};

export default PageVideo;