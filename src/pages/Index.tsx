
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { XDoseLogo } from '@/components/XDoseLogo';
import { TrendingContent } from '@/components/TrendingContent';

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

// Navigation Component - Style Nike
const Navigation = ({ user, onLogout }: { user: User | null; onLogout: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home, href: '/' },
    { id: 'explore', label: 'Explorer', icon: Search, href: '/tendances' },
    { id: 'creators', label: 'Créateurs', icon: Users, href: '/createurs' },
    { id: 'upload', label: 'Upload', icon: Upload, href: '/upload' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <XDoseLogo size="sm" className="header" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors text-gray-700 hover:text-purple-600"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/parametres"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </Link>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
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
            {!user && (
              <div className="mt-4 px-4 space-y-2">
                <Link
                  to="/auth/login"
                  className="block w-full text-center py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  to="/auth/register"
                  className="block w-full text-center py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section - Style Nike
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Hero Video/Image Background */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full bg-gradient-to-br from-purple-900/90 via-pink-600/80 to-blue-500/70">
          {/* Background avec overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='heroGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f093fb;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23heroGrad)'/%3E%3Ccircle cx='300' cy='200' r='120' fill='%23ffffff' opacity='0.1'/%3E%3Ccircle cx='900' cy='600' r='80' fill='%23ffffff' opacity='0.15'/%3E%3Cpolygon points='600,100 800,300 400,300' fill='%23ffffff' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            CRÉATEURS DE
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              CONTENU
            </span>
            <br />
            EXCLUSIF
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-lg">
            Découvre du contenu premium créé par les meilleurs talents. Rejoins une communauté qui
            valorise la créativité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/auth/register')}
              className="group bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Commencer maintenant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/tendances')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Explorer le contenu
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
};

// Featured Content Section
const FeaturedContentSection = () => (
  <div className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">
          CONTENU TENDANCE
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvre les vidéos les plus populaires créées par notre communauté de créateurs
        </p>
      </div>

      <TrendingContent />
    </div>
  </div>
);

// Call to Action Section
const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          PRÊT À CRÉER ?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Rejoins des milliers de créateurs qui partagent déjà leur passion sur XDose
        </p>
        <button
          onClick={() => navigate('/auth/register')}
          className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center space-x-2"
        >
          <span>Rejoindre XDose</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Main Component
const Index = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="text-lg font-medium text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} onLogout={handleLogout} />
      <HeroSection />
      <FeaturedContentSection />
      <CallToActionSection />
    </div>
  );
};

export default Index;
