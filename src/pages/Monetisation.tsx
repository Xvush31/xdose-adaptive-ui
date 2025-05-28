import React from 'react';
import { DollarSign, TrendingUp, Users, Eye, CreditCard, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const Monetisation = () => {
  const stats = [
    {
      title: 'Revenus ce mois',
      amount: '€2,691',
      change: '+12%',
      icon: DollarSign,
      color: 'green',
    },
    { title: 'Abonnements actifs', amount: '1,234', change: '+8%', icon: Users, color: 'blue' },
    { title: 'Vues premium', amount: '45.2K', change: '+15%', icon: Eye, color: 'purple' },
    { title: 'Dons reçus', amount: '€567', change: '+23%', icon: Gift, color: 'pink' },
  ];

  const revenueStreams = [
    { name: 'Abonnements Premium', amount: '€1,234', percentage: 46 },
    { name: 'Contenu payant', amount: '€890', percentage: 33 },
    { name: 'Dons', amount: '€567', percentage: 21 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <DollarSign className="h-8 w-8 mr-3 text-purple-500" />
              Monétisation
            </h1>
            <p className="text-gray-600 mt-2">Gérez vos revenus et optimisez vos gains</p>
          </div>
          <Link
            to="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
          >
            Retour
          </Link>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 text-${stat.color}-500`} />
                  <span
                    className={`text-sm font-medium text-${stat.color}-500 bg-${stat.color}-100 px-2 py-1 rounded-full`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{stat.title}</h3>
                <div className={`text-2xl font-bold text-${stat.color}-500`}>{stat.amount}</div>
              </div>
            );
          })}
        </div>

        {/* Sources de revenus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Sources de revenus</h3>
            <div className="space-y-4">
              {revenueStreams.map((stream, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">{stream.name}</span>
                      <span className="text-gray-900 font-semibold">{stream.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stream.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Actions rapides</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3" />
                  <span>Configurer les paiements</span>
                </div>
                <span>→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3" />
                  <span>Gérer les abonnements</span>
                </div>
                <span>→</span>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  <span>Optimiser les revenus</span>
                </div>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monetisation;
