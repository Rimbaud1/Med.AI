

import React, { useState, useEffect, useRef } from 'react';
import { 
    SparklesIcon,
    StethoscopeIcon,
    ClipboardListIcon,
    ArrowTrendingUpIcon,
    ChatBubbleLeftRightIcon,
    ShieldCheckIcon,
    BookOpenIcon,
    PillIcon,
    AcademicCapIcon,
    ShieldExclamationIcon,
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
    CameraIcon
} from '../icons';

interface DiscoverScreenProps {
  onBackToLanding: () => void;
}

const slideData = [
    {
        icon: StethoscopeIcon,
        title: "Le Diagnostic Guidé",
        subtitle: "Un processus d'analyse approfondi, dynamique et personnalisé qui va bien au-delà d'un simple questionnaire.",
        color: "cyan",
        features: [
            { icon: ClipboardListIcon, title: "Questionnaire Intelligent", description: "L'IA génère un questionnaire unique, créé en temps réel pour vous, basé sur vos symptômes et votre contexte." },
            { icon: MagnifyingGlassIcon, title: "Tests Cliniques Guidés", description: "Si pertinent, l'IA vous guide à travers des tests simples et sûrs (mémoire, stabilité, respiration...) pour affiner l'analyse." },
            { icon: CameraIcon, title: "Analyse Photo", description: "Un symptôme visible ? Notre IA multimodale analyse l'image en corrélation avec vos symptômes pour une précision accrue." },
        ]
    },
    {
        icon: DocumentArrowDownIcon,
        title: "Le Rapport : De l'Information à l'Action",
        subtitle: "Un bilan qui ne vous laisse pas seul. Chaque rapport est une porte d'entrée vers des outils concrets pour agir.",
        color: "sky",
        features: [
            { icon: ClipboardListIcon, title: "Tableau de Bord Santé", description: "Recevez un rapport clair : gravité, hypothèses, recommandations, et un bouton intelligent pour trouver le bon spécialiste sur Doctolib." },
            { icon: ArrowTrendingUpIcon, title: "Simulateur d'Évolution", description: "Visualisez 3 scénarios possibles (favorable, à surveiller, inquiétant) pour les 48h suivantes, avec les signes à observer et les actions à prendre." },
            { icon: ChatBubbleLeftRightIcon, title: "Soutien Psychologique 'Aura'", description: "Discutez de vos résultats avec Aura, une IA de soutien dont vous pouvez ajuster le niveau d'empathie pour une conversation qui s'adapte à vous." },
        ]
    },
    {
        icon: ShieldCheckIcon,
        title: "Gestion de Santé à Long Terme",
        subtitle: "Med.AI vous accompagne au-delà du symptôme ponctuel, avec des outils pour une gestion proactive de votre santé.",
        color: "teal",
        features: [
            { icon: ShieldCheckIcon, title: "Plan de Prévention & Analyse de Risques", description: "Recevez un plan personnalisé et une analyse de vos risques de maladies chroniques avec des actions concrètes pour les réduire." },
            { icon: BookOpenIcon, title: "Journal de Santé & Détection de Tendances", description: "Suivez vos symptômes et demandez à l'IA d'analyser vos données pour détecter des corrélations ou des dégradations invisibles à l'œil nu." },
            { icon: PillIcon, title: "Pilulier Intelligent", description: "Gérez vos traitements et comprenez-les. L'IA vous informe des effets secondaires potentiels (communs et rares) pour chaque médicament." },
        ]
    },
    {
        icon: AcademicCapIcon,
        title: "Savoir Réagir : Formation & Urgence",
        subtitle: "Parce que la connaissance et la préparation sont les clés, Med.AI vous arme pour faire face à l'imprévu.",
        color: "indigo",
        features: [
            { icon: AcademicCapIcon, title: "Formation Interactive aux Premiers Secours", description: "Apprenez les gestes qui sauvent via des modules théoriques clairs et des scénarios interactifs générés par IA pour tester vos compétences." },
            { icon: ShieldExclamationIcon, title: "Guide d'Urgence", description: "En cas de situation critique, accédez en un clic aux signes d'une urgence vitale et aux numéros à appeler. Rapide, clair et vital." },
        ]
    },
    {
        icon: SparklesIcon,
        title: "Notre Engagement : Confiance & Transparence",
        subtitle: "Votre confiance est notre priorité. Découvrez comment nous protégeons vos données et assurons une transparence totale.",
        color: "fuchsia",
        features: [
            { icon: ShieldCheckIcon, title: "Zéro Serveur, Zéro Compte", description: "Med.AI fonctionne entièrement sur votre navigateur. Il n'y a aucun serveur central pour stocker vos données. Tout reste sur votre appareil." },
            { icon: BookOpenIcon, title: "100% Open Source", description: "L'intégralité du code de Med.AI est publique et vérifiable sur GitHub. Vous pouvez voir par vous-même comment vos données sont gérées." },
        ]
    }
];

