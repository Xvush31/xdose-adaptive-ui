
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import AuthGuard from '@/components/AuthGuard';
import { CheckCircle, XCircle, Video, Settings, Users } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  description: string;
  user_id: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

interface PrismaUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AdminBackoffice() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [users, setUsers] = useState<PrismaUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'videos'>('users');
  const navigate = useNavigate();

  // Authentification et rôle admin via Prisma
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
      try {
        const res = await fetch(`/api/users?id=${user.id}`);
        if (res.ok) {
          const prismaUser = await res.json();
          if (prismaUser.role !== 'admin') {
            navigate('/');
            return;
          }
          setUser(user);
        } else {
          navigate('/');
          return;
        }
      } catch {
        navigate('/');
        return;
      }
      await loadData();
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  // Chargement des utilisateurs et vidéos
  const loadData = async () => {
    try {
      // Charger tous les utilisateurs depuis Prisma
      const usersRes = await fetch('/api/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData || []);
      }

      // Charger les vidéos avec les profils
      const { data: videosData, error: videoError } = await supabase
        .from('videos')
        .select('id, title, description, user_id, status, created_at')
        .order('created_at', { ascending: false });

      if (videoError) {
        console.error('Error loading videos:', videoError);
        setVideos([]);
        return;
      }

      if (!videosData || videosData.length === 0) {
        setVideos([]);
        return;
      }

      // Get user profiles for the video creators
      const userIds = videosData.map((video) => video.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        setVideos([]);
        return;
      }

      // Combine videos with their profile data
      const videosWithProfiles = videosData.map((video) => {
        const profile = profilesData?.find((p) => p.id === video.user_id);
        return {
          ...video,
          profiles: profile
            ? {
                full_name: profile.full_name || profile.email || '',
                email: profile.email || '',
              }
            : null,
        };
      });

      setVideos(videosWithProfiles);
    } catch (e) {
      setError('Erreur lors du chargement des données');
    }
  };

  // Mettre à jour le rôle d'un utilisateur
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        console.log(`Rôle utilisateur ${userId} mis à jour vers: ${newRole}`);
      } else {
        setError('Erreur lors de la mise à jour du rôle');
      }
    } catch (e) {
      setError('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleUpdateVideoStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await supabase.from('videos').update({ status }).eq('id', id);
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    } catch (e) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'accepted':
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'refused':
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'createur':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'spectateur':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );

  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-purple-500" />
                Administration
              </h1>
              <p className="text-gray-600 mt-2">Gérez les utilisateurs et le contenu</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-6xl mx-auto">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Utilisateurs ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Video className="h-5 w-5 mr-2" />
                Vidéos ({videos.filter((v) => v.status === 'pending').length})
              </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h2>
                  <p className="text-sm text-gray-600 mt-1">Modifier les rôles des utilisateurs</p>
                </div>
                {users.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Aucun utilisateur trouvé.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Nom
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Rôle actuel
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Inscription
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                            <td className="px-6 py-4">
                              <span className={getRoleBadge(user.role)}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                  className="text-sm border border-gray-200 rounded px-2 py-1"
                                >
                                  <option value="spectateur">Spectateur</option>
                                  <option value="createur">Créateur</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Modération des vidéos</h2>
                </div>
                {videos.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Aucune vidéo à modérer.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Titre
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Créateur
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {videos.map((video) => (
                          <tr key={video.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {video.title}
                                </div>
                                {video.description && (
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {video.description}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {video.profiles?.full_name || video.profiles?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(video.created_at).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4">
                              <span className={getStatusBadge(video.status)}>
                                {video.status === 'pending'
                                  ? 'En attente'
                                  : video.status === 'approved'
                                    ? 'Approuvé'
                                    : 'Rejeté'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 text-sm"
                                  disabled={video.status === 'approved'}
                                  onClick={() => handleUpdateVideoStatus(video.id, 'approved')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approuver
                                </button>
                                <button
                                  className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 text-sm"
                                  disabled={video.status === 'rejected'}
                                  onClick={() => handleUpdateVideoStatus(video.id, 'rejected')}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rejeter
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
