const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models'); 
const path = require('path'); 
require('dotenv').config();




const app = express();


app.use(express.json({ limit: '500mb' })); 
app.use(express.urlencoded({ limit: '500mb', extended: true }));


app.use(cors({
  origin: 'http://localhost:3000', 
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple route untuk tes
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di aplikasi API kami!' });
});

// impor
const userRoutes = require('./routes/usersroutes.js'); 
app.use('/api/users', userRoutes);


const kelasRoutes = require('./routes/tb_kelasroutes.js');
app.use('/api', kelasRoutes);

// Import dan gunakan routes Testimoni
const testiRoutes = require('./routes/tb_testiroutes.js');
app.use('/api', testiRoutes);

const tbEbookRoutes = require('./routes/tb_ebookroutes.js');
app.use('/api/ebooks', tbEbookRoutes);

const videoRoutes = require('./routes/videoroutes.js');
app.use('/api', videoRoutes);

const transactionRoutes = require('./routes/tb_transaksiroutes.js');
app.use('/api', transactionRoutes);


// Port dimana server akan dijalankan
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}.`);
});

// Sinkronisasi database dan jalankan server
db.sequelize.sync().then(() => {
  console.log('Database berhasil disinkronisasi.');
}).catch(err => {
  console.error('Gagal sinkronisasi database:', err.message);
});
