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

  const { type } = req.query;
  if (!type || (type !== 'video' && type !== 'text')) {
    res.status(400).json({ error: 'type parameter required: video or text' });
    return;
  }

  // TEXT POST LOGIC
  if (type === 'text') {
    if (req.method === 'GET') {
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
    return;
  }

  // VIDEO LOGIC
  if (type === 'video') {
    if (req.method === 'GET') {
      try {
        if (req.query && req.query.recommendations) {
          const recommended = await prisma.video.findMany({
            where: { status: 'ready', visibility: 'public' },
            orderBy: { id: 'desc' },
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
        let orderBy = { createdAt: 'desc' };
        if (sort === 'popular') {
          orderBy = { views: 'desc' };
        }
        const videos = await prisma.video.findMany({
          where,
          orderBy,
          include: { user: true },
        });
        const cleanedVideos = videos.map((video) => ({
          ...video,
          user: video.user
            ? {
                name: video.user.name || null,
                email: video.user.email,
              }
            : null,
        }));
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(cleanedVideos);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).end();
    }
    return;
  }
}
