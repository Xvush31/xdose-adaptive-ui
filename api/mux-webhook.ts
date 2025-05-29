// Disable Vercel's default body parser to access the raw body
// Required for Mux webhook signature verification
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

const { PrismaClient } = require('../prisma/generated/client');
const Mux = require('@mux/mux-node');

const prisma = new PrismaClient();

// Helper function to get the raw body from the request
const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk))); // Ensure chunks are Buffers
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err) => reject(err));
  });

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const muxSignature = req.headers['mux-signature'];
  const webhookSecret = process.env.MUX_WEBHOOK_SIGNING_SECRET;

  if (!webhookSecret) {
    console.error('Mux webhook signing secret is not configured.');
    res.status(500).json({ error: 'Internal server error: Webhook secret not configured.' });
    return;
  }

  if (!muxSignature) {
    console.warn('Mux signature header missing.');
    res.status(400).json({ error: 'Mux signature header missing.' });
    return;
  }

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (error) {
    console.error('Error reading raw body:', error);
    res.status(500).json({ error: 'Failed to read request body.' });
    return;
  }

  try {
    // The Mux SDK expects the raw body as a string for verifyHeader
    Mux.Webhooks.verifyHeader(rawBody.toString('utf-8'), muxSignature, webhookSecret);
  } catch (error) {
    console.warn('Invalid Mux signature:', error.message);
    res.status(401).json({ error: 'Invalid signature.' });
    return;
  }

  let event;
  try {
    // Parse the JSON event from the raw body (now that it's verified)
    event = JSON.parse(rawBody.toString('utf-8'));
  } catch (error) {
    console.error('Error parsing webhook JSON body:', error);
    res.status(400).json({ error: 'Invalid JSON payload.' });
    return;
  }

  // Process the event (example: video.asset.ready)
  if (event.type === 'video.asset.ready') {
    const assetId = event.data.id;
    const uploadId = event.data.upload_id;
    const playbackId = event.data.playback_ids?.[0]?.id || '';

    if (!uploadId) {
      console.warn('Webhook received video.asset.ready event without an upload_id.');
      // Mux should always send upload_id if the asset was created via direct upload.
      // If it's missing, it might be an asset created via other means or an issue.
      res.status(400).json({ error: 'No upload_id in webhook for video.asset.ready event.' });
      return;
    }

    try {
      const updatedVideo = await prisma.video.updateMany({ // updateMany might not be ideal if expecting one video
        where: { muxUploadId: uploadId },
        data: {
          muxAssetId: assetId,
          fileUrl: `https://stream.mux.com/${playbackId}.m3u8`,
          status: 'ready',
        },
      });

      // Check if any record was actually updated
      // updateMany returns a count object like { count: 1 }
      if (updatedVideo.count === 0) {
        console.warn(`No video found with muxUploadId: ${uploadId}. Webhook for asset ${assetId}.`);
        // Potentially respond with 404 if you want to signify to Mux that this upload_id is unknown,
        // though Mux might not care. A 200 is also fine to acknowledge receipt.
        // For robustness, if Mux sends an event for an upload_id we don't know, it's not strictly an error on our side.
      } else {
        console.log(`Video with muxUploadId ${uploadId} updated successfully for asset ${assetId}.`);
      }

    } catch (dbError) {
      console.error(`Database error updating video for muxUploadId ${uploadId}:`, dbError);
      // Mux will retry on non-2xx responses. If DB error is persistent, this could lead to many retries.
      // Consider if a specific error type should result in a 2xx to stop retries for non-recoverable DB issues.
      res.status(500).json({ error: 'Database update failed.' });
      return;
    }
  } else if (event.type === 'video.upload.asset_created') {
    // This event also contains upload_id and asset_id.
    // Could be used for earlier updates if needed, e.g., linking asset_id before it's 'ready'.
    const uploadId = event.data.upload_id;
    const assetId = event.data.asset_id;
    if (uploadId && assetId) {
        // Example: update status to 'processing' or store asset_id if you didn't get it from /api/mux-upload response
        // await prisma.video.updateMany({
        //   where: { muxUploadId: uploadId, muxAssetId: null }, // Only if not already set
        //   data: { muxAssetId: assetId, status: 'processing' },
        // });
        console.log(`Received video.upload.asset_created for uploadId: ${uploadId}, assetId: ${assetId}`);
    }
  } else {
    console.log(`Received Mux webhook event: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

// Re-export the handler for Vercel, ensuring the config is also picked up.
// The previous `module.exports = async function handler...` is now part of the main export.
// If we need to export both handler and config, the structure should be:
// module.exports = async function handler(...) { ... }
// module.exports.config = { ... }
// This is already implicitly handled by how the code is structured:
// module.exports.config is set first.
// Then module.exports is reassigned to the handler function.
// This is a common pattern but can be tricky. A safer way for Vercel:
// const handler = async (req, res) => { ... };
// export const config = { ... };
// export default handler;
// However, since we are in CJS context:
// The current structure should be fine for Vercel as it reads `config` as a property of the exported module.
// Let's ensure the main export is the handler function.
// The current code does:
// module.exports.config = ...
// module.exports = async function handler(...)
// This means the final module.exports IS the handler, and config is attached to it as a property.
// This is a standard way Vercel picks up route-specific config.
