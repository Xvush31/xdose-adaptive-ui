
import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  console.log('[users.ts] API called', {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: Object.fromEntries(Object.entries(req.headers).filter(([key]) => !key.toLowerCase().includes('authorization')))
  });

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
      const user = await prisma.user.update({
        where: { email },
        data: { role },
      });
      console.log('[users.ts] Role updated for:', email, 'new role:', role);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(user);
      return;
    }

    if (req.method === 'POST') {
      const { id, email, name, role } = req.body;
      if (!id) {
        console.error('[users.ts] Missing required fields', req.body);
        res.setHeader('Content-Type', 'application/json');
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      if (role && !email && !name) {
        const user = await prisma.user.update({ where: { id }, data: { role } });
        console.log('[users.ts] User role updated:', user);
        res.setHeader('Content-Type', 'application/json');
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

      console.log('[users.ts] User created/updated:', user);
      res.setHeader('Content-Type', 'application/json');
      res.status(201).json(user);
      return;
    }

    if (req.method === 'GET') {
      if (req.query && req.query.id) {
        const userId = req.query.id as string;
        console.log('[users.ts] GET user by ID:', userId);
        
        const user = await prisma.user.findUnique({ where: { id: userId } });
        
        if (!user) {
          console.log('[users.ts] User not found:', userId);
          res.setHeader('Content-Type', 'application/json');
          res.status(404).json({ error: 'User not found' });
        } else {
          console.log('[users.ts] User retrieved:', user);
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(user);
        }
        return;
      }
      
      const users = await prisma.user.findMany({ include: { videos: true } });
      console.log('[users.ts] GET all users:', users.length);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(users);
      return;
    }

    res.status(405).end();
  } catch (error) {
    console.error('[users.ts] Error:', error);
    res.setHeader('Content-Type', 'application/json');
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
