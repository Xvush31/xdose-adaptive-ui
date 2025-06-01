
import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

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

// Lecteur vidéo universel amélioré
const UniversalVideoPlayer: React.FC<{ video: any }> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      console.error('Erreur de lecture vidéo:', video.error);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
      setHasError(true);
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const getVideoSources = (fileUrl: string) => {
    if (!fileUrl) return [];
    
    // Normalisation de l'URL
    const cleanUrl = fileUrl.trim();
    
    // Si c'est un fichier HLS (.m3u8)
    if (cleanUrl.includes('.m3u8')) {
      return [
        { src: cleanUrl, type: 'application/x-mpegURL' },
        { src: cleanUrl, type: 'application/vnd.apple.mpegurl' }
      ];
    }
    
    // Détection du type MIME par extension
    const extension = cleanUrl.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'ogv': 'video/ogg',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      'm4v': 'video/mp4',
      '3gp': 'video/3gpp',
      'mkv': 'video/x-matroska'
    };
    
    const mimeType = mimeTypes[extension || 'mp4'] || 'video/mp4';
    
    // Retourner plusieurs formats si possible pour une meilleure compatibilité
    return [
      { src: cleanUrl, type: mimeType },
      { src: cleanUrl, type: 'video/mp4' } // Fallback
    ].filter((source, index, arr) => 
      arr.findIndex(s => s.type === source.type) === index
    );
  };

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
        <p className="text-sm text-gray-600">
          {video.user?.name || video.user?.email || 'Créateur inconnu'}
        </p>
      </div>
    );
  }

  return (
    <div className="group cursor-pointer">
      <div 
        className="aspect-[16/9] bg-black rounded-xl relative overflow-hidden mb-3 hover:scale-105 transition-transform duration-300"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
            <div className="text-center p-4">
              <div className="text-red-400 mb-2">⚠️</div>
              <p className="text-sm">Impossible de lire cette vidéo</p>
              <p className="text-xs text-gray-400 mt-1">Format non supporté</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-xl"
              poster={video.thumbnail || undefined}
              preload="metadata"
              playsInline
              webkit-playsinline="true"
              muted={isMuted}
              loop={false}
              crossOrigin="anonymous"
              style={{ background: '#000' }}
            >
              {getVideoSources(video.fileUrl).map((source, index) => (
                <source key={index} src={source.src} type={source.type} />
              ))}
              <p className="text-white text-center p-4">
                Votre navigateur ne supporte pas la lecture vidéo HTML5.
                <br />
                <a href={video.fileUrl} className="text-blue-400 underline">
                  Télécharger la vidéo
                </a>
              </p>
            </video>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            
            {/* Overlay de contrôle */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            
            {/* Contrôles personnalisés */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button 
                onClick={handlePlayPause}
                className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                disabled={isLoading || hasError}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" fill="currentColor" />
                ) : (
                  <Play className="h-8 w-8 text-white" fill="currentColor" />
                )}
              </button>
            </div>
            
            {/* Contrôle du volume */}
            {showControls && !hasError && (
              <button
                onClick={handleMuteToggle}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-white" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white" />
                )}
              </button>
            )}
          </>
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
