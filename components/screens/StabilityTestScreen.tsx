
import React, { useState, useEffect, useRef } from 'react';
import type { StabilityTestResult } from '../../types';
import { ScaleIcon } from '../icons';

interface StabilityTestScreenProps {
  onSubmit: (result: StabilityTestResult | null) => void;
  onSkip: () => void;
}

const StabilityTestScreen: React.FC<StabilityTestScreenProps> = ({ onSubmit, onSkip }) => {
  const [status, setStatus] = useState<'idle' | 'countdown' | 'running' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(15);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const testResults: StabilityTestResult[] = [
    'Parfaitement stable',
    'Légère oscillation, stable',
    'Instabilité notable (a dû bouger les pieds)',
    'Instabilité sévère (presque tombé ou a eu besoin d\'un support)',
  ];

  useEffect(() => {
    if (status === 'countdown' && countdown > 0) {
      intervalRef.current = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (status === 'countdown' && countdown === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStatus('running');
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, countdown]);

  useEffect(() => {
    if (status === 'running' && timer > 0) {
      intervalRef.current = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (status === 'running' && timer === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStatus('finished');
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, timer]);

  const handleStart = () => setStatus('countdown');
  const handleSelectResult = (result: StabilityTestResult) => onSubmit(result);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <ScaleIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Test de Stabilité</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        L'IA suggère un test d'équilibre. Veuillez vous tenir debout, les pieds joints, et essayez de rester stable pendant la durée du test.
      </p>
       <p className="mt-2 text-center text-red-400 text-sm font-semibold">Assurez-vous d'avoir un support à proximité au cas où vous perdriez l'équilibre.</p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 text-center">
        {status === 'idle' && (
          <button onClick={handleStart} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200 text-lg">
            Démarrer le test (15 secondes)
          </button>
        )}
        
        {status === 'countdown' && (
            <div className="animate-in fade-in duration-500">
                <p className="text-lg text-slate-300">Tenez-vous prêt...</p>
                <p className="text-8xl font-bold text-sky-400 my-4">{countdown}</p>
            </div>
        )}

        {status === 'running' && (
            <div className="animate-in fade-in duration-500">
                <p className="text-lg text-slate-300">Restez stable...</p>
                <p className="text-8xl font-bold text-sky-400 my-4">{timer}</p>
                <div className="w-full bg-slate-700 rounded-full h-4 mt-4">
                    <div className="bg-sky-500 h-4 rounded-full" style={{ width: `${(15 - timer) / 15 * 100}%`, transition: 'width 1s linear' }}></div>
                </div>
            </div>
        )}
        
        {status === 'finished' && (
             <div className="w-full animate-in fade-in duration-500">
                <h2 className="text-2xl font-semibold text-green-400 mb-4">Test Terminé !</h2>
                <p className="text-slate-300 mb-4">Comment décririez-vous votre stabilité pendant le test ?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testResults.map(result => (
                        <button key={result} onClick={() => handleSelectResult(result)} className="p-4 bg-slate-700 rounded-lg text-left hover:bg-sky-600 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
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
          disabled={status === 'running' || status === 'countdown'}
        >
          Passer cette étape
        </button>
      </div>
    </div>
  );
};

export default StabilityTestScreen;