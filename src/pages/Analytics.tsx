
import React from 'react';
import { BarChart3, Users, Eye, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const metrics = [
    { title: "Vues totales", value: "847.2K", change: "+15.2%", trend: "up" },
    { title: "Nouveaux abonnés", value: "2.3K", change: "+8.7%", trend: "up" },
    { title: "Engagement", value: "12.8%", change: "-2.1%", trend: "down" },
    { title: "Temps de visionnage", value: "4m 32s", change: "+5.4%", trend: "up" }
  ];

  const topContent = [
    { title: "Tutorial React Advanced", views: "45.2K", engagement: "8.7%" },
    { title: "Design System Best Practices", views: "32.1K", engagement: "12.3%" },
    { title: "JavaScript Tips & Tricks", views: "28.9K", engagement: "9.8%" },
    { title: "CSS Grid Master Class", views: "22.4K", engagement: "15.2%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <BarChart3 className="h-8 w-8 mr-3 text-purple-500" />
              Analytics
            </h1>
            <p className="text-gray-600 mt-2">Analysez vos performances et optimisez votre contenu</p>
          </div>
          <Link 
            to="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
          >
            Retour
          </Link>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                <TrendingUp className={`h-4 w-4 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
              <div className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change} vs mois dernier
              </div>
            </div>
          ))}
        </div>

        {/* Graphique simulé */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Évolution des vues (30 derniers jours)</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>30 derniers jours</option>
                <option>7 derniers jours</option>
                <option>3 derniers mois</option>
              </select>
            </div>
          </div>
          
          {/* Graphique simple simulé avec des barres */}
          <div className="flex items-end justify-between h-64 space-x-2">
            {[65, 45, 78, 52, 89, 67, 45, 82, 56, 91, 73, 68, 85, 49, 77].map((height, index) => (
              <div key={index} className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Contenu le plus performant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Contenu le plus performant</h3>
            <div className="space-y-4">
              {topContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{content.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {content.views}
                      </span>
                      <span className="text-sm text-purple-600 font-medium">
                        {content.engagement} engagement
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Audience</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Répartition par âge</h4>
                <div className="space-y-2">
                  {[
                    { range: "18-24", percentage: 35 },
                    { range: "25-34", percentage: 45 },
                    { range: "35-44", percentage: 15 },
                    { range: "45+", percentage: 5 }
                  ].map((age, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{age.range} ans</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${age.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{age.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
