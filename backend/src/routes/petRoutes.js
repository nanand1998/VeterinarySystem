const express = require('express');
const router = express.Router();
const { getPets, getPetById, createPet, updatePet, deletePet } = require('../controllers/petController');
const { authenticateToken } = require('../middleware/auth');

// All pet routes require authentication
router.use(authenticateToken);

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', createPet);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;
