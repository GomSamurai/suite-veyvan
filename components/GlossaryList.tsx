import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Term, CATEGORIES, Tonality, TOMOS } from '../types';
import { Search, Filter, GitCompare, Edit2, Terminal, Volume2, PenTool, Sparkles, BookOpen } from 'lucide-react';
import MiniTaelim from './MiniTaelim';
import { useLexicon } from '../context/LexiconContext';
import { playWordResonance } from '../utils/taelimAudio';
import { thaliosVoice } from '../services/thaliosVoiceService';

import GlossaryGlyphModal, { GlyphModalState } from './GlossaryGlyphModal';
import GlossaryEditModal from './GlossaryEditModal';
import GlossaryCompareModal from './GlossaryCompareModal';

// --- SUB-COMPONENT FOR VIRTUALIZATION / LAZY LOADING ---
interface GlossaryCardProps {
  term: Term;
  compareList: string[];
  toggleCompare: (id: string) => void;
  setEditingTerm: (term: Term) => void;
  setViewingGlyph: (state: GlyphModalState) => void;
  getTonalityColor: (t: Tonality) => string;
}

const GlossaryCard: React.FC<GlossaryCardProps> = ({ 
  term, 
  compareList, 
  toggleCompare, 
  setEditingTerm, 
  setViewingGlyph, 
  getTonalityColor 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { traceInTaelim } = useLexicon();

  useEffect(() => {
    const unsub = thaliosVoice.subscribe((s) => {
      if (!s.isSpeaking && !s.isPaused) {
        setIsPlayingAudio(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlaySound = (e: React.MouseEvent, narrateFull: boolean = false) => {
    e.stopPropagation();
    if (isPlayingAudio && thaliosVoice.getState().isSpeaking) {
      thaliosVoice.stop();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const textToSpeak = narrateFull
      ? `${term.root}. ${(term as any).spanishTranslation || term.meaning || ''}. ${term.description || ''}`
      : term.root;

    thaliosVoice.speak(textToSpeak, {
      title: `Pronunciación // ${term.root}`,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleTrace = (e: React.MouseEvent) => {
    e.stopPropagation();
    traceInTaelim(term.root);
  };

  return (
    <div ref={cardRef} className="group bg-black/25 backdrop-blur-md border border-white/5 rounded-2xl p-6 transition-all duration-500 relative overflow-hidden flex flex-col h-full hover:border-cyan-500/40 hover:bg-cyan-950/15 hover:shadow-[0_10px_35px_rgba(8,145,178,0.15)]">
       
      {/* Top Decoration */}
      <div className="absolute top-0 right-0 p-1.5 flex items-center gap-1 opacity-25">
         <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
         <div className="w-1 h-1 bg-white rounded-full"></div>
         <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500"></div>
      </div>

      {/* Action Buttons (Edit + Audio + Trace + Compare) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md rounded-xl p-1 border border-white/10 shadow-lg">
        <button 
          onClick={(e) => handlePlaySound(e, true)}
          className={`p-1.5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors rounded-lg ${isPlayingAudio ? 'text-cyan-300 animate-pulse' : ''}`}
          title="Narrar Ficha Completa (Término + Significado + Descripción)"
        >
          <Volume2 size={13} />
        </button>

        <button 
          onClick={handleTrace}
          className="p-1.5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 transition-colors rounded-lg"
          title="Trazar en Tael'im"
        >
          <PenTool size={13} />
        </button>

        <button 
          onClick={() => setEditingTerm(term)}
          className="p-1.5 hover:bg-white/10 hover:text-cyan-300 text-slate-400 transition-colors rounded-lg"
          title="Editar Entrada"
        >
          <Edit2 size={13} />
        </button>

        <input 
          type="checkbox" 
          checked={compareList.includes(term.id)}
          onChange={() => toggleCompare(term.id)}
          className="w-3.5 h-3.5 ml-1 rounded border-white/20 bg-black/50 text-cyan-500 focus:ring-offset-0 focus:ring-0 cursor-pointer accent-cyan-500"
          title="Seleccionar para comparar"
        />
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-1.5 mb-3 border-b border-white/5 pb-3">
         <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] text-cyan-500/80 font-mono tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              {(term.id || 'N/A').toUpperCase()} // {term.syllables || 1} SÍL.
            </span>
            {term.tomo && (
              <span className="text-[8px] uppercase tracking-wider text-cyan-300/80 font-mono bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                {term.tomo.split(':')[0]}
              </span>
            )}
            {term.level && (
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                {term.level}
              </span>
            )}
         </div>

         <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-3xl font-bold font-rajdhani text-slate-100 tracking-wider drop-shadow-md">
                {term.root || 'Desconocido'}
              </h2>
              <button
                onClick={(e) => handlePlaySound(e, false)}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)] animate-pulse'
                    : 'border-white/10 hover:border-cyan-500/50 bg-white/5 text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                }`}
                title={`Escuchar pronunciación de ${term.root} con la voz de Thalios`}
              >
                <Volume2 size={15} className={isPlayingAudio ? 'animate-bounce text-cyan-300' : ''} />
              </button>
            </div>
         </div>

         {/* Phonetic / Onomatopoeia breath trace */}
         {term.phonetics && (
           <p className="text-[10px] text-cyan-400/80 font-mono italic tracking-wide flex items-center gap-1.5 mt-0.5">
             <Sparkles size={10} className="text-cyan-400 opacity-60 flex-shrink-0" />
             <span className="truncate">{term.phonetics}</span>
           </p>
         )}
      </div>
      
      {/* Tonality Badge */}
      <div className="flex items-center gap-2 mb-3">
         <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-[0.2em] border ${getTonalityColor(term.tonality)}`}>
           {term.tonality || 'Neutra'}
         </span>
         {term.tomo && (
           <span className="text-[9px] text-slate-500 font-mono truncate max-w-[200px]" title={term.tomo}>
             {term.tomo}
           </span>
         )}
      </div>

      <p className="text-base text-slate-200 font-medium mb-1.5 leading-relaxed tracking-wide opacity-95">
        {term.meaning}
      </p>
      <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1 font-mono opacity-85">
        {term.description}
      </p>
      
      {/* Footer & Glyphs */}
      <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-3 items-end justify-between relative">
         <div className="flex flex-col gap-1.5">
            <span className="text-[8px] uppercase tracking-[0.2em] text-slate-400 font-bold bg-white/5 rounded px-2 py-1 border border-white/5">
              {term.category}
            </span>
            <button
              onClick={handleTrace}
              className="text-[9px] uppercase tracking-widest text-cyan-400/70 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
            >
              <PenTool size={10} /> Trazar caligrafía
            </button>
         </div>
         
         {/* Mini Taelim Glyph Representation (Lazy Loaded) */}
         <div className="flex gap-2 items-end w-full sm:w-auto min-h-[70px]"> 
           {isVisible ? (() => {
             const isCompound = Boolean(term.root && (term.root.includes("'") || term.root.includes("-") || term.root.includes("·") || term.root.includes(" ")));
             return (
               <>
                 {/* Algante (Cyan) */}
                 <div 
                   onClick={() => setViewingGlyph({ term, mode: 'algante' })}
                   className={`relative w-full ${isCompound ? 'sm:w-16 h-20' : 'sm:w-16 h-14'} rounded-lg border border-white/5 bg-black/40 p-1 cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all duration-300 group/glyph flex justify-center items-center overflow-hidden`}
                   title={`Ver caligrafía Algante (Émulo)${isCompound ? ' - Compuesta' : ''}`}
                 >
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover/glyph:opacity-100 transition-opacity"></div>
                    <div className="w-full h-full flex items-center justify-center relative z-10 p-0.5">
                       <MiniTaelim root={term.root} mode="algante" strokeColor="#22d3ee" />
                    </div>
                 </div>
                 {/* Comun (Emerald) */}
                 <div 
                   onClick={() => setViewingGlyph({ term, mode: 'comun' })}
                   className={`relative w-full ${isCompound ? 'sm:w-28 h-16' : 'sm:w-12 h-16'} rounded-lg border border-white/5 bg-black/40 p-1 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all duration-300 group/glyph flex justify-center items-center overflow-hidden`}
                   title={`Ver caligrafía Común (Periferia)${isCompound ? ' - Compuesta' : ''}`}
                 >
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/glyph:opacity-100 transition-opacity"></div>
                    <div className="w-full h-full flex items-center justify-center relative z-10 p-0.5">
                       <MiniTaelim root={term.root} mode="comun" strokeColor="#34d399" />
                    </div>
                 </div>
               </>
             );
           })() : (
             <div className="w-full h-full flex items-center justify-center text-slate-700 opacity-20">
               <Terminal size={14} className="animate-pulse" />
             </div>
           )}
         </div>
      </div>
    </div>
  );
};
// --- END SUB-COMPONENT ---

interface Props {
  terms: Term[];
  onUpdateTerm: (term: Term) => void;
}

const GlossaryList: React.FC<Props> = ({ terms, onUpdateTerm }) => {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tonalityFilter, setTonalityFilter] = useState('');
  const [tomoFilter, setTomoFilter] = useState('');
  
  // Compare State
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Glyph Modal State
  const [viewingGlyph, setViewingGlyph] = useState<GlyphModalState | null>(null);

  // Edit State
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);

  const getMatchingTerms = (searchTerm: string) => {
    try {
      if (!terms || terms.length === 0) return [];
      
      const searchStr = (searchTerm || '').trim().toLowerCase();
      let normalizedSearch = searchStr;
      try {
        normalizedSearch = searchStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      } catch(e) {}
      
      const searchWords = normalizedSearch.split(/\s+/).filter(w => w.length > 0);

      return terms.filter(t => {
        if (!t) return false;
        
        let matchesSearch = true;
        
        if (searchWords.length > 0) {
           const payloadRaw = [
             t.id, t.root, t.meaning, t.description, t.category, t.tonality, t.tomo || '', t.phonetics || '', t.level || ''
           ].map(v => v != null ? String(v).toLowerCase() : '').join(' ');
           
           let payload = payloadRaw;
           try {
             payload = payloadRaw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
           } catch(e) { }

           matchesSearch = searchWords.every(word => payload.includes(word));
        }

        const matchesCategory = categoryFilter ? t.category === categoryFilter : true;
        const matchesTonality = tonalityFilter ? t.tonality === tonalityFilter : true;
        const matchesTomo = tomoFilter ? (t.tomo && t.tomo.toLowerCase().includes(tomoFilter.toLowerCase())) : true;
        
        return matchesSearch && matchesCategory && matchesTonality && matchesTomo;
      });
    } catch (error) {
      console.error("Critical error in filter logic:", error);
      return terms || [];
    }
  };

  const previewTerms = useMemo(() => getMatchingTerms(search), [terms, search, categoryFilter, tonalityFilter, tomoFilter]);
  const filteredTerms = useMemo(() => getMatchingTerms(appliedSearch), [terms, appliedSearch, categoryFilter, tonalityFilter, tomoFilter]);

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length < 2) return [...prev, id];
      return [prev[1], id];
    });
  };

  const getTonalityColor = (t: Tonality) => {
    switch (t) {
      case Tonality.POSITIVE: return 'text-emerald-400 border-emerald-900 bg-emerald-950/30';
      case Tonality.NEGATIVE: return 'text-red-400 border-red-900 bg-red-950/30';
      case Tonality.TRANSFORMATIVE: return 'text-orange-400 border-orange-900 bg-orange-950/30';
      case Tonality.NEUTRAL: return 'text-slate-400 border-slate-700 bg-slate-900';
      default: return 'text-amber-400 border-amber-900 bg-amber-950/30';
    }
  };

  const comparedTerms = terms.filter(t => compareList.includes(t.id));

  return (
    <div className="p-2 md:p-6 max-w-[1600px] mx-auto">
      {/* Search & Categories HUD */}
      <div className="flex flex-col gap-4 mb-10 w-full animate-fade-in relative z-20">
        
        {/* Main Search Bar */}
        <div className="relative group w-full mb-1">
          <div className="relative bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-cyan-500/40 hover:bg-black/50 overflow-hidden">
            <Search className="text-cyan-400/80 ml-6 mr-4" size={18} />
            <input 
              type="text" 
              placeholder="BÚSQUEDA OMNIDIRECCIONAL... 404+ CONCEPTOS, TOMOS, RESIDUOS FÓNICOS, EMOCIONES" 
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                if (val === '') setAppliedSearch('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setAppliedSearch(search);
              }}
              className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:ring-0 outline-none font-rajdhani text-sm uppercase tracking-[0.2em] py-5"
            />
            {search !== appliedSearch && (
              <button 
                onClick={() => setAppliedSearch(search)}
                className="absolute right-4 text-[9px] font-bold tracking-[0.2em] text-cyan-100 bg-cyan-900/60 hover:bg-cyan-800/90 border border-cyan-500/40 px-5 py-2.5 rounded-lg backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer z-50 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              >
                FILTRAR MATRIZ: {previewTerms.length} ENCONTRADOS
              </button>
            )}
            {search === appliedSearch && search && (
              <div className="absolute right-4 text-[9px] font-bold tracking-[0.2em] text-emerald-300 bg-emerald-900/30 border border-emerald-500/20 px-4 py-2 rounded-lg backdrop-blur-md">
                {filteredTerms.length} MOSTRADOS
              </div>
            )}
          </div>
        </div>

        {/* Categories, Tomos & Actions */}
        <div className="flex flex-col xl:flex-row gap-3 justify-between items-start xl:items-center w-full px-1">
          <div className="flex flex-wrap gap-3 w-full xl:w-auto relative z-30">
            {/* Filter by Tomo */}
            <div className="relative flex items-center bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-xl transition-all hover:border-cyan-500/40 w-full sm:w-auto text-cyan-300">
              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60 text-cyan-400" size={13} />
              <select 
                value={tomoFilter} 
                onChange={(e) => setTomoFilter(e.target.value)}
                className="bg-transparent pl-10 pr-10 py-2.5 outline-none appearance-none cursor-pointer text-[10px] uppercase font-bold tracking-[0.15em] w-full hover:text-cyan-200 transition-colors"
                style={{ WebkitAppearance: 'none', appearance: 'none' }}
              >
                {TOMOS.map(t => (
                  <option key={t} value={t === 'Todos los Tomos' ? '' : t} className="bg-slate-950 text-slate-200">
                    {t === 'Todos los Tomos' ? '// TODOS LOS TOMOS SACROS' : `// ${t.toUpperCase()}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Category */}
            <div className="relative flex items-center bg-black/40 backdrop-blur-md border border-white/5 rounded-xl transition-all hover:border-white/20 w-full sm:w-auto text-slate-400">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" size={13} />
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent pl-10 pr-10 py-2.5 outline-none appearance-none cursor-pointer text-[10px] uppercase font-bold tracking-[0.15em] w-full hover:text-cyan-300 transition-colors"
                style={{ WebkitAppearance: 'none', appearance: 'none' }}
              >
                <option value="" className="bg-slate-950 text-slate-300">// TODAS LAS CATEGORÍAS</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-950 text-slate-300">{c}</option>)}
              </select>
            </div>
            
            {/* Filter by Tonality */}
            <div className="relative flex items-center bg-black/40 backdrop-blur-md border border-white/5 rounded-xl transition-all hover:border-white/20 w-full sm:w-auto text-slate-400">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-slate-500 opacity-50"></span>
              <select 
                value={tonalityFilter}
                onChange={(e) => setTonalityFilter(e.target.value)}
                className="bg-transparent pl-10 pr-10 py-2.5 outline-none appearance-none cursor-pointer text-[10px] uppercase font-bold tracking-[0.15em] w-full hover:text-cyan-300 transition-colors"
                style={{ WebkitAppearance: 'none', appearance: 'none' }}
              >
                <option value="" className="bg-slate-950 text-slate-300">// CUALQUIER TONALIDAD</option>
                {Object.values(Tonality).map(t => <option key={t} value={t} className="bg-slate-950 text-slate-300">{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end mt-2 xl:mt-0">
            <span className="text-[10px] text-cyan-400/70 font-mono tracking-widest uppercase">
              {filteredTerms.length} / {terms.length} REGISTROS ACTIVOS
            </span>

            {compareList.length > 0 && (
              <button 
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-2 bg-orange-900/40 hover:bg-orange-800/60 text-orange-200 font-bold uppercase tracking-[0.2em] text-[10px] px-5 py-2.5 rounded-xl backdrop-blur-md border border-orange-500/30 transition-all shadow-[0_0_20px_rgba(234,88,12,0.1)] hover:border-orange-400"
              >
                <GitCompare size={13} />
                <span>Comparar ({compareList.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTerms.map(term => (
          <GlossaryCard 
            key={term.id} 
            term={term} 
            compareList={compareList} 
            toggleCompare={toggleCompare} 
            setEditingTerm={setEditingTerm} 
            setViewingGlyph={setViewingGlyph} 
            getTonalityColor={getTonalityColor} 
          />
        ))}
        {filteredTerms.length === 0 && (
          <div className="col-span-full border border-dashed border-slate-800 rounded-2xl p-16 text-center bg-black/20">
            <Terminal size={48} className="mx-auto text-cyan-600/40 mb-4 animate-pulse" />
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
              SIN REGISTROS EN LA MATRIZ DEL VEHLAEN PARA ESTE FILTRO
            </p>
            <button 
              onClick={() => { setSearch(''); setAppliedSearch(''); setCategoryFilter(''); setTonalityFilter(''); setTomoFilter(''); }}
              className="mt-4 text-xs font-mono uppercase text-cyan-400 hover:text-cyan-300 underline tracking-wider"
            >
              Restablecer filtros del sistema
            </button>
          </div>
        )}
      </div>

      {viewingGlyph && (
        <GlossaryGlyphModal 
          viewingGlyph={viewingGlyph} 
          setViewingGlyph={setViewingGlyph} 
          getTonalityColor={getTonalityColor} 
        />
      )}

      {editingTerm && (
        <GlossaryEditModal 
          editingTerm={editingTerm} 
          setEditingTerm={setEditingTerm} 
          onUpdateTerm={onUpdateTerm} 
        />
      )}

      {showCompareModal && (
        <GlossaryCompareModal 
          showCompareModal={showCompareModal} 
          setShowCompareModal={setShowCompareModal} 
          comparedTerms={comparedTerms} 
          getTonalityColor={getTonalityColor} 
        />
      )}
    </div>
  );
};

export default GlossaryList;