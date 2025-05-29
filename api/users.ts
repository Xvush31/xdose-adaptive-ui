import { PrismaClient } from '../prisma/generated/client/edge';

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, role } = req.body;
    try {
      const user = await prisma.user.create({
        data: { email, name, role },
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

export default handler;
