const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, updateAppointmentStatus, updateMedicalRecord } = require('../controllers/appointmentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', bookAppointment);
router.get('/', getAppointments);
router.put('/:id/status', updateAppointmentStatus);
// Only vet can update medical records for an appointment
router.put('/:id/records', requireRole('vet'), updateMedicalRecord);

module.exports = router;
