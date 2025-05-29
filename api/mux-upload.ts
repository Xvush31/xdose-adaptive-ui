import { PrismaClient } from '../prisma/generated/client';
import Mux from '@mux/mux-node';

const prisma = new PrismaClient();

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// Vercel/Node handler signature
async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, userId, visibility } = req.body;
    try {
      // 1. Créer un upload direct Mux
      const upload = await mux.video.uploads.create({
        new_asset_settings: { playback_policy: ['public'] },
        cors_origin: '*',
      });
      // 2. Créer la vidéo en base avec status 'pending' et l'ID d'upload Mux
      const video = await prisma.video.create({
        data: {
          title,
          description,
          fileUrl: '', // sera rempli après le webhook
          muxAssetId: '', // sera rempli après le webhook
          muxUploadId: upload.id, // stocke l'uploadId Mux
          status: 'pending',
          visibility: visibility || 'public',
          userId,
        },
      });
      res.status(201).json({
        videoId: video.id,
        uploadUrl: upload.url,
        uploadId: upload.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}

export default handler;
