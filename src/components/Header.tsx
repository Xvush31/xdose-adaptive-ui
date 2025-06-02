
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Search, Bell, User, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ onMenuToggle, isSidebarOpen }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch current user and profile
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };

  const getRoleBadge = () => {
    if (!profile?.role) return null;
    
    const roleConfig = {
      'createur': { label: 'Créateur', variant: 'default' as const },
      'spectateur': { label: 'Spectateur', variant: 'secondary' as const },
      'admin': { label: 'Admin', variant: 'destructive' as const },
    };

    const config = roleConfig[profile.role as keyof typeof roleConfig];
    return config ? (
      <Badge variant={config.variant} className="ml-2">
        {config.label}
      </Badge>
    ) : null;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section - Menu toggle and Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
            <span className="hidden font-bold sm:inline-block">Xdose</span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des vidéos, créateurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </form>
        </div>

        {/* Right section - Actions and User menu */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="h-5 w-5" />
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto px-2 py-1">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">
                        {profile?.full_name || user.email}
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                        {getRoleBadge()}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/parametres" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Link>
                  </DropdownMenuItem>
                  
                  {profile?.role === 'createur' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/analytics" className="cursor-pointer">
                          <span className="mr-2">📊</span>
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/monetisation" className="cursor-pointer">
                          <span className="mr-2">💰</span>
                          Monétisation
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/upload" className="cursor-pointer">
                          <span className="mr-2">📹</span>
                          Upload Contenu
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {profile?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <span className="mr-2">⚙️</span>
                          Administration
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Se connecter</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">S'inscrire</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
