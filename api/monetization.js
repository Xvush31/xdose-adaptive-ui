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
  if (!type || !['tiers', 'subscriptions', 'tips'].includes(type)) {
    res.status(400).json({ error: 'type parameter required: tiers, subscriptions, or tips' });
    return;
  }

  // TIERS LOGIC
  if (type === 'tiers') {
    if (req.method === 'GET') {
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
    return;
  }

  // SUBSCRIPTIONS LOGIC
  if (type === 'subscriptions') {
    if (req.method === 'GET') {
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
    return;
  }

  // TIPS LOGIC
  if (type === 'tips') {
    if (req.method === 'GET') {
      try {
        const { to_user_id, from_user_id } = req.query;
        let where = {};
        if (to_user_id) where = { toUserId: to_user_id };
        if (from_user_id) where = { ...where, fromUserId: from_user_id };
        const tips = await prisma.tip.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(tips);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else if (req.method === 'POST') {
      try {
        const { fromUserId, toUserId, amount, message } = req.body;
        if (!fromUserId || !toUserId || !amount) {
          return res.status(400).json({ error: 'fromUserId, toUserId, amount required' });
        }
        const tip = await prisma.tip.create({
          data: {
            fromUserId,
            toUserId,
            amount: parseFloat(amount),
            message: message || null,
          },
        });
        res.status(201).json(tip);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).end();
    }
    return;
  }
}
