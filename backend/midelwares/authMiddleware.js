const jwt = require('jsonwebtoken');
const { Users } = require('../models'); // Sesuaikan dengan path model Anda

// Middleware untuk autentikasi
exports.authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Ambil token dari header Authorization

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.userId = decoded.id; // Simpan ID user 
    req.userLevel = decoded.level; 
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
  }
};

// Middleware untuk cek role user
exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userLevel)) {
      return res.status(403).json({ message: 'Akses ditolak: Anda tidak memiliki izin' });
    }
    next();
  };
};