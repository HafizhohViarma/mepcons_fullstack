import React from 'react'
import logo from '../../img/mepcons_metro-logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Footer = () => {
  return (
    <div className="footer" style={{ backgroundColor: '#004080 ' }}>
    <footer className="footer py-3 py-xl-8" style={{ backgroundColor: '#004080 ' }}>
    <div className="">
    <div className="container-fluid">
        <div className="row justify-content-center">
            <div className="col-12 col-md-11">

            <section className="py-4 py-md-5 py-xl-8">
                <div className="container-fluid overflow-hidden">
                <div className="row gy-4 gy-lg-0 justify-content-xl-between">
                    <div className="col-12 col-md-4 col-lg-3 col-xl-2">
                    <div className="widget">
                        <a href="#!">
                        <img src={logo} alt="Logo" width="175" height="57"/>
                        </a>
                    </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-3 col-xl-2">
                    <div className="widget">
                        <h4 className="widget-title mb-4 text-light fw-bold">Tautan</h4>
                        <ul className="list-unstyled">
                        <li className="mb-2">
                            <a href="/" className="link-light text-decoration-none">Beranda</a>
                        </li>
                        <li className="mb-2">
                            <a href="#kelas" className="link-light text-decoration-none">Daftar Kelas</a>
                        </li>
                        <li className="mb-2">
                            <a href="#about-us" className="link-light text-decoration-none">Tentang Kami</a>
                        </li>
                        <li className="mb-2">
                            <a href="#testimoni" className="link-light text-decoration-none">Testimoni</a>
                        </li>
                        </ul>
                    </div>
                    </div>
                    <div className="col-11 col-md-4 col-lg-3 col-xl-3">
                    <div className="widget">
                        <h4 className="widget-title mb-4 text-light fw-bold">Hubungi Kami</h4>
                        <ul>
                    <li className="mb-2">
                        <a href="mailto:metroindo.software@gmail.com" className="link-light text-decoration-none">
                            <i className="bi bi-envelope-fill"></i> metroindo.software@gmail.com
                        </a>
                    </li>
                    <li className="mb-2">
                        <a href="tel:+6282289608096" className="link-light text-decoration-none">
                            <i className="bi bi-telephone-fill"></i> +62 822-8960-8096
                        </a>
                    </li>
                    <li className="mb-2">
                        <a href="https://www.instagram.com/metrosoftware" className="link-light text-decoration-none">
                            <i className="bi bi-instagram"></i> @metrosoftware
                        </a>
                    </li>
                </ul>
                    </div>
                    </div>
                    <div className="col-12 col-lg-3 col-xl-4">
                    <div className="widget">
                        <p className="mb-3 text-light fw-bold">Belajar AutoCAD dari Dasar hingga Mahir!</p>
                    </div>
                    </div>
                </div>
                </div>
            </section>

            <div className="py-4 py-md-5 py-xl-8 border-top border-light-subtle">
                <div className="container-fluid overflow-hidden">
                <div className="row gy-4 gy-md-0 align-items-md-center">
                    <div className="col-xs-12 col-md-7 order-1 order-md-0">
                    <div className="copyright text-center text-md-start text-light">
                        &copy; 2024. All rights reserved by Metro Indonesian Software
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </footer>
    </div>
  )
}

export default Footer