import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Creator {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  followers?: number;
}

interface Video {
  id: number;
  title: string;
  thumbnailUrl?: string;
  fileUrl: string;
  status: string;
}

const PRIMARY_GRADIENT = "bg-gradient-to-br from-purple-900 via-neutral-950 to-black";
const CARD_BG = "bg-neutral-900 border border-neutral-800";
const ACCENT = "text-purple-500";
const BUTTON_GRADIENT = "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700";
const BUTTON_DISABLED = "bg-neutral-700 text-neutral-400";
const TEXT_MAIN = "text-neutral-100";
const TEXT_SECONDARY = "text-neutral-400";
const SHADOW = "shadow-xl";

const CreatorProfile: React.FC = () => {
  const { id } = useParams();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    // Fetch creator info and videos in parallel
    Promise.all([
      fetch(`/api/users?id=${id}`).then(r => r.ok ? r.json() : Promise.reject('Utilisateur non trouvé')),
      fetch(`/api/content?type=video&creator=${id}&status=ready`).then(r => r.ok ? r.json() : [])
    ])
      .then(([user, vids]) => {
        setCreator({
          id: user.id,
          name: user.name || user.email || `@createur_${user.id}`,
          avatar: user.avatar || '/placeholder.svg',
          bio: user.bio || '',
          followers: user.followers || 0,
        });
        setVideos(Array.isArray(vids) ? vids : []);
      })
      .catch((e) => setError(typeof e === 'string' ? e : 'Erreur lors du chargement'))
      .finally(() => setLoading(false));

    // Get current user id for edit/follow logic
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id || null);
      setIsOwnProfile(user?.id === id);
    });
  }, [id]);

  // Fetch follow status (mock, replace with real API if needed)
  useEffect(() => {
    if (!currentUserId || !id || currentUserId === id) return;
    fetch(`/api/follow?followerId=${currentUserId}&followedId=${id}`)
      .then(r => r.ok ? r.json() : { followed: false })
      .then(data => setFollowed(!!data.followed));
  }, [currentUserId, id]);

  const handleEdit = () => {
    setEditName(creator?.name || '');
    setEditBio(creator?.bio || '');
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName, bio: editBio }),
      });
      if (res.ok) {
        setCreator((c) => c ? { ...c, name: editName, bio: editBio } : c);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUserId || !id || currentUserId === id) return;
    setFollowLoading(true);
    await fetch(`/api/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId: currentUserId, followedId: id, action: followed ? 'unfollow' : 'follow' }),
    });
    setFollowed((f) => !f);
    setFollowLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-400">Chargement…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!creator) return <div className="min-h-screen flex items-center justify-center text-neutral-400">Créateur introuvable</div>;

  return (
    <div className={`min-h-screen w-full ${PRIMARY_GRADIENT} ${TEXT_MAIN} flex flex-col items-center py-12`}>
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Sidebar */}
        <aside className={`w-full md:w-1/3 flex flex-col items-center ${CARD_BG} rounded-2xl p-8 ${SHADOW}`}>
          <div className="w-32 h-32 rounded-full bg-neutral-800 mb-4 border-4 border-purple-700 overflow-hidden">
            <img src={creator.avatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {editing ? (
            <>
              <input
                className="mb-2 w-full rounded-lg px-3 py-2 bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-purple-600"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                disabled={saving}
              />
              <textarea
                className="mb-2 w-full rounded-lg px-3 py-2 bg-neutral-800 text-neutral-100 border border-neutral-700 focus:ring-2 focus:ring-purple-600"
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                rows={3}
                disabled={saving}
              />
              <div className="flex gap-2 w-full">
                <button className={`${BUTTON_GRADIENT} text-white font-semibold py-2 px-4 rounded-full flex-1`} onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
                <button className={`${BUTTON_DISABLED} font-semibold py-2 px-4 rounded-full flex-1`} onClick={() => setEditing(false)} disabled={saving}>Annuler</button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">{creator.name}</h1>
              <p className={`${TEXT_SECONDARY} mb-4 text-center`}>{creator.bio || 'Ce créateur n’a pas encore renseigné sa bio.'}</p>
              {isOwnProfile ? (
                <button className={`${BUTTON_GRADIENT} text-white font-semibold py-2 px-6 rounded-full transition mb-2 w-full`} onClick={handleEdit}>Éditer le profil</button>
              ) : (
                <button className={`${followed ? BUTTON_DISABLED : BUTTON_GRADIENT} text-white font-semibold py-2 px-6 rounded-full transition mb-2 w-full`} onClick={handleFollow} disabled={followLoading}>
                  {followLoading ? (followed ? 'Désabonnement…' : 'Abonnement…') : (followed ? 'Abonné' : 'S’abonner')}
                </button>
              )}
              <span className={`${TEXT_SECONDARY} text-sm`}>{creator.followers ?? 0} abonnés</span>
            </>
          )}
        </aside>
        {/* Content Gallery */}
        <main className="flex-1 w-full flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Galerie de contenus</h2>
            {/* TODO: Filtres, catégories, etc. */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {videos.length === 0 ? (
              <div className="col-span-full text-neutral-500 text-center py-8">Aucune vidéo publique pour ce créateur.</div>
            ) : (
              videos.map((video) => (
                <a
                  key={video.id}
                  href={video.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-video bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center group hover:ring-2 hover:ring-purple-600 transition"
                >
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} className="object-cover w-full h-full group-hover:scale-105 transition" />
                  ) : (
                    <div className="text-neutral-500">Miniature indisponible</div>
                  )}
                </a>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatorProfile;
