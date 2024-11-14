import SidebarList from './SidebarList';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const PageTestimoni = () => {
  const [testimoni, setTestimoni] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTestimoniId, setSelectedTestimoniId] = useState(null);

  useEffect(() => {
    getTestimoni();
  }, []);

  const getTestimoni = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/testimoni');
      setTestimoni(response.data); 
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching class:', error); 
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedTestimoniId(id);
    setShowConfirmModal(true);
  };

  const deleteTestimoni = async () => {
    try {
      await axios.delete(`http://localhost:8082/api/testimoni/${selectedTestimoniId}`);
      getTestimoni();
      setShowConfirmModal(false);
      setShowSuccessModal(true);

      // Set a timeout to close the success modal after 2 seconds
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
        <h1 className="has-text-black text-center">Daftar Testimoni / Feedback</h1>
        
        {/* Button Add Video */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/add-testi">
            <button className="button is-primary">+ Add Testimoni</button>
          </Link>
        </div>

        {/* Tabel Data Testimoni */}
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Sampul</th>
              <th>Feedback</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {testimoni.map((testi, index) => (
              <tr key={testi.id_testi}> 
                <td>{index + 1}</td>
                <td>{testi.nama_peserta}</td>
                <td>
                  <img src={testi.sampul} alt="Sampul" width="100" />
                </td>
                <td>{testi.testimoni  }</td> 
                <td>
                  <Link to={`/edit-testimoni/${testi.id_testi}`}>
                    <button className="button is-small is-info mr-2"><FaRegEdit />Edit</button>
                  </Link>

                  <button 
                  onClick={() => handleDeleteClick(testi.id_testi)}
                  className="button is-small is-danger"><MdOutlineDelete /> Hapus</button>
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
                <span style={{ fontSize: '2rem', color: 'red', marginRight: '10px' }}>✖️</span> Apakah Anda yakin ingin menghapus Testimoni ini?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setShowConfirmModal(false)} className="button">Batal</button>
                <button onClick={deleteTestimoni} className="button is-danger">Hapus</button>
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
              <p>Testimoni berhasil dihapus!</p>
            </div>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={() => setShowSuccessModal(false)}></button>
        </div>
      )}
    </div>
  )
}

export default PageTestimoni