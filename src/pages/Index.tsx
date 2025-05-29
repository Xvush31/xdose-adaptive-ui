
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Play, User, Calendar, Eye, Heart, MessageCircle, Share2, Upload, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Video {
  id: string;
  title: string;
  description: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string>('spectateur');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setUserRole(profile?.role || 'spectateur');
      }
    };

    const loadVideos = async () => {
      const { data } = await supabase
        .from('videos')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'approved')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });
      
      setVideos(data || []);
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

  const VideoCard = ({ video }: { video: Video }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play className="h-16 w-16 text-white" />
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-sm">
          12:34
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {video.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <User className="h-4 w-4 mr-2" />
          <span className="text-sm">{video.profiles?.full_name || video.profiles?.email}</span>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{new Date(video.created_at).toLocaleDateString('fr-FR')}</span>
        </div>

        {video.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {video.description}
          </p>
        )}
        
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
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">12</span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="h-4 w-4 text-gray-500" />
          </button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                XDose
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/tendances" className="text-gray-600 hover:text-purple-600 transition-colors">
                Tendances
              </Link>
              <Link to="/createurs" className="text-gray-600 hover:text-purple-600 transition-colors">
                Créateurs
              </Link>
              {(userRole === 'createur' || userRole === 'admin') && (
                <Link to="/upload" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Upload
                </Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  )}
                  
                  {(userRole === 'createur' || userRole === 'admin') && (
                    <Link
                      to="/upload"
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Link>
                  )}
                  
                  <Link
                    to="/parametres"
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Découvrez du contenu
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}exclusif
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plongez dans un univers de créateurs talentueux et de contenu premium. 
            Rejoignez notre communauté dès aujourd'hui.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/register"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Commencer gratuitement
              </Link>
              <Link
                to="/auth/login"
                className="border-2 border-purple-500 text-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-50 transition-all duration-200"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Videos Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Vidéos populaires</h2>
          <Link 
            to="/tendances" 
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Voir tout →
          </Link>
        </div>
        
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
              <Video className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg">Aucune vidéo disponible pour le moment</p>
              <p className="text-sm">Les créateurs peuvent commencer à uploader du contenu !</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
