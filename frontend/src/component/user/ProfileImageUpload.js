import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera } from 'lucide-react';
import DefaultProfileImage from '../../img/default-profile.png';

const ProfileImageUpload = ({ currentImage, onImageUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Harap pilih file gambar yang valid (JPEG, PNG, atau GIF)');
      return;
    }

    // Validasi ukuran file (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file harus kurang dari 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get('http://localhost:8082/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userId = response.data.id_user;

      const uploadResponse = await axios.post(
        `http://localhost:8082/api/users/upload-foto/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (onImageUpdate) {
        onImageUpdate(uploadResponse.data.fileUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Gagal mengunggah gambar. Silakan coba lagi.');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="visually-hidden" 
      />
      <div onClick={handleImageClick} className="cursor-pointer relative">
        <img
          src={currentImage}
          alt="Profile"
          className="profile-image rounded-full w-24 h-24 object-cover transition-opacity group-hover:opacity-75"
          onError={(e) => {
            e.target.src = DefaultProfileImage;
          }}
        />
        <div className="absolute top-2 right-2 bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors duration-300">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-sm visually-hidden">Pilih Foto</span>
        </div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default ProfileImageUpload;
