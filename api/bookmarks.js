// Deprecated: logic moved to /api/engagement.js
export default function handler(req, res) {
  res.status(410).json({ error: 'This endpoint is deprecated. Use /api/engagement?type=bookmark' });
}
