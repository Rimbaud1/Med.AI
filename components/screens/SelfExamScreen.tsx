
import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '../icons';

interface SelfExamScreenProps {
  prompt: string;
  onSubmit: (result: string) => void;
  onSkip: () => void;
}

const SelfExamScreen: React.FC<SelfExamScreenProps> = ({ prompt, onSubmit, onSkip }) => {
  const [result, setResult] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(result.trim());
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <MagnifyingGlassIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Auto-Examen Guidé</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        L'IA vous propose un geste simple pour recueillir plus d'informations. Suivez attentivement les instructions.
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700">
        <div className="text-center my-4">
          <p className="text-slate-300 mb-3">Instruction :</p>
          <blockquote className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center" role="alert">
            <p className="text-sky-300 font-medium italic text-lg leading-relaxed">"{prompt}"</p>
          </blockquote>
        </div>

        <div className="w-full mt-6">
          <label htmlFor="exam-result" className="block text-slate-300 mb-2 font-semibold">Décrivez ce que vous observez ou ressentez :</label>
          <textarea
            id="exam-result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="Ex: La douleur est plus forte quand je relâche d'un coup..."
            className="w-full h-28 p-4 rounded-lg bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200 placeholder-slate-500"
          ></textarea>
        </div>
      </div>

      <div className="w-full max-w-3xl mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={onSkip}
          className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition duration-200"
        >
          Passer cette étape
        </button>
        <button
          onClick={handleSubmit}
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2"
        >
          Confirmer et Continuer
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SelfExamScreen;
