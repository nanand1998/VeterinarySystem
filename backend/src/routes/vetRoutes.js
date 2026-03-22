const express = require('express');
const router = express.Router();
const { getVets, createVet, addSchedule } = require('../controllers/vetController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', getVets);
// Only admin can create a vet
router.post('/', authenticateToken, requireRole('admin'), createVet);
// Vet or admin can add schedule
router.post('/schedule', authenticateToken, addSchedule);

module.exports = router;
