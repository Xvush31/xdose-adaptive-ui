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
    // GET /api/subscriptions?user_id=xxx ou ?creator_id=xxx
    try {
      const { user_id, creator_id } = req.query;
      let where = {};
      if (user_id) where = { userId: user_id };
      if (creator_id) where = { ...where, tier: { creatorId: creator_id } };
      const subs = await prisma.userSubscription.findMany({
        where,
        include: { tier: true },
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(subs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    // POST /api/subscriptions (s'abonner)
    try {
      const { userId, tierId, status, startDate, endDate } = req.body;
      if (!userId || !tierId) {
        return res.status(400).json({ error: 'userId, tierId required' });
      }
      const sub = await prisma.userSubscription.create({
        data: {
          userId,
          tierId,
          status: status || 'active',
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      });
      res.status(201).json(sub);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    // PUT /api/subscriptions?id=xxx
    try {
      const { id } = req.query;
      const { status, endDate } = req.body;
      if (!id) return res.status(400).json({ error: 'id required' });
      const sub = await prisma.userSubscription.update({
        where: { id },
        data: { status, endDate: endDate ? new Date(endDate) : undefined },
      });
      res.status(200).json(sub);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    // DELETE /api/subscriptions?id=xxx
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id required' });
      await prisma.userSubscription.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
