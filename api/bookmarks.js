
import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('[DEBUG][bookmarks.js] API appelée', {
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
      const { user_id } = req.query;
      
      if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
      }

      // Get bookmarks for a specific user
      const bookmarks = await prisma.bookmarks.findMany({
        where: { user_id },
        orderBy: { created_at: 'desc' },
      });

      res.status(200).json(bookmarks);
    } catch (error) {
      console.error('[bookmarks.js] Error fetching bookmarks:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { user_id, video_id } = req.body;
      
      if (!user_id || !video_id) {
        return res.status(400).json({ error: 'user_id and video_id are required' });
      }

      // Check if bookmark already exists
      const existingBookmark = await prisma.bookmarks.findUnique({
        where: {
          user_id_video_id: {
            user_id,
            video_id: parseInt(video_id),
          },
        },
      });

      if (existingBookmark) {
        return res.status(409).json({ error: 'Already bookmarked' });
      }

      // Create new bookmark
      const bookmark = await prisma.bookmarks.create({
        data: {
          user_id,
          video_id: parseInt(video_id),
        },
      });

      res.status(201).json(bookmark);
    } catch (error) {
      console.error('[bookmarks.js] Error creating bookmark:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { user_id, video_id } = req.body;
      
      if (!user_id || !video_id) {
        return res.status(400).json({ error: 'user_id and video_id are required' });
      }

      // Delete bookmark
      const deletedBookmark = await prisma.bookmarks.delete({
        where: {
          user_id_video_id: {
            user_id,
            video_id: parseInt(video_id),
          },
        },
      });

      res.status(200).json(deletedBookmark);
    } catch (error) {
      console.error('[bookmarks.js] Error deleting bookmark:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
