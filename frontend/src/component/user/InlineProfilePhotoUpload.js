import React, { useState, useRef } from 'react';
import axios from 'axios';

const InlineProfilePhotoUpload = ({ userId, onPhotoUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('Hanya file gambar (JPEG, PNG, GIF) yang diperbolehkan');
      return;
    }

    if (file.size > maxSize) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Pilih file terlebih dahulu');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);

    try {
      const response = await axios.post(
        `http://localhost:8082/api/users/upload-foto/${userId}`, 
        formData, 
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      alert('Foto profil berhasil diupload');
      
      // Call callback to update parent component
      if (onPhotoUpdate) {
        onPhotoUpdate(response.data.fileUrl);
      }

      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Gagal mengupload foto profil');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center space-x-4">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/gif"
          className="hidden"
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Pilih Foto
        </button>

        {previewUrl && (
          <div className="flex items-center space-x-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-20 h-20 object-cover rounded-full"
            />
            <div className="flex space-x-2">
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
              >
                {uploading ? 'Mengunggah...' : 'Unggah'}
              </button>
              <button 
                onClick={handleCancelUpload}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Optional: Add file size and type guidance */}
      <p className="text-xs text-gray-500 mt-2">
        Ukuran maks: 5MB. Tipe file: JPEG, PNG, GIF
      </p>
    </div>
  );
};

export default InlineProfilePhotoUpload;