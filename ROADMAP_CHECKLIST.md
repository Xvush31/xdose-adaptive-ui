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

- [ ] Installer Vitest + React Testing Library
- [ ] Ajouter les scripts de test unitaire + coverage
- [ ] Intégrer un exemple de test (ex : composant Button)

## 4. Performance & Optimisation

- [ ] Mettre en place le lazy loading des routes/pages
- [ ] Installer et configurer vite-plugin-analyzer (ou rollup-plugin-visualizer)
- [ ] Optimiser les images/assets (compression, formats modernes)

## 5. Accessibilité & SEO

- [ ] Effectuer un audit Lighthouse (a11y, SEO)
- [ ] Vérifier les labels, contrastes, navigation clavier
- [ ] Ajouter les metatags essentiels dans `index.html`

## 6. Déploiement & CI/CD

- [ ] Configurer un pipeline GitHub Actions (ou autre)
- [ ] Générer automatiquement le build + lancer les tests
- [ ] Préparer la config pour Vercel, Netlify ou autre

## 7. Automatisation des tâches

- [ ] Générer un `justfile` ou `Taskfile.yml` pour automatiser les commandes courantes
  - [ ] just dev
  - [ ] just test
  - [ ] just lint
  - [ ] just format
  - [ ] just build
  - [ ] just deploy

---

**À cocher au fil de l’avancement du projet.**
