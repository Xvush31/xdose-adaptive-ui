
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  TrendingUp,
  Users,
  Upload,
  DollarSign,
  BarChart3,
  Settings,
  Shield,
  Heart,
  Bookmark,
  UserPlus,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

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

  const generalNavItems = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/feed', icon: Heart, label: 'Feed' },
    { to: '/tendances', icon: TrendingUp, label: 'Tendances' },
    { to: '/createurs', icon: Users, label: 'Créateurs' },
  ];

  const userNavItems = user ? [
    { to: '/bookmarks', icon: Bookmark, label: 'Favoris' },
    { to: '/following', icon: UserPlus, label: 'Abonnements' },
  ] : [];

  const creatorNavItems = profile?.role === 'createur' ? [
    { to: '/upload', icon: Upload, label: 'Upload Contenu' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/monetisation', icon: DollarSign, label: 'Monétisation' },
  ] : [];

  const adminNavItems = profile?.role === 'admin' ? [
    { to: '/admin', icon: Shield, label: 'Administration' },
  ] : [];

  const settingsNavItems = user ? [
    { to: '/parametres', icon: Settings, label: 'Paramètres' },
  ] : [];

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, badge }: { 
    to: string; 
    icon: any; 
    label: string; 
    badge?: string 
  }) => (
    <Button
      variant={isActive(to) ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start gap-3 h-12',
        isActive(to) && 'bg-secondary text-secondary-foreground'
      )}
      asChild
    >
      <Link to={to} onClick={onClose}>
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
        {badge && (
          <Badge variant="secondary" className="ml-auto">
            {badge}
          </Badge>
        )}
      </Link>
    </Button>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header with close button on mobile */}
          <div className="flex h-16 items-center justify-between border-b px-4 md:hidden">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
              <span className="font-bold">Xdose</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3">
            <div className="space-y-6 py-6">
              {/* General Navigation */}
              <div>
                <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </h3>
                <div className="space-y-1">
                  {generalNavItems.map((item) => (
                    <NavItem key={item.to} {...item} />
                  ))}
                </div>
              </div>

              {/* User-specific navigation */}
              {userNavItems.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Bibliothèque
                    </h3>
                    <div className="space-y-1">
                      {userNavItems.map((item) => (
                        <NavItem key={item.to} {...item} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Creator-specific navigation */}
              {creatorNavItems.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Créateur
                    </h3>
                    <div className="space-y-1">
                      {creatorNavItems.map((item) => (
                        <NavItem key={item.to} {...item} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Admin navigation */}
              {adminNavItems.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Administration
                    </h3>
                    <div className="space-y-1">
                      {adminNavItems.map((item) => (
                        <NavItem key={item.to} {...item} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Settings */}
              {settingsNavItems.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="space-y-1">
                      {settingsNavItems.map((item) => (
                        <NavItem key={item.to} {...item} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          {/* User profile summary at bottom */}
          {profile && (
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {profile.full_name || 'Utilisateur'}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {profile.role === 'createur' ? 'Créateur' : 
                     profile.role === 'admin' ? 'Admin' : 'Spectateur'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
