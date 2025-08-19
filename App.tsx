

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
import CrosswordScreen from './components/screens/CrosswordScreen';

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
  
  const handleNavigateToCrossword = useCallback(() => {
    setAppState(AppState.CROSSWORD);
  }, []);

  const handleCompleteProtectSection = useCallback(() => {
    setTrainingProgress(prev => ({ ...prev, protect: true }));
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
    setAppState(AppState.GENERATING_QUESTIONS);
    try {
      const generatedQuestions = await generateQuestions(initialSymptoms, context, intensities, discomfort, mainSymptom, characteristics, preAnswers);
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setAppState(AppState.QUESTIONNAIRE);
      } else {
        throw new Error("Le questionnaire reçu est vide.");
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    }
  }, [initialSymptoms, handleError]);

  const handleContextSubmit = useCallback(async (context: PatientContext) => {
    setPatientContext(context);

    // Determine if memory test is relevant at this early stage
    const relevant = await shouldTriggerMemoryTest(initialSymptoms, context);
    setIsMemoryTestRelevant(relevant);

    setAppState(AppState.GENERATING_QUESTIONS); // Use loader for symptom extraction
    try {
      const symptoms = await extractSymptoms(initialSymptoms);
      if (symptoms && symptoms.length > 0) {
        setExtractedSymptoms(symptoms);
        setAppState(AppState.SYMPTOM_INTENSITY);
      } else {
        // No symptoms extracted, skip intensity and characteristics screens
        setSymptomIntensities([]);
        setOverallDiscomfort(null);
        setMainSymptom(null);
        setSymptomCharacteristics(null);
        setAppState(AppState.PRE_QUESTIONNAIRE);
      }
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Erreur lors de l'extraction des symptômes.");
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
            // Skip test on error and go to questions
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

  const proceedToExclusionFilter = useCallback(async (currentAnswers: Answer[]) => {
    setAppState(AppState.GENERATING_EXCLUSION_SYMPTOMS);
    if (!patientContext) {
        handleError("Les informations contextuelles du patient sont manquantes.");
        return;
    }
    try {
        const symptoms = await generateExclusionSymptoms(initialSymptoms, patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, currentAnswers);
        if (symptoms && symptoms.length > 0) {
            setPotentialExclusionSymptoms(symptoms);
            setAppState(AppState.EXCLUSION_FILTER);
        } else {
            setExcludedSymptoms([]);
            await handleExclusionFilterComplete([]);
        }
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Erreur lors de la génération des symptômes d'exclusion.");
    }
  }, [initialSymptoms, patientContext, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, handleError]);
  
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

  const generateAndSetPhotoPrompt = useCallback(async (currentExcludedSymptoms: string[], currentSelfExamResult: string | null, currentNeuroTestAnswers: NeuroTest[], currentCrtResult: CapillaryRefillTimeResult | null, currentRespiratoryRate: number | null, currentStabilityResult: StabilityTestResult | null, currentSpeechDyspneaResult: SpeechDyspneaResult | null) => {
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
          setAppState(AppState.PHOTO_UPLOAD);
      } catch (err) {
          console.error("Failed to generate photo prompt, continuing...", err);
          setPhotoPrompt(null);
          setAppState(AppState.PHOTO_UPLOAD);
      }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, handleError]);

  const handleSpeechDyspneaTestComplete = useCallback(async (result: SpeechDyspneaResult | null) => {
    setSpeechDyspneaResult(result);
    await generateAndSetPhotoPrompt(excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, result);
  }, [excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, generateAndSetPhotoPrompt]);

  const checkAndStartSpeechDyspneaTest = useCallback(async (currentStabilityResult: StabilityTestResult | null) => {
    setAppState(AppState.GENERATING_SPEECH_DYSPNEA_PROMPT);
    if (!patientContext) {
        handleError("Les informations contextuelles du patient sont manquantes.");
        return;
    }
    try {
        const shouldRequest = await shouldRequestSpeechDyspneaTest(
            initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom,
            symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult,
            neuroTestAnswers, crtResult, respiratoryRate, currentStabilityResult
        );

        if (shouldRequest) {
            setAppState(AppState.SPEECH_DYSPNEA_TEST);
        } else {
            setSpeechDyspneaResult(null);
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
    setAppState(AppState.GENERATING_STABILITY_TEST_PROMPT);
    if (!patientContext) {
        handleError("Les informations contextuelles du patient sont manquantes.");
        return;
    }
    try {
        const shouldRequest = await shouldRequestStabilityTest(
            initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom,
            symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult,
            neuroTestAnswers, crtResult, currentRespiratoryRate
        );

        if (shouldRequest) {
            setAppState(AppState.STABILITY_TEST);
        } else {
            setStabilityTestResult(null);
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
    setAppState(AppState.GENERATING_RESPIRATORY_RATE_PROMPT);
    if (!patientContext) {
        handleError("Les informations contextuelles du patient sont manquantes.");
        return;
    }
    try {
        const shouldRequest = await shouldRequestRespiratoryRate(
            initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom,
            symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult,
            currentNeuroTestAnswers, currentCrtResult
        );

        if (shouldRequest) {
            setAppState(AppState.RESPIRATORY_RATE_TEST);
        } else {
            setRespiratoryRate(null);
            await checkAndStartStabilityTest(null);
        }
    } catch (err) {
        console.error("Failed to check for respiratory rate, skipping.", err);
        await checkAndStartStabilityTest(null);
    }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, handleError, checkAndStartStabilityTest]);
  
  const handleCRTTestComplete = useCallback(async (result: CapillaryRefillTimeResult | null) => {
      setCrtResult(result);
      await checkAndStartRespiratoryTest(neuroTestAnswers, result);
  }, [neuroTestAnswers, checkAndStartRespiratoryTest]);

  const checkAndStartCRTTest = useCallback(async (currentNeuroTestAnswers: NeuroTest[]) => {
      setAppState(AppState.GENERATING_CRT_PROMPT);
      if (!patientContext) {
          handleError("Les informations contextuelles du patient sont manquantes.");
          return;
      }
      try {
          const shouldRequest = await shouldRequestCRT(
              initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom,
              symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult,
              currentNeuroTestAnswers
          );
          if (shouldRequest) {
              setAppState(AppState.CRT_TEST);
          } else {
              setCrtResult(null);
              await checkAndStartRespiratoryTest(currentNeuroTestAnswers, null);
          }
      } catch (err) {
          console.error("Failed to check for CRT test, skipping.", err);
          await checkAndStartRespiratoryTest(currentNeuroTestAnswers, null);
      }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, handleError, checkAndStartRespiratoryTest]);

  const handleNeuroTestComplete = useCallback(async (completedNeuroAnswers: NeuroTest[]) => {
      setNeuroTestAnswers(completedNeuroAnswers);
      await checkAndStartCRTTest(completedNeuroAnswers);
  }, [checkAndStartCRTTest]);

  const generateAndSetNeuroTest = useCallback(async (currentSelfExamResult: string | null) => {
      setAppState(AppState.GENERATING_NEURO_TESTS);
      if (!patientContext) {
          handleError("Les informations contextuelles du patient sont manquantes.");
          return;
      }

      try {
          const questions = await generateNeuroTests(
              initialSymptoms,
              patientContext,
              answers,
              symptomIntensities,
              overallDiscomfort,
              mainSymptom,
              symptomCharacteristics,
              preQuestionnaireAnswers,
              excludedSymptoms,
              currentSelfExamResult
          );
          if (questions && questions.length > 0) {
              setNeuroTestQuestions(questions);
              setAppState(AppState.NEURO_TESTS);
          } else {
              setNeuroTestQuestions([]);
              setNeuroTestAnswers([]);
              await checkAndStartCRTTest([]);
          }
      } catch (err) {
          console.error("Failed to generate neuro tests, skipping.", err);
          await checkAndStartCRTTest([]);
      }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, handleError, checkAndStartCRTTest]);


  const handleSelfExamComplete = useCallback(async (result: string) => {
      setSelfExamResult(result);
      await generateAndSetNeuroTest(result);
  }, [generateAndSetNeuroTest]);

  const handleExclusionFilterComplete = useCallback(async (selectedSymptoms: string[]) => {
      setExcludedSymptoms(selectedSymptoms);
      setAppState(AppState.GENERATING_SELF_EXAM_PROMPT);

      if (!patientContext) {
          handleError("Les informations contextuelles du patient sont manquantes.");
          return;
      }

      try {
          const prompt = await generateSelfExamPrompt(
              initialSymptoms,
              patientContext,
              answers,
              symptomIntensities,
              overallDiscomfort,
              mainSymptom,
              symptomCharacteristics,
              preQuestionnaireAnswers,
              selectedSymptoms
          );
          if (prompt) {
              setSelfExamPrompt(prompt);
              setAppState(AppState.SELF_EXAM);
          } else {
              // Skip self-exam
              setSelfExamPrompt(null);
              setSelfExamResult(null);
              await generateAndSetNeuroTest(null);
          }
      } catch (err) {
          console.error("Failed to generate self-exam prompt, skipping.", err);
          await generateAndSetNeuroTest(null);
      }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, handleError, generateAndSetNeuroTest]);
  
  const handlePhotoSubmit = useCallback(async (imageBase64: string | null) => {
    setPhotoBase64(imageBase64);
    if (!patientContext) {
        handleError("Les informations contextuelles du patient sont manquantes.");
        return;
    }
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
      
      // After report generation, save context to profile if settings allow
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
      
      setAppState(AppState.SYMPTOM_MONITORING);
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
    }
  }, [initialSymptoms, patientContext, answers, symptomIntensities, overallDiscomfort, mainSymptom, symptomCharacteristics, preQuestionnaireAnswers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, speechDyspneaResult, isMemoryTestRelevant, memoryTestWords, memoryTestResponse, handleError, userSettings]);

  const handleDirectDiagnosisSubmit = useCallback(async (diagnosis: string) => {
    setIsDirectFlow(true);
    setAppState(AppState.GENERATING_DIRECT_REPORT);
    try {
      const generatedReport = await generateDirectReport(diagnosis);
      setReport(generatedReport);
      setAppState(AppState.REPORT);
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
      const baseIntro = `Tu es un assistant de soutien nommé Aura. Le diagnostic préliminaire de l'utilisateur est: Problèmes possibles: ${possibleIssuesText}; Gravité estimée: ${report.severity}. Ton rôle est de discuter avec l'utilisateur de ce rapport. NE PAS donner de conseils médicaux. Tu n'es pas un médecin. Commence la conversation en te présentant et en demandant à l'utilisateur comment il se sent par rapport à ce bilan.`;

      switch (level) {
          case 'Direct':
              return `Tu es un assistant IA direct et factuel. Va droit au but. Valide les informations sans fioritures émotionnelles. ${baseIntro}`;
          case 'Normal':
              return `Tu es un assistant IA standard, avec un ton neutre et serviable. ${baseIntro}`;
          case 'Empathique':
              return `Tu es un assistant de soutien psychologique nommé Aura. Tu es empathique, gentil et rassurant. Valide les sentiments de l'utilisateur. Utilise des phrases comme "Je comprends que cela puisse être difficile", "C'est normal de se sentir ainsi". ${baseIntro}`;
          case 'Très Empathique':
              return `Tu es un assistant de soutien psychologique nommé Aura. Tu es extrêmement empathique, patient, chaleureux et utilise un ton très doux. Sois proactif en offrant du réconfort et en normalisant les émotions de l'utilisateur. ${baseIntro}`;
      }
  }

  const startOrRestartChatSession = useCallback(async (level: EmpathyLevel) => {
    if (!report) {
      handleError("Aucun rapport disponible pour démarrer le chat.");
      return;
    }
    
    setAppState(AppState.PSYCHOLOGICAL_SUPPORT);
    setIsChatResponding(true);
    setChatHistory([]); // Clear history for the new session

    const ai = new GoogleGenAI({ apiKey: userSettings.apiKey || process.env.API_KEY! });
    const systemInstruction = getSystemInstructionForEmpathy(level, report);
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
    });
    setChatSession(chat);

    const personalityMessage: ChatMessage = {
      role: 'model',
      text: `(Mon ton est maintenant réglé sur : ${level}. Je suis là pour discuter avec vous.)`
    };

    try {
        const responseStream = await chat.sendMessageStream({ message: "Bonjour" });
        let firstResponse = "";
        setChatHistory([personalityMessage, { role: 'model', text: '' }]);

        for await (const chunk of responseStream) {
            firstResponse += chunk.text;
            setChatHistory(prev => {
                const updated = [...prev];
                if (updated.length > 1) {
                    updated[updated.length - 1].text = firstResponse;
                }
                return updated;
            });
        }
    } catch (err) {
        handleError("Impossible de démarrer la session de chat.");
    } finally {
        setIsChatResponding(false);
    }
  }, [report, handleError, userSettings.apiKey]);
  
  const handleEmpathyLevelChange = useCallback(async (level: EmpathyLevel) => {
      setEmpathyLevel(level);
      await startOrRestartChatSession(level);
  }, [startOrRestartChatSession]);

  const handleStartSupportChat = useCallback(() => {
      startOrRestartChatSession(empathyLevel);
  }, [startOrRestartChatSession, empathyLevel]);


  const handleSendChatMessage = useCallback(async (message: string) => {
    if (!chatSession || isChatResponding) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(newHistory);
    setIsChatResponding(true);

    try {
      const responseStream = await chatSession.sendMessageStream({ message });
      let fullResponse = "";
      setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        fullResponse += chunk.text;
        setChatHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullResponse;
          return updated;
        });
      }
    } catch (err) {
      const errorHistory: ChatMessage[] = [...newHistory, { role: 'model', text: "Désolé, une erreur est survenue. Veuillez réessayer." }];
      setChatHistory(errorHistory);
    } finally {
      setIsChatResponding(false);
    }
  }, [chatSession, chatHistory, isChatResponding]);
  
  const handleGoToSummary = useCallback(() => {
    setAppState(AppState.DIAGNOSTIC_SUMMARY);
  }, []);

  const handleBackToReport = useCallback(() => {
    setAppState(AppState.REPORT);
  }, []);

  const handleGoToAppointmentPrep = useCallback(async () => {
    if (!report) {
        handleError("Le rapport de diagnostic est nécessaire pour préparer la consultation.");
        return;
    }
    setAppState(AppState.GENERATING_APPOINTMENT_PREP);
    try {
        const prepData = await generateAppointmentPrepData(report);
        setAppointmentPrepData(prepData);
        setAppState(AppState.MEDICAL_APPOINTMENT_PREP);
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Impossible de générer l'aide à la préparation.");
    }
  }, [report, handleError]);

  const handleGoToScenarioSimulator = useCallback(async () => {
    if (!report) {
        handleError("Le rapport de diagnostic est nécessaire pour lancer le simulateur.");
        return;
    }
    setAppState(AppState.GENERATING_SCENARIOS);
    try {
        const scenarios = await generateScenarios(report);
        setScenarioData(scenarios);
        setAppState(AppState.SCENARIO_SIMULATOR);
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Impossible de générer le simulateur de scénarios.");
    }
  }, [report, handleError]);

  const handlePreventionProfileSubmit = useCallback(async (profile: PreventionProfile) => {
    setPreventionProfile(profile);
    setAppState(AppState.GENERATING_PREVENTION_PLAN);
    try {
        const [plan, risks] = await Promise.all([
            generatePreventionPlan(profile),
            generateRiskAnalysis(profile)
        ]);
        setPreventionPlan(plan);
        setRiskAnalysis(risks);
        setAppState(AppState.PREVENTION_PLAN_REPORT);
    } catch (err) {
        handleError(err instanceof Error ? err.message : "Impossible de générer le plan de prévention.");
    }
  }, [handleError]);


  const handleStartTracking = useCallback(() => {
    const symptomsToSuggest = new Set<string>();
    
    if (mainSymptom) {
        symptomsToSuggest.add(mainSymptom);
    }
    symptomIntensities.forEach(s => symptomsToSuggest.add(s.name));
    extractedSymptoms.forEach(s => symptomsToSuggest.add(s));

    setSymptomsToTrackSetup(Array.from(symptomsToSuggest));
    setAppState(AppState.SYMPTOM_JOURNAL_SETUP);
  }, [mainSymptom, symptomIntensities, extractedSymptoms]);

  const handleJournalSetupComplete = useCallback((symptomsToTrack: string[]) => {
    setJournalData(prevData => {
      const newData = [...prevData];
      symptomsToTrack.forEach(symptomName => {
        if (!newData.some(s => s.name === symptomName)) {
          newData.push({ name: symptomName, logs: [] });
        }
      });
      return newData;
    });
    setAppState(AppState.SYMPTOM_JOURNAL);
  }, []);

  const handleGoToJournal = useCallback(() => {
    setAppState(AppState.SYMPTOM_JOURNAL);
  }, []);

  const handleAddJournalEntry = useCallback((symptomName: string, entry: Omit<SymptomLogEntry, 'date'>) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    setJournalData(prevData => {
      return prevData.map(symptom => {
        if (symptom.name === symptomName) {
          const existingEntryIndex = symptom.logs.findIndex(log => log.date === today);
          const newLogs = [...symptom.logs];
          const newEntry = { ...entry, date: today };
          if (existingEntryIndex > -1) {
            newLogs[existingEntryIndex] = newEntry;
          } else {
            newLogs.push(newEntry);
            newLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          }
          return { ...symptom, logs: newLogs };
        }
        return symptom;
      });
    });
  }, []);
  
  const handleAnalyzeTrends = useCallback(async () => {
    setAppState(AppState.ANALYZING_SYMPTOM_TRENDS);
    try {
      const analysis = await analyzeSymptomTrends(journalData);
      setTrendAnalysis(analysis);
    } catch (err) {
      console.error("Failed to analyze trends", err);
      // Set a user-friendly error state for the modal
      setTrendAnalysis({ 
        summary: "Une erreur est survenue lors de l'analyse de vos données. Veuillez réessayer.",
        findings: [] 
      });
    } finally {
      setAppState(AppState.SYMPTOM_JOURNAL);
    }
  }, [journalData]);

  const handleClearTrendAnalysis = useCallback(() => {
    setTrendAnalysis(null);
  }, []);

  // --- Pillbox handlers ---
  const handleGoToPillbox = useCallback(() => {
    setAppState(AppState.PILLBOX);
  }, []);
  
  const handleNavigateToAddMedication = useCallback(() => {
    setAppState(AppState.PILLBOX_ADD_MEDICATION);
  }, []);

  const handleAddMedication = useCallback(async (medication: Medication) => {
    setAppState(AppState.GENERATING_SIDE_EFFECTS);
    try {
      const sideEffects = await generateMedicationSideEffects(medication.name);
      const newMedication: Medication = { ...medication, sideEffectInfo: sideEffects };
      setPillboxData(prev => [...prev, newMedication]);
      setAppState(AppState.PILLBOX);
    } catch (err) {
      handleError(err instanceof Error ? err.message : "Impossible de récupérer les informations sur ce médicament.");
    }
  }, [handleError]);

  const handleNavigateToMedicationDetail = useCallback((medicationId: string) => {
    setActiveMedicationId(medicationId);
    setAppState(AppState.MEDICATION_DETAIL);
  }, []);

  const handleUpdateSideEffectNotes = useCallback((medicationId: string, notes: string) => {
    const today = new Date().toISOString().split('T')[0];
    setPillboxData(prev => prev.map(med => {
      if (med.id === medicationId) {
        const newSideEffects = med.trackedSideEffects ? [...med.trackedSideEffects] : [];
        const todayIndex = newSideEffects.findIndex(log => log.date === today);
        if (todayIndex > -1) {
          if (notes.trim()) {
            newSideEffects[todayIndex].notes = notes;
          } else {
            newSideEffects.splice(todayIndex, 1);
          }
        } else if (notes.trim()) {
          newSideEffects.push({ date: today, notes });
        }
        return { ...med, trackedSideEffects: newSideEffects };
      }
      return med;
    }));
  }, []);

  // --- Reset/Retry handler ---
  const resetState = useCallback(() => {
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
    setError(null);
    setIsDirectFlow(false);
    setIsMemoryTestRelevant(false);
    setMemoryTestWords([]);
    setMemoryTestResponse([]);
    setChatSession(null);
    setChatHistory([]);
    setAppointmentPrepData(null);
    setScenarioData(null);
    setPreventionProfile(null);
    setPreventionPlan(null);
    setRiskAnalysis(null);
  }, []);

  const handleRetry = useCallback(() => {
    // A simple retry logic, could be more sophisticated
    // For now, it just resets the app state.
    resetState();
  }, [resetState]);

  const renderContent = () => {
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
          onGoToJournal={handleGoToJournal}
          onGoToPillbox={handleGoToPillbox}
          onStartTraining={handleNavigateToTraining}
          onNavigateToCrossword={handleNavigateToCrossword}
        />;
      case AppState.HOW_IT_WORKS:
        return <HowItWorksScreen onBackToLanding={resetState} />;
      case AppState.EMERGENCY_GUIDE:
        return <EmergencyGuideScreen onBack={resetState} />;
      case AppState.SETTINGS:
        return <SettingsScreen 
          onBackToLanding={resetState} 
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
      case AppState.GENERATING_QUESTIONS:
      case AppState.GENERATING_EXCLUSION_SYMPTOMS:
      case AppState.GENERATING_SELF_EXAM_PROMPT:
      case AppState.GENERATING_NEURO_TESTS:
      case AppState.GENERATING_CRT_PROMPT:
      case AppState.GENERATING_RESPIRATORY_RATE_PROMPT:
      case AppState.GENERATING_STABILITY_TEST_PROMPT:
      case AppState.GENERATING_SPEECH_DYSPNEA_PROMPT:
      case AppState.GENERATING_PHOTO_PROMPT:
      case AppState.GENERATING_APPOINTMENT_PREP:
      case AppState.GENERATING_SCENARIOS:
      case AppState.GENERATING_PREVENTION_PLAN:
      case AppState.ANALYZING_SYMPTOM_TRENDS:
      case AppState.GENERATING_SIDE_EFFECTS:
      case AppState.GENERATING_MEMORY_TEST_WORDS:
        return <Loader text="L'IA réfléchit..." />;
      case AppState.SYMPTOM_INTENSITY:
        return <SymptomIntensityScreen symptoms={extractedSymptoms} onSubmit={handleIntensitySubmit} onSkip={handleSkipIntensityScreen} />;
      case AppState.SYMPTOM_CHARACTERISTICS:
        return <SymptomCharacteristicsScreen onSubmit={handleCharacteristicsSubmit} onSkip={handleCharacteristicsSubmit.bind(null, {})} />;
      case AppState.PRE_QUESTIONNAIRE:
        return <PreQuestionnaireScreen onSubmit={handlePreQuestionnaireSubmit} />;
      case AppState.ANNOUNCE_MEMORY_TEST:
        return <AnnounceMemoryTestScreen words={memoryTestWords} onContinue={handleMemoryTestAnnounced} />;
      case AppState.QUESTIONNAIRE:
        return <QuestionnaireScreen questions={questions} onSubmit={handleQuestionnaireComplete} />;
      case AppState.MEMORY_TEST_INPUT:
        return <MemoryTestInputScreen onSubmit={handleMemoryTestInputComplete} />;
      case AppState.EXCLUSION_FILTER:
        return <ExclusionFilterScreen symptoms={potentialExclusionSymptoms} onSubmit={handleExclusionFilterComplete} onSkip={handleExclusionFilterComplete.bind(null, [])} />;
      case AppState.SELF_EXAM:
        return selfExamPrompt ? <SelfExamScreen prompt={selfExamPrompt} onSubmit={handleSelfExamComplete} onSkip={handleSelfExamComplete.bind(null, '')} /> : null;
      case AppState.NEURO_TESTS:
        return <NeuroTestScreen questions={neuroTestQuestions} onSubmit={handleNeuroTestComplete} onSkip={handleNeuroTestComplete.bind(null, [])}/>
      case AppState.CRT_TEST:
        return <CRTScreen onSubmit={handleCRTTestComplete} onSkip={handleCRTTestComplete.bind(null, null)} />
      case AppState.RESPIRATORY_RATE_TEST:
        return <RespiratoryRateScreen onSubmit={handleRespiratoryRateTestComplete} />;
      case AppState.STABILITY_TEST:
        return <StabilityTestScreen onSubmit={handleStabilityTestComplete} onSkip={handleStabilityTestComplete.bind(null, null)} />;
      case AppState.SPEECH_DYSPNEA_TEST:
        return <SpeechDyspneaScreen onSubmit={handleSpeechDyspneaTestComplete} />;
      case AppState.PHOTO_UPLOAD:
        return <PhotoUploadScreen onComplete={handlePhotoSubmit} photoPrompt={photoPrompt} />;
      case AppState.GENERATING_REPORT:
        return <Loader text="Génération de votre rapport d'analyse..." />;
      case AppState.GENERATING_DIRECT_REPORT:
        return <Loader text="Génération de votre rapport informatif..." />;
      case AppState.SYMPTOM_MONITORING:
        return report ? <SymptomMonitoringScreen instructions={report.monitoringInstructions} onContinue={handleGoToReport} /> : null;
      case AppState.REPORT:
        return report ? <ReportScreen 
          report={report} 
          patientContext={patientContext}
          onReset={resetState} 
          onStartSupportChat={handleStartSupportChat}
          onGoToSummary={handleGoToSummary}
          onGoToAppointmentPrep={handleGoToAppointmentPrep}
          onGoToScenarioSimulator={handleGoToScenarioSimulator}
          onStartTracking={handleStartTracking}
          onGoToPillbox={handleGoToPillbox}
          isDirectFlow={isDirectFlow}
        /> : null;
      case AppState.DIAGNOSTIC_SUMMARY:
        return report && patientContext ? <DiagnosticSummaryScreen 
            onBackToReport={handleBackToReport}
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
          onSendMessage={handleSendChatMessage} 
          isResponding={isChatResponding}
          onBackToReport={handleBackToReport}
          empathyLevel={empathyLevel}
          onEmpathyLevelChange={handleEmpathyLevelChange}
        />;
      case AppState.MEDICAL_APPOINTMENT_PREP:
        return appointmentPrepData ? <MedicalAppointmentPrepScreen prepData={appointmentPrepData} onBackToReport={handleBackToReport} onGoToSummary={handleGoToSummary} /> : null;
      case AppState.SCENARIO_SIMULATOR:
        return scenarioData ? <ScenarioSimulatorScreen scenarios={scenarioData.scenarios} onBackToReport={handleBackToReport} /> : null;
      case AppState.PREVENTION_PLAN_PROFILE:
        return <PreventionProfileScreen onSubmit={handlePreventionProfileSubmit} onBackToLanding={resetState} />;
      case AppState.PREVENTION_PLAN_REPORT:
        return preventionPlan && riskAnalysis ? <PreventionPlanReportScreen plan={preventionPlan} riskAnalysis={riskAnalysis} onReset={resetState} /> : null;
      case AppState.SYMPTOM_JOURNAL_SETUP:
        return <SymptomJournalSetupScreen suggestedSymptoms={symptomsToTrackSetup} onSubmit={handleJournalSetupComplete} onBackToReport={handleBackToReport} />;
      case AppState.SYMPTOM_JOURNAL:
        return <SymptomJournalScreen 
          journalData={journalData} 
          onAddEntry={handleAddJournalEntry} 
          onBackToLanding={resetState} 
          onAnalyzeTrends={handleAnalyzeTrends}
          trendAnalysis={trendAnalysis}
          onClearTrendAnalysis={handleClearTrendAnalysis}
        />;
      case AppState.PILLBOX:
        return <PillboxScreen 
          pillboxData={pillboxData} 
          onNavigateToAdd={handleNavigateToAddMedication} 
          onNavigateToDetail={handleNavigateToMedicationDetail} 
          onBackToLanding={resetState}
        />;
      case AppState.PILLBOX_ADD_MEDICATION:
        return <AddMedicationScreen onAddMedication={handleAddMedication} onBack={handleGoToPillbox} />;
      case AppState.MEDICATION_DETAIL:
        const activeMed = pillboxData.find(m => m.id === activeMedicationId);
        return activeMed ? <MedicationDetailScreen medication={activeMed} onUpdateSideEffectNotes={handleUpdateSideEffectNotes} onBack={handleGoToPillbox} /> : null;
      case AppState.TRAINING:
        return <TrainingScreen onBackToLanding={resetState} onNavigateToTrainingProtect={handleNavigateToTrainingProtect} trainingProgress={trainingProgress} />;
      case AppState.TRAINING_PROTECT:
        return <ProtectScreen onComplete={handleCompleteProtectSection} onBack={handleNavigateToTraining} />;
      case AppState.CROSSWORD:
        return <CrosswordScreen onBack={resetState} />;
      case AppState.ERROR:
        return error ? <ErrorScreen message={error} onRetry={handleRetry} /> : null;
      default:
        return <LandingScreen 
          onStartDiagnosis={handleNavigateToPreDiagnosis} 
          onEmergency={handleNavigateToEmergencyGuide} 
          onStartPreventionPlan={handleNavigateToPreventionPlan}
          onDirectDiagnosisSubmit={handleDirectDiagnosisSubmit}
          onShowHowItWorks={handleNavigateToHowItWorks}
          onShowSettings={handleNavigateToSettings}
          hasJournalData={journalData.length > 0}
          onGoToJournal={handleGoToJournal}
          onGoToPillbox={handleGoToPillbox}
          onStartTraining={handleNavigateToTraining}
          onNavigateToCrossword={handleNavigateToCrossword}
        />;
    }
  };

  return (
    <main className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        {renderContent()}
    </main>
  );
};

export default App;