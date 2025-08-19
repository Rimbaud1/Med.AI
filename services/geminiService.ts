

import { GoogleGenAI, Type } from "@google/genai";
import type { Question, ReportData, Answer, PatientContext, PossibleIssue, SymptomIntensity, PreQuestionnaireAnswer, SymptomCharacteristics, AppointmentPrepData, ScenarioData, PreventionProfile, PreventionPlanData, NeuroTest, StabilityTestResult, CapillaryRefillTimeResult, SpeechDyspneaResult, MedicationSideEffectInfo, RiskAnalysis, TrackedSymptom, TrendAnalysis } from '../types';

let _ai: GoogleGenAI | null = null;

export function initializeAi(apiKey: string) {
    _ai = new GoogleGenAI({ apiKey });
}

function getClient(): GoogleGenAI {
    if (_ai) {
        return _ai;
    }
    if (process.env.API_KEY) {
        console.warn('AI Client not initialized, falling back to default key.');
        initializeAi(process.env.API_KEY);
        return _ai!;
    }
    throw new Error("AI Client not initialized and no default API_KEY found.");
}


function formatContext(context: PatientContext): string {
    let contextString = `Contexte du patient:\n`;
    contextString += `- Sexe: ${context.sex}\n`;
    contextString += `- Âge: ${context.age} ans\n`;
    if (context.weight) contextString += `- Poids: ${context.weight} kg\n`;
    if (context.location) contextString += `- Lieu: ${context.location}\n`;
    if (context.existingConditions) contextString += `- Pathologies connues: ${context.existingConditions}\n`;
    if (context.currentMedications) contextString += `- Traitements en cours: ${context.currentMedications}\n`;
    if (context.allergies) contextString += `- Allergies: ${context.allergies}\n`;
    if (context.recentTravels) contextString += `- Voyages récents: ${context.recentTravels}\n`;
    return contextString;
}

function formatIntensityData(intensities: SymptomIntensity[], discomfort: string | null): string {
    if (!intensities.length && !discomfort) return '';
    let intensityString = '\nÉvaluation des symptômes par le patient:\n';
    if (intensities.length > 0) {
        intensityString += intensities.map(s => `- ${s.name}: ${s.score}/10`).join('\n');
    }
    if (discomfort) {
        intensityString += `\n- Gêne générale: ${discomfort}`;
    }
    return intensityString + '\n';
}

function formatSymptomCharacteristics(mainSymptom: string | null, characteristics: SymptomCharacteristics | null): string {
    if (!mainSymptom && (!characteristics || Object.keys(characteristics).length === 0)) return '';
    
    const parts: string[] = [];
    if (mainSymptom) {
        parts.push(`Symptôme principal rapporté par le patient : ${mainSymptom}`);
    }

    if (characteristics) {
        const charDetails: string[] = [];
        if (characteristics.temperature) {
            charDetails.push(`- Température mesurée : ${characteristics.temperature}°C`);
        }
        if (characteristics.entourageHasSymptoms !== undefined) {
            charDetails.push(`- Personnes avec symptômes similaires dans l'entourage : ${characteristics.entourageHasSymptoms ? 'Oui' : 'Non'}`);
        }
        if (characteristics.timing) {
            charDetails.push(`- Rythme des symptômes : ${characteristics.timing}`);
        }
        if (charDetails.length > 0) {
            parts.push('Caractéristiques des symptômes :\n' + charDetails.join('\n'));
        }
    }
    
    if (parts.length > 0) {
        return '\n' + parts.join('\n\n') + '\n';
    }
    return '';
}

function formatPreQuestionnaire(answers: PreQuestionnaireAnswer[]): string {
    if (answers.length === 0) return '';

    let preQuestionnaireString = `\nInformations contextuelles supplémentaires:\n`;
    preQuestionnaireString += answers
        .filter(a => a.answer) // Only include "Yes" answers
        .map(a => {
            const detailsText = a.details.trim() ? ` (${a.details.trim()})` : '';
            return `- ${a.question.replace('Avez-vous récemment', 'A eu récemment')} Oui${detailsText}`;
        })
        .join('\n');
    return preQuestionnaireString + '\n';
}

function formatQuestionnaireAnswers(answers: Answer[]): string {
    if(answers.length === 0) return '';
    return '\nRéponses au questionnaire:\n' + answers.map(a => `- Q: ${a.question}\n  R: ${a.answer}`).join('\n');
}

function formatExcludedSymptoms(symptoms: string[]): string {
    if (symptoms.length === 0) return '';
    return '\nSymptômes explicitement absents (confirmé par le patient):\n' + symptoms.map(s => `- ${s}`).join('\n');
}

function formatSelfExamResult(result: string | null): string {
    if (!result || result.trim() === '') return '';
    return `\nRésultat de l'auto-examen guidé:\n- ${result.trim()}\n`;
}

function formatNeuroTestAnswers(answers: NeuroTest[]): string {
    if (answers.length === 0) return '';
    return '\nRésultats du test neurologique simplifié:\n' + answers.map(a => `- Q: ${a.question}\n  R: ${a.answer ? 'Oui' : 'Non'}`).join('\n');
}

function formatCRTResult(result: CapillaryRefillTimeResult | null): string {
    if (!result) return '';
    return `\nRésultat du test de temps de recoloration cutanée (TRC): ${result}\n`;
}

function formatRespiratoryRate(rate: number | null): string {
    if (rate === null) return '';
    return `\nFréquence respiratoire mesurée: ${rate} respirations/minute\n`;
}

function formatStabilityTestResult(result: StabilityTestResult | null): string {
    if (!result) return '';
    return `\nRésultat du test de stabilité: ${result}\n`;
}

function formatSpeechDyspneaResult(result: SpeechDyspneaResult | null): string {
    if (!result) return '';
    if (result.wordsRead === result.totalWords) {
        return `\nRésultat du test d'essoufflement à la parole: Le patient a pu lire la phrase entière sans reprendre son souffle (Normal).\n`;
    }
    return `\nRésultat du test d'essoufflement à la parole: Le patient a pu lire ${result.wordsRead} mot(s) sur ${result.totalWords} avant de devoir reprendre son souffle.\n`;
}

