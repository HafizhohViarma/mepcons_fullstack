import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidebarUser from './SidebarUser';
import axios from 'axios';
import '../../style.css';

const VideoAkses = () => {
  const { id_video } = useParams(); 
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/videos/${id_video}`);
        setVideo(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch video');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id_video]);

  if (loading) {
    return (
      <div className="dashboard">
        <SidebarUser />
        <div className="content mt-5">
          <p>Loading video...</p>
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
        <h2 className="text-center">Selamat Belajar!</h2>
        {video ? (
          <div className="video-grid">
            {video.files && video.files.length > 0 ? (
              video.files.map((file) => (
                <div key={file.id_file} className="video-item">
                  <video controls style={{ width: "100%" }}>
                    <source src={file.video_file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <p>{file.sub_judul}</p>
                </div>
              ))
            ) : (
              <p>No video files available</p>
            )}
          </div>
        ) : (
          <p>No video found</p>
        )}
      </div>
    </div>
  );
  
};

export default VideoAkses;
