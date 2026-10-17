# Diagnostic SmartMove — version 17 octobre 2026

## Périmètre
Site statique bilingue FR/EN : accueil, partenaires, contact, épargne & retraite, mentions légales et confidentialité.

## Données légales intégrées
- SmartMove Pro Assurances — nom commercial : SmartMove Conseil & Assurances
- Entreprise Individuelle — 38 rue des Mathurins, 75008 Paris
- SIREN 847499522 — ORIAS 26010786
- Contrôle ACPR : 4 place de Budapest, 75009 Paris

La vérification de l’immatriculation ORIAS reste recommandée sur orias.fr. RCP, médiateur, hébergeur, e-mail et téléphone restent à confirmer avant publication.

## Contrôles effectués
- Parsing HTML local avec Python `html.parser` : 12/12 pages sans erreur structurelle.
- Liens internes : vérifiés contre les fichiers du dossier ; aucun fichier manquant.
- Cohérence adresse/SIREN/ORIAS : vérifiée sur les 12 pages FR/EN.
- Archive ZIP régénérée et contrôlée.

## Limites
Le formulaire utilise un `mailto:` statique ; pour une mise en production, prévoir un endpoint sécurisé et tester la réception. Le consentement et le honeypot sont côté navigateur et ne remplacent pas une validation serveur.
