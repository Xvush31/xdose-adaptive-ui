import React, { useState } from 'react';
import { Upload as UploadIcon, FileVideo, Image, File, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type) => {
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('image/')) return Image;
    return File;
  };

  // Ajout handler upload Supabase Storage
  const handleUpload = async () => {
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || user.user_metadata.role !== 'createur') {
        setUploadError('Seuls les créateurs peuvent uploader.');
        setUploading(false);
        return;
      }
      const userId = user.id;
      for (const file of files) {
        const filePath = `${userId}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('videos').upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (error) throw error;
      }
      setUploadSuccess('Fichiers uploadés avec succès !');
      setFiles([]);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <UploadIcon className="h-8 w-8 mr-3 text-purple-500" />
              Upload
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
          >
            <UploadIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Glissez-déposez vos fichiers ici
            </h3>
            <p className="text-gray-600 mb-6">Formats supportés: MP4, MOV, AVI, JPG, PNG, GIF</p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200">
              Choisir des fichiers
            </button>
          </div>

          {/* Liste des fichiers */}
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Fichiers sélectionnés ({files.length})</h3>
              <div className="space-y-3">
                {files.map((file, index) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-4 shadow-md flex items-center justify-between"
                    >
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
                  );
                })}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                  onClick={handleUpload}
                  disabled={uploading || files.length === 0}
                >
                  {uploading
                    ? 'Publication...'
                    : `Publier (${files.length} fichier${files.length > 1 ? 's' : ''})`}
                </button>
              </div>
              {uploadError && <div className="text-red-600 text-center mt-4">{uploadError}</div>}
              {uploadSuccess && (
                <div className="text-green-600 text-center mt-4">{uploadSuccess}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
