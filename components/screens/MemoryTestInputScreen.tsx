
import React, { useState, useRef, useEffect } from 'react';
import { BrainIcon } from '../icons';

interface MemoryTestInputScreenProps {
  onSubmit: (response: string[]) => void;
}

const MemoryTestInputScreen: React.FC<MemoryTestInputScreenProps> = ({ onSubmit }) => {
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [word3, setWord3] = useState('');
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit([word1.trim(), word2.trim(), word3.trim()]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' && index < 2) {
      e.preventDefault();
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <BrainIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Test de Mémoire</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Veuillez entrer les 3 mots que vous avez mémorisés tout à l'heure. Ne vous inquiétez pas si vous ne vous en souvenez pas de tous.
      </p>

      <form onSubmit={handleSubmit} className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="word1" className="block text-sm font-medium text-slate-400 mb-1">Mot 1</label>
            <input
              id="word1"
              ref={inputRefs[0]}
              type="text"
              value={word1}
              onChange={e => setWord1(e.target.value)}
              onKeyDown={e => handleKeyDown(e, 0)}
              className="w-full p-3 text-center rounded-lg bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200 text-lg"
            />
          </div>
          <div>
            <label htmlFor="word2" className="block text-sm font-medium text-slate-400 mb-1">Mot 2</label>
            <input
              id="word2"
              ref={inputRefs[1]}
              type="text"
              value={word2}
              onChange={e => setWord2(e.target.value)}
              onKeyDown={e => handleKeyDown(e, 1)}
              className="w-full p-3 text-center rounded-lg bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200 text-lg"
            />
          </div>
          <div>
            <label htmlFor="word3" className="block text-sm font-medium text-slate-400 mb-1">Mot 3</label>
            <input
              id="word3"
              ref={inputRefs[2]}
              type="text"
              value={word3}
              onChange={e => setWord3(e.target.value)}
              onKeyDown={e => handleKeyDown(e, 2)}
              className="w-full p-3 text-center rounded-lg bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200 text-lg"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700">
          <button
            type="submit"
            className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2"
          >
            Confirmer et Continuer
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemoryTestInputScreen;
