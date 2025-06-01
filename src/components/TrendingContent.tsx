
import React, { useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

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
        <UniversalVideoPlayer key={video.id} video={video} />
      ))}
    </div>
  );
};

// Nouveau lecteur vidéo universel
const UniversalVideoPlayer: React.FC<{ video: any }> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const handlePlayPause = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoRef = (ref: HTMLVideoElement | null) => {
    setVideoElement(ref);
  };

  const getVideoSources = (fileUrl: string) => {
    if (!fileUrl) return [];
    
    // Si c'est un fichier HLS (.m3u8)
    if (fileUrl.includes('.m3u8')) {
      return [
        { src: fileUrl, type: 'application/x-mpegURL' },
        { src: fileUrl, type: 'application/vnd.apple.mpegurl' }
      ];
    }
    
    // Pour les autres formats, on essaie de détecter le type
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv'
    };
    
    return [{ src: fileUrl, type: mimeTypes[extension || 'mp4'] || 'video/mp4' }];
  };

  return (
    <div className="group cursor-pointer">
      <div 
        className="aspect-[16/9] bg-black rounded-xl relative overflow-hidden mb-3 hover:scale-105 transition-transform duration-300"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {video.fileUrl ? (
          <>
            <video
              ref={handleVideoRef}
              className="w-full h-full object-cover rounded-xl"
              poster={video.thumbnail || undefined}
              preload="metadata"
              playsInline
              webkit-playsinline="true"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedData={() => console.log('Video loaded:', video.title)}
              onError={(e) => console.error('Video error:', e)}
              style={{ background: '#000' }}
            >
              {getVideoSources(video.fileUrl).map((source, index) => (
                <source key={index} src={source.src} type={source.type} />
              ))}
              <p className="text-white text-center p-4">
                Votre navigateur ne supporte pas la lecture vidéo.
              </p>
            </video>
            
            {/* Overlay de contrôle */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            
            {/* Bouton play/pause central */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-12 w-12 text-white opacity-80 hover:opacity-100 transition-opacity" fill="currentColor" />
              ) : (
                <Play className="h-12 w-12 text-white opacity-80 hover:opacity-100 transition-opacity" fill="currentColor" />
              )}
            </div>
            
            {/* Contrôles natifs du navigateur */}
            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <video
                  className="w-full opacity-0 absolute"
                  controls
                  ref={(ref) => {
                    if (ref && videoElement) {
                      ref.currentTime = videoElement.currentTime;
                      ref.volume = videoElement.volume;
                    }
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            Aperçu indisponible
          </div>
        )}
      </div>
      
      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-500 transition-colors">
        {video.title}
      </h4>
      <p className="text-sm text-gray-600">
        {video.user?.name || video.user?.email || 'Créateur inconnu'}
      </p>
    </div>
  );
};
