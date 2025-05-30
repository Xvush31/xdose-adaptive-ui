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
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          const res = await fetch(`/api/users?id=${session.user.id}`);
          if (res.ok) {
            const prismaUser = await res.json();
            setUserRole(prismaUser.role || 'spectateur');
          } else {
            setUserRole('spectateur');
          }
        } catch (e) {
          setUserRole('spectateur');
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetch(`/api/users?id=${session.user.id}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((prismaUser) => setUserRole(prismaUser?.role || 'spectateur'))
          .catch(() => setUserRole('spectateur'));
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
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    window.location.href = redirectTo;
    return null;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
