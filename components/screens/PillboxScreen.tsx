
import React from 'react';
import type { Medication } from '../../types';
import { PillIcon, CalendarDaysIcon, ClockIcon, SparklesIcon, InformationCircleIcon } from '../icons';

interface PillboxScreenProps {
  pillboxData: Medication[];
  onNavigateToAdd: () => void;
  onNavigateToDetail: (medicationId: string) => void;
  onBackToLanding: () => void;
}

const PillboxScreen: React.FC<PillboxScreenProps> = ({ pillboxData, onNavigateToAdd, onNavigateToDetail, onBackToLanding }) => {

  const getRemainingDays = (med: Medication): string => {
    if (med.durationDays === null) return 'Traitement au long cours';
    const startDate = new Date(med.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + med.durationDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today > endDate) return 'Terminé';

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jour(s) restant(s)`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-4 rounded-full border border-amber-500/30">
            <PillIcon className="h-10 w-10 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Pilulier Intelligent</h1>
            <p className="mt-1 text-slate-400">Gérez vos traitements et suivez les effets secondaires.</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={onBackToLanding} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Accueil</button>
            <button onClick={onNavigateToAdd} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                + Ajouter un traitement
            </button>
        </div>
      </div>

      {pillboxData.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
          <PillIcon className="h-16 w-16 mx-auto text-slate-500 mb-4" />
          <h2 className="text-xl font-semibold text-slate-300">Votre pilulier est vide</h2>
          <p className="text-slate-400 mt-2">Cliquez sur "Ajouter un traitement" pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pillboxData.map(med => (
            <div key={med.id} className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-sky-300">{med.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-2 flex-wrap">
                        <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {med.frequency}</span>
                        <span className="flex items-center gap-1.5"><CalendarDaysIcon className="h-4 w-4" /> {getRemainingDays(med)}</span>
                    </div>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                    <button 
                        onClick={() => onNavigateToDetail(med.id)}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <SparklesIcon className="h-5 w-5 text-amber-400" />
                        Détails & Effets Secondaires
                    </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PillboxScreen;
