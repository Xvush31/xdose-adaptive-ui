import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AuthPage({ mode: initialMode }: { mode?: 'login' | 'register' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode || 'login');
  const [role, setRole] = useState<'spectateur' | 'createur'>('spectateur');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialMode && mode !== initialMode) {
      navigate(`/auth/${mode}`);
    }
    // eslint-disable-next-line
  }, [mode, initialMode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (mode === 'register') {
      // Register user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      // Insert role request if "createur" is selected
      if (role === 'createur') {
        // On récupère l'utilisateur courant pour lier la demande à son id
        const { data: currentUserData } = await supabase.auth.getUser();
        const currentUser = currentUserData?.user;
        await supabase.from('role_requests').insert({
          user_id: currentUser?.id || '',
          user_email: email,
          status: 'pending',
        });
      }
      setSuccess('Inscription réussie ! Vérifiez votre email pour valider votre compte.');
    } else {
      // Login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      setSuccess('Connexion réussie ! Redirection en cours...');
      // Récupérer le rôle de l'utilisateur après login
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      let userRole = 'spectateur';
      if (user && user.user_metadata && user.user_metadata.role) {
        userRole = user.user_metadata.role;
      }
      // Redirection selon le rôle
      if (userRole === 'createur') {
        navigate('/upload'); // page créateur
      } else if (userRole === 'admin') {
        navigate('/admin'); // page admin (à créer)
      } else {
        navigate('/'); // page spectateur
      }
    }
    setLoading(false);
  };

  return (
    <main role="main" className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div>
              <label className="block mb-1 font-medium">Choix du rôle</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value as 'spectateur' | 'createur')}
              >
                <option value="spectateur">Spectateur (par défaut)</option>
                <option value="createur">Demander à devenir Créateur</option>
              </select>
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mot de passe</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <span>
              Pas encore de compte ?{' '}
              <button
                className="text-blue-600 underline"
                onClick={() => navigate('/auth/register')}
              >
                S'inscrire
              </button>
            </span>
          ) : (
            <span>
              Déjà inscrit ?{' '}
              <button className="text-blue-600 underline" onClick={() => navigate('/auth/login')}>
                Se connecter
              </button>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