function formatMemoryTestResult(wordsToRemember: string[] | null, userInput: string[] | null): string {
    if (!wordsToRemember || !userInput || wordsToRemember.length === 0) return '';
    
    const correctWords = userInput.filter(word => wordsToRemember.map(w => w.toLowerCase()).includes(word.toLowerCase()));
    const missedWords = wordsToRemember.filter(word => !userInput.map(u => u.toLowerCase()).includes(word.toLowerCase()));

    let resultString = `\nRésultat du test de mémoire à court terme:\n`;
    resultString += `- Mots à retenir: ${wordsToRemember.join(', ')}\n`;
    resultString += `- Mots restitués par le patient: ${userInput.join(', ') || 'Aucun'}\n`;
    resultString += `- Analyse: Le patient a correctement restitué ${correctWords.length} mot(s) sur ${wordsToRemember.length}.`;
    if(missedWords.length > 0) {
        resultString += ` Mots manqués: ${missedWords.join(', ')}.`;
    }
    resultString += '\n';

    return resultString;
}

export async function shouldTriggerMemoryTest(
    symptoms: string,
    context: PatientContext
): Promise<boolean> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const prompt = `Analyse les informations patient suivantes. Un test de mémoire à court terme (retenir 3 mots) est-il pertinent ?
    Le test est pertinent en cas de symptômes comme "maux de tête intenses", "commotion", "choc à la tête", "brouillard mental", "confusion", "vertiges", "étourdissements", ou si la personne est âgée et signale une confusion.
    Réponds par "oui" ou "non" et rien d'autre.

    --- Informations Patient ---
    Description initiale: "${symptoms}"
    ${formatContext(context)}
    -----------------------------
    `;
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text.trim().toLowerCase() === 'oui';
    } catch (error) {
        console.error("Error determining if memory test is needed:", error);
        return false;
    }
}

export async function generateMemoryTestWords(): Promise<string[]> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const prompt = `Génère 3 mots simples, courants et sémantiquement distincts en français pour un test de mémoire. Par exemple: Voiture, Forêt, Jaune. Ne choisis pas des mots qui se suivent logiquement. Retourne uniquement un tableau JSON de 3 chaînes de caractères.`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Liste de 3 mots simples pour un test de mémoire."
                }
            }
        });
        const jsonString = response.text;
        const words = JSON.parse(jsonString);
        if (Array.isArray(words) && words.length === 3 && words.every(w => typeof w === 'string')) {
            return words;
        }
        return ["Table", "Vert", "Musique"]; // Fallback
    } catch (error) {
        console.error("Error generating memory test words:", error);
        return ["Table", "Vert", "Musique"]; // Fallback
    }
}


export async function extractSymptoms(description: string): Promise<string[]> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';
  const prompt = `Extrais les symptômes médicaux principaux de la description suivante. Retourne uniquement un tableau JSON de chaînes de caractères. Limite à 5 symptômes maximum. Exemple: si la description est "J'ai un mal de gorge terrible, le nez qui coule et une forte fièvre depuis hier", retourne ["Mal de gorge", "Nez qui coule", "Fièvre"].\n\nDescription: "${description}"`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Liste des symptômes extraits de la description du patient."
        }
      }
    });
    const jsonString = response.text;
    const symptoms = JSON.parse(jsonString);
    if (!Array.isArray(symptoms)) {
        console.warn("API did not return a valid array of symptoms, returning empty.");
        return [];
    }
    return symptoms;
  } catch (error) {
    console.error("Error extracting symptoms:", error);
    // Return empty array on failure so the app can proceed gracefully
    return [];
  }
}


export async function generateQuestions(
  symptoms: string, 
  context: PatientContext, 
  intensities: SymptomIntensity[], 
  discomfort: string | null, 
  mainSymptom: string | null,
  characteristics: SymptomCharacteristics | null,
  preQuestionnaireAnswers: PreQuestionnaireAnswer[]
): Promise<Question[]> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';

  const formattedContext = formatContext(context);
  const formattedIntensity = formatIntensityData(intensities, discomfort);
  const formattedChars = formatSymptomCharacteristics(mainSymptom, characteristics);
  const formattedPreQuestionnaire = formatPreQuestionnaire(preQuestionnaireAnswers);

  const prompt = `Basé sur les informations suivantes du patient, génère un questionnaire de 10 questions à choix multiples pour affiner le diagnostic. Les questions doivent être pertinentes. Pour chaque question, propose exactement 4 choix de réponse concis. Pour chaque choix, si le terme est technique ou médical (ex: "Myalgie", "Dyspnée", "Céphalée"), fournis une 'definition' simple et non-médicale. Si le terme est simple (ex: "Oui", "Non", "Rien de tout cela"), ne fournis pas de définition. Les questions, choix et définitions doivent être en français.\n\n${formattedContext}${formattedIntensity}${formattedChars}${formattedPreQuestionnaire}\nSymptômes initiaux : "${symptoms}"`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: "La question à poser au patient."
              },
              choices: {
                type: Type.ARRAY,
                description: "Une liste de 4 réponses possibles.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "Le texte du choix de réponse." },
                    definition: { type: Type.STRING, description: "Une définition simple et optionnelle pour les termes médicaux." }
                  },
                  required: ["text"]
                }
              }
            },
            required: ["question", "choices"]
          }
        }
      }
    });

    const jsonString = response.text;
    const questionsData = JSON.parse(jsonString);

    if (!Array.isArray(questionsData)) {
      throw new Error("API did not return an array of questions.");
    }

    return questionsData.map((q: any) => ({
        question: q.question,
        choices: Array.isArray(q.choices) ? q.choices.slice(0, 4) : [] 
    }));

  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Impossible de générer le questionnaire. Veuillez réessayer.");
  }
}

