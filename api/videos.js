const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('[DEBUG][videos.js] API appelée', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
  });

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      console.log('[DEBUG][videos.js] Début requête GET');
      const videos = await prisma.video.findMany({
        include: {
          user: true,
        },
      });

      console.log('[DEBUG][videos.js] Videos trouvées:', videos.length);

      // Clean up undefined/null values for JSON serialization
      const cleanedVideos = videos.map((video) => ({
        ...video,
        user: video.user
          ? {
              name: video.user.name || null,
              email: video.user.email,
            }
          : null,
      }));

      console.log(
        '[DEBUG][videos.js] Envoi réponse:',
        JSON.stringify(cleanedVideos).slice(0, 200) + '...',
      );

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(cleanedVideos);
    } catch (error) {
      console.error('[DEBUG][videos.js] Erreur GET:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
    return;
  } else if (req.method === 'POST') {
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
  } else {
    res.status(405).end();
  }
}

module.exports = handler;
