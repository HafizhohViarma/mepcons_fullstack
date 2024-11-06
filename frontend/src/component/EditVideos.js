import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import { Link } from 'react-router-dom';
import SidebarList from './SidebarList';
import axios from 'axios';

const EditVideos = () => {
    const { id, id_file } = useParams(); 
    const [subJudul, setSubJudul] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();  // Use useNavigate

    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/api/videos/${id}`);
                const file = response.data.files.find(f => f.id_file === id_file);
                if (file) {
                    setSubJudul(file.sub_judul);
                    setVideoFile(file.video_file);  // Menampilkan file video yang sudah ada
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching video details:', error);
                setLoading(false);
            }
        };

        fetchVideoDetails();
    }, [id, id_file]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('ID Video:', id);
        console.log('ID File:', id_file);
        console.log('Video File:', videoFile);

        const formData = new FormData();
        formData.append('sub_judul', subJudul);
        if (videoFile) {
            formData.append('video_file', videoFile);
        }

        try {
            await axios.put(`http://localhost:8082/api/videos/${id}/videoFiles/${id_file}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            alert('File video berhasil diperbarui!');
            navigate(`/detail-video/${id}`);  
        } catch (error) {
            console.error('Error updating video file:', error);
            alert('Gagal memperbarui file video!');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <SidebarList />
            <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
                <Link to="/video">
                    <button className="button is-warning">Kembali</button>
                </Link>
                <h1 className="has-text-black text-center">Form Edit Video (Detail)</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label">Sub Judul</label>
                        <div className="control">
                            <input
                                type="text"
                                className="input"
                                value={subJudul}
                                onChange={(e) => setSubJudul(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">File Video</label>
                        <div className="control">
                            <input
                                type="file"
                                className="input"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                            />
                        </div>
                    </div>
                    <button type="submit" className="button is-primary">Update Video</button>
                </form>
            </div>
        </div>
    );
};

export default EditVideos;
