
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

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const apiUrl = `/api/users?id=${userId}`;
      console.log('API URL:', apiUrl);
      
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Response status:', res.status);
      console.log('API Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        console.error('API response not ok:', res.status, res.statusText);
        const text = await res.text();
        console.error('Response text:', text.substring(0, 500));
        setUserRole('spectateur');
        return;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON, content-type:', contentType);
        const text = await res.text();
        console.error('Response text:', text.substring(0, 500));
        setUserRole('spectateur');
        return;
      }

      const prismaUser = await res.json();
      console.log('Prisma user data:', prismaUser);
      setUserRole(prismaUser.role || 'spectateur');
    } catch (e) {
      console.error('Error fetching user role:', e);
      setUserRole('spectateur');
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', !!session);
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log('Fetching role for existing session user:', session.user.id);
        await fetchUserRole(session.user.id);
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
