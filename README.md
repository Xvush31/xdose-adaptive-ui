# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/53ca51b6-55f0-40db-90d9-d030462b9a11

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/53ca51b6-55f0-40db-90d9-d030462b9a11) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/53ca51b6-55f0-40db-90d9-d030462b9a11) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# XDose Adaptive UI

Projet React + Vite pour l’interface utilisateur adaptative XDose.

## Table des matières
- [Démarrage rapide](#démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Qualité & Standards](#qualité--standards)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Technologies](#technologies)

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Structure du projet

- `src/components/` : composants UI réutilisables
- `src/components/ui/` : primitives UI (boutons, inputs, etc.)
- `src/pages/` : pages principales de l’application
- `src/hooks/` : hooks personnalisés
- `src/lib/` : utilitaires JS/TS
- `src/integrations/` : intégrations externes (ex : supabase)
- `public/` : assets statiques (images, favicon, etc.)

## Scripts disponibles

- `npm run dev` : démarre le serveur de développement
- `npm run build` : build de production
- `npm run preview` : prévisualisation du build
- `npm run lint` : analyse statique du code
- `npm run test` : lance les tests unitaires (à configurer)

## Qualité & Standards
- ESLint, Prettier, Husky, commitlint (voir roadmap pour installation)

## Tests
- Vitest + React Testing Library (voir roadmap pour installation)

## Déploiement
- Compatible Vercel, Netlify, Lovable, etc.
- Voir la documentation de la cible choisie

## Technologies
- React, Vite, TypeScript, Tailwind CSS, shadcn-ui

---

Pour plus de détails, voir le fichier `ROADMAP_CHECKLIST.md`.
