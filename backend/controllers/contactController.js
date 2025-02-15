exports.sendMessage = (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    res.status(200).json({ success: "Message envoyé avec succès !" });
};
