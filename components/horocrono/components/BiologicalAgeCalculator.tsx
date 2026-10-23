import React, { useState } from 'react';
import { calculateStationAge } from '../utils/chronosystemMath';
import { Dna, Calendar, Sparkles, HeartPulse, ShieldAlert, Award } from 'lucide-react';

export const BiologicalAgeCalculator: React.FC = () => {
  // Default to ~28 years ago (similar to Pwaoo's 319 Nemas)
  const defaultDate = new Date();
  defaultDate.setFullYear(defaultDate.getFullYear() - 28);
  const [birthDateStr, setBirthDateStr] = useState<string>(defaultDate.toISOString().slice(0, 10));

  const parsedDate = new Date(birthDateStr);
  const valid = !isNaN(parsedDate.getTime()) && parsedDate.getTime() <= Date.now();
  const ageResult = valid ? calculateStationAge(parsedDate) : null;

  const presets = [
    { label: 'Pwaoo (Canon)', ageYears: 28, desc: '319 Nemas · Protagonista' },
    { label: 'Joren Thalvus', ageYears: 46, desc: '524 Nemas · Fundador' },
    { label: 'Cadete Joven', ageYears: 18, desc: '205 Nemas · Primer servicio' },
    { label: 'Veterano Terranáutico', ageYears: 65, desc: '741 Nemas · Nacido en Tierra' }
  ];

  const applyPresetYears = (years: number) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    setBirthDateStr(d.toISOString().slice(0, 10));
  };

  return (
    <div className="space-y-6">
      {/* Intro card */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 box-glow-cyan relative overflow-hidden">
        <div className="hud-corner absolute inset-0 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Dna className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-neutral-100 uppercase font-mono">
                Calculadora de Edad Biológica en Nemas (Ciclo de 32 Días)
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Cómputo oficial en Estación Humanidad · NTU-01
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPresetYears(p.ageYears)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-cyan-500/40 text-neutral-300 hover:text-cyan-300 transition-all"
                title={p.desc}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="max-w-md mx-auto my-4 text-center">
          <label className="block text-xs font-mono text-neutral-400 mb-2 flex items-center justify-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Introduce tu Fecha de Nacimiento Terrestre
          </label>
          <input
            type="date"
            value={birthDateStr}
            onChange={(e) => setBirthDateStr(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 font-mono text-center text-sm text-neutral-100 focus:outline-none focus:border-cyan-500/60"
          />
        </div>

        {/* Age Result Presentation */}
        {ageResult && (
          <div className="mt-6 pt-6 border-t border-white/10">
            {/* Highlight Nemas */}
            <div className="py-6 my-2 text-center bg-neutral-950/80 rounded-2xl border border-white/5 relative">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                Edad Oficial en la Estación
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="font-mono font-bold text-5xl sm:text-7xl text-cyan-400 glow-cyan">
                  {ageResult.nemasLived}
                </span>
                <span className="font-display font-semibold text-2xl sm:text-3xl text-neutral-200">
                  Nemas
                </span>
              </div>

              <p className="text-xs font-mono text-neutral-400 mt-2">
                Equivalente aproximado a <strong className="text-neutral-200">{ageResult.earthYearsLived} años terrestres</strong> ({ageResult.earthDaysLived.toLocaleString()} días solares antiguos)
              </p>

              {/* Next Nema Birthday */}
              <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Próximo Cumple-Nema en: <strong className="text-white">{ageResult.nextNemaDaysRemaining} días terrestres</strong>
              </div>
            </div>

            {/* Hierarchical Chrono units lived */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-neutral-500 block">Koras Vividas</span>
                <strong className="text-base font-mono text-cyan-400">{ageResult.korasLived}</strong>
                <span className="text-[9px] text-neutral-400 block mt-0.5">1 Kora = 32 Nemas (~2.8 años)</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-neutral-500 block">Talas (Ciclos de 48h)</span>
                <strong className="text-base font-mono text-neutral-100">{ageResult.talasLived.toLocaleString()}</strong>
                <span className="text-[9px] text-neutral-400 block mt-0.5">Dormir cada 32h</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-neutral-500 block">Eras Históricas</span>
                <strong className="text-base font-mono text-neutral-100">{ageResult.erasLived}</strong>
                <span className="text-[9px] text-neutral-400 block mt-0.5">1 Era = 64 Koras (~179 años)</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 text-center">
                <span className="text-[10px] font-mono text-neutral-500 block">Viras de Pulso Vital</span>
                <strong className="text-base font-mono text-amber-400">{ageResult.totalVirasLived.toLocaleString()}</strong>
                <span className="text-[9px] text-neutral-400 block mt-0.5">Latidos a 0.659s</span>
              </div>
            </div>

            {/* Lore Note */}
            <div className="mt-4 p-3 rounded-xl bg-neutral-900/40 border border-white/5 text-xs text-neutral-400 font-mono leading-relaxed">
              <span className="text-cyan-400 mr-1.5">//</span> <strong className="text-neutral-300">Nota Antropológica:</strong> A bordo de la nave, referirse a la edad en "Años" está reservado a ancianos terranáuticos o a los disidentes de Nih'Sol. El censo oficial de Thalios Solaris y los Protectores solo tramita permisos laborales y asignaciones de litera en <span className="text-cyan-300">Nemas</span>.
            </div>
          </div>
        )}
      </div>

      {/* Demographic Survival Across Decks */}
      {ageResult && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider">
                Matriz Demográfica y Esperanza de Vida según Cubierta Asignada
              </h4>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              Datos Post-Colapso Año 72.4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ageResult.deckLifeStats.map((deck) => (
              <div 
                key={deck.deckTier}
                className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-neutral-100">
                      {deck.deckTier}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      Riesgo: {deck.hazardIndex}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-cyan-400 block mb-2">
                    {deck.levelName}
                  </span>

                  <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                    {deck.loreNote}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-neutral-400">
                      Esperanza Media: <strong className="text-neutral-200">{deck.averageLifespanNemas} Nemas</strong>
                    </span>
                    <span className={`font-bold ${deck.userSurvivalPercent >= 100 ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {deck.userSurvivalPercent}% superado
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full ${deck.userSurvivalPercent >= 100 ? 'bg-amber-400' : 'bg-cyan-500'}`}
                      style={{ width: `${Math.min(100, deck.userSurvivalPercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
