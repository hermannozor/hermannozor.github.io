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
