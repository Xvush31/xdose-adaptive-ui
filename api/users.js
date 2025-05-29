const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, email, name, role } = req.body; // id is the Supabase UUID
    try {
      if (!id || !email) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      const user = await prisma.user.create({
        data: { id, email, name, role },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({ include: { videos: true } });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}

module.exports = handler;
