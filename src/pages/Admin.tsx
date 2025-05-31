import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import AuthGuard from '@/components/AuthGuard';
import { CheckCircle, XCircle, Clock, Users, Video, Settings } from 'lucide-react';

interface RoleRequest {
  id: string;
  user_id: string;
  user_email: string;
  status: string;
  created_at: string;
}

import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User as SupabaseUser } from '@supabase/supabase-js'; // Renamed to avoid conflict
import AuthGuard from '@/components/AuthGuard';
import { CheckCircle, XCircle, Clock, Users, Video, Settings, ShieldAlert, ListChecks } from 'lucide-react'; // Added ShieldAlert, ListChecks

// From CreatorApplication model in Prisma
interface CreatorApplicationData {
  id: string;
  userId: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  user: { // Included user data
    email: string | null;
    name: string | null;
  };
}

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

export default function AdminBackoffice() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null); // Use renamed SupabaseUser
  const [roleRequests, setRoleRequests] = useState<RoleRequest[]>([]); // Old system, keep for now
  const [creatorApplications, setCreatorApplications] = useState<CreatorApplicationData[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'videos' | 'creator_applications'>('creator_applications'); // Default to new tab
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<string | null>(null); // For specific action errors

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
      await loadInitialData(); // Renamed function
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  const fetchCreatorApplications = async () => {
    if (!user) return; // Should be checked by AuthGuard anyway
    setActionError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Session non trouvée.");
        return;
      }
      const response = await fetch('/api/creator-applications', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Erreur ${response.status} lors de la récupération des candidatures.`);
      }
      const data: CreatorApplicationData[] = await response.json();
      setCreatorApplications(data);
    } catch (e: any) {
      console.error("Erreur fetchCreatorApplications:", e);
      setError(e.message || 'Impossible de charger les candidatures créateur.');
    }
  };

  useEffect(() => {
    if (user && activeTab === 'creator_applications') {
      fetchCreatorApplications();
    }
  }, [user, activeTab]);


  // Chargement des vidéos et des demandes de rôle (depuis Prisma uniquement si migration totale)
  const loadInitialData = async () => { // Renamed from loadData
    try {
      // Load old role requests (keeping this part for now as per instructions)
      const { data: requests, error: reqError } = await supabase
        .from('role_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (reqError) {
        setError(reqError.message); // This might overwrite other errors, consider multiple error states or combining messages
      } else {
        setRoleRequests(requests || []);
      }

      // Load videos
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

  // Mise à jour du rôle créateur via Prisma (OLD SYSTEM - kept for now)
  const handleUpdateRoleStatus = async (
    id: string, // This is role_request_id
    status: 'accepted' | 'refused',
    userIdForPrismaUpdate?: string, // This is user_id from role_request
  ) => {
    setActionError(null);
    try {
      if (status === 'accepted' && userIdForPrismaUpdate) {
        // Update Prisma user role
         const { data: { session } } = await supabase.auth.getSession();
         if (!session) throw new Error("Session non trouvée pour mise à jour rôle.");

        await fetch(`/api/users`, { // This API needs to be robust
          method: 'POST', // Assuming this API handles user update by ID and sets role
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`, // Ensure this API is protected
          },
          body: JSON.stringify({ id: userIdForPrismaUpdate, role: 'createur' }),
        });
      }
      // Update the Supabase role_requests table (old system)
      const { error: updateError } = await supabase
        .from('role_requests')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      setRoleRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (e: any) {
      console.error("Erreur handleUpdateRoleStatus:", e);
      setActionError(e.message || 'Erreur lors de la mise à jour du statut (ancien système).');
    }
  };

  const handleCreatorApplicationUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    setActionError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setActionError("Session non trouvée. Veuillez vous reconnecter.");
        return;
      }
      const response = await fetch(`/api/creator-applications?id=${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Erreur ${response.status} lors de la mise à jour.`);
      }
      const updatedApplication: CreatorApplicationData = await response.json();
      setCreatorApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updatedApplication : app)),
      );
    } catch (e: any) {
      console.error("Erreur handleCreatorApplicationUpdate:", e);
      setActionError(e.message || 'Impossible de mettre à jour la candidature.');
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
                onClick={() => setActiveTab('requests')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'requests'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Anciennes Demandes ({roleRequests.filter((r) => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setActiveTab('creator_applications')}
                className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'creator_applications'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListChecks className="h-5 w-5 mr-2" />
                Candidatures Créateur ({creatorApplications.filter((app) => app.status === 'pending').length})
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

            {/* Role Requests Tab */}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Demandes créateurs</h2>
                </div>
                {roleRequests.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Aucune demande en attente.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            Email
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
                        {roleRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{req.user_email}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(req.created_at).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4">
                              <span className={getStatusBadge(req.status)}>
                                {req.status === 'pending'
                                  ? 'En attente'
                                  : req.status === 'accepted'
                                    ? 'Accepté'
                                    : 'Refusé'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 text-sm"
                                  disabled={req.status === 'accepted' || req.status === 'refused'}
                                  onClick={() =>
                                    handleUpdateRoleStatus(req.id, 'accepted', req.user_id) // pass user_id for Prisma update
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accepter
                                </button>
                                <button
                                  className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 text-sm"
                                  disabled={req.status === 'accepted' || req.status === 'refused'}
                                  onClick={() =>
                                    handleUpdateRoleStatus(req.id, 'refused', req.user_id)
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Refuser
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

            {/* Creator Applications Tab (New) */}
            {activeTab === 'creator_applications' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">Gestion des Candidatures Créateur</h2>
                </div>
                {actionError && <div className="m-4 p-3 bg-red-100 text-red-700 rounded-md">{actionError}</div>}
                {creatorApplications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Aucune candidature à traiter.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raison</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Dépôt</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {creatorApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{app.user?.name || 'N/A'}</div>
                              <div className="text-xs text-gray-500">{app.user?.email || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-700 max-w-xs truncate" title={app.reason || ''}>
                                {app.reason || <span className="text-gray-400">Aucune raison fournie</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(app.createdAt).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getStatusBadge(app.status)}>
                                {app.status === 'pending' ? 'En attente' :
                                 app.status === 'approved' ? 'Approuvée' :
                                 app.status === 'rejected' ? 'Rejetée' : app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {app.status === 'pending' ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleCreatorApplicationUpdate(app.id, 'approved')}
                                    className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                                  </button>
                                  <button
                                    onClick={() => handleCreatorApplicationUpdate(app.id, 'rejected')}
                                    className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> Rejeter
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">Traitée</span>
                              )}
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
