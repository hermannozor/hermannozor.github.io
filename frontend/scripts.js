
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
    const accessToken = response.credential; // Assurez-vous que ce champ est disponible
    localStorage.setItem('google_access_token', accessToken);
    console.log("Jeton reçu :", response.credential);

    // Envoyer le jeton au backend pour validation
    fetch("https://smartmovepro.fr/verify-token", {
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

// Récupérer les événements du calendrier
  function listEvents(date) {
    console.log("🔎 gapi.client:", gapi.client);
    console.log("🔎 gapi.client.calendar:", gapi.client ? gapi.client.calendar : "gapi.client est undefined");

    if (!gapi.client || !gapi.client.calendar) {
        console.error("Google API Client n'est pas chargé ou `calendar` est indisponible !");
        return;
    }

    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': new Date(date).toISOString(),
        'timeMax': new Date(new Date(date).setHours(23, 59, 59)).toISOString(),
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        if (events.length > 0) {
            console.log('Upcoming events:', events);
        } else {
            console.log('No events found.');
        }
    }).catch(error => {
        console.error("Erreur lors de la récupération des événements :", error);
    });
}


function handleDateChange() {
    const dateInput = document.getElementById('date');
    const selectedDate = dateInput.value;
    const selectedDay = new Date(selectedDate).getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
    
    if (selectedDay >= 1 && selectedDay <= 4) { // Bloque lundi (1) à jeudi (4)
        alert("⚠️ Sélection invalide ! \nLes réservations sont disponibles le vendredi soir, ainsi que toute la journée du samedi et du dimanche. \nPour une réservation en soirée en semaine, veuillez nous contacter via notre formulaire. \nMerci pour votre compréhension !");
        dateInput.value = ""; // Réinitialise la sélection
        return;
    }
    
    console.log("Date value:", selectedDate);
    if (selectedDate) {
        fetch('https://smartmovepro.fr/get-events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('google_access_token')}`,
            },
            body: JSON.stringify({ date: selectedDate }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Événements récupérés:", data);
        })
        .catch(error => {
            console.error("Erreur:", error);
        });
    }
}
document.getElementById('date').addEventListener('change', handleDateChange);
    

// Met à jour l'attribut 'min' avec la date du jour pour empêcher la sélection des dates passées
document.getElementById("date").setAttribute("min", new Date().toISOString().split("T")[0]);

function initGoogleAPI() {
    console.log("ça passe dans initGoogleAPI");
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: window.CONFIG.GOOGLE_API_KEY,
            clientId: window.CONFIG.GOOGLE_CLIENT_ID,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: "https://www.googleapis.com/auth/calendar.readonly"
        }).then(() => {
            console.log("✅ Google API chargé avec succès !");
            document.getElementById("date").disabled = false; // Active l'input date
            return gapi.client.load('calendar', 'v3');
        }).catch(error => {
            console.error("❌ Erreur lors du chargement de Google API", error);
        });
    });
}

  window.onload = function () {
    document.querySelectorAll("form").forEach(form => form.reset());
  };
