import { PrismaClient } from '../prisma/generated/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, fileUrl, userId, visibility } = req.body;
    try {
      const video = await prisma.video.create({
        data: { title, description, fileUrl, userId, visibility }
      });
      res.status(201).json(video);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const videos = await prisma.video.findMany({ include: { user: true } });
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
