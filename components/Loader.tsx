
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowPathIcon, SparklesIcon, CheckCircleIcon } from './icons';

interface LoaderProps {
  text: string;
  isComplete: boolean;
  onContinue?: () => void;
}

const educationalContent = [
    {
        category: "Le Saviez-vous sur Med.AI ?",
        color: "text-sky-300",
        items: [
            { title: "Votre vie privée avant tout", text: "Med.AI n'a pas de serveur central. Toutes les données de votre diagnostic sont traitées sur votre appareil et supprimées à la fin de la session." },
            { title: "PDF Détaillé", text: "Med.AI peut générer un PDF ultra-détaillé de votre consultation, incluant chaque réponse, parfait à partager avec votre médecin." },
            { title: "Simulateur d'Évolution", text: "Après un diagnostic, le simulateur vous donne 3 scénarios (favorable, à surveiller, inquiétant) pour les 48h suivantes, vous rendant acteur de votre surveillance." },
            { title: "IA à la Carte", text: "Vous pouvez ajuster le niveau d'empathie de l'IA 'Aura' dans le chat de soutien psychologique, de 'Direct' à 'Très Empathique'." },
            { title: "Détection de Tendances", text: "L'analyse de votre journal de santé peut détecter des corrélations (ex: essoufflement lié à un rythme cardiaque élevé) que vous n'auriez pas vues." },
            { title: "Prévention Proactive", text: "Le plan de prévention analyse vos risques pour des maladies chroniques et vous donne des actions concrètes et chiffrées pour les réduire." },
            { title: "Quantifier l'Invisible", text: "Le test d'essoufflement à la parole est un moyen objectif de quantifier une difficulté respiratoire, un symptôme souvent subjectif." },
            { title: "Open Source et Transparent", text: "Med.AI est entièrement open-source. Son code est vérifiable par tous sur GitHub pour une transparence totale." },
            { title: "RDV Intelligent", text: "Le bouton 'Prendre RDV' ouvre Doctolib avec le bon spécialiste et votre ville déjà pré-remplis !" },
            { title: "Anti-Stress Médical", text: "La section 'Préparer ma consultation' vous aide à réduire le stress avant un rendez-vous en générant un script et des questions probables." },
            { title: "Diagnostic Différentiel", text: "Le 'Filtre d'Exclusion' aide l'IA à effectuer un diagnostic différentiel, une technique utilisée par les médecins pour éliminer des pathologies." },
            { title: "Scénarios Uniques", text: "Les scénarios de la formation aux premiers secours sont générés par IA pour être uniques à chaque session d'entraînement." },
            { title: "Confidentialité Maximale", text: "Vous pouvez utiliser votre propre clé d'API Google pour une confidentialité maximale. Voir les Paramètres pour plus d'infos." },
            { title: "Inspiré de la Neurologie", text: "Le test de stabilité de 15 secondes est une version simplifiée du test de Romberg, utilisé par les neurologues." },
            { title: "IA Multimodale", text: "L'analyse de photo utilise un modèle d'IA multimodal, capable de comprendre à la fois le texte de vos symptômes et le contenu de l'image." },
            { title: "Pilulier Augmenté", text: "Le 'Pilulier Intelligent' vous informe des effets secondaires potentiels (communs et rares) de vos médicaments." },
            { title: "Évaluation Cognitive", text: "Le test de mémoire à 3 mots est une technique standard pour évaluer rapidement l'état de confusion ou le 'brouillard mental'." },
            { title: "Questionnaire sur Mesure", text: "Le questionnaire que vous remplissez n'est pas pré-écrit. L'IA le construit en temps réel, spécifiquement pour vous." },
            { title: "Signe d'Hydratation", text: "La mesure du Temps de Recoloration Cutanée (TRC) est un geste simple et rapide pour évaluer votre état d'hydratation." },
            { title: "Accès Direct", text: "Le mode 'Je sais déjà ce que j'ai' vous donne un accès direct aux conseils de soin pour des pathologies courantes." },
            { title: "Contrôle Total", text: "Les données de votre profil peuvent être sauvegardées localement pour pré-remplir les formulaires, mais vous gardez le contrôle total et pouvez les effacer à tout moment." },
            { title: "Conçu pour l'Urgence", text: "La section 'Urgence' est conçue pour être lue en quelques secondes et vous donner les numéros vitaux en un clic." },
            { title: "Nutrition Ciblée", text: "Le 'Guide de Nutrition' dans le rapport vous donne des conseils concrets sur quoi manger le soir même, adaptés à votre diagnostic probable." },
            { title: "Protection de l'Entourage", text: "L'estimation de la 'période d'éviction sociale' vous aide à protéger vos proches en cas de maladie contagieuse." },
            { title: "Outil Pratique", text: "Le 'mot d'excuse' généré est un outil pratique pour prévenir rapidement votre employeur ou une école, sans partager de détails médicaux." },
            { title: "Fonctionnement Hors-Ligne", text: "Med.AI est une 'Progressive Web App' (PWA), ce qui signifie qu'elle peut fonctionner hors-ligne une fois la page chargée." },
            { title: "Design Apaisant", text: "La palette de couleurs et les icônes ont été choisies pour être apaisantes et claires, même en situation de stress." },
            { title: "Démystifier le Jargon", text: "Les 'définitions' sur les choix de réponse du questionnaire sont là pour rendre le vocabulaire médical accessible à tous." },
            { title: "Sécurité d'Abord", text: "Chaque test guidé (respiration, stabilité...) a été conçu pour être simple, sûr et réalisable par tous, souvent avec des avertissements de sécurité." },
            { title: "Transparence Technique", text: "La page 'Comment ça marche' est si détaillée qu'elle est directement extraite du README technique du projet sur GitHub." },
        ]
    },
    {
        category: "Mythes & Vérités Santé",
        color: "text-amber-300",
        items: [
            { myth: "Faire 'craquer' ses doigts donne de l'arthrose.", truth: "Aucune étude n'a prouvé de lien. Le bruit vient de bulles de gaz dans le liquide synovial des articulations." },
            { myth: "Le sucre rend les enfants hyperactifs.", truth: "De nombreuses études ont montré qu'il n'y a pas de lien direct. L'excitation est souvent liée au contexte (fête, anniversaire) plutôt qu'au sucre lui-même." },
            { myth: "On attrape froid en sortant les cheveux mouillés.", truth: "Le froid ne cause pas de rhume, ce sont les virus. Avoir froid peut cependant affaiblir temporairement le système immunitaire." },
            { myth: "Il faut boire 8 verres d'eau par jour.", truth: "Les besoins en eau varient. L'important est de boire régulièrement tout au long de la journée, sans attendre d'avoir soif." },
            { myth: "Lire dans la pénombre abîme les yeux.", truth: "Cela peut causer une fatigue oculaire temporaire et des maux de tête, mais pas de dommages permanents à la vue." },
            { myth: "Les œufs sont mauvais pour le cholestérol.", truth: "Pour la plupart des gens, le cholestérol alimentaire a peu d'impact sur le cholestérol sanguin. Les œufs sont une excellente source de nutriments." },
            { myth: "Le micro-ondes détruit les nutriments.", truth: "Au contraire, sa cuisson rapide est l'une des méthodes qui préservent le mieux les vitamines et minéraux." },
            { myth: "Se raser fait repousser les poils plus épais.", truth: "Le rasage coupe le poil à sa base, là où il est large, donnant une illusion d'épaisseur. La structure du poil ne change pas." },
            { myth: "On n'utilise que 10% de notre cerveau.", truth: "C'est un mythe. L'imagerie cérébrale montre que nous utilisons la quasi-totalité de notre cerveau, même pendant le sommeil." },
            { myth: "Transpirer aide à éliminer les toxines.", truth: "La sueur sert principalement à réguler la température. Ce sont le foie et les reins qui éliminent la grande majorité des toxines." },
            { myth: "Il faut se 'détoxifier' régulièrement.", truth: "Votre corps a déjà un système de détoxification très performant : le foie et les reins. Les 'cures détox' sont souvent inutiles." },
            { myth: "Le chocolat donne de l'acné.", truth: "Aucune étude solide ne prouve un lien direct. L'acné est surtout hormonale et génétique." },
            { myth: "On perd la majorité de sa chaleur par la tête.", truth: "La perte de chaleur est proportionnelle à la surface exposée. La tête ne représente qu'environ 10% de la surface corporelle." },
            { myth: "Il faut prendre des antibiotiques pour un rhume.", truth: "Les antibiotiques combattent les bactéries, pas les virus. Le rhume étant viral, ils sont inutiles et peuvent créer des résistances." },
            { myth: "Sauter le petit-déjeuner fait grossir.", truth: "Ce qui compte est l'apport calorique total sur la journée, pas le moment des repas." },
        ]
    },
    {
        category: "Chiffres Clés de la Santé",
        color: "text-red-300",
        items: [
            { title: "100 000 battements", text: "C'est le nombre moyen de fois que votre cœur bat chaque jour, pompant environ 7 500 litres de sang." },
            { title: "60% d'eau", text: "Le corps humain est composé en moyenne de 60% d'eau, essentielle à toutes les fonctions biologiques." },
            { title: "96 000 kilomètres", text: "Si on mettait bout à bout tous les vaisseaux sanguins d'un adulte (artères, veines, capillaires), ils feraient le tour de la Terre presque 2.5 fois." },
            { title: "206 os", text: "Un squelette adulte est composé de 206 os, mais un bébé naît avec environ 300 os qui fusionnent avec le temps." },
            { title: "86 milliards de neurones", text: "Le cerveau humain contient en moyenne 86 milliards de neurones, créant des trillions de connexions." },
            { title: "2 mètres carrés", text: "La peau est le plus grand organe du corps, avec une surface d'environ 2 mètres carrés chez l'adulte." },
            { title: "1.5 litre de salive", text: "Nous produisons en moyenne 1.5 litre de salive par jour, la première étape de la digestion." },
            { title: "37 000 milliards de cellules", text: "Le corps humain est une colonie incroyablement complexe d'environ 37 000 milliards de cellules." },
            { title: "25% de l'oxygène", text: "Bien qu'il ne représente que 2% du poids corporel, le cerveau consomme environ 25% de l'oxygène que nous respirons." },
            { title: "7 mètres", text: "L'intestin grêle, où se déroule la majeure partie de l'absorption des nutriments, mesure en moyenne 7 mètres de long." },
            { title: "Plus rapide qu'une F1", text: "L'influx nerveux peut voyager à plus de 400 km/h, plus vite qu'une voiture de Formule 1." },
            { title: "120 jours", text: "C'est la durée de vie moyenne d'un globule rouge avant d'être recyclé par la rate." },
            { title: "Un filtre puissant", text: "Les reins filtrent environ 180 litres de sang par jour, éliminant les déchets pour produire 1 à 2 litres d'urine." },
            { title: "Puissance d'un éternuement", text: "Un éternuement peut dépasser les 160 km/h, raison pour laquelle il est important de se couvrir la bouche." },
            { title: "Renouvellement constant", text: "Votre corps remplace des millions de cellules chaque seconde. Vous avez une nouvelle peau environ tous les mois." }
        ]
    },
    {
        category: "Conseils de Prévention",
        color: "text-green-300",
        items: [
            { title: "Marchez 30 minutes par jour", text: "Cette simple habitude peut réduire significativement le risque de maladies cardiovasculaires, de diabète et améliorer l'humeur." },
            { title: "Hydratez-vous", text: "Buvez de l'eau régulièrement tout au long de la journée, même avant d'avoir soif, pour maintenir toutes vos fonctions corporelles." },
            { title: "Dormez 7 à 8 heures", text: "Un sommeil de qualité est crucial pour la réparation cellulaire, la consolidation de la mémoire et la régulation hormonale." },
            { title: "Mangez coloré", text: "Intégrez une variété de fruits et légumes de différentes couleurs dans vos repas pour un maximum de vitamines et d'antioxydants." },
            { title: "Limitez l'ultra-transformé", text: "Réduisez votre consommation d'aliments industriels, souvent riches en sel, sucre, et mauvaises graisses." },
            { title: "Protégez votre peau", text: "Utilisez une protection solaire même par temps nuageux pour prévenir le vieillissement cutané et les cancers de la peau." },
            { title: "Connaissez vos chiffres", text: "Faites contrôler régulièrement votre tension artérielle, votre cholestérol et votre glycémie." },
            { title: "Bougez toutes les heures", text: "Si vous travaillez assis, levez-vous et étirez-vous quelques minutes chaque heure pour contrer les effets de la sédentarité." },
            { title: "Maintenez un lien social", text: "Des relations sociales de qualité sont un facteur prouvé de longévité et de bien-être mental." },
            { title: "Lavez-vous les mains", text: "C'est le geste le plus simple et le plus efficace pour prévenir la propagation des infections." },
            { title: "Ne sautez pas les dépistages", text: "Respectez le calendrier des dépistages recommandés (cancers, vue, audition...). Ils peuvent sauver des vies." },
            { title: "Gérez votre stress", text: "Trouvez une activité qui vous détend (méditation, yoga, lecture, musique) et pratiquez-la régulièrement." },
            { title: "Vaccins à jour", text: "Assurez-vous que vos vaccinations et rappels sont à jour pour vous protéger et protéger les autres." },
            { title: "Écoutez votre corps", text: "Ne négligez pas une douleur persistante, une fatigue anormale ou un changement inhabituel. Consultez en cas de doute." },
            { title: "Mastiquez bien", text: "Une bonne mastication facilite la digestion et permet de mieux ressentir la satiété, aidant à contrôler son poids." },
        ]
    },
    {
        category: "Vocabulaire Médical Simplifié",
        color: "text-indigo-300",
        items: [
            { title: "Céphalée", text: "Le terme médical pour un simple mal de tête." },
            { title: "Myalgie", text: "Signifie 'douleur musculaire'. C'est un symptôme courant de la grippe." },
            { title: "Dyspnée", text: "Une difficulté à respirer, une sensation d'essoufflement." },
            { title: "Asthénie", text: "Une fatigue intense et anormale, qui ne disparaît pas avec le repos." },
            { title: "Tachycardie", text: "Un rythme cardiaque plus rapide que la normale au repos." },
            { title: "Bradycardie", text: "Un rythme cardiaque plus lent que la normale au repos." },
            { title: "Analgésique", text: "Un médicament qui soulage la douleur, comme le paracétamol ou l'ibuprofène." },
            { title: "Antipyrétique", text: "Un médicament qui fait baisser la fièvre." },
            { title: "Hématome", text: "Le nom scientifique pour un 'bleu', une accumulation de sang sous la peau." },
            { title: "Apyrexie", text: "Signifie l'absence de fièvre." },
            { title: "Posologie", text: "La dose et la fréquence à laquelle un médicament doit être pris." },
            { title: "Pathologie chronique", text: "Une maladie de longue durée, qui évolue lentement (ex: diabète, hypertension)." },
            { title: "Symptôme pathognomonique", text: "Un signe clinique si caractéristique d'une maladie qu'il permet de poser le diagnostic à lui seul (très rare)." },
            { title: "Iatrogène", text: "Se dit d'un trouble ou d'une maladie provoqué(e) par un traitement médical." },
            { title: "Prophylaxie", text: "L'ensemble des mesures visant à prévenir l'apparition d'une maladie (ex: vaccination)." }
        ]
    },
];

