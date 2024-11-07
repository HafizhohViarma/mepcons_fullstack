const express = require('express');
const router = express.Router();
const uploads = require('../midelwares/uploads.js'); 
const kelasController = require('../controller/tb_kelascontroller.js'); // Pastikan path benar

// Route untuk Kelas
router.post('/kelas', uploads.single('sampul_kelas'), kelasController.createKelas);
router.get('/kelas', kelasController.getAllKelas);       // Read all
router.get('/kelas/:id', kelasController.getKelasById);  // Read by ID
router.put('/kelas/:id', uploads.single('sampul_kelas'), kelasController.updateKelas);  // Update by ID dengan upload file baru
router.delete('/kelas/:id', kelasController.deleteKelas);  // Delete by ID
router.get('/count', kelasController.countKelas);
module.exports = router;
