<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Connexion à la base de données
$servername = "127.0.0.1:3306"; // ou l'adresse de votre serveur
$username = "u457211756_admin"; // votre nom d'utilisateur phpMyAdmin
$password = "Kfher@Hostinger2025!"; // votre mot de passe phpMyAdmin
$dbname = "u457211756_smartMovePro"; // nom de la base de données

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Récupérer les données envoyées par le front-end via POST
$prenom_nom = $_POST['name'];
$email = $_POST['email'];
$tel = $_POST['phone'];
$lieu_depart = $_POST['pickup'];
$destination = $_POST['destination'];
$date_reservation = $_POST['date'];
$heure_pickup = $_POST['time'];

// Préparer la requête SQL pour l'insertion
$stmt = $conn->prepare("INSERT INTO reservations (prenom_nom, email, tel, lieu_depart, destination, date_reservation, heure_pickup, date_demande_resa) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");

// Lier les paramètres à la requête préparée
$stmt->bind_param("sssssss", $prenom_nom, $email, $tel, $lieu_depart, $destination, $date_reservation, $heure_pickup);

// Exécuter la requête
if ($stmt->execute()) {
    echo "Réservation enregistrée avec succès.";

    // Envoi de l'email de confirmation au client

    // Vérification des champs obligatoires
    if (!$prenom_nom || !$email || !$tel || !$lieu_depart || !$destination || !$date_reservation || !$heure_pickup) {
        die("Erreur : Tous les champs sont obligatoires.");
    }

    // Destinataire du client
    $to_client = $email; // Email du client
    // Votre propre email
    $to_admin = "contact@smartmovepro.fr"; // Remplacez par votre adresse email

    // Sujet du mail (pour le client)
    $subject_client = "Confirmation de votre réservation - SmartMovePro";
    // Sujet du mail (pour vous)
    $subject_admin = "Réservation client - SmartMovePro";

    // Contenu de l'email
    $email_message = "Bonjour $prenom_nom,\n\n";
    $email_message .= "Merci d'avoir effectué une réservation avec nous. Voici les détails de votre réservation :\n\n";
    $email_message .= "Lieu de départ : $lieu_depart\n";
    $email_message .= "Destination : $destination\n";
    $email_message .= "Date de la réservation : $date_reservation\n";
    $email_message .= "Heure de départ : $heure_pickup\n\n";
    $email_message .= "Nous vous contacterons prochainement pour confirmer votre réservation.\n\n";
    $email_message .= "Cordialement,\nL'équipe de réservation SmartMovePro";

    // En-têtes de l'email
    $headers = "From: no-reply@smartmovepro.fr\r\n";
    $headers .= "Reply-To: no-reply@smartmovepro.fr\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n"; // Encodage UTF-8

    // Envoi de l'email de confirmation au client
    if (mail($to_client, $subject_client, $email_message, $headers)) {
         header("Location: /frontend/confirmationBooking.html");
    } else {
        echo "Erreur lors de l'envoi de l'email au client.";
    }

    // Envoi de l'email à vous-même
    $admin_message = "Nouvelle réservation reçue :\n\n";
    $admin_message .= "Nom du client : $prenom_nom\n";
    $admin_message .= "Email : $email\n";
    $admin_message .= "Téléphone : $tel\n";
    $admin_message .= "Lieu de départ : $lieu_depart\n";
    $admin_message .= "Destination : $destination\n";
    $admin_message .= "Date de réservation : $date_reservation\n";
    $admin_message .= "Heure de départ : $heure_pickup\n\n";
    $admin_message .= "Merci de vérifier la réservation.";

    // Envoi de l'email à l'administrateur
    if (mail($to_admin, $subject_admin, $admin_message, $headers)) {
        //echo "Email de notification envoyé à l'administrateur.";
    } else {
        echo "Erreur lors de l'envoi de l'email à l'administrateur.";
    }

} else {
    echo "Erreur : " . $stmt->error;
}

// Fermer la connexion et la requête préparée
$stmt->close();
$conn->close();
?>
