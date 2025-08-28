





import React, { useState, useCallback, useEffect } from 'react';
import { AppState } from './types';
import type { Question, Answer, ReportData, PatientContext, SymptomIntensity, PreQuestionnaireAnswer, SymptomCharacteristics, ChatMessage, AppointmentPrepData, EmpathyLevel, ScenarioData, PreventionProfile, PreventionPlanData, NeuroTest, StabilityTestResult, CapillaryRefillTimeResult, SpeechDyspneaResult, TrackedSymptom, SymptomLogEntry, UserSettings, UserProfileData, Medication, RiskAnalysis, TrendAnalysis, TrainingProgress, DiagnosticHistoryEntry } from './types';
import { initializeAi, generateQuestions, generateReport, extractSymptoms, generateExclusionSymptoms, generateSelfExamPrompt, generateNeuroTests, shouldRequestCRT, shouldRequestRespiratoryRate, shouldRequestStabilityTest, shouldRequestSpeechDyspneaTest, generatePhotoPrompt, generateAppointmentPrepData, generateScenarios, generatePreventionPlan, generateDirectReport, shouldTriggerMemoryTest, generateMemoryTestWords, generateMedicationSideEffects, generateRiskAnalysis, analyzeSymptomTrends, generateTrainingScenarios } from './services/geminiService';
import { GoogleGenAI } from "@google/genai";
import type { Chat } from "@google/genai";


import LandingScreen from './components/screens/LandingScreen';
import HowItWorksScreen from './components/screens/HowItWorksScreen';
import EmergencyGuideScreen from './components/screens/EmergencyGuideScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import DataPrivacyScreen from './components/screens/DataPrivacyScreen';
import PreDiagnosisScreen from './components/screens/PreDiagnosisScreen';
import InitialScreen from './components/screens/InitialScreen';
import ContextScreen from './components/screens/ContextScreen';
import SymptomIntensityScreen from './components/screens/SymptomIntensityScreen';
import SymptomCharacteristicsScreen from './components/screens/SymptomCharacteristicsScreen';
import PreQuestionnaireScreen from './components/screens/PreQuestionnaireScreen';
import AnnounceMemoryTestScreen from './components/screens/AnnounceMemoryTestScreen';
import QuestionnaireScreen from './components/screens/QuestionnaireScreen';
import MemoryTestInputScreen from './components/screens/MemoryTestInputScreen';
import ExclusionFilterScreen from './components/screens/ExclusionFilterScreen';
import SelfExamScreen from './components/screens/SelfExamScreen';
import NeuroTestScreen from './components/screens/NeuroTestScreen';
import CRTScreen from './components/screens/CRTScreen';
import RespiratoryRateScreen from './components/screens/RespiratoryRateScreen';
import StabilityTestScreen from './components/screens/StabilityTestScreen';
import SpeechDyspneaScreen from './components/screens/SpeechDyspneaScreen';
import PhotoUploadScreen from './components/screens/PhotoUploadScreen';
import SymptomMonitoringScreen from './components/screens/SymptomMonitoringScreen';
import ReportScreen from './components/screens/ReportScreen';
import DiagnosticSummaryScreen from './components/screens/DiagnosticSummaryScreen';
import ChatScreen from './components/screens/ChatScreen';
import ErrorScreen from './components/screens/ErrorScreen';
import Loader from './components/Loader';
import MedicalAppointmentPrepScreen from './components/screens/MedicalAppointmentPrepScreen';
import ScenarioSimulatorScreen from './components/screens/ScenarioSimulatorScreen';
import PreventionProfileScreen from './components/screens/PreventionProfileScreen';
import PreventionPlanReportScreen from './components/screens/PreventionPlanReportScreen';
import SymptomJournalSetupScreen from './components/screens/SymptomJournalSetupScreen';
import SymptomJournalScreen from './components/screens/SymptomJournalScreen';
import PillboxScreen from './components/screens/PillboxScreen';
import AddMedicationScreen from './components/screens/AddMedicationScreen';
import MedicationDetailScreen from './components/screens/MedicationDetailScreen';
import TrainingScreen from './components/screens/TrainingScreen';
import ProtectScreen from './components/screens/training/ProtectScreen';
import AlertScreen from './components/screens/training/AlertScreen';
import { NewspaperIcon, TrashIcon, ClockIcon, HeartIcon } from './components/icons';

// FIX: Define a separate interface for DiagnosticHistoryScreen props to fix a potential type inference issue and improve code readability.
interface DiagnosticHistoryScreenProps {
  history: DiagnosticHistoryEntry[];
  onViewReport: (id: string) => void;
  onDeleteReport: (id: string) => void;
  onBack: () => void;
}

