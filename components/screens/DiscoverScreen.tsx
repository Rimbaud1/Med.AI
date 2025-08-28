

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
    const [activeSubSlides, setActiveSubSlides] = useState<Record<number, number>>({});

    const containerRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const horizontalScrollersRef = useRef<(HTMLDivElement | null)[]>([]);
    const featureCardRefs = useRef(new Map<string, HTMLDivElement | null>());

    // Vertical scroll observer
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

    // Horizontal scroll observers
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        
        horizontalScrollersRef.current.forEach((scroller, slideIndex) => {
            if (!scroller) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const featureIndex = parseInt(entry.target.getAttribute('data-feature-index') || '0');
                            setActiveSubSlides(prev => ({ ...prev, [slideIndex]: featureIndex }));
                        }
                    });
                },
                { root: scroller, threshold: 0.5 }
            );

            for (let i = 0; i < slideData[slideIndex].features.length; i++) {
                const cardRef = featureCardRefs.current.get(`${slideIndex}-${i}`);
                if (cardRef) {
                    observer.observe(cardRef);
                }
            }
            observers.push(observer);
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    // The dependency array is empty to ensure this effect runs only once after the initial render,
    // as the refs it depends on are populated during that render and are stable thereafter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    const scrollToSlide = (index: number) => {
        slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full h-screen bg-slate-900 font-sans relative overflow-hidden">
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                .scroll-behavior-smooth { scroll-behavior: smooth; }

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

            {/* Vertical Side Navigation */}
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
            
            <div ref={containerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-behavior-smooth">
                {slideData.map((slide, index) => {
                    const colors = colorVariants[slide.color as keyof typeof colorVariants];
                    const Icon = slide.icon;
                    return (
                        <div
                            key={index}
                            ref={el => { slideRefs.current[index] = el; }}
                            className={`h-full w-full snap-start flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden ${activeSlide === index ? 'slide-in' : ''}`}
                        >
                             <div className="flex-shrink-0 flex flex-col items-center text-center gap-4 mb-6 slide-content-enter">
                                <div className={`${colors.accentBg} p-4 rounded-full border ${colors.border} transition-all duration-500 ${activeSlide === index ? 'scale-100' : 'scale-90'}`}>
                                    <Icon className={`h-10 w-10 ${colors.text}`} />
                                </div>
                                <div>
                                    <h1 className={`text-4xl md:text-5xl font-bold ${colors.text}`}>{slide.title}</h1>
                                    <p className="mt-2 text-md text-slate-400 max-w-3xl mx-auto">{slide.subtitle}</p>
                                </div>
                            </div>
                             
                             <div 
                                ref={el => { horizontalScrollersRef.current[index] = el; }}
                                className="w-full flex-grow flex items-center overflow-x-auto snap-x snap-mandatory scroll-behavior-smooth scrollbar-hide"
                            >
                                <div className="flex-shrink-0 w-[calc((100vw-min(80vw,1000px))/2)]"></div> {/* Spacer */}
                                {slide.features.map((feature, fIndex) => {
                                    const FeatureIcon = feature.icon;
                                    return (
                                        <div 
                                            key={fIndex}
                                            // FIX: The ref callback must return void or a cleanup function.
                                            // The original implementation was implicitly returning the result of `Map.set()`, which is the map itself.
                                            // Adding curly braces makes this a function body, which implicitly returns undefined.
                                            ref={el => { featureCardRefs.current.set(`${index}-${fIndex}`, el); }}
                                            data-feature-index={fIndex}
                                            className="w-[min(80vw,1000px)] h-full flex-shrink-0 snap-center flex items-center justify-center p-4"
                                        >
                                           <div 
                                                style={{ transitionDelay: `${150 + fIndex * 100}ms` }} 
                                                className="w-full h-[80%] max-h-[450px] bg-slate-800/60 p-8 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center feature-card-enter"
                                            >
                                                <div className={`flex-shrink-0 p-4 rounded-full ${colors.accentBg} border ${colors.border} mb-4`}>
                                                    <FeatureIcon className={`h-10 w-10 ${colors.text}`} />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-100">{feature.title}</h3>
                                                <p className="text-slate-400 text-base mt-2 max-w-md">{feature.description}</p>
                                           </div>
                                        </div>
                                    );
                                })}
                                <div className="flex-shrink-0 w-[calc((100vw-min(80vw,1000px))/2)]"></div> {/* Spacer */}
                            </div>
                            
                             {/* Horizontal Navigation */}
                            <div className="flex-shrink-0 flex justify-center gap-3 mt-4">
                               {slide.features.map((_, fIndex) => (
                                   <button
                                        key={fIndex}
                                        onClick={() => {
                                            const cardRef = featureCardRefs.current.get(`${index}-${fIndex}`);
                                            cardRef?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                                        }}
                                        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${activeSubSlides[index] === fIndex ? `${colors.bg} scale-125` : 'bg-slate-600 hover:bg-slate-400'}`}
                                        aria-label={`Go to feature ${fIndex + 1}`}
                                   />
                               ))}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DiscoverScreen;