import SidebarList from './SidebarList';
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PageDetailVideo = () => {
    const { id } = useParams(); // Mengambil id dari URL
    const [videoDetail, setVideoDetail] = useState(null);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/api/videos/${id}`);
                console.log("Response data:", response.data); 
                
                // Periksa apakah file.id_file ada
                response.data.files.forEach((file) => {
                    console.log(file.id_file); // Verifikasi id_file
                });
    
                setVideoDetail(response.data);
            } catch (error) {
                console.error('Error fetching video details:', error); 
            }
        };
    
        getDetails();
    }, [id]);
    
    

    if (!videoDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <SidebarList />

            {/* Content Area */}
            <div className="content" style={{ backgroundColor: 'white', padding: '20px' }}>
                <h1 className="has-text-black text-center">Detail Video</h1>
                
                <div style={{ marginBottom: '20px' }}>
                    <Link to="/video">
                        <button className="button is-warning">Kembali</button>
                    </Link>
                    <Link to={`/add-videos/${id}`}>
                        <button className="button is-primary ml-3">Tambah Video</button>
                    </Link>
                </div>

                {/* Tampilkan Detail Video */}
                <div>
                    {/* Tabel Data VideoFiles */}
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Sub Judul</th>
                                <th>File Video</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                        {videoDetail.files && videoDetail.files.length > 0 ? (
                            videoDetail.files.map((file, index) => (
                                <tr key={file.id_file || index}>
                                    <td>{index + 1}</td>
                                    <td>{file.sub_judul || 'Sub judul tidak tersedia'}</td>
                                    <td>
                                        <video width="320" height="240" controls>
                                            <source src={file.video_file} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </td>
                                    <td>
                                        <Link to={`/edit-videos/${id}/${file.id_file}`}>
                                            <button className="button is-small is-info">Edit</button>
                                        </Link>
                                        <button className="button is-small is-danger">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="has-text-centered">Tidak ada file video untuk video ini</td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PageDetailVideo;
