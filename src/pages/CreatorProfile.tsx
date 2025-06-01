import React from 'react';
import { useParams } from 'react-router-dom';

const CreatorProfile: React.FC = () => {
  const { id } = useParams();

  // TODO: Fetch creator data, videos, subscription status, etc.

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center py-12">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Sidebar */}
        <aside className="w-full md:w-1/3 flex flex-col items-center bg-neutral-900 rounded-xl p-6 shadow-lg">
          <div className="w-32 h-32 rounded-full bg-neutral-800 mb-4 border-4 border-neutral-700 overflow-hidden">
            {/* TODO: Profile picture */}
            <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold mb-2">@createur_{id}</h1>
          <p className="text-neutral-400 mb-4 text-center">Bio du créateur. Présentation, thématiques, etc.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-full transition mb-2 w-full">S’abonner</button>
          <span className="text-sm text-neutral-400">1234 abonnés</span>
        </aside>
        {/* Content Gallery */}
        <main className="flex-1 w-full flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Galerie de contenus</h2>
            {/* TODO: Filtres, catégories, etc. */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* TODO: Map vidéos du créateur */}
            <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/placeholder.svg" alt="Miniature" className="object-cover w-full h-full" />
            </div>
            <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/placeholder.svg" alt="Miniature" className="object-cover w-full h-full" />
            </div>
            <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="/placeholder.svg" alt="Miniature" className="object-cover w-full h-full" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorProfile;
