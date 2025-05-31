import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User, Search, Menu, X, Home, TrendingUp, Users, Upload, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { XDoseLogo } from '@/components/XDoseLogo';
import { TrendingContent } from '@/components/TrendingContent';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Navigation Component
const Navigation = ({
  user,
  userRole,
  onLogout,
}: {
  user: SupabaseUser | null;
  userRole: string;
  onLogout: () => void;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, href: '/tendances' },
    { id: 'creators', label: 'Creators', icon: Users, href: '/createurs' },
  ];

  // Add Upload for creators and admin
  if (userRole === 'createur' || userRole === 'admin') {
    navItems.push({ id: 'upload', label: 'Upload', icon: Upload, href: '/upload' });
  }

  // Add Admin for admin users
  if (userRole === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: Settings, href: '/admin' });
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
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
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
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
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section with Logo and Auth Buttons
const HeroSection = ({ user }: { user: SupabaseUser | null }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-16">
      <div className="max-w-4xl mx-auto text-center px-6">
        <XDoseLogo size="lg" className="mb-8 mx-auto" animated={true} />

        {!user && (
          <div className="space-y-4">
            <button
              onClick={() => navigate('/auth/login')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium text-lg hover:shadow-lg transition-all inline-flex items-center space-x-2 mx-2"
            >
              <span>Log in</span>
            </button>
            <br />
            <button
              onClick={() => navigate('/auth/register')}
              className="border-2 border-gray-400 text-gray-700 px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-50 transition-all inline-flex items-center space-x-2 mx-2"
            >
              <User className="w-5 h-5" />
              <span>Create Account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Trending Content Section
const TrendingSection = () => (
  <div className="py-12 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Trending Content</h2>
        <Link
          to="/tendances"
          className="text-purple-500 hover:text-purple-600 font-medium flex items-center space-x-2"
        >
          <span>See all</span>
          <span>→</span>
        </Link>
      </div>
      <TrendingContent />
    </div>
  </div>
);

// Bottom Navigation for Mobile
const BottomNavigation = ({ userRole }: { userRole: string }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/', color: 'text-purple-500' },
    {
      id: 'trending',
      label: 'Trending',
      icon: TrendingUp,
      href: '/tendances',
      color: 'text-gray-500',
    },
    { id: 'creators', label: 'Creators', icon: Users, href: '/createurs', color: 'text-gray-500' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href}
              className={`flex flex-col items-center py-2 ${item.color}`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// Main Component
const Index = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string>('spectateur');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ? { ...user, email: user.email ?? '' } : null);

      if (user) {
        try {
          const res = await fetch(`/api/users?id=${user.id}`);
          if (res.ok) {
            const prismaUser = await res.json();
            console.log('User role from API:', prismaUser.role); // Debug log
            setUserRole(prismaUser.role || 'spectateur');
          } else {
            console.log('API call failed, defaulting to spectateur');
            setUserRole('spectateur');
          }
        } catch (e) {
          console.error('Error fetching user role:', e);
          setUserRole('spectateur');
        }
      } else {
        setUserRole('spectateur');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole('spectateur');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-pink-100">
        <div className="text-lg font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation user={user} userRole={userRole} onLogout={handleLogout} />
      <HeroSection user={user} />
      <TrendingSection />
      <BottomNavigation userRole={userRole} />
    </div>
  );
};

export default Index;
