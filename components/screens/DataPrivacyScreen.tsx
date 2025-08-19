import React from 'react';
import { ShieldCheckIcon, ClipboardListIcon, BookOpenIcon, BeakerIcon } from '../icons';

interface DataPrivacyScreenProps {
  onBack: () => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        </div>
        <div className="text-slate-300 space-y-3 leading-relaxed">{children}</div>
    </div>
);

const DataPrivacyScreen: React.FC<DataPrivacyScreenProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center gap-4 mb-10">
        <div className="bg-slate-700/50 p-4 rounded-full border border-slate-600">
          <ShieldCheckIcon className="h-10 w-10 text-slate-300" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-100">Stockage des Données : Explication Technique</h1>
          <p className="mt-2 text-slate-400">Transparence totale sur la gestion de vos informations.</p>
        </div>
      </div>

      <div className="space-y-6">
        <Section title="Philosophie : Confidentialité Locale & Transparence Totale" icon={<ShieldCheckIcon className="h-7 w-7 text-green-400" />}>
            <p>Med.AI est conçu sur le principe fondamental de la "confidentialité par conception" (privacy-by-design). L'application fonctionne de manière entièrement locale sur votre navigateur. <strong>Il n'y a aucun serveur central, aucune base de données en ligne, et aucun compte utilisateur.</strong> Vos données de santé restent sur votre appareil, sous votre contrôle exclusif.</p>
            <p>Pour une transparence absolue, Med.AI est également <strong>100% open source</strong>. Cela signifie que n'importe qui peut inspecter, auditer et vérifier l'intégralité de son code source pour s'assurer qu'il n'y a aucune collecte de données cachée. Le code est publiquement disponible sur <a href="https://github.com/Rimbaud1/Med.AI" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">GitHub</a>.</p>
            <p>Techniquement, nous utilisons trois types de stockage/transmission de données distincts.</p>
        </Section>

        <Section title="1. Données de Session (Volatiles)" icon={<ClipboardListIcon className="h-7 w-7 text-sky-400" />}>
            <p><strong>Qu'est-ce que c'est ?</strong> Toutes les informations que vous fournissez pendant un parcours de pré-diagnostic : description des symptômes, réponses au questionnaire, résultats des tests guidés, photo téléchargée, et le rapport final généré.</p>
            <p><strong>Où sont-elles stockées ?</strong> Uniquement dans l'état de l'application React (<code>React state</code>), qui réside dans la <strong>mémoire vive (RAM)</strong> de votre navigateur. C'est le stockage le plus temporaire qui soit.</p>
            <p><strong>Durée de vie :</strong> Extrêmement courte. Ces données sont <strong>irrémédiablement effacées</strong> dès que vous terminez la session, c'est-à-dire quand vous :</p>
            <ul className="list-disc list-inside pl-4">
                <li>Cliquez sur "Commencer un Nouveau Diagnostic" ou "Retour à l'accueil".</li>
                <li>Fermez l'onglet ou le navigateur.</li>
                <li>Actualisez la page.</li>
            </ul>
             <p><strong>Conclusion :</strong> Aucune trace de votre consultation n'est conservée une fois celle-ci terminée.</p>
        </Section>

        <Section title="2. Données Persistantes (Stockage Local)" icon={<BookOpenIcon className="h-7 w-7 text-purple-400" />}>
            <p><strong>Qu'est-ce que c'est ?</strong> Ce sont les données que vous choisissez explicitement de conserver pour améliorer votre expérience future. Cela concerne deux fonctionnalités : le <strong>Journal de Santé</strong> et le <strong>Profil de Pré-remplissage</strong>.</p>
            <p><strong>Où sont-elles stockées ?</strong> Dans le <code>localStorage</code> de votre navigateur. C'est un petit espace de stockage (~5-10 Mo) sécurisé, propre à chaque site web, directement sur le disque dur de votre appareil.</p>
            <p><strong>Durée de vie :</strong> Persistante. Ces données restent sur votre appareil même si vous fermez le navigateur, jusqu'à ce que vous décidiez de les supprimer manuellement via l'écran "Paramètres" ou en vidant le cache de votre navigateur pour ce site.</p>
            <p><strong>Implications importantes :</strong></p>
            <ul className="list-disc list-inside pl-4">
                <li><strong>Pas de synchronisation :</strong> Les données sont cloisonnées à un seul navigateur sur un seul appareil. Votre journal sur Chrome sur votre ordinateur n'est pas accessible sur Safari sur votre téléphone.</li>
                <li><strong>Contrôle total :</strong> Vous pouvez visualiser, gérer et supprimer ces données à tout moment depuis l'écran des paramètres.</li>
            </ul>
        </Section>
        
        <Section title="3. Interactions avec Google & Clé d'API" icon={<BeakerIcon className="h-7 w-7 text-indigo-400" />}>
            <p>Pour fonctionner, Med.AI envoie les informations que vous fournissez (symptômes, contexte, etc.) à l'API de Google Gemini afin de générer les questions, analyses et rapports.</p>
            <div className="p-4 rounded-md border border-yellow-500/30 bg-yellow-500/10 text-yellow-200">
                <p><strong className="font-semibold">Utilisation de la clé par défaut (gratuite) :</strong> Par défaut, Med.AI utilise une clé d'API fournie pour la démonstration. Conformément aux conditions d'utilisation des API gratuites de Google, les données envoyées <strong>peuvent être utilisées</strong> par Google pour améliorer ses modèles d'IA. Bien que les données soient anonymisées, elles ne sont pas considérées comme totalement privées.</p>
            </div>
            <div className="p-4 rounded-md border border-green-500/30 bg-green-500/10 text-green-200">
                <p><strong className="font-semibold">Utilisation de votre propre clé d'API (payante) :</strong> Pour une confidentialité maximale, vous pouvez configurer votre propre clé d'API Google (associée à un projet Google Cloud avec facturation). Dans ce cas, vos données sont soumises aux conditions de Google Cloud et sont <strong>entièrement privées et confidentielles</strong>. Elles ne sont pas utilisées pour entraîner les modèles de Google.</p>
            </div>
            <p>Vous pouvez configurer votre propre clé d'API dans l'écran <strong>Paramètres</strong> pour garantir que vos interactions avec l'IA restent privées.</p>
        </Section>

      </div>
      
      <div className="mt-10 pt-6 border-t border-slate-700 text-center">
        <button onClick={onBack} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-500 transition duration-200">
          Retour aux paramètres
        </button>
      </div>
    </div>
  );
};

export default DataPrivacyScreen;