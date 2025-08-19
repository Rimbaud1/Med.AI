
import React from 'react';
import type { Scenario } from '../../types';
import { ShieldExclamationIcon, WarningIcon, CheckCircleIcon, ArrowTrendingUpIcon, InformationCircleIcon } from '../icons';

interface ScenarioCardProps {
  scenario: Scenario;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  const styles = {
    Favorable: {
      borderColor: 'border-green-500/50',
      bgColor: 'bg-green-500/10',
      icon: <CheckCircleIcon className="h-8 w-8 text-green-400" />,
      titleColor: 'text-green-300'
    },
    'À surveiller': {
      borderColor: 'border-yellow-500/50',
      bgColor: 'bg-yellow-500/10',
      icon: <WarningIcon className="h-8 w-8 text-yellow-400" />,
      titleColor: 'text-yellow-300'
    },
    Inquiétant: {
      borderColor: 'border-red-500/50',
      bgColor: 'bg-red-500/10',
      icon: <ShieldExclamationIcon className="h-8 w-8 text-red-400" />,
      titleColor: 'text-red-300'
    },
  };

  const defaultStyle = {
    borderColor: 'border-slate-500/50',
    bgColor: 'bg-slate-700/20',
    icon: <InformationCircleIcon className="h-8 w-8 text-slate-400" />,
    titleColor: 'text-slate-300'
  };

  const style = styles[scenario.type as keyof typeof styles] || defaultStyle;

  return (
    <div className={`p-6 rounded-lg border ${style.borderColor} ${style.bgColor} shadow-lg`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">{style.icon}</div>
        <div>
          <h3 className={`text-xl font-bold ${style.titleColor}`}>{scenario.title}</h3>
          <p className="text-sm text-slate-400">{scenario.timeline}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-slate-200 mb-2">Signes à observer :</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
            {scenario.signs.map((sign, i) => <li key={i}>{sign}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 mb-2">Action recommandée :</h4>
          <p className="text-slate-200 bg-slate-900/40 p-3 rounded-md border border-slate-700/50">{scenario.action}</p>
        </div>
      </div>
    </div>
  );
};

interface ScenarioSimulatorScreenProps {
  scenarios: Scenario[];
  onBackToReport: () => void;
}

const ScenarioSimulatorScreen: React.FC<ScenarioSimulatorScreenProps> = ({ scenarios, onBackToReport }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-center text-center gap-4 mb-8">
         <div className="bg-indigo-500/10 p-4 rounded-full border border-indigo-500/30">
            <ArrowTrendingUpIcon className="h-10 w-10 text-indigo-400" />
        </div>
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Simulateur d'Évolution</h1>
            <p className="mt-1 text-slate-400">Scénarios possibles basés sur vos réponses. Ceci est une simulation, pas une certitude.</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {scenarios.sort((a,b) => {
            const order = { 'Favorable': 1, 'À surveiller': 2, 'Inquiétant': 3 };
            const orderA = order[a.type as keyof typeof order] || 4;
            const orderB = order[b.type as keyof typeof order] || 4;
            return orderA - orderB;
        }).map((scenario, index) => (
          <ScenarioCard key={index} scenario={scenario} />
        ))}
      </div>
      
      <div className="mt-10 pt-6 border-t border-slate-700 text-center">
        <button
          onClick={onBackToReport}
          className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200"
        >
          Retourner au Rapport
        </button>
      </div>
    </div>
  );
};

export default ScenarioSimulatorScreen;
