const prisma = require('../prismaClient');

const getPets = async (req, res) => {
  try {
    const { role, id } = req.user;
    if (role === 'owner') {
      const pets = await prisma.pet.findMany({ where: { pet_owner_id: id } });
      return res.json(pets);
    }
    // Admin or Vet can see all pets, including basic owner info
    const pets = await prisma.pet.findMany({
      include: { owner: { select: { name: true, phone: true } } }
    });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPetById = async (req, res) => {
  try {
    const pet = await prisma.pet.findUnique({ 
      where: { pet_id: Number(req.params.id) }, 
      include: { owner: { select: { name: true, phone: true, email: true } } } 
    });
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPet = async (req, res) => {
  try {
    const data = req.body;
    // Automatically assign owner if requester is an owner
    if (req.user.role === 'owner') {
      data.pet_owner_id = req.user.id;
    }
    const pet = await prisma.pet.create({ data });
    res.status(201).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const pet = await prisma.pet.update({
      where: { pet_id: Number(req.params.id) },
      data: req.body
    });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePet = async (req, res) => {
  try {
    await prisma.pet.delete({ where: { pet_id: Number(req.params.id) } });
    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPets, getPetById, createPet, updatePet, deletePet };
