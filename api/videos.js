const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('API /api/videos called', req.method, req.body);
  if (req.method === 'POST') {
    const { title, description, fileUrl, userId, visibility } = req.body;
    try {
      if (!title || !userId) {
        console.error('[videos.js] Champs requis manquants', req.body);
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      // fileUrl peut être vide ou undefined (pour Mux)
      const video = await prisma.video.create({
        data: {
          title,
          description,
          fileUrl: fileUrl || '',
          userId,
          visibility,
        },
      });
      console.log('[videos.js] Vidéo créée', video);
      res.status(201).json(video);
    } catch (error) {
      console.error('[videos.js] Erreur Prisma:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const videos = await prisma.video.findMany({ include: { user: true } });
      console.log('[videos.js] GET vidéos', videos.length);
      res.status(200).json(videos);
    } catch (error) {
      console.error('[videos.js] Erreur GET:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}

module.exports = handler;
