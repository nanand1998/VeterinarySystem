const prisma = require('../prismaClient');

const processPayment = async (req, res) => {
  try {
    const { appointment_id, payment_mode } = req.body;

    const payment = await prisma.payment.create({
      data: { appointment_id, payment_mode }
    });
    
    await prisma.appointment.update({
      where: { appointment_id },
      data: { status: 'Paid' }
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const { role, id } = req.user;
    if (role !== 'admin' && role !== 'owner') return res.status(403).json({ message: 'Access denied' });

    let payments;
    if (role === 'owner') {
      payments = await prisma.payment.findMany({
        where: { appointment: { pet_owner_id: id } },
        include: { appointment: { include: { pet: true, vet: { select: { name: true } } } } }
      });
    } else {
      payments = await prisma.payment.findMany({ include: { appointment: true } });
    }
    
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { processPayment, getPayments };
