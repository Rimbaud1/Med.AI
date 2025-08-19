
import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ReportData, PatientContext, Answer, SymptomIntensity, SymptomCharacteristics, PreQuestionnaireAnswer, NeuroTest, StabilityTestResult, CapillaryRefillTimeResult, SpeechDyspneaResult } from '../../types';
import { StethoscopeIcon, UserCircleIcon, ClipboardListIcon, ChartBarIcon, InformationCircleIcon, ShieldExclamationIcon, CameraIcon, SparklesIcon, DocumentArrowDownIcon, MagnifyingGlassIcon, BrainIcon, AcademicCapIcon, LungIcon, ScaleIcon, HandThumbUpIcon, SpeakerWaveIcon } from '../icons';

interface DiagnosticSummaryScreenProps {
  onBackToReport: () => void;
  patientContext: PatientContext;
  initialSymptoms: string;
  mainSymptom: string | null;
  symptomIntensities: SymptomIntensity[];
  overallDiscomfort: string | null;
  symptomCharacteristics: SymptomCharacteristics | null;
  preQuestionnaireAnswers: PreQuestionnaireAnswer[];
  answers: Answer[];
  excludedSymptoms: string[];
  selfExamResult: string | null;
  neuroTestAnswers: NeuroTest[];
  crtResult: CapillaryRefillTimeResult | null;
  respiratoryRate: number | null;
  stabilityTestResult: StabilityTestResult | null;
  speechDyspneaResult: SpeechDyspneaResult | null;
  photoBase64: string | null;
  report: ReportData;
  memoryTestWords?: string[] | null;
  memoryTestResponse?: string[] | null;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
    <div className={`bg-slate-800/50 p-5 rounded-lg border border-slate-700/80 mb-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
            {icon}
            <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        </div>
        <div className="text-slate-300 space-y-2">{children}</div>
    </div>
);

const InfoPair: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode }> = ({ label, value, children }) => {
    if ((value === null || value === undefined || value === '') && !children) return null;
    return (
        <div className="flex flex-col sm:flex-row">
            <p className="w-full sm:w-1/3 font-semibold text-slate-300">{label}:</p>
            <div className="w-full sm:w-2/3 text-slate-200">{value || children}</div>
        </div>
    );
};


const DiagnosticSummaryScreen: React.FC<DiagnosticSummaryScreenProps> = (props) => {
    const { onBackToReport, patientContext, initialSymptoms, mainSymptom, symptomIntensities, overallDiscomfort, symptomCharacteristics, preQuestionnaireAnswers, answers, excludedSymptoms, selfExamResult, neuroTestAnswers, crtResult, respiratoryRate, stabilityTestResult, speechDyspneaResult, photoBase64, report, memoryTestWords, memoryTestResponse } = props;
    const summaryContentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleDownloadPDF = async () => {
        const content = summaryContentRef.current;
        if (!content) return;
        
        setIsDownloading(true);

        // Temporarily add a class to the body for printing styles
        document.body.classList.add('print-bg-slate-800');
        document.body.classList.add('print-text-slate-100');


        const canvas = await html2canvas(content, {
            scale: 2,
            backgroundColor: '#1e293b', // slate-800
            useCORS: true,
        });
        
        // Remove the temporary class after canvas is generated
        document.body.classList.remove('print-bg-slate-800');
        document.body.classList.remove('print-text-slate-100');

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`Bilan_MedAI_${new Date().toLocaleDateString()}.pdf`);
        setIsDownloading(false);
    };

    const getMemoryTestSummary = () => {
        if (!memoryTestWords || !memoryTestResponse) return null;
        const correctCount = memoryTestResponse.filter(word => memoryTestWords.map(w => w.toLowerCase()).includes(word.trim().toLowerCase())).length;
        return `${correctCount} / ${memoryTestWords.length}`;
    };

    const getSpeechDyspneaSummary = () => {
        if (!speechDyspneaResult) return null;
        if (speechDyspneaResult.wordsRead === speechDyspneaResult.totalWords) {
            return "Phrase complète (Normal)";
        }
        return `${speechDyspneaResult.wordsRead} / ${speechDyspneaResult.totalWords} mots lus`;
    };


    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="print-hide flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Récapitulatif du Diagnostic</h1>
                <div className="flex gap-4">
                    <button onClick={onBackToReport} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition duration-200">
                        Retour
                    </button>
                    <button onClick={handleDownloadPDF} disabled={isDownloading} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2 disabled:bg-slate-700">
                        <DocumentArrowDownIcon className="h-6 w-6" />
                        {isDownloading ? 'Génération...' : 'Télécharger en PDF'}
                    </button>
                </div>
            </div>

            <div ref={summaryContentRef} className="bg-slate-800 p-6 md:p-8 rounded-lg">
                <div className="flex justify-between items-start mb-8 border-b-2 border-sky-500 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Bilan Préliminaire Med.AI</h2>
                        <p className="text-slate-400">Généré le: {new Date().toLocaleString('fr-FR')}</p>
                    </div>
                    <StethoscopeIcon className="h-12 w-12 text-sky-400" />
                </div>
                
                <Section title="Informations Patient" icon={<UserCircleIcon className="h-7 w-7 text-sky-400" />}>
                    <InfoPair label="Sexe" value={patientContext.sex} />
                    <InfoPair label="Âge" value={`${patientContext.age} ans`} />
                    <InfoPair label="Poids" value={patientContext.weight ? `${patientContext.weight} kg` : 'Non spécifié'} />
                    <InfoPair label="Lieu" value={patientContext.location || 'Non spécifié'} />
                    <InfoPair label="Pathologies connues" value={patientContext.existingConditions || 'Aucune'} />
                    <InfoPair label="Traitements en cours" value={patientContext.currentMedications || 'Aucun'} />
                    <InfoPair label="Allergies" value={patientContext.allergies || 'Aucune'} />
                    <InfoPair label="Voyages récents" value={patientContext.recentTravels || 'Aucun'} />
                </Section>
                
                <Section title="Description Initiale" icon={<ClipboardListIcon className="h-7 w-7 text-sky-400" />}>
                    <p className="italic text-slate-200">"{initialSymptoms}"</p>
                </Section>
                
                <Section title="Évaluation des Symptômes" icon={<ChartBarIcon className="h-7 w-7 text-sky-400" />}>
                    <InfoPair label="Symptôme principal" value={mainSymptom} />
                    {symptomIntensities.length > 0 && (
                        <InfoPair label="Intensité des symptômes">
                            <ul className="list-disc list-inside">
                                {symptomIntensities.map(s => <li key={s.name}>{s.name}: {s.score}/10</li>)}
                            </ul>
                        </InfoPair>
                    )}
                    <InfoPair label="Gêne générale" value={overallDiscomfort || 'Non spécifiée'} />
                </Section>
                
                {symptomCharacteristics && Object.keys(symptomCharacteristics).length > 0 && (
                    <Section title="Caractéristiques des Symptômes" icon={<InformationCircleIcon className="h-7 w-7 text-sky-400" />}>
                        <InfoPair label="Température" value={symptomCharacteristics.temperature ? `${symptomCharacteristics.temperature}°C` : 'Non mesurée'} />
                        <InfoPair label="Entourage malade" value={symptomCharacteristics.entourageHasSymptoms === undefined ? 'Non spécifié' : (symptomCharacteristics.entourageHasSymptoms ? 'Oui' : 'Non')} />
                        <InfoPair label="Rythme des symptômes" value={symptomCharacteristics.timing || 'Non spécifié'} />
                    </Section>
                )}

                {preQuestionnaireAnswers.filter(a => a.answer).length > 0 && (
                     <Section title="Questionnaire Contextuel" icon={<ClipboardListIcon className="h-7 w-7 text-sky-400" />}>
                        <ul className="list-disc list-inside">
                          {preQuestionnaireAnswers.filter(a => a.answer).map(a => (
                            <li key={a.question}>{a.question.replace('Avez-vous', 'A')}{a.details ? `: ${a.details}` : ''}</li>
                          ))}
                        </ul>
                    </Section>
                )}
                
                <Section title="Questionnaire Détaillé" icon={<ClipboardListIcon className="h-7 w-7 text-sky-400" />}>
                   {answers.map((a, i) => (
                       <div key={i} className="py-2">
                           <p className="font-semibold text-slate-300">{a.question}</p>
                           <p className="text-slate-200 pl-4">- {a.answer}</p>
                       </div>
                   ))}
                </Section>

                {memoryTestWords && memoryTestWords.length > 0 && (
                    <Section title="Test de Mémoire à Court Terme" icon={<BrainIcon className="h-7 w-7 text-sky-400" />}>
                        <InfoPair label="Mots à retenir" value={memoryTestWords.join(', ')} />
                        <InfoPair label="Mots restitués" value={memoryTestResponse?.join(', ') || 'Aucun'} />
                        <InfoPair label="Score" value={getMemoryTestSummary()} />
                    </Section>
                )}

                {selfExamResult && (
                    <Section title="Résultat de l'Auto-Examen Guidé" icon={<MagnifyingGlassIcon className="h-7 w-7 text-sky-400" />}>
                        <p className="italic text-slate-200">"{selfExamResult}"</p>
                    </Section>
                )}

                {neuroTestAnswers.length > 0 && (
                    <Section title="Test Neurologique Simplifié" icon={<BrainIcon className="h-7 w-7 text-sky-400" />}>
                        {neuroTestAnswers.map((a, i) => (
                            <div key={i} className="py-2">
                                <p className="font-semibold text-slate-300">{a.question}</p>
                                <p className={`font-bold pl-4 ${!a.answer ? 'text-slate-200' : 'text-red-400'}`}>- Réponse: {!a.answer ? 'Non (Normal)' : 'Oui (Anormal)'}</p>
                            </div>
                        ))}
                    </Section>
                )}

                {(respiratoryRate !== null || speechDyspneaResult) && (
                     <Section title="Tests de la Fonction Respiratoire" icon={<LungIcon className="h-7 w-7 text-sky-400" />}>
                         {respiratoryRate !== null && (
                            <InfoPair label="Fréquence respiratoire" value={`${respiratoryRate} respirations/minute`} />
                         )}
                         {speechDyspneaResult && (
                            <InfoPair label="Test d'essoufflement" value={getSpeechDyspneaSummary()} />
                         )}
                     </Section>
                )}

                {crtResult && (
                    <Section title="Test de Temps de Recoloration Cutanée (TRC)" icon={<HandThumbUpIcon className="h-7 w-7 text-sky-400" />}>
                         <InfoPair label="Résultat" value={crtResult} />
                    </Section>
                )}
                
                {stabilityTestResult && (
                    <Section title="Test de Stabilité" icon={<ScaleIcon className="h-7 w-7 text-sky-400" />}>
                         <InfoPair label="Résultat" value={stabilityTestResult} />
                    </Section>
                )}

                {excludedSymptoms.length > 0 && (
                    <Section title="Symptômes Explicitement Absents" icon={<ShieldExclamationIcon className="h-7 w-7 text-red-400" />}>
                        <ul className="list-disc list-inside grid grid-cols-2 gap-x-4">
                            {excludedSymptoms.map(s => <li key={s}>{s}</li>)}
                        </ul>
                    </Section>
                )}
                
                {photoBase64 && (
                    <Section title="Photo Fournie" icon={<CameraIcon className="h-7 w-7 text-sky-400" />}>
                        <img src={`data:image/jpeg;base64,${photoBase64}`} alt="Photo fournie par l'utilisateur" className="rounded-lg max-h-96 w-auto mx-auto"/>
                    </Section>
                )}

                <Section title="Analyse & Rapport de Med.AI" icon={<SparklesIcon className="h-7 w-7 text-sky-400" />}>
                    <InfoPair label="Niveau de gravité estimé" value={report.severity} />
                    <InfoPair label="Problèmes possibles">
                        <ul className="space-y-2 mt-1">
                            {report.possibleIssues.map(issue => (
                                <li key={issue.name}>
                                    <strong>{issue.name}</strong> (Confiance: {issue.confidence}%)
                                    <p className="text-sm text-slate-400 pl-2">{issue.description}</p>
                                </li>
                            ))}
                        </ul>
                    </InfoPair>
                    <InfoPair label="Recommandations">
                        <ul className="list-disc list-inside mt-1">
                           {report.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                    </InfoPair>
                     <InfoPair label="Ordonnance suggérée">
                        <ul className="list-disc list-inside mt-1">
                           {report.prescription.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </InfoPair>
                    <InfoPair label="Éviction sociale" value={report.socialEvictionPeriod} />
                    {report.nutritionGuide && (
                        <InfoPair label="Guide Nutritionnel" value={report.nutritionGuide} />
                    )}
                </Section>
                
                <div className="mt-8 pt-4 border-t-2 border-slate-700 text-center text-xs text-slate-500">
                    <p className="font-bold">Avertissement Important</p>
                    <p>{report.disclaimer}</p>
                    <p className="mt-2">Ce document est un récapitulatif généré par une IA et ne remplace en aucun cas un avis médical professionnel.</p>
                </div>
            </div>
        </div>
    );
};

export default DiagnosticSummaryScreen;
