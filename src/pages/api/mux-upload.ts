import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Mux from '@mux/mux-node';

const prisma = new PrismaClient();

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
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
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  } else {
    res.status(405).end();
  }
}
