const express = require('express');
const router = express.Router();
const userController = require('../controller/userscontroller.js');
const upload = require('../midelwares/uploads.js'); 

// Rute untuk pendaftaran dengan upload foto profil
router.post('/register', upload.single('profil'), userController.register);

// Rute untuk login
router.post('/login', userController.login);

// Middleware untuk autentikasi
router.use(userController.authenticate); // Pastikan middleware autentikasi digunakan sebelum rute yang memerlukan autentikasi

// Rute untuk mendapatkan profil setelah login dan autentikasi
router.get('/profile', (req, res) => {
    res.json({
        message: 'selamat datang admin',
        userId: req.userId,     // ID pengguna dari token
        userLevel: req.userLevel // Level pengguna dari token
    });
});

// Rute untuk mendapatkan semua pengguna (autentikasi diperlukan)
router.get('/', userController.getAllUsers);

// Rute untuk menghapus pengguna berdasarkan ID (autentikasi diperlukan)
router.delete('/users/:id', userController.deleteUser);

// Rute untuk mengupdate profil pengguna, termasuk upload foto profil baru
router.put('/users/:id/profil', upload.single('profil'), userController.updateProfile);

module.exports = router;
