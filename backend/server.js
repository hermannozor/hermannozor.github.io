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

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("994469700771-105vvgfbiktrrde40324g0m4vguloqbc.apps.googleusercontent.com");


const app = express();

// Middleware global
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Remplace par ton domaine
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);

// Gestion des erreurs
app.use(errorHandler);

const router = express.Router();

app.post("/verify-token", async (req, res) => {
    const { id_token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: "994469700771-105vvgfbiktrrde40324g0m4vguloqbc.apps.googleusercontent.com",
        });

        const payload = ticket.getPayload();
        console.log("Utilisateur authentifié :", payload);

        res.json({ success: true, name: payload.name, email: payload.email });
    } catch (error) {
        console.error("Erreur de vérification :", error);
        res.status(401).json({ success: false, message: "Token invalide" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});