export async function generateExclusionSymptoms(
  symptoms: string, 
  context: PatientContext, 
  intensities: SymptomIntensity[], 
  discomfort: string | null, 
  mainSymptom: string | null,
  characteristics: SymptomCharacteristics | null,
  preQuestionnaireAnswers: PreQuestionnaireAnswer[], 
  answers: Answer[]
): Promise<string[]> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';
  
  const prompt = `En te basant sur l'intégralité des informations du patient ci-dessous, génère une liste de 5 à 7 symptômes pertinents pour un diagnostic différentiel, c'est-à-dire des symptômes importants que le patient n'a PAS encore mentionnés mais dont l'absence permettrait d'exclure certaines pathologies. Ne liste que des symptômes qui n'ont pas déjà été confirmés ou infirmés. Retourne uniquement un tableau JSON de chaînes de caractères.
  
  --- Informations Patient ---
  Description initiale: "${symptoms}"
  ${formatContext(context)}
  ${formatIntensityData(intensities, discomfort)}
  ${formatSymptomCharacteristics(mainSymptom, characteristics)}
  ${formatPreQuestionnaire(preQuestionnaireAnswers)}
  ${formatQuestionnaireAnswers(answers)}
  -----------------------------
  
  Exemple de réponse : ["Toux sèche", "Douleurs articulaires", "Éruption cutanée", "Perte de goût ou d'odorat"]
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Liste de symptômes pour le filtre d'exclusion."
        }
      }
    });
    const jsonString = response.text;
    const exclusionSymptoms = JSON.parse(jsonString);
    if (!Array.isArray(exclusionSymptoms)) {
      console.warn("API did not return a valid array for exclusion symptoms.");
      return [];
    }
    return exclusionSymptoms;
  } catch (error) {
    console.error("Error generating exclusion symptoms:", error);
    return []; // Return empty on error to allow app to continue
  }
}

export async function generateSelfExamPrompt(
  symptoms: string, 
  context: PatientContext, 
  answers: Answer[],
  intensities: SymptomIntensity[], 
  discomfort: string | null, 
  mainSymptom: string | null,
  characteristics: SymptomCharacteristics | null,
  preQuestionnaireAnswers: PreQuestionnaireAnswer[],
  excludedSymptoms: string[]
): Promise<string> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Analyse les informations patient suivantes pour suggérer une étape simple et SÛRE d'auto-examen que l'utilisateur pourrait effectuer pour aider au diagnostic.
    L'instruction doit être une question claire et concise, sans jargon médical. Elle doit guider une action simple (toucher, observer).
    Ne JAMAIS suggérer quelque chose de dangereux, d'invasif ou qui pourrait aggraver la situation. La sécurité est la priorité absolue.
    
    Exemples de bonnes instructions :
    - "Appuyez doucement sur la zone de votre ventre qui est douloureuse. Est-ce que la douleur est plus forte lorsque vous appuyez, ou lorsque vous relâchez la pression rapidement ?"
    - "Observez la couleur de votre langue dans un miroir. Est-elle rose, blanche, ou d'une autre couleur ?"
    - "Lorsque vous toussez, est-ce que vous produisez des glaires ? Si oui, de quelle couleur sont-elles ?"

    Si aucun auto-examen pertinent et SANS DANGER n'est identifiable, retourne une chaîne vide.

    --- Informations Patient ---
    Description initiale: "${symptoms}"
    Symptôme principal: ${mainSymptom || 'Non spécifié'}
    ${formatContext(context)}
    ${formatIntensityData(intensities, discomfort)}
    ${formatSymptomCharacteristics(mainSymptom, characteristics)}
    ${formatPreQuestionnaire(preQuestionnaireAnswers)}
    ${formatQuestionnaireAnswers(answers)}
    ${formatExcludedSymptoms(excludedSymptoms)}
    -----------------------------

    Ta réponse doit être une seule chaîne de caractères contenant uniquement l'instruction pour l'auto-examen. Si non pertinent, retourne une chaîne vide.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating self-exam prompt:", error);
    return ""; // Return empty string on error
  }
}

export async function generateNeuroTests(
  symptoms: string, 
  context: PatientContext, 
  answers: Answer[],
  intensities: SymptomIntensity[], 
  discomfort: string | null, 
  mainSymptom: string | null,
  characteristics: SymptomCharacteristics | null,
  preQuestionnaireAnswers: PreQuestionnaireAnswer[],
  excludedSymptoms: string[],
  selfExamResult: string | null
): Promise<string[]> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Analyse l'intégralité des informations patient ci-dessous. Détermine si des tests neurologiques simplifiés (type VITE/FAST pour les AVC) sont pertinents.
    Les symptômes comme le mal de tête sévère, les vertiges, la confusion, la faiblesse d'un côté, ou des problèmes d'élocution rendent ces tests pertinents.

    Si pertinent, retourne un tableau JSON de 1 à 3 questions de test très simples, claires et sûres.
    Exemples de questions :
    - "Souriez largement. Votre sourire vous semble-t-il symétrique (les deux côtés de la bouche se lèvent de la même manière) ?"
    - "Tendez vos deux bras droits devant vous, paumes vers le haut, et fermez les yeux pendant 10 secondes. Un de vos bras a-t-il tendance à tomber ou à tourner ?"
    - "Répétez la phrase simple suivante à voix haute : 'Le ciel est bleu à Paris'. Avez-vous eu des difficultés à prononcer les mots ?"

    Si aucun test n'est pertinent, retourne un tableau JSON vide.

    --- Informations Patient ---
    Description initiale: "${symptoms}"
    ${formatContext(context)}
    ${formatIntensityData(intensities, discomfort)}
    ${formatSymptomCharacteristics(mainSymptom, characteristics)}
    ${formatPreQuestionnaire(preQuestionnaireAnswers)}
    ${formatQuestionnaireAnswers(answers)}
    ${formatExcludedSymptoms(excludedSymptoms)}
    ${formatSelfExamResult(selfExamResult)}
    -----------------------------

    Ta réponse doit être uniquement un tableau JSON de chaînes de caractères.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Liste de questions de test neurologique simplifiées. Peut être vide."
        }
      }
    });
    const jsonString = response.text;
    const neuroTests = JSON.parse(jsonString);
    if (!Array.isArray(neuroTests)) {
      console.warn("API did not return a valid array for neuro tests.");
      return [];
    }
    return neuroTests;
  } catch (error) {
    console.error("Error generating neuro tests:", error);
    return []; // Return empty on error
  }
}

export async function shouldRequestCRT(
    symptoms: string, 
    context: PatientContext, 
    answers: Answer[],
    intensities: SymptomIntensity[], 
    discomfort: string | null, 
    mainSymptom: string | null,
    characteristics: SymptomCharacteristics | null,
    preQuestionnaireAnswers: PreQuestionnaireAnswer[],
    excludedSymptoms: string[],
    selfExamResult: string | null,
    neuroTestAnswers: NeuroTest[]
): Promise<boolean> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const prompt = `
        Analyse les informations patient suivantes. Est-il pertinent de demander un test de temps de recoloration cutanée (TRC) ?
        Ce test est pertinent en cas de fièvre, de signes de déshydratation (vomissements, diarrhée), de sensation de malaise général ou si l'état circulatoire est une préoccupation.
        Réponds par "oui" ou "non" et rien d'autre.

        --- Informations Patient ---
        Description initiale: "${symptoms}"
        ${formatContext(context)}
        ${formatIntensityData(intensities, discomfort)}
        ${formatSymptomCharacteristics(mainSymptom, characteristics)}
        ${formatPreQuestionnaire(preQuestionnaireAnswers)}
        ${formatQuestionnaireAnswers(answers)}
        ${formatExcludedSymptoms(excludedSymptoms)}
        ${formatSelfExamResult(selfExamResult)}
        ${formatNeuroTestAnswers(neuroTestAnswers)}
        -----------------------------
    `;
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text.trim().toLowerCase() === 'oui';
    } catch (error) {
        console.error("Error determining if CRT test is needed:", error);
        return false;
    }
}

export async function shouldRequestRespiratoryRate(
    symptoms: string, 
    context: PatientContext, 
    answers: Answer[],
    intensities: SymptomIntensity[], 
    discomfort: string | null, 
    mainSymptom: string | null,
    characteristics: SymptomCharacteristics | null,
    preQuestionnaireAnswers: PreQuestionnaireAnswer[],
    excludedSymptoms: string[],
    selfExamResult: string | null,
    neuroTestAnswers: NeuroTest[],
    crtResult: CapillaryRefillTimeResult | null
): Promise<boolean> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const prompt = `
        Analyse les informations patient suivantes. Est-il pertinent de demander au patient de mesurer sa fréquence respiratoire ?
        La mesure est pertinente en cas de symptômes comme fièvre, toux, essoufflement, douleur thoracique, ou si le diagnostic potentiel implique le système respiratoire ou une infection systémique.
        Réponds par "oui" ou "non" et rien d'autre.

        --- Informations Patient ---
        Description initiale: "${symptoms}"
        ${formatContext(context)}
        ${formatIntensityData(intensities, discomfort)}
        ${formatSymptomCharacteristics(mainSymptom, characteristics)}
        ${formatPreQuestionnaire(preQuestionnaireAnswers)}
        ${formatQuestionnaireAnswers(answers)}
        ${formatExcludedSymptoms(excludedSymptoms)}
        ${formatSelfExamResult(selfExamResult)}
        ${formatNeuroTestAnswers(neuroTestAnswers)}
        ${formatCRTResult(crtResult)}
        -----------------------------
    `;
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text.trim().toLowerCase() === 'oui';
    } catch (error) {
        console.error("Error determining if respiratory rate is needed:", error);
        return false; // Default to false on error
    }
}

export async function shouldRequestStabilityTest(
    symptoms: string, 
    context: PatientContext, 
    answers: Answer[],
    intensities: SymptomIntensity[], 
    discomfort: string | null, 
    mainSymptom: string | null,
    characteristics: SymptomCharacteristics | null,
    preQuestionnaireAnswers: PreQuestionnaireAnswer[],
    excludedSymptoms: string[],
    selfExamResult: string | null,
    neuroTestAnswers: NeuroTest[],
    crtResult: CapillaryRefillTimeResult | null,
    respiratoryRate: number | null
): Promise<boolean> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const prompt = `
        Analyse les informations patient suivantes. Est-il pertinent de demander au patient de faire un test de stabilité (se tenir debout pieds joints pendant 15s) ?
        Ce test est pertinent en cas de symptômes comme "vertiges", "étourdissements", "sensation d'ébriété", "perte d'équilibre", ou si une atteinte neurologique ou de l'oreille interne est suspectée.
        Réponds par "oui" ou "non" et rien d'autre.

        --- Informations Patient ---
        Description initiale: "${symptoms}"
        ${formatContext(context)}
        ${formatIntensityData(intensities, discomfort)}
        ${formatSymptomCharacteristics(mainSymptom, characteristics)}
        ${formatPreQuestionnaire(preQuestionnaireAnswers)}
        ${formatQuestionnaireAnswers(answers)}
        ${formatExcludedSymptoms(excludedSymptoms)}
        ${formatSelfExamResult(selfExamResult)}
        ${formatNeuroTestAnswers(neuroTestAnswers)}
        ${formatCRTResult(crtResult)}
        ${formatRespiratoryRate(respiratoryRate)}
        -----------------------------
    `;
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text.trim().toLowerCase() === 'oui';
    } catch (error) {
        console.error("Error determining if stability test is needed:", error);
        return false; // Default to false on error
    }
}

export async function shouldRequestSpeechDyspneaTest(
    symptoms: string, 
    context: PatientContext, 
    answers: Answer[],
    intensities: SymptomIntensity[], 
    discomfort: string | null, 
    mainSymptom: string | null,
    characteristics: SymptomCharacteristics | null,
    preQuestionnaireAnswers: PreQuestionnaireAnswer[],
    excludedSymptoms: string[],
    selfExamResult: string | null,
    neuroTestAnswers: NeuroTest[],
    crtResult: CapillaryRefillTimeResult | null,
    respiratoryRate: number | null,
    stabilityTestResult: StabilityTestResult | null
): Promise<boolean> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const prompt = `
        Analyse les informations patient suivantes. Est-il pertinent de demander un test d'essoufflement à la parole ?
        Ce test est pertinent en cas de symptômes comme "essoufflement", "dyspnée", "difficulté à respirer", "toux", "douleur thoracique", ou si une détresse respiratoire est suspectée.
        Réponds par "oui" ou "non" et rien d'autre.

        --- Informations Patient ---
        Description initiale: "${symptoms}"
        ${formatContext(context)}
        ${formatIntensityData(intensities, discomfort)}
        ${formatSymptomCharacteristics(mainSymptom, characteristics)}
        ${formatPreQuestionnaire(preQuestionnaireAnswers)}
        ${formatQuestionnaireAnswers(answers)}
        ${formatExcludedSymptoms(excludedSymptoms)}
        ${formatSelfExamResult(selfExamResult)}
        ${formatNeuroTestAnswers(neuroTestAnswers)}
        ${formatCRTResult(crtResult)}
        ${formatRespiratoryRate(respiratoryRate)}
        ${formatStabilityTestResult(stabilityTestResult)}
        -----------------------------
    `;
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text.trim().toLowerCase() === 'oui';
    } catch (error) {
        console.error("Error determining if speech dyspnea test is needed:", error);
        return false;
    }
}


export async function generatePhotoPrompt(
  symptoms: string, 
  context: PatientContext, 
  answers: Answer[], 
  intensities: SymptomIntensity[], 
  discomfort: string | null, 
  mainSymptom: string | null,
  characteristics: SymptomCharacteristics | null,
  preQuestionnaireAnswers: PreQuestionnaireAnswer[],
  excludedSymptoms: string[],
  selfExamResult: string | null,
  neuroTestAnswers: NeuroTest[],
  crtResult: CapillaryRefillTimeResult | null,
  respiratoryRate: number | null,
  stabilityTestResult: StabilityTestResult | null,
  speechDyspneaResult: SpeechDyspneaResult | null
): Promise<string> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Analyse les informations patient suivantes pour suggérer une photo spécifique et utile que l'utilisateur pourrait prendre pour aider au diagnostic.
    La suggestion doit être une instruction claire et concise.
    Si un symptôme visible est probable (éruption cutanée, irritation de la gorge, gonflement, etc.), donne une instruction pour le photographier.
    Donne des conseils pratiques (ex: "bonne lumière", "sans flash").
    Si aucun symptôme visible n'est probable ou pertinent, retourne une chaîne vide.

    Exemples de sortie :
    - "Essayez de photographier votre gorge dans une pièce bien éclairée, en tirant la langue."
    - "Veuillez prendre une photo nette de l'éruption cutanée sur votre bras."
    - ""

    --- Informations Patient ---
    Description initiale: "${symptoms}"
    Symptôme principal: ${mainSymptom || 'Non spécifié'}
    ${formatContext(context)}
    ${formatIntensityData(intensities, discomfort)}
    ${formatSymptomCharacteristics(mainSymptom, characteristics)}
    ${formatExcludedSymptoms(excludedSymptoms)}
    ${formatSelfExamResult(selfExamResult)}
    ${formatNeuroTestAnswers(neuroTestAnswers)}
    ${formatCRTResult(crtResult)}
    ${formatRespiratoryRate(respiratoryRate)}
    ${formatStabilityTestResult(stabilityTestResult)}
    ${formatSpeechDyspneaResult(speechDyspneaResult)}
    -----------------------------

    Ta réponse doit être une seule chaîne de caractères contenant uniquement l'instruction pour la photo.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating photo prompt:", error);
    return "";
  }
}

export async function generateReport(
  symptoms: string, 
  context: PatientContext, 
  answers: Answer[], 
  imageBase64: string | null, 
  intensities: SymptomIntensity[], 
  discomfort: string | null, 
  mainSymptom: string | null,
  characteristics: SymptomCharacteristics | null,
  preQuestionnaireAnswers: PreQuestionnaireAnswer[],
  excludedSymptoms: string[],
  selfExamResult: string | null,
  neuroTestAnswers: NeuroTest[],
  crtResult: CapillaryRefillTimeResult | null,
  respiratoryRate: number | null,
  stabilityTestResult: StabilityTestResult | null,
  speechDyspneaResult: SpeechDyspneaResult | null,
  memoryWords: string[] | null,
  memoryResponse: string[] | null
): Promise<ReportData> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `Tu es Med.AI, un assistant médical IA. Analyse les informations fournies pour générer un rapport de diagnostic préliminaire. Le rapport DOIT être en français et structuré en JSON. Inclus TOUJOURS :
1. 'monitoringInstructions': une instruction claire et concise (1-2 phrases) sur les symptômes clés à surveiller dans les 48h.
2. 'possibleIssues': pour chaque problème, fournis 'name', 'confidence' (0-100), 'description' (20-30 mots).
3. 'severity' (Faible, Modéré, Élevé).
4. 'recommendations'.
5. 'prescription' (produits sans ordonnance).
6. 'disclaimer' conseillant de consulter un médecin.
7. 'shortSummaryForPatient' (résumé de 3-4 lignes pour le médecin).
8. 'socialEvictionPeriod': une estimation de la durée d'isolement social recommandée basée sur le diagnostic le plus probable (ex: 'Pour une grippe, il est recommandé de rester à domicile pendant 5-7 jours'). Si non pertinent, retourne une chaîne vide.
9. 'suggestedSpecialist': Basé sur les pathologies les plus probables et l'âge du patient, détermine le spécialiste le plus pertinent. L'objet doit contenir 'slug' (le terme pour l'URL de Doctolib, ex: 'dermatologue', 'podologue', 'pediatre') et 'name' (le nom affichable, ex: 'Dermatologue', 'Podologue', 'Pédiatre'). Si le problème est général, utilise 'medecin-generaliste' et 'Médecin Généraliste'. Si le patient est un enfant (< 16 ans) et que le problème est courant, 'pediatre' et 'Pédiatre' est une bonne option.
10. 'nutritionGuide': Si pertinent pour le diagnostic (ex: gastro-entérite, hypertension), propose un guide de nutrition simple type "Quoi manger ce soir ?". Ex: "Privilégiez des aliments faciles à digérer : riz blanc, compote, banane.". Si non pertinent, retourne une chaîne vide.`;

  const textPart = {
    text: `Voici les informations complètes du patient à analyser :
      
      **Description initiale des symptômes:**
      "${symptoms}"
      
      ${formatContext(context)}
      ${formatIntensityData(intensities, discomfort)}
      ${formatSymptomCharacteristics(mainSymptom, characteristics)}
      ${formatPreQuestionnaire(preQuestionnaireAnswers)}
      ${formatQuestionnaireAnswers(answers)}
      ${formatExcludedSymptoms(excludedSymptoms)}
      ${formatSelfExamResult(selfExamResult)}
      ${formatNeuroTestAnswers(neuroTestAnswers)}
      ${formatCRTResult(crtResult)}
      ${formatRespiratoryRate(respiratoryRate)}
      ${formatStabilityTestResult(stabilityTestResult)}
      ${formatSpeechDyspneaResult(speechDyspneaResult)}
      ${formatMemoryTestResult(memoryWords, memoryResponse)}
    `
  };

  let contents;
  if (imageBase64) {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    };
    contents = { parts: [imagePart, textPart] };
  } else {
    contents = { parts: [textPart] };
  }

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    monitoringInstructions: {
                        type: Type.STRING,
                        description: "Instructions claires sur les symptômes à surveiller dans les 48h et quand consulter en urgence."
                    },
                    possibleIssues: {
                        type: Type.ARRAY,
                        description: "Liste des problèmes de santé probables avec score de confiance et description.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Nom de la pathologie." },
                                confidence: { type: Type.NUMBER, description: "Score de confiance (0-100)." },
                                description: { type: Type.STRING, description: "Brève description de la pathologie." }
                            },
                            required: ["name", "confidence", "description"]
                        }
                    },
                    severity: {
                        type: Type.STRING,
                        description: "Niveau de gravité estimé (Faible, Modéré, Élevé)."
                    },
                    recommendations: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Conseils et prochaines étapes pour le patient."
                    },
                    prescription: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Suggestions de produits sans ordonnance."
                    },
                    disclaimer: {
                        type: Type.STRING,
                        description: "Avertissement obligatoire pour consulter un médecin."
                    },
                    shortSummaryForPatient: {
                        type: Type.STRING,
                        description: "Résumé concis (3-4 lignes) à partager avec un médecin."
                    },
                    socialEvictionPeriod: {
                        type: Type.STRING,
                        description: "Durée d'éviction sociale recommandée. Chaîne vide si non applicable."
                    },
                    suggestedSpecialist: {
                        type: Type.OBJECT,
                        description: "Spécialiste médical suggéré basé sur l'analyse.",
                        properties: {
                            slug: {
                                type: Type.STRING,
                                description: "Le slug de la spécialité pour une URL (ex: 'dermatologue', 'medecin-generaliste')."
                            },
                            name: {
                                type: Type.STRING,
                                description: "Le nom lisible de la spécialité (ex: 'Dermatologue', 'Médecin Généraliste')."
                            }
                        },
                        required: ["slug", "name"]
                    },
                    nutritionGuide: {
                        type: Type.STRING,
                        description: "Guide de nutrition si pertinent. Chaîne vide sinon."
                    }
                },
                required: ["monitoringInstructions", "possibleIssues", "severity", "recommendations", "prescription", "disclaimer", "shortSummaryForPatient", "socialEvictionPeriod", "suggestedSpecialist"]
            }
        }
    });
    
    const jsonString = response.text;
    return JSON.parse(jsonString) as ReportData;

  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Impossible de générer le rapport. Veuillez réessayer.");
  }
}

export async function generateDirectReport(diagnosis: string): Promise<ReportData> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `Tu es Med.AI, un assistant médical IA. Un utilisateur déclare avoir le diagnostic suivant : "${diagnosis}".
  Génère un rapport de soins et d'information au format JSON. Ce n'est PAS un diagnostic, mais des conseils basés sur une condition déclarée.
  Le rapport DOIT être en français et structuré en JSON. Inclus TOUJOURS :
  1. 'monitoringInstructions': Les signes de gravité ou "drapeaux rouges" qui devraient inciter à consulter un médecin immédiatement (1-2 phrases claires).
  2. 'possibleIssues': Crée une seule entrée dans ce tableau. Le 'name' doit être le diagnostic fourni par l'utilisateur (ex: "Grippe (déclarée par l'utilisateur)"). La 'confidence' doit être 100. La 'description' doit être une brève description de la condition.
  3. 'severity': Estime une sévérité typique pour cette condition (Faible, Modéré, Élevé).
  4. 'recommendations': Une liste de conseils pratiques pour l'auto-prise en charge à domicile.
  5. 'prescription': Une liste de suggestions de produits sans ordonnance.
  6. 'disclaimer': Un avertissement TRÈS clair indiquant que ceci est basé sur une auto-déclaration, que ce n'est pas un diagnostic médical et qu'il est crucial de consulter un professionnel de santé pour une évaluation correcte.
  7. 'shortSummaryForPatient': Un résumé pour information, pas pour un médecin. Ex: "Rapport informatif pour une grippe déclarée, avec des conseils de repos et d'hydratation."
  8. 'socialEvictionPeriod': Une estimation de la durée d'isolement social recommandée. Si non pertinent, retourne une chaîne vide.
  9. 'suggestedSpecialist': Le spécialiste le plus pertinent à consulter pour cette condition ('slug' et 'name'). Pour les cas généraux, utilise 'medecin-generaliste' et 'Médecin Généraliste'.
  10. 'nutritionGuide': Si pertinent pour le diagnostic (ex: gastro-entérite, hypertension), propose un guide de nutrition simple type "Quoi manger ce soir ?". Ex: "Privilégiez des aliments faciles à digérer : riz blanc, compote, banane.". Si non pertinent, retourne une chaîne vide.`;

  const prompt = `Génère le rapport pour le diagnostic déclaré : "${diagnosis}"`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: { // Same schema as generateReport
                type: Type.OBJECT,
                properties: {
                    monitoringInstructions: { type: Type.STRING },
                    possibleIssues: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { name: { type: Type.STRING }, confidence: { type: Type.NUMBER }, description: { type: Type.STRING } },
                            required: ["name", "confidence", "description"]
                        }
                    },
                    severity: { type: Type.STRING },
                    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    prescription: { type: Type.ARRAY, items: { type: Type.STRING } },
                    disclaimer: { type: Type.STRING },
                    shortSummaryForPatient: { type: Type.STRING },
                    socialEvictionPeriod: { type: Type.STRING },
                    suggestedSpecialist: {
                        type: Type.OBJECT,
                        properties: { slug: { type: Type.STRING }, name: { type: Type.STRING } },
                        required: ["slug", "name"]
                    },
                    nutritionGuide: { type: Type.STRING }
                },
                required: ["monitoringInstructions", "possibleIssues", "severity", "recommendations", "prescription", "disclaimer", "shortSummaryForPatient", "socialEvictionPeriod", "suggestedSpecialist"]
            }
        }
    });
    
    const jsonString = response.text;
    return JSON.parse(jsonString) as ReportData;

  } catch (error) {
    console.error("Error generating direct report:", error);
    throw new Error("Impossible de générer le rapport. Veuillez réessayer.");
  }
}

export async function generateAppointmentPrepData(report: ReportData): Promise<AppointmentPrepData> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';

  const prompt = `
    En te basant sur le rapport de diagnostic préliminaire suivant, aide le patient à se préparer pour sa consultation médicale.

    Rapport de Med.AI:
    - Hypothèses de diagnostic: ${report.possibleIssues.map(p => `${p.name} (${p.confidence}% de confiance)`).join(', ')}
    - Gravité: ${report.severity}
    - Recommandations: ${report.recommendations.join('; ')}

    Génère deux éléments au format JSON:
    1.  'potentialQuestions': Une liste de 5 questions pertinentes que le médecin pourrait poser au patient.
    2.  'script': Un court "script" de 2-3 phrases que le patient, s'il est stressé, peut lire au médecin pour expliquer la situation de manière claire et concise.

    La réponse doit être uniquement le JSON.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            potentialQuestions: {
              type: Type.ARRAY,
              description: "Liste de questions que le médecin pourrait poser.",
              items: { type: Type.STRING }
            },
            script: {
              type: Type.STRING,
              description: "Script à lire pour le patient."
            }
          },
          required: ["potentialQuestions", "script"]
        }
      }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as AppointmentPrepData;

  } catch (error) {
    console.error("Error generating appointment prep data:", error);
    throw new Error("Impossible de générer l'aide à la préparation du rendez-vous.");
  }
}

