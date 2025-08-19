import React from 'react';
import { 
    InformationCircleIcon, 
    ClipboardDocumentCheckIcon, 
    SparklesIcon, 
    DocumentArrowDownIcon, 
    ArrowTrendingUpIcon, 
    ChatBubbleLeftRightIcon, 
    ShieldCheckIcon, 
    BeakerIcon, 
    ShieldExclamationIcon,
    StethoscopeIcon,
    ChartBarIcon,
    QuestionMarkCircleIcon,
    MagnifyingGlassIcon,
    BrainIcon,
    CameraIcon,
    ScaleIcon,
    LungIcon,
    ClipboardListIcon,
    CalendarDaysIcon,
    HandThumbUpIcon,
    SpeakerWaveIcon,
    BookOpenIcon
} from '../icons';

interface HowItWorksScreenProps {
  onBackToLanding: () => void;
}

const FeatureCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; sectionTitle?: string }> = ({ title, icon, children, sectionTitle }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        {sectionTitle && <p className="text-sm font-bold text-sky-400 mb-3 uppercase tracking-wider">{sectionTitle}</p>}
        <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 bg-sky-500/10 p-3 rounded-full border border-sky-500/30">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        </div>
        <div className="text-slate-300 space-y-3 text-sm md:text-base leading-relaxed">{children}</div>
    </div>
);


