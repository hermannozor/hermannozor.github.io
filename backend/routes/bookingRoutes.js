const express = require('express');
const { getBookings, bookRide } = require('../controllers/bookingController');

const router = express.Router();

router.post('/book', bookRide); // Route pour les réservations
router.get('/', getBookings); // Route pour récupérer les réservations*

module.exports = router;
