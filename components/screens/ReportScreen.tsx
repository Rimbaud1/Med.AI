

import React, { useState } from 'react';
import type { ReportData, PatientContext } from '../../types';
import { WarningIcon, PillIcon, ClipboardListIcon, HeartIcon, ChatBubbleLeftRightIcon, DocumentArrowDownIcon, ClipboardIcon, ClipboardDocumentCheckIcon, ArrowTrendingUpIcon, MapPinIcon, CalendarDaysIcon, ClockIcon, AcademicCapIcon, EnvelopeIcon, ChartBarIcon } from '../icons';

interface ReportScreenProps {
  report: ReportData;
  patientContext: PatientContext | null;
  onReset: () => void;
  onStartSupportChat: () => void;
  onGoToSummary: () => void;
  onGoToAppointmentPrep: () => void;
  onGoToScenarioSimulator: () => void;
  onStartTracking: () => void;
  onGoToPillbox: () => void;
  isDirectFlow?: boolean;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ report, patientContext, onReset, onStartSupportChat, onGoToSummary, onGoToAppointmentPrep, onGoToScenarioSimulator, onStartTracking, onGoToPillbox, isDirectFlow = false }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copier le résumé');
  const [locationInput, setLocationInput] = useState('');
  const [showExcuseModal, setShowExcuseModal] = useState(false);
  const [excuseName, setExcuseName] = useState('');
  const [excuseCopyText, setExcuseCopyText] = useState('Copier le texte');


  const handleCopySummary = () => {
    if (report.shortSummaryForPatient) {
      navigator.clipboard.writeText(report.shortSummaryForPatient);
      setCopyButtonText('Copié !');
      setTimeout(() => setCopyButtonText('Copier le résumé'), 2000);
    }
  };

  const today = new Date().toLocaleDateString('fr-FR');
  const excuseText = `Ce message pour vous informer que je suis souffrant(e) ce jour, le ${today}, et ne pourrai donc pas me rendre au travail/en cours. Un avis médical est en cours pour évaluer la situation. Cordialement, ${excuseName.trim() ? excuseName.trim() : '[Votre Nom]'}`;

  const handleCopyExcuse = () => {
    navigator.clipboard.writeText(excuseText);
    setExcuseCopyText('Copié !');
    setTimeout(() => setExcuseCopyText('Copier le texte'), 2000);
  };

  const handleStartTrackingClick = () => {
    onStartTracking();
  };


  const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'faible':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'modéré':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'élevé':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-600/50 text-slate-300 border-slate-600';
    }
  };
  
  const specialistSlug = report.suggestedSpecialist?.slug || 'medecin-generaliste';
  const specialistName = report.suggestedSpecialist?.name || 'Médecin Généraliste';

  const effectiveLocation = patientContext?.location || locationInput;


  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      </div>
      <div className="text-slate-300 space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100 mb-8">Votre Rapport {isDirectFlow ? "Informatif" : "de Diagnostic"}</h1>

      <div className="space-y-6">
        {/* Disclaimer */}
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-4">
          <WarningIcon className="h-8 w-8 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold">Avertissement Important</h4>
            <p className="text-sm">{report.disclaimer}</p>
          </div>
        </div>

        {/* Severity */}
        <div className={`p-4 rounded-lg border flex items-center justify-center gap-3 ${getSeverityClass(report.severity)}`}>
            <HeartIcon className="h-6 w-6" />
            <span className="font-bold text-lg">Niveau de Gravité Estimé : {report.severity}</span>
        </div>

        {/* Possible Issues */}
        <Section title={isDirectFlow ? "Condition Déclarée" : "Problèmes Possibles"} icon={<ClipboardListIcon className="h-7 w-7 text-sky-400" />}>
          <div className="space-y-5">
            {report.possibleIssues.map((issue, i) => (
              <div key={i} className="group relative">
                <div className="flex justify-between items-center mb-1 font-medium">
                  <span className="text-slate-200">{issue.name}</span>
                  <span className="text-sky-300">{issue.confidence}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: `${issue.confidence}%`, transition: 'width 0.5s ease-in-out' }}
                    role="progressbar"
                    aria-valuenow={issue.confidence}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Confiance de ${issue.confidence}% pour ${issue.name}`}
                  ></div>
                </div>
                {/* Tooltip */}
                <div 
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-sm text-slate-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-10" 
                  role="tooltip"
                >
                  <p className="font-bold text-slate-100 mb-1.5">Description</p>
                  <p>{issue.description}</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-700"></div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Recommendations */}
        <Section title="Recommandations" icon={<ClipboardListIcon className="h-7 w-7 text-sky-400" />}>
          <ul className="list-disc list-inside space-y-1">
            {report.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
          </ul>
        </Section>
        
        {/* Prescription */}
        <Section title="Ordonnance Suggérée (Sans Ordonnance)" icon={<PillIcon className="h-7 w-7 text-sky-400" />}>
            <p className="text-slate-400 text-sm mb-3">Produits disponibles sans ordonnance qui pourraient aider. Consultez un pharmacien ou un médecin avant utilisation.</p>
          <ul className="list-disc list-inside space-y-1">
            {report.prescription.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Section>

        {/* Social Eviction Period */}
        {report.socialEvictionPeriod && (
          <Section title="Période d'Éviction Sociale" icon={<ClockIcon className="h-7 w-7 text-sky-400" />}>
            <p className="text-slate-400 text-sm mb-3">Basé sur le diagnostic le plus probable, voici une recommandation pour limiter la contagion.</p>
            <p className="bg-slate-900/40 p-3 rounded-md border border-slate-700/50">{report.socialEvictionPeriod}</p>
          </Section>
        )}

        {/* Nutrition Guide */}
        {report.nutritionGuide && (
          <Section title="Guide de Nutrition" icon={<AcademicCapIcon className="h-7 w-7 text-sky-400" />}>
            <p className="text-slate-400 text-sm mb-3">Suggestion de repas "Quoi Manger Ce Soir ?" adaptés à votre situation.</p>
            <p className="bg-slate-900/40 p-3 rounded-md border border-slate-700/50">{report.nutritionGuide}</p>
          </Section>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-center text-slate-100 mb-6">Prochaines Étapes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!isDirectFlow && (
              <>
                <button onClick={onGoToSummary} className="bg-slate-700/80 text-white font-bold py-4 px-6 rounded-lg hover:bg-slate-600/80 transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg border border-slate-600">
                    <DocumentArrowDownIcon className="h-7 w-7" />
                    Télécharger le Bilan
                </button>
                <button onClick={handleCopySummary} className="bg-slate-700/80 text-white font-bold py-4 px-6 rounded-lg hover:bg-slate-600/80 transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg border border-slate-600">
                    <ClipboardIcon className="h-7 w-7" />
                    {copyButtonText}
                </button>
                <button onClick={onGoToAppointmentPrep} className="bg-slate-700/80 text-white font-bold py-4 px-6 rounded-lg hover:bg-slate-600/80 transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg border border-slate-600">
                    <ClipboardDocumentCheckIcon className="h-7 w-7" />
                    Préparer ma consultation
                </button>
                 <button onClick={() => setShowExcuseModal(true)} className="bg-slate-700/80 text-white font-bold py-4 px-6 rounded-lg hover:bg-slate-600/80 transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg border border-slate-600">
                    <EnvelopeIcon className="h-7 w-7" />
                    Générer un Mot d'Excuse
                </button>
              </>
            )}
            <button onClick={onStartSupportChat} className={`bg-emerald-600/90 text-white font-bold py-4 px-6 rounded-lg hover:bg-emerald-500/90 transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg border border-emerald-500 ${isDirectFlow ? 'md:col-span-2' : ''}`}>
                <ChatBubbleLeftRightIcon className="h-7 w-7" />
                Soutien Psychologique
            </button>
            <button
              onClick={onGoToScenarioSimulator}
              className="bg-indigo-600/80 text-white font-bold py-4 px-6 rounded-lg hover:bg-indigo-500/80 transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg border border-indigo-500"
            >
              <ArrowTrendingUpIcon className="h-7 w-7" />
              Simulateur d'Évolution
            </button>
             {!isDirectFlow && (
              <>
                <button onClick={handleStartTrackingClick} className="bg-purple-600/80 text-white font-bold py-4 px-6 rounded-lg hover:bg-purple-500/80 transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg border border-purple-500">
                    <ChartBarIcon className="h-7 w-7" />
                    Suivre mes Symptômes
                </button>
                <button onClick={onGoToPillbox} className="lg:col-span-2 bg-amber-600/80 text-white font-bold py-4 px-6 rounded-lg hover:bg-amber-500/80 transition duration-200 flex items-center justify-center gap-3 text-base sm:text-lg border border-amber-500">
                    <PillIcon className="h-7 w-7" />
                    Pilulier Intelligent & Suivi de Traitement
                </button>
              </>
            )}
        </div>
      </div>
      
      <div className="mt-10 pt-8 border-t border-slate-700/80">
          <h3 className="text-2xl font-bold text-center text-slate-100 mb-6">Trouver un Professionnel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <a
                  href={`https://www.google.com/maps/search/?api=1&query=pharmacie${effectiveLocation ? `+${encodeURIComponent(effectiveLocation)}` : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800/70 p-6 rounded-xl hover:border-green-500 hover:bg-slate-800 transition-all duration-300 flex items-center gap-4 text-left border border-slate-700 group"
              >
                  <MapPinIcon className="h-10 w-10 text-green-400 flex-shrink-0" />
                  <div>
                      <span className="block font-bold text-lg text-slate-100">Trouver une Pharmacie</span>
                      <span className="text-sm text-slate-400">Ouvrir Google Maps</span>
                  </div>
              </a>

              <a
                  href={effectiveLocation ? `https://www.doctolib.fr/search?location=${encodeURIComponent(effectiveLocation)}&speciality=${specialistSlug}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-slate-800/70 p-6 rounded-xl transition-all duration-300 flex items-center gap-4 text-left border border-slate-700 group ${effectiveLocation ? 'hover:border-blue-500 hover:bg-slate-800' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={(e) => !effectiveLocation && e.preventDefault()}
              >
                  <CalendarDaysIcon className="h-10 w-10 text-blue-400 flex-shrink-0" />
                  <div>
                      <span className="block font-bold text-lg text-slate-100">Prendre RDV ({specialistName})</span>
                      <span className="text-sm text-slate-400">Ouvrir Doctolib</span>
                  </div>
              </a>
          </div>
          {!patientContext?.location && (
            <div className="text-center max-w-2xl mx-auto mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400 mb-3">
                    Pour activer la recherche localisée, entrez votre ville ou code postal ci-dessous.
                </p>
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="ex: Paris, 75001"
                    className="w-full max-w-xs p-2 rounded-md bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200"
                    aria-label="Entrez votre localisation"
                  />
                </div>
            </div>
          )}
      </div>

      <div className="mt-10 pt-6 border-t border-slate-700 text-center">
        <button
          onClick={onReset}
          className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200"
        >
          {isDirectFlow ? "Retour à l'accueil" : "Commencer un Nouveau Diagnostic"}
        </button>
      </div>

      {showExcuseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 print-hide animate-in fade-in duration-300">
          <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowExcuseModal(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700 z-10" aria-label="Fermer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div className="flex items-center gap-3 mb-4">
                <EnvelopeIcon className="h-7 w-7 text-sky-400" />
                <h3 className="text-xl font-bold text-slate-100">Générateur de Mot d'Excuse</h3>
            </div>
            
            <p className="text-sm text-slate-400 mb-4">Ceci est un texte non-officiel pour prévenir rapidement votre employeur ou une école.</p>
            
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-200 whitespace-pre-line">{excuseText}</p>
            </div>
            
            <div className="mt-4">
                <label htmlFor="excuseName" className="text-sm font-medium text-slate-300 block mb-1">Signer avec votre nom (optionnel)</label>
                <input
                    id="excuseName"
                    type="text"
                    value={excuseName}
                    onChange={(e) => setExcuseName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200"
                />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleCopyExcuse}
                    className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2"
                >
                    <ClipboardIcon className="h-5 w-5" />
                    {excuseCopyText}
                </button>
                <button
                    onClick={() => setShowExcuseModal(false)}
                    className="w-full sm:w-auto bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
                >
                    Fermer
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportScreen;
