import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Play, User, Calendar, Eye, Heart, MessageCircle, Share2, Upload, Settings, LogOut, VideoIcon, Menu, X, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
interface Video {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
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
        data: {
          user
        }
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const {
          data: profile
        } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        setUserRole(profile?.role || 'spectateur');
      }
    };
    const loadVideos = async () => {
      // First get videos with approved status and public visibility
      const {
        data: videosData,
        error: videosError
      } = await supabase.from('videos').select('id, title, description, created_at, user_id').eq('status', 'approved').eq('visibility', 'public').order('created_at', {
        ascending: false
      });
      if (videosError) {
        console.error('Error loading videos:', videosError);
        setVideos([]);
        setLoading(false);
        return;
      }
      if (!videosData || videosData.length === 0) {
        setVideos([]);
        setLoading(false);
        return;
      }

      // Get user profiles for the video creators
      const userIds = videosData.map(video => video.user_id);
      const {
        data: profilesData,
        error: profilesError
      } = await supabase.from('profiles').select('id, full_name, email').in('id', userIds);
      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        setVideos([]);
        setLoading(false);
        return;
      }

      // Combine videos with their profile data
      const videosWithProfiles = videosData.map(video => {
        const profile = profilesData?.find(p => p.id === video.user_id);
        return {
          ...video,
          profiles: profile ? {
            full_name: profile.full_name || profile.email || '',
            email: profile.email || ''
          } : null
        };
      });
      setVideos(videosWithProfiles);
      setLoading(false);
    };
    checkAuth();
    loadVideos();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole('spectateur');
  };
  const XDoseLogo = () => <div className="text-center mb-8">
      <div className="inline-block">
        
        <div className="text-5xl font-bold mt-2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            X
          </span>
          <span className="text-slate-700">Dose</span>
        </div>
        <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 animate-pulse" />
      </div>
    </div>;
  const VideoCard = ({
    video
  }: {
    video: Video;
  }) => <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
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
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {video.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">{video.profiles?.full_name || video.profiles?.email}</span>
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
    </div>;
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          <div className="flex-1 max-w-md mx-4">
            <input type="text" placeholder="Rechercher..." className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
          </div>
          
          <div className="flex items-center space-x-2">
            {user && <Link to="/upload" className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Upload className="h-5 w-5" />
              </Link>}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && <div className="fixed inset-0 z-50 flex">
          <div className="bg-black/50 flex-1" onClick={() => setSidebarOpen(false)} />
          <div className="bg-white w-80 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <XDoseLogo />
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <nav className="space-y-2">
              <Link to="/" onClick={() => setSidebarOpen(false)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200">
                <Eye className="h-5 w-5" />
                <span className="font-medium">Accueil</span>
              </Link>
              
              <Link to="/tendances" onClick={() => setSidebarOpen(false)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Tendances</span>
              </Link>
              
              <Link to="/createurs" onClick={() => setSidebarOpen(false)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200">
                <Users className="h-5 w-5" />
                <span className="font-medium">Créateurs</span>
              </Link>

              {(userRole === 'createur' || userRole === 'admin') && <Link to="/upload" onClick={() => setSidebarOpen(false)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200">
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">Upload</span>
                </Link>}

              {user && <>
                  {userRole === 'admin' && <Link to="/admin" onClick={() => setSidebarOpen(false)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200">
                      <Settings className="h-5 w-5" />
                      <span className="font-medium">Admin</span>
                    </Link>}
                  
                  <Link to="/parametres" onClick={() => setSidebarOpen(false)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Paramètres</span>
                  </Link>
                  
                  <button onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-all duration-200">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </>}
            </nav>
          </div>
        </div>}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!user ? <>
            <XDoseLogo />
            
            <div className="text-center space-y-4 mb-12">
              <Link to="/auth/login" className="block w-full max-w-sm mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-200">
                → Se connecter
              </Link>
              
              <Link to="/auth/register" className="flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
                <User className="h-4 w-4 mr-2" />
                Créer un compte
              </Link>
            </div>
          </> : null}

        {/* Trending Content Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Content</h2>
            <Link to="/tendances" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center">
              Voir tout →
            </Link>
          </div>
          
          {videos.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => <VideoCard key={video.id} video={video} />)}
            </div> : <div className="text-center py-16">
              <div className="text-gray-500 mb-4">
                <VideoIcon className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Aucune vidéo disponible pour le moment</p>
                <p className="text-sm">Les créateurs peuvent commencer à uploader du contenu !</p>
              </div>
            </div>}
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center py-2 px-4 text-purple-500">
            <Eye className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Accueil</span>
          </Link>
          
          <Link to="/tendances" className="flex flex-col items-center py-2 px-4 text-gray-400 hover:text-gray-600">
            <TrendingUp className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Tendances</span>
          </Link>
          
          <Link to="/createurs" className="flex flex-col items-center py-2 px-4 text-gray-400 hover:text-gray-600">
            <Users className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">Créateurs</span>
          </Link>
        </div>
      </nav>
    </div>;
};
export default Index;