
import React, { useState } from 'react';
import type { Question, Answer } from '../../types';
import { InformationCircleIcon } from '../icons';

interface QuestionnaireScreenProps {
  questions: Question[];
  onSubmit: (answers: Answer[]) => void;
}

const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({ questions, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAnswer, setCustomAnswer] = useState('');

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, { question: currentQuestion.question, answer }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowCustomInput(false);
      setCustomAnswer('');
    } else {
      onSubmit(newAnswers);
    }
  };

  const handleCustomAnswerClick = () => {
    setShowCustomInput(true);
  };

  const handleCustomAnswerSubmit = () => {
    if (customAnswer.trim()) {
      handleAnswer(customAnswer.trim());
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6">
        <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
      </div>

      <div className="w-full bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-100 mb-2">Question {currentQuestionIndex + 1}/{questions.length}</h2>
        <p className="text-lg text-slate-300 mb-6">{currentQuestion.question}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(choice.text)}
              className="p-4 bg-slate-700/80 rounded-lg text-left hover:bg-sky-600 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 relative group flex items-center justify-between"
            >
              <span>{choice.text}</span>
              {choice.definition && (
                <>
                  <InformationCircleIcon className="h-5 w-5 text-slate-400 group-hover:text-white ml-2 flex-shrink-0" />
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl text-sm text-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none z-10"
                    role="tooltip"
                  >
                    <p className="font-bold text-slate-100 mb-1.5">Définition</p>
                    <p>{choice.definition}</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-700"></div>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-700 pt-6">
          {!showCustomInput ? (
            <button
              onClick={handleCustomAnswerClick}
              className="w-full p-4 bg-slate-700 rounded-lg text-center text-slate-300 hover:bg-slate-600 transition duration-200"
            >
              Aucune de ces réponses
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <label htmlFor="custom-answer" className="text-slate-400">Veuillez préciser votre réponse :</label>
              <textarea
                id="custom-answer"
                value={customAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                className="w-full h-24 p-3 rounded-lg bg-slate-900 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200"
                placeholder="Décrivez votre réponse ici..."
              />
              <button
                onClick={handleCustomAnswerSubmit}
                disabled={!customAnswer.trim()}
                className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:text-slate-400 transition duration-200"
              >
                Soumettre ma réponse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireScreen;
