const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');  // Sesuaikan dengan path model Anda
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Fungsi untuk register user
exports.registerUser = async (req, res) => {
  const { nama, email, telp, password, level } = req.body;

  // Validasi input
  if (!nama || !email || !telp || !password || !level) {
    return res.status(400).json({ message: 'Semua kolom harus diisi' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const user = await Users.create({
      nama,
      email,
      telp,
      password: hashedPassword,
      level
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
      { id: user.id_user, level: user.level },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login berhasil', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal login' });
  }
};

// Fungsi untuk mendapatkan profil user
exports.getUserProfile = async (req, res) => {
  try {
    const user = await Users.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil profil' });
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
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
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
        const uploadPath = path.join('uploads', file.filename);

        // Update record user dengan path foto profil baru
        user.profil = uploadPath; 
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