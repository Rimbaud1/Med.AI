
import React from 'react';
import { WarningIcon } from '../icons';

interface SymptomMonitoringScreenProps {
  instructions: string;
  onContinue: () => void;
}

const SymptomMonitoringScreen: React.FC<SymptomMonitoringScreenProps> = ({ instructions, onContinue }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-yellow-500/10 p-4 rounded-full mb-6 border border-yellow-500/30">
        <WarningIcon className="h-10 w-10 text-yellow-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">À surveiller dans les 48h suivantes</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Votre rapport est prêt. Avant de le consulter, veuillez lire attentivement les consignes de surveillance suivantes.
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700">
        <blockquote className="text-center" role="alert">
          <p className="text-slate-200 text-lg leading-relaxed">{instructions}</p>
        </blockquote>
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-2xl mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2"
      >
        J'ai lu, voir mon rapport
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default SymptomMonitoringScreen;
