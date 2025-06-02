
import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('[DEBUG][likes.js] API appelée', {
    method: req.method,
    url: req.url,
    body: req.body,
  });

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { video_id, user_id } = req.query;
      
      if (video_id) {
        // Get likes for a specific video
        const likes = await prisma.likes.findMany({
          where: { video_id: parseInt(video_id) },
          include: {
            // Note: We'll need to handle user data differently since we can't directly join with auth.users
          },
        });
        
        res.status(200).json(likes);
      } else if (user_id) {
        // Get likes by a specific user
        const likes = await prisma.likes.findMany({
          where: { user_id },
          include: {
            // Include video details
          },
        });
        
        res.status(200).json(likes);
      } else {
        res.status(400).json({ error: 'video_id or user_id is required' });
      }
    } catch (error) {
      console.error('[likes.js] Error fetching likes:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { user_id, video_id } = req.body;
      
      if (!user_id || !video_id) {
        return res.status(400).json({ error: 'user_id and video_id are required' });
      }

      // Check if like already exists
      const existingLike = await prisma.likes.findUnique({
        where: {
          user_id_video_id: {
            user_id,
            video_id: parseInt(video_id),
          },
        },
      });

      if (existingLike) {
        return res.status(409).json({ error: 'Already liked' });
      }

      // Create new like
      const like = await prisma.likes.create({
        data: {
          user_id,
          video_id: parseInt(video_id),
        },
      });

      // Update video likes count
      await prisma.video.update({
        where: { id: parseInt(video_id) },
        data: {
          likes_count: {
            increment: 1,
          },
        },
      });

      res.status(201).json(like);
    } catch (error) {
      console.error('[likes.js] Error creating like:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { user_id, video_id } = req.body;
      
      if (!user_id || !video_id) {
        return res.status(400).json({ error: 'user_id and video_id are required' });
      }

      // Delete like
      const deletedLike = await prisma.likes.delete({
        where: {
          user_id_video_id: {
            user_id,
            video_id: parseInt(video_id),
          },
        },
      });

      // Update video likes count
      await prisma.video.update({
        where: { id: parseInt(video_id) },
        data: {
          likes_count: {
            decrement: 1,
          },
        },
      });

      res.status(200).json(deletedLike);
    } catch (error) {
      console.error('[likes.js] Error deleting like:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