const Loader: React.FC<LoaderProps> = ({ text, isComplete, onContinue }) => {
  const [currentContent, setCurrentContent] = useState<{ category: string; color: string; item: any; } | null>(null);

  const selectRandomContent = () => {
    const randomCategory = educationalContent[Math.floor(Math.random() * educationalContent.length)];
    const randomItem = randomCategory.items[Math.floor(Math.random() * randomCategory.items.length)];
    setCurrentContent({
      category: randomCategory.category,
      color: randomCategory.color,
      item: randomItem
    });
  };

  useEffect(() => {
    selectRandomContent();
  }, []);

  const renderItem = () => {
    if (!currentContent) return null;
    const { item } = currentContent;

    if (item.myth) {
      return (
        <>
          <div className="mb-3">
            <p className="font-bold text-red-400/90">Mythe :</p>
            <p className="text-slate-300 italic">"{item.myth}"</p>
          </div>
          <div>
            <p className="font-bold text-green-400/90">La vérité :</p>
            <p className="text-slate-300">{item.truth}</p>
          </div>
        </>
      );
    }

    return (
        <>
            <h4 className="font-bold text-slate-100">{item.title}</h4>
            <p className="text-slate-300">{item.text}</p>
        </>
    );
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-4">
      <div className="flex items-center gap-4">
        {!isComplete ? (
          <svg className="animate-spin h-10 w-10 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
            <CheckCircleIcon className="h-10 w-10 text-green-400" />
        )}
        <p className="text-xl font-medium text-slate-300">{isComplete ? "Analyse terminée !" : text}</p>
      </div>
      
      {currentContent && (
         <div className="w-full max-w-2xl mt-8 p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-lg text-left relative animate-in fade-in duration-500">
            <p className={`text-sm font-bold uppercase tracking-wider mb-3 ${currentContent.color}`}>{currentContent.category}</p>
            <div className="space-y-2">{renderItem()}</div>
            <button 
              onClick={selectRandomContent} 
              className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded-full"
              aria-label="Astuce suivante"
              disabled={isComplete}
            >
              <ArrowPathIcon className="h-4 w-4" />
              Info suivante
            </button>
        </div>
      )}

      {isComplete && onContinue && (
          <div className="mt-8 w-full max-w-2xl animate-in fade-in duration-500">
            <button 
                onClick={onContinue}
                className="w-full bg-sky-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-sky-500 transition-colors text-lg"
            >
                Aller à la page suivante
            </button>
          </div>
      )}
    </div>
  );
};

export default Loader;
