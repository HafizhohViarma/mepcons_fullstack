const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Direktori penyimpanan
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nama file yang unik
    }
});

const fileFilter = (req, file, cb) => {
    // Menambahkan tipe PDF (application/pdf) ke dalam filter
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'application/pdf'
    ) {
        cb(null, true); // Terima file
    } else {
        cb(new Error('Invalid file type'), false); // Tolak file
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 500 }, // Batasan ukuran file 150MB
    fileFilter: fileFilter 
});


module.exports = upload;
