

import React, { useState, useMemo } from 'react';
import type { TrackedSymptom, SymptomLogEntry, TrendAnalysis } from '../../types';
import { BookOpenIcon, ChartBarIcon, SparklesIcon } from '../icons';

interface SymptomJournalScreenProps {
  journalData: TrackedSymptom[];
  onAddEntry: (symptomName: string, entry: Omit<SymptomLogEntry, 'date'>) => void;
  onBackToLanding: () => void;
  onAnalyzeTrends: () => void;
  trendAnalysis: TrendAnalysis | null;
  onClearTrendAnalysis: () => void;
}

const SymptomChart: React.FC<{ logs: SymptomLogEntry[] }> = ({ logs }) => {
    const data = useMemo(() => {
        // Get last 30 days of data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return logs
            .filter(log => new Date(log.date) >= thirtyDaysAgo)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [logs]);

    if (data.length < 2) {
        return <div className="h-48 flex items-center justify-center text-slate-500">Données insuffisantes pour afficher un graphique.</div>;
    }

    const width = 300;
    const height = 150;
    const padding = 20;

    const points = data.map((log, i) => {
        const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
        const y = height - padding - ((log.intensity - 1) / 9) * (height - 2 * padding);
        return { x, y, ...log };
    });

    const pathD = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-label="Graphique de l'évolution des symptômes">
            {/* Grid lines */}
            {[1, 5, 10].map(val => (
                <g key={val}>
                    <line x1={padding} x2={width - padding} y1={height - padding - ((val - 1) / 9) * (height - 2 * padding)} y2={height - padding - ((val - 1) / 9) * (height - 2 * padding)} stroke="#334155" strokeWidth="0.5" />
                    <text x={padding - 5} y={height - padding - ((val - 1) / 9) * (height - 2 * padding)} fill="#64748b" fontSize="8" textAnchor="end" alignmentBaseline="middle">{val}</text>
                </g>
            ))}
            
            {/* Line */}
            <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2" />

            {/* Points and Tooltips */}
            {points.map((p, i) => (
                <g key={i} className="group">
                    <circle cx={p.x} cy={p.y} r="3" fill="#38bdf8" stroke="#0f172a" strokeWidth="1" />
                    <rect x={p.x - 20} y={p.y - 30} width="40" height="20" rx="3" fill="#1e293b" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    <text x={p.x} y={p.y - 20} textAnchor="middle" fill="#f1f5f9" fontSize="8" className="opacity-0 group-hover:opacity-100 transition-opacity">{p.intensity}/10</text>
                </g>
            ))}
        </svg>
    );
};


const SymptomJournalScreen: React.FC<SymptomJournalScreenProps> = ({ journalData, onAddEntry, onBackToLanding, onAnalyzeTrends, trendAnalysis, onClearTrendAnalysis }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [notes, setNotes] = useState('');

    const canAnalyze = useMemo(() => {
        return journalData.some(symptom => symptom.logs.length >= 3);
    }, [journalData]);

    const openModal = (symptomName?: string) => {
        const today = new Date().toISOString().split('T')[0];
        const symptomToEdit = journalData.find(s => s.name === (symptomName || selectedSymptom));
        const todayLog = symptomToEdit?.logs.find(l => l.date === today);

        setSelectedSymptom(symptomName || journalData[0]?.name || '');
        setIntensity(todayLog?.intensity || 5);
        setNotes(todayLog?.notes || '');
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (selectedSymptom) {
            onAddEntry(selectedSymptom, { intensity, notes });
            setIsModalOpen(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-500/10 p-4 rounded-full border border-purple-500/30">
                        <BookOpenIcon className="h-10 w-10 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Mon Journal de Santé</h1>
                        <p className="mt-1 text-slate-400">Suivez l'évolution de vos symptômes au quotidien.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onBackToLanding} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Accueil</button>
                    <button onClick={() => openModal()} disabled={journalData.length === 0} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed">
                        + Ajouter une entrée
                    </button>
                </div>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-indigo-900/40 border border-indigo-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className='flex items-center gap-3'>
                    <SparklesIcon className="h-8 w-8 text-indigo-400 flex-shrink-0" />
                    <div>
                         <h3 className="font-bold text-slate-100">Détection de Tendances Anormales</h3>
                         <p className="text-sm text-indigo-200">Laissez l'IA analyser vos données pour y déceler des évolutions ou corrélations importantes.</p>
                    </div>
                </div>
                <button
                    onClick={onAnalyzeTrends}
                    disabled={!canAnalyze}
                    className="w-full sm:w-auto flex-shrink-0 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
                    title={!canAnalyze ? "Ajoutez au moins 3 entrées pour un symptôme pour activer l'analyse." : ""}
                >
                    Analyser mes tendances
                </button>
            </div>

            {journalData.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/50 rounded-lg border border-slate-700">
                    <ChartBarIcon className="h-16 w-16 mx-auto text-slate-500 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-300">Votre journal est vide</h2>
                    <p className="text-slate-400 mt-2">Commencez un diagnostic pour pouvoir suivre vos symptômes.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {journalData.map(symptom => (
                        <div key={symptom.name} className="bg-slate-800/50 p-5 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-slate-100">{symptom.name}</h3>
                                <button onClick={() => openModal(symptom.name)} className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-1 px-3 rounded-md transition-colors">
                                    Mettre à jour
                                </button>
                            </div>
                            <SymptomChart logs={symptom.logs} />
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-300">
                        <h3 className="text-xl font-bold text-slate-100 mb-4">Entrée du jour ({new Date().toLocaleDateString()})</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="symptom-select" className="block text-sm font-medium text-slate-300 mb-1">Symptôme</label>
                                <select id="symptom-select" value={selectedSymptom} onChange={e => setSelectedSymptom(e.target.value)} className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white">
                                    {journalData.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="intensity-slider" className="block text-sm font-medium text-slate-300 mb-1 flex justify-between">Intensité <span className="font-bold text-sky-400">{intensity}/10</span></label>
                                <input id="intensity-slider" type="range" min="1" max="10" value={intensity} onChange={e => setIntensity(parseInt(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">Notes (optionnel)</label>
                                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white" placeholder="Ex: S'est aggravé après le repas..."></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500">Annuler</button>
                            <button onClick={handleSave} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500">Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}

             {trendAnalysis && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-2xl p-6 relative animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                         <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                            <SparklesIcon className="h-7 w-7 text-indigo-400" />
                            <h3 className="text-xl font-bold text-slate-100">Résultats de l'Analyse des Tendances</h3>
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                                <h4 className="font-semibold text-slate-200 mb-1">Résumé de l'IA :</h4>
                                <p className="text-slate-300 italic">"{trendAnalysis.summary}"</p>
                            </div>
                             {trendAnalysis.findings.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-slate-200 mb-2">Découvertes Clés :</h4>
                                    <div className="space-y-3">
                                        {trendAnalysis.findings.map((item, index) => (
                                            <div key={index} className="p-3 rounded-lg bg-indigo-900/40 border border-indigo-700/80">
                                                <p className="font-semibold text-indigo-200">{item.finding}</p>
                                                <p className="text-sm text-indigo-300 mt-1">{item.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             )}
                        </div>
                        <div className="mt-6 flex justify-end flex-shrink-0">
                            <button onClick={onClearTrendAnalysis} className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500">Compris</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymptomJournalScreen;