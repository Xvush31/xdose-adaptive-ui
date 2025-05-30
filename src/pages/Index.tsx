import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Play,
  User,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Upload,
  Settings,
  LogOut,
  VideoIcon,
  Menu,
  X,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
interface Video {
  id: string | number; // Prisma id is number
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
const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string>('spectateur');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        const videosData = await res.json();
        setVideos(
          (videosData as Video[]).filter((v) => v.status === 'ready' && v.visibility === 'public'),
        );
      } catch (e) {
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
  const XDoseLogo = () => (
    <div className="text-center mb-8">
      <div className="inline-block">
        <div className="text-5xl font-bold mt-2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            X
          </span>
          <span className="text-slate-700">Dose</span>
        </div>
        <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 animate-pulse" />
      </div>
    </div>
  );
  const VideoCard = ({ video }: { video: Video }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play className="h-16 w-16 text-white" />
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-sm">
          5:45
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Premium
          </span>
        </div>
        <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg">
          <X className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>

        <div className="flex items-center text-gray-600 mb-3">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">{video.user?.name || video.user?.email}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-sm">1.2k</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }
  // If not logged in, show a login/register prompt
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <XDoseLogo />
          <h2 className="text-2xl font-bold mb-4">Bienvenue sur XDose</h2>
          <p className="mb-6 text-gray-600">
            Connectez-vous ou créez un compte pour accéder aux vidéos.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              to="/auth/login"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Se connecter
            </Link>
            <Link
              to="/auth/register"
              className="w-full border border-purple-500 text-purple-700 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            {user && (
              <Link
                to="/upload"
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Upload className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-black/50 flex-1" onClick={() => setSidebarOpen(false)} />
          <div className="bg-white w-80 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <XDoseLogo />
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <nav className="space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200"
              >
                <Eye className="h-5 w-5" />
                <span className="font-medium">Accueil</span>
              </Link>

              <Link
                to="/tendances"
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200"
              >
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Tendances</span>
              </Link>

              <Link
                to="/createurs"
                onClick={() => setSidebarOpen(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200"
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Createurs</span>
              </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-4">
                {user ? 'Connecté en tant que ' + user.email : "Vous n'êtes pas connecté."}
              </p>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
