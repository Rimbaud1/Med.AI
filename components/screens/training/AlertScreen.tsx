


import React, { useState, useEffect } from 'react';
import type { TrainingScenario } from '../../../types';
import { generateTrainingScenarios } from '../../../services/geminiService';
import { SpeakerWaveIcon, SparklesIcon, ArrowPathIcon, PhoneIcon, CheckCircleIcon } from '../../icons';
import Loader from '../../Loader';

interface AlertScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 'intro' | 'numbers' | 'message' | 'rules' | 'scenarioLoading' | 'scenarioActive' | 'debrief';

const NumberCard: React.FC<{ num: string; service: string; description: string; }> = ({ num, service, description }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
        <div className="flex-shrink-0 text-sky-300 bg-slate-700 p-2 rounded-md">
            <p className="text-2xl font-bold w-12 text-center">{num}</p>
        </div>
        <div>
            <h4 className="font-bold text-slate-100">{service}</h4>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
    </div>
);


const AlertScreen: React.FC<AlertScreenProps> = ({ onComplete, onBack }) => {
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
                const generatedScenarios = await generateTrainingScenarios('alert');
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
    }, [onBack]);
    
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
            onComplete();
        }
    }

    const renderContent = () => {
        const currentScenario = scenarios[currentScenarioIndex];
        
        switch (step) {
            case 'intro':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Chapitre 1 : 3 Chiffres qui Changent Tout</h2>
                        <div className="mt-6 text-center text-lg text-slate-300 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                           <p className="font-bold text-2xl text-sky-300 italic">"Une alerte rapide et précise est le premier maillon de la chaîne des secours."</p>
                           <p className="mt-4">Après avoir sécurisé la zone, votre deuxième mission est de contacter les secours. Un appel efficace peut faire gagner de précieuses minutes et guider les secours exactement là où il faut.</p>
                        </div>
                        <button onClick={() => setStep('numbers')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Continuer</button>
                    </>
                );
            case 'numbers':
                 return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Chapitre 2 : Qui Appeler ?</h2>
                        <div className="mt-6 text-slate-300 space-y-4">
                           <NumberCard num="15" service="SAMU (Service d'Aide Médicale Urgente)" description="Le réflexe pour tout problème de santé urgent : malaise, douleur thoracique, blessure grave, intoxication..." />
                           <NumberCard num="18" service="Sapeurs-Pompiers" description="Pour les situations de péril : incendie, accident de la route, fuite de gaz, inondation, mais aussi en renfort pour le secours à personne." />
                           <NumberCard num="112" service="Numéro d'Urgence Européen" description="Le numéro universel. Si vous ne savez pas qui appeler ou si vous êtes à l'étranger en Europe, il vous redirigera vers le bon service." />
                           <NumberCard num="114" service="Urgence pour Personnes Sourdes/Malentendantes" description="Le numéro d'urgence accessible par SMS ou fax pour les personnes ayant des difficultés à entendre ou à parler." />
                        </div>
                        <button onClick={() => setStep('message')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Continuer</button>
                    </>
                );
            case 'message':
                 return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Chapitre 3 : Le Message Parfait</h2>
                        <p className="mt-2 text-center text-slate-400">Structurez votre message pour être immédiatement efficace. Le plus important d'abord !</p>
                         <div className="mt-6 space-y-4 text-slate-300">
                            <div className="p-4 rounded-lg border-2 border-sky-500 bg-slate-800/50">
                                <h3 className="text-xl font-bold text-sky-300">1. OÙ ? (La Localisation)</h3>
                                <p><strong>L'information la plus importante.</strong> Donnez l'adresse la plus précise possible (ville, rue, numéro, étage, code...). Si la communication coupe, les secours sauront au moins où aller.</p>
                            </div>
                            <div className="p-4 rounded-lg border border-slate-600 bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-100">2. QUOI ? (La Nature du problème)</h3>
                                <p>Ex: "C'est un accident de la route", "Une personne s'est effondrée", "Un enfant s'étouffe"...</p>
                            </div>
                             <div className="p-4 rounded-lg border border-slate-600 bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-100">3. COMBIEN & COMMENT ? (Les Victimes)</h3>
                                <p>Le nombre de victimes et leur état : "Il y a une victime. Elle est inconsciente mais elle respire."</p>
                            </div>
                             <div className="p-4 rounded-lg border border-slate-600 bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-100">4. QUELS RISQUES ?</h3>
                                <p>S'il y a un danger qui persiste : "La circulation est dense", "Il y a une odeur de gaz"...</p>
                            </div>
                        </div>
                        <button onClick={() => setStep('rules')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Les Règles d'Or de l'Appel</button>
                    </>
                );
            case 'rules':
                 return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Les Règles d'Or de l'Appel</h2>
                         <div className="mt-6 p-6 rounded-lg border-2 border-yellow-500/50 bg-yellow-500/10 text-center">
                             <PhoneIcon className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-yellow-300">NE RACCROCHEZ JAMAIS LE PREMIER</h3>
                            <p className="mt-2 text-yellow-200">Attendez toujours que l'opérateur vous dise que vous pouvez raccrocher. Il peut avoir des questions supplémentaires ou des instructions vitales à vous donner pour les gestes à effectuer en attendant les secours.</p>
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
                           <div className="flex justify-center mb-4"><CheckCircleIcon className="h-12 w-12 text-green-400" /></div>
                           <p className="font-bold text-2xl text-green-300">Scénario terminé !</p>
                           <p className="mt-4">{currentScenario?.debrief || "Vous avez compris la logique de l'alerte."}</p>
                        </div>
                        {currentScenarioIndex < scenarios.length - 1 ? (
                            <button onClick={nextScenario} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Scénario Suivant ({currentScenarioIndex + 2}/{scenarios.length})</button>
                        ) : (
                            <button onClick={onComplete} className="w-full mt-8 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors">Terminer la section "Alerter"</button>
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
                        <SpeakerWaveIcon className="h-8 w-8 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-100">Alerter</h1>
                        <p className="text-slate-400">La deuxième étape pour sauver une vie.</p>
                    </div>
                </div>
                <button onClick={onBack} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Retour</button>
            </div>
            {renderContent()}
        </div>
    );
};

export default AlertScreen;