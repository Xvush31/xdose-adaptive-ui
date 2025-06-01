import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Video {
  id: number;
  title: string;
  thumbnailUrl?: string;
  fileUrl: string;
  user?: { id: string; name?: string };
  categories?: string[];
  tags?: string[];
  views?: number;
}

const Feed: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('recent');
  const [creator, setCreator] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allCreators, setAllCreators] = useState<{id: string, name: string}[]>([]);
  const [recommendations, setRecommendations] = useState<Video[]>([]);

  // Récupérer toutes les catégories/tags/créateurs pour les filtres
  useEffect(() => {
    fetch('/api/videos')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        setVideos(Array.isArray(data) ? data : []);
        // Extraire toutes les catégories/tags/créateurs uniques
        const cats = new Set<string>();
        const tags = new Set<string>();
        const creators = new Map<string, string>();
        data.forEach((v: Video) => {
          v.categories?.forEach((c) => cats.add(c));
          v.tags?.forEach((t) => tags.add(t));
          if (v.user?.id) creators.set(v.user.id, v.user.name || v.user.id);
        });
        setAllCategories(Array.from(cats));
        setAllTags(Array.from(tags));
        setAllCreators(Array.from(creators.entries()).map(([id, name]) => ({id, name})));
      });
  }, []);

  // Récupérer recommandations au chargement
  useEffect(() => {
    fetch('/api/videos?recommendations=1')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setRecommendations(Array.isArray(data) ? data : []));
  }, []);

  // Fetch vidéos filtrées
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (tag) params.append('tag', tag);
    if (creator) params.append('creator', creator);
    if (sort === 'popular') params.append('sort', 'popular');
    fetch(`/api/videos?${params.toString()}`)
      .then((r) => r.ok ? r.json() : Promise.reject('Erreur API'))
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .catch(() => setError('Erreur lors du chargement'))
      .finally(() => setLoading(false));
  }, [category, tag, creator, sort]);

  // Recherche avancée (titre, tags, créateur)
  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    (v.tags && v.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) ||
    (v.user?.name && v.user.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section recommandations */}
        {recommendations.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Suggestions pour vous</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map((video) => (
                <Link
                  key={video.id}
                  to={video.fileUrl}
                  target="_blank"
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group flex flex-col"
                >
                  <div className="aspect-video bg-neutral-200 flex items-center justify-center">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="object-cover w-full h-full group-hover:scale-105 transition" />
                    ) : (
                      <div className="text-neutral-400">Miniature indisponible</div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-semibold text-base text-gray-900 mb-1 truncate">{video.title}</h3>
                    <span className="text-xs text-gray-500">{video.user?.name || 'Créateur inconnu'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Feed</h1>
          <input
            type="text"
            placeholder="Recherche titre, tag ou créateur..."
            className="w-full md:w-80 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Filtres avancés */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200">
            <option value="">Toutes catégories</option>
            {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={tag} onChange={e => setTag(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200">
            <option value="">Tous tags</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={creator} onChange={e => setCreator(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200">
            <option value="">Tous créateurs</option>
            {allCreators.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200">
            <option value="recent">Plus récentes</option>
            <option value="popular">Populaires</option>
          </select>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-12">Chargement…</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Aucune vidéo trouvée.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((video) => (
              <Link
                key={video.id}
                to={video.fileUrl}
                target="_blank"
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
              >
                <div className="aspect-video bg-neutral-200 flex items-center justify-center">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="object-cover w-full h-full group-hover:scale-105 transition" />
                  ) : (
                    <div className="text-neutral-400">Miniature indisponible</div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="font-semibold text-lg text-gray-900 mb-1 truncate">{video.title}</h2>
                  <span className="text-xs text-gray-500">{video.user?.name || 'Créateur inconnu'}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {video.categories?.map((c) => <span key={c} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">{c}</span>)}
                    {video.tags?.map((t) => <span key={t} className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs">#{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