// --- Diagnostic History Screen (defined in App.tsx to avoid creating new files) ---
const DiagnosticHistoryScreen: React.FC<DiagnosticHistoryScreenProps> = ({ history, onViewReport, onDeleteReport, onBack }) => {
    
    const getSeverityClass = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'faible': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'modéré': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'élevé': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-slate-600/50 text-slate-300 border-slate-600';
        }
    };
    
    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/30">
                        <NewspaperIcon className="h-10 w-10 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Historique des Bilans</h1>
                        <p className="mt-1 text-slate-400">Consultez vos diagnostics précédents.</p>
                    </div>
                </div>
                <button onClick={onBack} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Retour</button>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
                    <NewspaperIcon className="h-16 w-16 mx-auto text-slate-500 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-300">Votre historique est vide</h2>
                    <p className="text-slate-400 mt-2">Les bilans que vous compléterez apparaîtront ici.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.slice().reverse().map(entry => (
                        <div key={entry.id} className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-sky-300">{entry.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-400 mt-2 flex-wrap">
                                    <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {new Date(entry.date).toLocaleString('fr-FR')}</span>
                                    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityClass(entry.report.severity)}`}>
                                        <HeartIcon className="h-4 w-4" /> Gravité: {entry.report.severity}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-2">
                                <button onClick={() => onViewReport(entry.id)} className="flex-grow w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                    Voir le Bilan
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteReport(entry.id); }}
                                    className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition-colors"
                                    aria-label={`Supprimer le bilan ${entry.name}`}
                                >
                                    <TrashIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [initialSymptoms, setInitialSymptoms] = useState<string>('');
  const [patientContext, setPatientContext] = useState<PatientContext | null>(null);
  const [extractedSymptoms, setExtractedSymptoms] = useState<string[]>([]);
  const [mainSymptom, setMainSymptom] = useState<string | null>(null);
  const [symptomIntensities, setSymptomIntensities] = useState<SymptomIntensity[]>([]);
  const [overallDiscomfort, setOverallDiscomfort] = useState<string | null>(null);
  const [symptomCharacteristics, setSymptomCharacteristics] = useState<SymptomCharacteristics | null>(null);
  const [preQuestionnaireAnswers, setPreQuestionnaireAnswers] = useState<PreQuestionnaireAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [potentialExclusionSymptoms, setPotentialExclusionSymptoms] = useState<string[]>([]);
  const [excludedSymptoms, setExcludedSymptoms] = useState<string[]>([]);
  const [selfExamPrompt, setSelfExamPrompt] = useState<string | null>(null);
  const [selfExamResult, setSelfExamResult] = useState<string | null>(null);
  const [neuroTestQuestions, setNeuroTestQuestions] = useState<string[]>([]);
  const [neuroTestAnswers, setNeuroTestAnswers] = useState<NeuroTest[]>([]);
  const [crtResult, setCrtResult] = useState<CapillaryRefillTimeResult | null>(null);
  const [respiratoryRate, setRespiratoryRate] = useState<number | null>(null);
  const [stabilityTestResult, setStabilityTestResult] = useState<StabilityTestResult | null>(null);
  const [speechDyspneaResult, setSpeechDyspneaResult] = useState<SpeechDyspneaResult | null>(null);
  const [photoPrompt, setPhotoPrompt] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [appointmentPrepData, setAppointmentPrepData] = useState<AppointmentPrepData | null>(null);
  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Direct diagnosis flow state
  const [isDirectFlow, setIsDirectFlow] = useState(false);

  // Memory Test state
  const [isMemoryTestRelevant, setIsMemoryTestRelevant] = useState(false);
  const [memoryTestWords, setMemoryTestWords] = useState<string[]>([]);
  const [memoryTestResponse, setMemoryTestResponse] = useState<string[]>([]);

  // Prevention Plan state
  const [preventionProfile, setPreventionProfile] = useState<PreventionProfile | null>(null);
  const [preventionPlan, setPreventionPlan] = useState<PreventionPlanData | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);


  // Chat state
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatResponding, setIsChatResponding] = useState(false);
  const [empathyLevel, setEmpathyLevel] = useState<EmpathyLevel>('Empathique');
  
  // Symptom Journal state
  const [symptomsToTrackSetup, setSymptomsToTrackSetup] = useState<string[]>([]);
  const [journalData, setJournalData] = useState<TrackedSymptom[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);

  // Pillbox state
  const [pillboxData, setPillboxData] = useState<Medication[]>([]);
  const [activeMedicationId, setActiveMedicationId] = useState<string | null>(null);

  // Training state
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({ protect: false, alert: false, rescue: false });

  // History state
  const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticHistoryEntry[]>([]);

  // Settings & Profile state
  const [userSettings, setUserSettings] = useState<UserSettings>({
      saveProfileData: {
          sexAndAge: false,
          weight: false,
          location: false,
          existingConditions: false,
          currentMedications: false,
          allergies: false,
          recentTravels: false,
      },
      apiKey: undefined,
  });
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  
  // Loading state management
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const [onLoadContinue, setOnLoadContinue] = useState<(() => void) | null>(null);

  // Navigation context
  const [navigationSource, setNavigationSource] = useState<'landing' | 'report' | 'history' | null>(null);

  // Load persistent data from localStorage on initial mount
  useEffect(() => {
    try {
      const savedJournal = localStorage.getItem('medai-journal');
      if (savedJournal) setJournalData(JSON.parse(savedJournal));

      const savedPillbox = localStorage.getItem('medai-pillbox');
      if (savedPillbox) setPillboxData(JSON.parse(savedPillbox));

      const savedSettings = localStorage.getItem('medai-settings');
      if (savedSettings) setUserSettings(JSON.parse(savedSettings));

      const savedProfile = localStorage.getItem('medai-user-profile');
      if (savedProfile) setUserProfile(JSON.parse(savedProfile));
      
      const savedTrainingProgress = localStorage.getItem('medai-training-progress');
      if (savedTrainingProgress) setTrainingProgress(JSON.parse(savedTrainingProgress));
      
      const savedHistory = localStorage.getItem('medai-diagnostic-history');
      if (savedHistory) setDiagnosticHistory(JSON.parse(savedHistory));

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // This effect runs on initial load AND every time settings change.
  // It initializes the AI client and saves settings to localStorage.
  useEffect(() => {
    // Initialize the AI client with the current key (or default)
    if (!process.env.API_KEY) {
        console.error("Default API_KEY environment variable is not set.");
        // Potentially show an error to the user if no custom key is set either
        if (!userSettings.apiKey) {
            handleError("La clé d'API par défaut n'est pas configurée et aucune clé personnalisée n'a été fournie.");
        }
    }
    initializeAi(userSettings.apiKey || process.env.API_KEY!);

    // Persist settings whenever they change
    try {
      localStorage.setItem('medai-settings', JSON.stringify(userSettings));
    } catch (error) {
      console.error("Failed to save settings", error);
    }
  }, [userSettings]);


  const handleSettingsChange = useCallback((newSettings: UserSettings) => {
    setUserSettings(newSettings);
  }, []);

  const clearJournal = useCallback(() => {
    setJournalData([]);
    try {
      localStorage.removeItem('medai-journal');
    } catch (error) {
      console.error("Failed to clear journal data", error);
    }
  }, []);

   const clearPillbox = useCallback(() => {
    setPillboxData([]);
    try {
      localStorage.removeItem('medai-pillbox');
    } catch (error) {
      console.error("Failed to clear pillbox data", error);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setUserProfile(null);
    const clearedSettings: UserSettings = {
      ...userSettings,
      saveProfileData: {
        sexAndAge: false, weight: false, location: false, existingConditions: false,
        currentMedications: false, allergies: false, recentTravels: false,
      }
    };
    handleSettingsChange(clearedSettings);
    try {
      localStorage.removeItem('medai-user-profile');
    } catch (error) {
      console.error("Failed to clear profile data", error);
    }
  }, [handleSettingsChange, userSettings]);

  const clearTrainingProgress = useCallback(() => {
      const clearedProgress = { protect: false, alert: false, rescue: false };
      setTrainingProgress(clearedProgress);
      try {
        localStorage.removeItem('medai-training-progress');
      } catch (error) {
        console.error("Failed to clear training progress", error);
      }
  }, []);
  
  const clearHistory = useCallback(() => {
    setDiagnosticHistory([]);
    try {
      localStorage.removeItem('medai-diagnostic-history');
    } catch (error) {
      console.error("Failed to clear history data", error);
    }
  }, []);


  // Save journal to localStorage whenever it changes
  useEffect(() => {
    try {
      if (journalData.length > 0) {
        localStorage.setItem('medai-journal', JSON.stringify(journalData));
      } else {
        localStorage.removeItem('medai-journal');
      }
    } catch (error) {
      console.error("Failed to save journal data to localStorage", error);
    }
  }, [journalData]);
  
  // Save pillbox to localStorage whenever it changes
  useEffect(() => {
    try {
      if (pillboxData.length > 0) {
        localStorage.setItem('medai-pillbox', JSON.stringify(pillboxData));
      } else {
        localStorage.removeItem('medai-pillbox');
      }
    } catch (error) {
      console.error("Failed to save pillbox data to localStorage", error);
    }
  }, [pillboxData]);

  // Save training progress to localStorage whenever it changes
  useEffect(() => {
      try {
        localStorage.setItem('medai-training-progress', JSON.stringify(trainingProgress));
      } catch (error) {
        console.error("Failed to save training progress", error);
      }
  }, [trainingProgress]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (diagnosticHistory.length > 0) {
        localStorage.setItem('medai-diagnostic-history', JSON.stringify(diagnosticHistory));
      } else {
        localStorage.removeItem('medai-diagnostic-history');
      }
    } catch (error) {
      console.error("Failed to save diagnostic history to localStorage", error);
    }
  }, [diagnosticHistory]);

  const handleReset = useCallback(() => {
    setAppState(AppState.LANDING);
    setInitialSymptoms('');
    setPatientContext(null);
    setExtractedSymptoms([]);
    setMainSymptom(null);
    setSymptomIntensities([]);
    setOverallDiscomfort(null);
    setSymptomCharacteristics(null);
    setPreQuestionnaireAnswers([]);
    setQuestions([]);
    setAnswers([]);
    setPotentialExclusionSymptoms([]);
    setExcludedSymptoms([]);
    setSelfExamPrompt(null);
    setSelfExamResult(null);
    setNeuroTestQuestions([]);
    setNeuroTestAnswers([]);
    setCrtResult(null);
    setRespiratoryRate(null);
    setStabilityTestResult(null);
    setSpeechDyspneaResult(null);
    setPhotoPrompt(null);
    setPhotoBase64(null);
    setReport(null);
    setAppointmentPrepData(null);
    setScenarioData(null);
    setError(null);
    setIsDirectFlow(false);
    setIsMemoryTestRelevant(false);
    setMemoryTestWords([]);
    setMemoryTestResponse([]);
    setPreventionProfile(null);
    setPreventionPlan(null);
    setRiskAnalysis(null);
    setChatSession(null);
    setChatHistory([]);
    setIsChatResponding(false);
    setSymptomsToTrackSetup([]);
    setTrendAnalysis(null);
    setActiveMedicationId(null);
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setNavigationSource(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setAppState(AppState.ERROR);
  }, []);

  const handleNavigateToHowItWorks = useCallback(() => {
    setAppState(AppState.HOW_IT_WORKS);
  }, []);

  const handleNavigateToPreDiagnosis = useCallback(() => {
    setAppState(AppState.PRE_DIAGNOSIS);
  }, []);

  const handleNavigateToEmergencyGuide = useCallback(() => {
    setAppState(AppState.EMERGENCY_GUIDE);
  }, []);
  
  const handleNavigateToSettings = useCallback(() => {
    setAppState(AppState.SETTINGS);
  }, []);

  const handleNavigateToDataPrivacy = useCallback(() => {
    setAppState(AppState.DATA_PRIVACY_EXPLANATION);
  }, []);

  const handleNavigateToPreventionPlan = useCallback(() => {
    setAppState(AppState.PREVENTION_PLAN_PROFILE);
  }, []);
  
  const handleNavigateToTraining = useCallback(() => {
    setAppState(AppState.TRAINING);
  }, []);

  const handleNavigateToHistory = useCallback(() => {
    setAppState(AppState.DIAGNOSTIC_HISTORY);
  }, []);

  const handleViewHistoricReport = useCallback((id: string) => {
    const entry = diagnosticHistory.find(e => e.id === id);
    if (entry) {
      setReport(entry.report);
      setPatientContext(entry.patientContext);
      setInitialSymptoms(entry.initialSymptoms);
      setIsDirectFlow(entry.isDirectFlow);
      setNavigationSource('history');
      setAppState(AppState.REPORT);
    }
  }, [diagnosticHistory]);

  const handleDeleteHistoricReport = useCallback((id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bilan de votre historique ?")) {
      setDiagnosticHistory(prev => prev.filter(e => e.id !== id));
    }
  }, []);

  
  const handleNavigateToTrainingProtect = useCallback(() => {
    setAppState(AppState.TRAINING_PROTECT);
  }, []);
  
  const handleNavigateToTrainingAlert = useCallback(() => {
    setAppState(AppState.TRAINING_ALERT);
  }, []);

  const handleCompleteProtectSection = useCallback(() => {
    setTrainingProgress(prev => ({ ...prev, protect: true }));
    setAppState(AppState.TRAINING);
  }, []);

  const handleCompleteAlertSection = useCallback(() => {
    setTrainingProgress(prev => ({ ...prev, alert: true }));
    setAppState(AppState.TRAINING);
  }, []);


  const handlePreDiagnosisContinue = useCallback(() => {
    setAppState(AppState.INITIAL);
  }, []);

  const handleStartDiagnosis = useCallback((symptoms: string) => {
    setInitialSymptoms(symptoms);
    setNavigationSource('landing');
    setAppState(AppState.CONTEXT_GATHERING);
  }, []);
  
  const generateAndSetQuestions = useCallback(async (
    context: PatientContext,
    intensities: SymptomIntensity[],
    discomfort: string | null,
    mainSymptom: string | null,
    characteristics: SymptomCharacteristics | null,
    preAnswers: PreQuestionnaireAnswer[]
  ) => {
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_QUESTIONS);
    try {
      const generatedQuestions = await generateQuestions(initialSymptoms, context, intensities, discomfort, mainSymptom, characteristics, preAnswers);
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setIsLoadComplete(true);
        setOnLoadContinue(() => () => {
            setAppState(AppState.QUESTIONNAIRE);
            setOnLoadContinue(null);
        });
      } else {
        throw new Error("Le questionnaire reçu est vide.");
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    }
  }, [initialSymptoms, handleError]);

  const handleContextSubmit = useCallback(async (context: PatientContext) => {
    setPatientContext(context);
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.PROCESSING_CONTEXT);

    try {
        const [relevant, symptoms] = await Promise.all([
            shouldTriggerMemoryTest(initialSymptoms, context),
            extractSymptoms(initialSymptoms)
        ]);
        
        setIsMemoryTestRelevant(relevant);

        setIsLoadComplete(true);
        if (symptoms && symptoms.length > 0) {
            setExtractedSymptoms(symptoms);
            setOnLoadContinue(() => () => {
                setAppState(AppState.SYMPTOM_INTENSITY);
                setOnLoadContinue(null);
            });
        } else {
            setSymptomIntensities([]);
            setOverallDiscomfort(null);
            setMainSymptom(null);
            setSymptomCharacteristics(null);
            setOnLoadContinue(() => () => {
                setAppState(AppState.PRE_QUESTIONNAIRE);
                setOnLoadContinue(null);
            });
        }
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Erreur lors de l'analyse du contexte.");
    }
  }, [initialSymptoms, handleError]);
  
  const handleIntensitySubmit = useCallback((intensities: SymptomIntensity[], discomfort: string | null, mainSymptom: string) => {
    setSymptomIntensities(intensities);
    setOverallDiscomfort(discomfort);
    setMainSymptom(mainSymptom);
    setAppState(AppState.SYMPTOM_CHARACTERISTICS);
  }, []);

  const handleSkipIntensityScreen = useCallback(() => {
    setSymptomIntensities([]);
    setOverallDiscomfort(null);
    setMainSymptom(null);
    setSymptomCharacteristics(null);
    setAppState(AppState.PRE_QUESTIONNAIRE);
  }, []);

  const handleCharacteristicsSubmit = useCallback((characteristics: SymptomCharacteristics) => {
    setSymptomCharacteristics(characteristics);
    setAppState(AppState.PRE_QUESTIONNAIRE);
  }, []);

  const handlePreQuestionnaireSubmit = useCallback(async (preAnswers: PreQuestionnaireAnswer[]) => {
    if (!patientContext) {
      handleError("Les informations contextuelles du patient sont manquantes.");
      return;
    }
    setPreQuestionnaireAnswers(preAnswers);

    if (isMemoryTestRelevant) {
        setAppState(AppState.GENERATING_MEMORY_TEST_WORDS);
        try {
            const words = await generateMemoryTestWords();
            setMemoryTestWords(words);
            setAppState(AppState.ANNOUNCE_MEMORY_TEST);
        } catch (err) {
            console.error("Failed to generate memory test words, skipping test.", err);
            await generateAndSetQuestions(patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preAnswers);
        }
    } else {
        await generateAndSetQuestions(patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preAnswers);
    }
  }, [patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, isMemoryTestRelevant, generateAndSetQuestions, handleError]);
  
  const handleMemoryTestAnnounced = useCallback(() => {
    if (!patientContext) {
      handleError("Les informations contextuelles du patient sont manquantes.");
      return;
    }
    generateAndSetQuestions(patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers);
  }, [patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, generateAndSetQuestions, handleError]);

  const generateAndSetPhotoPrompt = useCallback(async (currentExcludedSymptoms: string[], currentSelfExamResult: string | null, currentNeuroTestAnswers: NeuroTest[], currentCrtResult: CapillaryRefillTimeResult | null, currentRespiratoryRate: number | null, currentStabilityResult: StabilityTestResult | null, currentSpeechDyspneaResult: SpeechDyspneaResult | null) => {
      setIsLoadComplete(false);
      setOnLoadContinue(null);
      setAppState(AppState.GENERATING_PHOTO_PROMPT);
      if (!patientContext) {
          handleError("Les informations contextuelles du patient sont manquantes.");
          return;
      }
      try {
        const prompt = await generatePhotoPrompt(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, currentExcludedSymptoms, currentSelfExamResult, currentNeuroTestAnswers, currentCrtResult, currentRespiratoryRate, currentStabilityResult, currentSpeechDyspneaResult);
        setPhotoPrompt(prompt);
        setIsLoadComplete(true);
        setOnLoadContinue(() => () => {
            setAppState(AppState.PHOTO_UPLOAD);
            setOnLoadContinue(null);
        });
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Erreur lors de la suggestion de photo.");
    }
  }, [patientContext, initialSymptoms, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, handleError]);

    const handleSpeechDyspneaSubmit = useCallback(async (result: SpeechDyspneaResult | null) => {
        setSpeechDyspneaResult(result);
        await generateAndSetPhotoPrompt(excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, result);
    }, [excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, generateAndSetPhotoPrompt]);

    const handleStabilityTestSubmit = useCallback(async (result: StabilityTestResult | null) => {
        setStabilityTestResult(result);
        if (!patientContext) {
            handleError("Les informations contextuelles du patient sont manquantes.");
            return;
        }
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.GENERATING_SPEECH_DYSPNEA_PROMPT);
        try {
            const shouldRequest = await shouldRequestSpeechDyspneaTest(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, result);
            setIsLoadComplete(true);
            if (shouldRequest) {
                setOnLoadContinue(() => () => {
                    setAppState(AppState.SPEECH_DYSPNEA_TEST);
                    setOnLoadContinue(null);
                });
            } else {
                await handleSpeechDyspneaSubmit(null);
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : "Erreur lors de l'analyse des tests.");
        }
    }, [patientContext, initialSymptoms, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, handleSpeechDyspneaSubmit, handleError]);

    const handleRespiratoryRateSubmit = useCallback(async (rate: number | null) => {
        setRespiratoryRate(rate);
        if (!patientContext) {
            handleError("Les informations contextuelles du patient sont manquantes.");
            return;
        }
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.GENERATING_STABILITY_TEST_PROMPT);
        try {
            const shouldRequest = await shouldRequestStabilityTest(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, rate);
            setIsLoadComplete(true);
            if (shouldRequest) {
                 setOnLoadContinue(() => () => {
                    setAppState(AppState.STABILITY_TEST);
                    setOnLoadContinue(null);
                });
            } else {
                await handleStabilityTestSubmit(null);
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : "Erreur lors de l'analyse des tests.");
        }
    }, [patientContext, initialSymptoms, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, handleStabilityTestSubmit, handleError]);

    const handleCRTSubmit = useCallback(async (result: CapillaryRefillTimeResult | null) => {
        setCrtResult(result);
        if (!patientContext) {
            handleError("Les informations contextuelles du patient sont manquantes.");
            return;
        }
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.GENERATING_RESPIRATORY_RATE_PROMPT);
        try {
            const shouldRequest = await shouldRequestRespiratoryRate(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, result);
            setIsLoadComplete(true);
            if (shouldRequest) {
                 setOnLoadContinue(() => () => {
                    setAppState(AppState.RESPIRATORY_RATE_TEST);
                    setOnLoadContinue(null);
                });
            } else {
                await handleRespiratoryRateSubmit(null);
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : "Erreur lors de l'analyse des tests.");
        }
    }, [patientContext, initialSymptoms, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, handleRespiratoryRateSubmit, handleError]);

    const handleNeuroTestSubmit = useCallback(async (testAnswers: NeuroTest[]) => {
        setNeuroTestAnswers(testAnswers);
        if (!patientContext) {
            handleError("Les informations contextuelles du patient sont manquantes.");
            return;
        }
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.GENERATING_CRT_PROMPT);
        try {
            const shouldRequest = await shouldRequestCRT(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, testAnswers);
            setIsLoadComplete(true);
            if (shouldRequest) {
                setOnLoadContinue(() => () => {
                    setAppState(AppState.CRT_TEST);
                    setOnLoadContinue(null);
                });
            } else {
                await handleCRTSubmit(null);
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : "Erreur lors de l'analyse des tests.");
        }
    }, [patientContext, initialSymptoms, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, handleCRTSubmit, handleError]);

    const handleSelfExamSubmit = useCallback(async (result: string | null) => {
        setSelfExamResult(result);
        if (!patientContext) {
            handleError("Les informations contextuelles du patient sont manquantes.");
            return;
        }
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.GENERATING_NEURO_TESTS);
        try {
            const generatedNeuroTests = await generateNeuroTests(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, result);
            setIsLoadComplete(true);
            if (generatedNeuroTests && generatedNeuroTests.length > 0) {
                setNeuroTestQuestions(generatedNeuroTests);
                setOnLoadContinue(() => () => {
                    setAppState(AppState.NEURO_TESTS);
                    setOnLoadContinue(null);
                });
            } else {
                await handleNeuroTestSubmit([]);
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : "Erreur lors de la génération des tests neurologiques.");
        }
    }, [patientContext, initialSymptoms, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, handleNeuroTestSubmit, handleError]);
  
  const handleExclusionSubmit = useCallback(async (selectedSymptoms: string[]) => {
    setExcludedSymptoms(selectedSymptoms);
    if (!patientContext) {
        handleError("Les informations contextuelles du patient sont manquantes.");
        return;
    }
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_SELF_EXAM_PROMPT);
    try {
      const prompt = await generateSelfExamPrompt(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, selectedSymptoms);
      setIsLoadComplete(true);
      if (prompt) {
        setSelfExamPrompt(prompt);
        setOnLoadContinue(() => () => {
            setAppState(AppState.SELF_EXAM);
            setOnLoadContinue(null);
        });
      } else {
        await handleSelfExamSubmit(null);
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Erreur lors de la génération de l'auto-examen.");
    }
  }, [patientContext, initialSymptoms, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, handleSelfExamSubmit, handleError]);
  
  const handleQuestionnaireSubmit = useCallback(async (submittedAnswers: Answer[]) => {
    setAnswers(submittedAnswers);
    if (isMemoryTestRelevant) {
        setAppState(AppState.MEMORY_TEST_INPUT);
    } else {
        if (!patientContext) {
            handleError("Les informations contextuelles du patient sont manquantes.");
            return;
        }
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.GENERATING_EXCLUSION_SYMPTOMS);
        try {
            const exclusionSymptoms = await generateExclusionSymptoms(initialSymptoms, patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, submittedAnswers);
            setIsLoadComplete(true);
            if (exclusionSymptoms && exclusionSymptoms.length > 0) {
                setPotentialExclusionSymptoms(exclusionSymptoms);
                 setOnLoadContinue(() => () => {
                    setAppState(AppState.EXCLUSION_FILTER);
                    setOnLoadContinue(null);
                });
            } else {
                await handleExclusionSubmit([]);
            }
        } catch(err) {
            handleError(err instanceof Error ? err.message : "Erreur lors de la génération du filtre d'exclusion.");
        }
    }
  }, [patientContext, initialSymptoms, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, isMemoryTestRelevant, handleExclusionSubmit, handleError]);

  const handleMemoryTestSubmit = useCallback(async (response: string[]) => {
    setMemoryTestResponse(response);
    if (!patientContext) {
        handleError("Les informations contextuelles du patient sont manquantes.");
        return;
    }
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_EXCLUSION_SYMPTOMS);
    try {
        const exclusionSymptoms = await generateExclusionSymptoms(initialSymptoms, patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, answers);
        setIsLoadComplete(true);
        if (exclusionSymptoms && exclusionSymptoms.length > 0) {
            setPotentialExclusionSymptoms(exclusionSymptoms);
             setOnLoadContinue(() => () => {
                setAppState(AppState.EXCLUSION_FILTER);
                setOnLoadContinue(null);
            });
        } else {
            await handleExclusionSubmit([]);
        }
    } catch(err) {
        handleError(err instanceof Error ? err.message : "Erreur lors de la génération du filtre d'exclusion.");
    }
  }, [patientContext, initialSymptoms, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, answers, handleExclusionSubmit, handleError]);

  const saveReportToHistory = useCallback((reportData: ReportData) => {
    if (!patientContext) return;
    const newEntry: DiagnosticHistoryEntry = {
      id: Date.now().toString(),
      name: reportData.possibleIssues[0]?.name || initialSymptoms,
      date: new Date().toISOString(),
      report: reportData,
      patientContext: patientContext,
      initialSymptoms: initialSymptoms,
      isDirectFlow: isDirectFlow,
    };
    setDiagnosticHistory(prev => [...prev, newEntry]);
  }, [patientContext, initialSymptoms, isDirectFlow]);

  const handlePhotoUploadComplete = useCallback(async (base64: string | null) => {
    setPhotoBase64(base64);
    if (!patientContext) {
      handleError("Les informations contextuelles du patient sont manquantes.");
      return;
    }
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_REPORT);
    try {
      const generatedReport = await generateReport(
        initialSymptoms, patientContext, answers, base64, symptomIntensities, overallDiscomfort,
        mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, speechDyspneaResult, memoryTestWords, memoryTestResponse
      );
      setReport(generatedReport);
      saveReportToHistory(generatedReport);
      setIsLoadComplete(true);
      setOnLoadContinue(() => () => {
        setAppState(AppState.SYMPTOM_MONITORING);
        setOnLoadContinue(null);
      });
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Erreur lors de la génération du rapport.");
    }
  }, [patientContext, initialSymptoms, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, speechDyspneaResult, memoryTestWords, memoryTestResponse, saveReportToHistory, handleError]);
  
  const handleDirectDiagnosisSubmit = useCallback(async (diagnosis: string) => {
    setInitialSymptoms(diagnosis);
    setIsDirectFlow(true);
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_DIRECT_REPORT);
    try {
        const generatedReport = await generateDirectReport(diagnosis);
        setReport(generatedReport);
        setNavigationSource('landing');
        setIsLoadComplete(true);
        setOnLoadContinue(() => () => {
            setAppState(AppState.REPORT);
            setOnLoadContinue(null);
        });
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Erreur lors de la génération du rapport.");
    }
  }, [handleError]);
  
  const handleMonitoringContinue = useCallback(() => {
    setAppState(AppState.REPORT);
  }, []);

  const handleStartSupportChat = useCallback(() => {
    if (!report) return;
    const ai = new GoogleGenAI({apiKey: userSettings.apiKey || process.env.API_KEY});
    const systemInstruction = `Tu es Aura, une IA de soutien psychologique. Ton ton est ${empathyLevel}. Le patient vient de recevoir un diagnostic préliminaire de Med.AI. Sois rassurant, aide-le à comprendre ses émotions et à formuler des questions pour son médecin. Ne donne JAMAIS de nouveaux conseils médicaux. Contexte du patient : ${report.possibleIssues.map(p => p.name).join(', ')}, gravité ${report.severity}. Commence par un message d'accueil et de soutien.`;

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
    });
    setChatSession(chat);
    setChatHistory([{
      role: 'model',
      text: `Bonjour, je suis Aura. Je suis là pour vous écouter. Comment vous sentez-vous après avoir lu ce premier bilan ?`
    }]);
    setAppState(AppState.PSYCHOLOGICAL_SUPPORT);
  }, [report, empathyLevel, userSettings.apiKey]);

  const handleEmpathyLevelChange = useCallback((level: EmpathyLevel) => {
      setEmpathyLevel(level);
      // We could restart the chat here, but for now we just change it for the next message
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!chatSession) return;
    const fullHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(fullHistory);
    setIsChatResponding(true);

    try {
        const response = await chatSession.sendMessage({ message });
        setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);
    } catch(err) {
        console.error("Error sending chat message:", err);
        setChatHistory(prev => [...prev, { role: 'model', text: "Je suis désolé, j'ai rencontré une erreur. Pourriez-vous reformuler ?" }]);
    } finally {
        setIsChatResponding(false);
    }
  }, [chatSession, chatHistory]);

  const handleBackToReport = useCallback(() => {
    if (navigationSource === 'history') {
      setAppState(AppState.DIAGNOSTIC_HISTORY);
    } else {
      setAppState(AppState.REPORT);
    }
  }, [navigationSource]);
  
  const handleGoToSummary = useCallback(() => {
    setAppState(AppState.DIAGNOSTIC_SUMMARY);
  }, []);

  const handleGoToAppointmentPrep = useCallback(async () => {
    if (!report) return;
    if (appointmentPrepData) {
      setAppState(AppState.MEDICAL_APPOINTMENT_PREP);
      return;
    }
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_APPOINTMENT_PREP);
    try {
        const data = await generateAppointmentPrepData(report);
        setAppointmentPrepData(data);
        setIsLoadComplete(true);
        setOnLoadContinue(() => () => {
            setAppState(AppState.MEDICAL_APPOINTMENT_PREP);
            setOnLoadContinue(null);
        });
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Erreur lors de la préparation de la consultation.");
    }
  }, [report, appointmentPrepData, handleError]);

  const handleGoToScenarioSimulator = useCallback(async () => {
    if (!report) return;
    if (scenarioData) {
      setAppState(AppState.SCENARIO_SIMULATOR);
      return;
    }
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_SCENARIOS);
    try {
        const data = await generateScenarios(report);
        setScenarioData(data);
        setIsLoadComplete(true);
        setOnLoadContinue(() => () => {
            setAppState(AppState.SCENARIO_SIMULATOR);
            setOnLoadContinue(null);
        });
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Erreur lors de la génération des scénarios.");
    }
  }, [report, scenarioData, handleError]);
  
  const handlePreventionProfileSubmit = useCallback(async (profile: PreventionProfile) => {
      setPreventionProfile(profile);
      setIsLoadComplete(false);
      setOnLoadContinue(null);
      setAppState(AppState.GENERATING_PREVENTION_PLAN);
      try {
        const [planData, riskData] = await Promise.all([
          generatePreventionPlan(profile),
          generateRiskAnalysis(profile)
        ]);
        setPreventionPlan(planData);
        setRiskAnalysis(riskData);
        setIsLoadComplete(true);
        setOnLoadContinue(() => () => {
            setAppState(AppState.PREVENTION_PLAN_REPORT);
            setOnLoadContinue(null);
        });
      } catch (err) {
          handleError(err instanceof Error ? err.message : "Erreur lors de la génération du plan de prévention.");
      }
  }, [handleError]);

  const handleStartTracking = useCallback(() => {
      if (report) {
          const mainIssues = report.possibleIssues.map(p => p.name);
          setSymptomsToTrackSetup(mainIssues);
          setAppState(AppState.SYMPTOM_JOURNAL_SETUP);
      }
  }, [report]);

  const handleGoToJournal = useCallback(() => {
      setAppState(AppState.SYMPTOM_JOURNAL);
  }, []);

  const handleSymptomJournalSetup = useCallback((symptomsToTrack: string[]) => {
      const newJournalData: TrackedSymptom[] = symptomsToTrack.map(name => {
          const existing = journalData.find(s => s.name === name);
          return existing || { name, logs: [] };
      });
      setJournalData(newJournalData);
      setAppState(AppState.SYMPTOM_JOURNAL);
  }, [journalData]);

  const handleAddJournalEntry = useCallback((symptomName: string, entry: Omit<SymptomLogEntry, 'date'>) => {
      const today = new Date().toISOString().split('T')[0];
      setJournalData(prevData => {
          return prevData.map(symptom => {
              if (symptom.name === symptomName) {
                  const existingLogIndex = symptom.logs.findIndex(log => log.date === today);
                  const newLogs = [...symptom.logs];
                  if (existingLogIndex > -1) {
                      newLogs[existingLogIndex] = { date: today, ...entry };
                  } else {
                      newLogs.push({ date: today, ...entry });
                  }
                  return { ...symptom, logs: newLogs };
              }
              return symptom;
          });
      });
  }, []);

    const handleAnalyzeTrends = useCallback(async () => {
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.ANALYZING_SYMPTOM_TRENDS);
        try {
            const analysis = await analyzeSymptomTrends(journalData);
            setTrendAnalysis(analysis);
            setIsLoadComplete(true);
            setOnLoadContinue(() => () => {
                setAppState(AppState.SYMPTOM_JOURNAL);
                setOnLoadContinue(null);
            });
        } catch (err) {
            handleError(err instanceof Error ? err.message : "Erreur lors de l'analyse des tendances.");
        }
    }, [journalData, handleError]);

    const handleGoToPillbox = useCallback(() => {
      setAppState(AppState.PILLBOX);
    }, []);
    
    const handleNavigateToAddMedication = useCallback(() => {
      setAppState(AppState.PILLBOX_ADD_MEDICATION);
    }, []);

    const handleAddMedication = useCallback(async (medication: Medication) => {
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.GENERATING_SIDE_EFFECTS);
        try {
            const sideEffectInfo = await generateMedicationSideEffects(medication.name);
            const medWithInfo = { ...medication, sideEffectInfo };
            setPillboxData(prev => [...prev, medWithInfo]);
            setIsLoadComplete(true);
            setOnLoadContinue(() => () => {
                setAppState(AppState.PILLBOX);
                setOnLoadContinue(null);
            });
        } catch (err) {
            console.warn("Could not fetch side effects, adding medication without it.", err);
            setPillboxData(prev => [...prev, medication]);
            setAppState(AppState.PILLBOX);
        }
    }, []);

    const handleAddPrescriptionToPillbox = useCallback(async (medicationNames: string[]) => {
      try {
        const medicationsWithInfo = await Promise.all(
          medicationNames.map(async (name) => {
            const sideEffectInfo = await generateMedicationSideEffects(name);
            return {
              id: `${Date.now()}-${name}`,
              name: name,
              frequency: 'Au besoin' as const,
              durationDays: null,
              startDate: new Date().toISOString().split('T')[0],
              sideEffectInfo: sideEffectInfo,
            };
          })
        );
        setPillboxData(prev => [...prev, ...medicationsWithInfo]);
      } catch (err) {
        console.warn("Could not fetch side effects for prescription, adding without it.", err);
        const newMeds = medicationNames.map(name => ({
           id: `${Date.now()}-${name}`,
           name: name,
           frequency: 'Au besoin' as const,
           durationDays: null,
           startDate: new Date().toISOString().split('T')[0],
        }));
        setPillboxData(prev => [...prev, ...newMeds]);
      }
    }, []);


    const handleNavigateToMedicationDetail = useCallback((medicationId: string) => {
      setActiveMedicationId(medicationId);
      setAppState(AppState.MEDICATION_DETAIL);
    }, []);
    
    const handleUpdateSideEffectNotes = useCallback((medicationId: string, notes: string) => {
        const today = new Date().toISOString().split('T')[0];
        setPillboxData(prev => prev.map(med => {
            if (med.id === medicationId) {
                const existingLogs = med.trackedSideEffects || [];
                const todayLogIndex = existingLogs.findIndex(log => log.date === today);
                let newLogs;

                if (notes.trim() === '') { // Remove log if notes are empty
                    newLogs = existingLogs.filter(log => log.date !== today);
                } else if (todayLogIndex > -1) { // Update today's log
                    newLogs = [...existingLogs];
                    newLogs[todayLogIndex] = { date: today, notes };
                } else { // Add new log
                    newLogs = [...existingLogs, { date: today, notes }];
                }
                return { ...med, trackedSideEffects: newLogs };
            }
            return med;
        }));
    }, []);

    const handleDeleteMedication = useCallback((medicationId: string) => {
        setPillboxData(prev => prev.filter(med => med.id !== medicationId));
    }, []);


  const renderScreen = () => {
    switch (appState) {
      case AppState.LANDING:
        return <LandingScreen onStartDiagnosis={handleNavigateToPreDiagnosis} onEmergency={handleNavigateToEmergencyGuide} onStartPreventionPlan={handleNavigateToPreventionPlan} onDirectDiagnosisSubmit={handleDirectDiagnosisSubmit} onShowHowItWorks={handleNavigateToHowItWorks} onShowSettings={handleNavigateToSettings} hasJournalData={journalData.length > 0} onGoToJournal={handleGoToJournal} onGoToPillbox={handleGoToPillbox} onStartTraining={handleNavigateToTraining} hasHistory={diagnosticHistory.length > 0} onGoToHistory={handleNavigateToHistory} />;
      case AppState.HOW_IT_WORKS:
        return <HowItWorksScreen onBackToLanding={handleReset} />;
      case AppState.EMERGENCY_GUIDE:
        return <EmergencyGuideScreen onBack={handleReset} />;
      case AppState.SETTINGS:
        return <SettingsScreen onBackToLanding={handleReset} settings={userSettings} onSettingsChange={handleSettingsChange} journalData={journalData} pillboxData={pillboxData} trainingProgress={trainingProgress} diagnosticHistory={diagnosticHistory} onClearJournal={clearJournal} onClearPillbox={clearPillbox} onClearProfile={clearProfile} onClearTrainingProgress={clearTrainingProgress} onClearHistory={clearHistory} onShowDataPrivacy={handleNavigateToDataPrivacy} />;
      case AppState.DATA_PRIVACY_EXPLANATION:
        return <DataPrivacyScreen onBack={handleNavigateToSettings} />;
      case AppState.PRE_DIAGNOSIS:
        return <PreDiagnosisScreen onContinue={handlePreDiagnosisContinue} />;
      case AppState.INITIAL:
        return <InitialScreen onStart={handleStartDiagnosis} />;
      case AppState.CONTEXT_GATHERING:
        return <ContextScreen onSubmit={handleContextSubmit} savedProfile={userProfile} />;
      case AppState.PROCESSING_CONTEXT:
          return <Loader text="Analyse du contexte..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.SYMPTOM_INTENSITY:
        return <SymptomIntensityScreen symptoms={extractedSymptoms} onSubmit={handleIntensitySubmit} onSkip={handleSkipIntensityScreen} />;
      case AppState.SYMPTOM_CHARACTERISTICS:
        return <SymptomCharacteristicsScreen onSubmit={handleCharacteristicsSubmit} onSkip={() => handleCharacteristicsSubmit({})} />;
      case AppState.PRE_QUESTIONNAIRE:
        return <PreQuestionnaireScreen onSubmit={handlePreQuestionnaireSubmit} />;
      case AppState.GENERATING_MEMORY_TEST_WORDS:
          return <Loader text="Préparation du test de mémoire..." isComplete={false} />;
      case AppState.ANNOUNCE_MEMORY_TEST:
          return <AnnounceMemoryTestScreen words={memoryTestWords} onContinue={handleMemoryTestAnnounced} />;
      case AppState.GENERATING_QUESTIONS:
        return <Loader text="Génération du questionnaire..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.QUESTIONNAIRE:
        return <QuestionnaireScreen questions={questions} onSubmit={handleQuestionnaireSubmit} />;
      case AppState.MEMORY_TEST_INPUT:
          return <MemoryTestInputScreen onSubmit={handleMemoryTestSubmit} />;
      case AppState.GENERATING_EXCLUSION_SYMPTOMS:
          return <Loader text="Analyse des réponses..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.EXCLUSION_FILTER:
        return <ExclusionFilterScreen symptoms={potentialExclusionSymptoms} onSubmit={handleExclusionSubmit} onSkip={() => handleExclusionSubmit([])} />;
      case AppState.GENERATING_SELF_EXAM_PROMPT:
          return <Loader text="Analyse..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.SELF_EXAM:
        return <SelfExamScreen prompt={selfExamPrompt!} onSubmit={(result) => handleSelfExamSubmit(result)} onSkip={() => handleSelfExamSubmit(null)} />;
      case AppState.GENERATING_NEURO_TESTS:
          return <Loader text="Analyse..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.NEURO_TESTS:
          return <NeuroTestScreen questions={neuroTestQuestions} onSubmit={handleNeuroTestSubmit} onSkip={() => handleNeuroTestSubmit([])} />;
      case AppState.GENERATING_CRT_PROMPT:
           return <Loader text="Analyse..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.CRT_TEST:
          return <CRTScreen onSubmit={handleCRTSubmit} onSkip={() => handleCRTSubmit(null)} />;
      case AppState.GENERATING_RESPIRATORY_RATE_PROMPT:
           return <Loader text="Analyse..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.RESPIRATORY_RATE_TEST:
          return <RespiratoryRateScreen onSubmit={handleRespiratoryRateSubmit} />;
      case AppState.GENERATING_STABILITY_TEST_PROMPT:
           return <Loader text="Analyse..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.STABILITY_TEST:
          return <StabilityTestScreen onSubmit={handleStabilityTestSubmit} onSkip={() => handleStabilityTestSubmit(null)} />;
      case AppState.GENERATING_SPEECH_DYSPNEA_PROMPT:
           return <Loader text="Analyse..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.SPEECH_DYSPNEA_TEST:
          return <SpeechDyspneaScreen onSubmit={handleSpeechDyspneaSubmit} />;
      case AppState.GENERATING_PHOTO_PROMPT:
          return <Loader text="Recherche de symptômes visibles..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.PHOTO_UPLOAD:
        return <PhotoUploadScreen onComplete={handlePhotoUploadComplete} photoPrompt={photoPrompt} />;
      case AppState.GENERATING_REPORT:
        return <Loader text="Génération du rapport d'analyse..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.GENERATING_DIRECT_REPORT:
        return <Loader text="Génération du rapport informatif..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.SYMPTOM_MONITORING:
        return <SymptomMonitoringScreen instructions={report!.monitoringInstructions} onContinue={handleMonitoringContinue} />;
      case AppState.REPORT:
        return <ReportScreen report={report!} patientContext={patientContext} onReset={handleReset} onStartSupportChat={handleStartSupportChat} onGoToSummary={handleGoToSummary} onGoToAppointmentPrep={handleGoToAppointmentPrep} onGoToScenarioSimulator={handleGoToScenarioSimulator} onStartTracking={handleStartTracking} onGoToPillbox={handleGoToPillbox} onAddPrescriptionToPillbox={handleAddPrescriptionToPillbox} isDirectFlow={isDirectFlow} fromHistory={navigationSource === 'history'} />;
      case AppState.DIAGNOSTIC_SUMMARY:
        return <DiagnosticSummaryScreen onBackToReport={handleBackToReport} patientContext={patientContext!} initialSymptoms={initialSymptoms} mainSymptom={mainSymptom} symptomIntensities={symptomIntensities} overallDiscomfort={overallDiscomfort} symptomCharacteristics={symptomCharacteristics} preQuestionnaireAnswers={preQuestionnaireAnswers} answers={answers} excludedSymptoms={excludedSymptoms} selfExamResult={selfExamResult} neuroTestAnswers={neuroTestAnswers} crtResult={crtResult} respiratoryRate={respiratoryRate} stabilityTestResult={stabilityTestResult} speechDyspneaResult={speechDyspneaResult} photoBase64={photoBase64} report={report!} memoryTestWords={memoryTestWords} memoryTestResponse={memoryTestResponse} />;
      case AppState.PSYCHOLOGICAL_SUPPORT:
        return <ChatScreen history={chatHistory} onSendMessage={handleSendMessage} isResponding={isChatResponding} onBackToReport={handleBackToReport} empathyLevel={empathyLevel} onEmpathyLevelChange={handleEmpathyLevelChange} />;
      case AppState.GENERATING_APPOINTMENT_PREP:
        return <Loader text="Génération de l'aide à la consultation..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.MEDICAL_APPOINTMENT_PREP:
          return <MedicalAppointmentPrepScreen prepData={appointmentPrepData!} onBackToReport={handleBackToReport} onGoToSummary={handleGoToSummary} />;
      case AppState.GENERATING_SCENARIOS:
          return <Loader text="Génération des scénarios d'évolution..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.SCENARIO_SIMULATOR:
          return <ScenarioSimulatorScreen scenarios={scenarioData!.scenarios} onBackToReport={handleBackToReport} />;
      case AppState.PREVENTION_PLAN_PROFILE:
          return <PreventionProfileScreen onSubmit={handlePreventionProfileSubmit} onBackToLanding={handleReset} />;
      case AppState.GENERATING_PREVENTION_PLAN:
          return <Loader text="Analyse de votre profil et génération du plan..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.PREVENTION_PLAN_REPORT:
          return <PreventionPlanReportScreen plan={preventionPlan!} riskAnalysis={riskAnalysis!} onReset={handleReset} />;
      case AppState.SYMPTOM_JOURNAL_SETUP:
          return <SymptomJournalSetupScreen suggestedSymptoms={symptomsToTrackSetup} onSubmit={handleSymptomJournalSetup} onBackToReport={handleBackToReport} />;
      case AppState.SYMPTOM_JOURNAL:
          return <SymptomJournalScreen journalData={journalData} onAddEntry={handleAddJournalEntry} onBack={handleReset} onAnalyzeTrends={handleAnalyzeTrends} trendAnalysis={trendAnalysis} onClearTrendAnalysis={() => setTrendAnalysis(null)} />;
      case AppState.ANALYZING_SYMPTOM_TRENDS:
          return <Loader text="Analyse des tendances..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.PILLBOX:
          return <PillboxScreen pillboxData={pillboxData} onNavigateToAdd={handleNavigateToAddMedication} onNavigateToDetail={handleNavigateToMedicationDetail} onBack={handleReset} onDeleteMedication={handleDeleteMedication} />;
      case AppState.PILLBOX_ADD_MEDICATION:
          return <AddMedicationScreen onAddMedication={handleAddMedication} onBack={handleGoToPillbox} />;
      case AppState.GENERATING_SIDE_EFFECTS:
          return <Loader text="Recherche des informations sur le traitement..." isComplete={isLoadComplete} onContinue={onLoadContinue!} />;
      case AppState.MEDICATION_DETAIL:
          const activeMedication = pillboxData.find(m => m.id === activeMedicationId);
          return activeMedication ? <MedicationDetailScreen medication={activeMedication} onUpdateSideEffectNotes={handleUpdateSideEffectNotes} onBack={handleGoToPillbox} /> : <ErrorScreen message="Médicament non trouvé." onRetry={handleGoToPillbox} />;
      case AppState.TRAINING:
          return <TrainingScreen onBackToLanding={handleReset} onNavigateToTrainingProtect={handleNavigateToTrainingProtect} onNavigateToTrainingAlert={handleNavigateToTrainingAlert} trainingProgress={trainingProgress} />;
      case AppState.TRAINING_PROTECT:
          return <ProtectScreen onComplete={handleCompleteProtectSection} onBack={() => setAppState(AppState.TRAINING)} />;
      case AppState.TRAINING_ALERT:
          return <AlertScreen onComplete={handleCompleteAlertSection} onBack={() => setAppState(AppState.TRAINING)} />;
      case AppState.DIAGNOSTIC_HISTORY:
        return <DiagnosticHistoryScreen history={diagnosticHistory} onViewReport={handleViewHistoricReport} onDeleteReport={handleDeleteHistoricReport} onBack={() => setAppState(AppState.LANDING)} />;
      case AppState.ERROR:
        return <ErrorScreen message={error || "Une erreur inconnue est survenue."} onRetry={handleReset} />;
      default:
        return <LandingScreen onStartDiagnosis={handleNavigateToPreDiagnosis} onEmergency={handleNavigateToEmergencyGuide} onStartPreventionPlan={handleNavigateToPreventionPlan} onDirectDiagnosisSubmit={handleDirectDiagnosisSubmit} onShowHowItWorks={handleNavigateToHowItWorks} onShowSettings={handleNavigateToSettings} hasJournalData={journalData.length > 0} onGoToJournal={handleGoToJournal} onGoToPillbox={handleGoToPillbox} onStartTraining={handleNavigateToTraining} hasHistory={diagnosticHistory.length > 0} onGoToHistory={handleNavigateToHistory} />;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center font-sans antialiased">
      {renderScreen()}
    </div>
  );
};

// FIX: Add a default export for the App component to resolve the module import error in index.tsx.
export default App;