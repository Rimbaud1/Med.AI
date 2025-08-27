
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
    {
        category: "Anatomie Incroyable",
        color: "text-cyan-300",
        items: [
            { title: "Acide gastrique puissant", text: "L'acide dans votre estomac est assez fort pour dissoudre une lame de rasoir." },
            { title: "Le foie, un super-organe", text: "C'est le seul organe humain capable de se régénérer presque entièrement, même après avoir perdu 75% de sa masse." },
            { title: "Un squelette neuf tous les 10 ans", text: "Votre corps remplace constamment les vieilles cellules osseuses par des nouvelles, renouvelant ainsi votre squelette environ tous les 10 ans." },
            { title: "La force de la mâchoire", text: "Le muscle masséter est le muscle le plus puissant du corps par rapport à sa taille, capable d'exercer une force de plus de 90 kg." },
            { title: "Une empreinte unique sur la langue", text: "Tout comme les empreintes digitales, chaque personne possède une empreinte linguale qui lui est propre." },
            { title: "Plus fort que l'acier", text: "À poids égal, l'os humain est plus résistant que l'acier. Un bloc d'os de la taille d'une boîte d'allumettes peut supporter 9 tonnes." },
            { title: "Le petit doigt, un grand contributeur", text: "Votre petit doigt (auriculaire) fournit environ 50% de la force de préhension de votre main." },
            { title: "Des papilles qui se renouvellent", text: "Vos papilles gustatives ont une durée de vie très courte, d'environ 10 à 14 jours, avant d'être remplacées." },
            { title: "L'intestin, une surface de court de tennis", text: "Si vous dépliiez toutes les villosités de votre intestin grêle, sa surface couvrirait celle d'un court de tennis." },
            { title: "Un GPS interne", text: "Votre oreille interne abrite le système vestibulaire, qui agit comme un gyroscope et vous donne le sens de l'équilibre et de l'orientation spatiale." },
            { title: "Une usine à salive", text: "Vous produisez assez de salive au cours de votre vie pour remplir deux piscines." },
            { title: "Le hoquet, un mystère ancien", text: "Le hoquet pourrait être un vestige évolutionnaire de nos ancêtres amphibiens, lié à la respiration branchiale." },
            { title: "Une peau neuve chaque mois", text: "Vous perdez des dizaines de milliers de cellules de peau chaque minute. Votre couche externe de peau est entièrement remplacée environ tous les mois." },
            { title: "Un cœur infatigable", text: "Même au repos, les muscles de votre cœur travaillent deux fois plus dur que les muscles des jambes d'un sprinteur en pleine course." },
            { title: "Des larmes à plusieurs facettes", text: "Les larmes de joie, de tristesse ou d'irritation (causées par un oignon) ont des compositions chimiques distinctes." }
        ]
    },
    {
        category: "Histoire de la Médecine",
        color: "text-lime-300",
        items: [
            { title: "La première vaccination", text: "En 1796, Edward Jenner a utilisé le virus de la variole bovine (la vaccine) pour immuniser un jeune garçon contre la variole humaine, bien plus mortelle." },
            { title: "L'hygiène qui sauve des vies", text: "Dans les années 1840, le Dr Ignace Semmelweis a découvert que le simple fait pour les médecins de se laver les mains réduisait drastiquement la mortalité en maternité." },
            { title: "La découverte accidentelle de la pénicilline", text: "En 1928, Alexander Fleming a remarqué qu'une moisissure avait contaminé une de ses boîtes de Petri et tué les bactéries environnantes. C'était la naissance du premier antibiotique." },
            { title: "L'invention du stéthoscope", text: "En 1816, René Laennec a roulé une feuille de papier pour mieux entendre le cœur d'une patiente, inventant ainsi le premier stéthoscope et révolutionnant le diagnostic." },
            { title: "La révolution de l'anesthésie", text: "Avant 1846, les chirurgies étaient des épreuves de torture. L'utilisation de l'éther par William T.G. Morton a permis de réaliser des opérations sans douleur." },
            { title: "Les rayons X, voir à travers le corps", text: "Wilhelm Röntgen a découvert les rayons X en 1895, et la première image radiographique fut celle de la main de sa femme, montrant ses os et son alliance." },
            { title: "La fin de la théorie des miasmes", text: "Grâce à Louis Pasteur et Robert Koch, on a compris que les maladies étaient causées par des germes, et non par de 'mauvais airs' ou miasmes." },
            { title: "Les groupes sanguins rendent les transfusions sûres", text: "En 1901, Karl Landsteiner a découvert les groupes sanguins A, B et O, ce qui a permis d'éviter les rejets mortels lors des transfusions." },
            { title: "La trépanation préhistorique", text: "La plus ancienne intervention chirurgicale connue est la trépanation (percer un trou dans le crâne), pratiquée il y a plus de 7000 ans, et certains patients y survivaient !" },
            { title: "La première greffe de cœur", text: "En 1967, le chirurgien sud-africain Christiaan Barnard a réalisé la première transplantation cardiaque humaine réussie." },
            { title: "L'insuline, un tournant pour le diabète", text: "En 1921, Banting et Best ont isolé l'insuline, transformant le diabète de type 1, alors mortel, en une maladie chronique gérable." },
            { title: "L'éradication d'une maladie", text: "Grâce à une campagne de vaccination mondiale, la variole, qui a tué des centaines de millions de personnes, a été déclarée officiellement éradiquée en 1980." },
            { title: "La pilule contraceptive", text: "Introduite dans les années 1960, elle a eu un impact social et démographique majeur, donnant aux femmes un contrôle sans précédent sur leur fertilité." },
            { title: "La découverte de la structure de l'ADN", text: "En 1953, Watson et Crick ont décrit la structure en double hélice de l'ADN, ouvrant la voie à la génétique moderne et à la thérapie génique." },
            { title: "Les 'chasseurs de microbes'", text: "Au 19ème siècle, des pionniers comme John Snow ont utilisé la cartographie pour prouver que le choléra se propageait par l'eau contaminée à Londres, jetant les bases de l'épidémiologie." }
        ]
    },
    {
        category: "Santé Mentale en Clair",
        color: "text-fuchsia-300",
        items: [
            { title: "L'anxiété, une alarme utile", text: "L'anxiété est une réaction normale au stress. Elle devient un trouble lorsqu'elle est excessive, persistante et interfère avec la vie quotidienne." },
            { title: "Le 'blues de l'hiver'", text: "La dépression saisonnière (ou trouble affectif saisonnier) est une forme de dépression liée au manque de lumière naturelle en automne et en hiver." },
            { title: "Le TDAH n'est pas qu'une question d'agitation", text: "Le Trouble du Déficit de l'Attention avec ou sans Hyperactivité peut aussi se manifester par une difficulté à se concentrer, une désorganisation et une impulsivité." },
            { title: "Le TOC : plus que de l'organisation", text: "Le Trouble Obsessionnel-Compulsif se caractérise par des pensées intrusives (obsessions) qui causent de l'angoisse, et des rituels (compulsions) pour la soulager." },
            { title: "La psychothérapie, c'est pour tout le monde", text: "Consulter un psychologue n'est pas un signe de faiblesse, mais une démarche proactive pour prendre soin de sa santé mentale, comme on le fait pour sa santé physique." },
            { title: "Le syndrome de l'imposteur", text: "C'est un sentiment persistant de ne pas mériter son succès, malgré des preuves objectives de compétence. C'est très courant et non un diagnostic officiel." },
            { title: "Le 'burnout' ou épuisement professionnel", text: "Ce n'est pas juste de la fatigue. C'est un état d'épuisement émotionnel, physique et mental causé par un stress excessif et prolongé au travail." },
            { title: "La bipolarité, des montagnes russes émotionnelles", text: "Le trouble bipolaire se caractérise par des alternances d'épisodes de dépression (périodes 'basses') et d'épisodes de manie ou d'hypomanie (périodes 'hautes')." },
            { title: "L'ESPT : une blessure invisible", text: "L'État de Stress Post-Traumatique peut survenir après un événement choquant. Il se manifeste par des flashbacks, des cauchemars et une hypervigilance." },
            { title: "La pleine conscience (mindfulness)", text: "C'est une pratique qui consiste à porter intentionnellement son attention sur le moment présent, sans jugement. C'est un outil efficace pour réduire le stress." },
            { title: "L'importance de la 'charge mentale'", text: "C'est le fardeau invisible de la planification et de l'organisation des tâches (familiales, professionnelles...). Son déséquilibre peut être une source majeure de stress." },
            { title: "Les troubles alimentaires ne sont pas un choix", text: "L'anorexie, la boulimie et l'hyperphagie sont des maladies mentales complexes avec des causes biologiques, psychologiques et sociales." },
            { title: "Le 'self-care' n'est pas égoïste", text: "Prendre du temps pour soi pour se ressourcer est essentiel pour maintenir une bonne santé mentale et pouvoir prendre soin des autres." },
            { title: "Le deuil est un processus unique", text: "Il n'y a pas de 'bonne' façon de faire son deuil. Les étapes (déni, colère, etc.) ne sont pas linéaires et varient pour chaque individu." },
            { title: "Les phobies, des peurs intenses", text: "Une phobie est une peur irrationnelle et intense d'un objet ou d'une situation spécifique, qui pousse à l'évitement et peut être très handicapante." }
        ]
    },
    {
        category: "Le Sommeil, cet Allié",
        color: "text-violet-300",
        items: [
            { title: "Les cycles du sommeil", text: "Une nuit de sommeil est composée de plusieurs cycles d'environ 90 minutes, alternant entre sommeil léger, profond et paradoxal (rêves)." },
            { title: "Le sommeil paradoxal", text: "C'est durant cette phase que vous rêvez le plus. Votre cerveau est très actif, mais vos muscles sont paralysés pour vous empêcher de 'vivre' vos rêves." },
            { title: "Manquer de sommeil affecte votre jugement", text: "Être éveillé pendant 18 heures d'affilée peut altérer vos capacités de la même manière qu'un taux d'alcoolémie de 0,05%." },
            { title: "Le 'nettoyage' du cerveau", text: "Pendant le sommeil profond, votre cerveau active un système de nettoyage qui élimine les déchets métaboliques accumulés pendant la journée." },
            { title: "La lumière bleue, ennemie du sommeil", text: "La lumière bleue des écrans (téléphones, tablettes) supprime la production de mélatonine, l'hormone qui vous aide à vous endormir." },
            { title: "La sieste parfaite", text: "Une 'sieste flash' de 10 à 20 minutes est idéale pour améliorer la vigilance et les performances sans causer d'inertie du sommeil (sensation d'être groggy)." },
            { title: "On ne 'rattrape' pas le sommeil", text: "Même si une grasse matinée peut aider, une seule nuit blanche peut prendre plusieurs jours pour que le corps s'en remette complètement." },
            { title: "Le sport, oui, mais pas trop tard", text: "L'exercice régulier améliore la qualité du sommeil, mais une activité intense juste avant de se coucher peut augmenter votre température corporelle et retarder l'endormissement." },
            { title: "La caféine a une longue durée de vie", text: "La demi-vie de la caféine est d'environ 5-6 heures. Un café bu à 16h signifie qu'un quart de la caféine est encore dans votre corps à 22h." },
            { title: "L'apnée du sommeil", text: "C'est un trouble où la respiration s'arrête et reprend plusieurs fois pendant le sommeil. Les ronflements forts en sont un signe courant." },
            { title: "Dormir au frais", text: "La température idéale pour dormir se situe entre 16 et 19°C. Votre corps a besoin de baisser sa température interne pour s'endormir." },
            { title: "Le mythe des 8 heures", text: "Les besoins en sommeil varient d'une personne à l'autre. La plupart des adultes ont besoin de 7 à 9 heures, mais l'important est de se sentir reposé." },
            { title: "Les rêves nous aident à gérer nos émotions", text: "Rêver pourrait être une façon pour le cerveau de traiter les expériences émotionnelles de la journée dans un environnement 'sûr'." },
            { title: "L'alcool perturbe le sommeil", text: "Même si l'alcool peut aider à s'endormir, il perturbe la seconde moitié de la nuit, fragmentant le sommeil et réduisant sa qualité réparatrice." },
            { title: "La régularité est la clé", text: "Se coucher et se lever à la même heure tous les jours, même le week-end, est l'un des moyens les plus efficaces pour améliorer son sommeil." }
        ]
    },
    {
        category: "L'Exercice & ses Secrets",
        color: "text-orange-300",
        items: [
            { title: "Un antidépresseur naturel", text: "L'exercice régulier a prouvé son efficacité pour réduire les symptômes de la dépression légère à modérée, parfois autant qu'un traitement médicamenteux." },
            { title: "Booster le cerveau", text: "L'activité physique augmente le flux sanguin vers le cerveau et stimule la création de nouvelles connexions neuronales, améliorant la mémoire et la concentration." },
            { title: "Plus de mitochondries", text: "L'endurance crée de nouvelles mitochondries dans vos cellules. Ce sont les 'centrales énergétiques' qui produisent votre énergie au quotidien." },
            { title: "La marche, un médicament sous-estimé", text: "Une marche rapide de 30 minutes par jour peut réduire de moitié le risque de développer un diabète de type 2." },
            { title: "Les muscles, des brûleurs de sucre", text: "Avoir plus de masse musculaire aide à réguler la glycémie, car les muscles sont de grands consommateurs de glucose." },
            { title: "Le 'Afterburn Effect'", text: "Après une séance de sport intense (HIIT), votre métabolisme reste élevé pendant plusieurs heures, continuant à brûler des calories même au repos." },
            { title: "Renforcer les os", text: "Les exercices avec impact (course, saut) ou de résistance (musculation) stimulent les cellules osseuses et aident à prévenir l'ostéoporose." },
            { title: "Mieux vaut peu que rien du tout", text: "Même 10 minutes d'activité modérée ont des bénéfices pour la santé. L'important est de rompre la sédentarité." },
            { title: "L'hydratation est clé", text: "Perdre seulement 2% de votre poids en eau (transpiration) peut diminuer vos performances physiques de manière significative." },
            { title: "Les courbatures ne sont pas un signe de progrès", text: "Elles indiquent des micro-déchirures musculaires, souvent dues à un nouvel exercice. Un bon entraînement n'est pas forcément suivi de courbatures." },
            { title: "La 'mémoire musculaire'", text: "Si vous arrêtez le sport et reprenez plus tard, vous retrouverez votre niveau plus rapidement. Vos cellules musculaires conservent des 'noyaux' supplémentaires." },
            { title: "Le sport pour mieux dormir", text: "L'activité physique régulière aide à s'endormir plus vite et améliore la qualité du sommeil profond, le plus réparateur." },
            { title: "Le gainage, plus qu'un ventre plat", text: "Les exercices de gainage (planche) renforcent les muscles profonds du tronc, ce qui améliore la posture et prévient le mal de dos." },
            { title: "La souplesse, c'est la jeunesse", text: "Travailler sa souplesse avec des étirements maintient la mobilité des articulations, prévient les blessures et améliore la circulation." },
            { title: "Le sport en plein air, un double bénéfice", text: "S'entraîner à l'extérieur combine les bienfaits de l'exercice avec ceux de la nature (réduction du stress) et de la lumière du soleil (vitamine D)." }
        ]
    },
    {
        category: "Décoder ses Analyses Sanguines",
        color: "text-rose-300",
        items: [
            { title: "NFS (Numération Formule Sanguine)", text: "C'est la 'carte d'identité' de votre sang. Elle compte les globules rouges, les globules blancs et les plaquettes." },
            { title: "Globules Rouges (Hématies)", text: "Ils transportent l'oxygène. Un taux bas peut indiquer une anémie. L'hémoglobine est leur principal composant." },
            { title: "Globules Blancs (Leucocytes)", text: "Ce sont les soldats de votre système immunitaire. Un taux élevé peut signaler une infection ou une inflammation." },
            { title: "Plaquettes (Thrombocytes)", text: "Elles sont essentielles à la coagulation du sang. Un taux bas peut entraîner des saignements excessifs." },
            { title: "CRP (Protéine C-Réactive)", text: "C'est un marqueur de l'inflammation. Son taux augmente rapidement en cas d'infection bactérienne ou de maladie inflammatoire." },
            { title: "Glycémie à jeun", text: "Mesure le taux de sucre dans le sang après une nuit de jeûne. C'est un test clé pour le dépistage du diabète." },
            { title: "Cholestérol : HDL vs LDL", text: "Le HDL est le 'bon' cholestérol (il nettoie les artères), le LDL est le 'mauvais' (il peut les boucher). On regarde surtout le ratio entre les deux." },
            { title: "Triglycérides", text: "C'est une autre forme de graisse dans le sang. Un taux élevé est souvent lié à l'alimentation (sucre, alcool) et au manque d'exercice." },
            { title: "Créatinine", text: "C'est un déchet produit par les muscles. Son taux dans le sang est un excellent indicateur de la fonction de filtration de vos reins." },
            { title: "Transaminases (ASAT/ALAT)", text: "Ce sont des enzymes du foie. Un taux élevé peut indiquer une souffrance ou une inflammation du foie (hépatite, stéatose...)." },
            { title: "TSH (Thyréostimuline)", text: "C'est l'hormone qui stimule la thyroïde. Son dosage est le test principal pour vérifier si votre thyroïde fonctionne normalement, trop (hyperthyroïdie) ou pas assez (hypothyroïdie)." },
            { title: "Ferritine", text: "C'est la protéine qui stocke le fer dans votre corps. Un taux bas est le premier signe d'une carence en fer, avant même l'apparition de l'anémie." },
            { title: "Vitamine D (25-OH-vitamine D)", text: "Essentielle pour la santé des os et l'immunité. Une carence est très fréquente, surtout en hiver." },
            { title: "VS (Vitesse de Sédimentation)", text: "Un marqueur d'inflammation plus ancien et moins spécifique que la CRP, mais toujours utilisé pour suivre certaines maladies chroniques." },
            { title: "'Être dans les normes'", text: "Les valeurs de référence peuvent légèrement varier d'un laboratoire à l'autre. Une valeur un peu en dehors des normes n'est pas toujours synonyme de maladie." }
        ]
    },
    {
        category: "Premiers Secours : Le Geste Juste",
        color: "text-blue-300",
        items: [
            { title: "Coupure légère", text: "Nettoyez la plaie à l'eau et au savon, désinfectez avec un antiseptique, puis protégez avec un pansement." },
            { title: "Saignement de nez", text: "Asseyez-vous, penchez la tête EN AVANT (jamais en arrière), et comprimez la narine qui saigne pendant 10 minutes sans interruption." },
            { title: "Brûlure simple", text: "Refroidissez immédiatement la zone sous l'eau tiède (environ 15°C) pendant au moins 15 minutes. N'appliquez jamais de glace." },
            { title: "Piqûre d'insecte (non allergique)", text: "Retirez le dard s'il est présent (sans le pincer), désinfectez et appliquez du froid pour soulager la douleur et le gonflement." },
            { title: "Coup ou contusion ('bleu')", text: "Appliquez de la glace (dans un linge) pendant 15-20 minutes pour limiter le gonflement et l'hématome." },
            { title: "Écharde", text: "Désinfectez la zone, puis retirez délicatement l'écharde avec une pince à épiler désinfectée, dans le sens où elle est entrée. Redésinfectez après." },
            { title: "Perte de connaissance (la victime respire)", text: "Mettez la victime en Position Latérale de Sécurité (PLS) pour libérer les voies aériennes et appelez le 15." },
            { title: "Malaise vagal", text: "Allongez la personne et surélevez ses jambes pour favoriser le retour du sang vers le cerveau. Aérez la pièce." },
            { title: "Entorse de la cheville", text: "Appliquez le protocole GREC : Glace, Repos, Élévation, Compression (avec un bandage)." },
            { title: "Objet dans l'œil", text: "Ne frottez pas. Rincez abondamment l'œil avec de l'eau ou du sérum physiologique, du coin interne vers le coin externe." },
            { title: "Ampoule au pied", text: "Ne la percez pas si elle n'est pas douloureuse, elle protège la peau en dessous. Si elle est percée, désinfectez et protégez avec un pansement spécial." },
            { title: "Coup de soleil", text: "Refroidissez la peau avec des douches ou des compresses d'eau fraîche, hydratez-vous abondamment et appliquez une crème apaisante." },
            { title: "Intoxication alimentaire (légère)", text: "Reposez-vous, buvez beaucoup d'eau par petites gorgées pour éviter la déshydratation. Mangez léger (riz, compote) quand l'appétit revient." },
            { title: "La chaîne de survie", text: "Les 4 maillons essentiels : Alerte précoce, gestes de premiers secours, défibrillation précoce, soins médicaux spécialisés." },
            { title: "Le contenu d'une trousse de secours", text: "Antiseptique, pansements, compresses stériles, sparadrap, ciseaux, pince à épiler, sérum physiologique, gants, couverture de survie." }
        ]
    },
    {
        category: "Le Cerveau, cet Inconnu",
        color: "text-teal-300",
        items: [
            { title: "Un grand consommateur d'énergie", text: "Votre cerveau représente environ 2% de votre poids corporel, mais il consomme 20-25% de l'oxygène et des calories que vous ingérez." },
            { title: "Pas de récepteurs de douleur", text: "Le cerveau lui-même ne peut pas sentir la douleur. Les maux de tête proviennent des nerfs et vaisseaux sanguins qui l'entourent." },
            { title: "Un disque dur quasi illimité", text: "La capacité de stockage du cerveau humain est considérée comme pratiquement illimitée, estimée à environ 2,5 pétaoctets." },
            { title: "La neuroplasticité", text: "Votre cerveau n'est pas figé. Il peut se réorganiser en créant de nouvelles connexions neuronales tout au long de votre vie, c'est la base de l'apprentissage." },
            { title: "Deux hémisphères, un travail d'équipe", text: "Le mythe du 'cerveau gauche logique' et 'cerveau droit créatif' est une simplification excessive. Les deux hémisphères collaborent constamment." },
            { title: "Plus rapide que la lumière ?", text: "L'information dans le cerveau voyage à différentes vitesses. Certains signaux peuvent atteindre plus de 400 km/h." },
            { title: "Le cerveau est principalement fait de graisse", text: "Après l'eau, le cerveau est l'organe le plus gras du corps, avec près de 60% de sa masse sèche composée de lipides." },
            { title: "Le multitâche est un mythe", text: "Votre cerveau ne peut pas se concentrer sur deux tâches complexes en même temps. Il bascule rapidement de l'une à l'autre, ce qui réduit l'efficacité." },
            { title: "Le 'nettoyage' nocturne", text: "Pendant le sommeil profond, le système glymphatique de votre cerveau s'active pour évacuer les toxines accumulées durant la journée." },
            { title: "Les neurones miroirs", text: "Ce sont des neurones qui s'activent de la même manière lorsque vous effectuez une action ou que vous observez quelqu'un d'autre la faire. Ils sont cruciaux pour l'empathie." },
            { title: "L'effet placebo", text: "La simple croyance en l'efficacité d'un traitement peut déclencher des changements biochimiques réels dans le cerveau, comme la libération d'endorphines." },
            { title: "La musique et le cerveau", text: "Écouter de la musique active de nombreuses zones du cerveau, y compris celles liées à l'émotion, la mémoire et le mouvement." },
            { title: "Un développement jusqu'à 25 ans", text: "Le cortex préfrontal, responsable de la prise de décision et du contrôle des impulsions, n'atteint sa pleine maturité que vers l'âge de 25 ans." },
            { title: "Le rire, un exercice cérébral", text: "Rire active plusieurs régions du cerveau et libère des endorphines, les 'hormones du bonheur'." },
            { title: "Le 'bruit blanc' neuronal", text: "Même au repos, votre cerveau maintient un niveau constant d'activité électrique de fond, un peu comme un ordinateur en veille." }
        ]
    },
    {
        category: "Le Microbiote Intestinal",
        color: "text-emerald-300",
        items: [
            { title: "Plus de bactéries que de cellules", text: "Vous hébergez plus de cellules bactériennes dans votre intestin que de cellules humaines dans tout votre corps." },
            { title: "Un 'deuxième cerveau'", text: "Votre intestin contient plus de 100 millions de neurones, plus que la moelle épinière. Il communique en permanence avec votre cerveau via le nerf vague." },
            { title: "La sérotonine, hormone du bonheur", text: "Environ 90% de la sérotonine de votre corps est produite dans l'intestin, influençant votre humeur et votre bien-être." },
            { title: "Une empreinte digitale bactérienne", text: "La composition de votre microbiote est unique, comme une empreinte digitale. Elle est influencée par votre génétique, votre alimentation et votre environnement." },
            { title: "L'éducation du système immunitaire", text: "Votre microbiote 'éduque' votre système immunitaire dès la naissance, lui apprenant à distinguer les amis (bactéries utiles) des ennemis (pathogènes)." },
            { title: "Les prébiotiques : la nourriture des bonnes bactéries", text: "Ce sont des fibres que vous ne digérez pas, mais qui nourrissent les bactéries bénéfiques. On les trouve dans l'ail, l'oignon, les poireaux, les bananes..." },
            { title: "Les probiotiques : des renforts directs", text: "Ce sont des micro-organismes vivants (bonnes bactéries) que l'on trouve dans les yaourts, le kéfir, la choucroute, et qui peuvent enrichir votre flore." },
            { title: "Les antibiotiques, une 'bombe' pour la flore", text: "S'ils sont nécessaires pour combattre les infections, les antibiotiques peuvent aussi détruire une partie de votre microbiote. Il faut parfois des mois pour qu'il se reconstitue." },
            { title: "Le lien avec le poids", text: "La composition du microbiote peut influencer la façon dont vous stockez les graisses et régulez votre appétit." },
            { title: "Stress et intestin", text: "Le stress peut altérer la composition de votre microbiote, ce qui peut en retour augmenter votre sensibilité au stress. C'est un cercle vicieux." },
            { title: "Les 'psychobiotiques'", text: "C'est un terme émergent pour désigner les probiotiques qui ont un effet bénéfique sur la santé mentale en agissant sur l'axe intestin-cerveau." },
            { title: "La diversité est la clé", text: "Un microbiote sain est un microbiote diversifié. Une alimentation variée, riche en fibres et en végétaux, est le meilleur moyen de l'encourager." },
            { title: "Le rôle dans les allergies", text: "Un déséquilibre du microbiote (dysbiose) est de plus en plus lié au développement d'allergies et de maladies auto-immunes." },
            { title: "La fermentation, un processus bénéfique", text: "Vos bactéries intestinales fermentent les fibres et produisent des composés bénéfiques (comme le butyrate) qui nourrissent les cellules de votre côlon." },
            { title: "L'impact du sport", text: "L'exercice physique régulier favorise la diversité et la santé de votre microbiote intestinal." }
        ]
    },
    {
        category: "Zoom sur les Vitamines & Minéraux",
        color: "text-yellow-300",
        items: [
            { title: "Vitamine C : plus qu'un anti-rhume", text: "Essentielle pour la production de collagène (peau, articulations), l'absorption du fer et comme puissant antioxydant. On la trouve dans les agrumes, poivrons, kiwis." },
            { title: "Vitamine D : la 'vitamine du soleil'", text: "Cruciale pour l'absorption du calcium et la santé osseuse. Notre corps la fabrique en s'exposant au soleil. Carence fréquente en hiver." },
            { title: "Fer : le transporteur d'oxygène", text: "Composant clé de l'hémoglobine dans les globules rouges. Une carence entraîne anémie et fatigue. Sources : viande rouge, lentilles, épinards." },
            { title: "Magnésium : l'anti-stress naturel", text: "Impliqué dans plus de 300 réactions enzymatiques. Aide à la relaxation musculaire, à la gestion du stress et au sommeil. Sources : chocolat noir, amandes, légumes verts." },
            { title: "Vitamines B : le complexe énergétique", text: "Un groupe de 8 vitamines essentielles à la production d'énergie, à la fonction cérébrale et à la formation des globules rouges." },
            { title: "Calcium : pas seulement pour les os", text: "Indispensable à la contraction musculaire, à la transmission nerveuse et à la coagulation, en plus de son rôle dans la solidité des os et des dents." },
            { title: "Vitamine A : la vision et la peau", text: "Importante pour la vision (surtout nocturne), le système immunitaire et la santé de la peau. Sources : carottes (bêta-carotène), foie, produits laitiers." },
            { title: "Zinc : le gardien de l'immunité", text: "Minéral crucial pour la fonction immunitaire, la cicatrisation et la synthèse de l'ADN. On le trouve dans les huîtres, la viande, les graines de courge." },
            { title: "Iode : le carburant de la thyroïde", text: "Essentiel à la production des hormones thyroïdiennes qui régulent le métabolisme. Source principale : sel iodé, produits de la mer." },
            { title: "Vitamine K : la coagulation sanguine", text: "Joue un rôle vital dans la coagulation du sang et participe aussi à la santé des os. Sources : légumes verts à feuilles (chou frisé, épinards)." },
            { title: "Potassium : l'équilibre des fluides", text: "Électrolyte qui aide à maintenir l'équilibre hydrique, la fonction nerveuse et la pression artérielle. Sources : bananes, pommes de terre, avocats." },
            { title: "Sélénium : un puissant antioxydant", text: "Oligo-élément qui protège les cellules du stress oxydatif et est important pour la fonction thyroïdienne. La noix du Brésil en est une source exceptionnelle." },
            { title: "Vitamine E : protecteur cellulaire", text: "Antioxydant liposoluble qui protège les membranes cellulaires des dommages. Sources : huiles végétales, amandes, graines de tournesol." },
            { title: "Les vitamines liposolubles vs hydrosolubles", text: "Les vitamines A, D, E, K sont liposolubles (stockées dans les graisses). Les B et C sont hydrosolubles (l'excès est éliminé dans l'urine)." },
            { title: "L'équilibre avant tout", text: "Une alimentation variée et équilibrée est la meilleure façon d'obtenir tous les nutriments nécessaires. Un excès de certaines vitamines peut être toxique." }
        ]
    }
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
