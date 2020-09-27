const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// /api/auth
router.get('', authController.getUsers);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;