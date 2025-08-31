
import React, { useState, useEffect } from 'react';
import type { TrainingScenario } from '../../../types';
import { generateTrainingScenarios } from '../../../services/geminiService';
import { HeartIcon, SparklesIcon, ArrowPathIcon, SpeakerWaveIcon, LungIcon, BoltIcon, HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, ShieldExclamationIcon, CheckCircleIcon } from '../../icons';
import Loader from '../../Loader';

interface RescueScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 'intro' | 'checkVictim' | 'unconsciousBreathing' | 'unconsciousNotBreathing' | 'choking' | 'bleeding' | 'scenarioLoading' | 'scenarioActive' | 'debrief';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; colorClass?: string }> = ({ icon, title, children, colorClass = "text-sky-300" }) => (
    <div className="p-4 rounded-lg border border-slate-600 bg-slate-800/50">
        <div className="flex items-center gap-3">
            {icon}
            <h3 className={`text-xl font-bold ${colorClass}`}>{title}</h3>
        </div>
        <div className="mt-3 text-slate-300 space-y-2 text-sm">{children}</div>
    </div>
);

const RescueScreen: React.FC<RescueScreenProps> = ({ onComplete, onBack }) => {
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
                const generatedScenarios = await generateTrainingScenarios('rescue');
                if (generatedScenarios && generatedScenarios.length > 0) {
                    setScenarios(generatedScenarios);
                    setStep('intro');
                } else {
                    throw new Error("No scenarios were generated.");
                }
            } catch (error) {
                console.error("Failed to load scenarios", error);
                onBack();
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
                        <h2 className="text-3xl font-bold text-center text-slate-100">Chapitre 1 : Les Gestes qui Sauvent</h2>
                        <div className="mt-6 text-center text-lg text-slate-300 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                           <p className="font-bold text-2xl text-sky-300 italic">"La zone est sécurisée, les secours sont en route. Il est temps d'agir."</p>
                           <p className="mt-4">Les gestes que vous allez apprendre peuvent maintenir une victime en vie en attendant l'arrivée des professionnels. Votre action est le maillon le plus important de la chaîne de survie.</p>
                        </div>
                        <button onClick={() => setStep('checkVictim')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Commencer</button>
                    </>
                );
            case 'checkVictim':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Chapitre 2 : Évaluer la Victime</h2>
                        <div className="mt-6 space-y-4">
                            <InfoCard icon={<ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-sky-400" />} title="1. Vérifier la Conscience">
                                <p>Approchez-vous de la victime, prenez-lui la main et demandez-lui à voix haute : <strong>"Serrez-moi la main", "Ouvrez les yeux"</strong>.</p>
                                <p>S'il n'y a pas de réaction, secouez-lui doucement les épaules. L'absence de réaction signifie que la victime est inconsciente.</p>
                            </InfoCard>
                            <InfoCard icon={<LungIcon className="h-6 w-6 text-sky-400" />} title="2. Vérifier la Respiration">
                                <p>Basculez prudemment sa tête en arrière pour libérer les voies aériennes.</p>
                                <p>Approchez votre joue de sa bouche et pendant <strong>10 secondes maximum</strong> :</p>
                                <ul className="list-disc list-inside pl-4">
                                    <li><strong>REGARDEZ</strong> si le ventre se soulève.</li>
                                    <li><strong>ÉCOUTEZ</strong> d'éventuels bruits de respiration.</li>
                                    <li><strong>SENTEZ</strong> un souffle sur votre joue.</li>
                                </ul>
                                <p className="font-semibold text-yellow-300 mt-2">Attention : Une respiration agonique (gasps, bruyante et irrégulière) n'est PAS une respiration normale.</p>
                            </InfoCard>
                        </div>
                         <button onClick={() => setStep('unconsciousBreathing')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Continuer</button>
                    </>
                );
            case 'unconsciousBreathing':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Cas 1 : Inconsciente mais Respire</h2>
                        <div className="mt-6 space-y-4">
                            <InfoCard icon={<ArrowPathIcon className="h-6 w-6 text-green-400" />} title="Position Latérale de Sécurité (PLS)" colorClass="text-green-300">
                                <p><strong>Objectif :</strong> Garder les voies aériennes libres pour que la victime continue de respirer et éviter qu'elle ne s'étouffe avec ses fluides (salive, vomissements).</p>
                                <p><strong>Comment faire (simplifié) :</strong></p>
                                <ol className="list-decimal list-inside pl-4 space-y-1">
                                    <li>Placez le bras de la victime le plus proche de vous à angle droit.</li>
                                    <li>Amenez l'autre bras sur sa poitrine, dos de la main contre sa joue.</li>
                                    <li>Attrapez la jambe opposée et pliez-la.</li>
                                    <li>Faites rouler la victime vers vous en un seul bloc.</li>
                                    <li>Ajustez sa jambe pour la stabiliser et ouvrez-lui la bouche.</li>
                                </ol>
                                <p className="font-semibold mt-2">Surveillez sa respiration jusqu'à l'arrivée des secours.</p>
                            </InfoCard>
                        </div>
                        <button onClick={() => setStep('unconsciousNotBreathing')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Cas suivant : Ne respire pas</button>
                    </>
                );
             case 'unconsciousNotBreathing':
                return (
                    <>
                        <h2 className="text-3xl font-bold text-center text-red-300">Cas 2 : Inconsciente et Ne Respire Pas</h2>
                        <div className="mt-6 space-y-4">
                            <InfoCard icon={<HeartIcon className="h-6 w-6 text-red-400" />} title="Arrêt Cardiaque : Massage Cardiaque (RCP)" colorClass="text-red-300">
                                <p><strong>Chaque seconde compte.</strong> L'objectif est de faire circuler le sang manuellement pour oxygéner le cerveau.</p>
                                <ol className="list-decimal list-inside pl-4 space-y-1">
                                    <li><strong>Alertez immédiatement le 15</strong> ou faites alerter.</li>
                                    <li>Agenouillez-vous à côté de la victime.</li>
                                    <li>Placez le talon d'une main au centre de sa poitrine, l'autre main par-dessus, doigts croisés.</li>
                                    <li>Bras tendus, comprimez la poitrine de 5-6 cm, à un rythme de <strong>100 à 120 compressions par minute</strong> (le rythme de la chanson "Stayin' Alive").</li>
                                    <li>Ne vous arrêtez que si les secours prennent le relais, si la victime reprend une respiration normale, ou si vous êtes épuisé.</li>
                                </ol>
                            </InfoCard>
                            <InfoCard icon={<BoltIcon className="h-6 w-6 text-yellow-400" />} title="Le Défibrillateur (DAE)" colorClass="text-yellow-300">
                                <p>Si un Défibrillateur Automatisé Externe est disponible, utilisez-le <strong>dès que possible</strong>. Il a la priorité sur le massage.</p>
                                <p><strong>C'est très simple : allumez-le et suivez les instructions vocales. Il vous guidera à chaque étape.</strong></p>
                            </InfoCard>
                        </div>
                        <button onClick={() => setStep('choking')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Autre urgence : L'étouffement</button>
                    </>
                );
            case 'choking':
                return (
                     <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Cas 3 : L'Étouffement Total</h2>
                        <div className="mt-6 space-y-4">
                             <InfoCard icon={<ShieldExclamationIcon className="h-6 w-6 text-orange-400" />} title="La victime ne peut ni parler, ni tousser, ni respirer" colorClass="text-orange-300">
                                <p>Si la victime tousse encore, encouragez-la à tousser ! N'intervenez pas.</p>
                                <p>Si l'obstruction est totale, agissez vite :</p>
                                <ol className="list-decimal list-inside pl-4 space-y-1">
                                    <li>Penchez la victime en avant.</li>
                                    <li>Donnez <strong>5 claques vigoureuses dans le dos</strong>, entre les omoplates.</li>
                                    <li>Si cela ne suffit pas, effectuez <strong>5 compressions abdominales</strong> (méthode de Heimlich).</li>
                                    <li>Alternez 5 claques et 5 compressions jusqu'à ce que le corps étranger soit expulsé ou que la victime perde connaissance (auquel cas, commencez le massage cardiaque).</li>
                                </ol>
                            </InfoCard>
                        </div>
                        <button onClick={() => setStep('bleeding')} className="w-full mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Autre urgence : L'hémorragie</button>
                    </>
                );
            case 'bleeding':
                return (
                     <>
                        <h2 className="text-3xl font-bold text-center text-slate-100">Cas 4 : L'Hémorragie Externe</h2>
                        <div className="mt-6 space-y-4">
                             <InfoCard icon={<HandThumbUpIcon className="h-6 w-6 text-red-400" />} title="Un saignement abondant qui ne s'arrête pas" colorClass="text-red-300">
                                <p><strong>Objectif :</strong> Limiter la perte de sang qui peut être fatale.</p>
                                <ol className="list-decimal list-inside pl-4 space-y-1">
                                    <li>Allongez la victime pour éviter un malaise.</li>
                                    <li><strong>Appuyez très fort directement sur la plaie</strong> avec un tissu propre (ou votre main protégée par un gant si possible).</li>
                                    <li>Maintenez cette compression manuelle sans jamais la relâcher jusqu'à l'arrivée des secours.</li>
                                    <li>Si un corps étranger est dans la plaie, n'y touchez pas et appuyez de part et d'autre.</li>
                                </ol>
                            </InfoCard>
                        </div>
                        <button onClick={startScenario} className="w-full mt-8 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2">
                           <SparklesIcon className="h-6 w-6" /> Mettre en pratique (Scénario 1/{scenarios.length})
                        </button>
                    </>
                );
            case 'scenarioLoading':
                return <Loader text="Chargement des scénarios..." isComplete={false} />;
            case 'scenarioActive':
            case 'debrief':
                 if (!currentScenario) return <Loader text="Chargement..." isComplete={false} />;
                const currentQuestion = currentScenario.questions[currentQuestionIndex];
                return (
                    <div className="w-full">
                         <h2 className="text-2xl font-bold text-center text-slate-100">Scénario Interactif {currentScenarioIndex + 1}/{scenarios.length}</h2>
                         <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                            <p className="text-center text-slate-300 italic">"{currentScenario.description}"</p>
                         </div>
                         {step === 'debrief' ? (
                              <div className="mt-6 text-center text-lg text-slate-300 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                                <div className="flex justify-center mb-4"><CheckCircleIcon className="h-12 w-12 text-green-400" /></div>
                                <p className="font-bold text-2xl text-green-300">Scénario terminé !</p>
                                <p className="mt-4">{currentScenario?.debrief}</p>
                             </div>
                         ) : (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-slate-200">{currentQuestion.question}</h3>
                                <div className="space-y-3 mt-4">
                                    {currentQuestion.choices.map((choice, i) => (
                                        <button key={i} onClick={() => handleAnswer(choice.isCorrect, choice.feedback)} disabled={!!feedback} className="w-full p-4 bg-slate-700 rounded-lg text-left hover:bg-sky-600 transition-colors disabled:cursor-not-allowed">
                                            {choice.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                         )}

                         {feedback && (
                             <div className={`mt-6 p-4 rounded-lg border ${feedback.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} animate-in fade-in`}>
                                <p className={`font-bold ${feedback.isCorrect ? 'text-green-300' : 'text-red-300'}`}>{feedback.isCorrect ? "Correct !" : "Incorrect."}</p>
                                <p className="mt-1 text-slate-300">{feedback.text}</p>
                             </div>
                         )}
                        
                        <div className="mt-6">
                         {scenarioCompleted ? (
                             <button onClick={() => setStep('debrief')} className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">Voir le débriefing</button>
                         ) : feedback?.isCorrect ? (
                             <button onClick={nextQuestion} className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">Question suivante</button>
                         ) : feedback && !feedback.isCorrect ? (
                             <button onClick={() => setFeedback(null)} className="w-full bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors flex items-center justify-center gap-2">
                                 <ArrowPathIcon className="h-5 w-5" /> Réessayer
                             </button>
                         ) : null}

                        {step === 'debrief' && (
                             currentScenarioIndex < scenarios.length - 1 ? (
                                <button onClick={nextScenario} className="w-full mt-4 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors">Scénario Suivant ({currentScenarioIndex + 2}/{scenarios.length})</button>
                            ) : (
                                <button onClick={onComplete} className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors">Terminer la formation</button>
                            )
                        )}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-sky-500/10 p-3 rounded-full border border-sky-500/30">
                        <HeartIcon className="h-8 w-8 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-100">Secourir</h1>
                        <p className="text-slate-400">La troisième étape pour sauver une vie.</p>
                    </div>
                </div>
                <button onClick={onBack} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Retour</button>
            </div>
            {renderContent()}
        </div>
    );
};

export default RescueScreen;
