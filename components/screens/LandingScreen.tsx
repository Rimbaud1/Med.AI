




import React, { useState } from 'react';
import { StethoscopeIcon, ClipboardDocumentCheckIcon, ShieldExclamationIcon, ShieldCheckIcon, BeakerIcon, InformationCircleIcon, BookOpenIcon, Cog6ToothIcon, PillIcon, AcademicCapIcon, NewspaperIcon, SparklesIcon } from '../icons';

interface LandingScreenProps {
  onStartDiagnosis: () => void;
  onEmergency: () => void;
  onStartPreventionPlan: () => void;
  onDirectDiagnosisSubmit: (diagnosis: string) => void;
  onShowHowItWorks: () => void;
  onShowSettings: () => void;
  hasJournalData: boolean;
  onGoToJournal: () => void;
  onGoToPillbox: () => void;
  onStartTraining: () => void;
  hasHistory: boolean;
  onGoToHistory: () => void;
  onDiscoverApp: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ 
    onStartDiagnosis, onEmergency, onStartPreventionPlan, onDirectDiagnosisSubmit, 
    onShowHowItWorks, onShowSettings, hasJournalData, onGoToJournal, onGoToPillbox, 
    onStartTraining, hasHistory, onGoToHistory, onDiscoverApp
}) => {
  const [directDiagnosis, setDirectDiagnosis] = useState('');

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (directDiagnosis.trim()) {
      onDirectDiagnosisSubmit(directDiagnosis.trim());
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 md:p-8 relative">
      <div className="absolute top-4 right-4 flex gap-2">
         <button onClick={onShowSettings} className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-700/50 rounded-full transition-colors" aria-label="Paramètres">
            <Cog6ToothIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <StethoscopeIcon className="h-12 w-12 text-sky-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-center text-slate-100">Bienvenue sur Med.AI</h1>
      <p className="mt-4 text-lg text-center text-slate-400 max-w-2xl">
        Votre assistant IA pour une orientation rapide et une prévention proactive de votre santé.
        <br />
        <span className="text-red-400 text-sm font-semibold">Cet outil ne remplace pas un avis médical professionnel.</span>
      </p>

      <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={onDiscoverApp} 
            className="w-full bg-slate-800/70 border-2 border-sky-500 rounded-xl p-4 flex items-center justify-center gap-3 text-lg text-sky-300 hover:bg-sky-500/10 transition-all duration-300 font-bold"
          >
            <SparklesIcon className="h-6 w-6" />
            Découvrir Med.AI
          </button>
           <button 
            onClick={onShowHowItWorks} 
            className="w-full bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex items-center justify-center gap-3 text-base text-slate-400 hover:bg-slate-800 hover:border-slate-500 transition-all duration-300"
          >
            <InformationCircleIcon className="h-5 w-5" />
            <span>Comment ça marche (Technique)</span>
          </button>
      </div>

      <div className="w-full mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pre-diagnosis Card */}
          <div 
              className="bg-slate-800/70 p-8 rounded-xl border border-slate-700 hover:border-sky-500 hover:bg-slate-800 transition-all duration-300 flex flex-col text-center items-center cursor-pointer group"
              onClick={onStartDiagnosis}
              role="button"
              tabIndex={0}
              aria-label="Commencer un pré-diagnostic"
          >
            <div className="bg-sky-500/10 p-4 rounded-full mb-4 border border-sky-500/30 transition-colors duration-300 group-hover:bg-sky-500/20">
              <ClipboardDocumentCheckIcon className="h-10 w-10 text-sky-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Faire un pré-diagnostic</h2>
            <p className="mt-2 text-slate-400 flex-grow">
              Obtenez une analyse préliminaire et des recommandations basées sur vos symptômes actuels.
            </p>
            <span className="mt-6 bg-sky-600 text-white font-bold py-2 px-6 rounded-lg group-hover:bg-sky-500 transition-colors duration-300">
              Commencer
            </span>
          </div>

          {/* Emergency Card */}
          <div 
              className="bg-slate-800/70 p-8 rounded-xl border border-slate-700 hover:border-red-500 hover:bg-slate-800 transition-all duration-300 flex flex-col text-center items-center cursor-pointer group"
              onClick={onEmergency}
              role="button"
              tabIndex={0}
              aria-label="Consulter le guide d'urgence"
          >
            <div className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/30 transition-colors duration-300 group-hover:bg-red-500/20">
              <ShieldExclamationIcon className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Urgence / Premiers Secours</h2>
            <p className="mt-2 text-slate-400 flex-grow">
              Accédez à des informations vitales et aux numéros d'urgence en cas de situation critique.
            </p>
            <span className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg group-hover:bg-red-500 transition-colors duration-300">
              Consulter
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* History Card */}
             <div 
              className={`bg-slate-800/70 p-8 rounded-xl border border-slate-700 transition-all duration-300 flex flex-col text-center items-center group ${hasHistory ? 'cursor-pointer hover:border-cyan-500 hover:bg-slate-800' : 'opacity-60 cursor-not-allowed'}`}
              onClick={hasHistory ? onGoToHistory : undefined}
              role="button"
              tabIndex={hasHistory ? 0 : -1}
              aria-label="Consulter l'historique des bilans"
            >
              <div className="flex-shrink-0 bg-cyan-500/10 p-4 rounded-full mb-4 border border-cyan-500/30 transition-colors duration-300 group-hover:bg-cyan-500/20">
                <NewspaperIcon className="h-10 w-10 text-cyan-400" />
              </div>
              <div className="flex-grow flex flex-col">
                <h2 className="text-2xl font-bold text-slate-100">Historique des Bilans</h2>
                <p className="mt-2 text-slate-400 flex-grow">
                  {hasHistory ? "Consultez, comparez et gérez vos précédents bilans de santé." : "Aucun bilan sauvegardé pour le moment."}
                </p>
              </div>
              <span className={`mt-6 whitespace-nowrap text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 ${hasHistory ? 'bg-cyan-600 group-hover:bg-cyan-500' : 'bg-slate-700'}`}>
                {hasHistory ? "Consulter" : "Verrouillé"}
              </span>
            </div>
            {/* Pillbox Card */}
            <div 
              className="bg-slate-800/70 p-8 rounded-xl border border-slate-700 hover:border-amber-500 hover:bg-slate-800 transition-all duration-300 flex flex-col text-center items-center cursor-pointer group"
              onClick={onGoToPillbox}
              role="button"
              tabIndex={0}
              aria-label="Accéder à mon pilulier intelligent"
            >
              <div className="flex-shrink-0 bg-amber-500/10 p-4 rounded-full mb-4 border border-amber-500/30 transition-colors duration-300 group-hover:bg-amber-500/20">
                <PillIcon className="h-10 w-10 text-amber-400" />
              </div>
              <div className="flex-grow flex flex-col">
                <h2 className="text-2xl font-bold text-slate-100">Pilulier Intelligent</h2>
                <p className="mt-2 text-slate-400 flex-grow">
                  Gérez vos traitements, recevez des rappels et suivez les effets secondaires.
                </p>
              </div>
              <span className="mt-6 whitespace-nowrap bg-amber-600 text-white font-bold py-2 px-6 rounded-lg group-hover:bg-amber-500 transition-colors duration-300">
                Ouvrir
              </span>
            </div>
            {/* Symptom Journal Card */}
            <div 
              className={`bg-slate-800/70 p-8 rounded-xl border border-slate-700 transition-all duration-300 flex flex-col text-center items-center group ${hasJournalData ? 'cursor-pointer hover:border-purple-500 hover:bg-slate-800' : 'opacity-60 cursor-not-allowed'}`}
              onClick={hasJournalData ? onGoToJournal : undefined}
              role="button"
              tabIndex={hasJournalData ? 0 : -1}
              aria-label="Accéder à mon journal de santé"
            >
              <div className="flex-shrink-0 bg-purple-500/10 p-4 rounded-full mb-4 border border-purple-500/30 transition-colors duration-300 group-hover:bg-purple-500/20">
                <BookOpenIcon className="h-10 w-10 text-purple-400" />
              </div>
              <div className="flex-grow flex flex-col">
                <h2 className="text-2xl font-bold text-slate-100">Mon Journal de Santé</h2>
                <p className="mt-2 text-slate-400 flex-grow">
                  {hasJournalData ? "Consultez et mettez à jour le suivi de vos symptômes." : "Disponible après votre premier diagnostic."}
                </p>
              </div>
              <span className={`mt-6 whitespace-nowrap text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 ${hasJournalData ? 'bg-purple-600 group-hover:bg-purple-500' : 'bg-slate-700'}`}>
                {hasJournalData ? "Ouvrir" : "Verrouillé"}
              </span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prevention Plan Card */}
            <div 
              className="bg-slate-800/70 p-8 rounded-xl border border-slate-700 hover:border-teal-500 hover:bg-slate-800 transition-all duration-300 flex flex-col text-center items-center cursor-pointer group"
              onClick={onStartPreventionPlan}
              role="button"
              tabIndex={0}
              aria-label="Démarrer un plan de prévention personnalisé"
            >
              <div className="flex-shrink-0 bg-teal-500/10 p-4 rounded-full mb-4 border border-teal-500/30 transition-colors duration-300 group-hover:bg-teal-500/20">
                <ShieldCheckIcon className="h-10 w-10 text-teal-400" />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-slate-100">Plan de Prévention</h2>
                <p className="mt-2 text-slate-400 flex-grow">
                  Recevez des recommandations proactives basées sur votre profil pour prendre soin de votre santé à long terme.
                </p>
              </div>
              <span className="mt-6 whitespace-nowrap bg-teal-600 text-white font-bold py-2 px-6 rounded-lg group-hover:bg-teal-500 transition-colors duration-300">
                Démarrer
              </span>
            </div>
            {/* First Aid Training Card */}
            <div 
              className="bg-slate-800/70 p-8 rounded-xl border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 transition-all duration-300 flex flex-col text-center items-center cursor-pointer group"
              onClick={onStartTraining}
              role="button"
              tabIndex={0}
              aria-label="Se former aux premiers secours"
            >
              <div className="flex-shrink-0 bg-indigo-500/10 p-4 rounded-full mb-4 border border-indigo-500/30 transition-colors duration-300 group-hover:bg-indigo-500/20">
                <AcademicCapIcon className="h-10 w-10 text-indigo-400" />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-slate-100">Formation Premiers Secours</h2>
                <p className="mt-2 text-slate-400 flex-grow">
                  Apprenez les gestes qui sauvent et préparez-vous à réagir efficacement en cas d'urgence via notre guide interactif.
                </p>
              </div>
              <span className="mt-6 whitespace-nowrap bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg group-hover:bg-indigo-500 transition-colors duration-300">
                Se former
              </span>
            </div>
        </div>
      </div>
      
      <div className="w-full mt-10 pt-8 border-t border-slate-700/80">
        <div 
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 transition-all duration-300 flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-4">
            <BeakerIcon className="h-8 w-8 text-indigo-400" />
            <h2 className="text-2xl font-bold text-slate-100">Je sais déjà ce que j'ai</h2>
          </div>
          <p className="mt-1 text-slate-400 text-center max-w-xl">
            Entrez un diagnostic connu (ex: "Grippe", "Gastro-entérite") pour obtenir directement des recommandations de soins, les signes de gravité à surveiller et un plan d'action.
          </p>
          <form onSubmit={handleDirectSubmit} className="w-full max-w-lg mt-6 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={directDiagnosis}
              onChange={(e) => setDirectDiagnosis(e.target.value)}
              placeholder="Entrez votre diagnostic ici..."
              className="w-full flex-grow p-3 rounded-lg bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 text-slate-200 placeholder-slate-500"
              required
            />
            <button
              type="submit"
              disabled={!directDiagnosis.trim()}
              className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-200 flex-shrink-0"
            >
              Obtenir des conseils
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;