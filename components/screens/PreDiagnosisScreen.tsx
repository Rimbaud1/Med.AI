
import React from 'react';
import { ClipboardDocumentCheckIcon } from '../icons';

interface PreDiagnosisScreenProps {
  onContinue: () => void;
}

const PreDiagnosisScreen: React.FC<PreDiagnosisScreenProps> = ({ onContinue }) => {
  const prepItems = [
    { text: "Prendre votre température", detail: "Une mesure précise est souvent utile." },
    { text: "Vous peser", detail: "Le poids aide à contextualiser les symptômes." },
    { text: "Lister vos traitements actuels", detail: "Noms et dosages si possible." },
    { text: "Noter vos allergies et pathologies", detail: "Toute information est pertinente." },
    { text: "Vous installer au calme", detail: "Prenez le temps de répondre avec précision." }
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <ClipboardDocumentCheckIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Avant de commencer</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Pour un bilan plus précis, voici 5 choses à préparer.
        <br />
        <span className="text-sm">(Ceci est conseillé mais pas obligatoire)</span>
      </p>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-4">
        {prepItems.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm mt-1">
              {index + 1}
            </div>
            <div>
              <p className="font-semibold text-slate-200">{item.text}</p>
              <p className="text-slate-400 text-sm">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-2xl mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2"
      >
        J'ai compris, commencer le diagnostic
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default PreDiagnosisScreen;