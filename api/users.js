const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, email, name, role } = req.body; // id = Supabase UUID
    try {
      if (!id) {
        console.error('[users.js] Champs requis manquants', req.body);
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      // Si seul id+role sont fournis, update uniquement le rôle
      if (role && !email && !name) {
        const user = await prisma.user.update({ where: { id }, data: { role } });
        res.status(200).json(user);
        return;
      }
      // Upsert: crée ou met à jour l'utilisateur
      const user = await prisma.user.upsert({
        where: { id },
        update: { email, name, role: role || 'spectateur' },
        create: { id, email, name, role: role || 'spectateur' },
      });
      res.status(201).json(user);
    } catch (error) {
      console.error('[users.js] Erreur Prisma:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      if (req.query && req.query.id) {
        // GET /api/users?id=...
        const user = await prisma.user.findUnique({ where: { id: req.query.id } });
        if (!user) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.status(200).json(user);
        }
        return;
      }
      const users = await prisma.user.findMany({ include: { videos: true } });
      res.status(200).json(users);
    } catch (error) {
      console.error('[users.js] Erreur GET:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}

module.exports = handler;
