import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play } from 'lucide-react';

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
        setVideos(data.filter((v: any) => v.visibility === 'public' && v.status === 'ready'));
      });
  }, []);

  if (videos.length === 0) {
    return <div className="text-center text-gray-500 py-8">Aucune vidéo publique disponible.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoPlayer key={video.id} video={video} />
      ))}
    </div>
  );
};

// Nouveau composant VideoPlayer avec HLS.js
const VideoPlayer: React.FC<{ video: any }> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (video.fileUrl && videoRef.current) {
      if (Hls.isSupported() && video.fileUrl.endsWith('.m3u8')) {
        const hls = new Hls();
        hls.loadSource(video.fileUrl);
        hls.attachMedia(videoRef.current);
        return () => {
          hls.destroy();
        };
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = video.fileUrl;
      }
    }
  }, [video.fileUrl]);

  return (
    <div className="group cursor-pointer">
      <div className="aspect-[16/9] bg-black rounded-xl relative overflow-hidden mb-3 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
        {video.fileUrl ? (
          <video
            ref={videoRef}
            controls
            className="w-full h-full object-cover rounded-xl"
            poster={video.thumbnail || undefined}
            preload="metadata"
            style={{ background: '#000' }}
          />
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
  );
};
