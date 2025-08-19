import React, { useState } from 'react';
import type { SymptomIntensity } from '../../types';
import { ChartBarIcon } from '../icons';

interface SymptomIntensityScreenProps {
  symptoms: string[];
  onSubmit: (intensities: SymptomIntensity[], discomfort: string | null, mainSymptom: string) => void;
  onSkip: () => void;
}

type DiscomfortLevel = 'Léger' | 'Modéré' | 'Sévère';

const SymptomIntensityScreen: React.FC<SymptomIntensityScreenProps> = ({ symptoms, onSubmit, onSkip }) => {
  const [intensities, setIntensities] = useState<Record<string, number>>({});
  const [discomfort, setDiscomfort] = useState<DiscomfortLevel | null>(null);
  const [mainSymptom, setMainSymptom] = useState<string>('');

  const handleSliderChange = (symptom: string, value: string) => {
    setIntensities(prev => ({ ...prev, [symptom]: parseInt(value, 10) }));
  };

  const handleSubmit = () => {
    if (!mainSymptom) {
      alert("Veuillez sélectionner le symptôme principal pour continuer.");
      return;
    }
    const formattedIntensities: SymptomIntensity[] = Object.entries(intensities)
      .map(([name, score]) => ({ name, score }));
    onSubmit(formattedIntensities, discomfort, mainSymptom);
  };

  const discomfortOptions: { level: DiscomfortLevel; description: string }[] = [
    { level: 'Léger', description: 'Supportable, ne gêne pas les activités quotidiennes.' },
    { level: 'Modéré', description: 'Gênant, perturbe certaines activités.' },
    { level: 'Sévère', description: 'Invalidant, empêche la plupart des activités.' },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <ChartBarIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Intensité des Symptômes</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Pour continuer, veuillez au minimum sélectionner le symptôme qui vous préoccupe le plus. L'évaluation de l'intensité est facultative mais recommandée.
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-8">
        
        {/* Main Symptom Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-200">Quel est votre symptôme principal ? <span className="text-red-400">*</span></h2>
          <p className="text-slate-400 text-sm">Sélectionnez le symptôme qui vous préoccupe le plus. Ceci est obligatoire pour continuer.</p>
          <div className="flex flex-wrap gap-3">
            {symptoms.map(symptom => (
              <button
                key={symptom}
                type="button"
                onClick={() => setMainSymptom(symptom)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    mainSymptom === symptom
                    ? 'bg-sky-600 border-sky-500 text-white ring-2 ring-sky-500/50'
                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Symptom Sliders */}
        <div className="space-y-6 border-t border-slate-700 pt-6">
          <h2 className="text-xl font-semibold text-slate-200">Évaluez vos symptômes (facultatif)</h2>
          {symptoms.map(symptom => (
            <div key={symptom}>
              <label htmlFor={`slider-${symptom}`} className="block text-slate-300 mb-2 flex justify-between items-center">
                <span>{symptom}</span>
                <span className="font-bold text-sky-400 text-lg">{intensities[symptom] || '-'}</span>
              </label>
              <input
                id={`slider-${symptom}`}
                type="range"
                min="1"
                max="10"
                value={intensities[symptom] || ''}
                onChange={(e) => handleSliderChange(symptom, e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          ))}
        </div>

        {/* Overall Discomfort */}
        <div className="border-t border-slate-700 pt-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">À quel point vos symptômes sont-ils gênants ? (facultatif)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {discomfortOptions.map(({level, description}) => (
              <button
                key={level}
                type="button"
                onClick={() => setDiscomfort(level)}
                className={`p-4 rounded-lg border text-left transition-colors ${discomfort === level ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              >
                <p className="font-bold">{level}</p>
                <p className="text-sm mt-1">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-700">
            <button
              onClick={onSkip}
              className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition duration-200"
            >
              Passer cette étape
            </button>
            <button
              onClick={handleSubmit}
              disabled={!mainSymptom}
              className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
            >
              Continuer
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomIntensityScreen;