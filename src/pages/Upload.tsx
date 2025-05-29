import React, { useState, useEffect, useRef } from 'react';
import { Upload as UploadIcon, FileVideo, Image, FileText, X, Save } from 'lucide-react'; // Changed File to FileText
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthGuard from '@/components/AuthGuard';

const ACCEPTED_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo', // avi
  // 'image/jpeg', // Images are not videos, removing for Mux video upload
  // 'image/png',
  // 'image/gif',
];

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

interface AppFile extends File { // Renamed VideoFile to AppFile for clarity
  id: string;
  title?: string;
  description?: string;
  visibility?: 'public' | 'private' | 'unlisted';
  uploadProgress?: number; // For progress bar
  uploadStatus?: 'pending' | 'uploading' | 'completed' | 'failed'; // For status text
  videoId?: string; // Store the db video ID
  muxUploadId?: string; // Store Mux Upload ID
}

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<AppFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [overallUploadError, setOverallUploadError] = useState<string | null>(null);
  const [overallUploadSuccess, setOverallUploadSuccess] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // No longer using fileUploadProgress state, progress will be part of AppFile interface

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // const { data: profile } = await supabase // Original had profiles, this project structure might differ
        //   .from('User') // Assuming 'User' table from schema
        //   .select('role')
        //   .eq('id', user.id) // Assuming user.id links to User.id (Int)
        //   .single();
        // For now, let's assume role is fetched or hardcoded if not in DB for this example
        // This part needs to align with your actual user profile/role storage in Supabase
        // For testing, let's default to 'createur' if a user exists
        setUserRole('createur'); // Defaulting for now, replace with actual role fetching
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

  const processSelectedFiles = (selectedFiles: FileList | null): AppFile[] => {
    if (!selectedFiles) return [];
    return Array.from(selectedFiles)
      .filter((file: File) => ACCEPTED_TYPES.includes(file.type))
      .map((file: File) => {
        let title = 'fichier_sans_nom';
        if (file && typeof file.name === 'string') {
          try {
            title = file.name.replace(/\.[^/.]+$/, '');
          } catch { /* fallback already provided */ }
        }
        return {
          ...file, // This spreads the File object; direct modification is not possible for properties like 'name'
          // To ensure we are working with a plain object that includes File properties:
          lastModified: file.lastModified,
          name: sanitizeFileName(file.name),
          size: file.size,
          type: file.type,
          webkitRelativePath: file.webkitRelativePath,
          // AppFile specific properties
          id: Math.random().toString(36).substr(2, 9) + Date.now(), // More unique ID
          title: sanitizeFileName(title),
          description: '',
          visibility: 'public' as const,
          uploadProgress: 0,
          uploadStatus: 'pending' as const,
        } as AppFile; // Type assertion
      });
  };


  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const newFiles = processSelectedFiles(e.dataTransfer.files);
    if (newFiles.length === 0 && e.dataTransfer.files.length > 0) {
      setOverallUploadError('Format de fichier non supporté. Seuls les MP4, MOV, AVI sont acceptés.');
    } else {
      setOverallUploadError(null);
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const updateFileMetadata = (id: string, field: keyof AppFile, value: string) => {
    setFiles((prev) => prev.map((file) =>
      file.id === id ? { ...file, [field]: value } : file
    ));
  };
  
  const getFileIcon = (type: string | undefined) => {
    if (!type) return FileText; // Default icon
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('image/')) return Image; // Kept for potential future use, though filtered now
    return FileText;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = processSelectedFiles(e.target.files);
    if (newFiles.length === 0 && e.target.files && e.target.files.length > 0) {
      setOverallUploadError('Format de fichier non supporté. Seuls les MP4, MOV, AVI sont acceptés.');
    } else {
      setOverallUploadError(null);
    }
    setFiles((prev) => [...prev, ...newFiles]);
    if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const handleUpload = async () => {
    if (userRole !== 'createur' && userRole !== 'admin') {
      setOverallUploadError('Seuls les créateurs peuvent uploader des vidéos.');
      return;
    }

    setUploading(true);
    setOverallUploadError(null);
    setOverallUploadSuccess(null);
    let filesSuccessfullyUploadedCount = 0;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setOverallUploadError('Vous devez être connecté pour uploader.');
      setUploading(false);
      return;
    }
    const userId = user.id;

    for (const file of files) {
      if (file.uploadStatus === 'completed') continue; // Skip already uploaded

      setFiles(prev => prev.map(f => f.id === file.id ? { ...f, uploadStatus: 'uploading', uploadProgress: 0 } : f));

      try {
        // 1. Get Mux Upload URL from our backend
        const apiResponse = await fetch('/api/mux-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.title || file.name.replace(/\.[^/.]+$/, '') || 'Default Title',
            description: file.description || '',
            userId: userId, // Ensure this aligns with your DB schema (Int vs UUID)
            visibility: file.visibility || 'public',
          }),
        });

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error(errorData.error || `Erreur serveur pour ${file.name}`);
        }
        const { uploadUrl, videoId: dbVideoId, uploadId: muxUploadIdReturned } = await apiResponse.json();
        
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, videoId: dbVideoId, muxUploadId: muxUploadIdReturned } : f));

        // 2. Upload File to Mux using XMLHttpRequest for progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadUrl, true);
          // Mux direct uploads usually don't need specific Content-Type for the pre-signed URL itself,
          // but the file's actual type is good practice if the presigned URL expects it.
          // However, for direct uploads, Mux often expects the raw file bytes.
          // xhr.setRequestHeader('Content-Type', file.type); // This might be needed by Mux, or might break it. Test this.

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setFiles(prev => prev.map(f => f.id === file.id ? { ...f, uploadProgress: percentComplete } : f));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setFiles(prev => prev.map(f => f.id === file.id ? { ...f, uploadStatus: 'completed', uploadProgress: 100 } : f));
              filesSuccessfullyUploadedCount++;
              resolve();
            } else {
              setFiles(prev => prev.map(f => f.id === file.id ? { ...f, uploadStatus: 'failed', uploadError: `Mux upload error: ${xhr.statusText}` } : f));
              reject(new Error(`Mux upload failed for ${file.name}: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => {
            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, uploadStatus: 'failed', uploadError: 'Network error during Mux upload' } : f));
            reject(new Error(`Network error during Mux upload for ${file.name}`));
          };
          
          // Create a new File object from the AppFile properties to send
          const fileToUpload = new File([file as unknown as BlobPart], file.name, { type: file.type });
          xhr.send(fileToUpload);
        });

      } catch (e: any) {
        console.error(`Upload failed for ${file.name}:`, e);
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, uploadStatus: 'failed', uploadError: e.message || 'Unknown error' } : f));
        // Continue to next file
      }
    } // End of loop

    setUploading(false);
    if (filesSuccessfullyUploadedCount === files.length && files.length > 0) {
      setOverallUploadSuccess(`${filesSuccessfullyUploadedCount} fichier(s) uploadé(s) avec succès et en cours de traitement.`);
      // Optionally clear files: setFiles([]); 
    } else if (filesSuccessfullyUploadedCount > 0) {
      setOverallUploadSuccess(`${filesSuccessfullyUploadedCount} fichier(s) uploadé(s). Certains uploads ont échoué.`);
    } else if (files.length > 0) {
      setOverallUploadError("Tous les uploads ont échoué. Veuillez vérifier les erreurs individuelles.");
    }
    // Keep files in list to show individual statuses, remove them manually or add a clear button.
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
              <p className="text-gray-600 mb-6">Formats supportés: MP4, MOV, AVI</p>
              <button
                type="button"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
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
                disabled={uploading}
              />
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Fichiers sélectionnés ({files.length})</h3>
                <div className="space-y-6">
                  {files.map((file) => {
                    const FileSpecificIcon = getFileIcon(file.type); // Renamed to avoid conflict
                    return (
                      <div
                        key={file.id}
                        className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center overflow-hidden mr-2">
                            <FileSpecificIcon className="h-8 w-8 text-purple-500 mr-3 flex-shrink-0" />
                            <div className="truncate">
                              <p className="font-medium text-gray-800 truncate" title={file.name}>{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          {!uploading && file.uploadStatus !== 'uploading' && file.uploadStatus !== 'completed' && (
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              aria-label="Supprimer le fichier"
                            >
                              <X className="h-5 w-5 text-gray-500" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`title-${file.id}`} className="block text-sm font-semibold text-gray-700 mb-2">
                              Titre
                            </label>
                            <input
                              id={`title-${file.id}`}
                              type="text"
                              value={file.title || ''}
                              onChange={(e) => updateFileMetadata(file.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="Titre de la vidéo"
                              disabled={uploading || file.uploadStatus === 'completed'}
                            />
                          </div>

                          <div>
                            <label htmlFor={`visibility-${file.id}`} className="block text-sm font-semibold text-gray-700 mb-2">
                              Visibilité
                            </label>
                            <select
                              id={`visibility-${file.id}`}
                              value={file.visibility || 'public'}
                              onChange={(e) => updateFileMetadata(file.id, 'visibility', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              disabled={uploading || file.uploadStatus === 'completed'}
                            >
                              <option value="public">Public</option>
                              <option value="private">Privé</option>
                              <option value="unlisted">Non répertorié</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label htmlFor={`description-${file.id}`} className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            id={`description-${file.id}`}
                            value={file.description || ''}
                            onChange={(e) => updateFileMetadata(file.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            rows={3}
                            placeholder="Description de la vidéo"
                            disabled={uploading || file.uploadStatus === 'completed'}
                          />
                        </div>
                        
                        {(file.uploadStatus === 'uploading' || file.uploadStatus === 'completed' || file.uploadStatus === 'failed') && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                              <div
                                className={`h-3 rounded-full ${
                                  file.uploadStatus === 'failed' ? 'bg-red-500' : 
                                  file.uploadStatus === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${file.uploadStatus === 'failed' ? 100 : file.uploadProgress || 0}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 text-right">
                              {file.uploadStatus === 'failed' ? (
                                <span className="text-red-500">Échec: { (file as any).uploadError || 'Erreur inconnue'}</span>
                              ) : file.uploadStatus === 'completed' ? (
                                <span className="text-green-500">Upload terminé, en traitement...</span>
                              ) : file.uploadStatus === 'uploading' ? (
                                `Upload en cours: ${file.uploadProgress || 0}%`
                              ) : (
                                ''
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-60 flex items-center"
                    onClick={handleUpload}
                    disabled={uploading || files.length === 0 || files.every(f => f.uploadStatus === 'completed' || f.uploadStatus === 'uploading')}
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {uploading
                      ? 'Publication en cours...'
                      : `Publier (${files.filter(f => f.uploadStatus === 'pending').length} fichier${files.filter(f => f.uploadStatus === 'pending').length !== 1 ? 's' : ''})`}
                  </button>
                </div>

                {overallUploadError && (
                  <div className="text-red-600 text-center mt-4 bg-red-50 p-3 rounded-lg" role="alert">
                    {overallUploadError}
                  </div>
                )}
                {overallUploadSuccess && (
                  <div className="text-green-600 text-center mt-4 bg-green-50 p-3 rounded-lg" role="alert">
                    {overallUploadSuccess}
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
