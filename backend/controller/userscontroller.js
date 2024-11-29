const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');  
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const SECRET_KEY = 'aGz#91Z6!Tnkb*5w4YmvR$2p7bqLo#Fw'; 

// Fungsi untuk register user
exports.registerUser = async (req, res) => {
    const { nama, email, telp, password, level } = req.body;
  
    if (!nama || !email || !telp || !password || !level) {
      return res.status(400).json({ message: 'Semua kolom harus diisi' });
    }
  
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Jika file foto profil ada
      const profilPath = req.file ? `/uploads/${req.file.filename}` : null;
  
      // Menyimpan user ke database
      const user = await Users.create({
        nama,
        email,
        telp,
        password: hashedPassword,
        level,
        profil: profilPath, // Menyimpan path gambar jika ada
      });
  
      res.status(201).json({ message: 'User berhasil terdaftar', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Gagal mendaftarkan user' });
    }
  };
  

// Fungsi untuk login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi' });
  }

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Password salah' });
    }

    // Buat JWT token
    const token = jwt.sign(
      { id: user.id_user, level: user.level, nama: user.nama },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal login' });
  }
};

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }
    
    // exstrak 
    const token = authHeader.split(' ')[1]; // ambik token 
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Verifikasi token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err); 
            return res.status(401).json({ message: 'Unauthorized' });
        }

        
        req.userId = decoded.id;
        req.userLevel = decoded.level;
        next(); 
    });
};

// Fungsi untuk mendapatkan profil user
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId || req.headers['user-id'];
    
    if (!userId) {
      return res.status(404).json({ message: 'User ID tidak ditemukan' });
    }

    const user = await Users.findOne({
      where: { id_user: userId },
      attributes: ['id_user', 'nama', 'email', 'profil', 'level'] 
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    if (user.profil) {
      if (!user.profil.startsWith('http')) {
        user.profil = `http://localhost:8082${user.profil}`;
      }
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Gagal mengambil profil', error: error.message });
  }
};

// Fungsi untuk mendapatkan semua user
exports.getAllUsers = async (req, res) => {
    try {
      const users = await Users.findAll();
      console.log(users);  // Log data yang diambil
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Gagal mengambil data users' });
    }
  };
  
// Fungsi untuk mendapatkan user berdasarkan ID
exports.getUserById = async (req, res) => {
  try {
    console.log("Mencari user dengan ID:", req.params.id);  // Log untuk debugging
    
    const user = await Users.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error saat mengambil data user:", error);  // Log error
    res.status(500).json({ message: 'Gagal mengambil data user' });
  }
};


// Fungsi untuk mengedit user
exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { nama, email, telp, level } = req.body;

  try {
    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    user.nama = nama || user.nama;
    user.email = email || user.email;
    user.telp = telp || user.telp;
    user.level = level || user.level;

    await user.save();

    res.json({ message: 'User berhasil diupdate', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengupdate user' });
  }
};

// Fungsi untuk menghapus user
exports.deleteUser = async (req, res) => {
    try {
        // Inisialisasi variabel user terlebih dahulu
        const user = await Users.findByPk(req.params.id);

        // Cek apakah user ditemukan
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Menghapus user
        await user.destroy();

        // Mengirimkan respons setelah user dihapus
        res.json({ message: 'User berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus user' });
    }
};


  exports.uploadUserPhoto = async (req, res) => {
    const { id } = req.params;
    const file = req.file; // multer menyimpan file yang diupload di req.file

    if (!file) {
        return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Path untuk menyimpan file
        const uploadPath = path.join('/uploads', file.filename);

        // Update record user dengan path foto profil baru
        user.profil = uploadPath.replace(/\\/g, '/');; 
        await user.save();

        // URL foto yang bisa diakses
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        res.json({ message: 'Foto berhasil diupload', fileUrl: fileUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengupload foto' });
    }
};


exports.countUsers = async (req, res) => {
    try {
        // Menghitung jumlah id_user yang ada di tabel users
        const totalUsers = await Users.count({
            where: { id_user: { [Op.ne]: null } }  // Menghitung berdasarkan id_user
        });

        res.json({ totalUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghitung jumlah pengguna' });
    }
};


//Fungsi untuk melakukan forgot password
// Generate OTP function
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Email tidak ditemukan' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Save OTP to user model
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = otpExpiry;
    await user.save();

    // Create transporter with updated configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      secure: true,
      port: 465
    });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 15 minutes.`
    });

    res.status(200).json({ message: 'OTP telah dikirim ke email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengirim OTP' });
  }
};
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await Users.findOne({ 
      where: { 
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { [Op.gt]: new Date() } 
      } 
    });

    if (!user) {
      return res.status(400).json({ message: 'OTP tidak valid atau sudah kadaluarsa' });
    }

    res.status(200).json({ message: 'OTP berhasil diverifikasi' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memverifikasi OTP' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password berhasil direset' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal reset password' });
  }
};

//Reset Password di user
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.userId; // This comes from the authentication middleware

  if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
          message: 'Current password and new password are required' 
      });
  }

  try {
      // Find the user
      const user = await Users.findByPk(userId);
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!validPassword) {
          return res.status(401).json({ 
              message: 'Current password is incorrect' 
          });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      user.password = hashedNewPassword;
      await user.save();

      res.json({ message: 'Password successfully updated' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update password' });
  }
};