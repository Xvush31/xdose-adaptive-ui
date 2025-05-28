// Script Node.js pour optimiser les images du dossier public/ (CommonJS)
const imagemin = require('imagemin').default;
const imageminMozjpeg = require('imagemin-mozjpeg').default;
const imageminPngquant = require('imagemin-pngquant').default;
const imageminSvgo = require('imagemin-svgo').default;
const imageminWebp = require('imagemin-webp').default;
const path = require('path');
const fs = require('fs');

const INPUT_DIR = path.join(__dirname, '../public');
const OUTPUT_DIR = path.join(__dirname, '../public_optimized');

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  await imagemin([`${INPUT_DIR}/*.{jpg,jpeg,png,svg}`], {
    destination: OUTPUT_DIR,
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: [0.7, 0.9] }),
      imageminSvgo(),
    ],
  });
  await imagemin([`${INPUT_DIR}/*.{jpg,jpeg,png}`], {
    destination: OUTPUT_DIR,
    plugins: [imageminWebp({ quality: 80 })],
  });
  console.log('Optimisation terminée. Fichiers optimisés dans public_optimized/.');
})();
