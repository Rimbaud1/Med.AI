
import React, { useState } from 'react';
import { StethoscopeIcon } from '../icons';

interface InitialScreenProps {
  onStart: (symptoms: string) => void;
}

const InitialScreen: React.FC<InitialScreenProps> = ({ onStart }) => {
  const [symptoms, setSymptoms] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onStart(symptoms.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <StethoscopeIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Bienvenue sur Med.AI</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Décrivez vos symptômes ci-dessous pour commencer votre diagnostic préliminaire. Notre IA vous guidera à travers une série de questions pour mieux comprendre votre situation.
      </p>
      <form onSubmit={handleSubmit} className="w-full mt-8">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Ex: J'ai mal à la gorge, de la fièvre depuis 2 jours et je tousse beaucoup..."
          className="w-full h-36 p-4 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200 placeholder-slate-500"
          required
        ></textarea>
        <button
          type="submit"
          disabled={!symptoms.trim()}
          className="w-full mt-4 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
        >
          Commencer le Diagnostic
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default InitialScreen;
