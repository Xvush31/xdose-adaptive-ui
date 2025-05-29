import { PrismaClient } from '../prisma/generated/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  // Vérification du webhook Mux (optionnel: signature)
  const event = req.body;

  if (event.type === 'video.asset.ready') {
    const assetId = event.data.id;
    const playbackId = event.data.playback_ids?.[0]?.id || '';
    // On retrouve la vidéo correspondante (par assetId ou autre critère)
    // Ici, il faut que tu stockes l'assetId dans la vidéo lors de la création ou via uploadId
    // Exemple: si tu stockes uploadId dans Video, fais la correspondance ici
    // Pour l'exemple, on suppose que tu as l'uploadId dans event.data.upload_id
    const uploadId = event.data.upload_id;
    if (!uploadId) {
      res.status(400).json({ error: 'No upload_id in webhook' });
      return;
    }
    // Met à jour la vidéo correspondante
    await prisma.video.updateMany({
      where: { muxUploadId: uploadId },
      data: {
        muxAssetId: assetId,
        fileUrl: `https://stream.mux.com/${playbackId}.m3u8`,
        status: 'ready',
      },
    });
  }
  res.status(200).json({ received: true });
}
