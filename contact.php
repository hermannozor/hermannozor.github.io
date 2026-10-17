<?php
declare(strict_types=1);
session_start();

// --- Config ---
$to   = 'contact@smartmovepro.fr';
$from = 'contact@smartmovepro.fr';

// --- Fonctions utilitaires ---
function clean(string $v, int $max = 2000): string {
    $v = trim($v);
    $v = str_replace(["\r", "\n", "\0"], ' ', $v); // anti injection d'en-têtes
    return mb_substr($v, 0, $max, 'UTF-8');
}
function cleanMultiline(string $v, int $max = 5000): string {
    $v = trim(str_replace("\0", '', $v));
    return mb_substr($v, 0, $max, 'UTF-8');
}
function go(string $url): never {
    header('Location: ' . $url, true, 303);
    exit;
}

// --- Méthode ---
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    go('/contact.html');
}

// --- Langue (liste blanche) ---
$lang = (($_POST['lang'] ?? 'fr') === 'en') ? 'en' : 'fr';
$errorPage = $lang === 'en' ? '/contact_en.html?error=1' : '/contact.html?error=1';
$merciPage = $lang === 'en' ? '/merci_en.html' : '/merci.html';

// --- Honeypot : champ caché "website" qui doit rester vide ---
if (!empty($_POST['website'] ?? '')) {
    go($merciPage); // on fait semblant, le robot ne sait pas
}

// --- Limitation : 3 envois / 10 minutes par session ---
$now = time();
$_SESSION['sent'] = array_filter($_SESSION['sent'] ?? [], fn($t) => $now - $t < 600);
if (count($_SESSION['sent']) >= 3) {
    go($errorPage . '&reason=rate');
}

// --- Récupération et nettoyage ---
$nom     = clean($_POST['nom'] ?? '', 120);
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$besoin  = clean($_POST['besoin'] ?? ($_POST['formation'] ?? ''), 120);
$message = cleanMultiline($_POST['message'] ?? '');
$consent = !empty($_POST['consent']);

if ($nom === '' || !$email || $besoin === '' || $message === '' || !$consent) {
    go($errorPage);
}

// Email : refuse tout retour à la ligne
if (preg_match('/[\r\n]/', $email)) {
    go($errorPage);
}

// --- Contenu ---
$subject = '=?UTF-8?B?' . base64_encode("SITE - $besoin - $nom") . '?=';

$body  = "Nouveau message depuis le site smartmovepro.fr\n";
$body .= "Nom : $nom\n";
$body .= "Email : $email\n";
$body .= "Besoin : $besoin\n";
$body .= "Langue : $lang\n";
$body .= "Consentement RGPD : oui\n\n";
$body .= "Message :\n$message\n";

$headers  = "From: SmartMove Pro <$from>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// --- Envoi ---
if (mail($to, $subject, $body, $headers, "-f $from")) {
    $_SESSION['sent'][] = $now;
    go($merciPage);
}

error_log('Erreur mail() contact.php');
go($errorPage . '&reason=send');