
import React, { useState } from 'react';
import type { PreventionProfile, SmokingStatus, AlcoholConsumption, PhysicalActivity, DietQuality } from '../../types';
import { ShieldCheckIcon } from '../icons';

interface PreventionProfileScreenProps {
  onSubmit: (profile: PreventionProfile) => void;
  onBackToLanding: () => void;
}

const FormRow: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
        {children}
    </div>
);

const Label: React.FC<{ htmlFor?: string, children: React.ReactNode, required?: boolean, className?: string }> = ({ htmlFor, children, required, className }) => (
    <label htmlFor={htmlFor} className={`font-semibold text-slate-300 w-full md:w-1/3 text-left ${className}`}>
        {children} {required && <span className="text-red-400">*</span>}
    </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200" />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200" />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200" />
);


const PreventionProfileScreen: React.FC<PreventionProfileScreenProps> = ({ onSubmit, onBackToLanding }) => {
    const [sex, setSex] = useState<'Homme' | 'Femme' | 'Autre' | ''>('');
    const [age, setAge] = useState<string>('');
    const [smokingStatus, setSmokingStatus] = useState<SmokingStatus | ''>('');
    const [alcoholConsumption, setAlcoholConsumption] = useState<AlcoholConsumption | ''>('');
    const [physicalActivity, setPhysicalActivity] = useState<PhysicalActivity | ''>('');
    const [dietQuality, setDietQuality] = useState<DietQuality | ''>('');
    const [personalMedicalHistory, setPersonalMedicalHistory] = useState('');
    const [familyMedicalHistory, setFamilyMedicalHistory] = useState('');

    const isFormValid = sex && age && smokingStatus && alcoholConsumption && physicalActivity && dietQuality;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const profileData: PreventionProfile = {
            sex: sex as 'Homme' | 'Femme' | 'Autre',
            age: parseInt(age, 10),
            smokingStatus: smokingStatus as SmokingStatus,
            alcoholConsumption: alcoholConsumption as AlcoholConsumption,
            physicalActivity: physicalActivity as PhysicalActivity,
            dietQuality: dietQuality as DietQuality,
            personalMedicalHistory: personalMedicalHistory.trim(),
            familyMedicalHistory: familyMedicalHistory.trim(),
        };
        onSubmit(profileData);
    };

    const smokingOptions: SmokingStatus[] = ['Jamais', 'Ancien fumeur', 'Fumeur actuel'];
    const alcoholOptions: AlcoholConsumption[] = ['Aucune', 'Faible (1-2 fois/semaine)', 'Modérée (3-5 fois/semaine)', 'Élevée (Quotidienne)'];
    const activityOptions: PhysicalActivity[] = ['Sédentaire (peu ou pas)', 'Légère (marche)', 'Modérée (jogging, vélo 3x/semaine)', 'Intense (sport > 3x/semaine)'];
    const dietOptions: DietQuality[] = ['Très saine (équilibrée, fruits/légumes)', 'Assez saine', 'Peu équilibrée (fast-food fréquent)', 'Pas du tout saine'];

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
            <div className="bg-teal-500/10 p-4 rounded-full mb-6 border border-teal-500/30">
                <ShieldCheckIcon className="h-10 w-10 text-teal-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Profil de Prévention</h1>
            <p className="mt-4 text-center text-slate-400 max-w-lg">
                Remplissez ce profil pour recevoir un plan de prévention personnalisé. Plus vous êtes précis, plus les conseils seront pertinents.
            </p>

            <form onSubmit={handleSubmit} className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-5">
                
                {/* Basic Info */}
                <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2">Informations Générales</h2>
                <FormRow>
                    <Label htmlFor="sex" required>Sexe</Label>
                    <div id="sex" className="w-full md:w-2/3 flex items-center justify-start gap-4">
                        {(['Homme', 'Femme', 'Autre'] as const).map(option => (
                            <button type="button" key={option} onClick={() => setSex(option)} className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${sex === option ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>
                                {option}
                            </button>
                        ))}
                    </div>
                </FormRow>
                <FormRow>
                    <Label htmlFor="age" required>Âge</Label>
                    <div className="w-full md:w-2/3">
                        <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} min="0" max="120" placeholder="ex: 35" required />
                    </div>
                </FormRow>

                {/* Lifestyle */}
                <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2 pt-4">Style de Vie</h2>
                <FormRow>
                    <Label htmlFor="smokingStatus" required>Tabagisme</Label>
                    <div className="w-full md:w-2/3"><Select id="smokingStatus" value={smokingStatus} onChange={e => setSmokingStatus(e.target.value as SmokingStatus)} required><option value="">Sélectionner...</option>{smokingOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select></div>
                </FormRow>
                <FormRow>
                    <Label htmlFor="alcoholConsumption" required>Alcool</Label>
                    <div className="w-full md:w-2/3"><Select id="alcoholConsumption" value={alcoholConsumption} onChange={e => setAlcoholConsumption(e.target.value as AlcoholConsumption)} required><option value="">Sélectionner...</option>{alcoholOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select></div>
                </FormRow>
                <FormRow>
                    <Label htmlFor="physicalActivity" required>Activité Physique</Label>
                    <div className="w-full md:w-2/3"><Select id="physicalActivity" value={physicalActivity} onChange={e => setPhysicalActivity(e.target.value as PhysicalActivity)} required><option value="">Sélectionner...</option>{activityOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select></div>
                </FormRow>
                <FormRow>
                    <Label htmlFor="dietQuality" required>Qualité de l'Alimentation</Label>
                    <div className="w-full md:w-2/3"><Select id="dietQuality" value={dietQuality} onChange={e => setDietQuality(e.target.value as DietQuality)} required><option value="">Sélectionner...</option>{dietOptions.map(o => <option key={o} value={o}>{o}</option>)}</Select></div>
                </FormRow>
                
                {/* Medical History */}
                <h2 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2 pt-4">Antécédents Médicaux</h2>
                <FormRow className="md:items-start">
                    <Label htmlFor="personalMedicalHistory">Antécédents personnels (pathologies, chirurgies...)</Label>
                    <div className="w-full md:w-2/3">
                        <Textarea id="personalMedicalHistory" value={personalMedicalHistory} onChange={e => setPersonalMedicalHistory(e.target.value)} rows={3} placeholder="ex: Hypertension, diabète type 2, appendicectomie..." />
                    </div>
                </FormRow>
                <FormRow className="md:items-start">
                    <Label htmlFor="familyMedicalHistory">Antécédents familiaux (parents, frères/sœurs)</Label>
                    <div className="w-full md:w-2/3">
                        <Textarea id="familyMedicalHistory" value={familyMedicalHistory} onChange={e => setFamilyMedicalHistory(e.target.value)} rows={3} placeholder="ex: Père: crise cardiaque à 55 ans. Mère: cancer du sein..." />
                    </div>
                </FormRow>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-700 flex flex-col md:flex-row gap-4">
                    <button type="button" onClick={onBackToLanding} className="w-full md:w-auto bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-500 transition duration-200">
                        Retour
                    </button>
                    <button type="submit" disabled={!isFormValid} className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2">
                        Générer mon Plan de Prévention
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PreventionProfileScreen;
