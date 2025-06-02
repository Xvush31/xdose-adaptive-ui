import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface FeedItemBase {
  id: number;
  createdAt: string;
  user?: { name?: string; email?: string };
  type: 'video' | 'text';
}
interface VideoItem extends FeedItemBase {
  type: 'video';
  title: string;
  thumbnailUrl?: string;
  fileUrl: string;
  categories?: string[];
  tags?: string[];
  views?: number;
}
interface TextPostItem extends FeedItemBase {
  type: 'text';
  content: string;
  images?: string[];
  visibility?: string;
}
type FeedItem = VideoItem | TextPostItem;

const TABS = [
  { key: 'foryou', label: 'For You' },
  { key: 'following', label: 'Following' },
  { key: 'trending', label: 'Trending' },
];

const Feed: React.FC = () => {
  const [tab, setTab] = useState<'foryou' | 'following' | 'trending'>('foryou');
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  // TODO: Replace with real userId from auth context
  const userId = undefined;

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = `/api/feed?type=${tab}`;
    if (userId && tab === 'following') url += `&userId=${userId}`;
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject('Erreur API'))
      .then(data => {
        setItems(Array.isArray(data.items) ? data.items : []);
        setNextCursor(data.nextCursor || null);
      })
      .catch(() => setError('Erreur lors du chargement'))
      .finally(() => setLoading(false));
  }, [tab]);

  const filtered = items.filter(item => {
    if (item.type === 'video') {
      return (
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) ||
        (item.user?.name && item.user.name.toLowerCase().includes(search.toLowerCase()))
      );
    } else if (item.type === 'text') {
      return (
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        (item.user?.name && item.user.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`px-5 py-2 rounded-full font-semibold transition-all text-sm ${tab === t.key ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'}`}
              onClick={() => setTab(t.key as any)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
          <input
            type="text"
            placeholder="Recherche titre, tag, créateur ou contenu..."
            className="w-full md:w-80 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-12">Chargement…</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Aucun contenu trouvé.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(item =>
              item.type === 'video' ? (
                <Link
                  key={`video-${item.id}`}
                  to={item.fileUrl}
                  target="_blank"
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  <div className="aspect-video bg-neutral-200 flex items-center justify-center">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition" />
                    ) : (
                      <div className="text-neutral-400">Miniature indisponible</div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="font-semibold text-lg text-gray-900 mb-1 truncate">{item.title}</h2>
                    <span className="text-xs text-gray-500">{item.user?.name || 'Créateur inconnu'}</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.categories?.map((c) => <span key={c} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">{c}</span>)}
                      {item.tags?.map((t) => <span key={t} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs">#{t}</span>)}
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={`text-${item.id}`}
                  className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between min-h-[180px] border border-purple-50"
                >
                  <div className="mb-2">
                    <span className="text-xs text-purple-500 font-semibold">Post</span>
                    <div className="font-semibold text-gray-900 text-base mb-1 mt-1 truncate">{item.user?.name || 'Auteur inconnu'}</div>
                    <div className="text-gray-700 text-sm whitespace-pre-line mb-2">{item.content}</div>
                    {item.images && item.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {item.images.map((img, i) => (
                          <img key={i} src={img} alt="img" className="w-16 h-16 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-auto">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
