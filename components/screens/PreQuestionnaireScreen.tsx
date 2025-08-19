import React, { useState } from 'react';
import type { PreQuestionnaireAnswer } from '../../types';
import { ClipboardListIcon } from '../icons';

const questions = [
  "Avez-vous récemment été en contact avec une personne malade ?",
  "Avez-vous récemment pratiqué une activité physique intense ou inhabituelle ?",
  "Avez-vous récemment pris un nouveau traitement ou antibiotique ?",
  "Avez-vous récemment reçu un vaccin ?",
  "Avez-vous récemment mangé quelque chose d'inhabituel ou potentiellement avarié ?",
  "Avez-vous connu un stress important ou un choc émotionnel récemment ?",
];

interface AnswerState {
  answer: boolean | null;
  details: string;
}

interface PreQuestionnaireScreenProps {
  onSubmit: (answers: PreQuestionnaireAnswer[]) => void;
}

const PreQuestionnaireScreen: React.FC<PreQuestionnaireScreenProps> = ({ onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(
    questions.reduce((acc, q) => ({ ...acc, [q]: { answer: null, details: '' } }), {})
  );

  const handleAnswerChange = (question: string, answer: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [question]: { ...prev[question], answer }
    }));
  };

  const handleDetailsChange = (question: string, details: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: { ...prev[question], details }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAnswers: PreQuestionnaireAnswer[] = Object.entries(answers)
      .map(([question, value]) => ({
        question,
        answer: value.answer === true, // Default to false if null
        details: value.answer ? value.details : '',
      }));
    onSubmit(formattedAnswers);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <ClipboardListIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Questionnaire Contextuel</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Quelques questions rapides pour mieux comprendre le contexte de vos symptômes.
      </p>

      <form onSubmit={handleSubmit} className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="p-4 rounded-lg border border-slate-700/80 bg-slate-800/50">
            <p className="font-semibold text-slate-200 mb-3">{question}</p>
            <div className="flex items-center gap-4 mb-3">
              <button
                type="button"
                onClick={() => handleAnswerChange(question, true)}
                className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${answers[question].answer === true ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              >
                Oui
              </button>
              <button
                type="button"
                onClick={() => handleAnswerChange(question, false)}
                className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${answers[question].answer === false ? 'bg-slate-600 border-slate-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              >
                Non
              </button>
            </div>
            {answers[question].answer === true && (
              <div className="mt-4 transition-all duration-300 ease-in-out">
                <label htmlFor={`details-${index}`} className="text-sm text-slate-400 mb-1 block">Si oui, veuillez préciser :</label>
                <input
                  id={`details-${index}`}
                  type="text"
                  value={answers[question].details}
                  onChange={(e) => handleDetailsChange(question, e.target.value)}
                  className="w-full p-2 rounded-md bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200"
                  placeholder="Ex: Mon enfant a la grippe..."
                />
              </div>
            )}
          </div>
        ))}

        <div className="pt-4 border-t border-slate-700">
          <button
            type="submit"
            className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2"
          >
            Continuer
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreQuestionnaireScreen;