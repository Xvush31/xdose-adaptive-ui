import React from 'react';
import { Users, Star, Eye, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Createurs = () => {
  const creators = [
    {
      id: 1,
      name: 'Sophie Martin',
      category: 'Art & Design',
      followers: '125K',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Alexandre Dubois',
      category: 'Tech & Innovation',
      followers: '89K',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Emma Laurent',
      category: 'Lifestyle',
      followers: '156K',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verified: false,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Lucas Bernard',
      category: 'Gaming',
      followers: '203K',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true,
      rating: 4.9,
    },
  ];

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
                <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-500 transition-colors">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">Profil</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Createurs;
