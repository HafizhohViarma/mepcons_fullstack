const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Users } = require('../models'); 
const uploads = require('../midelwares/uploads.js'); 

// Secret key untuk JWT
const SECRET_KEY = 'your_secret_key'; 

// Pendaftaran pengguna dengan upload foto profil
exports.register = async (req, res) => {
    try {
        const { nama, email, telp, password, level } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const user = await Users.create({
            nama,
            email,
            telp,
            password: hashedPassword,
            profil: req.file ? `/uploads/profil/${req.file.filename}` : null, 
            level
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login pengguna
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        
        const token = jwt.sign({ id: user.id_user, level: user.level }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//midelwares
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

// Update foto profil pengguna (admin atau user)
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params; 

        const user = await Users.findOne({ where: { id_user: id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        user.profil = req.file ? `/uploads/profil/${req.file.filename}` : user.profil;
        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mengambil semua pengguna
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: { exclude: ['password'] } 
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Menghapus pengguna
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; 

        const user = await Users.findOne({ where: { id_user: id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Users.destroy({ where: { id_user: id } });
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
