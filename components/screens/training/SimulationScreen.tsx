
import React, { useState } from 'react';
import type { SimulationScenario, SimulationChoice } from '../../../types';
import { ShieldCheckIcon, SpeakerWaveIcon, HeartIcon, SparklesIcon, ArrowPathIcon, CheckCircleIcon } from '../../icons';

interface SimulationScreenProps {
  scenario: SimulationScenario;
  onBack: () => void;
}

type StageKey = 'protect' | 'alert' | 'rescue';

const stageIcons: Record<StageKey, React.ReactNode> = {
    protect: <ShieldCheckIcon className="h-6 w-6 text-sky-400" />,
    alert: <SpeakerWaveIcon className="h-6 w-6 text-sky-400" />,
    rescue: <HeartIcon className="h-6 w-6 text-sky-400" />,
};

const stageTitles: Record<StageKey, string> = {
    protect: 'Protéger',
    alert: 'Alerter',
    rescue: 'Secourir',
};

const stageOrder: StageKey[] = ['protect', 'alert', 'rescue'];

const SimulationScreen: React.FC<SimulationScreenProps> = ({ scenario, onBack }) => {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
    const [isStageIntro, setIsStageIntro] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    const currentStageKey = stageOrder[currentStageIndex];
    const currentStage = scenario.stages[currentStageKey];
    const currentQuestion = currentStage.questions[currentQuestionIndex];

    const handleAnswer = (choice: SimulationChoice) => {
        setFeedback({ text: choice.feedback, isCorrect: choice.isCorrect });
    };

    const handleNext = () => {
        setFeedback(null);
        // Move to next question in the stage
        if (currentQuestionIndex < currentStage.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Move to next stage
            if (currentStageIndex < stageOrder.length - 1) {
                setCurrentStageIndex(prev => prev + 1);
                setCurrentQuestionIndex(0);
                setIsStageIntro(true);
            } else {
                // Finish simulation
                setIsFinished(true);
            }
        }
    };

    const ProgressBar = () => (
        <div className="flex items-center gap-2 md:gap-4 my-6">
            {stageOrder.map((stage, index) => {
                const isActive = index === currentStageIndex;
                const isCompleted = index < currentStageIndex;
                return (
                    <React.Fragment key={stage}>
                        <div className="flex flex-col items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-sky-500/20 border-sky-500' : isCompleted ? 'bg-green-500/20 border-green-500' : 'bg-slate-700 border-slate-600'}`}>
                                {isCompleted ? <CheckCircleIcon className="h-6 w-6 text-green-400" /> : stageIcons[stage]}
                            </div>
                            <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-sky-300' : isCompleted ? 'text-green-300' : 'text-slate-400'}`}>{stageTitles[stage]}</p>
                        </div>
                        {index < stageOrder.length - 1 && <div className={`flex-grow h-1 rounded-full transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}`}></div>}
                    </React.Fragment>
                );
            })}
        </div>
    );

    if (isFinished) {
        return (
            <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col">
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <CheckCircleIcon className="h-20 w-20 text-green-400 mb-4" />
                    <h2 className="text-3xl font-bold text-slate-100">Simulation Terminée !</h2>
                    <div className="mt-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                        <h3 className="text-xl font-semibold text-sky-300 mb-2">Débriefing Final</h3>
                        <p className="text-slate-300">{scenario.finalDebrief}</p>
                    </div>
                </div>
                <button onClick={onBack} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Retour au menu Formation</button>
            </div>
        );
    }
    
    if (isStageIntro) {
         return (
            <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex flex-col">
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                     <div className={`h-20 w-20 rounded-full flex items-center justify-center border-4 mb-4 bg-sky-500/20 border-sky-500`}>
                        {stageIcons[currentStageKey]}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-100">Étape : {stageTitles[currentStageKey]}</h2>
                    <p className="mt-4 text-lg text-slate-300 bg-slate-800/50 p-6 rounded-lg border border-slate-700">{currentStage.introText}</p>
                </div>
                <button onClick={() => setIsStageIntro(false)} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Commencer cette étape</button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col">
            <h1 className="text-2xl font-bold text-center text-slate-100">{scenario.title}</h1>
            <ProgressBar />
            <div className="flex-grow bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <div className="p-4 mb-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-center text-slate-300 italic">"{scenario.description}"</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-200">{currentQuestion.question}</h3>
                    <div className="space-y-3 mt-4">
                        {currentQuestion.choices.map((choice, i) => (
                            <button key={i} onClick={() => handleAnswer(choice)} disabled={!!feedback} className="w-full p-4 bg-slate-700 rounded-lg text-left hover:bg-sky-600 transition-colors disabled:cursor-not-allowed">
                                {choice.text}
                            </button>
                        ))}
                    </div>
                </div>
                 {feedback && (
                    <div className={`mt-6 p-4 rounded-lg border ${feedback.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} animate-in fade-in`}>
                        <p className={`font-bold ${feedback.isCorrect ? 'text-green-300' : 'text-red-300'}`}>{feedback.isCorrect ? "Bonne réponse !" : "Ce n'est pas la meilleure action."}</p>
                        <p className="mt-1 text-slate-300">{feedback.text}</p>
                        {feedback.isCorrect ? (
                            <button onClick={handleNext} className="w-full mt-4 bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">Continuer</button>
                        ) : (
                            <button onClick={() => setFeedback(null)} className="w-full mt-4 bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors flex items-center justify-center gap-2">
                                <ArrowPathIcon className="h-5 w-5" /> Réessayer
                            </button>
                        )}
                    </div>
                 )}
            </div>
             <button onClick={onBack} className="w-full mt-8 bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition-colors">Quitter la simulation</button>
        </div>
    );
};

export default SimulationScreen;
