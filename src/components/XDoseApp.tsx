import React, { useState, useEffect } from 'react';
import { Play, Search, User, Heart, MessageCircle, Share2, Upload, Settings, Home, TrendingUp, Users, DollarSign, BarChart3, Bell, Menu, X, Filter, Clock, Eye, Volume2, Brain, Palette, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Hook neuro-esthétique (version simplifiée intégrée)
const useNeuroAesthetics = (initialProfile = 'balanced') => {
  const [cognitiveProfile, setCognitiveProfile] = useState(initialProfile);
  const [circadianPeriod, setCircadianPeriod] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  });
  const [focusMode, setFocusMode] = useState(false);
  const [microRewardActive, setMicroRewardActive] = useState(false);

  const profiles = {
    visual: { animationSpeed: 1.2, colorIntensity: 1.1 },
    analytical: { animationSpeed: 0.8, colorIntensity: 0.9 },
    balanced: { animationSpeed: 1.0, colorIntensity: 1.0 },
    immersive: { animationSpeed: 1.4, colorIntensity: 1.3 }
  };

  const themes = {
    morning: { primary: 'from-yellow-400 to-orange-500', mood: 'energetic' },
    afternoon: { primary: 'from-blue-500 to-purple-600', mood: 'productive' },
    evening: { primary: 'from-purple-600 to-indigo-700', mood: 'relaxed' },
    night: { primary: 'from-slate-700 to-slate-900', mood: 'calm' }
  };

  const triggerMicroReward = (type = 'like') => {
    setMicroRewardActive(true);
    setTimeout(() => setMicroRewardActive(false), 600);
  };

  const getAdaptiveStyles = () => ({
    colors: themes[circadianPeriod],
    profile: profiles[cognitiveProfile],
    focus: focusMode
  });

  return {
    cognitiveProfile,
    setCognitiveProfile,
    circadianPeriod,
    focusMode,
    setFocusMode,
    triggerMicroReward,
    microRewardActive,
    getAdaptiveStyles,
    currentTheme: themes[circadianPeriod],
    currentProfile: profiles[cognitiveProfile]
  };
};

// XDose Logo Component avec neuro-esthétique
const XDoseLogo = ({ size = 'lg', className = '', animated = true, neuroStyles }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const colors = [
    neuroStyles?.colors.primary || 'from-purple-500 to-pink-500',
    'from-blue-500 to-teal-400',
    'from-amber-500 to-pink-500',
    'from-green-400 to-blue-500',
  ];

  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl', 
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setColorIndex(prev => (prev + 1) % colors.length);
      }, 2000 * (neuroStyles?.profile.animationSpeed || 1));
      return () => clearInterval(interval);
    }
  }, [animated, colors.length, neuroStyles]);

  return (
    <div
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`font-bold ${sizes[size]} transition-all duration-500`}
        style={{ 
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          filter: `brightness(${neuroStyles?.profile.colorIntensity || 1})`
        }}
      >
        <span
          className={`bg-gradient-to-r ${colors[colorIndex]} bg-clip-text text-transparent transition-all duration-1000`}
        >
          X
        </span>
        <span className="text-slate-600">Dose</span>
      </div>
      
      <div
        className={`h-1 bg-gradient-to-r ${colors[colorIndex]} rounded-full mt-2 transition-all duration-500`}
        style={{ 
          width: isHovered ? '100%' : '60%',
          opacity: neuroStyles?.profile.colorIntensity || 1
        }}
      />
    </div>
  );
};

