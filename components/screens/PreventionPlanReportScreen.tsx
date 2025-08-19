
import React from 'react';
import type { PreventionPlanData, PreventionRecommendation } from '../../types';
import { WarningIcon, ShieldCheckIcon } from '../icons';

interface PreventionPlanReportScreenProps {
  plan: PreventionPlanData;
  onReset: () => void;
}

const RecommendationCard: React.FC<{ item: PreventionRecommendation }> = ({ item }) => (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/80">
        <h4 className="font-bold text-slate-100">{item.title}</h4>
        <p className="text-sm text-sky-300 my-1 italic">{item.reason}</p>
        <p className="text-slate-300">{item.details}</p>
    </div>
);

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);


const PreventionPlanReportScreen: React.FC<PreventionPlanReportScreenProps> = ({ plan, onReset }) => {

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-4 mb-8">
                <div className="bg-teal-500/10 p-4 rounded-full border border-teal-500/30">
                    <ShieldCheckIcon className="h-10 w-10 text-teal-400" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Votre Plan de Prévention</h1>
                    <p className="mt-1 text-slate-400">Des recommandations personnalisées pour vous aider à rester en bonne santé.</p>
                </div>
            </div>
            
            <div className="space-y-6">
                {/* Disclaimer */}
                <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-4">
                    <WarningIcon className="h-8 w-8 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold">Avertissement Important</h4>
                        <p className="text-sm">{plan.generalDisclaimer}</p>
                    </div>
                </div>

                {/* Recommended Screenings */}
                {plan.recommendedScreenings && plan.recommendedScreenings.length > 0 && (
                    <ReportSection title="Dépistages Recommandés">
                        {plan.recommendedScreenings.map((item, i) => <RecommendationCard key={i} item={item} />)}
                    </ReportSection>
                )}

                {/* Vaccination Advice */}
                {plan.vaccinationAdvice && plan.vaccinationAdvice.length > 0 && (
                    <ReportSection title="Conseils de Vaccination">
                        {plan.vaccinationAdvice.map((item, i) => <RecommendationCard key={i} item={item} />)}
                    </ReportSection>
                )}

                {/* Lifestyle Suggestions */}
                {plan.lifestyleSuggestions && plan.lifestyleSuggestions.length > 0 && (
                    <ReportSection title="Suggestions de Style de Vie">
                        {plan.lifestyleSuggestions.map((item, i) => <RecommendationCard key={i} item={item} />)}
                    </ReportSection>
                )}
            </div>
      
            <div className="mt-10 pt-6 border-t border-slate-700 text-center">
                <button
                onClick={onReset}
                className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200"
                >
                Retour à l'accueil
                </button>
            </div>
        </div>
    );
};

export default PreventionPlanReportScreen;
