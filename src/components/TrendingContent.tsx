import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Loader2 } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {videos.map((video) => (
        <ModernVideoPlayer key={video.id} video={video} />
      ))}
    </div>
  );
};

// ModernVideoPlayer: lecteur moderne avec overlay, hls.js, UX améliorée
const ModernVideoPlayer: React.FC<{ video: any }> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setIsLoading(true);
    if (video.fileUrl && videoRef.current) {
      if (Hls.isSupported() && video.fileUrl.endsWith('.m3u8')) {
        const hls = new Hls();
        hls.loadSource(video.fileUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => setIsLoading(false));
        hls.on(Hls.Events.ERROR, (_, data) => {
          setError('Erreur de lecture vidéo');
          setIsLoading(false);
        });
        return () => hls.destroy();
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = video.fileUrl;
        setIsLoading(false);
      }
    }
  }, [video.fileUrl]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('playing', onPlaying);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('playing', onPlaying);
    };
  }, []);

  if (!video.fileUrl) {
    return (
      <div className="group cursor-pointer">
        <div className="aspect-[16/9] bg-gray-800 rounded-xl relative overflow-hidden mb-3 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <div className="text-gray-400 mb-2">📹</div>
            <p className="text-sm">Aperçu indisponible</p>
          </div>
        </div>
        <h4 className="font-semibold text-gray-900 mb-1">{video.title}</h4>
        <p className="text-sm text-gray-600">{video.user?.name || video.user?.email || 'Créateur inconnu'}</p>
      </div>
    );
  }

  return (
    <div className="relative group rounded-xl overflow-hidden shadow-lg bg-black aspect-[16/9] flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-xl"
          poster={video.thumbnailUrl || video.thumbnail || undefined}
          preload="metadata"
          tabIndex={-1}
          style={{ background: '#000' }}
          onClick={handlePlayPause}
        />
        {/* Overlay play/pause + loader */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-14 w-14 text-white animate-spin opacity-80" />
          ) : error ? (
            <span className="bg-red-600 text-white px-3 py-2 rounded">{error}</span>
          ) : !isPlaying ? (
            <Play className="h-16 w-16 text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform pointer-events-auto cursor-pointer" onClick={handlePlayPause} />
          ) : (
            <Pause className="h-12 w-12 text-white opacity-70 pointer-events-auto cursor-pointer" onClick={handlePlayPause} />
          )}
        </div>
      </div>
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 w-full">
        <h4 className="font-semibold text-white mb-1 truncate">{video.title}</h4>
        <p className="text-sm text-gray-300 truncate">{video.user?.name || video.user?.email || 'Créateur inconnu'}</p>
      </div>
    </div>
  );
};
