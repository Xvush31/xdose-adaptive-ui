import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect } from 'react';
import {
  Settings,
  User as UserIcon,
  Bell,
  Shield,
  Palette,
  Volume2,
  Moon,
  Sun,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';

import { supabase } from '@/integrations/supabase/client';
import React, { useState, useEffect, FormEvent } from 'react'; // Added FormEvent
import {
  Settings,
  User as UserIcon,
  Bell,
  Shield,
  Palette,
  Volume2,
  Moon,
  Sun,
  Send, // Added Send icon
  AlertTriangle, // Added AlertTriangle
  CheckCircle, // Added CheckCircle
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';

// Interface for CreatorApplication (can be moved to a types file later)
interface CreatorApplication {
  id: string;
  userId: string;
  reason?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const Parametres = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    comments: true,
    likes: false,
  });

  const [darkMode, setDarkMode] = useState(false);
  const [volume, setVolume] = useState<number>(75);

  // State for new creator application system
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('spectateur');
  const [creatorApplication, setCreatorApplication] = useState<CreatorApplication | null>(null);
  const [applicationReason, setApplicationReason] = useState('');
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);


  useEffect(() => {
    const fetchUserDataAndApplication = async () => {
      setIsLoadingUserData(true);
      setApplicationMessage(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCurrentUser(null);
          setUserRole('spectateur');
          setCreatorApplication(null);
          setIsLoadingUserData(false);
          return;
        }
        const user = session.user;
        setCurrentUser(user);

        if (user) {
          // 1. Fetch Prisma User Role
          try {
            const userRes = await fetch(`/api/users?id=${user.id}`, {
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (userRes.ok) {
              const prismaUser = await userRes.json();
              setUserRole(prismaUser.role || 'spectateur');
            } else {
              console.error('Failed to fetch user role, defaulting to spectateur');
              setUserRole('spectateur');
            }
          } catch (e) {
            console.error('Error fetching user role:', e);
            setUserRole('spectateur');
          }

          // 2. Fetch Creator Application Status (only if user is spectateur)
          // Role might not be updated immediately after application, so we fetch application regardless of initial role for now.
          // We will use application status primarily to gate the form.
          try {
            const appRes = await fetch(`/api/creator-applications?userId=${user.id}`, {
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (appRes.ok) {
              const applicationData = await appRes.json();
              setCreatorApplication(applicationData);
            } else if (appRes.status === 404) {
              setCreatorApplication(null); // No application found
            } else {
              const errorData = await appRes.json();
              console.error('Failed to fetch creator application:', errorData.error);
              setApplicationMessage({type: 'error', text: `Erreur récupération statut candidature: ${errorData.error}`});
            }
          } catch (e) {
            console.error('Error fetching creator application:', e);
            setApplicationMessage({type: 'error', text: 'Impossible de vérifier le statut de votre candidature.'});
          }
        }
      } catch (e) {
        console.error('Error fetching session or user data:', e);
        setApplicationMessage({type: 'error', text: 'Erreur chargement données utilisateur.'});
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserDataAndApplication();
  }, []); // Run once on mount

  const handleApplicationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setApplicationMessage({type: 'error', text: 'Vous devez être connecté.'});
      return;
    }
    setIsSubmittingApplication(true);
    setApplicationMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setApplicationMessage({type: 'error', text: 'Session expirée. Veuillez vous reconnecter.'});
        setIsSubmittingApplication(false);
        return;
      }

      const response = await fetch('/api/creator-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId: currentUser.id, reason: applicationReason }),
      });

      const responseData = await response.json();

      if (response.status === 201) {
        setCreatorApplication(responseData);
        setApplicationMessage({type: 'success', text: 'Candidature envoyée ! Vous serez notifié après examen.'});
      } else if (response.status === 409) {
        setCreatorApplication(responseData.application); // Store existing application
        setApplicationMessage({type: 'info', text: 'Vous avez déjà une candidature en cours.'});
      } else {
        setApplicationMessage({type: 'error', text: responseData.error || 'Erreur lors de l\'envoi de la candidature.'});
      }
    } catch (error: any) {
      console.error('Erreur soumission candidature:', error);
      setApplicationMessage({type: 'error', text: error.message || 'Une erreur inconnue est survenue.'});
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-purple-500" />
                Paramètres
              </h1>
              <p className="text-gray-600 mt-2">Personnalisez votre expérience</p>
            </div>
            <Link
              to="/"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Retour
            </Link>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Profil
              </h3>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Rôle actuel:</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userRole === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : userRole === 'createur'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {userRole === 'admin'
                    ? 'Administrateur'
                    : userRole === 'createur'
                      ? 'Créateur'
                      : 'Spectateur'}
                </span>
              </div>

              {/* Interface Devenir créateur - Nouvelle version */}
              {isLoadingUserData && <p>Chargement des informations utilisateur...</p>}

              {!isLoadingUserData && currentUser && userRole === 'spectateur' && (
                <div className="mt-8 p-6 bg-purple-50 rounded-2xl shadow">
                  <h4 className="text-xl font-semibold mb-4 text-purple-700">Devenir Créateur</h4>
                  {applicationMessage && (
                    <div className={`p-3 rounded-md mb-4 text-sm ${
                      applicationMessage.type === 'success' ? 'bg-green-100 text-green-700' :
                      applicationMessage.type === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    } flex items-center`}
                    >
                      {applicationMessage.type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
                      {applicationMessage.type === 'error' && <AlertTriangle className="h-5 w-5 mr-2" />}
                      {applicationMessage.text}
                    </div>
                  )}

                  {creatorApplication && creatorApplication.status === 'pending' && (
                    <div className="p-3 rounded-md bg-yellow-100 text-yellow-700">
                      <p className="font-medium">Votre candidature est en cours d'examen.</p>
                      <p className="text-sm">Vous serez notifié une fois qu'elle aura été traitée.</p>
                    </div>
                  )}

                  {creatorApplication && creatorApplication.status === 'approved' && (
                    <div className="p-3 rounded-md bg-green-100 text-green-700">
                      <p className="font-medium">Félicitations ! Votre candidature a été approuvée.</p>
                      <p className="text-sm">Vous avez maintenant accès aux fonctionnalités de créateur. Votre rôle sera mis à jour sous peu.</p>
                    </div>
                  )}

                  {creatorApplication && creatorApplication.status === 'rejected' && (
                     <div className="p-3 rounded-md bg-red-100 text-red-700">
                      <p className="font-medium">Votre candidature a été rejetée.</p>
                      {/* Optionally, provide a way to re-apply or contact support */}
                    </div>
                  )}

                  {(!creatorApplication || creatorApplication.status === 'rejected') && // Show form if no application or if rejected (allowing re-application)
                    !(creatorApplication && (creatorApplication.status === 'pending' || creatorApplication.status === 'approved')) && // Hide if pending or approved
                    !applicationMessage?.type || (applicationMessage.type !== 'success' && applicationMessage.type !== 'info' && !(creatorApplication && creatorApplication.status === 'pending')) && // Also hide form on success/info messages or if status became pending
                    (
                    <form onSubmit={handleApplicationSubmit}>
                      <div className="mb-4">
                        <label htmlFor="applicationReason" className="block text-sm font-medium text-gray-700 mb-1">
                          Pourquoi souhaitez-vous devenir créateur ? (Optionnel)
                        </label>
                        <textarea
                          id="applicationReason"
                          value={applicationReason}
                          onChange={(e) => setApplicationReason(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Partagez vos motivations, le type de contenu que vous souhaitez créer, etc."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingApplication}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-70 flex items-center justify-center"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        {isSubmittingApplication ? 'Envoi en cours...' : 'Envoyer ma Candidature'}
                      </button>
                    </form>
                  )}
                </div>
              )}
              {/* Fin Interface Devenir créateur */}
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium capitalize">
                      {key === 'email' && 'Notifications email'}
                      {key === 'push' && 'Notifications push'}
                      {key === 'comments' && 'Nouveaux commentaires'}
                      {key === 'likes' && 'Nouveaux likes'}
                    </span>
                    <button
                      onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Apparence
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {darkMode ? (
                      <Moon className="h-5 w-5 mr-2" />
                    ) : (
                      <Sun className="h-5 w-5 mr-2" />
                    )}
                    <span className="text-gray-700 font-medium">Mode sombre</span>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Volume2 className="h-5 w-5 mr-2" />
                      <span className="text-gray-700 font-medium">Volume</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Sécurité et confidentialité
              </h3>
              <div className="space-y-4">
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="font-semibold text-gray-900">Changer le mot de passe</div>
                  <div className="text-sm text-gray-600">Dernière modification il y a 3 mois</div>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="font-semibold text-gray-900">
                    Authentification à deux facteurs
                  </div>
                  <div className="text-sm text-gray-600">Sécurisez votre compte</div>
                </button>
                <button className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="font-semibold text-gray-900">Télécharger mes données</div>
                  <div className="text-sm text-gray-600">Exportez vos informations</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Parametres;
