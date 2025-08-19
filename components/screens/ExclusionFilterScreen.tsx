import React, { useState } from 'react';
import { ShieldExclamationIcon } from '../icons';

interface ExclusionFilterScreenProps {
  symptoms: string[];
  onSubmit: (excluded: string[]) => void;
  onSkip: () => void;
}

const ExclusionFilterScreen: React.FC<ExclusionFilterScreenProps> = ({ symptoms, onSubmit, onSkip }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedSymptoms);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-red-500/10 p-4 rounded-full mb-6 border border-red-500/30">
        <ShieldExclamationIcon className="h-10 w-10 text-red-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Filtre d'Exclusion</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Pour affiner le diagnostic, veuillez sélectionner les symptômes ci-dessous que vous êtes certain de ne <strong>pas</strong> avoir.
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-200 mb-5">Cliquez sur les symptômes que vous n'avez pas :</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {symptoms.map(symptom => {
            const isSelected = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-red-600/80 border-red-500 text-white ring-2 ring-red-500/50'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500'
                }`}
              >
                {symptom}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-3xl mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={onSkip}
          className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition duration-200"
        >
          Passer / Aucun symptôme absent
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

export default ExclusionFilterScreen;
