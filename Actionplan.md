# Actionplan.md – Xdose

Ce plan d’action est découpé en phases et micro-tâches actionnables pour finaliser l’application à 100%.

---

## Phase 1 – Authentification & Gestion des rôles

- [x] Page d’inscription/login avec choix du rôle (Spectateur par défaut, demande Créateur)
- [x] Stockage du rôle et du statut de demande dans Supabase (table users/role_requests)
- [x] Redirection automatique selon le rôle après login
- [x] Interface “Devenir créateur” dans le profil
- [x] Backoffice admin pour valider/refuser les demandes créateur
- [x] Notification email lors de la validation/refus
- [ ] Build user profile pages
- [ ] Add creator profile editing

## Phase 2 – Upload & Gestion de vidéos

- [x] Composant upload (créateur) avec gestion drag & drop et File natif
- [x] Stockage vidéo sur Mux (upload direct, playbackId, gestion CORS)
- [x] Synchronisation utilisateurs Supabase <-> Prisma
- [x] Création vidéo en base Prisma avec statut, playbackId, etc.
- [x] Webhook Mux pour update status/URL dans Prisma
- [x] Formulaire métadonnées (titre, description, public/privé)
- [x] Affichage dynamique des vidéos publiques/ready dans l’UI
- [x] Lecteur vidéo moderne (HLS.js, overlay, responsive, UX)
- [x] Gestion des erreurs Mux (webhook, statut error, description)
- [x] Génération miniatures auto Mux
- [ ] Génération miniatures avancée, conversion, formats modernes
- [ ] Workflow de validation vidéo (admin)
- [ ] Backoffice admin pour valider/refuser les vidéos
- [ ] Notification email lors de la validation/refus vidéo
- [ ] Implement content privacy settings
- [ ] Add content categories/tags

## Phase 3 – Paiement & Abonnement

- [ ] Intégration NowPayments (paiement à la vidéo, abonnement)
- [ ] Attribution automatique des droits d’accès après paiement
- [ ] Gestion des accès privés/publics côté backend
- [ ] Interface d’achat/abonnement côté spectateur
- [ ] Revenue tracking

## Phase 4 – Commentaires, Engagement & Modération

- [ ] Système de commentaires sur vidéos gratuites
- [ ] Intégration modération IA (Perspective API ou HuggingFace)
- [ ] File d’attente pour validation manuelle si doute
- [ ] Interface créateur pour modérer ses propres commentaires
- [ ] Interface admin pour modérer tous les commentaires
- [ ] Implement like/reaction system
- [ ] Implement follow/unfollow functionality
- [ ] Build messaging interface
- [ ] Add content sharing features

## Phase 5 – Lecteur vidéo & expérience utilisateur

- [x] Intégration lecteur adaptatif (HLS.js, overlay, responsive)
- [ ] Support sous-titres, miniatures timeline
- [ ] Accessibilité (clavier, ARIA, contrastes)
- [x] Responsive design (web + mobile)

## Phase 6 – Découverte, recherche & feed

- [x] Moteur de recherche (tags, titres, créateurs)
- [x] Page tendances, recommandations simples
- [x] Build content feed/grid view
- [x] Add content filtering and search

## Phase 7 – Notifications & emails

- [ ] Intégration email transactionnel (validation créateur, vidéo, etc.)
- [ ] Système de notification in-app (optionnel)

## Phase 8 – Mobile & PWA

- [ ] Démarrage projet Expo/React Native (mobile natif)
- [ ] Synchronisation des fonctionnalités principales (auth, upload, paiement, lecture)
- [ ] Préparer la base pour PWA (V2)

## Phase 9 – Dashboard & Analytics

- [ ] Creator analytics dashboard
- [ ] Dashboard analytics pour créateurs
- [ ] Follower insights
- [ ] Revenue tracking

## Phase 10 – Qualité, CI/CD, sécurité

- [ ] Tests unitaires et e2e sur tous les modules critiques
- [ ] Audit sécurité (auth, paiement, accès vidéos)
- [x] CI/CD complète (lint, test, build, déploiement)
- [ ] Documentation technique et onboarding

---

**À cocher au fil de l’avancement. Découper chaque phase en issues/tickets si besoin.**
