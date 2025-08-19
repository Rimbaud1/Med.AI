import React, { useState } from 'react';
import type { SymptomCharacteristics, SymptomTiming } from '../../types';
import { InformationCircleIcon } from '../icons';

interface SymptomCharacteristicsScreenProps {
  onSubmit: (characteristics: SymptomCharacteristics) => void;
  onSkip: () => void;
}

const SymptomCharacteristicsScreen: React.FC<SymptomCharacteristicsScreenProps> = ({ onSubmit, onSkip }) => {
  const [temp, setTemp] = useState<string>('');
  const [hasTakenTemp, setHasTakenTemp] = useState<boolean | null>(null);
  const [entourage, setEntourage] = useState<boolean | null>(null);
  const [timing, setTiming] = useState<SymptomTiming | null>(null);
  
  const timingOptions: SymptomTiming[] = ['Constant', 'Pire le matin', 'Pire la nuit', 'Intermittent'];

  const handleSubmit = () => {
    const characteristics: SymptomCharacteristics = {};
    if (hasTakenTemp === true && temp) {
      const parsedTemp = parseFloat(temp.replace(',', '.'));
      if (!isNaN(parsedTemp)) {
        characteristics.temperature = parsedTemp;
      }
    }
    if (entourage !== null) characteristics.entourageHasSymptoms = entourage;
    if (timing) characteristics.timing = timing;
    onSubmit(characteristics);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
        <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
            <InformationCircleIcon className="h-10 w-10 text-sky-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Caractéristiques des Symptômes</h1>
        <p className="mt-4 text-center text-slate-400 max-w-lg">
            Ces quelques détails (facultatifs) peuvent grandement aider à affiner le diagnostic.
        </p>

        <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-6">
            {/* Temperature */}
            <div className="p-4 rounded-lg border border-slate-700/80 bg-slate-800/50">
                <p className="font-semibold text-slate-200 mb-3">Avez-vous pris votre température ?</p>
                <div className="flex items-center gap-4 mb-3">
                    <button type="button" onClick={() => setHasTakenTemp(true)} className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${hasTakenTemp === true ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>Oui</button>
                    <button type="button" onClick={() => setHasTakenTemp(false)} className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${hasTakenTemp === false ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>Non</button>
                </div>
                {hasTakenTemp === true && (
                    <div className="mt-4 animate-in fade-in duration-300">
                        <label htmlFor="temperature" className="text-sm text-slate-400 mb-1 block">Température (°C) :</label>
                        <input id="temperature" type="number" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} placeholder="38.5" className="w-full md:w-1/3 p-2 rounded-md bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none"/>
                    </div>
                )}
            </div>

            {/* Entourage */}
            <div className="p-4 rounded-lg border border-slate-700/80 bg-slate-800/50">
                <p className="font-semibold text-slate-200 mb-3">Des personnes de votre entourage ont-elles des symptômes similaires ?</p>
                <div className="flex items-center gap-4 mb-3">
                    <button type="button" onClick={() => setEntourage(true)} className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${entourage === true ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>Oui</button>
                    <button type="button" onClick={() => setEntourage(false)} className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${entourage === false ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>Non</button>
                </div>
            </div>

            {/* Timing */}
            <div className="p-4 rounded-lg border border-slate-700/80 bg-slate-800/50">
                <p className="font-semibold text-slate-200 mb-3">Comment décririez-vous le rythme de vos symptômes ?</p>
                <div className="flex flex-wrap gap-3">
                    {timingOptions.map(option => (
                        <button key={option} type="button" onClick={() => setTiming(option)} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${timing === option ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>{option}</button>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-700">
                <button onClick={onSkip} className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition duration-200">Passer</button>
                <button onClick={handleSubmit} className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2">
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
export default SymptomCharacteristicsScreen;
