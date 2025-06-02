
import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function handler(req, res) {
  console.log('[DEBUG][comments.js] API appelée', {
    method: req.method,
    url: req.url,
    body: req.body,
  });

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { video_id } = req.query;
      
      if (!video_id) {
        return res.status(400).json({ error: 'video_id is required' });
      }

      // Get comments for a specific video, including replies
      const comments = await prisma.comments.findMany({
        where: { 
          video_id: parseInt(video_id),
          parent_id: null, // Only top-level comments
        },
        orderBy: { created_at: 'desc' },
      });

      // Get replies for each comment
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await prisma.comments.findMany({
            where: { parent_id: comment.id },
            orderBy: { created_at: 'asc' },
          });
          return { ...comment, replies };
        })
      );

      res.status(200).json(commentsWithReplies);
    } catch (error) {
      console.error('[comments.js] Error fetching comments:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { user_id, video_id, content, parent_id } = req.body;
      
      if (!user_id || !video_id || !content) {
        return res.status(400).json({ error: 'user_id, video_id, and content are required' });
      }

      // Create new comment
      const comment = await prisma.comments.create({
        data: {
          user_id,
          video_id: parseInt(video_id),
          content,
          parent_id: parent_id || null,
        },
      });

      // Update video comments count (only for top-level comments)
      if (!parent_id) {
        await prisma.video.update({
          where: { id: parseInt(video_id) },
          data: {
            comments_count: {
              increment: 1,
            },
          },
        });
      }

      res.status(201).json(comment);
    } catch (error) {
      console.error('[comments.js] Error creating comment:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { comment_id, user_id } = req.body;
      
      if (!comment_id || !user_id) {
        return res.status(400).json({ error: 'comment_id and user_id are required' });
      }

      // Verify comment ownership
      const comment = await prisma.comments.findUnique({
        where: { id: comment_id },
      });

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      if (comment.user_id !== user_id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Delete comment and its replies
      await prisma.comments.deleteMany({
        where: { parent_id: comment_id },
      });

      const deletedComment = await prisma.comments.delete({
        where: { id: comment_id },
      });

      // Update video comments count (only for top-level comments)
      if (!comment.parent_id) {
        await prisma.video.update({
          where: { id: comment.video_id },
          data: {
            comments_count: {
              decrement: 1,
            },
          },
        });
      }

      res.status(200).json(deletedComment);
    } catch (error) {
      console.error('[comments.js] Error deleting comment:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