const HowItWorksScreen: React.FC<HowItWorksScreenProps> = ({ onBackToLanding }) => {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex flex-col items-center text-center gap-4 mb-12">
                <div className="bg-sky-500/10 p-4 rounded-full border border-sky-500/30">
                    <InformationCircleIcon className="h-12 w-12 text-sky-400" />
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Comment Ça Fonctionne ?</h1>
                    <p className="mt-2 text-lg text-slate-400">Un guide pas-à-pas de chaque écran, fonctionnalité et décision de l'IA dans Med.AI.</p>
                </div>
            </div>
            
            <div className="space-y-12">
                {/* Section 1: Le Parcours de Pré-diagnostic */}
                <div>
                    <h2 className="text-3xl font-bold text-center text-slate-200 mb-6 pb-3 border-b-2 border-slate-700">Le Parcours de Pré-diagnostic Guidé</h2>
                    <div className="space-y-6">
                        <FeatureCard title="Étape 1 : Description & Contexte" icon={<StethoscopeIcon className="h-8 w-8 text-sky-400" />} sectionTitle="Phase 1 : Initialisation">
                           <p><strong>Écran d'accueil & Initial :</strong> Tout commence par vous. Dans une zone de texte simple, vous décrivez vos symptômes avec vos propres mots. L'IA analyse ce texte pour extraire les symptômes clés qui serviront de base à l'analyse.</p>
                           <p><strong>Écran de Contexte :</strong> Ensuite, l'application vous demande des informations cruciales (âge, sexe, pathologies connues, traitements, allergies, voyages). Ces données ne sont pas anodines : elles permettent à l'IA d'ajuster son raisonnement. Un symptôme peut être bénin à 30 ans mais préoccupant à 65 ans. Un voyage récent peut orienter vers des maladies tropicales. Ce contexte est fondamental pour la pertinence du diagnostic.</p>
                        </FeatureCard>

                        <FeatureCard title="Étape 2 : Quantification & Qualification" icon={<ChartBarIcon className="h-8 w-8 text-sky-400" />} sectionTitle="Phase 2 : Évaluation">
                           <p><strong>Écran d'Intensité :</strong> L'IA vous présente les symptômes qu'elle a identifiés et vous demande de sélectionner le <strong>symptôme principal</strong>. C'est l'ancre de l'analyse. Vous pouvez ensuite évaluer l'intensité de chaque symptôme sur une échelle de 1 à 10 pour aider l'IA à comprendre le degré de sévérité.</p>
                           <p><strong>Écran des Caractéristiques :</strong> Des questions ciblées (Avez-vous de la fièvre ? Votre entourage est-il malade ? Le symptôme est-il constant ou intermittent ?) ajoutent des couches de précision. Une fièvre oriente vers une infection, des symptômes dans l'entourage vers une maladie contagieuse.</p>
                        </FeatureCard>

                         <FeatureCard title="Étape 3 : Le Questionnaire Intelligent" icon={<QuestionMarkCircleIcon className="h-8 w-8 text-sky-400" />} sectionTitle="Phase 3 : Interrogation Dynamique">
                           <p><strong>Écrans de Pré-Questionnaire & Questionnaire :</strong> C'est le cœur du réacteur IA. Après quelques questions sur des événements récents (stress, vaccin, contact malade), Gemini génère un <strong>questionnaire unique et dynamique</strong>, créé spécifiquement pour vous. Il n'est pas pré-écrit. L'IA le construit en se basant sur VOS symptômes, VOTRE contexte et VOS réponses précédentes pour explorer les pistes diagnostiques les plus probables et en écarter d'autres.</p>
                           <p>Pour garantir que tout est clair, les termes médicaux sont accompagnés de définitions simples et accessibles au survol de la souris.</p>
                        </FeatureCard>
                        
                        <FeatureCard title="Étape 4 : Filtres & Examens Guidés Conditionnels" icon={<MagnifyingGlassIcon className="h-8 w-8 text-sky-400" />} sectionTitle="Phase 4 : Vérification et Précision">
                           <p>Pour atteindre un niveau de précision maximal et garantir votre sécurité, l'IA peut vous proposer plusieurs étapes de vérification, <strong>uniquement si elles sont jugées pertinentes</strong> par l'algorithme pour votre situation :</p>
                           <ul className="list-disc list-inside space-y-3 pl-2">
                                <li><strong><BrainIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-sky-400"/>Test de Mémoire à Court Terme :</strong> L'IA peut vous présenter 3 mots simples à retenir. Quelques minutes plus tard, après le questionnaire, elle vous demandera de les restituer. C'est un test très efficace pour évaluer objectivement la concentration, un "brouillard mental" ou une confusion.</li>
                                <li><strong><ShieldExclamationIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-red-400"/>Filtre d'Exclusion :</strong> L'IA génère une liste de symptômes importants que vous n'avez pas mentionnés. En confirmant leur absence, vous aidez activement l'IA à réaliser un "diagnostic différentiel", c'est-à-dire à éliminer d'autres pathologies qui pourraient ressembler à la vôtre.</li>
                                <li><strong><MagnifyingGlassIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-sky-400"/>Auto-Examen Guidé :</strong> Vous recevez une instruction claire pour un geste d'observation simple et 100% sûr (ex: "Appuyez sur votre ventre, la douleur est-elle plus forte en appuyant ou en relâchant ?"). Votre description de la sensation fournit une donnée inestimable.</li>
                                <li><strong><BrainIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-sky-400"/>Test Neurologique Simplifié :</strong> En cas de symptômes évocateurs (vertiges, maux de tête intenses...), l'IA peut vous proposer 1 à 3 questions (sourire, lever les bras...) pour détecter en amont des signes d'alerte neurologique.</li>
                                <li><strong><HandThumbUpIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-sky-400"/>Temps de Recoloration Cutanée (TRC) :</strong> Un minuteur vous aide à réaliser ce test simple (presser l'ongle 5s puis relâcher) pour évaluer votre état d'hydratation et de circulation sanguine, très utile en cas de fièvre ou de gastro-entérite.</li>
                                <li><strong><LungIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-sky-400"/>Fréquence Respiratoire :</strong> Un minuteur vous aide à compter vos respirations, une donnée vitale en cas de suspicion d'infection respiratoire.</li>
                                <li><strong><ScaleIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-sky-400"/>Test de Stabilité :</strong> Un test d'équilibre de 15 secondes pour évaluer les troubles liés aux vertiges ou à l'oreille interne.</li>
                                <li><strong><SpeakerWaveIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-sky-400"/>Test d'Essoufflement à la Parole :</strong> Pour quantifier objectivement une dyspnée (difficulté à respirer), l'IA vous affiche une phrase. Vous devez la lire à voix haute sans reprendre votre souffle et cliquer sur le dernier mot atteint. C'est un indicateur très puissant de détresse respiratoire.</li>
                                <li><strong><CameraIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-sky-400"/>Analyse Photo :</strong> En cas de symptôme visible (éruption cutanée, irritation de la gorge), l'IA vous suggère de prendre une photo. L'image est analysée par le modèle multimodal pour une précision accrue.</li>
                           </ul>
                        </FeatureCard>
                    </div>
                </div>

                 {/* Section 2: Le Rapport */}
                <div>
                    <h2 className="text-3xl font-bold text-center text-slate-200 mb-6 pb-3 border-b-2 border-slate-700">Votre Rapport Complet et Interactif</h2>
                     <div className="space-y-6">
                        <FeatureCard title="Le Tableau de Bord de votre Santé" icon={<ClipboardListIcon className="h-8 w-8 text-sky-400" />}>
                           <p><strong>Écran de Surveillance & Rapport :</strong> La sécurité prime. Avant même de voir le rapport, un écran vous présente les <strong>signes de gravité à surveiller</strong> dans les 48h. Une fois cette information cruciale lue, vous accédez à votre tableau de bord complet, qui contient :</p>
                           <ul className="list-disc list-inside space-y-2 pl-2">
                                <li>Un <strong>avertissement clair</strong> rappelant que ceci n'est pas un avis médical final.</li>
                                <li>Une <strong>estimation de la gravité</strong> (Faible, Modérée, Élevée) avec un code couleur pour une lecture rapide.</li>
                                <li>Une liste d'<strong>hypothèses diagnostiques</strong> avec un score de confiance et une description pour chacune.</li>
                                <li>Des <strong>recommandations</strong> concrètes, des suggestions de <strong>produits sans ordonnance</strong>, et des conseils spécifiques (période d'isolement, guide de nutrition si pertinent).</li>
                                <li><strong><CalendarDaysIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-blue-400"/>Prise de RDV intelligente :</strong> Basé sur le diagnostic le plus probable et votre localisation (si fournie), l'IA détermine le <strong>spécialiste le plus pertinent</strong> (généraliste, pédiatre, dermatologue...). Le bouton "Prendre RDV" ouvre Doctolib avec la recherche déjà pré-remplie pour vous ! Un autre bouton vous permet de trouver la pharmacie la plus proche via Google Maps.</li>
                           </ul>
                        </FeatureCard>

                        <FeatureCard title="Les Outils d'Action Post-Bilan" icon={<SparklesIcon className="h-8 w-8 text-sky-400" />}>
                           <p>Le rapport n'est pas une finalité, c'est un point de départ. Il débloque une suite d'outils uniques conçus pour vous accompagner :</p>
                           <ul className="list-disc list-inside space-y-3 pl-2">
                                <li><strong><DocumentArrowDownIcon className="h-5 w-5 inline-block -mt-1 mr-1"/>Télécharger le Bilan PDF :</strong> Génère un document PDF ultra-détaillé qui récapitule <strong>chaque réponse de votre parcours</strong>. Un document inestimable à archiver ou à partager avec un professionnel de santé, qui verra ainsi tout votre cheminement de pensée.</li>
                                <li><strong><ClipboardDocumentCheckIcon className="h-5 w-5 inline-block -mt-1 mr-1"/>Préparer ma Consultation :</strong> Pour réduire le stress d'un rdv médical, cet outil génère un <strong>script simple</strong> ("Bonjour Docteur, je viens vous voir car...") que vous pouvez lire, ainsi qu'une liste de <strong>questions probables</strong> que le médecin pourrait vous poser, pour que vous puissiez préparer vos réponses.</li>
                                <li><strong><ArrowTrendingUpIcon className="h-5 w-5 inline-block -mt-1 mr-1"/>Simulateur d'Évolution :</strong> Une des fonctionnalités les plus puissantes. L'IA projette 3 scénarios pour les 48 prochaines heures : <strong>Favorable, À surveiller, et Inquiétant</strong>. Chaque scénario décrit les signes à observer et l'action à entreprendre, vous transformant en acteur de votre surveillance.</li>
                                <li><strong><ChatBubbleLeftRightIcon className="h-5 w-5 inline-block -mt-1 mr-1"/>Soutien Psychologique "Aura" :</strong> Discutez de vos résultats et de vos angoisses avec Aura, notre IA conversationnelle. Son originalité : vous pouvez <strong>choisir son niveau d'empathie</strong>, de "Direct" à "Très Empathique", pour un soutien qui s'adapte à votre besoin du moment.</li>
                                <li><strong><BookOpenIcon className="h-5 w-5 inline-block -mt-1 mr-1 text-purple-400"/>Journal de Symptômes :</strong> Après un diagnostic, Med.AI ne vous laisse pas seul avec un rapport. Il se transforme en partenaire à long terme en vous proposant de suivre l'évolution de vos symptômes principaux. Chaque jour, vous pouvez noter l'intensité de votre fatigue, de vos douleurs, etc., sur une échelle de 1 à 10. L'application génère alors des graphiques clairs, vous permettant, ainsi qu'à votre médecin, de visualiser objectivement l'évolution dans le temps et de juger de l'efficacité d'un traitement.</li>
                           </ul>
                        </FeatureCard>
                     </div>
                </div>

                {/* Section 3: Autres Fonctionnalités */}
                <div>
                    <h2 className="text-3xl font-bold text-center text-slate-200 mb-6 pb-3 border-b-2 border-slate-700">Nos Autres Outils Stratégiques</h2>
                     <div className="space-y-6">
                        <FeatureCard title="Plan de Prévention Personnalisé" icon={<ShieldCheckIcon className="h-8 w-8 text-sky-400" />}>
                            <p>La santé, c'est aussi anticiper. Cet outil, accessible depuis l'accueil, vous permet de remplir un profil complet sur vos habitudes de vie (alimentation, sport, tabac...) et vos antécédents personnels et familiaux. En retour, l'IA vous fournit un <strong>plan d'action préventif</strong> avec des recommandations sur les dépistages à réaliser, les vaccins à vérifier et des conseils de style de vie pour prendre soin de votre santé sur le long terme.</p>
                        </FeatureCard>

                        <FeatureCard title="Accès Direct aux Conseils ('Je sais déjà ce que j'ai')" icon={<BeakerIcon className="h-8 w-8 text-sky-400" />}>
                           <p>Un raccourci puissant pour les situations du quotidien. Si vous savez que vous avez une "Grippe" ou une "Gastro-entérite", entrez-le dans ce champ sur l'accueil. Vous obtiendrez <strong>instantanément une fiche d'information complète</strong> avec les conseils de prise en charge, les médicaments utiles, un guide nutritionnel adapté et, surtout, les <strong>signes de gravité</strong> qui doivent vous alerter et vous pousser à consulter.</p>
                        </FeatureCard>

                         <FeatureCard title="Guide d'Urgence et Premiers Secours" icon={<ShieldExclamationIcon className="h-8 w-8 text-sky-400" />}>
                            <p>La sécurité est notre priorité absolue. Accessible en un clic depuis l'accueil, cette section est votre premier réflexe en cas de doute sur une situation grave. Elle liste les signes d'une urgence vitale (douleur thoracique, difficulté à respirer...) et vous donne un accès direct par des boutons cliquables aux <strong>numéros d'urgence (15, 18, 112)</strong>. En cas d'urgence, c'est la seule page à consulter.</p>
                        </FeatureCard>
                    </div>
                </div>

            </div>
      
            <div className="mt-12 pt-8 border-t border-slate-700 text-center">
                <button
                onClick={onBackToLanding}
                className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200"
                >
                Retour à l'accueil
                </button>
            </div>
        </div>
    );
};

export default HowItWorksScreen;