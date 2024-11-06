import SidebarList from './SidebarList';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PageVideo = () => {
  const [videos, setVideos] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
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

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarList />

      {/* Content Area */}
      <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
        <h1 className="has-text-black text-center">Daftar Video</h1>

        <div style={{ marginBottom: '20px' }}>
          <Link to="/add-video">
            <button className="button is-primary">Add Video</button>
          </Link>
        </div>

        {/* Tabel Data Video */}
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
            {videos.map((video, index) => (
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
                <td>{`Rp ${video.harga_video}`}</td>
                <td>
                  <Link to={`/edit-video/${video.id_video}`}>
                    <button className="button is-small is-info">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(video.id_video)}
                    className="button is-small is-danger"
                  >
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
                <span style={{ fontSize: '2rem', color: 'red', marginRight: '10px' }}>✖️</span> Apakah Anda yakin ingin menghapus video ini?
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
          <div className="modal-content">
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