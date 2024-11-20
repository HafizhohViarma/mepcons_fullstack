const express = require('express');
const router = express.Router();
const userController = require('../controller/userscontroller.js'); // Pastikan path ini benar
const authMiddleware = require('../midelwares/authMiddleware.js'); // Pastikan path ini benar
const uploads = require('../midelwares/uploads.js'); // Pastikan path ini benar

// Register user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Protected route (harus login terlebih dahulu)
router.get('/profile', authMiddleware.authenticate, userController.getUserProfile);

// Get all users (Admin hanya)
router.get('/', userController.getAllUsers);

// Get user by ID (Admin atau user sendiri)
router.get('/users/:id', authMiddleware.authenticate, userController.getUserById);

// Edit user (Admin atau user sendiri)
router.put('/:id', authMiddleware.authenticate, userController.editUser);

// Delete user by ID (Admin saja)
router.delete('/:id', userController.deleteUser);

// Upload foto user (Admin atau user sendiri)
router.post('/upload-foto/:id', uploads.single('file'), userController.uploadUserPhoto);

router.get('/count/users', userController.countUsers);
module.exports = router;
