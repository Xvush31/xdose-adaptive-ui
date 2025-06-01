import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import Hls from 'hls.js';

interface Video {
  id: number;
  title: string;
  creator: string;
  views: string;
  thumbnail: string;
}

export const TrendingContent: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => {
        // Filtrer les vidéos publiques et prêtes
        setVideos(data.filter((v: any) => v.visibility === 'public' && v.status === 'ready'));
      });
  }, []);

  if (videos.length === 0) {
    return <div className="text-center text-gray-500 py-8">Aucune vidéo publique disponible.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="group cursor-pointer">
          <div className="aspect-[16/9] bg-black rounded-xl relative overflow-hidden mb-3 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            {video.fileUrl ? (
              <VideoPlayer fileUrl={video.fileUrl} poster={video.thumbnail || undefined} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">Aperçu indisponible</div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Play
                className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity"
                fill="currentColor"
              />
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-500 transition-colors">
            {video.title}
          </h4>
          <p className="text-sm text-gray-600">{video.user?.name || video.user?.email || 'Créateur inconnu'}</p>
        </div>
      ))}
    </div>
  );
};

// Composant VideoPlayer pour supporter HLS sur tous navigateurs
const VideoPlayer: React.FC<{ fileUrl: string; poster?: string }> = ({ fileUrl, poster }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = fileUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(fileUrl);
      hls.attachMedia(video);
      return () => {
        hls.destroy();
      };
    }
  }, [fileUrl]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full object-cover rounded-xl"
      poster={poster}
      preload="metadata"
      style={{ background: '#000' }}
    />
  );
};
