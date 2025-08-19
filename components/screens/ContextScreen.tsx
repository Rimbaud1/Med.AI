

import React, { useState, useEffect } from 'react';
import type { PatientContext, UserProfileData } from '../../types';
import { ClipboardListIcon } from '../icons';

// --- Helper Components (moved outside to prevent re-rendering issues) ---

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
    <select {...props} className="p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200" />
);

// --- Main Component ---

interface ContextScreenProps {
  onSubmit: (context: PatientContext) => void;
  savedProfile: UserProfileData | null;
}

const ContextScreen: React.FC<ContextScreenProps> = ({ onSubmit, savedProfile }) => {
  const [sex, setSex] = useState<'Homme' | 'Femme' | 'Autre' | ''>('');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [location, setLocation] = useState('');
  const [existingConditions, setExistingConditions] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  
  // Allergy state
  const [knownAllergies, setKnownAllergies] = useState('');
  const [hadAllergyContact, setHadAllergyContact] = useState<'oui' | 'non' | ''>('');
  const [allergyContactDetails, setAllergyContactDetails] = useState('');

  // Travel state
  const [travelDestination, setTravelDestination] = useState('');
  const [travelTimeValue, setTravelTimeValue] = useState('');
  const [travelTimeUnit, setTravelTimeUnit] = useState<'jours' | 'semaines' | 'mois'>('semaines');

  useEffect(() => {
    if (savedProfile) {
      setSex(savedProfile.sex || '');
      setAge(savedProfile.age || '');
      setWeight(savedProfile.weight?.toString() || '');
      setLocation(savedProfile.location || '');
      setExistingConditions(savedProfile.existingConditions || '');
      setCurrentMedications(savedProfile.currentMedications || '');
      // Note: Allergies and travels are more complex and might not be pre-filled simply.
      // This implementation keeps it simple by pre-filling the main fields.
      setKnownAllergies(savedProfile.allergies || ''); 
      if (savedProfile.recentTravels) {
          // A simple parse, might not be perfect for all formats
          const parts = savedProfile.recentTravels.split(',');
          if(parts.length > 0) setTravelDestination(parts[0]);
      }
    }
  }, [savedProfile]);


  const isFormValid = sex && age;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Build allergies string
    let allergiesString = knownAllergies.trim();
    if (hadAllergyContact === 'oui' && allergyContactDetails.trim()) {
      allergiesString += `\n(Contact récent : ${allergyContactDetails.trim()})`;
    }

    // Build recent travels string
    let travelsString = '';
    if (travelDestination.trim() && travelTimeValue.trim()) {
      travelsString = `${travelDestination.trim()}, il y a ${travelTimeValue} ${travelTimeUnit}`;
    }

    const contextData: PatientContext = {
      sex: sex as 'Homme' | 'Femme' | 'Autre',
      age: parseInt(age, 10),
      ...(weight && { weight: parseInt(weight, 10) }),
      ...(location.trim() && { location: location.trim() }),
      ...(existingConditions.trim() && { existingConditions: existingConditions.trim() }),
      ...(currentMedications.trim() && { currentMedications: currentMedications.trim() }),
      ...(allergiesString && { allergies: allergiesString }),
      ...(travelsString && { recentTravels: travelsString }),
    };
    onSubmit(contextData);
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 md:p-8">
       <div className="bg-sky-500/10 p-4 rounded-full mb-6 border border-sky-500/30">
        <ClipboardListIcon className="h-10 w-10 text-sky-400" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-100">Informations Contextuelles</h1>
      <p className="mt-4 text-center text-slate-400 max-w-lg">
        Pour un diagnostic plus précis, veuillez fournir quelques informations supplémentaires.
      </p>

      <form onSubmit={handleSubmit} className="w-full mt-8 bg-slate-800 rounded-lg p-6 md:p-8 shadow-lg border border-slate-700 space-y-5">
        
        <FormRow>
          <Label htmlFor="sex" required>Sexe</Label>
          <div id="sex" className="w-full md:w-2/3 flex items-center justify-start gap-4">
            {(['Homme', 'Femme', 'Autre'] as const).map(option => (
              <button 
                type="button" 
                key={option}
                onClick={() => setSex(option)}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${sex === option ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
              >
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

        <FormRow>
          <Label htmlFor="weight">Poids (kg)</Label>
          <div className="w-full md:w-2/3">
            <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min="0" placeholder="ex: 70" />
          </div>
        </FormRow>
        
        <FormRow>
          <Label htmlFor="location">Ville ou Code Postal</Label>
          <div className="w-full md:w-2/3">
            <Input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="ex: Paris, 75001" />
          </div>
        </FormRow>

        <FormRow className="md:items-start">
          <Label htmlFor="existingConditions">Pathologies connues</Label>
          <div className="w-full md:w-2/3">
            <Textarea id="existingConditions" value={existingConditions} onChange={(e) => setExistingConditions(e.target.value)} rows={3} placeholder="ex: Diabète, hypertension..." />
          </div>
        </FormRow>
        
        <FormRow className="md:items-start">
          <Label htmlFor="currentMedications">Traitements en cours</Label>
          <div className="w-full md:w-2/3">
            <Textarea id="currentMedications" value={currentMedications} onChange={(e) => setCurrentMedications(e.target.value)} rows={3} placeholder="ex: Insuline, Paracétamol..." />
          </div>
        </FormRow>

        {/* Allergies Section */}
        <div className="space-y-4 rounded-md border border-slate-700 p-4">
            <FormRow className="md:items-start">
              <Label htmlFor="knownAllergies" className="pt-2">Allergies connues</Label>
              <div className="w-full md:w-2/3">
                <Textarea id="knownAllergies" value={knownAllergies} onChange={(e) => setKnownAllergies(e.target.value)} rows={2} placeholder="ex: Pollen, Pénicilline, arachides..." />
              </div>
            </FormRow>
            <FormRow>
                <Label>Contact récent avec un allergène ?</Label>
                <div className="w-full md:w-2/3 flex items-center justify-start gap-4">
                    {(['oui', 'non'] as const).map(option => (
                        <button 
                            type="button" 
                            key={option}
                            onClick={() => setHadAllergyContact(option)}
                            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors capitalize ${hadAllergyContact === option ? 'bg-sky-600 border-sky-500 text-white' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </FormRow>
            {hadAllergyContact === 'oui' && (
                <FormRow className="md:items-start">
                    <Label htmlFor="allergyContactDetails" className="pt-2">Si oui, précisez</Label>
                    <div className="w-full md:w-2/3">
                        <Textarea id="allergyContactDetails" value={allergyContactDetails} onChange={(e) => setAllergyContactDetails(e.target.value)} rows={2} placeholder="ex: mangé un plat contenant des arachides hier soir"/>
                    </div>
                </FormRow>
            )}
        </div>

        {/* Recent Travels Section */}
        <div className="space-y-4 rounded-md border border-slate-700 p-4">
            <FormRow>
                <Label htmlFor="travelDestination">Voyage récent (Destination)</Label>
                 <div className="w-full md:w-2/3">
                    <Input id="travelDestination" value={travelDestination} onChange={(e) => setTravelDestination(e.target.value)} placeholder="ex: Asie du Sud-Est, Afrique de l'Ouest..." />
                </div>
            </FormRow>
            <FormRow>
                <Label htmlFor="travelTimeValue">Date du retour</Label>
                <div className="w-full md:w-2/3 flex items-center gap-2">
                    <span className="text-slate-400">Il y a</span>
                    <Input id="travelTimeValue" type="number" min="1" value={travelTimeValue} onChange={(e) => setTravelTimeValue(e.target.value)} className="w-24 text-center" placeholder="2"/>
                    <Select value={travelTimeUnit} onChange={(e) => setTravelTimeUnit(e.target.value as any)}>
                        <option value="jours">jours</option>
                        <option value="semaines">semaines</option>
                        <option value="mois">mois</option>
                    </Select>
                </div>
            </FormRow>
        </div>


        <div className="pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
            >
              Continuer vers le questionnaire
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
        </div>
      </form>
    </div>
  );
};

export default ContextScreen;