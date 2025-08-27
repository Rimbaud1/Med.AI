

import React, { useState, useCallback, useEffect } from 'react';
import { AppState } from './types';
import type { Question, Answer, ReportData, PatientContext, SymptomIntensity, PreQuestionnaireAnswer, SymptomCharacteristics, ChatMessage, AppointmentPrepData, EmpathyLevel, ScenarioData, PreventionProfile, PreventionPlanData, NeuroTest, StabilityTestResult, CapillaryRefillTimeResult, SpeechDyspneaResult, TrackedSymptom, SymptomLogEntry, UserSettings, UserProfileData, Medication, RiskAnalysis, TrendAnalysis, TrainingProgress } from './types';
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
  const [navigationSource, setNavigationSource] = useState<'landing' | 'report' | null>(null);

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
          const prompt = await generatePhotoPrompt(
              initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom,
              symptomCharacteristics, preQuestionnaireAnswers, currentExcludedSymptoms, currentSelfExamResult,
              currentNeuroTestAnswers, currentCrtResult, currentRespiratoryRate, currentStabilityResult,
              currentSpeechDyspneaResult
          );
          setPhotoPrompt(prompt || null);
          setIsLoadComplete(true);
          setOnLoadContinue(() => () => setAppState(AppState.PHOTO_UPLOAD));
      } catch (err) {
          console.error("Failed to generate photo prompt, continuing...", err);
          setPhotoPrompt(null);
          setIsLoadComplete(true);
          setOnLoadContinue(() => () => setAppState(AppState.PHOTO_UPLOAD));
      }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, handleError]);

  const handleSpeechDyspneaTestComplete = useCallback(async (result: SpeechDyspneaResult | null) => {
    setSpeechDyspneaResult(result);
    await generateAndSetPhotoPrompt(excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, result);
  }, [excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, generateAndSetPhotoPrompt]);

  const checkAndStartSpeechDyspneaTest = useCallback(async (currentStabilityResult: StabilityTestResult | null) => {
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_SPEECH_DYSPNEA_PROMPT);
    if (!patientContext) { handleError("Contexte patient manquant."); return; }
    try {
        const shouldRequest = await shouldRequestSpeechDyspneaTest(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom,symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, currentStabilityResult);
        if (shouldRequest) {
            setIsLoadComplete(true);
            setOnLoadContinue(() => () => setAppState(AppState.SPEECH_DYSPNEA_TEST));
        } else {
            await handleSpeechDyspneaTestComplete(null);
        }
    } catch (err) {
        console.error("Failed to check for speech dyspnea test, skipping.", err);
        await handleSpeechDyspneaTestComplete(null);
    }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, handleError, handleSpeechDyspneaTestComplete]);

  const handleStabilityTestComplete = useCallback(async (result: StabilityTestResult | null) => {
    setStabilityTestResult(result);
    await checkAndStartSpeechDyspneaTest(result);
  }, [checkAndStartSpeechDyspneaTest]);

  const checkAndStartStabilityTest = useCallback(async (currentRespiratoryRate: number | null) => {
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_STABILITY_TEST_PROMPT);
    if (!patientContext) { handleError("Contexte patient manquant."); return; }
    try {
        const shouldRequest = await shouldRequestStabilityTest(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, currentRespiratoryRate);
        if (shouldRequest) {
            setIsLoadComplete(true);
            setOnLoadContinue(() => () => setAppState(AppState.STABILITY_TEST));
        } else {
            await handleStabilityTestComplete(null);
        }
    } catch (err) {
        console.error("Failed to check for stability test, skipping.", err);
        await handleStabilityTestComplete(null);
    }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, handleError, handleStabilityTestComplete]);

  const handleRespiratoryRateTestComplete = useCallback(async (count: number | null) => {
    const rate = count !== null ? count * 2 : null;
    setRespiratoryRate(rate);
    await checkAndStartStabilityTest(rate);
  }, [checkAndStartStabilityTest]);

  const checkAndStartRespiratoryTest = useCallback(async (currentNeuroTestAnswers: NeuroTest[], currentCrtResult: CapillaryRefillTimeResult | null) => {
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_RESPIRATORY_RATE_PROMPT);
    if (!patientContext) { handleError("Contexte patient manquant."); return; }
    try {
        const shouldRequest = await shouldRequestRespiratoryRate(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, currentNeuroTestAnswers, currentCrtResult);
        if (shouldRequest) {
             setIsLoadComplete(true);
            setOnLoadContinue(() => () => setAppState(AppState.RESPIRATORY_RATE_TEST));
        } else {
            await handleRespiratoryRateTestComplete(null);
        }
    } catch (err) {
        console.error("Failed to check for respiratory rate, skipping.", err);
        await handleRespiratoryRateTestComplete(null);
    }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, handleError, handleRespiratoryRateTestComplete]);
  
  const handleCRTTestComplete = useCallback(async (result: CapillaryRefillTimeResult | null) => {
      setCrtResult(result);
      await checkAndStartRespiratoryTest(neuroTestAnswers, result);
  }, [neuroTestAnswers, checkAndStartRespiratoryTest]);

  const checkAndStartCRTTest = useCallback(async (currentNeuroTestAnswers: NeuroTest[]) => {
      setIsLoadComplete(false);
      setOnLoadContinue(null);
      setAppState(AppState.GENERATING_CRT_PROMPT);
      if (!patientContext) { handleError("Contexte patient manquant."); return; }
      try {
          const shouldRequest = await shouldRequestCRT(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom,symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, currentNeuroTestAnswers);
          if (shouldRequest) {
              setIsLoadComplete(true);
              setOnLoadContinue(() => () => setAppState(AppState.CRT_TEST));
          } else {
              await handleCRTTestComplete(null);
          }
      } catch (err) {
          console.error("Failed to check for CRT test, skipping.", err);
          await handleCRTTestComplete(null);
      }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, handleError, handleCRTTestComplete]);

  const handleNeuroTestComplete = useCallback(async (completedNeuroAnswers: NeuroTest[]) => {
      setNeuroTestAnswers(completedNeuroAnswers);
      await checkAndStartCRTTest(completedNeuroAnswers);
  }, [checkAndStartCRTTest]);

  const generateAndSetNeuroTest = useCallback(async (currentSelfExamResult: string | null) => {
      setIsLoadComplete(false);
      setOnLoadContinue(null);
      setAppState(AppState.GENERATING_NEURO_TESTS);
      if (!patientContext) { handleError("Contexte patient manquant."); return; }
      try {
          const questions = await generateNeuroTests(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, currentSelfExamResult);
          if (questions && questions.length > 0) {
              setNeuroTestQuestions(questions);
              setIsLoadComplete(true);
              setOnLoadContinue(() => () => setAppState(AppState.NEURO_TESTS));
          } else {
              setNeuroTestQuestions([]);
              await handleNeuroTestComplete([]);
          }
      } catch (err) {
          console.error("Failed to generate neuro tests, skipping.", err);
          await handleNeuroTestComplete([]);
      }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, handleError, handleNeuroTestComplete]);

  const handleSelfExamComplete = useCallback(async (result: string) => {
      setSelfExamResult(result);
      await generateAndSetNeuroTest(result);
  }, [generateAndSetNeuroTest]);

  const handleExclusionFilterComplete = useCallback(async (selectedSymptoms: string[]) => {
      setExcludedSymptoms(selectedSymptoms);
      setIsLoadComplete(false);
      setOnLoadContinue(null);
      setAppState(AppState.GENERATING_SELF_EXAM_PROMPT);
      if (!patientContext) { handleError("Contexte patient manquant."); return; }
      try {
          const prompt = await generateSelfExamPrompt(initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, selectedSymptoms);
          if (prompt) {
              setSelfExamPrompt(prompt);
              setIsLoadComplete(true);
              setOnLoadContinue(() => () => setAppState(AppState.SELF_EXAM));
          } else {
              setSelfExamPrompt(null);
              await handleSelfExamComplete('');
          }
      } catch (err) {
          console.error("Failed to generate self-exam prompt, skipping.", err);
          await handleSelfExamComplete('');
      }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, handleError, handleSelfExamComplete]);
  
  const proceedToExclusionFilter = useCallback(async (currentAnswers: Answer[]) => {
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_EXCLUSION_SYMPTOMS);
    if (!patientContext) { handleError("Les informations contextuelles du patient sont manquantes."); return; }
    try {
        const symptoms = await generateExclusionSymptoms(initialSymptoms, patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, currentAnswers);
        if (symptoms && symptoms.length > 0) {
            setPotentialExclusionSymptoms(symptoms);
            setIsLoadComplete(true);
            setOnLoadContinue(() => () => {
                setAppState(AppState.EXCLUSION_FILTER);
                setOnLoadContinue(null);
            });
        } else {
            await handleExclusionFilterComplete([]);
        }
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Erreur lors de la génération des symptômes d'exclusion.");
    }
  }, [initialSymptoms, patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, handleError, handleExclusionFilterComplete]);
  
  const handleQuestionnaireComplete = useCallback(async (completedAnswers: Answer[]) => {
    setAnswers(completedAnswers);
    if (isMemoryTestRelevant) {
        setAppState(AppState.MEMORY_TEST_INPUT);
    } else {
        await proceedToExclusionFilter(completedAnswers);
    }
  }, [isMemoryTestRelevant, proceedToExclusionFilter]);

  const handleMemoryTestInputComplete = useCallback(async (userInput: string[]) => {
    setMemoryTestResponse(userInput);
    await proceedToExclusionFilter(answers);
  }, [answers, proceedToExclusionFilter]);
  
  const handlePhotoSubmit = useCallback(async (imageBase64: string | null) => {
    setPhotoBase64(imageBase64);
    if (!patientContext) {
        handleError("Les informations contextuelles du patient sont manquantes.");
        return;
    }
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_REPORT);
    try {
      const generatedReport = await generateReport(
          initialSymptoms, patientContext, answers, imageBase64, symptomIntensities, overallDiscomfort,
          mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult,
          neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, speechDyspneaResult,
          isMemoryTestRelevant ? memoryTestWords : null,
          isMemoryTestRelevant ? memoryTestResponse : null
      );
      setReport(generatedReport);
      
      const { saveProfileData } = userSettings;
      const newProfileData: UserProfileData = {};
      if (saveProfileData.sexAndAge) {
          newProfileData.sex = patientContext.sex;
          newProfileData.age = patientContext.age.toString();
      }
      if (saveProfileData.weight && patientContext.weight) newProfileData.weight = patientContext.weight;
      if (saveProfileData.location && patientContext.location) newProfileData.location = patientContext.location;
      if (saveProfileData.existingConditions && patientContext.existingConditions) newProfileData.existingConditions = patientContext.existingConditions;
      if (saveProfileData.currentMedications && patientContext.currentMedications) newProfileData.currentMedications = patientContext.currentMedications;
      if (saveProfileData.allergies && patientContext.allergies) newProfileData.allergies = patientContext.allergies;
      if (saveProfileData.recentTravels && patientContext.recentTravels) newProfileData.recentTravels = patientContext.recentTravels;
      
      if(Object.keys(newProfileData).length > 0) {
        setUserProfile(newProfileData);
        localStorage.setItem('medai-user-profile', JSON.stringify(newProfileData));
      }
      
      setIsLoadComplete(true);
      setOnLoadContinue(() => () => {
          setAppState(AppState.SYMPTOM_MONITORING);
          setOnLoadContinue(null);
      });
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, speechDyspneaResult, isMemoryTestRelevant, memoryTestWords, memoryTestResponse, handleError, userSettings]);

  const handleDirectDiagnosisSubmit = useCallback(async (diagnosis: string) => {
    setIsDirectFlow(true);
    setIsLoadComplete(false);
    setOnLoadContinue(null);
    setAppState(AppState.GENERATING_DIRECT_REPORT);
    try {
      const generatedReport = await generateDirectReport(diagnosis);
      setReport(generatedReport);
      setIsLoadComplete(true);
      setOnLoadContinue(() => () => {
          setAppState(AppState.REPORT);
          setOnLoadContinue(null);
          setIsDirectFlow(true); // Ensure it's set again after state change
      });
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Une erreur inconnue est survenue lors de la génération du rapport direct.");
      setIsDirectFlow(false); // reset on error
    }
  }, [handleError]);
  
  const handleGoToReport = useCallback(() => {
    setAppState(AppState.REPORT);
  }, []);
  
  const getSystemInstructionForEmpathy = (level: EmpathyLevel, report: ReportData): string => {
      const possibleIssuesText = report.possibleIssues.map(p => `${p.name} (${p.confidence}% de confiance)`).join(', ');
      const baseIntro = `Tu es un assistant de soutien nommé Aura. Le diagnostic préliminaire de l'utilisateur est: Problèmes possibles: ${possibleIssuesText}; Gravité estimée: ${report.severity}.`;

      switch (level) {
        case 'Direct':
          return `${baseIntro} Sois direct, concis et factuel. N'utilise pas de phrases empathiques superflues. Va droit au but.`;
        case 'Normal':
          return `${baseIntro} Adopte un ton neutre et informatif. Sois clair et rassurant sans être excessivement émotionnel.`;
        case 'Très Empathique':
          return `${baseIntro} Sois très chaleureux, réconfortant et utilise un langage très doux et empathique. Valide les émotions de l'utilisateur et montre une grande compassion.`;
        case 'Empathique':
        default:
          return `${baseIntro} Adopte un ton chaleureux et empathique. Montre que tu comprends les inquiétudes de l'utilisateur. Utilise des phrases de soutien.`;
      }
    };
    
    const handleGoToAppointmentPrep = useCallback(async () => {
        if (!report) return;
        setNavigationSource('report');
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
            handleError(err instanceof Error ? err.message : "Erreur lors de la génération de la préparation de rendez-vous.");
        }
    }, [report, handleError]);

    const handleGoToScenarioSimulator = useCallback(async () => {
        if (!report) return;
        setNavigationSource('report');
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
    }, [report, handleError]);

    const handleStartSupportChat = useCallback(() => {
        if (!report) return;
        setNavigationSource('report');
        const ai = new GoogleGenAI({ apiKey: userSettings.apiKey || process.env.API_KEY! });
        const systemInstruction = getSystemInstructionForEmpathy(empathyLevel, report);
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        setChatSession(newChat);
        setChatHistory([]); // Start with a clean history for each session
        setAppState(AppState.PSYCHOLOGICAL_SUPPORT);
    }, [report, empathyLevel, userSettings.apiKey]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (!chatSession) return;

        const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
        setChatHistory(updatedHistory);
        setIsChatResponding(true);

        try {
            let responseText = '';
            const responseStream = await chatSession.sendMessageStream({ message });
            for await (const chunk of responseStream) {
                responseText += chunk.text;
                setChatHistory([...updatedHistory, { role: 'model', text: responseText }]);
            }
        } catch (err) {
            console.error("Chat error:", err);
            setChatHistory([...updatedHistory, { role: 'model', text: "Désolé, une erreur est survenue. Veuillez réessayer." }]);
        } finally {
            setIsChatResponding(false);
        }
    }, [chatSession, chatHistory]);

    const handleStartTracking = useCallback(() => {
        if (!report) return;
        
        let suggested = symptomIntensities.map(s => s.name);
        if (mainSymptom && !suggested.includes(mainSymptom)) {
            suggested.push(mainSymptom);
        }
        if (suggested.length === 0) {
            suggested = [...extractedSymptoms];
        }
        
        const uniqueSuggested = [...new Set(suggested)];

        setSymptomsToTrackSetup(uniqueSuggested);
        setNavigationSource('report');
        setAppState(AppState.SYMPTOM_JOURNAL_SETUP);
    }, [report, extractedSymptoms, symptomIntensities, mainSymptom]);

    const handleSymptomJournalSetupSubmit = useCallback((symptomsToTrack: string[]) => {
        const newJournalData: TrackedSymptom[] = symptomsToTrack.map(name => ({
            name,
            logs: [],
        }));
        setJournalData(newJournalData);
        setAppState(AppState.SYMPTOM_JOURNAL);
    }, []);

    const handleAddJournalEntry = useCallback((symptomName: string, entry: Omit<SymptomLogEntry, 'date'>) => {
        const today = new Date().toISOString().split('T')[0];
        setJournalData(prevData => {
            return prevData.map(symptom => {
                if (symptom.name === symptomName) {
                    const existingLogIndex = symptom.logs.findIndex(log => log.date === today);
                    const newLog = { date: today, ...entry };
                    let newLogs;
                    if (existingLogIndex > -1) {
                        newLogs = [...symptom.logs];
                        newLogs[existingLogIndex] = newLog;
                    } else {
                        newLogs = [...symptom.logs, newLog];
                    }
                    return { ...symptom, logs: newLogs.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) };
                }
                return symptom;
            });
        });
    }, []);

    const handleAnalyzeTrends = useCallback(async () => {
        if (journalData.length === 0) return;
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
            setAppState(AppState.SYMPTOM_JOURNAL);
        }
    }, [journalData, handleError]);

    const handleAddMedication = useCallback(async (medication: Medication) => {
        setIsLoadComplete(false);
        setOnLoadContinue(null);
        setAppState(AppState.GENERATING_SIDE_EFFECTS);
        try {
            const sideEffectInfo = await generateMedicationSideEffects(medication.name);
            const medicationWithInfo = { ...medication, sideEffectInfo, trackedSideEffects: [] };
            setPillboxData(prev => [...prev, medicationWithInfo]);
            
            setIsLoadComplete(true);
            setOnLoadContinue(() => () => {
                setActiveMedicationId(medicationWithInfo.id);
                setAppState(AppState.MEDICATION_DETAIL);
                setOnLoadContinue(null);
            });
        } catch (err) {
            handleError(err instanceof Error ? err.message : "Erreur lors de la recherche des effets secondaires.");
            setPillboxData(prev => [...prev, medication]);
            setAppState(AppState.PILLBOX);
        }
    }, [handleError]);

    const handleAddPrescriptionToPillbox = useCallback(async (medicationNames: string[]) => {
        const currentMedNames = new Set(pillboxData.map(m => m.name.toLowerCase()));
        const filteredNewMedNames = medicationNames.filter(name => !currentMedNames.has(name.toLowerCase()));

        if (filteredNewMedNames.length === 0) return;

        const newMedicationsPromises = filteredNewMedNames.map(async (name) => {
            const baseMedication: Medication = {
                id: Date.now().toString() + name.replace(/\s/g, ''),
                name: name,
                frequency: 'Au besoin',
                durationDays: null,
                startDate: new Date().toISOString().split('T')[0],
                trackedSideEffects: [],
            };
            try {
                const sideEffectInfo = await generateMedicationSideEffects(name);
                return { ...baseMedication, sideEffectInfo };
            } catch (err) {
                console.error(`Failed to fetch side effects for ${name}:`, err);
                return baseMedication;
            }
        });

        const newMedications = await Promise.all(newMedicationsPromises);
        setPillboxData(prev => [...prev, ...newMedications]);
    }, [pillboxData]);

    const handleDeleteMedication = useCallback((medicationId: string) => {
        setPillboxData(prev => prev.filter(m => m.id !== medicationId));
    }, []);

    const handleUpdateSideEffectNotes = useCallback((medicationId: string, notes: string) => {
        const today = new Date().toISOString().split('T')[0];
        setPillboxData(prevData => prevData.map(med => {
            if (med.id === medicationId) {
                const newLog = { date: today, notes };
                const existingLogIndex = med.trackedSideEffects?.findIndex(log => log.date === today) ?? -1;
                
                let newLogs;
                if (existingLogIndex > -1) {
                    newLogs = [...(med.trackedSideEffects || [])];
                    if (notes.trim() === '') { // If notes are cleared, remove the log for today
                        newLogs.splice(existingLogIndex, 1);
                    } else {
                        newLogs[existingLogIndex] = newLog;
                    }
                } else if (notes.trim() !== '') {
                    newLogs = [...(med.trackedSideEffects || []), newLog];
                } else {
                    newLogs = med.trackedSideEffects || [];
                }
                return { ...med, trackedSideEffects: newLogs.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) };
            }
            return med;
        }));
    }, []);

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

    const handleBackFromTool = () => {
        if (navigationSource === 'report') {
            setAppState(AppState.REPORT);
        } else {
            handleReset();
        }
        setNavigationSource(null);
    };

    const renderContent = (): React.ReactNode => {
    switch (appState) {
      case AppState.LANDING:
        return <LandingScreen
          onStartDiagnosis={handleNavigateToPreDiagnosis}
          onEmergency={handleNavigateToEmergencyGuide}
          onStartPreventionPlan={handleNavigateToPreventionPlan}
          onDirectDiagnosisSubmit={handleDirectDiagnosisSubmit}
          onShowHowItWorks={handleNavigateToHowItWorks}
          onShowSettings={handleNavigateToSettings}
          hasJournalData={journalData.length > 0}
          onGoToJournal={() => { setNavigationSource('landing'); setAppState(AppState.SYMPTOM_JOURNAL); }}
          onGoToPillbox={() => { setNavigationSource('landing'); setAppState(AppState.PILLBOX); }}
          onStartTraining={handleNavigateToTraining}
        />;
      case AppState.HOW_IT_WORKS:
        return <HowItWorksScreen onBackToLanding={handleReset} />;
      case AppState.EMERGENCY_GUIDE:
        return <EmergencyGuideScreen onBack={handleReset} />;
      case AppState.SETTINGS:
        return <SettingsScreen
          onBackToLanding={handleReset}
          settings={userSettings}
          onSettingsChange={handleSettingsChange}
          journalData={journalData}
          pillboxData={pillboxData}
          trainingProgress={trainingProgress}
          onClearJournal={clearJournal}
          onClearPillbox={clearPillbox}
          onClearProfile={clearProfile}
          onClearTrainingProgress={clearTrainingProgress}
          onShowDataPrivacy={handleNavigateToDataPrivacy}
        />;
      case AppState.DATA_PRIVACY_EXPLANATION:
        return <DataPrivacyScreen onBack={handleNavigateToSettings} />;
      case AppState.PRE_DIAGNOSIS:
        return <PreDiagnosisScreen onContinue={handlePreDiagnosisContinue} />;
      case AppState.INITIAL:
        return <InitialScreen onStart={handleStartDiagnosis} />;
      case AppState.CONTEXT_GATHERING:
        return <ContextScreen onSubmit={handleContextSubmit} savedProfile={userProfile} />;
      case AppState.PROCESSING_CONTEXT:
        return <Loader text="Analyse du contexte..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.SYMPTOM_INTENSITY:
        return <SymptomIntensityScreen symptoms={extractedSymptoms} onSubmit={handleIntensitySubmit} onSkip={handleSkipIntensityScreen} />;
      case AppState.SYMPTOM_CHARACTERISTICS:
        return <SymptomCharacteristicsScreen onSubmit={handleCharacteristicsSubmit} onSkip={() => handleCharacteristicsSubmit({})} />;
      case AppState.PRE_QUESTIONNAIRE:
        return <PreQuestionnaireScreen onSubmit={handlePreQuestionnaireSubmit} />;
      case AppState.GENERATING_MEMORY_TEST_WORDS:
        return <Loader text="Génération des mots pour le test de mémoire..." isComplete={false} />;
      case AppState.ANNOUNCE_MEMORY_TEST:
        return <AnnounceMemoryTestScreen words={memoryTestWords} onContinue={handleMemoryTestAnnounced} />;
      case AppState.GENERATING_QUESTIONS:
        return <Loader text="Génération du questionnaire personnalisé..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.QUESTIONNAIRE:
        return <QuestionnaireScreen questions={questions} onSubmit={handleQuestionnaireComplete} />;
      case AppState.MEMORY_TEST_INPUT:
        return <MemoryTestInputScreen onSubmit={handleMemoryTestInputComplete} />;
      case AppState.GENERATING_EXCLUSION_SYMPTOMS:
        return <Loader text="Préparation du filtre d'exclusion..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.EXCLUSION_FILTER:
        return <ExclusionFilterScreen symptoms={potentialExclusionSymptoms} onSubmit={handleExclusionFilterComplete} onSkip={() => handleExclusionFilterComplete([])} />;
      case AppState.GENERATING_SELF_EXAM_PROMPT:
        return <Loader text="Analyse pour un auto-examen pertinent..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.SELF_EXAM:
        return selfExamPrompt ? <SelfExamScreen prompt={selfExamPrompt} onSubmit={handleSelfExamComplete} onSkip={() => handleSelfExamComplete('')} /> : null;
      case AppState.GENERATING_NEURO_TESTS:
        return <Loader text="Analyse de la pertinence des tests neurologiques..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.NEURO_TESTS:
        return <NeuroTestScreen questions={neuroTestQuestions} onSubmit={handleNeuroTestComplete} onSkip={() => handleNeuroTestComplete([])} />;
      case AppState.GENERATING_CRT_PROMPT:
        return <Loader text="Analyse de la pertinence du test TRC..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.CRT_TEST:
        return <CRTScreen onSubmit={handleCRTTestComplete} onSkip={() => handleCRTTestComplete(null)} />;
      case AppState.GENERATING_RESPIRATORY_RATE_PROMPT:
        return <Loader text="Analyse de la pertinence de la mesure respiratoire..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.RESPIRATORY_RATE_TEST:
        return <RespiratoryRateScreen onSubmit={handleRespiratoryRateTestComplete} />;
      case AppState.GENERATING_STABILITY_TEST_PROMPT:
        return <Loader text="Analyse de la pertinence du test de stabilité..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.STABILITY_TEST:
        return <StabilityTestScreen onSubmit={handleStabilityTestComplete} onSkip={() => handleStabilityTestComplete(null)} />;
      case AppState.GENERATING_SPEECH_DYSPNEA_PROMPT:
        return <Loader text="Analyse de la pertinence du test d'essoufflement..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.SPEECH_DYSPNEA_TEST:
        return <SpeechDyspneaScreen onSubmit={handleSpeechDyspneaTestComplete} />;
      case AppState.GENERATING_PHOTO_PROMPT:
        return <Loader text="Analyse de la pertinence d'une photo..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.PHOTO_UPLOAD:
        return <PhotoUploadScreen onComplete={handlePhotoSubmit} photoPrompt={photoPrompt} />;
      case AppState.GENERATING_REPORT:
        return <Loader text="L'IA analyse vos réponses et génère le rapport..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.GENERATING_DIRECT_REPORT:
        return <Loader text="L'IA génère le rapport informatif..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.SYMPTOM_MONITORING:
        return report ? <SymptomMonitoringScreen instructions={report.monitoringInstructions} onContinue={handleGoToReport} /> : null;
      case AppState.REPORT:
        return report ? <ReportScreen 
          report={report} 
          patientContext={patientContext}
          onReset={handleReset} 
          onStartSupportChat={handleStartSupportChat}
          onGoToSummary={() => setAppState(AppState.DIAGNOSTIC_SUMMARY)}
          onGoToAppointmentPrep={handleGoToAppointmentPrep}
          onGoToScenarioSimulator={handleGoToScenarioSimulator}
          onStartTracking={handleStartTracking}
          onGoToPillbox={() => { setNavigationSource('report'); setAppState(AppState.PILLBOX); }}
          onAddPrescriptionToPillbox={handleAddPrescriptionToPillbox}
          isDirectFlow={isDirectFlow}
          /> : null;
      case AppState.DIAGNOSTIC_SUMMARY:
        return (patientContext && report) ? <DiagnosticSummaryScreen
          onBackToReport={() => setAppState(AppState.REPORT)}
          patientContext={patientContext}
          initialSymptoms={initialSymptoms}
          mainSymptom={mainSymptom}
          symptomIntensities={symptomIntensities}
          overallDiscomfort={overallDiscomfort}
          symptomCharacteristics={symptomCharacteristics}
          preQuestionnaireAnswers={preQuestionnaireAnswers}
          answers={answers}
          excludedSymptoms={excludedSymptoms}
          selfExamResult={selfExamResult}
          neuroTestAnswers={neuroTestAnswers}
          crtResult={crtResult}
          respiratoryRate={respiratoryRate}
          stabilityTestResult={stabilityTestResult}
          speechDyspneaResult={speechDyspneaResult}
          photoBase64={photoBase64}
          report={report}
          memoryTestWords={isMemoryTestRelevant ? memoryTestWords : null}
          memoryTestResponse={isMemoryTestRelevant ? memoryTestResponse : null}
        /> : null;
      case AppState.PSYCHOLOGICAL_SUPPORT:
        return <ChatScreen
          history={chatHistory}
          onSendMessage={handleSendMessage}
          isResponding={isChatResponding}
          onBackToReport={() => setAppState(AppState.REPORT)}
          empathyLevel={empathyLevel}
          onEmpathyLevelChange={setEmpathyLevel}
        />;
      case AppState.GENERATING_APPOINTMENT_PREP:
        return <Loader text="Génération de l'aide à la préparation..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.MEDICAL_APPOINTMENT_PREP:
        return appointmentPrepData ? <MedicalAppointmentPrepScreen prepData={appointmentPrepData} onBackToReport={() => setAppState(AppState.REPORT)} onGoToSummary={() => setAppState(AppState.DIAGNOSTIC_SUMMARY)} /> : null;
      case AppState.GENERATING_SCENARIOS:
        return <Loader text="Génération des scénarios d'évolution..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.SCENARIO_SIMULATOR:
        return scenarioData ? <ScenarioSimulatorScreen scenarios={scenarioData.scenarios} onBackToReport={() => setAppState(AppState.REPORT)} /> : null;
      case AppState.PREVENTION_PLAN_PROFILE:
        return <PreventionProfileScreen onSubmit={handlePreventionProfileSubmit} onBackToLanding={handleReset} />;
      case AppState.GENERATING_PREVENTION_PLAN:
        return <Loader text="Génération de votre plan de prévention personnalisé..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.PREVENTION_PLAN_REPORT:
        return (preventionPlan && riskAnalysis) ? <PreventionPlanReportScreen plan={preventionPlan} riskAnalysis={riskAnalysis} onReset={handleReset} /> : null;
      case AppState.SYMPTOM_JOURNAL_SETUP:
        return <SymptomJournalSetupScreen suggestedSymptoms={symptomsToTrackSetup} onSubmit={handleSymptomJournalSetupSubmit} onBackToReport={() => setAppState(AppState.REPORT)} />;
      case AppState.ANALYZING_SYMPTOM_TRENDS:
          return <Loader text="L'IA analyse les tendances de vos symptômes..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.SYMPTOM_JOURNAL:
          return <SymptomJournalScreen 
              journalData={journalData} 
              onAddEntry={handleAddJournalEntry}
              onBack={handleBackFromTool}
              onAnalyzeTrends={handleAnalyzeTrends}
              trendAnalysis={trendAnalysis}
              onClearTrendAnalysis={() => setTrendAnalysis(null)}
          />;
      case AppState.PILLBOX:
        return <PillboxScreen 
            pillboxData={pillboxData} 
            onNavigateToAdd={() => setAppState(AppState.PILLBOX_ADD_MEDICATION)} 
            onNavigateToDetail={(id) => { setActiveMedicationId(id); setAppState(AppState.MEDICATION_DETAIL); }} 
            onBack={handleBackFromTool} 
            onDeleteMedication={handleDeleteMedication}
        />;
      case AppState.PILLBOX_ADD_MEDICATION:
        return <AddMedicationScreen onAddMedication={handleAddMedication} onBack={() => setAppState(AppState.PILLBOX)} />;
      case AppState.GENERATING_SIDE_EFFECTS:
        return <Loader text="Recherche des effets secondaires..." isComplete={isLoadComplete} onContinue={onLoadContinue || undefined} />;
      case AppState.MEDICATION_DETAIL:
        const activeMed = pillboxData.find(m => m.id === activeMedicationId);
        return activeMed ? <MedicationDetailScreen medication={activeMed} onUpdateSideEffectNotes={handleUpdateSideEffectNotes} onBack={() => setAppState(AppState.PILLBOX)} /> : null;
      case AppState.TRAINING:
        return <TrainingScreen onBackToLanding={handleReset} onNavigateToTrainingProtect={handleNavigateToTrainingProtect} onNavigateToTrainingAlert={handleNavigateToTrainingAlert} trainingProgress={trainingProgress}/>;
      case AppState.TRAINING_PROTECT:
        return <ProtectScreen onComplete={handleCompleteProtectSection} onBack={handleNavigateToTraining} />;
      case AppState.TRAINING_ALERT:
        return <AlertScreen onComplete={handleCompleteAlertSection} onBack={handleNavigateToTraining} />;
      case AppState.ERROR:
        return <ErrorScreen message={error || "Une erreur inconnue est survenue."} onRetry={handleReset} />;
      default:
        return <LandingScreen
          onStartDiagnosis={handleNavigateToPreDiagnosis}
          onEmergency={handleNavigateToEmergencyGuide}
          onStartPreventionPlan={handleNavigateToPreventionPlan}
          onDirectDiagnosisSubmit={handleDirectDiagnosisSubmit}
          onShowHowItWorks={handleNavigateToHowItWorks}
          onShowSettings={handleNavigateToSettings}
          hasJournalData={journalData.length > 0}
          onGoToJournal={() => { setNavigationSource('landing'); setAppState(AppState.SYMPTOM_JOURNAL); }}
          onGoToPillbox={() => { setNavigationSource('landing'); setAppState(AppState.PILLBOX); }}
          onStartTraining={handleNavigateToTraining}
        />;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex items-center justify-center font-sans p-4">
      {renderContent()}
    </div>
  );
};

export default App;