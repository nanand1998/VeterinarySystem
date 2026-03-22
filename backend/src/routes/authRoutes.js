const express = require('express');
const router = express.Router();
const { login, registerOwner, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/register/owner', registerOwner);
router.get('/me', authenticateToken, getMe);

module.exports = router;
