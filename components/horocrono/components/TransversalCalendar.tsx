import React, { useState } from 'react';
import { ChronosTime, EarthTime } from '../types/chronos';
import { 
  CANONICAL_FESTIVALS, 
  ZOU_CONSCIOUSNESS_PHASES, 
  getCurrentZouPhase, 
  getFestivalsForTala,
  StationFestival,
  ZouPhase 
} from '../data/stationCalendarData';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Crown, 
  Cpu, 
  Flame, 
  Skull, 
  Heart, 
  Layers, 
  Compass, 
  RotateCcw,
  Info,
  Clock,
  Dna
} from 'lucide-react';

interface TransversalCalendarProps {
  chronosTime: ChronosTime;
  earthTime: EarthTime;
}

export const TransversalCalendar: React.FC<TransversalCalendarProps> = ({
  chronosTime,
  earthTime
}) => {
  // Navigation state (allows browsing past or future Nemas)
  const [activeNema, setActiveNema] = useState<number>(chronosTime.nemaIndex);
  const [activeKora, setActiveKora] = useState<number>(chronosTime.koraIndex);
  const [selectedTalaIndex, setSelectedTalaIndex] = useState<number>(chronosTime.talaIndex);
  const [viewMode, setViewMode] = useState<'grid' | 'zouWheel'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const isCurrentRealNema = (activeNema === chronosTime.nemaIndex) && (activeKora === chronosTime.koraIndex);

  const resetToToday = () => {
    setActiveNema(chronosTime.nemaIndex);
    setActiveKora(chronosTime.koraIndex);
    setSelectedTalaIndex(chronosTime.talaIndex);
  };

  const currentZou = getCurrentZouPhase(activeNema, selectedTalaIndex);
  const festivalsForSelectedTala = getFestivalsForTala(activeNema, selectedTalaIndex);

  // Icon mapper helper
  const renderFestivalIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown': return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Dna': return <Dna className="w-3.5 h-3.5 text-rose-400" />;
      case 'Skull': return <Skull className="w-3.5 h-3.5 text-red-500" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'Heart': return <Heart className="w-3.5 h-3.5 text-pink-400" />;
      case 'Layers': return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const filteredFestivals = CANONICAL_FESTIVALS.filter(f => {
    if (categoryFilter === 'all') return true;
    return f.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Hero: Calendar Navigation & Macro Sync */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 box-glow-cyan relative overflow-hidden">
        <div className="hud-corner absolute inset-0 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-neutral-100 tracking-wide uppercase">
                  Calendario del Tránsito & Ciclos Transversales
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest bg-cyan-500/15 border border-cyan-500/40 text-cyan-300">
                  SINCRONIZADO
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                1 Nema = 16 Talas (32 días terrestres) · Ciclos de Conciencia Zou (Base 12)
              </p>
            </div>
          </div>

          {/* View Mode Toggle & Reset Button */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {!isCurrentRealNema && (
              <button
                onClick={resetToToday}
                className="px-2.5 py-1.5 rounded-xl text-xs font-mono bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-400 flex items-center gap-1.5 transition-all"
                title="Volver a la fecha actual sincronizada"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a Hoy</span>
              </button>
            )}

            <div className="p-1 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-1 text-xs font-mono">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Cuadrícula Nema (16 Ta)
              </button>
              <button
                onClick={() => setViewMode('zouWheel')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  viewMode === 'zouWheel'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Rueda Zou (12 Fases)
              </button>
            </div>
          </div>
        </div>

        {/* Nema & Kora Navigator Banner */}
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Previous / Next Nema */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveNema(prev => Math.max(0, prev - 1))}
              disabled={activeNema === 0}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 border border-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="text-center font-mono">
              <div className="text-sm font-bold text-cyan-300">
                NEMA {String(activeNema + 1).padStart(2, '0')} / 32
              </div>
              <div className="text-[10px] text-neutral-500">
                Kora {activeKora} · Era {chronosTime.eraIndex} (~344 Años de Viaje)
              </div>
            </div>

            <button
              onClick={() => setActiveNema(prev => Math.min(31, prev + 1))}
              disabled={activeNema === 31}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-300 border border-neutral-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Active Zou Phase Tag */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
            <span className="font-mono font-bold text-lg text-amber-400">
              {currentZou.taelimSymbol}
            </span>
            <div className="text-left font-mono">
              <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">Fase Transversal Zou</span>
              <span className="text-xs font-bold text-neutral-200">{currentZou.transversalName} ({currentZou.name})</span>
            </div>
          </div>

          {/* Current Real Earth Anchor */}
          <div className="text-right text-xs font-mono text-neutral-400">
            <span>Sincronía Civil: <strong className="text-emerald-400">{earthTime.dateFormatted}</strong></span>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: NEMA GRID (16 TALAS = 32 EARTH DAYS) */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider">
                  Desglose de los 16 Talas del Nema (Cada Tala equivale a 2 Días Terrestres)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                Selecciona cualquier Tala para ver ritos y turnos
              </span>
            </div>

            {/* 16 Talas Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {Array.from({ length: 16 }).map((_, i) => {
                const talaNum = i + 1;
                const isSelected = selectedTalaIndex === i;
                const isToday = isCurrentRealNema && chronosTime.talaIndex === i;
                const talaFestivals = getFestivalsForTala(activeNema, i);
                const hasFestival = talaFestivals.length > 0;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedTalaIndex(i)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-28 ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                        : isToday
                        ? 'bg-neutral-900/90 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-neutral-900/50 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700'
                    }`}
                  >
                    {/* Top Tala Number & Today badge */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-neutral-100">
                        Ta-{String(talaNum).padStart(2, '0')}
                      </span>
                      {isToday && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                          HOY
                        </span>
                      )}
                    </div>

                    {/* Festival Icons indicator */}
                    <div className="my-1 flex items-center gap-1">
                      {hasFestival ? (
                        talaFestivals.slice(0, 2).map(f => (
                          <div key={f.id} title={f.name}>
                            {renderFestivalIcon(f.icon)}
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-600">Ciclo Ordinario</span>
                      )}
                    </div>

                    {/* Bottom Earth Day Labels */}
                    <div className="pt-1.5 border-t border-white/5 text-[9px] font-mono text-neutral-500 flex justify-between">
                      <span>Día {i * 2 + 1}</span>
                      <span className="text-neutral-600">·</span>
                      <span>Día {i * 2 + 2}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Tala Dossier & Ritual Details */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Tala Identity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  Tala {selectedTalaIndex + 1} (48 Horas)
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Días {selectedTalaIndex * 2 + 1} y {selectedTalaIndex * 2 + 2} del Nema
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Duración:</span>
                  <span className="text-neutral-200">262,144 Viras (172,800 s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Semas Laborales:</span>
                  <span className="text-neutral-200">S-01 a S-05 (30h Vigilia)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ciclo Letargo:</span>
                  <span className="text-cyan-400">S-06 a S-08 (18h Sueño)</span>
                </div>
              </div>

              {/* Zou Phase info for this Tala */}
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-amber-500/20 text-xs font-mono">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-bold mb-1">
                  Mantra Transversal del Ciclo:
                </span>
                <p className="text-neutral-300 italic font-sans leading-relaxed">
                  "{currentZou.mantra}"
                </p>
              </div>
            </div>

            {/* Middle & Right: Festivals & Directives for this Tala */}
            <div className="lg:col-span-2 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 block border-b border-white/10 pb-2">
                Efemérides, Ritos y Eventos en este Tala ({festivalsForSelectedTala.length})
              </span>

              {festivalsForSelectedTala.length > 0 ? (
                <div className="space-y-3">
                  {festivalsForSelectedTala.map((fest) => (
                    <div 
                      key={fest.id}
                      className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {renderFestivalIcon(fest.icon)}
                          <h4 className="font-semibold text-sm text-neutral-100">
                            {fest.name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-cyan-300 uppercase">
                          {fest.category}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        {fest.description}
                      </p>

                      <div className="pt-2 border-t border-neutral-800 text-xs font-mono text-neutral-400">
                        <span className="text-neutral-300 font-bold">Rito: </span>
                        {fest.ritual}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-neutral-900/40 border border-white/5 text-center text-xs font-mono text-neutral-500 space-y-1">
                  <p>No hay festividades extraordinarias registradas para este Tala.</p>
                  <p className="text-neutral-400">Régimen operativo estándar de la Estación (Producción en S1-S5, Letargo en S6-S8).</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ZOU CONSCIOUSNESS WHEEL (12 PHASES) */}
      {viewMode === 'zouWheel' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold font-display uppercase tracking-wider text-neutral-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span>La Rueda Dozenal de Conciencia (Los 12 Pasos del Zou)</span>
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                La cosmovisión filosófica de los Veyvān y la Evolución Consciente
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">
              Base 12 (Dozenal)
            </span>
          </div>

          {/* 12 Phases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ZOU_CONSCIOUSNESS_PHASES.map((phase) => {
              const isCurrent = currentZou.index === phase.index;
              return (
                <div
                  key={phase.index}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                      : 'bg-neutral-900/60 border-neutral-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xl text-amber-400">
                          {phase.taelimSymbol}
                        </span>
                        <div>
                          <span className="font-bold text-sm text-neutral-100 block">
                            {phase.transversalName}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            Paso {phase.index} · {phase.name}
                          </span>
                        </div>
                      </div>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          ACTIVO
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-3">
                      {phase.concept}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 space-y-1">
                    <p className="text-[11px] font-mono text-cyan-300/90 italic">
                      "{phase.mantra}"
                    </p>
                    <span className="text-[10px] font-mono text-neutral-500 block">
                      Influencia: {phase.deckInfluence}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Canonical Festival Catalog Explorer */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider">
              Compendio de Festividades & Ritos Oficiales de la Estación ({filteredFestivals.length})
            </h4>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono">
            {['all', 'emulo', 'media', 'periferia', 'historica'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  categoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFestivals.map((f) => (
            <div key={f.id} className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 shrink-0 mt-0.5">
                {renderFestivalIcon(f.icon)}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-xs text-neutral-100">{f.name}</h5>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {f.nema === -1 ? 'Ciclo Zou' : `Nema ${f.nema} · Tala ${f.talaStart}`}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-snug font-sans">{f.description}</p>
                <p className="text-[10px] font-mono text-cyan-400/90">{f.ritual}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
