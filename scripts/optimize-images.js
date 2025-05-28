// Script Node.js pour optimiser les images du dossier public/
// Utilise imagemin et plugins pour JPEG, PNG, SVG, WebP

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const path = require('path');
const fs = require('fs');

const INPUT_DIR = path.join(__dirname, 'public');
const OUTPUT_DIR = path.join(__dirname, 'public_optimized');

(async () => {
  // Crée le dossier de sortie s'il n'existe pas
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  // Optimisation JPEG/PNG/SVG
  await imagemin([`${INPUT_DIR}/*.{jpg,jpeg,png,svg}`], {
    destination: OUTPUT_DIR,
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: [0.7, 0.9] }),
      imageminSvgo(),
    ],
  });

  // Génération WebP
  await imagemin([`${INPUT_DIR}/*.{jpg,jpeg,png}`], {
    destination: OUTPUT_DIR,
    plugins: [imageminWebp({ quality: 80 })],
  });

  console.log('Optimisation terminée. Fichiers optimisés dans public_optimized/.');
})();
