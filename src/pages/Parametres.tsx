
import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Volume2, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const Parametres = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    comments: true,
    likes: false
  });

  const [darkMode, setDarkMode] = useState(false);
  const [volume, setVolume] = useState<number>(75);

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Settings className="h-8 w-8 mr-3 text-purple-500" />
              Paramètres
            </h1>
            <p className="text-gray-600 mt-2">Personnalisez votre expérience</p>
          </div>
          <Link 
            to="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
          >
            Retour
          </Link>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profil */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  defaultValue="utilisateur123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  defaultValue="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  defaultValue="Utilisateur XDose"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  defaultValue="Créateur de contenu passionné"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </h3>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">
                    {key === 'email' && 'Notifications par email'}
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

          {/* Apparence */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Apparence
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {darkMode ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
                  <span className="text-gray-700">Mode sombre</span>
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
                    <span className="text-gray-700">Volume</span>
                  </div>
                  <span className="text-sm text-gray-500">{volume}%</span>
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

          {/* Sécurité */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Sécurité et confidentialité
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-800">Changer le mot de passe</div>
                <div className="text-sm text-gray-600">Dernière modification il y a 3 mois</div>
              </button>
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-800">Authentification à deux facteurs</div>
                <div className="text-sm text-gray-600">Sécurisez votre compte</div>
              </button>
              <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-800">Télécharger mes données</div>
                <div className="text-sm text-gray-600">Exportez vos informations</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
