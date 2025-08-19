import React, { useState, useEffect, useRef } from 'react';
import type { CapillaryRefillTimeResult } from '../../types';
import { HandThumbUpIcon } from '../icons';

interface CRTScreenProps {
  onSubmit: (result: CapillaryRefillTimeResult | null) => void;
  onSkip: () => void;
}

const CRTScreen: React.FC<CRTScreenProps> = ({ onSubmit, onSkip }) => {
  const [status, setStatus] = useState<'idle' | 'pressing' | 'finished'>('idle');
  const [pressTimer, setPressTimer] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const testResults: CapillaryRefillTimeResult[] = [
    'Moins de 2 secondes (Normal)',
    'Entre 2 et 3 secondes (À surveiller)',
    'Plus de 3 secondes (Lent)',
  ];

  useEffect(() => {
    if (status === 'pressing' && pressTimer > 0) {
      intervalRef.current = setInterval(() => setPressTimer(prev => prev - 1), 1000);
    } else if (status === 'pressing' && pressTimer === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStatus('finished');
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, pressTimer]);

  const handleStart = () => {
    setStatus('pressing');
  };
  
  const handleSelectResult = (result: CapillaryRefillTimeResult) => {
    onSubmit(result);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <HandThumbUpIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Test de Recoloration Cutanée</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Cet examen simple permet d'évaluer votre circulation. Avec votre pouce, appuyez fermement sur l'ongle de votre autre pouce. Un minuteur de 5 secondes va démarrer.
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 text-center">
        {status === 'idle' && (
          <button onClick={handleStart} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200 text-lg">
            Démarrer la pression (5 secondes)
          </button>
        )}
        
        {status === 'pressing' && (
            <div className="animate-in fade-in duration-500">
                <p className="text-lg text-slate-300">Appuyez sur votre ongle et maintenez...</p>
                <p className="text-8xl font-bold text-sky-400 my-4">{pressTimer}</p>
            </div>
        )}
        
        {status === 'finished' && (
             <div className="w-full animate-in fade-in duration-500">
                <h2 className="text-2xl font-semibold text-green-400 mb-4">Relâchez !</h2>
                <p className="text-slate-300 mb-4">Comptez combien de temps la couleur normale met à revenir et sélectionnez le résultat :</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {testResults.map(result => (
                        <button key={result} onClick={() => handleSelectResult(result)} className="p-4 bg-slate-700 rounded-lg text-center hover:bg-sky-600 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
                           {result}
                        </button>
                    ))}
                </div>
             </div>
        )}
      </div>

       <div className="w-full max-w-3xl mt-8">
        <button
          onClick={onSkip}
          className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition duration-200"
          disabled={status === 'pressing'}
        >
          Passer cette étape
        </button>
      </div>
    </div>
  );
};

export default CRTScreen;