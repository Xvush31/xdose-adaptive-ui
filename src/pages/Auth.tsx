
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

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
              full_name: fullName 
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
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

        // Get user profile to determine redirect
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          const userRole = profile?.role || 'spectateur';
          
          if (userRole === 'admin') {
            navigate('/admin');
          } else if (userRole === 'createur') {
            navigate('/upload');
          } else {
            navigate('/');
          }
        }
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
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
