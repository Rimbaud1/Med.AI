
export enum AppState {
  LANDING,
  HOW_IT_WORKS,
  EMERGENCY_GUIDE,
  PRE_DIAGNOSIS,
  INITIAL,
  CONTEXT_GATHERING,
  SYMPTOM_INTENSITY,
  SYMPTOM_CHARACTERISTICS,
  PRE_QUESTIONNAIRE,
  GENERATING_MEMORY_TEST_WORDS,
  ANNOUNCE_MEMORY_TEST,
  GENERATING_QUESTIONS,
  QUESTIONNAIRE,
  MEMORY_TEST_INPUT,
  GENERATING_EXCLUSION_SYMPTOMS,
  EXCLUSION_FILTER,
  GENERATING_SELF_EXAM_PROMPT,
  SELF_EXAM,
  GENERATING_NEURO_TESTS,
  NEURO_TESTS,
  GENERATING_CRT_PROMPT,
  CRT_TEST,
  GENERATING_RESPIRATORY_RATE_PROMPT,
  RESPIRATORY_RATE_TEST,
  GENERATING_STABILITY_TEST_PROMPT,
  STABILITY_TEST,
  GENERATING_SPEECH_DYSPNEA_PROMPT,
  SPEECH_DYSPNEA_TEST,
  GENERATING_PHOTO_PROMPT,
  PHOTO_UPLOAD,
  GENERATING_REPORT,
  GENERATING_DIRECT_REPORT,
  SYMPTOM_MONITORING,
  REPORT,
  SYMPTOM_JOURNAL_SETUP,
  SYMPTOM_JOURNAL,
  DIAGNOSTIC_SUMMARY,
  PSYCHOLOGICAL_SUPPORT,
  GENERATING_APPOINTMENT_PREP,
  MEDICAL_APPOINTMENT_PREP,
  GENERATING_SCENARIOS,
  SCENARIO_SIMULATOR,
  PREVENTION_PLAN_PROFILE,
  GENERATING_PREVENTION_PLAN,
  PREVENTION_PLAN_REPORT,
  ERROR,
}

export type EmpathyLevel = 'Direct' | 'Normal' | 'Empathique' | 'Très Empathique';

export interface PatientContext {
  sex: 'Homme' | 'Femme' | 'Autre';
  age: number;
  weight?: number;
  location?: string;
  existingConditions?: string;
  currentMedications?: string;
  allergies?: string;
  recentTravels?: string;
}

export interface SymptomIntensity {
  name: string;
  score: number; // 1-10
}

export type SymptomTiming = 'Constant' | 'Pire le matin' | 'Pire la nuit' | 'Intermittent';

export interface SymptomCharacteristics {
  temperature?: number;
  entourageHasSymptoms?: boolean;
  timing?: SymptomTiming;
}

export interface PreQuestionnaireAnswer {
  question: string;
  answer: boolean; // true for oui, false for non
  details: string; // empty if answer is false
}

export interface Choice {
  text: string;
  definition?: string;
}

export interface Question {
  question: string;
  choices: Choice[];
}

export interface Answer {
  question: string;
  answer: string;
}

export interface PossibleIssue {
  name: string;
  confidence: number;
  description: string;
}

export interface SuggestedSpecialist {
  slug: string; // The URL-friendly version for Doctolib (e.g., "dermatologue")
  name: string; // The user-friendly name (e.g., "Dermatologue")
}

export interface ReportData {
  monitoringInstructions: string;
  possibleIssues: PossibleIssue[];
  severity: string;
  recommendations: string[];
  prescription: string[];
  disclaimer: string;
  shortSummaryForPatient: string;
  socialEvictionPeriod?: string;
  suggestedSpecialist?: SuggestedSpecialist;
  nutritionGuide?: string;
}

export interface AppointmentPrepData {
  potentialQuestions: string[];
  script: string;
}

export interface Scenario {
  type: 'Favorable' | 'À surveiller' | 'Inquiétant';
  title: string;
  timeline: string;
  signs: string[];
  action: string;
}

export interface ScenarioData {
  scenarios: Scenario[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type SmokingStatus = 'Jamais' | 'Ancien fumeur' | 'Fumeur actuel';
export type AlcoholConsumption = 'Aucune' | 'Faible (1-2 fois/semaine)' | 'Modérée (3-5 fois/semaine)' | 'Élevée (Quotidienne)';
export type PhysicalActivity = 'Sédentaire (peu ou pas)' | 'Légère (marche)' | 'Modérée (jogging, vélo 3x/semaine)' | 'Intense (sport > 3x/semaine)';
export type DietQuality = 'Très saine (équilibrée, fruits/légumes)' | 'Assez saine' | 'Peu équilibrée (fast-food fréquent)' | 'Pas du tout saine';


export interface PreventionProfile {
  sex: 'Homme' | 'Femme' | 'Autre';
  age: number;
  smokingStatus: SmokingStatus;
  alcoholConsumption: AlcoholConsumption;
  physicalActivity: PhysicalActivity;
  dietQuality: DietQuality;
  personalMedicalHistory: string;
  familyMedicalHistory: string;
}

export interface PreventionRecommendation {
  title: string;
  reason: string;
  details: string;
}

export interface PreventionPlanData {
  recommendedScreenings: PreventionRecommendation[];
  vaccinationAdvice: PreventionRecommendation[];
  lifestyleSuggestions: PreventionRecommendation[];
  generalDisclaimer: string;
}

export interface NeuroTest {
  question: string;
  answer: boolean; // true for oui, false for non
}

export type CapillaryRefillTimeResult = 'Moins de 2 secondes (Normal)' | 'Entre 2 et 3 secondes (À surveiller)' | 'Plus de 3 secondes (Lent)';

export type StabilityTestResult = 'Parfaitement stable' | 'Légère oscillation, stable' | 'Instabilité notable (a dû bouger les pieds)' | 'Instabilité sévère (presque tombé ou a eu besoin d\'un support)';

export interface SpeechDyspneaResult {
  wordsRead: number;
  totalWords: number;
}

// Types for Symptom Journal
export interface SymptomLogEntry {
  date: string; // ISO string for date YYYY-MM-DD
  intensity: number; // 1-10
  notes?: string;
}

export interface TrackedSymptom {
  name: string;
  logs: SymptomLogEntry[];
}
