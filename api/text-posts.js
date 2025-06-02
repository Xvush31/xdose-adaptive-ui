import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // GET /api/text-posts?user_id=xxx
    try {
      const { user_id } = req.query;
      const where = user_id ? { userId: user_id } : {};
      const posts = await prisma.textPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    // POST /api/text-posts (créer un post)
    try {
      const { userId, content, images, visibility } = req.body;
      if (!userId || !content) {
        return res.status(400).json({ error: 'userId, content required' });
      }
      const post = await prisma.textPost.create({
        data: {
          userId,
          content,
          images: images || [],
          visibility: visibility || 'public',
        },
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    // PUT /api/text-posts?id=xxx
    try {
      const { id } = req.query;
      const { content, images, visibility } = req.body;
      if (!id) return res.status(400).json({ error: 'id required' });
      const post = await prisma.textPost.update({
        where: { id },
        data: { content, images, visibility },
      });
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    // DELETE /api/text-posts?id=xxx
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id required' });
      await prisma.textPost.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
