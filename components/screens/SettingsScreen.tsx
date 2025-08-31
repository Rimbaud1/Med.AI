import React, { useState, useEffect } from 'react';
import type { UserSettings, DailyLog, Medication, TrainingProgress, DiagnosticHistoryEntry } from '../../types';
import { Cog6ToothIcon, InformationCircleIcon, CheckCircleIcon, NewspaperIcon, SparklesIcon } from '../icons';

interface SettingsScreenProps {
  onBackToLanding: () => void;
  settings: UserSettings;
  onSettingsChange: (newSettings: UserSettings) => void;
  journalData: DailyLog[];
  pillboxData: Medication[];
  trainingProgress: TrainingProgress;
  diagnosticHistory: DiagnosticHistoryEntry[];
  onClearJournal: () => void;
  onClearPillbox: () => void;
  onClearProfile: () => void;
  onClearTrainingProgress: () => void;
  onClearHistory: () => void;
  onShowDataPrivacy: () => void;
}

const Toggle: React.FC<{
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, description, enabled, onChange }) => (
  <div className="flex items-start justify-between p-4 rounded-lg bg-slate-800/60 border border-slate-700/80">
    <div className="pr-4">
      <h4 className="font-semibold text-slate-200">{label}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
    <button
      type="button"
      className={`${
        enabled ? 'bg-sky-600' : 'bg-slate-600'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800`}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {
  const { 
    onBackToLanding, settings, onSettingsChange, journalData, pillboxData, 
    trainingProgress, diagnosticHistory, onClearJournal, onClearPillbox, onClearProfile, 
    onClearTrainingProgress, onClearHistory, onShowDataPrivacy 
  } = props;

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeySaveStatus, setApiKeySaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    setApiKeyInput(settings.apiKey || '');
  }, [settings.apiKey]);
  
  const handleToggleChange = (key: keyof UserSettings['saveProfileData'] | 'enableSessionRecovery', value: boolean) => {
    let newSettings: UserSettings;
    if (key === 'enableSessionRecovery') {
        newSettings = {
            ...settings,
            enableSessionRecovery: value,
        };
    } else {
        newSettings = {
            ...settings,
            saveProfileData: {
                ...settings.saveProfileData,
                [key]: value,
            },
        };
    }
    onSettingsChange(newSettings);
  };
  
  const handleClearJournal = () => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre Hub de Santé ? Toutes vos données de sommeil, repas, activité et symptômes seront perdues. Cette action est irréversible.")) {
      onClearJournal();
    }
  }

  const handleClearPillbox = () => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer définitivement les données de votre pilulier ? Cette action est irréversible.")) {
      onClearPillbox();
    }
  }

  const handleClearProfile = () => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer toutes vos données de profil sauvegardées ? Les préférences de sauvegarde seront aussi réinitialisées.")) {
      onClearProfile();
    }
  }

  const handleClearTrainingProgress = () => {
    if(window.confirm("Êtes-vous sûr de vouloir réinitialiser votre progression dans la formation ?")) {
      onClearTrainingProgress();
    }
  };
  
  const handleClearHistory = () => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer DÉFINITIVEMENT l'historique de tous vos bilans ? Cette action est irréversible.")) {
      onClearHistory();
    }
  }


  const handleSelectAll = () => {
    const allEnabled = Object.keys(settings.saveProfileData).reduce((acc, key) => {
        acc[key as keyof UserSettings['saveProfileData']] = true;
        return acc;
    }, {} as UserSettings['saveProfileData']);
    onSettingsChange({ ...settings, saveProfileData: allEnabled });
  };

  const handleDeselectAll = () => {
    const allDisabled = Object.keys(settings.saveProfileData).reduce((acc, key) => {
        acc[key as keyof UserSettings['saveProfileData']] = false;
        return acc;
    }, {} as UserSettings['saveProfileData']);
    onSettingsChange({ ...settings, saveProfileData: allDisabled });
  };
  
  const handleApiKeySave = () => {
    // FIX: Explicitly type newSettings to ensure accessLevel is not widened to `string`.
    const newSettings: UserSettings = {
        ...settings,
        apiKey: apiKeyInput.trim() || undefined,
        accessLevel: apiKeyInput.trim() ? 'own_key' : 'free',
    };
    onSettingsChange(newSettings);
    setApiKeySaveStatus('saved');
    setTimeout(() => setApiKeySaveStatus('idle'), 2000);
  };

  const handleClearApiKey = () => {
    setApiKeyInput('');
    // FIX: Explicitly type newSettings to ensure accessLevel is not widened to `string`.
    const newSettings: UserSettings = {
        ...settings,
        apiKey: undefined,
        accessLevel: 'free',
    };
    onSettingsChange(newSettings);
  };

  const handleResetAccess = () => {
    if (window.confirm("Ceci vous ramènera à l'écran de sélection du mode d'accès au redémarrage de l'application. Continuer ?")) {
        localStorage.removeItem('medai-has-seen-welcome');
        window.location.reload();
    }
  }

  const accessLevelText = {
      free: 'Gratuit (limité)',
      own_key: 'Clé d\'API personnelle',
      premium: 'Premium'
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center gap-4 mb-10">
        <div className="bg-slate-700/50 p-4 rounded-full border border-slate-600">
          <Cog6ToothIcon className="h-10 w-10 text-slate-300" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-100">Paramètres</h1>
          <p className="mt-2 text-slate-400">Gérez vos données et préférences pour Med.AI.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Access Level Section */}
        <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-700">Mode d'accès</h2>
            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-200">Mode actuel</h4>
                  <p className="text-sm text-sky-300 flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4" />
                    {accessLevelText[settings.accessLevel || 'free']}
                  </p>
                </div>
                <button onClick={handleResetAccess} className="w-full sm:w-auto bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">
                  Changer de mode
                </button>
            </div>
        </section>

        {/* API Key Section */}
        <section>
            <h2 className="text-2xl font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-700">Clé d'API Gemini</h2>
            <p className="text-slate-400 text-sm mb-4">
                Pour une confidentialité maximale, vous pouvez utiliser votre propre clé d'API Google Cloud. Si ce champ est vide, l'application utilisera une clé de démonstration par défaut.
                <button onClick={onShowDataPrivacy} className="ml-1 text-sky-400 hover:text-sky-300 font-semibold">(En savoir plus sur la confidentialité)</button>
            </p>
            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 space-y-3">
                <label htmlFor="api-key-input" className="font-semibold text-slate-200">Votre clé d'API</label>
                <input
                    id="api-key-input"
                    type="password"
                    value={apiKeyInput}
                    onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="Entrez votre clé d'API ici"
                    className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 text-slate-200"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={handleApiKeySave} className="w-full sm:w-auto flex-grow bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors">
                        {apiKeySaveStatus === 'saved' ? 'Enregistré !' : 'Enregistrer la clé'}
                    </button>
                    <button onClick={handleClearApiKey} className="w-full sm:w-auto bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">
                        Utiliser la clé par défaut
                    </button>
                </div>
            </div>
        </section>

        {/* Data Preferences Section */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 pb-2 border-b border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-200 mb-2 sm:mb-0">Préférences de Données</h2>
            <div className="flex gap-2">
                <button onClick={handleSelectAll} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-1 px-3 rounded-md transition-colors">Tout sélectionner</button>
                <button onClick={handleDeselectAll} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-1 px-3 rounded-md transition-colors">Tout désélectionner</button>
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Gérez la manière dont Med.AI sauvegarde localement vos informations.
          </p>
          <div className="space-y-3">
            <Toggle 
                label="Récupération de session"
                description="Si l'application se ferme inopinément, vous proposer de reprendre le diagnostic là où vous l'avez laissé."
                enabled={settings.enableSessionRecovery !== false}
                onChange={v => handleToggleChange('enableSessionRecovery', v)}
            />
            <Toggle label="Âge et Sexe" description="Sauvegarder votre âge et sexe pour pré-remplir les formulaires." enabled={settings.saveProfileData.sexAndAge} onChange={v => handleToggleChange('sexAndAge', v)} />
            <Toggle label="Poids" description="Sauvegarder votre poids." enabled={settings.saveProfileData.weight} onChange={v => handleToggleChange('weight', v)} />
            <Toggle label="Localisation" description="Sauvegarder votre ville ou code postal." enabled={settings.saveProfileData.location} onChange={v => handleToggleChange('location', v)} />
            <Toggle label="Pathologies connues" description="Sauvegarder vos pathologies connues." enabled={settings.saveProfileData.existingConditions} onChange={v => handleToggleChange('existingConditions', v)} />
            <Toggle label="Traitements en cours" description="Sauvegarder vos traitements." enabled={settings.saveProfileData.currentMedications} onChange={v => handleToggleChange('currentMedications', v)} />
            <Toggle label="Allergies" description="Sauvegarder vos allergies." enabled={settings.saveProfileData.allergies} onChange={v => handleToggleChange('allergies', v)} />
            <Toggle label="Voyages récents" description="Sauvegarder vos voyages récents." enabled={settings.saveProfileData.recentTravels} onChange={v => handleToggleChange('recentTravels', v)} />
          </div>
        </section>

        {/* Storage Management Section */}
        <section>
          <h2 className="text-2xl font-semibold text-slate-200 mb-4 pb-2 border-b border-slate-700">Gestion du Stockage</h2>
          <div className="text-slate-400 text-sm mb-4">
            <p>Toutes vos données sont stockées uniquement sur cet appareil, dans ce navigateur.</p>
            <button onClick={onShowDataPrivacy} className="mt-2 flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors font-semibold">
                <InformationCircleIcon className="h-4 w-4" />
                <span>Explication technique sur le stockage des données</span>
            </button>
          </div>
          <div className="space-y-4">
             <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-200">Historique des Bilans</h4>
                  <p className="text-sm text-slate-400">{diagnosticHistory.length > 0 ? `${diagnosticHistory.length} bilan(s) sauvegardé(s).` : "Aucun bilan dans l'historique."}</p>
                </div>
                <button onClick={handleClearHistory} disabled={diagnosticHistory.length === 0} className="w-full sm:w-auto bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">
                  Vider l'historique
                </button>
            </div>
             <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-200">Hub de Santé</h4>
                  <p className="text-sm text-slate-400">{journalData.length > 0 ? `${journalData.length} jour(s) de données enregistrés.` : "Aucune donnée dans le hub."}</p>
                </div>
                <button onClick={handleClearJournal} disabled={journalData.length === 0} className="w-full sm:w-auto bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">
                  Vider le hub
                </button>
            </div>
             <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-200">Pilulier Intelligent</h4>
                  <p className="text-sm text-slate-400">{pillboxData.length > 0 ? `${pillboxData.length} traitement(s) enregistré(s).` : "Aucun traitement enregistré."}</p>
                </div>
                <button onClick={handleClearPillbox} disabled={pillboxData.length === 0} className="w-full sm:w-auto bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">
                  Vider le pilulier
                </button>
            </div>
             <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-200">Profil de Pré-remplissage</h4>
                   <p className="text-sm text-slate-400">Données sauvegardées pour accélérer vos futurs diagnostics.</p>
                </div>
                <button onClick={handleClearProfile} className="w-full sm:w-auto bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors">
                  Supprimer mon profil
                </button>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-slate-200">Progression de Formation</h4>
                   <div className="text-sm text-slate-400 flex items-center gap-3 mt-1">
                        <span>Protéger: {trainingProgress.protect ? <CheckCircleIcon className="h-5 w-5 inline text-green-400"/> : 'Non complété'}</span>
                        <span>Alerter: {trainingProgress.alert ? <CheckCircleIcon className="h-5 w-5 inline text-green-400"/> : 'Non complété'}</span>
                        <span>Secourir: {trainingProgress.rescue ? <CheckCircleIcon className="h-5 w-5 inline text-green-400"/> : 'Non complété'}</span>
                   </div>
                </div>
                <button onClick={handleClearTrainingProgress} className="w-full sm:w-auto bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors">
                  Réinitialiser
                </button>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-700 text-center">
        <button onClick={onBackToLanding} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;