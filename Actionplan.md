# Actionplan.md – Xdose

Ce plan d’action est découpé en phases et micro-tâches actionnables pour finaliser l’application à 100%.

---

## Phase 1 – Authentification & Gestion des rôles

- [x] Page d’inscription/login avec choix du rôle (Spectateur par défaut, demande Créateur)
- [x] Stockage du rôle et du statut de demande dans Supabase (table users/role_requests)
- [ ] Redirection automatique selon le rôle après login
- [ ] Interface “Devenir créateur” dans le profil
- [ ] Backoffice admin pour valider/refuser les demandes créateur
- [ ] Notification email lors de la validation/refus

## Phase 2 – Upload & Gestion de vidéos

- [ ] Composant upload drag & drop (créateur)
- [ ] Stockage vidéo Supabase Storage + Cloudflare Stream
- [ ] Génération miniatures, conversion, formats modernes
- [ ] Formulaire métadonnées (titre, description, tags, public/privé)
- [ ] Workflow de validation vidéo (admin)
- [ ] Backoffice admin pour valider/refuser les vidéos
- [ ] Notification email lors de la validation/refus vidéo

## Phase 3 – Paiement & Abonnement

- [ ] Intégration NowPayments (paiement à la vidéo, abonnement)
- [ ] Attribution automatique des droits d’accès après paiement
- [ ] Gestion des accès privés/publics côté backend
- [ ] Interface d’achat/abonnement côté spectateur

## Phase 4 – Commentaires & Modération

- [ ] Système de commentaires sur vidéos gratuites
- [ ] Intégration modération IA (Perspective API ou HuggingFace)
- [ ] File d’attente pour validation manuelle si doute
- [ ] Interface créateur pour modérer ses propres commentaires
- [ ] Interface admin pour modérer tous les commentaires

## Phase 5 – Lecteur vidéo & expérience utilisateur

- [ ] Intégration lecteur adaptatif (DASH/HLS, Video.js ou équivalent)
- [ ] Support sous-titres, miniatures timeline
- [ ] Accessibilité (clavier, ARIA, contrastes)
- [ ] Responsive design (web + mobile)

## Phase 6 – Découverte, recherche & analytics

- [ ] Moteur de recherche (tags, titres, créateurs)
- [ ] Page tendances, recommandations simples
- [ ] Dashboard analytics pour créateurs

## Phase 7 – Notifications & emails

- [ ] Intégration email transactionnel (validation créateur, vidéo, etc.)
- [ ] Système de notification in-app (optionnel)

## Phase 8 – Mobile & PWA

- [ ] Démarrage projet Expo/React Native (mobile natif)
- [ ] Synchronisation des fonctionnalités principales (auth, upload, paiement, lecture)
- [ ] Préparer la base pour PWA (V2)

## Phase 9 – Qualité, CI/CD, sécurité

- [ ] Tests unitaires et e2e sur tous les modules critiques
- [ ] Audit sécurité (auth, paiement, accès vidéos)
- [ ] CI/CD complète (lint, test, build, déploiement)
- [ ] Documentation technique et onboarding

---

**À cocher au fil de l’avancement. Découper chaque phase en issues/tickets si besoin.**
