import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AuthPage({ mode: initialMode }: { mode?: 'login' | 'register' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'spectateur' | 'createur'>('spectateur');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Only redirect if user is logged in AND currently on /auth/login or /auth/register
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (typeof window !== 'undefined') {
        console.log('[DEBUG][Auth.tsx] user from supabase.auth.getUser():', user);
      }
      if (
        user &&
        (location.pathname === '/auth/login' ||
          location.pathname === '/auth/register' ||
          location.pathname === '/auth')
      ) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (initialMode && mode !== initialMode) {
      navigate(`/auth/${mode}`);
    }
  }, [mode, initialMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: selectedRole,
            },
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        
        // Synchronisation automatique vers Prisma après inscription avec le rôle directement appliqué
        if (data.user) {
          try {
            const response = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.full_name || '',
                role: selectedRole, // Rôle appliqué directement
              }),
            });
            
            if (response.ok) {
              const prismaUser = await response.json();
              console.log(`[Auth] Utilisateur créé avec le rôle: ${prismaUser.role}`);
            } else {
              console.error('[Auth] Erreur synchronisation Prisma:', await response.text());
            }
          } catch (e) {
            console.error('[Auth] Erreur synchronisation Prisma:', e);
          }
        }
        setSuccess('Inscription réussie ! Vérifiez votre email pour valider votre compte.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        
        // Récupérer le user Prisma pour la redirection
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          try {
            // S'assurer que l'utilisateur existe dans Prisma
            let res = await fetch(`/api/users?id=${user.id}`);
            let prismaUser;
            
            if (!res.ok) {
              // Si l'utilisateur n'existe pas, le créer
              console.log('[Auth] Utilisateur inexistant dans Prisma, création...');
              const createRes = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: user.id,
                  email: user.email || '',
                  name: user.user_metadata?.full_name || user.email || '',
                  role: user.user_metadata?.role || 'spectateur',
                }),
              });
              
              if (createRes.ok) {
                prismaUser = await createRes.json();
              } else {
                console.error('[Auth] Erreur création utilisateur Prisma');
                navigate('/');
                return;
              }
            } else {
              prismaUser = await res.json();
            }
            
            const userRole = prismaUser.role || 'spectateur';
            console.log('[Auth] Rôle utilisateur lors de la connexion:', userRole);
            
            if (userRole === 'admin') {
              navigate('/admin');
            } else if (userRole === 'createur') {
              navigate('/upload');
            } else {
              navigate('/');
            }
          } catch (fetchError) {
            console.error('[Auth] Erreur lors de la récupération des données utilisateur:', fetchError);
            navigate('/');
          }
        }
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Nom complet</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Type de compte</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('spectateur')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedRole === 'spectateur'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👀</div>
                      <div className="font-semibold">Spectateur</div>
                      <div className="text-sm text-gray-600">Regarder du contenu</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('createur')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedRole === 'createur'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎬</div>
                      <div className="font-semibold">Créateur</div>
                      <div className="text-sm text-gray-600">Créer du contenu</div>
                    </div>
                  </button>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  ✅ Votre rôle sera appliqué immédiatement après inscription
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg" role="alert">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <span className="text-gray-600">
              Pas encore de compte ?{' '}
              <button
                className="text-purple-600 font-semibold hover:text-purple-700"
                onClick={() => navigate('/auth/register')}
              >
                S'inscrire
              </button>
            </span>
          ) : (
            <span className="text-gray-600">
              Déjà inscrit ?{' '}
              <button
                className="text-purple-600 font-semibold hover:text-purple-700"
                onClick={() => navigate('/auth/login')}
              >
                Se connecter
              </button>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
