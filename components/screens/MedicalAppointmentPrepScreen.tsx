
import React, { useState } from 'react';
import type { AppointmentPrepData } from '../../types';
import {
  ClipboardDocumentCheckIcon,
  ChatBubbleBottomCenterTextIcon,
  QuestionMarkCircleIcon,
  ClipboardIcon,
  DocumentArrowDownIcon,
} from '../icons';

interface MedicalAppointmentPrepScreenProps {
  prepData: AppointmentPrepData;
  onBackToReport: () => void;
  onGoToSummary: () => void;
}

const MedicalAppointmentPrepScreen: React.FC<MedicalAppointmentPrepScreenProps> = ({ prepData, onBackToReport, onGoToSummary }) => {
  const [scriptCopyText, setScriptCopyText] = useState('Copier le script');

  const handleCopyScript = () => {
    navigator.clipboard.writeText(prepData.script);
    setScriptCopyText('Copié !');
    setTimeout(() => setScriptCopyText('Copier le script'), 2000);
  };

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
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-sky-500/10 p-4 rounded-full border border-sky-500/30">
          <ClipboardDocumentCheckIcon className="h-10 w-10 text-sky-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Préparer ma Consultation</h1>
          <p className="mt-1 text-slate-400">Quelques outils pour vous aider lors de votre rendez-vous.</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <Section title="À dire au médecin / pharmacien" icon={<ChatBubbleBottomCenterTextIcon className="h-7 w-7 text-sky-400" />}>
          <p className="text-sm text-slate-400 mb-4">
            Si vous êtes stressé ou ne savez pas comment commencer, vous pouvez lire ce court texte.
          </p>
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-4">
            <blockquote className="text-slate-200 italic">
             "{prepData.script}"
            </blockquote>
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-2 text-sm bg-sky-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-sky-500 transition-colors"
            >
              <ClipboardIcon className="h-4 w-4" />
              {scriptCopyText}
            </button>
          </div>
        </Section>

        <Section title="Ce que le médecin pourrait vous demander" icon={<QuestionMarkCircleIcon className="h-7 w-7 text-sky-400" />}>
            <p className="text-sm text-slate-400 mb-4">
              Pensez à ces questions pour préparer vos réponses.
            </p>
          <ul className="list-disc list-inside space-y-2 text-slate-200">
            {prepData.potentialQuestions.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </Section>
      </div>
      
      <div className="mt-10 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button onClick={onBackToReport} className="w-full sm:w-auto bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-500 transition duration-200">
            Retourner au Rapport
          </button>
           <button onClick={onGoToSummary} className="w-full sm:w-auto bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2">
                <DocumentArrowDownIcon className="h-6 w-6" />
                Voir le Bilan Détaillé
            </button>
      </div>

    </div>
  );
};

export default MedicalAppointmentPrepScreen;
