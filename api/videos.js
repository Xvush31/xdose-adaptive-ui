const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('API /api/videos called', req.method);
  if (req.method === 'POST') {
    const { title, description, fileUrl, userId, visibility } = req.body;
    try {
      if (!title || !fileUrl || !userId) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      const parsedUserId = parseInt(userId, 10);
      const video = await prisma.video.create({
        data: { title, description, fileUrl, userId: parsedUserId, visibility },
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

module.exports = handler;
