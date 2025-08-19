
import React from 'react';
import type { SpeechDyspneaResult } from '../../types';
import { SpeakerWaveIcon } from '../icons';

interface SpeechDyspneaScreenProps {
  onSubmit: (result: SpeechDyspneaResult | null) => void;
}

const SpeechDyspneaScreen: React.FC<SpeechDyspneaScreenProps> = ({ onSubmit }) => {
    const sentence = "Aujourd'hui, je prends le temps d'évaluer ma situation avec précision.";
    const words = sentence.split(' ');

    const handleWordClick = (index: number) => {
        onSubmit({ wordsRead: index + 1, totalWords: words.length });
    };

    const handleCompletion = () => {
        onSubmit({ wordsRead: words.length, totalWords: words.length });
    };
    
    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
            <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
                <SpeakerWaveIcon className="h-10 w-10 text-sky-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Test d'Essoufflement à la Parole</h1>
            <p className="mt-4 text-center text-slate-400 max-w-lg">
                Inspirez profondément, puis lisez la phrase suivante à voix haute et à vitesse normale, <strong>sans reprendre votre respiration</strong>. Cliquez sur le dernier mot que vous avez pu prononcer.
            </p>

            <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 text-center">
                <h2 className="text-lg font-semibold text-slate-300 mb-4">Phrase à lire :</h2>
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    <p className="text-2xl font-medium text-slate-200 leading-relaxed">
                        {words.map((word, index) => (
                            <span 
                                key={index} 
                                onClick={() => handleWordClick(index)}
                                className="cursor-pointer hover:bg-sky-600 p-1 rounded-md transition-colors duration-150"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && handleWordClick(index)}
                            >
                                {word}{' '}
                            </span>
                        ))}
                    </p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-700">
                    <p className="text-slate-400 mb-4">Ou si vous avez terminé sans problème :</p>
                    <button
                        onClick={handleCompletion}
                        className="w-full md:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition duration-200"
                    >
                        J'ai pu finir la phrase sans reprendre mon souffle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpeechDyspneaScreen;
