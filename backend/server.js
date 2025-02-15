const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
