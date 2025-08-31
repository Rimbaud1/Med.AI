
import React, { useState, useMemo, useRef, useCallback } from 'react';
import type { DailyLog, SymptomTrackerConfig, SleepLog, MealLog, ActivityLog, MealType, ActivityIntensity, NutritionalInfo, ActivityAnalysis, TrendAnalysis } from '../../types';
import { BookOpenIcon, MoonIcon, DropletIcon, DumbbellIcon, ForkKnifeIcon, CalendarDaysIcon, SparklesIcon, InformationCircleIcon, CameraIcon, TrashIcon, ClockIcon } from '../icons';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove the data:image/...;base64, part
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper to format date to YYYY-MM-DD
const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

interface HealthHubScreenProps {
  healthData: DailyLog[];
  symptomConfig: SymptomTrackerConfig[];
  onUpdateLog: (date: string, updatedLog: Partial<DailyLog>) => void;
  onAddMeal: (date: string, meal: Omit<MealLog, 'id' | 'nutritionalInfo'>) => Promise<NutritionalInfo | null>;
  onAddActivity: (date: string, activity: Omit<ActivityLog, 'id' | 'analysis'>) => Promise<ActivityAnalysis | null>;
  onBack: () => void;
  onAnalyzeTrends: () => void;
  trendAnalysis: TrendAnalysis | null;
  onClearTrendAnalysis: () => void;
  hydrationGoal: number;
  accessLevel: 'free' | 'own_key' | 'premium';
}

type ModalType = null | 'sleep' | 'meal' | 'activity';

