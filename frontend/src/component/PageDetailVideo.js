// PageDetailVideo.js
import SidebarList from './SidebarList';
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PageDetailVideo = () => {
    const { id } = useParams();
    const [videoDetail, setVideoDetail] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/api/videos/${id}`);
                console.log("Response data:", response.data);

                response.data.files.forEach((file) => {
                    console.log("ID File:", file.id_file);
                });

                setVideoDetail(response.data);
            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };

        getDetails();
    }, [id]);

    const handleDeleteClick = (id_file) => {
        setSelectedFileId(id_file);
        setShowConfirmModal(true);
    };

    const deleteFile = async () => {
        try {
            await axios.delete(`http://localhost:8082/api/videos/${id}/videoFiles/${selectedFileId}`);
            setVideoDetail((prevState) => ({
                ...prevState,
                files: prevState.files.filter(file => file.id_file !== selectedFileId)
            }));
            setShowConfirmModal(false);
            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);

        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    if (!videoDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <SidebarList />
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

                <div>
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
                                            <button
                                                onClick={() => handleDeleteClick(file.id_file)}
                                                className="button is-small is-danger"
                                            >
                                                Hapus
                                            </button>
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

            {/* Modal Konfirmasi Hapus */}
            {showConfirmModal && (
                <div className="modal is-active">
                    <div className="modal-background" onClick={() => setShowConfirmModal(false)}></div>
                    <div className="modal-content">
                        <div className="box">
                            <p className="has-text-centered" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                                <span style={{ fontSize: '2rem', color: 'red', marginRight: '10px' }}>✖️</span> Apakah Anda yakin ingin menghapus file ini?
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                                <button onClick={() => setShowConfirmModal(false)} className="button">Batal</button>
                                <button onClick={deleteFile} className="button is-danger">Hapus</button>
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
                            <p>File berhasil dihapus!</p>
                        </div>
                    </div>
                    <button className="modal-close is-large" aria-label="close" onClick={() => setShowSuccessModal(false)}></button>
                </div>
            )}
        </div>
    );
};

export default PageDetailVideo;
