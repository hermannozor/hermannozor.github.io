// Contrôleur pour récupérer les réservations
exports.getBookings = (req, res) => {
    res.json({ message: "Liste des réservations (à implémenter avec la base de données)" });
};

exports.bookRide = (req, res) => {
    const { pickup, destination, date, time } = req.body;
    
    if (!pickup || !destination || !date || !time) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    // Simuler une sauvegarde dans une base de données
    console.log("Réservation reçue :", req.body);
    res.status(201).json({ message: "Réservation effectuée avec succès !" });
};
