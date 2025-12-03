const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Mahasiswa register
router.post('/register', authController.register);

// Admin register (Tambahan)
router.post('/register-admin', authController.registerAdmin);

// Login
router.post('/login', authController.login);

module.exports = router;