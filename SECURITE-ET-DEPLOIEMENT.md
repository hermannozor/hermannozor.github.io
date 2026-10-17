# Sécurité & déploiement

## Protections intégrées
- CSP restrictive sans scripts tiers ; liens internes relatifs.
- `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`.
- Formulaire avec consentement explicite et champ honeypot anti-robot.
- Bannière de cookies : cookies nécessaires uniquement, choix mémorisé en `localStorage`.
- Liens externes ORIAS avec `rel="noopener noreferrer"`.

## À configurer côté hébergeur
Ajouter les en-têtes HTTP : `Content-Security-Policy` (reprendre celle des pages), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictive et HSTS uniquement après activation HTTPS.

## Avant publication
Confirmer RCP, médiateur, hébergeur, e-mail et téléphone. Vérifier ORIAS sur orias.fr. Remplacer `mailto:` par un endpoint serveur sécurisé avec validation, limitation de débit, journalisation minimale et protection anti-CSRF adaptée.
