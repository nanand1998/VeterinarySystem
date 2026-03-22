const prisma = require('../prismaClient');

const bookAppointment = async (req, res) => {
  try {
    const { vet_id, schedule_id, pet_id, appointment_date, appointment_time, reason_for_visit } = req.body;
    const pet_owner_id = req.user.role === 'owner' ? req.user.id : req.body.pet_owner_id;

    // Prevent double booking
    const existing = await prisma.appointment.findFirst({
      where: { vet_id, appointment_date, appointment_time, status: { not: 'Cancelled' } }
    });
    if (existing) return res.status(400).json({ message: 'Time slot already booked' });

    const appointment = await prisma.appointment.create({
      data: { pet_owner_id, vet_id, schedule_id, pet_id, appointment_date, appointment_time, reason_for_visit }
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { role, id } = req.user;
    let appointments;
    
    const include = { pet: true, vet: { select: { name: true } }, pet_owner: { select: { name: true } } };

    if (role === 'owner') appointments = await prisma.appointment.findMany({ where: { pet_owner_id: id }, include });
    else if (role === 'vet') appointments = await prisma.appointment.findMany({ where: { vet_id: id }, include });
    else appointments = await prisma.appointment.findMany({ include }); // Admin

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await prisma.appointment.update({
      where: { appointment_id: Number(req.params.id) },
      data: { status }
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const { treatment_notes, diagnosis, prescriptions } = req.body;
    const appointment = await prisma.appointment.update({
      where: { appointment_id: Number(req.params.id) },
      data: { treatment_notes, diagnosis, prescriptions, status: 'Completed' }
    });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus, updateMedicalRecord };
