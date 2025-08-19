
import React from 'react';
import { WarningIcon } from '../icons';

interface EmergencyGuideScreenProps {
  onBack: () => void;
}

const EmergencyGuideScreen: React.FC<EmergencyGuideScreenProps> = ({ onBack }) => {
  const emergencySigns = [
    'Difficulté à respirer',
    'Douleur ou pression dans la poitrine',
    'Perte de conscience ou confusion soudaine',
    'Difficulté à parler, faiblesse d\'un côté du corps',
    'Saignement abondant et incontrôlable',
    'Réaction allergique sévère (gonflement du visage, difficulté à respirer)',
    'Forte fièvre chez un nourrisson',
  ];

  const emergencyNumbers = [
      { num: '15', service: 'SAMU (Urgence médicale)' },
      { num: '18', service: 'Pompiers (Secours et incendie)' },
      { num: '112', service: 'Numéro d\'urgence européen' },
  ]

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="bg-red-500/10 p-4 rounded-full mb-6 border border-red-500/30">
        <WarningIcon className="h-10 w-10 text-red-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-red-400">En cas d'Urgence Vitale</h1>
      <p className="mt-4 text-center text-slate-300 text-xl font-semibold">
        Appelez <span className="underline">immédiatement</span> les services d'urgence. N'utilisez pas cette application.
      </p>

      <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {emergencyNumbers.map(({num, service}) => (
            <a key={num} href={`tel:${num}`} className="block text-center bg-red-600 text-white p-4 rounded-lg hover:bg-red-500 transition-colors shadow-lg">
                <p className="text-4xl font-bold">{num}</p>
                <p className="text-sm">{service}</p>
            </a>
        ))}
      </div>

      <div className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700">
        <h2 className="text-2xl font-semibold text-slate-100 mb-4">Quand appeler les secours ?</h2>
        <p className="text-slate-400 mb-4">Si vous ou une autre personne présentez l'un de ces signes, n'hésitez pas :</p>
        <ul className="list-disc list-inside space-y-2 text-slate-200">
          {emergencySigns.map((sign, index) => (
            <li key={index}>{sign}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onBack}
        className="w-full max-w-xs mt-8 bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition duration-200 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Retour à l'accueil
      </button>
    </div>
  );
};

export default EmergencyGuideScreen;
