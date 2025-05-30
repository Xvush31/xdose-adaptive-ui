import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  User,
  Play,
  Heart,
  Share2,
  Upload,
  Home,
  Search,
  Bell,
  Menu,
  X,
  TrendingUp,
  Users,
  Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { XDoseLogo } from '@/components/XDoseLogo';
import { TrendingContent } from '@/components/TrendingContent';
import { HeroSection } from '@/components/HeroSection';

interface Video {
  id: string | number;
  title: string;
  description?: string | null;
  createdAt?: string;
  fileUrl?: string;
  muxAssetId?: string | null;
  muxUploadId?: string | null;
  status?: string;
  visibility?: string;
  userId?: string;
  user?: {
    name?: string | null;
    email: string;
  };
}

interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
}

// Navigation Component
const Navigation = ({ user, onLogout }: { user: User | null; onLogout: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home, href: '/' },
    { id: 'explore', label: 'Explorer', icon: Search, href: '/explore' },
    { id: 'upload', label: 'Upload', icon: Upload, href: '/upload' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <XDoseLogo size="sm" className="header" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors text-gray-600 hover:text-pink-500"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Bouton Menu Mobile */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg font-medium transition-colors text-gray-600 hover:bg-gray-100"
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {user && (
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors mt-4"
              >
                Se déconnecter
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// Featured Creators Section
const FeaturedCreators = () => (
  <div className="py-16 px-6 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          LA SÉLECTION DES CRÉATEURS
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: 'Sarah Martinez',
            role: 'Créatrice Lifestyle & Mode',
            gradient: 'from-pink-500 to-purple-600',
          },
          {
            name: 'Alex Chen',
            role: 'Expert Tech & Innovation',
            gradient: 'from-blue-500 to-teal-500',
          },
          {
            name: 'Maya Johnson',
            role: 'Artiste & Créative',
            gradient: 'from-amber-500 to-orange-500',
          },
        ].map((creator, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 p-8 hover:shadow-2xl transition-all duration-500"
          >
            <div className="text-center">
              <div
                className={`w-24 h-24 bg-gradient-to-r ${creator.gradient} rounded-full mx-auto mb-4 flex items-center justify-center`}
              >
                <User className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{creator.name}</h3>
              <p className="text-gray-600 mb-4">{creator.role}</p>
              <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                Suivre
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main Component
const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string>('spectateur');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Récupérer le user depuis Prisma
        try {
          const res = await fetch(`/api/users?id=${user.id}`);
          if (res.ok) {
            const prismaUser = await res.json();
            setUserRole(prismaUser.role || 'spectateur');
          } else {
            setUserRole('spectateur');
          }
        } catch (e) {
          setUserRole('spectateur');
        }
      }
    };
    const loadVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const videosData = await res.json();
        const filteredVideos = videosData.filter(
          (v) => v.status === 'ready' && v.visibility === 'public',
        );
        setVideos(filteredVideos);
      } catch (e) {
        console.error('Error loading videos:', e);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    loadVideos();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole('spectateur');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  // If not logged in, show the hero section
  if (!user) {
    return (
      <div>
        <Navigation user={user} onLogout={handleLogout} />
        <HeroSection onLogin={() => (window.location.href = '/auth/login')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} onLogout={handleLogout} />
      <FeaturedCreators />

      {/* Trending Videos Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Contenu Tendance</h3>
            <button className="text-pink-500 hover:text-pink-600 font-medium flex items-center">
              Voir tout
              <span className="ml-2">→</span>
            </button>
          </div>
          <TrendingContent />
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Vidéos Récentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="h-16 w-16 text-white" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">{video.user?.name || video.user?.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