export async function generateScenarios(report: ReportData): Promise<ScenarioData> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';

  const prompt = `
    En te basant sur le rapport de diagnostic préliminaire suivant, génère 3 scénarios d'évolution possibles pour le patient : un favorable, un à surveiller, et un inquiétant/grave.
    Chaque scénario doit inclure un titre, un délai (timeline), une liste de signes à observer, et une action claire à entreprendre.

    Rapport de Med.AI:
    - Hypothèses de diagnostic: ${report.possibleIssues.map(p => `${p.name} (${p.confidence}% de confiance)`).join(', ')}
    - Gravité: ${report.severity}

    La réponse doit être un objet JSON unique contenant une clé "scenarios" qui est un tableau de 3 objets scénario.
    Structure pour chaque scénario :
    - type: 'Favorable', 'À surveiller', ou 'Inquiétant'
    - title: ex. "Scénario A : Évolution favorable (probable)"
    - timeline: ex. "Dans les 24h à 48h"
    - signs: Tableau de chaînes de caractères décrivant les symptômes ou leur absence.
    - action: Phrase claire sur la marche à suivre.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarios: {
              type: Type.ARRAY,
              description: "Tableau de 3 scénarios d'évolution.",
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "Type de scénario: Favorable, À surveiller, Inquiétant" },
                  title: { type: Type.STRING, description: "Titre du scénario." },
                  timeline: { type: Type.STRING, description: "Délai d'observation." },
                  signs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Signes à observer." },
                  action: { type: Type.STRING, description: "Action à entreprendre." }
                },
                required: ["type", "title", "timeline", "signs", "action"]
              }
            }
          },
          required: ["scenarios"]
        }
      }
    });

    const jsonString = response.text;
    const parsed = JSON.parse(jsonString) as ScenarioData;
    // Basic validation
    if (!parsed.scenarios || parsed.scenarios.length < 3) {
      throw new Error("La réponse de l'IA pour les scénarios est mal formée.");
    }
    return parsed;

  } catch (error) {
    console.error("Error generating scenarios:", error);
    throw new Error("Impossible de générer les scénarios d'évolution.");
  }
}

function formatPreventionProfile(profile: PreventionProfile): string {
    return `
