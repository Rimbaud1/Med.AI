
import React, { useState } from 'react';
import type { NeuroTest } from '../../types';
import { BrainIcon } from '../icons';

interface NeuroTestScreenProps {
  questions: string[];
  onSubmit: (answers: NeuroTest[]) => void;
  onSkip: () => void;
}

const NeuroTestScreen: React.FC<NeuroTestScreenProps> = ({ questions, onSubmit, onSkip }) => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const handleAnswerChange = (question: string, answer: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const allQuestionsAnswered = questions.every(q => answers[q] !== undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allQuestionsAnswered) return;

    const formattedAnswers: NeuroTest[] = questions.map(question => ({
      question,
      answer: answers[question],
    }));
    onSubmit(formattedAnswers);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <BrainIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Test Neurologique Simplifié</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        L'IA a identifié une pertinence pour quelques vérifications simples. Veuillez répondre aux questions suivantes.
      </p>

      <form onSubmit={handleSubmit} className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="p-4 rounded-lg border border-slate-700/80 bg-slate-800/50">
            <p className="font-semibold text-slate-200 mb-3">{question}</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleAnswerChange(question, true)}
                className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${answers[question] === true ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              >
                Oui
              </button>
              <button
                type="button"
                onClick={() => handleAnswerChange(question, false)}
                className={`px-6 py-2 rounded-md border text-sm font-medium transition-colors ${answers[question] === false ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              >
                Non
              </button>
            </div>
          </div>
        ))}
        
        <div className="pt-4 mt-4 border-t border-slate-700 flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={onSkip}
              className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition duration-200"
            >
              Passer cette étape
            </button>
            <button
              type="submit"
              disabled={!allQuestionsAnswered}
              className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
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

export default NeuroTestScreen;
