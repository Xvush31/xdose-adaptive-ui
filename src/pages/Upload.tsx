import React, { useState, useEffect } from 'react';
import { Upload as UploadIcon, FileVideo, Image, File, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/AuthGuard';

const ACCEPTED_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo', // avi
  'image/jpeg',
  'image/png',
  'image/gif',
];

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

interface VideoFile extends File {
  id: string;
  title?: string;
  description?: string;
  visibility?: 'public' | 'private' | 'unlisted';
}

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<VideoFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setUserRole(profile?.role || 'spectateur');
      }
    };
    checkUserRole();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
        .filter((file: File) => ACCEPTED_TYPES.includes(file.type))
        .map((file: File) => ({
          ...file,
          id: Math.random().toString(36).substr(2, 9),
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          visibility: 'public' as const,
        }));
      
      if (newFiles.length === 0) {
        setUploadError('Format de fichier non supporté.');
        return;
      }
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileMetadata = (index: number, field: string, value: string) => {
    setFiles((prev) => prev.map((file, i) => 
      i === index ? { ...file, [field]: value } : file
    ));
  };

  const getFileIcon = (type: string | undefined) => {
    if (!type) return File;
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('image/')) return Image;
    return File;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files)
      .filter((file: File) => ACCEPTED_TYPES.includes(file.type))
      .map((file: File) => ({
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        visibility: 'public' as const,
      }));
    
    if (selectedFiles.length === 0) {
      setUploadError('Format de fichier non supporté.');
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleUpload = async () => {
    if (userRole !== 'createur' && userRole !== 'admin') {
      setUploadError('Seuls les créateurs peuvent uploader des vidéos.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUploadError('Vous devez être connecté pour uploader.');
        return;
      }

      const userId = user.id;
      const uploadedVideos = [];

      for (const file of files) {
        const safeName = sanitizeFileName(file.name);
        const filePath = `${userId}/${Date.now()}_${safeName}`;

        // Upload file to storage
        const { error: storageError } = await supabase.storage
          .from('videos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (storageError) throw storageError;

        // Save video metadata to database
        const { error: dbError } = await supabase
          .from('videos')
          .insert({
            user_id: userId,
            title: file.title || file.name,
            description: file.description || '',
            file_path: filePath,
            file_size: file.size,
            visibility: file.visibility || 'public',
            status: 'pending'
          });

        if (dbError) throw dbError;

        uploadedVideos.push(file.title || file.name);
      }

      setUploadSuccess(`${uploadedVideos.length} vidéo(s) uploadée(s) avec succès !`);
      setFiles([]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AuthGuard requireAuth={true} requiredRole="createur">
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <UploadIcon className="h-8 w-8 mr-3 text-purple-500" />
                Upload Vidéos
              </h1>
              <p className="text-gray-600 mt-2">Partagez votre contenu avec la communauté</p>
            </div>
            <Link
              to="/"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
            >
              Retour
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Zone de drop */}
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              tabIndex={0}
              role="button"
              aria-label="Zone de dépôt pour uploader des vidéos"
            >
              <UploadIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Glissez-déposez vos fichiers ici
              </h3>
              <p className="text-gray-600 mb-6">Formats supportés: MP4, MOV, AVI, JPG, PNG, GIF</p>
              <button
                type="button"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}
              >
                Choisir des fichiers
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                multiple
                className="hidden"
                onChange={handleFileChange}
                tabIndex={-1}
              />
            </div>

            {/* Liste des fichiers avec métadonnées */}
            {files.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Fichiers sélectionnés ({files.length})</h3>
                <div className="space-y-6">
                  {files.map((file, index) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <div
                        key={file.id}
                        className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <FileIcon className="h-8 w-8 text-purple-500 mr-3" />
                            <div>
                              <p className="font-medium text-gray-800">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X className="h-5 w-5 text-gray-500" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Titre
                            </label>
                            <input
                              type="text"
                              value={file.title || ''}
                              onChange={(e) => updateFileMetadata(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Titre de la vidéo"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Visibilité
                            </label>
                            <select
                              value={file.visibility || 'public'}
                              onChange={(e) => updateFileMetadata(index, 'visibility', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="public">Public</option>
                              <option value="private">Privé</option>
                              <option value="unlisted">Non répertorié</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={file.description || ''}
                            onChange={(e) => updateFileMetadata(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={3}
                            placeholder="Description de la vidéo"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-60 flex items-center"
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {uploading
                      ? 'Publication...'
                      : `Publier (${files.length} fichier${files.length > 1 ? 's' : ''})`}
                  </button>
                </div>

                {uploadError && (
                  <div className="text-red-600 text-center mt-4 bg-red-50 p-3 rounded-lg" role="alert">
                    {uploadError}
                  </div>
                )}
                {uploadSuccess && (
                  <div className="text-green-600 text-center mt-4 bg-green-50 p-3 rounded-lg" role="alert">
                    {uploadSuccess}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Upload;
