import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

// GET /api/feed?type=following|foryou|trending&userId=...&limit=...&cursor=...
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { type = 'foryou', userId, limit = 20, cursor } = req.query;
  let items = [];
  let nextCursor = null;

  try {
    if (type === 'following') {
      if (!userId) return res.status(400).json({ error: 'userId required for following feed' });
      // Get IDs of followed users
      const follows = await prisma.follows.findMany({
        where: { followerId: userId },
        select: { followedId: true },
      });
      const followedIds = follows.map(f => f.followedId);
      // Get videos and text posts from followed users
      items = await getFeedItems({
        userIds: followedIds,
        limit: Number(limit),
        cursor,
      });
    } else if (type === 'trending') {
      // Trending: most viewed/liked in last 7 days
      items = await getFeedItems({
        trending: true,
        limit: Number(limit),
        cursor,
      });
    } else {
      // For You: recommended (simple = most recent + some popular)
      items = await getFeedItems({
        recommended: true,
        userId,
        limit: Number(limit),
        cursor,
      });
    }
    if (items.length === Number(limit)) {
      nextCursor = items[items.length - 1].createdAt;
    }
    res.status(200).json({ items, nextCursor });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Helper to fetch feed items (videos + text posts)
async function getFeedItems({ userIds, trending, recommended, userId, limit, cursor }) {
  // Build queries for videos and text posts
  const whereVideo = { status: 'ready', visibility: 'public' };
  const whereText = { published: true };
  if (userIds) {
    whereVideo.userId = { in: userIds };
    whereText.userId = { in: userIds };
  }
  if (cursor) {
    whereVideo.createdAt = { lt: new Date(cursor) };
    whereText.createdAt = { lt: new Date(cursor) };
  }
  let orderBy = { createdAt: 'desc' };
  if (trending) {
    // Trending: order by views/likes in last 7 days
    orderBy = { views: 'desc' };
    // Optionally filter by createdAt >= 7 days ago
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    whereVideo.createdAt = { gte: weekAgo };
    whereText.createdAt = { gte: weekAgo };
  }
  // Fetch videos
  const videos = await prisma.video.findMany({
    where: whereVideo,
    orderBy,
    take: limit,
    include: { user: true },
  });
  // Fetch text posts
  const textPosts = await prisma.textPost.findMany({
    where: whereText,
    orderBy,
    take: limit,
    include: { user: true },
  });
  // Merge and sort by createdAt desc
  const all = [
    ...videos.map(v => ({
      ...v,
      type: 'video',
      user: v.user ? { name: v.user.name || null, email: v.user.email } : null,
    })),
    ...textPosts.map(p => ({
      ...p,
      type: 'text',
      user: p.user ? { name: p.user.name || null, email: p.user.email } : null,
    })),
  ];
  all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return all.slice(0, limit);
}
