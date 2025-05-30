import React from 'react';
import { Play } from 'lucide-react';

interface Video {
  id: number;
  title: string;
  creator: string;
  views: string;
  thumbnail: string;
}

export const TrendingContent: React.FC = () => {
  const trendingVideos: Video[] = [
    {
      id: 1,
      title: 'Summer Vibes 2024',
      creator: 'Sarah M.',
      views: '2.1M',
      thumbnail: 'bg-gradient-to-br from-pink-400 to-rose-400',
    },
    {
      id: 2,
      title: 'Tech Review',
      creator: 'Alex C.',
      views: '890K',
      thumbnail: 'bg-gradient-to-br from-blue-400 to-cyan-400',
    },
    {
      id: 3,
      title: 'Art Process',
      creator: 'Maya J.',
      views: '1.5M',
      thumbnail: 'bg-gradient-to-br from-amber-400 to-orange-400',
    },
    {
      id: 4,
      title: 'Behind the Scenes',
      creator: 'Emma L.',
      views: '650K',
      thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {trendingVideos.map((video) => (
        <div key={video.id} className="group cursor-pointer">
          <div
            className={`${video.thumbnail} aspect-[9/16] rounded-xl relative overflow-hidden mb-3 hover:scale-105 transition-transform duration-300`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Play
                className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity"
                fill="currentColor"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {video.views}
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-pink-500 transition-colors">
            {video.title}
          </h4>
          <p className="text-sm text-gray-600">{video.creator}</p>
        </div>
      ))}
    </div>
  );
};