const colorVariants = {
    cyan: { text: 'text-cyan-300', bg: 'bg-cyan-500', border: 'border-cyan-500/30', accentBg: 'bg-cyan-500/10' },
    sky: { text: 'text-sky-300', bg: 'bg-sky-500', border: 'border-sky-500/30', accentBg: 'bg-sky-500/10' },
    teal: { text: 'text-teal-300', bg: 'bg-teal-500', border: 'border-teal-500/30', accentBg: 'bg-teal-500/10' },
    indigo: { text: 'text-indigo-300', bg: 'bg-indigo-500', border: 'border-indigo-500/30', accentBg: 'bg-indigo-500/10' },
    fuchsia: { text: 'text-fuchsia-300', bg: 'bg-fuchsia-500', border: 'border-fuchsia-500/30', accentBg: 'bg-fuchsia-500/10' },
};


const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ onBackToLanding }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = slideRefs.current.indexOf(entry.target as HTMLDivElement);
                        if (index > -1) {
                            setActiveSlide(index);
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        slideRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            slideRefs.current.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);
    
    const scrollToSlide = (index: number) => {
        slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full h-screen bg-slate-900 font-sans relative overflow-hidden">
            <style>{`
                .slide-content-enter {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 500ms ease-out, transform 500ms ease-out;
                }
                .slide-in .slide-content-enter {
                    opacity: 1;
                    transform: translateY(0);
                }
                .feature-card-enter {
                    opacity: 0;
                    transform: scale(0.95) translateY(10px);
                    transition: opacity 400ms ease-out, transform 400ms ease-out;
                }
                .slide-in .feature-card-enter {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            `}</style>

             <button 
                onClick={onBackToLanding}
                className="absolute top-5 right-5 z-20 px-4 py-2 bg-slate-700/50 text-slate-200 font-semibold rounded-lg hover:bg-slate-700/80 transition-colors backdrop-blur-sm text-sm"
            >
                Retour à l'accueil
            </button>

            {/* Side Navigation */}
            <div className="absolute left-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                {slideData.map((_, index) => {
                    const colors = colorVariants[slideData[index].color as keyof typeof colorVariants];
                    return (
                        <button
                            key={index}
                            onClick={() => scrollToSlide(index)}
                            className={`h-3 w-3 rounded-full transition-all duration-300 ${activeSlide === index ? `${colors.bg} scale-150` : 'bg-slate-600 hover:bg-slate-400'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    );
                })}
            </div>
            
            <div ref={containerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory">
                {slideData.map((slide, index) => {
                    const colors = colorVariants[slide.color as keyof typeof colorVariants];
                    const Icon = slide.icon;
                    return (
                        <div
                            key={index}
                            // FIX: Correct the ref callback to have a void return type by using a block body.
                            ref={el => { slideRefs.current[index] = el; }}
                            className={`h-full w-full snap-start flex items-center justify-center p-6 md:p-10 relative overflow-hidden ${activeSlide === index ? 'slide-in' : ''}`}
                        >
                             <div className="w-full max-w-5xl mx-auto">
                                <div className="flex flex-col items-center text-center gap-4 mb-10 slide-content-enter">
                                    <div className={`${colors.accentBg} p-4 rounded-full border ${colors.border}`}>
                                        <Icon className="h-10 w-10" />
                                    </div>
                                    <div>
                                        <h1 className={`text-4xl md:text-5xl font-bold ${colors.text}`}>{slide.title}</h1>
                                        <p className="mt-2 text-md md:text-lg text-slate-400 max-w-3xl mx-auto">{slide.subtitle}</p>
                                    </div>
                                </div>
                                <div className={`grid grid-cols-1 ${slide.features.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                                   {slide.features.map((feature, fIndex) => {
                                       const FeatureIcon = feature.icon;
                                       return (
                                           <div 
                                                key={fIndex} 
                                                style={{ transitionDelay: `${150 + fIndex * 100}ms` }} 
                                                className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/80 shadow-lg feature-card-enter backdrop-blur-sm"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`flex-shrink-0 ${colors.text}`}><FeatureIcon className="h-6 w-6" /></div>
                                                    <h3 className="font-bold text-slate-100">{feature.title}</h3>
                                                </div>
                                                <p className="text-slate-400 text-sm">{feature.description}</p>
                                           </div>
                                       );
                                   })}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default DiscoverScreen;
