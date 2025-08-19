import React, { useState, useCallback } from 'react';
import { CameraIcon } from '../icons';

interface PhotoUploadScreenProps {
  onComplete: (imageBase64: string | null) => void;
  photoPrompt: string | null;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove the data:image/jpeg;base64, part
    };
    reader.onerror = (error) => reject(error);
  });
};

const PhotoUploadScreen: React.FC<PhotoUploadScreenProps> = ({ onComplete, photoPrompt }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        setError("L'image est trop volumineuse (max 4MB).");
        return;
      }
      setError(null);
      setImagePreview(URL.createObjectURL(file));
      try {
        const b64 = await fileToBase64(file);
        setImageBase64(b64);
      } catch (err) {
        setError("Erreur lors de la lecture de l'image.");
        console.error(err);
      }
    }
  }, []);

  const handleSubmit = () => {
    onComplete(imageBase64);
  };
  
  const handleSkip = () => {
    onComplete(null);
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 md:p-8">
      <div className="bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 w-full text-center">
        <CameraIcon className="h-12 w-12 mx-auto text-sky-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-100">Ajouter une photo (Optionnel)</h2>
        
        {photoPrompt ? (
          <div className="text-center my-6">
            <p className="text-slate-300 mb-3">Pour mieux évaluer votre situation, l'IA suggère de prendre une photo :</p>
            <blockquote className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center" role="alert">
              <p className="text-sky-300 font-medium italic">"{photoPrompt}"</p>
            </blockquote>
          </div>
        ) : (
          <p className="text-slate-400 mt-2 mb-6">Si vos symptômes sont visibles (éruption cutanée, irritation, etc.), une photo peut aider l'IA à fournir un diagnostic plus précis.</p>
        )}

        <div className="w-full h-52 bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center relative overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="Aperçu" className="h-full w-full object-cover" />
          ) : (
            <p className="text-slate-500">Aperçu de l'image</p>
          )}
        </div>
        
        {error && <p className="text-red-400 mt-2">{error}</p>}
        
        <label htmlFor="photo-upload" className="cursor-pointer mt-6 inline-block bg-slate-700 text-slate-200 font-semibold py-2 px-6 rounded-lg hover:bg-slate-600 transition duration-200">
          Choisir un fichier
        </label>
        <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button 
            onClick={handleSkip}
            className="w-full py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-500 transition duration-200"
          >
            Ignorer
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!imageBase64}
            className="w-full py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-200"
          >
            Soumettre et Analyser
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadScreen;