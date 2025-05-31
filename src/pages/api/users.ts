import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'PUT') {
      const { email, role } = req.body;
      // Update user role based on email
      const user = await prisma.user.update({
        where: { email },
        data: { role },
      });
      console.log('[users.js] Role mis à jour pour:', email, 'nouveau role:', role);
      res.status(200).json(user);
      return;
    }

    if (req.method === 'POST') {
      const { id, email, name, role } = req.body;
      if (!id) {
        console.error('[users.js] Champs requis manquants', req.body);
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      if (role && !email && !name) {
        const user = await prisma.user.update({ where: { id }, data: { role } });
        console.log('[users.js] Rôle utilisateur mis à jour:', user);
        res.status(200).json(user);
        return;
      }

      const user = await prisma.user.upsert({
        where: { id },
        update: {
          email: email || undefined,
          name: name || undefined,
          role: role || 'spectateur',
        },
        create: {
          id,
          email: email || '',
          name: name || email || '',
          role: role || 'spectateur',
        },
      });

      console.log('[users.js] Utilisateur créé/mis à jour:', user);
      res.status(201).json(user);
      return;
    }

    if (req.method === 'GET') {
      if (req.query && req.query.id) {
        const user = await prisma.user.findUnique({ where: { id: req.query.id as string } });
        if (!user) {
          console.log('[users.js] Utilisateur non trouvé:', req.query.id);
          res.status(404).json({ error: 'User not found' });
        } else {
          console.log('[users.js] Utilisateur récupéré:', user);
          res.status(200).json(user);
        }
        return;
      }
      const users = await prisma.user.findMany({ include: { videos: true } });
      console.log('[users.js] GET tous les utilisateurs:', users.length);
      res.status(200).json(users);
      return;
    }

    res.status(405).end();
  } catch (error) {
    console.error('[users.js] Erreur:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
