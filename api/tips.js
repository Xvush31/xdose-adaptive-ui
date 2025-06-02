import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // GET /api/tips?to_user_id=xxx ou ?from_user_id=xxx
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
    // POST /api/tips (envoyer un pourboire)
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
}
