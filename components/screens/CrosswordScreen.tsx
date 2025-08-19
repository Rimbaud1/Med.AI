import React, { useState, useMemo } from 'react';
import type { CrosswordData } from '../../types';
import { generateCrossword } from '../../services/geminiService';
import Loader from '../Loader';
import { NewspaperIcon, SparklesIcon, ArrowPathIcon } from '../icons';

interface CrosswordScreenProps {
  onBack: () => void;
}

const CrosswordScreen: React.FC<CrosswordScreenProps> = ({ onBack }) => {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [userInputGrid, setUserInputGrid] = useState<string[][]>([]);
  const [showSolution, setShowSolution] = useState(false);

  const handleGenerate = async () => {
    if (!theme.trim()) return;
    setLoading(true);
    setError(null);
    setCrosswordData(null);
    setShowSolution(false);
    try {
      const data = await generateCrossword(theme.trim());
      setCrosswordData(data);
      const initialGrid = data.grid.map(row => row.map(cell => (cell ? '' : '#')));
      setUserInputGrid(initialGrid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    const newUserInputGrid = userInputGrid.map(r => [...r]);
    newUserInputGrid[row][col] = value.toUpperCase().slice(0, 1);
    setUserInputGrid(newUserInputGrid);
  };

  const handleNewGrid = () => {
    setCrosswordData(null);
    setTheme('');
    setError(null);
    setShowSolution(false);
  };

  const clueNumberMap = useMemo(() => {
    if (!crosswordData) return new Map();
    const map = new Map<string, number>();
    crosswordData.clues.across.forEach(c => map.set(`${c.row},${c.col}`, c.number));
    crosswordData.clues.down.forEach(c => {
      if (!map.has(`${c.row},${c.col}`)) {
        map.set(`${c.row},${c.col}`, c.number);
      }
    });
    return map;
  }, [crosswordData]);

  if (loading) {
    return <Loader text="L'IA génère votre grille de mots croisés..." />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-orange-500/10 p-3 rounded-full border border-orange-500/30">
            <NewspaperIcon className="h-8 w-8 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Mots Croisés IA</h1>
            <p className="mt-1 text-slate-400">Un jeu de lettres généré sur mesure pour vous.</p>
          </div>
        </div>
        <button onClick={onBack} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Retour à l'accueil</button>
      </div>

      {!crosswordData ? (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 text-center">
          <h2 className="text-2xl font-semibold text-slate-200">Choisissez un thème</h2>
          <p className="text-slate-400 mt-2 mb-6">L'IA créera une grille unique juste pour vous.</p>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input
              type="text"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              placeholder="Ex: L'Égypte ancienne, Le cinéma français..."
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              onClick={handleGenerate}
              disabled={!theme.trim()}
              className="bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <SparklesIcon className="h-5 w-5" />
              Générer la grille
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Grid */}
            <div className="lg:col-span-2 bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-center items-center">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${crosswordData.size}, minmax(0, 1fr))` }}>
                {crosswordData.grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isBlack = cell === null;
                    if (isBlack) {
                      return <div key={`${rowIndex}-${colIndex}`} className="bg-slate-900 border border-slate-700 aspect-square"></div>;
                    }
                    const clueNumber = clueNumberMap.get(`${rowIndex},${colIndex}`);
                    const answerLetter = crosswordData.grid[rowIndex][colIndex];
                    const userLetter = userInputGrid[rowIndex]?.[colIndex] || '';
                    
                    return (
                      <div key={`${rowIndex}-${colIndex}`} className="relative bg-slate-200 border border-slate-400 aspect-square">
                        {clueNumber && <span className="absolute top-0 left-0.5 text-xs font-bold text-slate-600 select-none">{clueNumber}</span>}
                        <input
                          type="text"
                          maxLength={1}
                          value={showSolution ? answerLetter ?? '' : userLetter}
                          onChange={e => !showSolution && handleInputChange(rowIndex, colIndex, e.target.value)}
                          disabled={showSolution}
                          className={`w-full h-full text-center text-xl sm:text-2xl font-bold uppercase bg-transparent outline-none ${showSolution ? 'text-blue-700' : 'text-slate-800'}`}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Clues */}
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 max-h-64 overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-200 mb-2">Horizontalement</h3>
                <ul className="space-y-1 text-sm text-slate-300">
                  {crosswordData.clues.across.map(c => <li key={`a-${c.number}`}><strong>{c.number}.</strong> {c.clue}</li>)}
                </ul>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 max-h-64 overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-200 mb-2">Verticalement</h3>
                <ul className="space-y-1 text-sm text-slate-300">
                  {crosswordData.clues.down.map(c => <li key={`d-${c.number}`}><strong>{c.number}.</strong> {c.clue}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowSolution(true)} className="bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors">Révéler la solution</button>
            <button onClick={handleNewGrid} className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-500 transition-colors flex items-center justify-center gap-2">
              <ArrowPathIcon className="h-5 w-5" />
              Nouvelle grille
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrosswordScreen;
