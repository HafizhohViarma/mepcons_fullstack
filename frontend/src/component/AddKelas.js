import axios from "axios";  
import SidebarList from "./SidebarList";
import '../style.css';
import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

const AddKelas = () => {
    const [judul_kelas, setJudulKelas] = useState('');
    const [deskripsi_kelas, setDeskripsiKelas] = useState('');
    const [jadwal, setJadwal] = useState('');
    const [harga_kelas, setHargaKelas] = useState('');
    const [sampul_kelas, setSampulKelas] = useState(null);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("judul_kelas", judul_kelas);
        formData.append("deskripsi_kelas", deskripsi_kelas);
        formData.append("jadwal", jadwal);
        formData.append("harga_kelas", harga_kelas);
        if (sampul_kelas) {
          formData.append("sampul_kelas", sampul_kelas);
        }
    
        try {
          const response = await axios.post('http://localhost:8082/api/kelas', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response.data); // Jika berhasil
          navigate('/kelas'); 
        } catch (error) {
          console.error('Error creating class:', error);
        }
      };
  

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SidebarList/>
        
      <div className="content" style={{ padding: '30px' }}>
            <Link to="/kelas">
                <button className="button is-warning">Kembali</button>
            </Link>
        <h2 className="text-center">Add Kelas</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Judul Kelas</label>
            <input
              type="text"
              className="form-control"
              value={judul_kelas}
              onChange={(e) => setJudulKelas(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Deskripsi Kelas</label>
            <textarea
              className="form-control"
              value={deskripsi_kelas}
              onChange={(e) => setDeskripsiKelas(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Jadwal</label>
            <input
              type="text"
              className="form-control"
              value={jadwal}
              onChange={(e) => setJadwal(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Harga Kelas</label>
            <input
              type="text"
              className="form-control"
              value={harga_kelas}
              onChange={(e) => setHargaKelas(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Sampul Kelas</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setSampulKelas(e.target.files[0])}
              accept="image/*"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Add Kelas</button>
        </form>
      </div>
    </div>
  )
}

export default AddKelas;
