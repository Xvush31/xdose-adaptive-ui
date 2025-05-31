import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo = '/auth',
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          console.log('Fetching user role for:', session.user.id);
          const res = await fetch(`/api/users?id=${session.user.id}`);
          if (res.ok) {
            const prismaUser = await res.json();
            console.log('Prisma user data:', prismaUser);
            setUserRole(prismaUser.role || 'spectateur');
          } else {
            console.log('API response not ok:', res.status, res.statusText);
            setUserRole('spectateur');
          }
        } catch (e) {
          console.error('Error fetching user role:', e);
          setUserRole('spectateur');
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', !!session);
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log('Fetching role for existing session user:', session.user.id);
        fetch(`/api/users?id=${session.user.id}`)
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error(`API error: ${res.status}`);
          })
          .then((prismaUser) => {
            console.log('Initial session - Prisma user data:', prismaUser);
            setUserRole(prismaUser?.role || 'spectateur');
          })
          .catch((e) => {
            console.error('Error in initial session role fetch:', e);
            setUserRole('spectateur');
          });
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    console.log('Redirecting to auth - no user');
    window.location.href = redirectTo;
    return null;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    console.log('Access denied:', { requiredRole, userRole, isAdmin: userRole === 'admin' });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have the necessary permissions to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Current role: {userRole}</p>
          <p className="text-sm text-gray-500">Required role: {requiredRole}</p>
        </div>
      </div>
    );
  }

  console.log('AuthGuard passed - rendering children');
  return <>{children}</>;
}
