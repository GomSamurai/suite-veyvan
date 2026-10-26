import React, { useState } from 'react';
import { Term, CATEGORIES, Tonality } from '../types';
import { analyzeTerm } from '../services/geminiService';
import { Sparkles, Save, RotateCcw, Loader2, Command, Volume2 } from 'lucide-react';
import { thaliosVoice } from '../services/thaliosVoiceService';

interface Props {
  onAddTerm: (term: Term) => void;
}

const Constructor: React.FC<Props> = ({ onAddTerm }) => {
  const [root, setRoot] = useState('');
  const [meaning, setMeaning] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tonality, setTonality] = useState<Tonality>(Tonality.NEUTRAL);
  const [syllables, setSyllables] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!root || !meaning) {
      alert("Por favor ingresa al menos la Raíz y el Significado para analizar.");
      return;
    }

    setIsAnalyzing(true);
    const result = await analyzeTerm(root, meaning);
    setIsAnalyzing(false);

    if (result) {
      setTonality(result.tonality);
      setSyllables(result.syllables);
      setDescription(result.expandedDescription);
      if (CATEGORIES.includes(result.categorySuggestion)) {
        setCategory(result.categorySuggestion);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!root || !meaning) return;

    const newTerm: Term = {
      id: crypto.randomUUID(),
      root,
      meaning,
      description,
      category,
      tonality,
      syllables,
      addedAt: new Date().toISOString()
    };

    onAddTerm(newTerm);
    // Reset
    setRoot('');
    setMeaning('');
    setDescription('');
    setSyllables(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-2 md:p-6">
      <div className="bg-slate-950/90 backdrop-blur border border-slate-800 relative corner-accent">
        
        {/* Header Strip */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-4">
          <div className="w-12 h-12 bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
             <Command size={24} />
          </div>
          <div>
             <h2 className="text-2xl font-bold text-white uppercase tracking-widest font-sans">Constructor de Radicales</h2>
             <p className="text-slate-500 font-mono text-xs uppercase">/// Protocolo de Ingesta de Nuevos Términos</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold text-cyan-600 uppercase tracking-widest">Entrada 01: Raíz</label>
                  {root.trim() && (
                    <button
                      type="button"
                      onClick={() => thaliosVoice.speak(root.trim(), { title: `Raíz // ${root.trim()}` })}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer transition-colors"
                      title="Pronunciar raíz con Voz Thalios"
                    >
                      <Volume2 size={12} />
                      <span>Oír Raíz</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500 font-mono">&gt;</span>
                  <input 
                    type="text" 
                    value={root}
                    onChange={e => setRoot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-none pl-8 pr-12 py-3 text-white focus:border-cyan-500 outline-none text-lg font-bold font-mono uppercase"
                    placeholder="KAEL"
                  />
                  {root.trim() && (
                    <button
                      type="button"
                      onClick={() => thaliosVoice.speak(root.trim(), { title: `Raíz // ${root.trim()}` })}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-cyan-300 transition-colors p-1"
                      title="Probar fonética"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-cyan-600 uppercase mb-2 tracking-widest">Entrada 02: Definición Base</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500 font-mono">&gt;</span>
                  <input 
                    type="text" 
                    value={meaning}
                    onChange={e => setMeaning(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-none pl-8 pr-4 py-3 text-white focus:border-cyan-500 outline-none font-mono"
                    placeholder="Micro-salto evolutivo..."
                  />
                </div>
              </div>
            </div>

            {/* AI Action Area */}
            <div className="bg-slate-900 border-y border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 -mx-8 px-8">
              <div className="flex items-center gap-3">
                <div className="p-2 text-cyan-400">
                  <Sparkles size={18} />
                </div>
                <div className="text-xs font-mono uppercase">
                  <p className="text-cyan-200">Módulo de IA</p>
                  <p className="text-slate-500">Auto-detectar tonalidad, sílabas y matiz.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {root.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      const fullTermSpeech = `${root}. ${meaning ? `Significado: ${meaning}.` : ''} ${description ? `Descripción: ${description}.` : ''}`;
                      thaliosVoice.speak(fullTermSpeech, { title: `Locución // ${root}` });
                    }}
                    className="px-4 py-2 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800 text-cyan-300 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Escuchar locución completa del término"
                  >
                    <Volume2 size={14} />
                    <span>Escuchar Locución</span>
                  </button>
                )}
                <button 
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !root}
                  className="px-6 py-2 bg-cyan-900/30 hover:bg-cyan-800/50 border border-cyan-700 hover:border-cyan-500 text-cyan-300 rounded-none text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  {isAnalyzing ? 'Procesando...' : 'Ejecutar Análisis'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-cyan-600 uppercase mb-2 tracking-widest">Entrada 03: Descripción Expandida</label>
              <textarea 
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-none px-4 py-3 text-slate-300 focus:border-cyan-500 outline-none resize-none font-mono text-sm"
                placeholder="Ingresar datos descriptivos..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-cyan-600 uppercase mb-2 tracking-widest">Parámetro A: Categoría</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-none px-4 py-2.5 text-white focus:border-cyan-500 outline-none text-xs uppercase font-bold"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-cyan-600 uppercase mb-2 tracking-widest">Parámetro B: Tonalidad</label>
                <select 
                  value={tonality}
                  onChange={e => setTonality(e.target.value as Tonality)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-none px-4 py-2.5 text-white focus:border-cyan-500 outline-none text-xs uppercase font-bold"
                >
                  {Object.values(Tonality).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-cyan-600 uppercase mb-2 tracking-widest">Parámetro C: Sílabas</label>
                <input 
                  type="number" 
                  min={1}
                  max={10}
                  value={syllables}
                  onChange={e => setSyllables(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-none px-4 py-2.5 text-white focus:border-cyan-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-4 border-t border-slate-800">
               <button 
                type="button" 
                onClick={() => {
                  setRoot(''); setMeaning(''); setDescription('');
                }}
                className="px-6 py-3 text-slate-500 hover:text-white border border-transparent hover:border-slate-600 rounded-none transition-colors flex items-center gap-2 uppercase text-xs font-bold tracking-widest"
              >
                <RotateCcw size={14} /> Reset
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-none shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_20px_rgba(8,145,178,0.5)] transition-all flex items-center gap-2 uppercase text-xs tracking-widest"
              >
                <Save size={16} /> Guardar Datos
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Constructor;