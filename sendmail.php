<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    // Récupération des données du formulaire
    $name = htmlspecialchars($_POST["name"], ENT_QUOTES, 'UTF-8');
    $email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);
    $message = html_entity_decode($_POST["message"], ENT_QUOTES, 'UTF-8');

    // Vérification des champs obligatoires
    if (!$name || !$email || !$message) {
        die("Erreur : Tous les champs sont obligatoires.");
    }

    // Destinataire et expéditeur
    $to = "contact@smartmovepro.fr"; // Remplace par ton email de réception
    $from = $email; // Ton email d'envoi (doit être valide sur Hostinger)
    
    // Sujet du mail
    $subject = "Nouveau message de $name";

    // Contenu de l'email
    $email_message = "Nom: $name\n";
    $email_message .= "Email: $email\n";
    $email_message .= "Message:\n$message\n";

    // En-têtes de l'email
    $headers = "From: $from\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n"; // Encodage UTF-8

    // Envoi de l'email
    if (mail($to, $subject, $email_message, $headers)) {
         //echo "L'email a été envoyé avec succès.";
         header("Location: /frontend/confirmationMail.html");
        
    } else {
        echo "Erreur lors de l'envoi du message.";
    }
} else {
    echo "Méthode non autorisée.";
}
?>
