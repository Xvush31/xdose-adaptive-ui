import React, { useEffect, useState } from 'react';
import { Users, Star, Eye, Heart, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Creator {
  id: string;
  name: string;
  category?: string;
  followers: number | string;
  avatar?: string;
  verified?: boolean;
  rating?: number;
}

const Createurs = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then((r) => (r.ok ? r.json() : Promise.reject('Erreur API')))
      .then((users) => {
        // Adapter les données pour matcher le format mocké
        const mapped = users
          .filter((u: any) => u.role === 'createur')
          .map((u: any) => ({
            id: u.id,
            name: u.name || u.email || 'Créateur',
            category: u.category || 'Général',
            followers: u.followers || Math.floor(Math.random() * 200) + 'K',
            avatar: u.avatar || `/placeholder.svg`,
            verified: u.verified || false,
            rating: u.rating || 4 + Math.round(Math.random() * 10) / 10,
          }));
        setCreators(mapped);
      })
      .catch(() => setError('Erreur lors du chargement'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Users className="h-8 w-8 mr-3 text-purple-500" />
              Créateurs
            </h1>
            <p className="text-gray-600 mt-2">Découvrez les meilleurs créateurs de contenu</p>
          </div>
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
          >
            Retour
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-12">Chargement…</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-800">{creator.name}</h3>
                      {creator.verified && (
                        <Star className="h-4 w-4 ml-2 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{creator.category}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 mr-2">★ {creator.rating}</span>
                      <span className="text-xs text-purple-600 font-medium">
                        {creator.followers} abonnés
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">Suivre</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">Message</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 text-gray-500 hover:text-purple-500 transition-colors"
                    onClick={() => navigate(`/createur/${creator.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Profil</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Createurs;
