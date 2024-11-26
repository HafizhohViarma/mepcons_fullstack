const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const path = require('path');
const dotenv = require('dotenv');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { Users } = db;


// Load environment variables
dotenv.config();

// Verify JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const app = express();

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:8082/auth/google/callback');

const scopes = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true,
});

// Google Auth Routes
app.get('/auth/google', (req, res) => {
  res.redirect(authorizationUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.name) {
      return res.status(400).json({
        message: 'Required user information not provided by Google',
      });
    }

    // Find or create user in database
    let user = await Users.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await Users.create({
        nama: data.name,
        email: data.email,
        telp: '-',
        level: 'user',
        password: Math.random().toString(36).slice(-8), // Generate random password
      });
    }

    // Create JWT payload
    const payload = {
      id_user: user.id_user,
      nama: user.nama,
      email: user.email,
      level: user.level,
    };

    // Sign JWT with explicit conversion of JWT_SECRET to string
    const token = jwt.sign(payload, String(process.env.JWT_SECRET), { expiresIn: '1h' });

    // Redirect to frontend with all necessary user information
    return res.redirect(`http://localhost:3000/auth-success?token=${token}&id_user=${user.id_user}&nama=${encodeURIComponent(user.nama)}&level=${user.level}`);
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      message: 'Authentication failed',
      error: error.message,
    });
  }
});

// Middleware
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di aplikasi API kami!' });
});

// Routes
const userRoutes = require('./routes/usersroutes.js');
const kelasRoutes = require('./routes/tb_kelasroutes.js');
const testiRoutes = require('./routes/tb_testiroutes.js');
const tbEbookRoutes = require('./routes/tb_ebookroutes.js');
const videoRoutes = require('./routes/videoroutes.js');
const transactionRoutes = require('./routes/tb_transaksiroutes.js');

app.use('/api/users', userRoutes);
app.use('/api', kelasRoutes);
app.use('/api', testiRoutes);
app.use('/api/ebooks', tbEbookRoutes);
app.use('/api', videoRoutes);
app.use('/api', transactionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server initialization
const PORT = process.env.PORT || 8082;

db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan pada port ${PORT}`);
      console.log('Database berhasil disinkronisasi.');
      console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET); // Verification log
    });
  })
  .catch((err) => {
    console.error('Gagal sinkronisasi database:', err.message);
  });

module.exports = app;
