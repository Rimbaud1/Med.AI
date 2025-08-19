

import React from 'react';
import { AcademicCapIcon, ShieldCheckIcon, SpeakerWaveIcon, HeartIcon, SparklesIcon, CheckCircleIcon } from '../icons';
import type { TrainingProgress } from '../../types';

interface TrainingScreenProps {
  onBackToLanding: () => void;
  onNavigateToTrainingProtect: () => void;
  onNavigateToTrainingAlert: () => void;
  trainingProgress: TrainingProgress;
}

const Bubble: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; onClick?: () => void; completed: boolean; }> = ({ title, subtitle, icon, onClick, completed }) => (
    <div 
        onClick={onClick}
        className={`relative flex flex-col items-center text-center p-6 bg-slate-800/70 rounded-2xl border ${completed ? 'border-green-500/80' : 'border-slate-700'} flex-1 min-w-[280px] hover:border-sky-500/80 hover:-translate-y-1 transition-all duration-300 ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
        {completed && (
            <div className="absolute -top-3 -right-3 bg-slate-800 rounded-full">
                 <CheckCircleIcon className="h-8 w-8 text-green-400" />
            </div>
        )}
        <div className="bg-sky-500/10 p-4 rounded-full mb-4 border border-sky-500/30">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-100">{title}</h3>
        <p className="text-slate-400 mt-1">{subtitle}</p>
    </div>
);

const TrainingScreen: React.FC<TrainingScreenProps> = ({ onBackToLanding, onNavigateToTrainingProtect, onNavigateToTrainingAlert, trainingProgress }) => {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col items-center text-center gap-4 mb-12">
                <div className="bg-sky-500/10 p-4 rounded-full border border-sky-500/30">
                    <AcademicCapIcon className="h-12 w-12 text-sky-400" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Formation aux Premiers Secours</h1>
                    <p className="mt-2 text-lg text-slate-400">Apprenez les gestes essentiels qui peuvent sauver une vie.</p>
                </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-12">
                <Bubble title="Protéger" subtitle="La scène de l'accident" icon={<ShieldCheckIcon className="h-10 w-10 text-sky-400" />} onClick={onNavigateToTrainingProtect} completed={trainingProgress.protect} />
                <Bubble title="Alerter" subtitle="Le message d'alerte parfait" icon={<SpeakerWaveIcon className="h-10 w-10 text-sky-400" />} onClick={onNavigateToTrainingAlert} completed={trainingProgress.alert} />
                <Bubble title="Secourir" subtitle="Étouffement, Hémorragie, etc." icon={<HeartIcon className="h-10 w-10 text-sky-400" />} completed={trainingProgress.rescue} />
            </div>

            <div className="text-center">
                 <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 transition-all duration-300 inline-block cursor-pointer group opacity-50">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-indigo-500/10 p-3 rounded-full border border-indigo-500/30 transition-colors duration-300 group-hover:bg-indigo-500/20">
                           <SparklesIcon className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">Faire une simulation</h2>
                            <p className="text-sm text-slate-400">(Bientôt disponible)</p>
                        </div>
                    </div>
                 </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-700 text-center">
                <button
                onClick={onBackToLanding}
                className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200"
                >
                Retour à l'accueil
                </button>
            </div>
        </div>
    );
};

export default TrainingScreen;