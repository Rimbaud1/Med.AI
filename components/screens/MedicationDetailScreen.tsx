
import React, { useState } from 'react';
import type { Medication } from '../../types';
import { PillIcon, SparklesIcon, WarningIcon, CheckCircleIcon, BookOpenIcon } from '../icons';

interface MedicationDetailScreenProps {
  medication: Medication;
  onUpdateSideEffectNotes: (medicationId: string, notes: string) => void;
  onBack: () => void;
}

const MedicationDetailScreen: React.FC<MedicationDetailScreenProps> = ({ medication, onUpdateSideEffectNotes, onBack }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysLog = medication.trackedSideEffects?.find(log => log.date === today);
    const [notes, setNotes] = useState(todaysLog?.notes || '');

    const handleSave = () => {
        onUpdateSideEffectNotes(medication.id, notes);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-amber-500/10 p-3 rounded-full border border-amber-500/30">
                        <PillIcon className="h-8 w-8 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100">{medication.name}</h1>
                        <p className="mt-1 text-slate-400">Suivi des effets secondaires</p>
                    </div>
                </div>
                <button onClick={onBack} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Retour au pilulier</button>
            </div>

            <div className="space-y-6">
                {/* AI Analysis Section */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                        <SparklesIcon className="h-7 w-7 text-sky-400" />
                        <h3 className="text-xl font-semibold text-slate-100">Analyse par Med.AI</h3>
                    </div>

                    {/* Common Side Effects */}
                    <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-700/80">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircleIcon className="h-6 w-6 text-green-400" />
                            <h4 className="font-semibold text-green-300">Effets secondaires courants (généralement bénins)</h4>
                        </div>
                        <ul className="space-y-2">
                            {medication.sideEffectInfo?.common.map(effect => (
                                <li key={effect.name}>
                                    <strong className="text-slate-200">{effect.name}</strong>: <span className="text-slate-300">{effect.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rare Side Effects */}
                    <div className="p-4 mt-4 rounded-lg bg-red-900/40 border border-red-700/80">
                        <div className="flex items-center gap-2 mb-3">
                            <WarningIcon className="h-6 w-6 text-red-400" />
                            <h4 className="font-semibold text-red-300">Effets secondaires rares (à surveiller)</h4>
                        </div>
                        <ul className="space-y-3">
                            {medication.sideEffectInfo?.rare.map(effect => (
                                <li key={effect.name}>
                                    <strong className="text-slate-200">{effect.name}</strong>: <span className="text-slate-300">{effect.description}</span>
                                    <p className="mt-1 text-sm text-red-200 bg-black/20 p-2 rounded-md border border-red-800/50"><strong>Action :</strong> {effect.warning}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* User Journal Section */}
                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpenIcon className="h-7 w-7 text-purple-400" />
                        <h3 className="text-xl font-semibold text-slate-100">Mon Journal de Suivi</h3>
                    </div>
                    <div>
                        <label htmlFor="side-effect-notes" className="block text-sm font-medium text-slate-300 mb-2">
                            Notez ici les effets que vous ressentez aujourd'hui ({new Date().toLocaleDateString()}) :
                        </label>
                        <textarea 
                            id="side-effect-notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={4}
                            className="w-full p-3 rounded-md bg-slate-900 border border-slate-600 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            placeholder="Ex: Légers maux de tête le matin, rien d'autre à signaler..."
                        />
                        <button onClick={handleSave} className="mt-3 bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                            Enregistrer la note du jour
                        </button>
                    </div>
                     {medication.trackedSideEffects && medication.trackedSideEffects.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-slate-200 mb-2">Historique des notes :</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {medication.trackedSideEffects.slice().reverse().map(log => (
                                    <div key={log.date} className="text-sm p-2 bg-slate-900/50 rounded-md">
                                        <strong className="text-slate-400">{new Date(log.date).toLocaleDateString()} :</strong>
                                        <p className="text-slate-300 whitespace-pre-wrap">{log.notes}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicationDetailScreen;
