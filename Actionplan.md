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

## Phase 11 – Roadmap avancée (prochaines étapes)

### Phase 1: Amélioration de l'Architecture de Base

- [x] Header Global :
  - [x] Header responsive avec recherche intégrée
  - [x] Badges de rôle visuels (Créateur, Spectateur, Admin)
  - [x] Menu utilisateur contextuel selon le rôle
  - [x] Notifications et profil utilisateur
- [x] Sidebar Améliorée :
  - [x] Navigation organisée par sections
  - [x] Liens spécifiques aux créateurs (Analytics, Monétisation, Upload)
  - [x] Navigation contextuelle selon le rôle utilisateur
  - [x] Optimisation mobile avec overlay
- [x] Layout Unifié :
  - [x] Composant Layout réutilisable
  - [x] Gestion responsive de la sidebar
  - [x] Intégration avec le nouveau XDoseApp
- [x] APIs d'Engagement :
  - [x] API Likes : Toggle like/unlike avec compteurs
  - [x] API Comments : CRUD commentaires avec réponses hiérarchiques
  - [x] API Bookmarks : Système de favoris
- [x] Architecture modulaire avec composants réutilisables
- [x] Navigation contextuelle selon le rôle utilisateur
- [x] Système de badges pour identifier visuellement les rôles
- [x] APIs prêtes pour les fonctionnalités d'engagement
- [x] Design responsive optimisé pour mobile et desktop

1.2 Extension du Schéma Prisma
- [x] Like (userId, videoId, createdAt)
- [x] Comment (id, userId, videoId, content, createdAt, parentId pour les réponses)
- [x] Bookmark (userId, videoId, createdAt)
- [x] SubscriptionTier (id, name, price, features, creatorId)
- [x] UserSubscription (id, userId, tierId, status, startDate, endDate)
- [x] Tip (id, fromUserId, toUserId, amount, message, createdAt)
- [x] TextPost (id, userId, content, images, visibility, createdAt)

### Phase 2: Système de Feed Avancé
2.1 Revamp Feed.tsx
- [x] Interface à onglets : "Following", "For You", "Trending"
- [x] Feed "Following" : Contenu des utilisateurs suivis (vidéos + posts textuels)
- [x] Feed "For You" : Algorithme de recommandation basé sur les likes/commentaires
- [x] Feed "Trending" : Intégration de la logique de Tendances.tsx
- [x] Cartes de contenu interactives : Boutons like/réaction, compteurs, options de sauvegarde

2.2 APIs de Support
- [x] /api/likes - Gérer les likes/unlikes
- [x] /api/comments - CRUD pour les commentaires
- [x] /api/bookmarks - Gérer les signets
- [x] /api/feed - Endpoints spécialisés pour chaque type de feed

### Phase 3: Dashboard Créateur Enrichi
3.1 Analytics.tsx - Données Réelles
- Métriques de vues : Intégration avec la base de données de vidéos
- Engagement utilisateur : Données des nouvelles tables Like/Comment
- Croissance des abonnés : Évolution basée sur la table Follows
- Revenus : Une fois la monétisation implémentée

3.2 Monetisation.tsx - Système Complet
- Gestion des tiers d'abonnement : Interface pour créer/modifier les paliers
- Tracking des revenus : Abonnements, pourboires, ventes premium
- Intégration NowPayments : Pour les paiements récurrents et ponctuels

### Phase 4: Système de Monétisation Complet
4.1 Subscription Tiers
- Modèles Prisma : SubscriptionTier et UserSubscription
- Interface créateur : Définir des paliers (Basic, Premium, VIP)
- Interface utilisateur : S'abonner aux créateurs
- Logique de contrôle d'accès : Contenu premium basé sur l'abonnement

4.2 Premium Content
- Marquage de contenu premium : Extension du modèle Video
- Contrôle d'accès : Middleware pour vérifier les abonnements
- Aperçus pour non-abonnés : Teasers de contenu premium

4.3 Système de Pourboires
- Modèle Tip : Transactions de pourboires
- Interface de don : Modal pour envoyer des pourboires
- Notifications : Alertes pour les créateurs

4.4 Revenue Tracking
- Dashboard revenus : Agrégation de toutes les sources
- Analyses détaillées : Tendances, top supporters, etc.

### Phase 5: Extension de la Gestion de Contenu
5.1 Posts Textuels
- Nouveau modèle TextPost : Contenu textuel avec images optionnelles
- Interface de création : Éditeur riche pour les posts
- Paramètres de confidentialité : Public, abonnés uniquement, premium

5.2 Système de Catégories Avancé
- Modèle Category : Remplacer les arrays par des relations
- Tags populaires : Système de trending tags
- Filtres avancés : Multiple sélections, recherche

### Phase 6: Profils Utilisateurs Enrichis
6.1 Creator Profiles Améliorés
- Affichage des tiers d'abonnement : Paliers disponibles sur le profil
- Bouton d'abonnement direct : Workflow simplifié
- Métriques publiques : Nombre d'abonnés, contenu créé
- Galerie de contenu organisée : Onglets pour différents types de contenu

6.2 Profils Spectateurs
- Historique de visionnage : Vidéos regardées
- Contenu sauvegardé : Bookmarks organisés
- Abonnements : Liste des créateurs suivis

### Phase 7: Fonctionnalités Sociales Avancées
7.1 Système de Commentaires
- Commentaires hiérarchiques : Réponses aux commentaires
- Modération : Outils pour les créateurs
- Notifications : Réponses et mentions

7.2 Interactions Sociales
- Système de réactions : Au-delà du simple like
- Partage social : Intégration réseaux sociaux
- Collaborations : Invitations entre créateurs

### Phase 8: Optimisations et Performance
8.1 Caching et Performance
- Cache des requêtes fréquentes : Redis ou cache en mémoire (optionnel)
- Optimisation des images : Compression et formats modernes
- Lazy loading : Chargement progressif du contenu

8.2 SEO et Découverte
- Meta tags dynamiques : Pour chaque profil/vidéo
- Sitemap automatique : Indexation des contenus publics
- Schema markup : Données structurées

### Technologies et Intégrations Nécessaires
- NowPayments : Paiements et abonnements
- Redis : Cache (optionnel)
- Cloudinary/AWS S3 : Stockage d'images optimisé
- WebSockets : Notifications temps réel (optionnel)
- Analytics service : Tracking détaillé des métriques

### Ordre d'Implémentation Recommandé
1. Extension du schéma Prisma (foundation)
2. Header/Navigation globaux (UX improvement)
3. Système de likes/comments (engagement)
4. Feed avancé avec onglets (core feature)
5. Système d'abonnements de base (monetization start)
6. Dashboard créateur enrichi (creator tools)
7. Posts textuels (content diversity)
8. Système de pourboires (monetization complete)
9. Profils enrichis (user experience)
10. Optimisations finales (performance)

Ce plan transformera l'application en une plateforme de contenu complète et moderne, avec un système de monétisation robuste et une expérience utilisateur exceptionnelle. Chaque phase peut être implémentée de manière incrémentale, permettant de tester et valider les fonctionnalités au fur et à mesure.

L'approche privilégie d'abord les fondations (base de données, navigation) puis les fonctionnalités à forte valeur ajoutée (engagement, monétisation) avant de peaufiner l'expérience utilisateur.
