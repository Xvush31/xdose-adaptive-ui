import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

type VideoType = {
  id: string;
  title: string;
  description: string;
  userId: string;
  fileUrl: string;
  muxAssetId: string;
  muxUploadId: string;
  status: string;
  visibility: string;
  createdAt: Date;
  user?: {
    id: string;
    name?: string | null;
    email: string;
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
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

  try {
    if (req.method === 'GET') {
      console.log('[DEBUG][videos.js] Début requête GET');
      const videos = await prisma.video.findMany({
        include: {
          user: true,
        },
      });

      console.log('[DEBUG][videos.js] Videos trouvées:', videos.length);

      // Clean up undefined/null values for JSON serialization
      const cleanedVideos = videos.map((video: VideoType) => ({
        ...video,
        user: video.user
          ? {
              id: video.user.id,
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
      return;
    }

    if (req.method === 'POST') {
      const { title, description, fileUrl, userId, visibility } = req.body;
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
      return;
    }

    res.status(405).end();
  } catch (error) {
    console.error('[videos.js] Erreur:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
