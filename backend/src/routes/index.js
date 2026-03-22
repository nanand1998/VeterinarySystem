const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const petRoutes = require('./petRoutes');
const vetRoutes = require('./vetRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const paymentRoutes = require('./paymentRoutes');

router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/vets', vetRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
