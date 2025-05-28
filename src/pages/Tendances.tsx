
import React from 'react';
import { TrendingUp, Flame, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tendances = () => {
  const trendingTopics = [
    { id: 1, title: "AI & Technology", growth: "+45%", posts: "2.3K", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop" },
    { id: 2, title: "Sustainable Living", growth: "+32%", posts: "1.8K", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop" },
    { id: 3, title: "Digital Art", growth: "+28%", posts: "1.5K", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop" },
    { id: 4, title: "Fashion Trends", growth: "+25%", posts: "1.2K", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop" }
  ];

  const timeframes = ['24h', '7d', '30d', '3m'];
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('24h');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="h-8 w-8 mr-3 text-purple-500" />
              Trending
            </h1>
            <p className="text-gray-600 mt-2">Discover what's popular right now</p>
          </div>
          <Link 
            to="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
          >
            Back
          </Link>
        </div>

        {/* Time filters */}
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-gray-600 font-medium">Period:</span>
          {timeframes.map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTimeframe === timeframe
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>

        {/* Trending grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={topic.image} 
                  alt={topic.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Flame className="h-3 w-3 mr-1" />
                  Hot
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{topic.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">{topic.growth}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{topic.posts} posts</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tendances;
