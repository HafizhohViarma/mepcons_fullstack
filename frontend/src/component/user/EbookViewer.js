import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import SidebarUser from './SidebarUser';

const EbookViewer = () => {
  const location = useLocation(); // To get the state from navigation
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (location.state && location.state.pdfUrl) {
      setPdfUrl(location.state.pdfUrl); // Store the PDF URL
    }
  }, [location]);

  if (!pdfUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard"style={{ height: '100vh' }}>
        <SidebarUser/>
      <div className="content">
        <h2 className="text-center">Selamat Belajar!</h2>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfUrl} />
      </Worker>
      </div>
    </div>
  );
};

export default EbookViewer;
