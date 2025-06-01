import { PrismaClient } from '../prisma/generated/client/index.js';
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
      // Recommandations personnalisées ou trending
      if (req.query && req.query.recommendations) {
        // Exemple simple : vidéos les plus vues (ou aléatoires si pas de stats)
        const recommended = await prisma.video.findMany({
          where: { status: 'ready', visibility: 'public' },
          orderBy: { id: 'desc' }, // Remplacer par 'views' si dispo
          take: 8,
          include: { user: true },
        });
        const cleaned = recommended.map((video) => ({
          ...video,
          user: video.user
            ? {
                name: video.user.name || null,
                email: video.user.email,
              }
            : null,
        }));
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(cleaned);
        return;
      }

      console.log('[DEBUG][videos.js] Début requête GET');
      // Filtres avancés : catégories, popularité, tags, créateur
      const { category, tag, creator, sort } = req.query;
      const where = {};
      if (category) {
        where.categories = { has: category };
      }
      if (tag) {
        where.tags = { has: tag };
      }
      if (creator) {
        where.userId = creator;
      }
      // Popularité : tri par vues (desc) si demandé
      let orderBy = { createdAt: 'desc' };
      if (sort === 'popular') {
        orderBy = { views: 'desc' };
      }
      const videos = await prisma.video.findMany({
        where,
        orderBy,
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
    // Ajout des champs categories et tags
    const { title, description, fileUrl, userId, visibility, categories, tags } = req.body;
    try {
      if (!title || !userId) {
        console.error('[videos.js] Champs requis manquants', req.body);
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      const video = await prisma.video.create({
        data: {
          title,
          description,
          fileUrl: fileUrl || '',
          userId,
          visibility,
          categories: categories || [],
          tags: tags || [],
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

export default handler;