const HealthHubScreen: React.FC<HealthHubScreenProps> = (props) => {
    const { healthData, symptomConfig, onUpdateLog, onAddMeal, onAddActivity, onBack, onAnalyzeTrends, trendAnalysis, onClearTrendAnalysis, hydrationGoal, accessLevel } = props;
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const dateString = toYYYYMMDD(currentDate);

    const dailyLog = useMemo(() => {
        const log = healthData.find(d => d.date === dateString);
        if (log) return log;
        // FIX: Add optional 'sleep' and 'generalNotes' properties to the fallback object to match the DailyLog type.
        return {
            date: dateString,
            sleep: undefined,
            hydrationMilliliters: 0,
            meals: [],
            activities: [],
            symptoms: symptomConfig.map(s => ({ name: s.name, intensity: 0 })),
            generalNotes: undefined,
        };
    }, [dateString, healthData, symptomConfig]);

    const changeDay = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + offset);
            return newDate;
        });
    };
    
    // --- Render Methods for Cards ---
    const renderSleepCard = () => (
        <div className="bg-slate-800 p-4 rounded-lg flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
                <MoonIcon className="h-6 w-6 text-indigo-400" />
                <h3 className="text-lg font-semibold">Sommeil</h3>
            </div>
            {dailyLog.sleep ? (
                <div className="text-center">
                    <p className="text-3xl font-bold">{dailyLog.sleep.durationHours?.toFixed(1) ?? 'N/A'}h</p>
                    <p className="text-sm text-slate-400">{dailyLog.sleep.startTime} - {dailyLog.sleep.endTime}</p>
                    <p className="text-xs text-slate-500">{dailyLog.sleep.awakenings} réveil(s)</p>
                </div>
            ) : (
                <p className="text-slate-400 text-center flex-grow flex items-center justify-center">Aucune donnée</p>
            )}
            <button onClick={() => setActiveModal('sleep')} className="mt-3 w-full bg-slate-700 hover:bg-indigo-600 text-sm font-semibold py-2 px-3 rounded-md transition-colors">
                {dailyLog.sleep ? 'Modifier' : 'Ajouter'}
            </button>
        </div>
    );
    
    const renderHydrationCard = () => {
        const progress = Math.min((dailyLog.hydrationMilliliters / hydrationGoal) * 100, 100);
        return (
            <div className="bg-slate-800 p-4 rounded-lg flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-3">
                    <DropletIcon className="h-6 w-6 text-sky-400" />
                    <h3 className="text-lg font-semibold">Hydratation</h3>
                </div>
                <div className="text-center my-2">
                    <div className="relative w-24 h-24 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-sky-400" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold">{dailyLog.hydrationMilliliters}</p>
                            <p className="text-xs text-slate-400">/ {hydrationGoal}ml</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <button onClick={() => onUpdateLog(dateString, { hydrationMilliliters: dailyLog.hydrationMilliliters + 250 })} className="bg-slate-700 hover:bg-sky-600 font-semibold py-2 rounded-md transition-colors">+250ml</button>
                    <button onClick={() => onUpdateLog(dateString, { hydrationMilliliters: dailyLog.hydrationMilliliters + 500 })} className="bg-slate-700 hover:bg-sky-600 font-semibold py-2 rounded-md transition-colors">+500ml</button>
                </div>
            </div>
        );
    };

    const renderMealsCard = () => {
        // FIX: Explicitly type the accumulator in the reduce function to ensure correct type inference.
        const totalNutrition = dailyLog.meals.reduce((acc: NutritionalInfo, meal: MealLog) => {
            acc.calories += meal.nutritionalInfo?.calories || 0;
            acc.proteins += meal.nutritionalInfo?.proteins || 0;
            acc.carbs += meal.nutritionalInfo?.carbs || 0;
            acc.fats += meal.nutritionalInfo?.fats || 0;
            return acc;
        }, { calories: 0, proteins: 0, carbs: 0, fats: 0 });

        return (
            <div className="bg-slate-800 p-4 rounded-lg md:col-span-2 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <ForkKnifeIcon className="h-6 w-6 text-amber-400" />
                        <h3 className="text-lg font-semibold">Repas</h3>
                    </div>
                     <button onClick={() => setActiveModal('meal')} className="bg-slate-700 hover:bg-amber-600 text-sm font-semibold py-1 px-3 rounded-md transition-colors">+ Ajouter</button>
                </div>
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm">
                         {dailyLog.meals.length > 0 ? dailyLog.meals.map(meal => (
                            <div key={meal.id} className="bg-slate-900/50 p-2 rounded-md">
                                <p className="font-semibold text-slate-300">{meal.type}</p>
                                <p className="text-slate-400 truncate">{meal.description}</p>
                            </div>
                         )) : <p className="text-slate-500 h-full flex items-center justify-center">Aucun repas enregistré.</p>}
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-md text-center flex flex-col justify-center">
                        <p className="text-3xl font-bold">{totalNutrition.calories}<span className="text-base font-normal text-slate-400"> kcal</span></p>
                        <div className="grid grid-cols-3 gap-1 text-xs mt-2">
                            <div><p className="font-bold text-blue-300">{totalNutrition.proteins}g</p><p className="text-slate-400">Prot.</p></div>
                            <div><p className="font-bold text-green-300">{totalNutrition.carbs}g</p><p className="text-slate-400">Gluc.</p></div>
                            <div><p className="font-bold text-red-300">{totalNutrition.fats}g</p><p className="text-slate-400">Lip.</p></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderActivitiesCard = () => {
         // FIX: Add explicit types to the reduce function's parameters to ensure correct type inference for the accumulator.
         const totalCalories = dailyLog.activities.reduce((acc: number, act: ActivityLog) => acc + (act.analysis?.caloriesBurned || 0), 0);
        return (
            <div className="bg-slate-800 p-4 rounded-lg md:col-span-2 flex flex-col">
                 <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <DumbbellIcon className="h-6 w-6 text-rose-400" />
                        <h3 className="text-lg font-semibold">Activités Physiques</h3>
                    </div>
                     <button onClick={() => setActiveModal('activity')} className="bg-slate-700 hover:bg-rose-600 text-sm font-semibold py-1 px-3 rounded-md transition-colors">+ Ajouter</button>
                </div>
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm overflow-y-auto max-h-32">
                        {dailyLog.activities.length > 0 ? dailyLog.activities.map(act => (
                            <div key={act.id} className="bg-slate-900/50 p-2 rounded-md">
                                <p className="font-semibold text-slate-300">{act.name}</p>
                                <p className="text-slate-400">{act.durationMinutes ? `${act.durationMinutes} min` : `${act.reps} reps`} - {act.intensity}</p>
                            </div>
                        )) : <p className="text-slate-500 h-full flex items-center justify-center">Aucune activité enregistrée.</p>}
                    </div>
                     <div className="bg-slate-900/50 p-3 rounded-md text-center flex flex-col justify-center">
                         <p className="text-3xl font-bold">{totalCalories}<span className="text-base font-normal text-slate-400"> kcal</span></p>
                         <p className="text-xs text-slate-400 mt-1">Calories brûlées (est.)</p>
                    </div>
                </div>
            </div>
        );
    };

    const renderSymptomsCard = () => (
         <div className="bg-slate-800 p-4 rounded-lg md:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Symptômes</h3>
             <div className="space-y-3">
                {dailyLog.symptoms.length > 0 ? dailyLog.symptoms.map(symptom => (
                    <div key={symptom.name}>
                        <label className="text-slate-300 flex justify-between"><span>{symptom.name}</span> <span className="font-bold text-sky-300">{symptom.intensity}</span></label>
                        <input type="range" min="0" max="10" value={symptom.intensity} onChange={e => {
                            const newSymptoms = [...dailyLog.symptoms];
                            const index = newSymptoms.findIndex(s => s.name === symptom.name);
                            newSymptoms[index].intensity = parseInt(e.target.value, 10);
                            onUpdateLog(dateString, { symptoms: newSymptoms });
                        }} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                    </div>
                )) : <p className="text-slate-500 text-center py-4">Aucun symptôme configuré.</p>}
            </div>
        </div>
    );

    return (
      <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-500/10 p-4 rounded-full border border-purple-500/30">
                        <BookOpenIcon className="h-10 w-10 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Mon Hub de Santé</h1>
                        <p className="mt-1 text-slate-400">Votre tableau de bord bien-être quotidien.</p>
                    </div>
                </div>
                <button onClick={onBack} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Retour</button>
            </div>

            {/* Date Navigator */}
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg mb-6 border border-slate-700">
                <button onClick={() => changeDay(-1)} className="p-2 rounded-full hover:bg-slate-700 transition-colors">&lt;</button>
                <h2 className="text-xl font-bold text-center">{currentDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                <button onClick={() => changeDay(1)} disabled={toYYYYMMDD(currentDate) === toYYYYMMDD(new Date())} className="p-2 rounded-full hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">&gt;</button>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderSleepCard()}
                {renderHydrationCard()}
                {renderMealsCard()}
                {renderActivitiesCard()}
                {renderSymptomsCard()}
                 <div className="bg-slate-800 p-4 rounded-lg flex flex-col justify-between md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                        <SparklesIcon className="h-6 w-6 text-teal-400" />
                        <h3 className="text-lg font-semibold">Analyse IA</h3>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <button onClick={onAnalyzeTrends} className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-5 rounded-lg transition-colors">
                            Analyser les Tendances
                        </button>
                    </div>
                </div>
            </div>

             {/* Modals */}
            {activeModal === 'sleep' && <SleepModal log={dailyLog.sleep} onClose={() => setActiveModal(null)} onSave={sleepLog => { onUpdateLog(dateString, { sleep: sleepLog }); setActiveModal(null); }} />}
            {activeModal === 'meal' && <MealModal onClose={() => setActiveModal(null)} onSave={meal => onAddMeal(dateString, meal)} accessLevel={accessLevel} />}
            {activeModal === 'activity' && <ActivityModal onClose={() => setActiveModal(null)} onSave={activity => onAddActivity(dateString, activity)} />}

            {/* Trend Analysis Modal */}
            {trendAnalysis && (
                 <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClearTrendAnalysis}>
                    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg p-6 relative animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <SparklesIcon className="h-7 w-7 text-teal-400" />
                            <h3 className="text-xl font-bold text-slate-100">Analyse des Tendances</h3>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-200">Résumé</h4>
                                <p className="text-slate-300 italic">"{trendAnalysis.summary}"</p>
                            </div>
                            {trendAnalysis.findings.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-slate-200 mt-4">Découvertes Clés</h4>
                                    <ul className="space-y-3 mt-2">
                                    {trendAnalysis.findings.map((f, i) => (
                                        <li key={i} className="border-t border-slate-700 pt-3">
                                            <p className="text-sky-300 font-medium">{f.finding}</p>
                                            <p className="text-sm text-slate-400">{f.explanation}</p>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button onClick={onClearTrendAnalysis} className="w-full mt-6 bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500">Fermer</button>
                    </div>
                </div>
            )}
      </div>
    );
};

// --- MODAL COMPONENTS ---

// Sleep Modal
const SleepModal: React.FC<{ log?: SleepLog | null; onClose: () => void; onSave: (log: SleepLog) => void; }> = ({ log, onClose, onSave }) => {
    const [startTime, setStartTime] = useState(log?.startTime || '22:30');
    const [endTime, setEndTime] = useState(log?.endTime || '06:30');
    const [awakenings, setAwakenings] = useState(log?.awakenings?.toString() || '0');

    const handleSave = () => {
        const start = new Date(`1970-01-01T${startTime}:00`);
        let end = new Date(`1970-01-01T${endTime}:00`);
        if (end <= start) {
            end.setDate(end.getDate() + 1); // Handle overnight sleep
        }
        const durationMs = end.getTime() - start.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);

        onSave({ startTime, endTime, awakenings: parseInt(awakenings, 10), durationHours });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Enregistrer le Sommeil</h3>
                <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Heure de coucher</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 rounded bg-slate-700" /></div>
                    <div><label className="block text-sm mb-1">Heure de lever</label><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-2 rounded bg-slate-700" /></div>
                    <div><label className="block text-sm mb-1">Nombre de réveils</label><input type="number" min="0" value={awakenings} onChange={e => setAwakenings(e.target.value)} className="w-full p-2 rounded bg-slate-700" /></div>
                </div>
                <div className="flex gap-2 mt-6"><button onClick={onClose} className="w-full p-2 rounded bg-slate-600 hover:bg-slate-500">Annuler</button><button onClick={handleSave} className="w-full p-2 rounded bg-sky-600 hover:bg-sky-500">Enregistrer</button></div>
            </div>
        </div>
    );
};

// Meal Modal
const MealModal: React.FC<{ onClose: () => void; onSave: (meal: Omit<MealLog, 'id' | 'nutritionalInfo'>) => void; accessLevel: 'free' | 'own_key' | 'premium'; }> = ({ onClose, onSave, accessLevel }) => {
    const [type, setType] = useState<MealType>('Déjeuner');
    const [description, setDescription] = useState('');
    const [photoBase64, setPhotoBase64] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) { setError("L'image est trop lourde (max 4MB)."); return; }
        setError('');
        setPhotoPreview(URL.createObjectURL(file));
        const b64 = await fileToBase64(file);
        setPhotoBase64(b64);
    };

    const handleSave = () => {
        if (!description.trim()) { setError("La description est requise."); return; }
        onSave({ type, description, photoBase64: photoBase64 || undefined });
        onClose();
    };

    return (
       <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Ajouter un Repas</h3>
                {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Type de repas</label><select value={type} onChange={e => setType(e.target.value as MealType)} className="w-full p-2 rounded bg-slate-700"><option>Petit-déjeuner</option><option>Déjeuner</option><option>Dîner</option><option>Collation</option></select></div>
                    <div><label className="block text-sm mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-2 rounded bg-slate-700" placeholder="Ex: Salade de poulet, riz complet..."></textarea></div>
                    <div>
                        <label className="block text-sm mb-1">Photo (Optionnel)</label>
                        {accessLevel === 'free' ? 
                            <div className="text-xs p-2 bg-slate-900 rounded border border-slate-700 text-amber-300">Fonctionnalité Premium. Mettez à jour votre mode d'accès dans les paramètres.</div>
                             :
                            <div className="flex items-center gap-2">
                                <button onClick={() => fileInputRef.current?.click()} className="flex-grow p-2 rounded bg-slate-700 hover:bg-slate-600 flex items-center justify-center gap-2"><CameraIcon className="h-5 w-5"/> Charger une photo</button>
                                {photoPreview && <img src={photoPreview} alt="aperçu" className="h-10 w-10 rounded object-cover" />}
                                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                            </div>
                        }
                    </div>
                </div>
                <div className="flex gap-2 mt-6"><button onClick={onClose} className="w-full p-2 rounded bg-slate-600 hover:bg-slate-500">Annuler</button><button onClick={handleSave} className="w-full p-2 rounded bg-sky-600 hover:bg-sky-500">Enregistrer</button></div>
            </div>
       </div>
    );
};

// Activity Modal
const ActivityModal: React.FC<{ onClose: () => void; onSave: (activity: Omit<ActivityLog, 'id' | 'analysis'>) => void; }> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [reps, setReps] = useState('');
    const [intensity, setIntensity] = useState<ActivityIntensity>('Modérée');

    const handleSave = () => {
        if (!name.trim() || (!duration.trim() && !reps.trim())) return;
        onSave({ name, intensity, durationMinutes: duration ? parseInt(duration, 10) : undefined, reps: reps ? parseInt(reps, 10) : undefined });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Ajouter une Activité</h3>
                <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Nom de l'activité</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Course à pied" className="w-full p-2 rounded bg-slate-700" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm mb-1">Durée (min)</label><input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="30" className="w-full p-2 rounded bg-slate-700" /></div>
                        <div><label className="block text-sm mb-1">Répétitions</label><input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="12" className="w-full p-2 rounded bg-slate-700" /></div>
                    </div>
                     <div><label className="block text-sm mb-1">Intensité</label><select value={intensity} onChange={e => setIntensity(e.target.value as ActivityIntensity)} className="w-full p-2 rounded bg-slate-700"><option>Faible</option><option>Modérée</option><option>Élevée</option></select></div>
                </div>
                <div className="flex gap-2 mt-6"><button onClick={onClose} className="w-full p-2 rounded bg-slate-600 hover:bg-slate-500">Annuler</button><button onClick={handleSave} className="w-full p-2 rounded bg-sky-600 hover:bg-sky-500">Enregistrer</button></div>
            </div>
        </div>
    );
};


export default HealthHubScreen;
