(function(){'use strict';
 const menu=document.querySelector('[data-menu]'),nav=document.querySelector('[data-nav]');
 if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});
 const cookie=document.querySelector('[data-cookie]'); if(cookie){if(localStorage.getItem('sm-cookie-choice'))cookie.hidden=true;cookie.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('sm-cookie-choice',b.dataset.choice);cookie.hidden=true;}));}
 const form=document.querySelector('[data-contact-form]'); if(form)form.addEventListener('submit',e=>{if(form.querySelector('[name=website]').value){e.preventDefault();return;} });
})();

// ---------- Message d'erreur du formulaire de contact ----------
(function () {
  var params = new URLSearchParams(window.location.search);
  if (!params.has('error')) return;

  var isEn = document.documentElement.lang === 'en';
  var reason = params.get('reason');

  var messages = {
    fr: {
      def:  "Votre message n'a pas pu être envoyé. Vérifiez que tous les champs sont remplis et que vous avez accepté la politique de confidentialité.",
      rate: "Vous avez envoyé trop de demandes en peu de temps. Merci de réessayer dans quelques minutes.",
      send: "Un problème technique empêche l'envoi. Écrivez-nous directement à contact@smartmovepro.fr."
    },
    en: {
      def:  "Your message could not be sent. Please check that all fields are filled in and that you have accepted the privacy policy.",
      rate: "You have sent too many requests in a short time. Please try again in a few minutes.",
      send: "A technical problem prevented sending. Please write to us directly at contact@smartmovepro.fr."
    }
  };

  var set = isEn ? messages.en : messages.fr;
  var text = set[reason] || set.def;

  var form = document.querySelector('form[action="/contact.php"]');
  if (!form) return;

  var box = document.createElement('div');
  box.className = 'form-error';
  box.setAttribute('role', 'alert');
  box.textContent = text; // textContent : pas d'injection HTML possible

  form.parentNode.insertBefore(box, form);
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
})();