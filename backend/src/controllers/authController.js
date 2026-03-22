const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_in_production';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' });
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    let user = null;
    let userId = null;
    
    if (role === 'admin') {
      user = await prisma.admin.findUnique({ where: { email } });
      if (user) userId = user.admin_id;
    } else if (role === 'vet') {
      user = await prisma.vet.findUnique({ where: { email } });
      if (user) userId = user.vet_id;
    } else if (role === 'owner') {
      user = await prisma.petOwner.findUnique({ where: { email } });
      if (user) userId = user.pet_owner_id;
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(userId, role);
    return res.json({ token, role, user: { id: userId, email: user.email, name: user.name || 'Admin' } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const registerOwner = async (req, res) => {
  const { name, email, password, phone, address, date_of_birth } = req.body;
  try {
    const existing = await prisma.petOwner.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = await prisma.petOwner.create({
      data: { name, email, password: hashedPassword, phone, address, date_of_birth }
    });

    const token = generateToken(newOwner.pet_owner_id, 'owner');
    res.status(201).json({ token, role: 'owner', user: { id: newOwner.pet_owner_id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const getMe = async (req, res) => {
  const { id, role } = req.user;
  try {
    let user = null;
    if (role === 'admin') user = await prisma.admin.findUnique({ where: { admin_id: id } });
    if (role === 'vet') user = await prisma.vet.findUnique({ where: { vet_id: id } });
    if (role === 'owner') user = await prisma.petOwner.findUnique({ where: { pet_owner_id: id } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Omit password
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { login, registerOwner, getMe };
