import React, { useState } from "react";
import axios from "axios";  
import SidebarList from "./SidebarList";
import '../style.css';
import { Link, useNavigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';

const AddVideo = () => {
  const [judul_video, setJudul] = useState("");
  const [keterangan_video, setKeterangan] = useState("");
  const [harga_video, setHarga] = useState("");
  const [sampul_video, setSampul] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSampulChange = (e) => {
    setSampul(e.target.files[0]);
  };

  const handleVideoFilesChange = (e) => {
    setVideoFiles([...e.target.files]);
  };

  const saveVideo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("judul_video", judul_video);
    formData.append("keterangan_video", keterangan_video);
    formData.append("harga_video", harga_video);
    formData.append("sampul_video", sampul_video);

    videoFiles.forEach((file) => {
      formData.append("video_file", file); 
    });

    try {
      await axios.post("http://localhost:8082/api/videos", formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });

      setMessage("Video created successfully!");
      navigate("/video");

      // Reset form setelah submit
      setJudul("");
      setKeterangan("");
      setHarga("");
      setSampul(null);
      setVideoFiles([]);
    } catch (error) {
      if (error.response) {
          console.error('Error:', error.response.data);
          setMessage(`Error: ${error.response.data.message || 'Terjadi kesalahan'}`);
      } else {
          console.error('Error:', error.message);
          setMessage('Error: Tidak ada respon dari server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <SidebarList />
      
      <div className="content" style={{ padding: '30px' }}>
        <Link to="/video">
          <button className="btn btn-warning mb-3">Kembali</button>
        </Link>
        
        <h2 className="text-center mb-4">Form Tambah Video</h2>

        {message && <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"}`}>{message}</div>}

        <form onSubmit={saveVideo} style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="form-group mb-3">
            <label>Judul Video</label>
            <input
              type="text"
              className="form-control"
              value={judul_video}
              onChange={(e) => setJudul(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Keterangan Video</label>
            <textarea
              className="form-control"
              value={keterangan_video}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label>Harga Video</label>
            <input
              type="number"
              className="form-control"
              value={harga_video}
              onChange={(e) => setHarga(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Sampul Video</label>
            <input
              type="file"
              className="form-control"
              onChange={handleSampulChange}
              accept="image/*"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>File Video</label>
            <input
              type="file"
              className="form-control"
              name="video_files"
              onChange={handleVideoFilesChange}
              multiple
              required
            />
            <small className="form-text text-muted">
              {videoFiles.length > 0 && `${videoFiles.length} file dipilih`}
            </small>
          </div>

          <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
            {loading ? 'Loading...' : 'Add Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVideo;
