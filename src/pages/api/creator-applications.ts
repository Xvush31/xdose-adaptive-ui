import { PrismaClient } from '@prisma/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '@/integrations/supabase/client'; // To get authenticated user

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser(req.headers.authorization?.replace('Bearer ', ''));

      if (authError || !authData.user) {
        return res.status(401).json({ error: 'Non autorisé: ' + (authError?.message || 'Utilisateur non trouvé') });
      }
      const authenticatedUserId = authData.user.id;

      const { userId, reason } = req.body;

      // Validate that the userId in the body matches the authenticated user
      if (userId !== authenticatedUserId) {
        return res.status(403).json({ error: 'L\'ID utilisateur fourni ne correspond pas à l\'utilisateur authentifié.' });
      }

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'L\'ID utilisateur (userId) est requis et doit être une chaîne de caractères.' });
      }
      if (reason && typeof reason !== 'string') {
          return res.status(400).json({ error: 'La raison (reason) doit être une chaîne de caractères.' });
      }

      // Check if an application already exists
      const existingApplication = await prisma.creatorApplication.findUnique({
        where: { userId },
      });

      if (existingApplication) {
        return res.status(409).json({
          error: 'Une candidature existe déjà pour cet utilisateur.',
          application: existingApplication,
        });
      }

      // Create new application
      const newApplication = await prisma.creatorApplication.create({
        data: {
          userId,
          reason: reason || null, // Ensure reason is explicitly null if not provided
          status: 'pending',
        },
      });

      return res.status(201).json(newApplication);
    } catch (error: any) {
      console.error('Erreur API création candidature:', error);
      return res.status(500).json({ error: 'Erreur serveur interne.', details: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser(req.headers.authorization?.replace('Bearer ', ''));

      if (authError || !authData.user) {
        return res.status(401).json({ error: 'Non autorisé: ' + (authError?.message || 'Utilisateur non trouvé') });
      }
      const authenticatedUser = authData.user;

      // If userId is provided, fetch specific application (for user or admin)
      if (req.query.userId && typeof req.query.userId === 'string') {
        const targetUserId = req.query.userId;

        // User can fetch their own application. Admin can fetch any.
        // We need to fetch requester's role if targetUserId is different from authenticatedUserId
        if (targetUserId !== authenticatedUser.id) {
          const requester = await prisma.user.findUnique({ where: { id: authenticatedUser.id } });
          if (!requester || requester.role !== 'admin') {
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à accéder à cette ressource.' });
          }
        }

        const application = await prisma.creatorApplication.findUnique({
          where: { userId: targetUserId },
          include: { user: { select: { email: true, name: true }} },
        });

        if (!application) {
          return res.status(404).json({ error: 'Aucune candidature trouvée pour cet utilisateur.' });
        }
        return res.status(200).json(application);

      } else {
        // If no userId, fetch all applications (admin only)
        const requester = await prisma.user.findUnique({ where: { id: authenticatedUser.id } });
        if (!requester || requester.role !== 'admin') {
          return res.status(403).json({ error: 'Accès non autorisé. Administrateurs seulement.' });
        }

        const applications = await prisma.creatorApplication.findMany({
          include: {
            user: { select: { email: true, name: true } }, // Include user's email and name
          },
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(applications);
      }
    } catch (error: any) {
      console.error('Erreur API récupération candidature(s):', error);
      return res.status(500).json({ error: 'Erreur serveur interne.', details: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser(req.headers.authorization?.replace('Bearer ', ''));

      if (authError || !authData.user) {
        return res.status(401).json({ error: 'Non autorisé.' });
      }
      const authenticatedUser = authData.user;

      // Admin check
      const adminUser = await prisma.user.findUnique({ where: { id: authenticatedUser.id } });
      if (!adminUser || adminUser.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé. Administrateurs seulement.' });
      }

      const { id: applicationId } = req.query; // Application ID from query param
      const { status } = req.body; // 'approved' or 'rejected'

      if (!applicationId || typeof applicationId !== 'string') {
        return res.status(400).json({ error: 'ID de candidature manquant ou invalide.' });
      }
      if (!status || (status !== 'approved' && status !== 'rejected')) {
        return res.status(400).json({ error: 'Statut invalide. Doit être "approved" ou "rejected".' });
      }

      const applicationToUpdate = await prisma.creatorApplication.findUnique({
        where: { id: applicationId },
      });

      if (!applicationToUpdate) {
        return res.status(404).json({ error: 'Candidature non trouvée.' });
      }

      if (applicationToUpdate.status !== 'pending' && status === 'approved') {
         // Optional: prevent re-approving an already processed application if not desired
         // return res.status(400).json({ error: `La candidature a déjà été traitée (${applicationToUpdate.status}).` });
      }


      const updatedApplication = await prisma.$transaction(async (tx) => {
        const app = await tx.creatorApplication.update({
          where: { id: applicationId },
          data: { status: status, updatedAt: new Date() },
        });

        if (status === 'approved') {
          await tx.user.update({
            where: { id: app.userId },
            data: { role: 'createur' },
          });
        }
        return app;
      });

      return res.status(200).json(updatedApplication);
    } catch (error: any) {
      console.error('Erreur API mise à jour candidature:', error);
      if (error.code === 'P2025') { // Prisma error code for record not found during transaction
        return res.status(404).json({ error: 'Candidature ou utilisateur non trouvé lors de la transaction.' });
      }
      return res.status(500).json({ error: 'Erreur serveur interne.', details: error.message });
    }
  }
  else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
