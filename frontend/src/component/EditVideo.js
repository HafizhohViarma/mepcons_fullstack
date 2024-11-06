import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SidebarList from './SidebarList';

const EditVideo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [videoData, setVideoData] = useState({
        judul_video: '',
        keterangan_video: '',
        sampul_video: null,
        harga_video: ''
    });

    const fetchVideo = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8082/api/videos/${id}`);
            setVideoData(response.data);
        } catch (error) {
            console.error('Error fetching video details:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchVideo();
    }, [fetchVideo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVideoData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setVideoData((prevData) => ({
            ...prevData,
            sampul_video: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('judul_video', videoData.judul_video);
        formData.append('keterangan_video', videoData.keterangan_video);
        formData.append('harga_video', videoData.harga_video);

        if (videoData.sampul_video) {
            formData.append('sampul_video', videoData.sampul_video);
        }

        try {
            await axios.put(`http://localhost:8082/api/videos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/video');
        } catch (error) {
            console.error('Error updating video:', error.response?.data || error.message);
        }
    };

    return (
        <div className="dashboard">
            <SidebarList />
            <div className="content" style={{ padding: '30px' }}>
                <Link to="/video">
                    <button className="button is-warning">Kembali</button>
                </Link>
                <h2 className="text-center">Form Edit Video</h2>

                <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="field">
                        <label className="label">Judul Video</label>
                        <div className="control">
                            <input
                                type="text"
                                className="input"
                                name="judul_video"
                                value={videoData.judul_video}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="field">
                        <label className="label">Keterangan Video</label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                name="keterangan_video"
                                value={videoData.keterangan_video}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Sampul Video</label>
                        <div className="control">
                            <input
                                type="file"
                                className="input"
                                name="sampul_video"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                    </div>
                    
                    <div className="field">
                        <label className="label">Harga Video</label>
                        <div className="control">
                            <input
                                type="text"
                                className="input"
                                name="harga_video"
                                value={videoData.harga_video}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <button type="submit" className="button is-primary">Update Video</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVideo;
