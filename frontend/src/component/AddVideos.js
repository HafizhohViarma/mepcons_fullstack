import React, { useState } from "react";
import axios from "axios";  
import SidebarList from "./SidebarList";
import '../style.css';
import { Link, useNavigate, useParams } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';

const AddVideos = () => {
    const { id } = useParams(); 
    const [sub_judul, setSubJudul] = useState("");
    const [video_file, setVideoFiles] = useState(null); 
    const navigate = useNavigate();

    const saveVideos = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("sub_judul", sub_judul);
        formData.append("video_file", video_file);
        formData.append("id_video", id);

        // Log data sebelum dikirim
        console.log("ID Video:", id);
        console.log("Sub Judul:", sub_judul);
        console.log("Video File:", video_file);

        try {
            await axios.post(`http://localhost:8082/api/videos/${id}/videoFiles`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });            
            navigate(`/videos/${id}`);
        } catch (error) {
            console.log(error.response?.data || error.message); 
        }
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <SidebarList />
            
            <div className="content" style={{ padding: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <Link to={`/videos/${id}`}>
                        <button className="button is-warning">Kembali</button>
                    </Link>
                </div>
                <h2 className="text-center">Form Tambah Video</h2>
                <form onSubmit={saveVideos} encType="multipart/form-data"> 
                    <div className="form-group">
                        <label>Sub Judul Video</label>
                        <input
                            type="text"
                            className="form-control"
                            value={sub_judul}
                            onChange={(e) => setSubJudul(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>File Video</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setVideoFiles(e.target.files[0])}
                            required
                        />
                    </div>

                    <button type="submit" className="button is-primary mt-3">
                        Simpan
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVideos;
