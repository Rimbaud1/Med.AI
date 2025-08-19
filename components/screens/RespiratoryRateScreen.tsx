import React, { useState, useEffect, useRef } from 'react';
import { LungIcon } from '../icons';

interface RespiratoryRateScreenProps {
  onSubmit: (count: number | null) => void;
}

const RespiratoryRateScreen: React.FC<RespiratoryRateScreenProps> = ({ onSubmit }) => {
  const [status, setStatus] = useState<'idle' | 'countdown' | 'running' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(30);
  const [breathCount, setBreathCount] = useState<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'countdown' && countdown > 0) {
      intervalRef.current = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (status === 'countdown' && countdown === 0) {
      clearInterval(intervalRef.current!);
      setStatus('running');
    }
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, countdown]);

  useEffect(() => {
    if (status === 'running' && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (status === 'running' && timer === 0) {
      clearInterval(intervalRef.current!);
      setStatus('finished');
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, timer]);

  const handleStart = () => {
    setStatus('countdown');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const count = parseInt(breathCount, 10);
    if (!isNaN(count)) {
      onSubmit(count);
    } else {
        // Allow submitting empty if user couldn't count or didn't input
        onSubmit(null);
    }
  };
  
  const handleSkip = () => {
      onSubmit(null);
  }

  const getTimerMessage = () => {
      if (timer > 20) return "Continuez à compter...";
      if (timer > 10) return `Plus que ${timer} secondes...`;
      if (timer > 0) return "Presque fini...";
      return "Terminé !";
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <LungIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Mesure de la Fréquence Respiratoire</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Nous allons calculer votre fréquence respiratoire. Veuillez placer une main sur votre poitrine et compter combien de fois elle se soulève pendant le minuteur.
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 text-center">
        {status === 'idle' && (
          <button onClick={handleStart} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200 text-lg">
            Démarrer le test (30 secondes)
          </button>
        )}
        
        {status === 'countdown' && (
            <div className="animate-in fade-in duration-500">
                <p className="text-lg text-slate-300">Préparez-vous...</p>
                <p className="text-8xl font-bold text-sky-400 my-4">{countdown}</p>
            </div>
        )}

        {status === 'running' && (
            <div className="animate-in fade-in duration-500">
                <p className="text-lg text-slate-300">{getTimerMessage()}</p>
                <p className="text-8xl font-bold text-sky-400 my-4">{timer}</p>
                <div className="w-full bg-slate-700 rounded-full h-4 mt-4">
                    <div className="bg-sky-500 h-4 rounded-full" style={{ width: `${(30 - timer) / 30 * 100}%`, transition: 'width 1s linear' }}></div>
                </div>
            </div>
        )}
        
        {status === 'finished' && (
             <form onSubmit={handleSubmit} className="w-full animate-in fade-in duration-500">
                <h2 className="text-2xl font-semibold text-green-400 mb-4">Test Terminé !</h2>
                <label htmlFor="breath-count" className="block text-slate-300 mb-2 font-semibold">Combien de respirations avez-vous comptées ?</label>
                <input
                    id="breath-count"
                    type="number"
                    value={breathCount}
                    onChange={(e) => setBreathCount(e.target.value)}
                    placeholder="ex: 8"
                    className="w-full max-w-xs mx-auto p-3 text-center text-xl rounded-lg bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200 placeholder-slate-500"
                    autoFocus
                />
             </form>
        )}
      </div>

       <div className="w-full max-w-3xl mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={handleSkip}
          className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition duration-200"
          disabled={status === 'running' || status === 'countdown'}
        >
          Passer cette étape
        </button>
        <button
          onClick={() => handleSubmit()}
          disabled={status !== 'finished'}
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
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

export default RespiratoryRateScreen;