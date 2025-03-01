require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const API_KEY = process.env.GOOGLE_CAL_API_KEY;
const CLIENT_SECRET = process.env.GOOGLE_CAL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const SCOPE = process.env.GOOGLE_SCOPES;

console.log("Client ID:", CLIENT_ID);
console.log("Api Key Secret:", API_KEY);
console.log("Client Secret:", CLIENT_SECRET);
console.log("Redirect URI:", REDIRECT_URI);
// Configuration des variables d'environnement

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
    origin: 'https://smartmovepro.fr', // Remplace par ton domaine
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


// Route pour récupérer les événements
app.post('/get-events', async (req, res) => {
    const { date } = req.body;
    const accessToken = req.headers.authorization?.split(' ')[1]; // Récupérer le token d'accès

    // Valider la date
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ success: false, message: "Date invalide. Format attendu : YYYY-MM-DD" });
    }

    if (!accessToken) {
        return res.status(401).json({ success: false, message: "Jeton d'accès manquant" });
    }

    const credentials = {
        clientId: CLIENT_ID,          // Remplace par ton Client ID
        clientSecret: CLIENT_SECRET,  // Remplace par ton Client Secret
        apiKey: API_KEY,              // Remplace par ton API Key
        redirectUri: REDIRECT_URI,     // Remplace par ton URI de redirection
        scope: SCOPE                  // Les scopes que l'utilisateur doit autoriser
      };

    // Initialiser l'objet OAuth2Client avec les credentials
    const oAuth2Client = new google.auth.OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        credentials.redirectUri
    );

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',  // Permet d'obtenir un refresh token
        scope: SCOPE,           // Les scopes que l'utilisateur doit autoriser
      });
      
      console.log('URL d\'autorisation :', authUrl);
    
    // Définir le token OAuth2 récupéré après authentification
    oAuth2Client.setCredentials({ access_token: accessToken });
    console.log("🔑 oAuth2Client node js:", oAuth2Client);
    console.log("🔑 jeton d acces node js:", accessToken);

    try {
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        // Convertir la date en format ISO et définir les bornes de la journée
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const response = await calendar.events.list({
            calendarId: 'primary', // Utiliser le calendrier principal de l'utilisateur
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items;
        res.json({ success: true, events });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des événements:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des événements" });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});