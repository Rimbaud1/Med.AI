

import React from 'react';
import { AcademicCapIcon, ShieldCheckIcon, SpeakerWaveIcon, HeartIcon, SparklesIcon, CheckCircleIcon, LockClosedIcon } from '../icons';
import type { TrainingProgress } from '../../types';

interface TrainingScreenProps {
  onBackToLanding: () => void;
  onNavigateToTrainingProtect: () => void;
  onNavigateToTrainingAlert: () => void;
  onNavigateToTrainingRescue: () => void;
  onNavigateToTrainingSimulation: () => void;
  trainingProgress: TrainingProgress;
}

type StepStatus = 'completed' | 'unlocked' | 'locked';

interface StepCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    status: StepStatus;
    onClick?: () => void;
    stepNumber: number;
}

const StepCard: React.FC<StepCardProps> = ({ title, subtitle, icon, status, onClick, stepNumber }) => {
    const isLocked = status === 'locked';
    const isCompleted = status === 'completed';

    const statusIcon = isLocked ? <LockClosedIcon className="h-6 w-6 text-slate-500" /> :
                       isCompleted ? <CheckCircleIcon className="h-6 w-6 text-green-400" /> :
                       <span className="h-6 w-6 flex items-center justify-center text-sm font-bold text-sky-300">{stepNumber}</span>;
    
    const baseClasses = "w-full flex items-center gap-5 p-5 bg-slate-800/70 rounded-xl border transition-all duration-300";
    const statusClasses = {
        locked: "border-slate-700/80 opacity-60 cursor-not-allowed",
        unlocked: "border-slate-700 hover:border-sky-500 hover:bg-slate-800 cursor-pointer",
        completed: "border-green-500/60 bg-green-500/5 cursor-pointer hover:border-green-400"
    };

    return (
        <div 
            onClick={!isLocked ? onClick : undefined}
            className={`${baseClasses} ${statusClasses[status]}`}
            role="button"
            aria-disabled={isLocked}
            tabIndex={isLocked ? -1 : 0}
        >
            <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-green-500/10 border-green-500/50' : isLocked ? 'bg-slate-700 border-slate-600' : 'bg-sky-500/10 border-sky-500/50'}`}>
                {statusIcon}
            </div>
            <div className="flex-grow">
                <h3 className={`text-xl font-bold ${isCompleted ? 'text-green-300' : isLocked ? 'text-slate-500' : 'text-slate-100'}`}>{title}</h3>
                <p className={`text-sm ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>{subtitle}</p>
            </div>
             <div className="flex-shrink-0">
                {icon}
            </div>
        </div>
    );
};


const TrainingScreen: React.FC<TrainingScreenProps> = ({ onBackToLanding, onNavigateToTrainingProtect, onNavigateToTrainingAlert, onNavigateToTrainingRescue, onNavigateToTrainingSimulation, trainingProgress }) => {
    
    const protectStatus: StepStatus = trainingProgress.protect ? 'completed' : 'unlocked';
    const alertStatus: StepStatus = trainingProgress.protect ? (trainingProgress.alert ? 'completed' : 'unlocked') : 'locked';
    const rescueStatus: StepStatus = trainingProgress.alert ? (trainingProgress.rescue ? 'completed' : 'unlocked') : 'locked';
    const simulationUnlocked = protectStatus === 'completed' && alertStatus === 'completed' && rescueStatus === 'completed';

    const Connector = ({ completed }: { completed: boolean }) => (
        <div className={`h-8 w-1 rounded-full transition-colors duration-500 ${completed ? 'bg-green-500' : 'bg-slate-700'}`}></div>
    );

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
            <div className="flex flex-col items-center text-center gap-4 mb-12">
                <div className="bg-sky-500/10 p-4 rounded-full border border-sky-500/30">
                    <AcademicCapIcon className="h-12 w-12 text-sky-400" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Formation aux Premiers Secours</h1>
                    <p className="mt-2 text-lg text-slate-400">Apprenez les gestes essentiels qui peuvent sauver une vie.</p>
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
                <StepCard 
                    title="1. Protéger" 
                    subtitle="Analyser la scène et assurer la sécurité." 
                    icon={<ShieldCheckIcon className="h-8 w-8 text-sky-400" />} 
                    status={protectStatus}
                    onClick={onNavigateToTrainingProtect}
                    stepNumber={1}
                />
                <Connector completed={trainingProgress.protect} />
                <StepCard 
                    title="2. Alerter" 
                    subtitle="Contacter les secours efficacement." 
                    icon={<SpeakerWaveIcon className="h-8 w-8 text-sky-400" />} 
                    status={alertStatus}
                    onClick={alertStatus === 'unlocked' ? onNavigateToTrainingAlert : undefined}
                    stepNumber={2}
                />
                <Connector completed={trainingProgress.alert} />
                <StepCard 
                    title="3. Secourir" 
                    subtitle="Effectuer les gestes d'urgence." 
                    icon={<HeartIcon className="h-8 w-8 text-sky-400" />} 
                    status={rescueStatus}
                    onClick={rescueStatus === 'unlocked' ? onNavigateToTrainingRescue : undefined}
                    stepNumber={3}
                />
            </div>

            <div className="mt-10 text-center">
                 <button 
                    onClick={simulationUnlocked ? onNavigateToTrainingSimulation : undefined}
                    disabled={!simulationUnlocked}
                    className={`bg-slate-800 p-6 rounded-xl border transition-all duration-300 inline-block group ${simulationUnlocked ? 'cursor-pointer border-indigo-500 hover:bg-indigo-900/40' : 'border-slate-700 opacity-60 cursor-not-allowed'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 p-3 rounded-full border transition-colors duration-300 ${simulationUnlocked ? 'bg-indigo-500/10 border-indigo-500/30 group-hover:bg-indigo-500/20' : 'bg-slate-700 border-slate-600'}`}>
                           {simulationUnlocked ? <SparklesIcon className="h-8 w-8 text-indigo-400" /> : <LockClosedIcon className="h-8 w-8 text-slate-500" />}
                        </div>
                        <div>
                            <h2 className={`text-2xl font-bold ${simulationUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>Épreuve Finale : Simulation</h2>
                            <p className={`text-sm ${simulationUnlocked ? 'text-slate-400' : 'text-slate-600'}`}>
                                {simulationUnlocked ? "Testez vos connaissances en conditions réelles." : "Terminez les 3 modules pour débloquer."}
                            </p>
                        </div>
                    </div>
                 </button>
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
