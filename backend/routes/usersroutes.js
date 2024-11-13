const express = require('express');
const router = express.Router();
const userController = require('../controller/userscontroller.js');
const upload = require('../midelwares/uploads.js'); 

router.post('/register', upload.single('profil'), userController.register);
// Rute untuk login
router.post('/login', userController.login);

router.get('/profile', userController.authenticate, (req, res) => {
    res.json({
        message: 'selamat datang admin',
        userId: req.userId,     
        userLevel: req.userLevel 
    });
});

router.get('/', userController.getAllUsers);

router.use(userController.authenticate); 

router.delete('/users/:id', userController.deleteUser);

router.put('/users/:id/profil', upload.single('profil'), userController.updateProfile);

router.post('/logout', userController.logout);
module.exports = router;
