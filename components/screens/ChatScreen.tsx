
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, EmpathyLevel } from '../../types';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, SparklesIcon, UserCircleIcon } from '../icons';

interface ChatScreenProps {
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isResponding: boolean;
  onBackToReport: () => void;
  empathyLevel: EmpathyLevel;
  onEmpathyLevelChange: (level: EmpathyLevel) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ history, onSendMessage, isResponding, onBackToReport, empathyLevel, onEmpathyLevelChange }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history, isResponding]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const empathyLevels: EmpathyLevel[] = ['Direct', 'Normal', 'Empathique', 'Très Empathique'];

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-[calc(100vh-2rem)] bg-slate-800 rounded-lg shadow-2xl border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-full border border-emerald-500/30">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Soutien Psychologique</h1>
            <p className="text-sm text-emerald-300">Discussion avec Aura</p>
          </div>
        </div>
        <button
          onClick={onBackToReport}
          className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition duration-200 text-sm"
        >
          Retour au Bilan
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 md:p-6 space-y-6 overflow-y-auto">
        {history.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-500/20 flex-shrink-0">
                  <SparklesIcon className="w-5 h-5 text-emerald-400" />
              </div>
            )}
            <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.role === 'user' && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-sky-500/20 flex-shrink-0">
                  <UserCircleIcon className="w-6 h-6 text-sky-400" />
              </div>
            )}
          </div>
        ))}
        {isResponding && history.length > 0 && history[history.length - 1].role === 'user' && (
             <div className="flex items-end gap-3 justify-start">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-500/20 flex-shrink-0">
                    <SparklesIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-700">
                    <div className="flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Controls and Input */}
      <div className="flex-shrink-0 bg-slate-800">
        <div className="px-4 pt-3 pb-2 border-t border-slate-700">
            <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="text-sm text-slate-400 mr-2">Ton de l'IA:</span>
                {empathyLevels.map(level => (
                    <button
                        key={level}
                        onClick={() => onEmpathyLevelChange(level)}
                        disabled={isResponding}
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            empathyLevel === level
                            ? 'bg-emerald-500 border-emerald-400 text-slate-900 font-bold'
                            : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                        }`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-2 border border-slate-600 focus-within:ring-2 focus-within:ring-sky-500">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isResponding}
              placeholder="Écrivez votre message..."
              rows={1}
              className="flex-grow bg-transparent focus:outline-none text-slate-200 placeholder-slate-500 resize-none max-h-40"
              aria-label="Message Input"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isResponding}
              className="w-10 h-10 flex items-center justify-center bg-sky-600 rounded-md text-white hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              aria-label="Send Message"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;