- Sexe: ${profile.sex}
- Âge: ${profile.age} ans
- Tabagisme: ${profile.smokingStatus}
- Consommation d'alcool: ${profile.alcoholConsumption}
- Activité physique: ${profile.physicalActivity}
- Qualité de l'alimentation: ${profile.dietQuality}
- Antécédents médicaux personnels: ${profile.personalMedicalHistory || "Non spécifiés"}
- Antécédents médicaux familiaux: ${profile.familyMedicalHistory || "Non spécifiés"}
    `;
}

export async function generatePreventionPlan(profile: PreventionProfile): Promise<PreventionPlanData> {
  const ai = getClient();
  const model = 'gemini-2.5-flash';
  const systemInstruction = `Tu es Med.AI, un assistant de prévention santé. Ton rôle est de générer un plan de prévention personnalisé, proactif et bienveillant basé sur le profil de l'utilisateur. Le plan doit être structuré en JSON et en français.
  
  Le plan DOIT contenir les clés suivantes :
  1. 'recommendedScreenings': Dépistages recommandés. Pour chaque dépistage, fournis 'title', 'reason' (pourquoi c'est pertinent pour cet utilisateur), et 'details' (quand et comment le faire).
  2. 'vaccinationAdvice': Conseils de vaccination. Pour chaque vaccin, fournis 'title', 'reason', et 'details'. Inclus les vaccins de base et ceux pertinents pour l'âge/profil.
  3. 'lifestyleSuggestions': Suggestions de style de vie. Propose des conseils ciblés et actionnables. Pour chaque conseil, fournis 'title', 'reason', et 'details'.
  4. 'generalDisclaimer': Un avertissement clair et obligatoire indiquant que ce plan ne remplace pas un avis médical et que l'utilisateur doit consulter un médecin pour valider ces recommandations.
  
  Base tes recommandations sur des lignes directrices de santé publique générales. Sois encourageant et non alarmiste.`;
  
  const prompt = `Génère le plan de prévention pour le profil suivant :\n${formatPreventionProfile(profile)}`;

  const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Le titre de la recommandation." },
      reason: { type: Type.STRING, description: "La raison pour laquelle cette recommandation est pertinente pour l'utilisateur." },
      details: { type: Type.STRING, description: "Les détails sur comment et quand suivre la recommandation." },
    },
    required: ["title", "reason", "details"]
  };
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedScreenings: { type: Type.ARRAY, items: recommendationSchema, description: "Liste des dépistages recommandés." },
            vaccinationAdvice: { type: Type.ARRAY, items: recommendationSchema, description: "Liste des conseils de vaccination." },
            lifestyleSuggestions: { type: Type.ARRAY, items: recommendationSchema, description: "Liste des suggestions de style de vie." },
            generalDisclaimer: { type: Type.STRING, description: "Avertissement général obligatoire." }
          },
          required: ["recommendedScreenings", "vaccinationAdvice", "lifestyleSuggestions", "generalDisclaimer"]
        }
      }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as PreventionPlanData;

  } catch (error) {
    console.error("Error generating prevention plan:", error);
    throw new Error("Impossible de générer le plan de prévention. Veuillez réessayer.");
  }
}

export async function generateRiskAnalysis(profile: PreventionProfile): Promise<RiskAnalysis> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `Tu es un assistant de santé prédictive. Ton rôle est d'analyser le profil de l'utilisateur pour identifier les risques de pathologies chroniques (diabète de type 2, maladies cardiovasculaires, etc.).
    Pour chaque risque identifié (2-3 maximum), fournis :
    1. 'name': Le nom de la pathologie.
    2. 'riskLevel': Un niveau de risque ('Faible', 'Modéré', 'Élevé').
    3. 'explanation': Une explication CLAIRE et PERSONNALISÉE expliquant pourquoi ce risque est identifié, en te basant sur les informations fournies (ex: "Basé sur votre sédentarité et vos antécédents familiaux...").
    4. 'suggestion': Une suggestion d'action CONCRÈTE et chiffrée pour réduire ce risque (ex: "Une augmentation de 30 minutes d'activité physique 3 fois par semaine peut réduire ce risque de moitié.").
    Sois factuel, basé sur des données de santé publique générales, et non alarmiste. La réponse doit être en français et au format JSON.`;

    const prompt = `Analyse le profil suivant et génère l'analyse de risque :\n${formatPreventionProfile(profile)}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        risks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    riskLevel: { type: Type.STRING },
                                    explanation: { type: Type.STRING },
                                    suggestion: { type: Type.STRING },
                                },
                                required: ["name", "riskLevel", "explanation", "suggestion"]
                            }
                        }
                    },
                    required: ["risks"]
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString) as RiskAnalysis;
    } catch (error) {
        console.error("Error generating risk analysis:", error);
        throw new Error("Impossible de générer l'analyse de risque.");
    }
}

