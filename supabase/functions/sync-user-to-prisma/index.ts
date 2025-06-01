
// Simple Edge Function without problematic type references
interface UserData {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function syncUserToPrisma(userData: UserData, retries = 3): Promise<boolean> {
  const backendUrl = 'https://your-backend-url.com'; // Update this with your actual backend URL
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[sync-user-to-prisma] Tentative ${attempt}/${retries} pour l'utilisateur ${userData.id}`);
      
      const response = await fetch(`${backendUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email,
          role: userData.role || 'spectateur'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`[sync-user-to-prisma] Utilisateur ${userData.id} synchronisé avec succès:`, result);
        return true;
      } else {
        const errorText = await response.text();
        console.error(`[sync-user-to-prisma] Erreur API ${response.status}: ${errorText}`);
        
        // Si c'est une erreur 400 (utilisateur déjà existant), on considère que c'est un succès
        if (response.status === 400 && errorText.includes('already exists')) {
          console.log(`[sync-user-to-prisma] Utilisateur ${userData.id} déjà existant dans Prisma`);
          return true;
        }
      }
    } catch (error) {
      console.error(`[sync-user-to-prisma] Erreur réseau tentative ${attempt}:`, error);
    }

    // Attendre avant retry (backoff exponentiel)
    if (attempt < retries) {
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`[sync-user-to-prisma] Attente ${delay}ms avant retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.error(`[sync-user-to-prisma] Échec de la synchronisation après ${retries} tentatives pour l'utilisateur ${userData.id}`);
  return false;
}

export default async function handler(req: Request) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, table, record, old_record } = await req.json();

    console.log(`[sync-user-to-prisma] Événement reçu:`, { type, table });

    // Vérifier que c'est bien un événement d'insertion d'utilisateur
    if (type !== 'INSERT' || table !== 'users') {
      console.log(`[sync-user-to-prisma] Événement ignoré: ${type} sur ${table}`);
      return new Response(
        JSON.stringify({ message: 'Événement ignoré' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (!record) {
      console.error('[sync-user-to-prisma] Aucun record fourni');
      return new Response(
        JSON.stringify({ error: 'Aucun record fourni' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Extraire les données utilisateur
    const userData: UserData = {
      id: record.id,
      email: record.email,
      name: record.raw_user_meta_data?.full_name || record.email,
      role: record.raw_user_meta_data?.role || 'spectateur'
    };

    console.log(`[sync-user-to-prisma] Synchronisation de l'utilisateur:`, userData);

    // Synchroniser vers Prisma
    const success = await syncUserToPrisma(userData);

    if (success) {
      return new Response(
        JSON.stringify({ 
          message: 'Utilisateur synchronisé avec succès',
          user_id: userData.id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          error: 'Échec de la synchronisation',
          user_id: userData.id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

  } catch (error) {
    console.error('[sync-user-to-prisma] Erreur globale:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne',
        details: (error as Error).message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}
