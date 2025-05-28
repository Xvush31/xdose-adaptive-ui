# Roadmap Checklist – Préparation Production React + Vite

## 1. Initialisation & Nettoyage

- [x] Supprimer les fichiers/dossiers inutiles ou obsolètes
- [x] Réorganiser la structure du projet (`src/components/`, `src/pages/`, `src/hooks/`, `src/assets/`, `src/lib/`)
- [x] Ajouter un README clair et structuré

## 2. Qualité & Standards

- [x] Installer et configurer ESLint
- [x] Installer et configurer Prettier
- [x] Installer et configurer Husky
- [x] Installer et configurer commitlint
- [x] Ajouter les scripts lint/format dans `package.json` ou `justfile`/`Taskfile.yml`
- [x] Configurer les hooks pre-commit (lint, format, test)

## 3. Tests & Robustesse

- [x] Installer Vitest + React Testing Library
- [x] Ajouter les scripts de test unitaire + coverage
- [x] Intégrer un exemple de test (ex : composant Button)

## 4. Performance & Optimisation

- [x] Mettre en place le lazy loading des routes/pages
- [x] Installer et configurer vite-plugin-analyzer (ou rollup-plugin-visualizer)
- [x] Optimiser les images/assets (compression, formats modernes)
  - [x] Script d’optimisation généré (`scripts/optimize-images.cjs`)
  - [x] Commande justfile `just optimize-images` ajoutée
  - [x] Images optimisées présentes dans `public_optimized/`
  - [x] Vérification manuelle de la réduction de taille et des formats WebP

## 5. Accessibilité & SEO

- [x] Effectuer un audit Lighthouse (a11y, SEO)
- [x] Vérifier les labels, contrastes, navigation clavier
- [x] Ajouter les metatags essentiels dans `index.html`

## 6. Déploiement & CI/CD

- [x] Configurer un pipeline GitHub Actions (ou autre)
- [x] Générer automatiquement le build + lancer les tests
- [x] Préparer la config pour Vercel, Netlify ou autre

## 7. Automatisation des tâches

- [x] Générer un `justfile` ou `Taskfile.yml` pour automatiser les commandes courantes
  - [x] Commande `just dev` testée et validée
  - [x] Commande `just test` testée et validée
  - [x] Commande `just lint` testée et validée
  - [x] Commande `just format` testée et validée
  - [x] Commande `just build` testée et validée
  - [x] Commande `just coverage` testée et validée
  - [ ] Commande `just deploy` testée et validée (optionnel, nécessite Vercel CLI configuré)
  - [x] Commande `just optimize-images` testée et validée

---

**À cocher au fil de l’avancement du projet.**
