import React, { useState } from 'react';
import { ChartBarIcon } from '../icons';

interface SymptomJournalSetupScreenProps {
  suggestedSymptoms: string[];
  onSubmit: (symptomsToTrack: string[]) => void;
  onBackToReport: () => void;
}

const SymptomJournalSetupScreen: React.FC<SymptomJournalSetupScreenProps> = ({ suggestedSymptoms, onSubmit, onBackToReport }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(suggestedSymptoms);
  const [customSymptom, setCustomSymptom] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length > 0) {
      onSubmit(selectedSymptoms);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-purple-500/10 p-4 rounded-full mb-6 border border-purple-500/30">
        <ChartBarIcon className="h-10 w-10 text-purple-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Configurer le Suivi Quotidien</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Sélectionnez les symptômes à inclure dans votre tableau de bord quotidien. Nous avons pré-sélectionné ceux que vous avez signalés.
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700">
        <h2 className="text-xl font-semibold text-slate-200 mb-5">Symptômes suggérés :</h2>
        <div className="flex flex-wrap gap-3">
          {suggestedSymptoms.map(symptom => {
            const isSelected = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-sky-600 border-sky-500 text-white'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
              >
                {isSelected && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                {symptom}
              </button>
            );
          })}
        </div>

        <div className="mt-6 border-t border-slate-700 pt-6">
          <label htmlFor="custom-symptom" className="text-slate-300 font-medium">Ajouter un autre symptôme à suivre :</label>
          <div className="flex gap-2 mt-2">
            <input
              id="custom-symptom"
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Ex: Maux de tête..."
              className="w-full p-2 rounded-md bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200"
            />
            <button
              type="button"
              onClick={handleAddCustomSymptom}
              className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition duration-200"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-3xl mt-8 flex flex-col md:flex-row gap-4">
        <button
          onClick={onBackToReport}
          className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition duration-200"
        >
          Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedSymptoms.length === 0}
          className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-500 transition duration-200 flex items-center justify-center gap-2 disabled:bg-slate-700 disabled:text-slate-400"
        >
          Ouvrir mon Hub de Santé
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
// FIX: Add default export to resolve module import error.
export default SymptomJournalSetupScreen;