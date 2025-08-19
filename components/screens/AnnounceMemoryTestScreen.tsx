
import React from 'react';
import { BrainIcon } from '../icons';

interface AnnounceMemoryTestScreenProps {
  words: string[];
  onContinue: () => void;
}

const AnnounceMemoryTestScreen: React.FC<AnnounceMemoryTestScreenProps> = ({ words, onContinue }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <BrainIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Test de Mémoire</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Pour évaluer votre concentration, nous allons effectuer un test de mémoire simple. Essayez de retenir les 3 mots suivants. Ils vous seront demandés plus tard.
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 flex justify-center items-center gap-4 md:gap-8 flex-wrap">
        {words.map((word, index) => (
            <div key={index} className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-md">
                <p className="text-2xl md:text-3xl font-bold text-sky-300 text-center">{word}</p>
            </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-2xl mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2"
      >
        J'ai mémorisé, continuer
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default AnnounceMemoryTestScreen;
