
import React, { useState, useEffect } from 'react';
import { ArrowPathIcon } from './icons';

interface LoaderProps {
  text: string;
}

const healthTips = [
  {
    myth: "Il faut prendre des antibiotiques pour un rhume.",
    truth: "Les antibiotiques combattent les bactéries, pas les virus. Le rhume étant viral, ils sont inutiles et peuvent même créer des résistances."
  },
  {
    myth: "Le sucre rend les enfants hyperactifs.",
    truth: "De nombreuses études ont montré qu'il n'y a pas de lien direct. L'excitation est souvent liée au contexte (fête, anniversaire) plutôt qu'au sucre lui-même."
  },
  {
    myth: "Faire 'craquer' ses doigts donne de l'arthrose.",
    truth: "Aucune étude n'a prouvé de lien entre le craquement des articulations et l'arthrose. Le bruit vient de bulles de gaz dans le liquide synovial."
  },
  {
    myth: "Transpirer aide à éliminer les toxines.",
    truth: "La sueur sert principalement à réguler la température. Ce sont le foie et les reins qui éliminent la grande majorité des toxines du corps."
  },
  {
    myth: "On attrape froid en sortant les cheveux mouillés.",
    truth: "Le froid ne cause pas de rhume, ce sont les virus. Avoir froid peut cependant affaiblir temporairement le système immunitaire, vous rendant plus vulnérable."
  },
  {
    myth: "Il faut boire 8 verres d'eau par jour.",
    truth: "Les besoins en eau varient selon l'âge, le climat, et l'activité physique. L'important est de boire régulièrement tout au long de la journée, sans attendre d'avoir soif."
  },
  {
    myth: "Sauter le petit-déjeuner fait grossir.",
    truth: "Ce qui compte est l'apport calorique total sur la journée, pas le moment des repas. Pour certains, jeûner le matin est même bénéfique."
  },
  {
    myth: "Lire dans la pénombre abîme les yeux.",
    truth: "Cela peut causer une fatigue oculaire temporaire et des maux de tête, mais il n'y a pas de preuve que cela cause des dommages permanents à la vue."
  },
  {
    myth: "Les œufs sont mauvais pour le cholestérol.",
    truth: "Pour la plupart des gens, le cholestérol alimentaire a peu d'impact sur le cholestérol sanguin. Les œufs sont une excellente source de protéines et de nutriments."
  },
  {
    myth: "Le micro-ondes détruit les nutriments des aliments.",
    truth: "Au contraire, la cuisson rapide au micro-ondes est l'une des méthodes qui préservent le mieux les vitamines et minéraux, mieux que l'ébullition par exemple."
  },
  {
    myth: "Se raser fait repousser les poils plus épais.",
    truth: "Le rasage coupe le poil à sa base, là où il est le plus large, donnant une illusion d'épaisseur lors de la repousse. La structure du poil ne change pas."
  },
  {
    myth: "Il faut se 'détoxifier' régulièrement.",
    truth: "Votre corps a déjà un système de détoxification très performant : le foie et les reins. Les 'cures détox' sont souvent inutiles et marketing."
  },
  {
    myth: "Les produits 'light' sont bons pour la santé.",
    truth: "Ils peuvent contenir moins de sucre ou de gras, mais sont souvent ultra-transformés et remplis d'édulcorants ou d'additifs dont l'impact à long terme est débattu."
  },
  {
    myth: "Le chocolat donne de l'acné.",
    truth: "Aucune étude solide ne prouve un lien direct. L'acné est surtout hormonale et génétique. Une alimentation très sucrée peut cependant l'aggraver chez certains."
  },
  {
    myth: "On utilise que 10% de notre cerveau.",
    truth: "C'est un mythe persistant. L'imagerie cérébrale montre que nous utilisons la quasi-totalité de notre cerveau, même pendant le sommeil."
  },
  {
    myth: "On perd la majorité de sa chaleur corporelle par la tête.",
    truth: "On perd de la chaleur par n'importe quelle partie du corps non couverte. La tête ne représente qu'environ 10% de la surface corporelle, la perte est donc proportionnelle."
  }
];

const Loader: React.FC<LoaderProps> = ({ text }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // Start with a random tip
    setCurrentTipIndex(Math.floor(Math.random() * healthTips.length));
  }, []);

  const showNextTip = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent any other click event
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % healthTips.length);
  };

  const currentTip = healthTips[currentTipIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center">
      <svg
        className="animate-spin h-12 w-12 text-sky-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="mt-4 text-lg font-medium text-slate-300">{text}</p>
      
      <div className="w-full max-w-lg mt-8 p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg text-left relative animate-in fade-in duration-500">
        <p className="text-sm font-semibold text-slate-400 mb-3">Le saviez-vous ?</p>
        
        <div className="mb-4">
          <p className="font-bold text-red-400/90">Mythe :</p>
          <p className="text-slate-300 italic">"{currentTip.myth}"</p>
        </div>
        
        <div>
          <p className="font-bold text-green-400/90">La vérité :</p>
          <p className="text-slate-300">{currentTip.truth}</p>
        </div>
        
        <button 
          onClick={showNextTip} 
          className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded-full"
          aria-label="Astuce suivante"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Astuce suivante
        </button>
      </div>

    </div>
  );
};

export default Loader;
