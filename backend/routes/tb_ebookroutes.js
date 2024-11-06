const express = require('express');
const router = express.Router();
const ebookController = require('../controller/tb_ebookcontroller.js');
const upload = require('../midelwares/uploads.js'); 

// Route untuk membuat ebook baru
router.post('/', upload.fields([{ name: 'sampul_ebook', maxCount: 1 }, { name: 'ebook_file', maxCount: 1 }]), ebookController.createEbook);

// Route untuk mendapatkan semua ebook
router.get('/', ebookController.getAllEbooks);

// Route untuk mendapatkan ebook berdasarkan ID
router.get('/:id', ebookController.getEbookById);

// Route untuk memperbarui ebook
router.put('/:id', upload.fields([{ name: 'sampul_ebook', maxCount: 1 }, { name: 'ebook_file', maxCount: 1 }]), ebookController.updateEbook);

// Route untuk menghapus ebook
router.delete('/:id', ebookController.deleteEbook);

module.exports = router; 
