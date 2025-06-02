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
    // GET /api/tiers?creator_id=xxx
    try {
      const { creator_id } = req.query;
      const where = creator_id ? { creatorId: creator_id } : {};
      const tiers = await prisma.subscriptionTier.findMany({
        where,
        orderBy: { price: 'asc' },
      });
      res.status(200).json(tiers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    // POST /api/tiers (créateur)
    try {
      const { creatorId, name, price, features } = req.body;
      if (!creatorId || !name || price == null) {
        return res.status(400).json({ error: 'creatorId, name, price required' });
      }
      const tier = await prisma.subscriptionTier.create({
        data: {
          creatorId,
          name,
          price: parseFloat(price),
          features: features || [],
        },
      });
      res.status(201).json(tier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    // PUT /api/tiers?id=xxx
    try {
      const { id } = req.query;
      const { name, price, features } = req.body;
      if (!id) return res.status(400).json({ error: 'id required' });
      const tier = await prisma.subscriptionTier.update({
        where: { id },
        data: { name, price: price != null ? parseFloat(price) : undefined, features },
      });
      res.status(200).json(tier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    // DELETE /api/tiers?id=xxx
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id required' });
      await prisma.subscriptionTier.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
