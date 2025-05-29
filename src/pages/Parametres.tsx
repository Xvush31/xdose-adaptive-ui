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

interface RoleRequest {
  id: string;
  user_id: string;
  user_email: string;
  status: string;
  created_at: string;
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
  const [creatorRequestStatus, setCreatorRequestStatus] = useState<string | null>(null);
  const [creatorRequestLoading, setCreatorRequestLoading] = useState(false);
  const [creatorRequestError, setCreatorRequestError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('spectateur');

  useEffect(() => {
    const fetchUserData = async () => {
      setCreatorRequestLoading(true);
      setCreatorRequestError(null);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
        
        if (user) {
          // Get user role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setUserRole(profile?.role || 'spectateur');

          // Get role request status if not already a creator
          if (profile?.role !== 'createur' && profile?.role !== 'admin') {
            const { data, error } = await supabase
              .from('role_requests')
              .select('status')
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (error && error.code !== 'PGRST116') {
              setCreatorRequestError(error.message);
            } else {
              setCreatorRequestStatus(data?.status || null);
            }
          }
        }
      } catch (e) {
        setCreatorRequestError(e instanceof Error ? e.message : 'Erreur inconnue');
      } finally {
        setCreatorRequestLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleBecomeCreator = async () => {
    setCreatorRequestLoading(true);
    setCreatorRequestError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCreatorRequestError('Vous devez être connecté.');
        return;
      }

      // Check if request already exists
      const { data: existing } = await supabase
        .from('role_requests')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existing) {
        setCreatorRequestError('Demande déjà envoyée.');
        return;
      }

      const { error } = await supabase.from('role_requests').insert({
        user_id: user.id,
        user_email: user.email || '',
        status: 'pending',
      });

      if (error) {
        setCreatorRequestError(error.message);
      } else {
        setCreatorRequestStatus('pending');
      }
    } catch (e) {
      setCreatorRequestError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setCreatorRequestLoading(false);
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userRole === 'admin' ? 'bg-red-100 text-red-800' :
                  userRole === 'createur' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userRole === 'admin' ? 'Administrateur' :
                   userRole === 'createur' ? 'Créateur' : 'Spectateur'}
                </span>
              </div>

              {/* Interface Devenir créateur */}
              {userRole === 'spectateur' && (
                <div className="mt-8 p-4 bg-purple-50 rounded-xl">
                  <h4 className="text-lg font-semibold mb-2">Devenir créateur</h4>
                  {creatorRequestStatus === 'pending' ? (
                    <div className="text-yellow-600 font-medium">
                      Votre demande est en attente de validation.
                    </div>
                  ) : creatorRequestStatus === 'accepted' ? (
                    <div className="text-green-600 font-medium">Votre demande a été acceptée !</div>
                  ) : creatorRequestStatus === 'refused' ? (
                    <div className="text-red-600 font-medium">Votre demande a été refusée.</div>
                  ) : (
                    <button
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                      onClick={handleBecomeCreator}
                      disabled={creatorRequestLoading}
                    >
                      {creatorRequestLoading ? 'Envoi...' : 'Demander à devenir créateur'}
                    </button>
                  )}
                  {creatorRequestError && (
                    <div className="text-red-600 text-sm mt-2">{creatorRequestError}</div>
                  )}
                </div>
              )}
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
                    {darkMode ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
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
                  <div className="font-semibold text-gray-900">Authentification à deux facteurs</div>
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
