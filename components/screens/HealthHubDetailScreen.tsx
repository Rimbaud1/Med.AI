import React from 'react';
import type { DailyLog, HubModule } from '../../types';
import { MoonIcon, DropletIcon, ForkKnifeIcon, DumbbellIcon, ChartBarIcon } from '../icons';

interface HealthHubDetailScreenProps {
  module: HubModule;
  healthData: DailyLog[];
  onBack: () => void;
  hydrationGoal: number;
}

const StatCard: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg text-center border border-slate-700">
        <p className="text-2xl md:text-3xl font-bold text-sky-300">{value}<span className="text-base font-normal text-slate-400 ml-1">{unit}</span></p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
);

const HealthHubDetailScreen: React.FC<HealthHubDetailScreenProps> = ({ module, healthData, onBack, hydrationGoal }) => {
    const last7DaysData = healthData.slice(-7);

    const moduleConfig = {
        sleep: {
            title: "Détail du Sommeil",
            icon: <MoonIcon className="h-10 w-10 text-indigo-400" />,
            bgColor: "bg-indigo-500/10",
            borderColor: "border-indigo-500/30",
            renderStats: () => {
                const logsWithSleep = last7DaysData.filter(log => log.sleep?.durationHours);
                if (logsWithSleep.length === 0) return <p>Pas de données de sommeil.</p>;

                const avgDuration = logsWithSleep.reduce((sum, log) => sum + (log.sleep!.durationHours || 0), 0) / logsWithSleep.length;
                const avgAwakenings = logsWithSleep.reduce((sum, log) => sum + log.sleep!.awakenings, 0) / logsWithSleep.length;
                
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatCard label="Durée moyenne (7j)" value={avgDuration.toFixed(1)} unit="h" />
                        <StatCard label="Réveils moyens (7j)" value={avgAwakenings.toFixed(1)} />
                    </div>
                );
            }
        },
        hydration: {
            title: "Détail de l'Hydratation",
            icon: <DropletIcon className="h-10 w-10 text-sky-400" />,
            bgColor: "bg-sky-500/10",
            borderColor: "border-sky-500/30",
            renderStats: () => {
                if (last7DaysData.length === 0) return <p>Pas de données d'hydratation.</p>;
                const avgHydration = last7DaysData.reduce((sum, log) => sum + log.hydrationMilliliters, 0) / last7DaysData.length;
                const daysGoalReached = last7DaysData.filter(log => log.hydrationMilliliters >= hydrationGoal).length;

                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatCard label="Moyenne (7j)" value={Math.round(avgHydration)} unit="ml" />
                        <StatCard label="Jours d'objectif atteint (7j)" value={`${daysGoalReached} / ${last7DaysData.length}`} />
                    </div>
                );
            }
        },
        meals: {
            title: "Détail des Repas",
            icon: <ForkKnifeIcon className="h-10 w-10 text-amber-400" />,
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/30",
            renderStats: () => {
                const logsWithMeals = last7DaysData.filter(log => log.meals.length > 0);
                if (logsWithMeals.length === 0) return <p>Pas de données de repas.</p>;
                const totalCalories = logsWithMeals.flatMap(log => log.meals).reduce((sum, meal) => sum + (meal.nutritionalInfo?.calories || 0), 0);
                const avgCalories = totalCalories / logsWithMeals.length;

                return (
                     <div className="grid grid-cols-1 gap-4">
                        <StatCard label="Calories moyennes / jour (7j)" value={Math.round(avgCalories)} unit="kcal" />
                    </div>
                )
            }
        },
        activities: {
            title: "Détail des Activités",
            icon: <DumbbellIcon className="h-10 w-10 text-rose-400" />,
            bgColor: "bg-rose-500/10",
            borderColor: "border-rose-500/30",
             renderStats: () => {
                const logsWithActivities = last7DaysData.filter(log => log.activities.length > 0);
                if (logsWithActivities.length === 0) return <p>Pas de données d'activités.</p>;
                const totalCalories = logsWithActivities.flatMap(log => log.activities).reduce((sum, act) => sum + (act.analysis?.caloriesBurned || 0), 0);
                const avgCalories = totalCalories / logsWithActivities.length;
                 return (
                     <div className="grid grid-cols-1 gap-4">
                        <StatCard label="Calories brûlées / jour (7j)" value={Math.round(avgCalories)} unit="kcal" />
                    </div>
                )
            }
        },
        symptoms: {
            title: "Détail des Symptômes",
            icon: <ChartBarIcon className="h-10 w-10 text-purple-400" />,
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/30",
            renderStats: () => <p>Les graphiques d'évolution des symptômes seront bientôt disponibles ici.</p>
        },
    };

    const config = moduleConfig[module];

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className={`${config.bgColor} p-4 rounded-full border ${config.borderColor}`}>
                        {config.icon}
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-100">{config.title}</h1>
                        <p className="mt-1 text-slate-400">Analyse sur les 7 derniers jours.</p>
                    </div>
                </div>
                <button onClick={onBack} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Retour au Hub</button>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                {config.renderStats()}
            </div>
            
            {/* Placeholder for future charts */}
            <div className="mt-6 bg-slate-800/50 p-6 rounded-lg border border-slate-700 min-h-[200px] flex items-center justify-center">
                 <p className="text-slate-500">Graphiques détaillés à venir...</p>
            </div>
        </div>
    );
};

export default HealthHubDetailScreen;
