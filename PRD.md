# Product Requirements Document (PRD) – Xdose

## 1. Vision

Créer une plateforme tout-en-un permettant aux créateurs de contenu de gérer, publier et monétiser leurs vidéos avec des outils professionnels et une expérience utilisateur exceptionnelle.

## 2. Objectifs

- Offrir une alternative moderne aux plateformes existantes (ex : OnlyFans)
- Donner plus de contrôle aux créateurs sur leur contenu
- Faciliter la monétisation des créations
- Fournir des analyses détaillées des performances

## 3. Personas

- **Créateur Indépendant** : Outils simples, monétisation directe, communauté engagée
- **Petite Entreprise Média** : Gestion d'équipe, analyse avancée, marque personnalisée
- **Spectateur** : Accès aux vidéos gratuites/publiques, possibilité de payer pour du contenu premium, commenter

## 4. Fonctionnalités Principales

### 4.1 Authentification & Gestion de Rôles

- Inscription avec rôle Spectateur par défaut
- Option “Devenir créateur” (validation manuelle, notification email)
- Gestion stricte des droits (créateur vs spectateur)

### 4.2 Upload & Gestion de Vidéos

- Upload drag & drop, multi-formats (MP4, MOV, AVI)
- Organisation en playlists/collections
- Edition titre, description, tags
- Choix gratuit/public ou payant/privé
- Workflow de validation vidéo (admin)

### 4.3 Paiement & Abonnement (NowPayments)

- Paiement à la vidéo ou abonnement mensuel
- Attribution automatique des droits après paiement

### 4.4 Commentaires & Modération

- Commentaires sur vidéos gratuites
- Modération automatique (IA) + créateur (pour ses vidéos)
- File d’attente pour validation manuelle si doute

### 4.5 Lecteur Vidéo Adaptatif

- Streaming adaptatif (DASH/HLS)
- Sous-titres, miniatures, accessibilité

### 4.6 Découverte & Recherche

- Moteur de recherche, filtres par tags/catégories
- Page tendances, recommandations simples

### 4.7 Admin/Modération

- Validation des créateurs et vidéos
- Modération des commentaires

### 4.8 Notifications

- Email lors de la validation/refus de demande créateur
- Email lors de la validation/refus vidéo

### 4.9 Mobile

- Application mobile native (Expo/React Native) dès la V1
- PWA à partir de la V2

## 5. Contraintes

- RGPD, Accessibilité WCAG 2.1 AA, support navigateurs récents, responsive/mobile natif

## 6. Risques

- Problèmes de performance vidéo (atténuation : Cloudflare Stream, tests de charge)
- Faible adoption créateurs (atténuation : programme de lancement)

## 7. Métriques de Succès

- Temps moyen passé, taux de rétention, nombre de vidéos visionnées, temps de chargement, taux de disponibilité, temps de réponse API

---

## MVP Flow

1. Inscription (Spectateur par défaut, option “Devenir créateur”)
2. Validation manuelle pour devenir créateur (email)
3. Upload vidéo (créateur)
4. Validation vidéo (admin)
5. Publication vidéo (gratuite/publique ou payante/privée)
6. Paiement/abonnement (NowPayments)
7. Visionnage (public ou après paiement)
8. Commentaires (modération IA + créateur)
9. Analytics (créateur)

---

## Tech Stack

- Frontend : React + Vite, Tailwind, Expo/React Native (mobile)
- Backend : Supabase (auth, storage, DB), Node.js (traitement vidéo), Cloudflare Stream (CDN/streaming)
- Paiement : NowPayments
- Modération IA : Perspective API ou HuggingFace
- CI/CD : GitHub Actions, Vercel
- Email : Supabase/Resend
