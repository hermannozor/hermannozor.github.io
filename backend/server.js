const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Configuration des variables d'environnement
require('dotenv').config();
if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.error("❌ Erreur : La clé API Google Maps n'est pas définie !");
    process.exit(1); // Arrête le serveur si la clé est absente
}

const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//console.log(`✅ Clé API chargée : ${apiKey.substring(0, 5)}... (masquée)`);

const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

// Gestion des erreurs
app.use(errorHandler);

const router = express.Router();

router.get('/autocomplete', async (req, res) => {
    const { input } = req.query;
    if (!input) return res.status(400).json({ error: "Paramètre 'input' requis" });

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
            params: {
                input,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la requête Google Maps" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
