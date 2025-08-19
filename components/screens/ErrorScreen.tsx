
import React from 'react';
import { WarningIcon } from '../icons';

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 text-center bg-slate-800 rounded-lg border border-slate-700">
      <WarningIcon className="h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-slate-100 mb-2">Une erreur est survenue</h2>
      <p className="text-slate-400 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-500 transition duration-200"
      >
        Réessayer
      </button>
    </div>
  );
};

export default ErrorScreen;
