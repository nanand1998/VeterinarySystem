const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');

const getVets = async (req, res) => {
  try {
    const vets = await prisma.vet.findMany({
      select: { vet_id: true, name: true, email: true, phone: true, clinic_address: true, schedules: true }
    });
    res.json(vets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createVet = async (req, res) => {
  try {
    const { name, email, password, phone, clinic_address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const vet = await prisma.vet.create({
      data: { name, email, password: hashedPassword, phone, clinic_address }
    });
    res.status(201).json({ message: 'Vet created successfully', vet_id: vet.vet_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Schedules
const addSchedule = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, slot_duration_minutes, is_available } = req.body;
    const vet_id = req.user.role === 'vet' ? req.user.id : req.body.vet_id;
    
    const schedule = await prisma.vetSchedule.create({
      data: { vet_id, day_of_week, start_time, end_time, slot_duration_minutes, is_available }
    });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getVets, createVet, addSchedule };
