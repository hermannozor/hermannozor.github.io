const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/contactController'); // Vérifie le bon chemin

// Route pour envoyer un message via le formulaire de contact
router.post('/', sendMessage);

module.exports = router; // Vérifie bien que ce n'est pas `{ router }`
