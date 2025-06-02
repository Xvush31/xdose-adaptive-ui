import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Route by type param: like, comment, bookmark
  const { type } = req.query;
  if (!type) {
    res.status(400).json({ error: 'type param required: like, comment, bookmark' });
    return;
  }

  if (type === 'like') {
    // ...logic from likes.js...
    if (req.method === 'GET') {
      const { video_id, user_id } = req.query;
      if (video_id) {
        const likes = await prisma.likes.findMany({ where: { video_id: parseInt(video_id) } });
        res.status(200).json(likes);
      } else if (user_id) {
        const likes = await prisma.likes.findMany({ where: { user_id } });
        res.status(200).json(likes);
      } else {
        res.status(400).json({ error: 'video_id or user_id is required' });
      }
    } else if (req.method === 'POST') {
      const { user_id, video_id } = req.body;
      if (!user_id || !video_id) {
        return res.status(400).json({ error: 'user_id and video_id are required' });
      }
      const existingLike = await prisma.likes.findUnique({ where: { user_id_video_id: { user_id, video_id: parseInt(video_id) } } });
      if (existingLike) {
        await prisma.likes.delete({ where: { user_id_video_id: { user_id, video_id: parseInt(video_id) } } });
        res.status(200).json({ liked: false });
      } else {
        await prisma.likes.create({ data: { user_id, video_id: parseInt(video_id) } });
        res.status(201).json({ liked: true });
      }
    } else {
      res.status(405).end();
    }
    return;
  }

  if (type === 'comment') {
    // ...logic from comments.js...
    if (req.method === 'GET') {
      const { video_id } = req.query;
      if (!video_id) return res.status(400).json({ error: 'video_id is required' });
      const comments = await prisma.comments.findMany({ where: { video_id: parseInt(video_id), parent_id: null }, orderBy: { created_at: 'desc' } });
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await prisma.comments.findMany({ where: { parent_id: comment.id }, orderBy: { created_at: 'asc' } });
          return { ...comment, replies };
        })
      );
      res.status(200).json(commentsWithReplies);
    } else if (req.method === 'POST') {
      const { user_id, video_id, content, parent_id } = req.body;
      if (!user_id || !video_id || !content) {
        return res.status(400).json({ error: 'user_id, video_id, and content are required' });
      }
      const comment = await prisma.comments.create({ data: { user_id, video_id: parseInt(video_id), content, parent_id: parent_id || null } });
      res.status(201).json(comment);
    } else if (req.method === 'PUT') {
      const { id, content } = req.body;
      if (!id || !content) return res.status(400).json({ error: 'id and content required' });
      const updated = await prisma.comments.update({ where: { id }, data: { content } });
      res.status(200).json(updated);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'id required' });
      await prisma.comments.delete({ where: { id } });
      res.status(204).end();
    } else {
      res.status(405).end();
    }
    return;
  }

  if (type === 'bookmark') {
    // ...logic from bookmarks.js...
    if (req.method === 'GET') {
      const { user_id } = req.query;
      if (!user_id) return res.status(400).json({ error: 'user_id is required' });
      const bookmarks = await prisma.bookmarks.findMany({ where: { user_id }, orderBy: { created_at: 'desc' } });
      res.status(200).json(bookmarks);
    } else if (req.method === 'POST') {
      const { user_id, video_id } = req.body;
      if (!user_id || !video_id) return res.status(400).json({ error: 'user_id and video_id are required' });
      const existingBookmark = await prisma.bookmarks.findUnique({ where: { user_id_video_id: { user_id, video_id: parseInt(video_id) } } });
      if (existingBookmark) {
        return res.status(409).json({ error: 'Already bookmarked' });
      }
      const bookmark = await prisma.bookmarks.create({ data: { user_id, video_id: parseInt(video_id) } });
      res.status(201).json(bookmark);
    } else if (req.method === 'DELETE') {
      const { user_id, video_id } = req.body;
      if (!user_id || !video_id) return res.status(400).json({ error: 'user_id and video_id are required' });
      await prisma.bookmarks.delete({ where: { user_id_video_id: { user_id, video_id: parseInt(video_id) } } });
      res.status(204).end();
    } else {
      res.status(405).end();
    }
    return;
  }

  res.status(400).json({ error: 'Unknown type' });
}
