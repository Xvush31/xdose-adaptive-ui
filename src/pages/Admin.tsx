import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface RoleRequest {
  id: string;
  user_id: string;
  user_email: string;
  status: string;
  created_at: string;
}

export default function AdminBackoffice() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        navigate('/');
        return;
      }
      if (user.user_metadata?.role !== 'admin') {
        navigate('/');
        return;
      }
      setUser(user);
      // Charger les demandes créateur
      const { data: requests, error: reqError } = await supabase
        .from('role_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (reqError) setError(reqError.message);
      setRoleRequests(requests || []);
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  // Appel Edge Function pour notification email
  const notifyUser = async (email: string, status: 'accepted' | 'refused') => {
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-creator-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, status }),
      });
    } catch (e) {
      // Optionnel: afficher une erreur admin
    }
  };

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'refused', email?: string) => {
    await supabase.from('role_requests').update({ status }).eq('id', id);
    setRoleRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (email) await notifyUser(email, status);
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Demandes Créateur</h1>
      {roleRequests.length === 0 ? (
        <div>Aucune demande en attente.</div>
      ) : (
        <table className="w-full border bg-white rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roleRequests.map((req) => (
              <tr key={req.id} className="border-t">
                <td className="p-3">{req.user_email}</td>
                <td className="p-3 capitalize">{req.status}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                    disabled={req.status === 'accepted'}
                    onClick={() => handleUpdateStatus(req.id, 'accepted', req.user_email)}
                  >
                    Valider
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    disabled={req.status === 'refused'}
                    onClick={() => handleUpdateStatus(req.id, 'refused', req.user_email)}
                  >
                    Refuser
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
