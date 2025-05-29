const { PrismaClient } = require('../prisma/generated/client');

const prisma = new PrismaClient();

module.exports = async function handler(req, res) {
  // The POST handler for /api/videos is currently disabled.
  // Video records should be created via the Mux upload flow (POST /api/mux-upload)
  // to ensure proper Mux asset linking and processing.
  // If direct video record creation with custom fileUrls is needed for other purposes,
  // this endpoint can be re-enabled with careful consideration of its impact.
  /*
  if (req.method === 'POST') {
    const { title, description, fileUrl, userId, visibility } = req.body;
    try {
      const video = await prisma.video.create({
        data: { title, description, fileUrl, userId, visibility }
      });
      res.status(201).json(video);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else 
  */
  if (req.method === 'GET') {
    try {
      const videos = await prisma.video.findMany({ include: { user: true } });
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
