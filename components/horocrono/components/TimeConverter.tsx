import React, { useState } from 'react';
import { 
  calculateChronosTime, 
  SECONDS_PER_VIRA, 
  VIRAS_PER_FULA, 
  VIRAS_PER_KROMA, 
  VIRAS_PER_SEMA, 
  VIRAS_PER_TALA,
  SECONDS_PER_TALA,
  getCircadianPhase
} from '../utils/chronosystemMath';
import { ArrowRight, ArrowLeftRight, Calendar, Clock, Copy, Check, Info } from 'lucide-react';

export const TimeConverter: React.FC = () => {
  const [direction, setDirection] = useState<'earthToChrono' | 'chronoToEarth'>('earthToChrono');
  const [copied, setCopied] = useState(false);

  // Earth -> Chrono inputs
  const now = new Date();
  const [earthDate, setEarthDate] = useState<string>(now.toISOString().slice(0, 10));
  const [earthTime, setEarthTime] = useState<string>(now.toTimeString().slice(0, 8));

  // Chrono -> Earth inputs
  const [talaInput, setTalaInput] = useState<number>(14);
  const [semaInput, setSemaInput] = useState<number>(3);
  const [kromaInput, setKromaInput] = useState<number>(8);
  const [fulaInput, setFulaInput] = useState<number>(16);
  const [viraInput, setViraInput] = useState<number>(32);

  // Conversion 1: Earth -> Chrono
  const parsedEarthDate = new Date(`${earthDate}T${earthTime}`);
  const validEarth = !isNaN(parsedEarthDate.getTime());
  const convertedChrono = validEarth ? calculateChronosTime(parsedEarthDate) : null;

  // Conversion 2: Chrono -> Earth
  // Reconstruct viras in Tala
  const semaIndexZero = Math.max(0, Math.min(7, semaInput - 1));
  const calcVirasInTala = 
    (semaIndexZero * VIRAS_PER_SEMA) + 
    (kromaInput * VIRAS_PER_KROMA) + 
    (fulaInput * VIRAS_PER_FULA) + 
    viraInput;
  const calcSecondsInTala = calcVirasInTala * SECONDS_PER_VIRA;
  
  // Tala base
  const totalSecondsFromTala0 = (talaInput * SECONDS_PER_TALA) + calcSecondsInTala;
  const reconstructedDate = new Date(totalSecondsFromTala0 * 1000);

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Selector of Direction */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setDirection('earthToChrono')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all ${
            direction === 'earthToChrono'
              ? 'bg-cyan-500/15 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>Tiempo Terrestre</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span>Cronosistema</span>
        </button>

        <button
          onClick={() => setDirection('chronoToEarth')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all ${
            direction === 'chronoToEarth'
              ? 'bg-cyan-500/15 border border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <span>Cronosistema</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
          <span>Tiempo Terrestre</span>
        </button>
      </div>

      {/* Main Converter Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/20 box-glow-cyan relative overflow-hidden">
        <div className="hud-corner absolute inset-0 pointer-events-none" />

        {direction === 'earthToChrono' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                Conversor: Computo Civil Humano a Notación Canónica Tala
              </span>
              <button
                onClick={() => {
                  const d = new Date();
                  setEarthDate(d.toISOString().slice(0, 10));
                  setEarthTime(d.toTimeString().slice(0, 8));
                }}
                className="text-xs font-mono text-neutral-400 hover:text-cyan-300 underline"
              >
                Cargar Hora Actual
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Fecha Terrestre (Año-Mes-Día)
                </label>
                <input
                  type="date"
                  value={earthDate}
                  onChange={(e) => setEarthDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 font-mono text-sm text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Hora Terrestre (HH:MM:SS)
                </label>
                <input
                  type="time"
                  step="1"
                  value={earthTime}
                  onChange={(e) => setEarthTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 font-mono text-sm text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                />
              </div>
            </div>

            {/* Output Result */}
            {convertedChrono && (
              <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/5 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                    Coordenada Temporal Resultante en la Estación
                  </span>
                  <button
                    onClick={() => copyResult(convertedChrono.displayCode)}
                    className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-cyan-400 flex items-center gap-1 text-xs font-mono transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar</span>
                  </button>
                </div>

                <div className="text-center py-3">
                  <div className="font-mono font-bold text-2xl sm:text-4xl text-cyan-300 glow-cyan">
                    {convertedChrono.displayCode}
                  </div>
                  <div className="text-xs font-mono text-neutral-400 mt-2">
                    Era {convertedChrono.eraIndex} · Kora {convertedChrono.koraIndex} · Nema {convertedChrono.nemaIndex} · Tala {convertedChrono.talaIndex}
                  </div>
                </div>

                {/* Decomposed Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-neutral-800">
                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                    <span className="text-[10px] font-mono text-neutral-500 block">Sema (Cuarto de Tala)</span>
                    <strong className="text-sm font-mono text-cyan-400">S-0{convertedChrono.sema}</strong>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">({(convertedChrono.semaProgress * 100).toFixed(0)}% cumplido)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                    <span className="text-[10px] font-mono text-neutral-500 block">Kroma (Kr · 22.5 min)</span>
                    <strong className="text-sm font-mono text-neutral-100">{convertedChrono.kroma} / 15</strong>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Global: {convertedChrono.globalKroma}/127</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                    <span className="text-[10px] font-mono text-neutral-500 block">Fula (Fu · 42.2 s)</span>
                    <strong className="text-sm font-mono text-neutral-100">{convertedChrono.fula} / 31</strong>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Intervalo breve</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
                    <span className="text-[10px] font-mono text-neutral-500 block">Vira (Vi · 0.66 s)</span>
                    <strong className="text-sm font-mono text-amber-400">{convertedChrono.vira} / 63</strong>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">{convertedChrono.totalVirasInTala.toLocaleString()} Vi en Tala</span>
                  </div>
                </div>

                {/* Deck Lighting at this time */}
                <div className="mt-4 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: convertedChrono.phase.colorHex }} />
                    <span className="text-neutral-300">
                      Fase Circadiana: <strong className="text-neutral-100">{convertedChrono.phase.name}</strong> ({convertedChrono.phase.lightStatus})
                    </span>
                  </div>
                  <span className="text-neutral-500">{convertedChrono.talaElapsedFormatted}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4" />
                Conversor: Coordenadas del Cronosistema a Fecha y Hora Terrestre
              </span>
            </div>

            {/* Inputs for Chronosystem */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Tala (0-15)</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={talaInput}
                  onChange={(e) => setTalaInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 font-mono text-sm text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Sema (1-8)</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={semaInput}
                  onChange={(e) => setSemaInput(parseInt(e.target.value) || 1)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 font-mono text-sm text-cyan-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Kroma (0-15)</label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={kromaInput}
                  onChange={(e) => setKromaInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 font-mono text-sm text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Fula (0-31)</label>
                <input
                  type="number"
                  min="0"
                  max="31"
                  value={fulaInput}
                  onChange={(e) => setFulaInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 font-mono text-sm text-neutral-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">Vira (0-63)</label>
                <input
                  type="number"
                  min="0"
                  max="63"
                  value={viraInput}
                  onChange={(e) => setViraInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 font-mono text-sm text-amber-400"
                />
              </div>
            </div>

            {/* Output for Earth Time */}
            <div className="p-6 rounded-2xl bg-neutral-950/80 border border-white/5 text-center">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-2">
                Equivalente Acumulado en Horas y Segundos Terrestres
              </span>
              <div className="font-mono font-bold text-2xl sm:text-4xl text-emerald-400">
                {(calcSecondsInTala / 3600).toFixed(2)} Horas en Tala ({calcSecondsInTala.toFixed(1)} s)
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-2">
                Total Viras en este Tala: <strong className="text-cyan-300">{calcVirasInTala.toLocaleString()}</strong> de 262,144 Viras
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
