import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

// POST: { followerId, followedId, action: 'follow' | 'unfollow' }
// GET: ?followerId=...&followedId=...
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { followerId, followedId, action } = req.body;
    if (!followerId || !followedId || followerId === followedId) {
      res.status(400).json({ error: 'Invalid follow request' });
      return;
    }
    try {
      if (action === 'follow') {
        await prisma.follows.upsert({
          where: { followerId_followedId: { followerId, followedId } },
          update: {},
          create: { followerId, followedId },
        });
        res.status(200).json({ followed: true });
      } else if (action === 'unfollow') {
        await prisma.follows.deleteMany({ where: { followerId, followedId } });
        res.status(200).json({ followed: false });
      } else {
        res.status(400).json({ error: 'Invalid action' });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else if (req.method === 'GET') {
    const { followerId, followedId } = req.query;
    if (!followerId || !followedId) {
      res.status(400).json({ error: 'Missing params' });
      return;
    }
    try {
      const follow = await prisma.follows.findUnique({
        where: { followerId_followedId: { followerId, followedId } },
      });
      res.status(200).json({ followed: !!follow });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(405).end();
  }
}