const XDoseApp = () => {
  const neuro = useNeuroAesthetics('balanced');
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNeuroSettings, setShowNeuroSettings] = useState(false);

  const trendingVideos = [
    {
      id: 1,
      title: "Style & Basketball Court",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFB347;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2387CEEB;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad1)'/%3E%3Ccircle cx='150' cy='100' r='30' fill='%23228B22'/%3E%3Crect x='250' y='150' width='80' height='100' fill='%23FFD700'/%3E%3C/svg%3E",
      duration: "5:45",
      views: "12.3K",
      creator: "StyleCreator",
      premium: true
    },
    {
      id: 2,
      title: "Fashion & Shopping",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFC0CB;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238B4513;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad2)'/%3E%3Cellipse cx='200' cy='100' rx='60' ry='40' fill='%23000'/%3E%3Crect x='150' y='180' width='100' height='80' fill='%23800080'/%3E%3C/svg%3E",
      duration: "8:40",
      views: "25.7K",
      creator: "FashionGuru",
      vip: true
    },
    {
      id: 3,
      title: "Nature Landscape",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2387CEEB;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23FFD700;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2332CD32;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad3)'/%3E%3Cpolygon points='100,250 200,100 300,250' fill='%236B8E23'/%3E%3Ccircle cx='320' cy='80' r='25' fill='%23FFD700'/%3E%3C/svg%3E",
      duration: "3:07",
      views: "8.9K",
      creator: "NatureLover"
    }
  ];

  const categories = [
    { name: "All", icon: Home },
    { name: "Art", icon: Users },
    { name: "Lifestyle", icon: Heart },
    { name: "Nature", icon: Eye },
    { name: "Food", icon: TrendingUp }
  ];

  const adaptiveStyles = neuro.getAdaptiveStyles();

  // Composant de paramètres neuro-esthétiques
  const NeuroSettings = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-500" />
            Neuro-Aesthetics
          </h3>
          <button 
            onClick={() => setShowNeuroSettings(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profil cognitif */}
          <div>
            <label className="block text-sm font-medium mb-3">Cognitive Profile</label>
            <div className="grid grid-cols-2 gap-2">
              {['visual', 'analytical', 'balanced', 'immersive'].map(profile => (
                <button
                  key={profile}
                  onClick={() => neuro.setCognitiveProfile(profile)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    neuro.cognitiveProfile === profile
                      ? `bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white`
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Période circadienne */}
          <div>
            <label className="block text-sm font-medium mb-2">Current Period</label>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white flex items-center`}>
              {neuro.circadianPeriod === 'night' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
              <span className="capitalize">{neuro.circadianPeriod} - {adaptiveStyles.colors.mood}</span>
            </div>
          </div>

          {/* Mode Focus */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Focus Mode</span>
            <button
              onClick={() => neuro.setFocusMode(!neuro.focusMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                neuro.focusMode ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  neuro.focusMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Test de micro-récompense */}
          <button
            onClick={() => neuro.triggerMicroReward('achievement')}
            className="w-full p-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Test Micro-Reward ✨
          </button>
        </div>
      </div>
    </div>
  );

  // Video Card avec effets neuro-esthétiques
  const VideoCard = ({ video, featured = false }) => {
    const handleInteraction = (type) => {
      neuro.triggerMicroReward(type);
    };

    return (
      <div 
        className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
          neuro.microRewardActive ? 'scale-105 shadow-2xl' : ''
        } ${featured ? 'lg:row-span-2' : ''}`}
        style={{
          transform: neuro.microRewardActive ? 'scale(1.02)' : 'scale(1)',
          filter: `brightness(${adaptiveStyles.profile.colorIntensity})`
        }}
      >
        <div className={`relative ${featured ? 'aspect-[3/4] lg:aspect-[3/5]' : 'aspect-video'}`}>
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-4">
              <Play className="h-8 w-8 text-gray-800" fill="currentColor" />
            </div>
          </div>

          {video.premium && (
            <div className={`absolute top-3 left-3 bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white text-xs px-3 py-1 rounded-full font-medium`}>
              Premium
            </div>
          )}

          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1">{video.title}</h3>
          <p className="text-sm text-gray-600">{video.creator} • {video.views} views</p>
          
          {/* Actions avec micro-récompenses */}
          <div className="flex items-center space-x-4 mt-3">
            <button 
              onClick={() => handleInteraction('like')}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span className="text-xs">Like</span>
            </button>
            <button 
              onClick={() => handleInteraction('comment')}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">Comment</span>
            </button>
            <button 
              onClick={() => handleInteraction('share')}
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-500 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CategoryFilter = () => (
    <div className="flex items-center space-x-2 px-6 py-4 overflow-x-auto scrollbar-none">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.name;
        return (
          <button
            key={category.name}
            onClick={() => {
              setSelectedCategory(category.name);
              neuro.triggerMicroReward('discover');
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
              isActive 
                ? `bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white shadow-lg` 
                : `bg-gray-100 hover:bg-gradient-to-r hover:${adaptiveStyles.colors.primary} hover:text-white`
            }`}
            style={{
              transform: neuro.microRewardActive && isActive ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        );
      })}
    </div>
  );

  const TrendingContent = () => (
    <div className="px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Trending Content</h2>
        <button 
          onClick={() => neuro.triggerMicroReward('discover')}
          className={`bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 flex items-center`}
        >
          View all
          <span className="ml-2">→</span>
        </button>
      </div>

      {/* Message motivationnel basé sur la période circadienne */}
      <div className={`mb-6 p-4 rounded-xl bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white`}>
        <div className="flex items-center">
          {neuro.circadianPeriod === 'night' ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
          <span className="text-sm">
            {neuro.circadianPeriod === 'morning' && "Good morning! Your creativity is at its peak 🌅"}
            {neuro.circadianPeriod === 'afternoon' && "Perfect time to explore content 🎯"}
            {neuro.circadianPeriod === 'evening' && "Relax with some soothing content 🌙"}
            {neuro.circadianPeriod === 'night' && "Night mode activated for your comfort 🌜"}
          </span>
        </div>
      </div>

      {/* Grille de vidéos avec effets neuro-esthétiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <VideoCard video={trendingVideos[0]} featured={true} />
        {trendingVideos.slice(1).map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <CategoryFilter />
            <TrendingContent />
            
            {/* Indicateur de bien-être neuro-esthétique */}
            <div className="px-6">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-6 w-6 text-purple-500" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Optimized Experience</h3>
                      <p className="text-sm text-gray-600">
                        Profile: {neuro.cognitiveProfile} • {neuro.circadianPeriod}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNeuroSettings(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'upload':
        return (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Upload a video</h2>
              <div className={`border-2 border-dashed border-gray-300 rounded-xl p-12 text-center transition-all duration-300 ${
                neuro.focusMode ? 'ring-4 ring-purple-200' : ''
              }`}>
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Drag and drop your files here</h3>
                <p className="text-gray-600 mb-4">Supported formats: MP4, MOV, AVI</p>
                <button 
                  onClick={() => neuro.triggerMicroReward('achievement')}
                  className={`bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200`}
                >
                  Choose files
                </button>
              </div>
            </div>
          </div>
        );
      case 'monetization':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Monetization</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <DollarSign className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
                <p className="text-gray-600">Monthly recurring revenue</p>
                <div className="text-2xl font-bold text-green-500 mt-2">€1,234</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Heart className="h-8 w-8 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Donations</h3>
                <p className="text-gray-600">One-time contributions</p>
                <div className="text-2xl font-bold text-red-500 mt-2">€567</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <Eye className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Premium Views</h3>
                <p className="text-gray-600">Pay-per-view content</p>
                <div className="text-2xl font-bold text-blue-500 mt-2">€890</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Section in development</h2>
            <p className="text-gray-600">This section uses neuro-aesthetic principles for an optimal experience.</p>
          </div>
        );
    }
  };

  const sidebarItems = [
    { id: 'home', name: 'Home', icon: Home, path: '/' },
    { id: 'trending', name: 'Trending', icon: TrendingUp, path: '/tendances' },
    { id: 'creators', name: 'Creators', icon: Users, path: '/createurs' },
    { id: 'upload', name: 'Upload', icon: Upload, path: '/upload' },
    { id: 'monetization', name: 'Monetization', icon: DollarSign, path: '/monetisation' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/parametres' }
  ];

  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${
        neuro.focusMode 
          ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
          : 'bg-gradient-to-br from-blue-100 via-white to-blue-50'
      }`}
      style={{
        filter: `brightness(${adaptiveStyles.profile.colorIntensity})`
      }}
    >
      {/* Header avec adaptations neuro-esthétiques */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => neuro.triggerMicroReward('discover')}
                className={`w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  neuro.focusMode ? 'ring-2 ring-purple-200' : ''
                }`}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowNeuroSettings(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Brain className="h-6 w-6 text-purple-500" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar adaptatif */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-black/50 flex-1" onClick={() => setSidebarOpen(false)} />
          <div className={`bg-white w-80 p-6 shadow-xl transition-all duration-300 ${
            neuro.focusMode ? 'ring-4 ring-purple-200' : ''
          }`}>
            <div className="flex items-center justify-between mb-8">
              <XDoseLogo 
                size="md" 
                animated={!neuro.focusMode} 
                neuroStyles={adaptiveStyles}
              />
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => {
                      setSidebarOpen(false);
                      neuro.triggerMicroReward('discover');
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      window.location.pathname === item.path
                        ? `bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white shadow-lg`
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="pb-24">
        {!user ? (
          <div className="px-4 py-8">
            <div className="text-center mb-12">
              <XDoseLogo 
                size="xl" 
                className="mb-8" 
                animated={!neuro.focusMode} 
                neuroStyles={adaptiveStyles}
              />
              
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    setUser({ name: 'User', avatar: null });
                    neuro.triggerMicroReward('achievement');
                  }}
                  className={`bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white px-8 py-3 rounded-full font-medium text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto min-w-[200px]`}
                >
                  <span className="mr-2">→</span>
                  Sign in
                </button>
                
                <button className="text-gray-600 px-6 py-2 rounded-full border-0 hover:text-gray-800 transition-colors flex items-center justify-center mx-auto">
                  <User className="h-4 w-4 mr-2" />
                  Create account
                </button>
              </div>
            </div>

            <TrendingContent />
          </div>
        ) : (
          <div className="space-y-6">
            <CategoryFilter />
            <TrendingContent />
            
            {/* Indicateur de bien-être neuro-esthétique */}
            <div className="px-6">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-6 w-6 text-purple-500" />
                    <div>
                      <h3 className="font-semibold text-gray-800">Optimized Experience</h3>
                      <p className="text-sm text-gray-600">
                        Profile: {neuro.cognitiveProfile} • {neuro.circadianPeriod}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNeuroSettings(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation bottom adaptative */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { id: 'home', icon: Home, label: 'Home', path: '/' },
            { id: 'trending', icon: TrendingUp, label: 'Trending', path: '/tendances' },
            { id: 'creators', icon: Users, label: 'Creators', path: '/createurs' }
          ].map(item => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.id}
                to={item.path}
                onClick={() => neuro.triggerMicroReward('discover')}
                className={`flex flex-col items-center py-2 px-4 transition-all duration-200 ${
                  window.location.pathname === item.path 
                    ? `text-purple-500 scale-110` 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bouton son adaptatif */}
      <button 
        onClick={() => neuro.triggerMicroReward('like')}
        className={`fixed bottom-20 right-4 bg-gradient-to-r ${adaptiveStyles.colors.primary} text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
          neuro.microRewardActive ? 'scale-110 shadow-2xl' : ''
        }`}
      >
        <Volume2 className="h-6 w-6" />
      </button>

      {/* Panneau de paramètres neuro-esthétiques */}
      {showNeuroSettings && <NeuroSettings />}

      {/* Effet de micro-récompense global */}
      {neuro.microRewardActive && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-purple-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 opacity-90"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XDoseApp;
