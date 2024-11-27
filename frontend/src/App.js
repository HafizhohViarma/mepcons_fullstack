  import AdminList from "./component/AdminList";
  import {BrowserRouter, Routes, Route} from "react-router-dom";
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  import 'boxicons/css/boxicons.min.css';
  // import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import PageVideo from "./component/PageVideo";
  import PageEbook from "./component/PageEbook";
  import PageKelas from "./component/PageKelas";
  import PageUser from "./component/PageUser";
  import PageTestimoni from "./component/PageTestimoni";
  import PageTransaksi from "./component/PageTransaksi";
  import AddVideo from "./component/AddVideo";
  import AddVideos from "./component/AddVideos";
  import PageDetailVideo from "./component/PageDetailVideo";
  import EditVideo from "./component/EditVideo";
  import EditTestimoni from "./component/EditTestimoni";
  import AddKelas from "./component/AddKelas";
  import EditKelas from "./component/EditKelas";
  import EditEbook from "./component/EditEbook";
  import AddEbook from "./component/AddEbook";
  import EditVideos from "./component/EditVideos";
  import AddTestimoni from "./component/AddTestimoni";
  import LandingPage from "./component/landing/LandingPage";
  import DaftarKelas from "./component/see/DaftarKelas";
  import DaftarVideo from "./component/see/DaftarVideo";
  import Dashboard from "./component/user/Dashboard";
  import VideoPaid from "./component/user/VideoPaid";
  import KelasPaid from "./component/user/KelasPaid";
  import EbookPaid from "./component/user/EbookPaid";
  import Login from "./component/Login";
  import Register from "./component/Register";
import AddUser from "./component/AddUser";
import EditUser from "./component/EditUser";
import AuthSuccess from "./component/AuthSuccess";
import UbahProfile from "./component/user/UbahProfile";
import Security from "./component/user/Security";
import PageDetailTransaksi from "./component/PageDetailTransaksi";
import Payment from "./component/user/Payment";
import VideoAkses from "./component/user/VideoAkses";
import ForgotPassword from "./component/ForgotPassword";
import EnterOTP from "./component/EnterOTP";
import ResetPassword from "./component/ResetPassword";
import EbookViewer from "./component/user/EbookViewer";

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Admin */}
          <Route path="/admin" element={<AdminList/>}/>
          <Route path="/video" element={<PageVideo/>}/>
          <Route path="/ebook" element={<PageEbook/>}/>
          <Route path="/kelas" element={<PageKelas/>}/>
          <Route path="/user" element={<PageUser/>}/>
          <Route path="/testimoni" element={<PageTestimoni/>}/>
          <Route path="/transaksi" element={<PageTransaksi/>}/>
          <Route path="/transaction/:id" element={<PageDetailTransaksi/>}/>
          <Route path="/videos/:id" element={<PageDetailVideo/>}/>

          {/* add */}
          <Route path="/add-video" element={<AddVideo/>}/>
          <Route path="/edit-video/:id" element={<EditVideo/>}/>
          
          {/* dihalaman Detail Video */}
          <Route path="/add-videos/:id" element={<AddVideos />} />
          <Route path="edit-videos/:id/:id_file" element={<EditVideos/>}/>

          {/* Kelas */}
          <Route path="/edit-kelas/:id" element={<EditKelas/>}/>
          <Route path="/add-kelas" element={<AddKelas/>}/>

          {/* E-Book */}
          <Route path="/edit-ebook/:id" element={<EditEbook/>}/>
          <Route path="/add-ebook" element={<AddEbook/>}/>

          {/* User */}
          <Route path="/add-user" element={<AddUser/>}/>
          <Route path="/edit-user/:id" element={<EditUser/>}/>

          {/* Testimoni */}
          <Route path="/add-testi" element={<AddTestimoni/>}/>
          <Route path="/edit-testimoni/:id" element={<EditTestimoni />} />

          {/* Landing Page */}
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/daftar-kelas" element={<DaftarKelas/>}/>
          <Route path="/daftar-video" element={<DaftarVideo/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/auth-success" element={<AuthSuccess/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/enter-otp" element={<EnterOTP/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>

          {/* Halaman Sidebar User */}
          <Route path="/profile" element={<Dashboard/>}/>
          <Route path="/security" element={<Security/>}/>
          <Route path="/ubah-profile" element={<UbahProfile />} />
          <Route path="/video-paid" element={<VideoPaid/>}/>
          <Route path="/kelas-paid" element={<KelasPaid/>}/>
          <Route path="/ebook-paid" element={<EbookPaid/>}/>
          <Route path="/ebook-viewer" element={<EbookViewer/>} />
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/akses-video/:id_video" element={<VideoAkses/>}/>
        </Routes>
      </BrowserRouter>
    );
  }

  export default App;
