
const CLIENT_ID = window.CONFIG.GOOGLE_CLIENT_ID;
const API_KEY = window.CONFIG.GOOGLE_API_KEY;
const SCOPES = window.CONFIG.GOOGLE_SCOPES;

function handleBookingSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const destination = document.getElementById('destination').value;

    if (name && date && destination) {
        const confirmationMessage = `
            <h3>Réservation confirmée</h3>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Date et Heure :</strong> ${date}</p>
            <p><strong>Destination :</strong> ${destination}</p>
            <p>Merci pour votre réservation, nous vous contacterons bientôt.</p>
        `;
        document.getElementById('confirmation-message').innerHTML = confirmationMessage;
    } else {
        document.getElementById('confirmation-message').innerHTML = '<p style="color: red;">Veuillez remplir tous les champs.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.toggle-testimonial');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.nextElementSibling;
            text.style.display = text.style.display === 'block' ? 'none' : 'block';
        });
    });
});


// Récupérer l'élément burger et le menu
const burger = document.getElementById('burger-menu');
const menu = document.querySelector('nav ul');

// Ajouter l'événement de clic au bouton burger
burger.addEventListener('click', function() {
    menu.classList.toggle('active'); // Toggle la classe "active" pour afficher/masquer le menu
});

// Fonction de gestion de l'auto-complétion
async function initAutocomplete() {
    const inputs = document.querySelectorAll("input[name='pickup'], input[name='destination']");

    if (!inputs.length) {
        console.error("Aucun champ d'adresse trouvé.");
        return;
    }

    const options = {
        componentRestrictions: { country: "fr" },
        types: ["address"],
    };

    inputs.forEach(input => {
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                console.error("Aucune information gé ographique disponible pour ce lieu.");
                return;
            }
            console.log(`Lieu sélectionné pour ${input.name} :`, place);
        });
    });
}

function loadGoogleMapsScript() {
    if (window.google && window.google.maps) {
        console.log("Google Maps API déjà chargée.");
        initAutocomplete();
        return;
    }

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB99hOYVLYTAzs-gZ2dJ1THquaJszhn-GY&libraries=places&callback=initAutocomplete";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

window.addEventListener("load", loadGoogleMapsScript);


// Charger les variables d'environnement (si exécuté côté serveur)
// Initialiser l'API Google et l'authentification
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: window.CONFIG.GOOGLE_CLIENT_ID,
        cookiepolicy: "single_host_origin", 
        scope: SCOPES,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    }).then(() => {
        auth2 = gapi.auth2.getAuthInstance();
        if (auth2.isSignedIn.get()) {
            console.log("Utilisateur déjà connecté.");
            listEvents();  
        } else {
            console.log("Utilisateur non connecté.");
        }
    }).catch(error => {
        console.error("Erreur lors de l'initialisation de l'API :", error);
    });
}

// Récupérer les événements du calendrier
function listEvents() {
    gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }).then(response => {
        const events = response.result.items;
        if (events.length > 0) {
            console.log('Prochains événements :');
            events.forEach(event => {
                console.log(`${event.summary} (${event.start.dateTime || event.start.date})`);
            });
        } else {
            console.log('Aucun événement trouvé.');
        }
    }).catch(error => {
        console.error("Erreur lors de la récupération des événements :", error);
    });
}

//Système de notification après la soumission du formulaire de réservation
function handleBookingSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("confirmation-message").innerHTML = 
            `<p style="color: green;">Réservation confirmée ! Vous recevrez un email de confirmation.</p>`;
    })
    .catch(error => {
        console.error("Erreur lors de la réservation :", error);
        document.getElementById("confirmation-message").innerHTML = 
            `<p style="color: red;">Une erreur est survenue. Veuillez réessayer.</p>`;
    });
}  

// Récupérer les éléments de la page
const signOutBtn = document.getElementById("signout-btn");
const userInfo = document.getElementById("user-info");

// Fonction appelée après connexion
function handleCredentialResponse(response) {
    console.log("Jeton reçu :", response.credential);

    // Envoyer le jeton au backend pour validation
    fetch("http://localhost:3000/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: response.credential })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Réponse du backend :", data);
        if (data.success) {
            userInfo.innerHTML = `<p>Connecté en tant que <b>${data.name}</b></p>`;
            signOutBtn.style.display = "block";
        } else {
            alert("Erreur d'authentification !");
        }
    })
    .catch(err => console.error("Erreur :", err));
}

// Charger Google Identity Service
document.addEventListener('DOMContentLoaded', function () {
    // Injecter dynamiquement le CLIENT_ID dans l'élément g_id_onload
    const gIdOnload = document.getElementById("g_id_onload");
    gIdOnload.setAttribute("data-client_id", window.CONFIG.GOOGLE_CLIENT_ID);
});

// Déconnexion (supprime le jeton de session)
signOutBtn.addEventListener("click", () => {
    google.accounts.id.disableAutoSelect();
    userInfo.innerHTML = "";
    signOutBtn.style.display = "none";
    alert("Déconnecté !");
});
