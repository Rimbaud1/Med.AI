


import React, { useState, useEffect } from 'react';
import type { TrainingScenario } from '../../../types';
import { generateTrainingScenarios } from '../../../services/geminiService';
import { AcademicCapIcon, ShieldCheckIcon, BoltIcon, FireIcon, TruckIcon, BuildingStorefrontIcon, SkullIcon, UserGroupIcon, SparklesIcon, ArrowPathIcon } from '../../icons';
import Loader from '../../Loader';

interface ProtectScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 'intro' | 'dangers' | 'actions' | 'emergencyMove' | 'scenarioLoading' | 'scenarioActive' | 'debrief';

const DangerCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <div className="flex-shrink-0 text-red-400">{icon}</div>
        <div>
            <h4 className="font-bold text-slate-100">{title}</h4>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    </div>
);

const ProtectScreen: React.FC<ProtectScreenProps> = ({ onComplete, onBack }) => {
    const [step, setStep] = useState<Step>('intro');
    const [scenarios, setScenarios] = useState<TrainingScenario[]>([]);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
    const [scenarioCompleted, setScenarioCompleted] = useState(false);

    useEffect(() => {
        const loadScenarios = async () => {
            setStep('scenarioLoading');
            try {
                const generatedScenarios = await generateTrainingScenarios('protect');
                if (generatedScenarios && generatedScenarios.length > 0) {
                    setScenarios(generatedScenarios);
                    setStep('intro'); // Go to intro after loading
                } else {
                    throw new Error("No scenarios were generated.");
                }
            } catch (error) {
                console.error("Failed to load scenarios", error);
                onBack(); // Go back if scenarios fail to load
            }
        };
        loadScenarios();
    }, []);


    const dangers = [
        { icon: <BoltIcon className="h-6 w-6" />, title: "Danger Électrique", description: "Câbles tombés, appareil endommagé, eau à proximité." },
        { icon: <FireIcon className="h-6 w-6" />, title: "Danger d'Incendie / Explosion", description: "Fumée, odeur de brûlé, fuite de carburant, produits inflammables." },
        { icon: <TruckIcon className="h-6 w-6" />, title: "Danger lié à la Circulation", description: "Voitures, camions, vélos. Le sur-accident est un risque majeur." },
        { icon: <BuildingStorefrontIcon className="h-6 w-6" />, title: "Danger de Chute d'Objets", description: "Dans un bâtiment endommagé, sur un chantier." },
        { icon: <SkullIcon className="h-6 w-6" />, title: "Danger Toxique / d'Intoxication", description: "Odeur de gaz, produits chimiques renversés, environnement non ventilé." },
        { icon: <UserGroupIcon className="h-6 w-6" />, title: "Danger Humain", description: "Agresseur encore présent, foule paniquée." },
    ];
    
    const startScenario = () => {
        setStep('scenarioActive');
        setFeedback(null);
        setCurrentQuestionIndex(0);
        setScenarioCompleted(false);
    };

    const handleAnswer = (isCorrect: boolean, feedbackText: string) => {
        setFeedback({ text: feedbackText, isCorrect });
        const currentScenario = scenarios[currentScenarioIndex];
        if (isCorrect && currentScenario && currentQuestionIndex === currentScenario.questions.length - 1) {
            setScenarioCompleted(true);
        }
    };
    
    const nextQuestion = () => {
        const currentScenario = scenarios[currentScenarioIndex];
        if(currentScenario && currentQuestionIndex < currentScenario.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setFeedback(null);
        }
    };

    const nextScenario = () => {
        if (currentScenarioIndex < scenarios.length - 1) {
            setCurrentScenarioIndex(prev => prev + 1);
            startScenario();
        } else {
            // All scenarios completed
            onComplete();
        }
    }

    const renderContent = () => {
        const currentScenario = scenarios[currentScenarioIndex];
        
        switch (step) {
            case 'intro':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Chapitre 1 : La Règle d'Or</h2>
                        <div className="mt-6 text-center text-lg text-slate-300 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                           <p className="font-bold text-2xl text-sky-300 italic">"Un héros mort ne sauve personne."</p>
                           <p className="mt-4">Votre première mission est de ne pas devenir une victime vous-même. Avant de vous précipiter sur une victime, prenez toujours quelques secondes pour analyser la situation.</p>
                        </div>
                        <button onClick={() => setStep('dangers')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Continuer</button>
                    </>
                );
            case 'dangers':
                 return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Chapitre 2 : Identifier les Dangers</h2>
                        <div className="mt-6 text-center text-lg text-slate-300">
                           <p>Apprenez à "lire" une scène d'accident pour repérer tout ce qui pourrait être dangereux pour vous, la victime ou les témoins.</p>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                               {dangers.map(d => <DangerCard key={d.title} {...d} />)}
                           </div>
                        </div>
                        <button onClick={() => setStep('actions')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Continuer</button>
                    </>
                );
            case 'actions':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Chapitre 3 : Les 3 Actions Possibles</h2>
                         <div className="mt-6 space-y-4 text-slate-300">
                            <div className="p-4 rounded-lg border border-slate-600 bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-100">1. Supprimer le danger</h3>
                                <p><strong>Si, et seulement si, c'est possible SANS vous mettre en danger.</strong></p>
                                <p className="text-sm text-slate-400">Ex: Couper le courant au disjoncteur, éteindre le moteur d'une voiture.</p>
                            </div>
                            <div className="p-4 rounded-lg border border-slate-600 bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-100">2. Isoler le danger et baliser la zone</h3>
                                <p><strong>Créez un périmètre de sécurité.</strong></p>
                                <p className="text-sm text-slate-400">Ex: Mettre un gilet de haute visibilité, placer un triangle de signalisation, éloigner les curieux.</p>
                            </div>
                             <div className="p-4 rounded-lg border border-slate-600 bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-100">3. Soustraire la victime au danger</h3>
                                <p><strong>Le Dégagement d'Urgence. C'est l'action la plus exceptionnelle.</strong></p>
                                <p className="text-sm text-slate-400">Ne déplacez une victime QUE si le danger est vital, immédiat et ne peut être ni supprimé ni isolé.</p>
                            </div>
                        </div>
                        <button onClick={() => setStep('emergencyMove')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Focus sur le Dégagement d'Urgence</button>
                    </>
                );
            case 'emergencyMove':
                 return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Le Dégagement d'Urgence</h2>
                         <div className="mt-6 p-6 rounded-lg border-2 border-red-500/50 bg-red-500/10 text-center">
                            <h3 className="text-2xl font-bold text-red-300">ATTENTION</h3>
                            <p className="mt-2 text-red-200">On ne déplace JAMAIS une victime, SAUF si elle est exposée à un danger vital, immédiat, qu'on ne peut ni supprimer, ni isoler.</p>
                             <p className="font-semibold mt-4">Quand le faire ?</p>
                             <ul className="list-disc list-inside text-left mt-2">
                                <li>Véhicule qui commence à brûler.</li>
                                <li>Risque d'effondrement imminent.</li>
                                <li>Pièce qui se remplit de fumée toxique.</li>
                             </ul>
                        </div>
                        <button onClick={startScenario} className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
                            <SparklesIcon className="h-6 w-6" /> Mettre en pratique (Scénario 1/{scenarios.length})
                        </button>
                    </>
                );
            case 'scenarioLoading':
                return <Loader text="Chargement des scénarios..." isComplete={false} />;
            case 'scenarioActive':
                if (!currentScenario) return <Loader text="Chargement..." isComplete={false} />;
                const currentQuestion = currentScenario.questions[currentQuestionIndex];
                return (
                    <div className="w-full">
                         <h2 className="text-2xl font-bold text-center text-slate-100">Scénario Interactif {currentScenarioIndex + 1}/{scenarios.length}</h2>
                         <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                            <p className="text-center text-slate-300 italic">"{currentScenario.description}"</p>
                         </div>
                         <div className="mt-6">
                            <h3 className="text-lg font-semibold text-slate-200">{currentQuestion.question}</h3>
                            <div className="space-y-3 mt-4">
                                {currentQuestion.choices.map((choice, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleAnswer(choice.isCorrect, choice.feedback)}
                                        disabled={!!feedback}
                                        className="w-full p-4 bg-slate-700 rounded-lg text-left hover:bg-sky-600 transition-colors disabled:cursor-not-allowed"
                                    >
                                        {choice.text}
                                    </button>
                                ))}
                            </div>
                         </div>
                         {feedback && (
                             <div className={`mt-6 p-4 rounded-lg border ${feedback.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} animate-in fade-in`}>
                                <p className={`font-bold ${feedback.isCorrect ? 'text-green-300' : 'text-red-300'}`}>{feedback.isCorrect ? "Correct !" : "Incorrect."}</p>
                                <p className="mt-1 text-slate-300">{feedback.text}</p>
                                {scenarioCompleted ? (
                                    <button onClick={() => setStep('debrief')} className="w-full mt-4 bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">Voir le débriefing</button>
                                ) : feedback.isCorrect ? (
                                    <button onClick={nextQuestion} className="w-full mt-4 bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">Question suivante</button>
                                ) : (
                                    <button onClick={() => setFeedback(null)} className="w-full mt-4 bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors flex items-center justify-center gap-2">
                                        <ArrowPathIcon className="h-5 w-5" /> Réessayer
                                    </button>
                                )}
                             </div>
                         )}
                    </div>
                );
             case 'debrief':
                return (
                     <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Débriefing du scénario {currentScenarioIndex + 1}</h2>
                        <div className="mt-6 text-center text-lg text-slate-300 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                           <p className="font-bold text-2xl text-green-300">Scénario terminé !</p>
                           <p className="mt-4">{currentScenario?.debrief || "Vous avez compris la logique de la protection."}</p>
                        </div>
                        {currentScenarioIndex < scenarios.length - 1 ? (
                            <button onClick={nextScenario} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Scénario Suivant ({currentScenarioIndex + 2}/{scenarios.length})</button>
                        ) : (
                            <button onClick={onComplete} className="w-full mt-8 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors">Terminer la section "Protéger"</button>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-sky-500/10 p-3 rounded-full border border-sky-500/30">
                        <ShieldCheckIcon className="h-8 w-8 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-100">Protéger</h1>
                        <p className="text-slate-400">La première étape pour sauver une vie.</p>
                    </div>
                </div>
                <button onClick={onBack} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Retour</button>
            </div>
            {renderContent()}
        </div>
    );
};

export default ProtectScreen;