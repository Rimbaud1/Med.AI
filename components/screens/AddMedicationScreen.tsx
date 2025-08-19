
import React, { useState } from 'react';
import type { Medication, MedicationFrequency } from '../../types';
import { PillIcon } from '../icons';

interface AddMedicationScreenProps {
  onAddMedication: (medication: Medication) => void;
  onBack: () => void;
}

const AddMedicationScreen: React.FC<AddMedicationScreenProps> = ({ onAddMedication, onBack }) => {
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState<MedicationFrequency | ''>('');
    const [duration, setDuration] = useState('');
    const [isOngoing, setIsOngoing] = useState(false);

    const frequencyOptions: MedicationFrequency[] = ['1x / jour', '2x / jour', '3x / jour', 'Toutes les 4-6h', 'Au besoin'];
    
    const isFormValid = name && frequency && (duration || isOngoing);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const newMedication: Medication = {
            id: Date.now().toString(),
            name: name.trim(),
            frequency: frequency as MedicationFrequency,
            durationDays: isOngoing ? null : parseInt(duration, 10),
            startDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        };
        onAddMedication(newMedication);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 md:p-8">
            <div className="bg-amber-500/10 p-4 rounded-full mb-6 border border-amber-500/30">
                <PillIcon className="h-10 w-10 text-amber-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Ajouter un Traitement</h1>
            <p className="mt-4 text-center text-slate-400 max-w-lg">
                Remplissez les détails du médicament pour l'ajouter à votre pilulier.
            </p>

            <form onSubmit={handleSubmit} className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-5">
                <div>
                    <label htmlFor="med-name" className="block font-semibold text-slate-300 mb-2">Nom du médicament <span className="text-red-400">*</span></label>
                    <input id="med-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="ex: Paracétamol 1g" className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                </div>
                <div>
                    <label htmlFor="med-frequency" className="block font-semibold text-slate-300 mb-2">Fréquence <span className="text-red-400">*</span></label>
                    <select id="med-frequency" value={frequency} onChange={e => setFrequency(e.target.value as MedicationFrequency)} required className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none">
                        <option value="" disabled>Sélectionner une fréquence...</option>
                        {frequencyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="med-duration" className="block font-semibold text-slate-300 mb-2">Durée du traitement (en jours) <span className="text-red-400">*</span></label>
                    <input id="med-duration" type="number" value={duration} onChange={e => setDuration(e.target.value)} disabled={isOngoing} min="1" placeholder="ex: 7" className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none disabled:bg-slate-800 disabled:text-slate-500" />
                    <div className="mt-3 flex items-center">
                        <input id="ongoing-check" type="checkbox" checked={isOngoing} onChange={e => setIsOngoing(e.target.checked)} className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-sky-600 focus:ring-sky-500" />
                        <label htmlFor="ongoing-check" className="ml-2 block text-sm text-slate-300">C'est un traitement au long cours (sans durée définie)</label>
                    </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700 flex flex-col md:flex-row gap-4">
                    <button type="button" onClick={onBack} className="w-full md:w-auto bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-500 transition duration-200">
                        Annuler
                    </button>
                    <button type="submit" disabled={!isFormValid} className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-200">
                        Ajouter le traitement
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMedicationScreen;
