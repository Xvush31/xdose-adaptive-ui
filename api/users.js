import { PrismaClient } from '../prisma/generated/client/index.js';
const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, email, name, role, bio } = req.body; // id = Supabase UUID
    try {
      if (!id) {
        console.error('[users.js] Champs requis manquants', req.body);
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      
      // Si seul id+role sont fournis, update uniquement le rôle
      if (role && !email && !name && !bio) {
        const user = await prisma.user.update({ where: { id }, data: { role } });
        console.log('[users.js] Rôle utilisateur mis à jour:', user);
        res.status(200).json(user);
        return;
      }
      
      // Upsert: crée ou met à jour l'utilisateur (ajout bio)
      const user = await prisma.user.upsert({
        where: { id },
        update: {
          email: email || undefined,
          name: name || undefined,
          role: role || undefined,
          bio: bio || undefined,
        },
        create: {
          id,
          email: email || '',
          name: name || email || '',
          role: role || 'spectateur',
          bio: bio || '',
        },
      });
      
      console.log('[users.js] Utilisateur créé/mis à jour:', user);
      res.status(201).json(user);
    } catch (error) {
      console.error('[users.js] Erreur Prisma:', error);
      
      // Si l'utilisateur existe déjà, retourner une réponse positive
      if (error.code === 'P2002') {
        console.log('[users.js] Utilisateur déjà existant, récupération...');
        try {
          const existingUser = await prisma.user.findUnique({ where: { id } });
          if (existingUser) {
            res.status(200).json(existingUser);
            return;
          }
        } catch (fetchError) {
          console.error('[users.js] Erreur récupération utilisateur existant:', fetchError);
        }
      }
      
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      if (req.query && req.query.id) {
        // GET /api/users?id=...
        let user = await prisma.user.findUnique({ where: { id: req.query.id } });
        
        // Si l'utilisateur n'existe pas dans Prisma, essayer de le créer automatiquement
        if (!user) {
          console.log('[users.js] Utilisateur non trouvé dans Prisma, tentative de création automatique pour:', req.query.id);
          
          // Créer l'utilisateur avec des valeurs par défaut
          try {
            user = await prisma.user.create({
              data: {
                id: req.query.id,
                email: `user-${req.query.id}@temp.com`, // Email temporaire
                name: 'Utilisateur',
                role: 'spectateur' // Rôle par défaut
              }
            });
            console.log('[users.js] Utilisateur créé automatiquement:', user);
          } catch (createError) {
            console.error('[users.js] Erreur création automatique:', createError);
            res.status(404).json({ error: 'User not found and could not be created' });
            return;
          }
        }
        
        console.log('[users.js] Utilisateur récupéré:', user);
        res.status(200).json(user);
        return;
      }
      
      const users = await prisma.user.findMany({ include: { videos: true } });
      console.log('[users.js] GET tous les utilisateurs:', users.length);
      res.status(200).json(users);
    } catch (error) {
      console.error('[users.js] Erreur GET:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}

export default handler;