export async function analyzeSymptomTrends(journalData: TrackedSymptom[]): Promise<TrendAnalysis> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const systemInstruction = `Tu es un assistant médical IA spécialisé dans l'analyse de données de santé. Analyse les données du journal de symptômes d'un patient pour y déceler des tendances ou des corrélations potentiellement significatives.
    La réponse doit être en français et au format JSON avec deux clés :
    1. 'summary': Un résumé global de 1-2 phrases sur l'évolution générale.
    2. 'findings': Un tableau d'objets. Chaque objet représente une découverte et doit contenir :
        - 'finding': Une description concise de la tendance ou corrélation (ex: "Augmentation de l'essoufflement corrélée à une augmentation de la fatigue").
        - 'explanation': Une brève explication sur la pertinence de cette découverte et un conseil (ex: "Cette corrélation pourrait indiquer... Il serait pertinent d'en discuter avec votre médecin.").
    Identifie 1 à 3 découvertes pertinentes maximum. Si aucune tendance notable n'est trouvée, le tableau 'findings' peut être vide et le résumé doit l'indiquer.`;

    const formattedJournal = journalData.map(symptom => {
        const logs = symptom.logs.map(log => `- ${log.date}: Intensité ${log.intensity}/10${log.notes ? ` (Notes: ${log.notes})` : ''}`).join('\n');
        return `Symptôme: "${symptom.name}"\n${logs}`;
    }).join('\n\n');

    const prompt = `Voici le journal de symptômes du patient. Analyse-le pour trouver des tendances.\n\n${formattedJournal}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        findings: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    finding: { type: Type.STRING },
                                    explanation: { type: Type.STRING },
                                },
                                required: ["finding", "explanation"]
                            }
                        }
                    },
                    required: ["summary", "findings"]
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString) as TrendAnalysis;
    } catch (error) {
        console.error("Error analyzing symptom trends:", error);
        throw new Error("Impossible d'analyser les tendances des symptômes.");
    }
}


export async function generateMedicationSideEffects(medicationName: string): Promise<MedicationSideEffectInfo> {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    const prompt = `Pour le médicament "${medicationName}", génère une liste d'effets secondaires potentiels.
    Fais la distinction claire entre les effets "communs" (fréquents et souvent bénins) et les effets "rares" (rares mais potentiellement graves).
    Pour les effets rares, inclus un avertissement clair sur quand contacter un médecin.
    Fournis 3 à 5 effets communs et 2 à 3 effets rares.
    La réponse doit être en français et uniquement au format JSON.`;

    const sideEffectSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Nom de l'effet secondaire." },
            description: { type: Type.STRING, description: "Brève description de l'effet." },
        },
        required: ["name", "description"]
    };

    const rareSideEffectSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Nom de l'effet secondaire rare." },
            description: { type: Type.STRING, description: "Brève description de l'effet." },
            warning: { type: Type.STRING, description: "Avertissement clair sur la conduite à tenir." },
        },
        required: ["name", "description", "warning"]
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        common: { type: Type.ARRAY, items: sideEffectSchema, description: "Liste des effets secondaires courants." },
                        rare: { type: Type.ARRAY, items: rareSideEffectSchema, description: "Liste des effets secondaires rares et graves." },
                    },
                    required: ["common", "rare"]
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString) as MedicationSideEffectInfo;
    } catch (error) {
        console.error("Error generating medication side effects:", error);
        throw new Error("Impossible de récupérer les informations sur les effets secondaires pour ce médicament.");
    }
}