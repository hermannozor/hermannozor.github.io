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
                console.error("Aucune information géographique disponible pour ce lieu.");
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