import React, { useState } from 'react';
import { 
  PenTool, Dice5, Wand2, Droplets, Move, Save, X, Upload, ArrowRight, Layers, Circle, Play, Pause, Hash, Palette,
  Grid3X3, Route, Sparkles, Sliders, Zap, Check, Eye, Maximize2, Minimize2
} from 'lucide-react';
import { TAELIM_MORPHEMES } from '../data/taelimRules';
import { TaelimPreset } from '../types';
import { BridgeArc } from '../utils/taelimParser';

export interface MorphemeConfig {
  size: number;
  thickness: number;
  x: number;
  y: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  useCustomColor: boolean;
  color: string;
}

export interface SegmentPressure {
  start: number;
  mid: number;
  end: number;
}

export interface TaelimControlsProps {
  // text & Mode
  text: string;
  setText: (v: string) => void;
  isAnimating: boolean;
  handleRandomWord: () => void;
  mode: 'algante' | 'comun';
  setMode: (m: 'algante' | 'comun') => void;
  autoCompose: boolean;
  setAutoCompose: (v: boolean) => void;

  // Arcos de Vínculo
  matrixGap: number;
  setMatrixGap: (v: number) => void;
  arcOpacity: number;
  setArcOpacity: (v: number) => void;
  arcThickness: number;
  setArcThickness: (v: number) => void;
  arcCurvature: number;
  setArcCurvature: (v: number) => void;
  arcStrokeStyle: 'solid' | 'dashed' | 'dotted' | 'pulse';
  setArcStrokeStyle: (v: 'solid' | 'dashed' | 'dotted' | 'pulse') => void;
  showArcTerminals: boolean;
  setShowArcTerminals: (v: boolean) => void;
  arcGlow: number;
  setArcGlow: (v: number) => void;
  arcColorMode: 'sync' | 'cyan' | 'emerald' | 'gold' | 'violet';
  setArcColorMode: (v: 'sync' | 'cyan' | 'emerald' | 'gold' | 'violet') => void;
  parsedArcs?: BridgeArc[];

  // Morphemes
  selectedPrefix: string | null;
  setSelectedPrefix: (v: string | null) => void;
  selectedInfix: string | null;
  setSelectedInfix: (v: string | null) => void;
  selectedSuffix: string | null;
  setSelectedSuffix: (v: string | null) => void;
  activeMorphemeTab: number;
  setActiveMorphemeTab: (v: number) => void;
  prefixConfig: MorphemeConfig;
  setPrefixConfig: (v: MorphemeConfig) => void;
  infixConfig: MorphemeConfig;
  setInfixConfig: (v: MorphemeConfig) => void;
  suffixConfig: MorphemeConfig;
  setSuffixConfig: (v: MorphemeConfig) => void;

  // Didactic Mode
  toggleAnimation: () => void;
  showSequence: boolean;
  setShowSequence: (v: boolean) => void;
  isGradient: boolean;
  setIsGradient: (v: boolean) => void;
  gradientColors: { start: string, end: string };
  setGradientColors: (v: { start: string, end: string }) => void;
  applyColorPreset: (start: string, end: string) => void;
  strokeColor: string;
  setStrokeColor: (v: string) => void;

  // Presets
  handleImportClick: () => void;
  isSavingPreset: boolean;
  setIsSavingPreset: (v: boolean) => void;
  newPresetName: string;
  setNewPresetName: (v: string) => void;
  saveCurrentAsPreset: () => void;
  loadSystemPreset: (name: string) => void;
  customPresets: TaelimPreset[];
  applyPresetState: (p: Partial<TaelimPreset>) => void;
  onDeletePreset?: (id: string) => void;

  // Pressures
  smoothEnds: boolean;
  setSmoothEnds: (v: boolean) => void;
  activePoints: any[];
  segmentPressures: SegmentPressure[];
  updateSegment: (index: number, field: keyof SegmentPressure, value: number) => void;
  updateAllNodes: (value: number) => void;
  updateAllMids: (value: number) => void;
  calligraphyAmount: number;
  setCalligraphyAmount: (v: number) => void;
  penAngle: number;
  setPenAngle: (v: number) => void;

  // Grid
  showGridLines: boolean;
  setShowGridLines: (v: boolean) => void;
  showGridLabels: boolean;
  setShowGridLabels: (v: boolean) => void;
  showGridPoints: boolean;
  setShowGridPoints: (v: boolean) => void;
  gridPointMode: 'all' | 'active';
  setGridPointMode: (v: 'all' | 'active') => void;
  gridPointSize: number;
  setGridPointSize: (v: number) => void;
  gridPointColor: string;
  setGridPointColor: (v: string) => void;
  gridOpacity: number;
  setGridOpacity: (v: number) => void;

  // Physics
  tension: number;
  setTension: (v: number) => void;
  fluidity: number;
  setFluidity: (v: number) => void;
  waveFreq: number;
  setWaveFreq: (v: number) => void;
  waveAmp: number;
  setWaveAmp: (v: number) => void;

  // FX
  inkDensity: number;
  setInkDensity: (v: number) => void;
  erosion: number;
  setErosion: (v: number) => void;
  particles: number;
  setParticles: (v: number) => void;
  echoes: number;
  setEchoes: (v: number) => void;
  echoOffset: number;
  setEchoOffset: (v: number) => void;
  glow: number;
  setGlow: (v: number) => void;
}

type TabCategory = 'vinculos' | 'morfologia' | 'caligrafia' | 'fisica' | 'matriz' | 'didactica' | 'estilos';

const TaelimControls: React.FC<TaelimControlsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<TabCategory>('vinculos');
  const [expandAll, setExpandAll] = useState(false);

  const arcCount = props.parsedArcs ? props.parsedArcs.length : 0;

  const categories: { id: TabCategory; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'vinculos', label: 'Vínculos', icon: <Route size={14} />, badge: arcCount > 0 ? `${arcCount}` : undefined },
    { id: 'morfologia', label: 'Morfología', icon: <Layers size={14} /> },
    { id: 'caligrafia', label: 'Trazo', icon: <PenTool size={14} /> },
    { id: 'fisica', label: 'Física & FX', icon: <Droplets size={14} /> },
    { id: 'matriz', label: 'Matriz', icon: <Grid3X3 size={14} /> },
    { id: 'didactica', label: 'Color', icon: <Palette size={14} /> },
    { id: 'estilos', label: 'Estilos', icon: <Wand2 size={14} /> }
  ];

  const shouldRender = (id: TabCategory) => expandAll || activeTab === id;

  return (
    <div className="xl:col-span-3 space-y-4 h-full overflow-y-auto pr-2 custom-scrollbar pb-20">
      <div className="bg-black/20 backdrop-blur-xl p-5 border border-white/5 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-cyan-900/20 border border-cyan-500/20 rounded-xl text-cyan-400 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <PenTool size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-rajdhani text-white uppercase tracking-[0.2em] drop-shadow-md">Tael'im V5</h2>
              <p className="text-cyan-500/80 font-bold text-[9px] uppercase tracking-[0.3em] font-mono">Caligrafía Transversal</p>
            </div>
          </div>
          <button
            onClick={() => setExpandAll(!expandAll)}
            title={expandAll ? "Modo Pestañas Dinámicas" : "Expandir Todos los Grupos"}
            className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${expandAll ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-black/40 text-slate-400 border-white/5 hover:border-white/20 hover:text-white'}`}
          >
            {expandAll ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">{expandAll ? 'Pestañas' : 'Ver Todo'}</span>
          </button>
        </div>

        {/* PERSISTENT INPUT & QUICK CHIPS */}
        <div className="space-y-3 mb-6 bg-black/40 p-3.5 rounded-2xl border border-white/5 shadow-inner">
          <div className="flex gap-2 relative group">
            <div className="absolute inset-0 bg-cyan-500/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
            <input 
              type="text" 
              value={props.text}
              disabled={props.isAnimating}
              onChange={(e) => props.setText(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500/50 outline-none text-base font-bold font-rajdhani tracking-[0.12em] uppercase disabled:opacity-50 transition-all placeholder:text-[11px] placeholder:tracking-wider placeholder-slate-500 relative z-10 shadow-inner block"
              placeholder="PALABRA O FÓRMULA TAEL'IM..."
            />
            <button 
              onClick={props.handleRandomWord} 
              disabled={props.isAnimating} 
              title="Raíz aleatoria del glosario"
              className="px-3 bg-black/50 hover:bg-white/5 text-slate-400 hover:text-cyan-300 border border-white/10 rounded-xl disabled:opacity-50 transition-colors relative z-10"
            >
              <Dice5 size={16}/>
            </button>
          </div>

          {/* Quick Canonical Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-mono flex-shrink-0">Fórmulas:</span>
            {['Dun\'Val\'Thy', 'Koa\'na\'Eli', 'Min\'ka\'Rhaen', 'nu\'ka\'Vaes\'el', 'Vaes', 'Thāl', 'Eos', 'Khorēn'].map((chip) => (
              <button
                key={chip}
                onClick={() => props.setText(chip)}
                className={`text-[9px] font-mono px-2 py-0.5 rounded-md border transition-all whitespace-nowrap flex-shrink-0 ${props.text.toLowerCase() === chip.toLowerCase() ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]' : 'bg-black/30 text-slate-400 border-white/5 hover:border-cyan-500/30 hover:text-cyan-300'}`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {(['algante', 'comun'] as ('algante' | 'comun')[]).map((m) => (
              <button 
                key={m} 
                onClick={() => props.setMode(m)} 
                className={`py-2 px-2 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all leading-tight text-center ${props.mode === m ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)]' : 'bg-black/30 border-white/5 text-slate-500 hover:text-slate-300'}`}
              >
                {m === 'algante' ? 'Algante (6×4 // Descenso)' : 'Común (4×6 // Secuencia)'}
              </button>
            ))}
          </div>
        </div>

        {/* DYNAMIC CATEGORY TAB BAR */}
        {!expandAll && (
          <div className="grid grid-cols-4 gap-1.5 mb-6 p-1.5 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md">
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.2)] font-bold'
                      : 'bg-black/20 text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    {cat.icon}
                    {cat.badge && (
                      <span className="text-[8px] px-1 py-0.2 bg-cyan-400 text-black font-mono font-bold rounded-full">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-rajdhani truncate w-full text-center">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* GROUP 1: ARCOS DE VÍNCULO & DISTANCIA (NEW HIGH-RESOLUTION CONTROLS)     */}
        {/* ========================================================================= */}
        {shouldRender('vinculos') && (
          <div className="mb-6 p-5 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl relative shadow-inner animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Route size={15} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-rajdhani">Arcos de Vínculo</span>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${arcCount > 0 ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-black/40 text-slate-500 border-white/5'}`}>
                {arcCount} {arcCount === 1 ? 'vínculo' : 'vínculos'}
              </span>
            </div>

            {/* Diagnostic status */}
            {arcCount === 0 ? (
              <div className="p-3 mb-4 rounded-xl bg-black/30 border border-dashed border-white/10 text-center">
                <p className="text-[10px] text-slate-400 font-mono mb-2">Expresión en matriz única sin arcos.</p>
                <button
                  onClick={() => props.setText('Dun\'Val\'Thy')}
                  className="text-[9px] uppercase tracking-wider font-bold text-cyan-300 bg-cyan-900/30 hover:bg-cyan-800/40 border border-cyan-500/30 px-3 py-1 rounded-lg transition-all"
                >
                  Probar fórmula enlazada: Dun'Val'Thy
                </button>
              </div>
            ) : (
              <div className="p-2.5 mb-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[10px] font-mono text-cyan-300/90 flex items-center justify-between">
                <span>Modo de arco: {props.mode === 'algante' ? 'Descenso Lateral' : 'Bóveda Aérea'}</span>
                <span className="text-slate-400">Activo</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Distancia entre matrices (matrixGap) */}
              <div>
                <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                  <span>Distancia entre Matrices (Gap)</span>
                  <span className="text-cyan-300 font-bold">{props.matrixGap}px</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="280" 
                  step="5" 
                  value={props.matrixGap} 
                  onChange={e => props.setMatrixGap(Number(e.target.value))} 
                  className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-400 ring-1 ring-white/5" 
                />
                <div className="flex gap-1.5 mt-2">
                  {[
                    { label: 'Compacto', val: 75 },
                    { label: 'Equilibrado', val: 130 },
                    { label: 'Amplio', val: 185 },
                    { label: 'Monumental', val: 245 }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => props.setMatrixGap(preset.val)}
                      className={`flex-1 py-1 text-[8px] font-mono rounded border transition-all ${props.matrixGap === preset.val ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40' : 'bg-black/30 text-slate-500 border-white/5 hover:text-slate-300'}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curvatura / Flow */}
              <div>
                <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                  <span>Curvatura del Arco (Flow)</span>
                  <span className="text-cyan-300 font-bold">{props.arcCurvature}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="200" 
                  step="5" 
                  value={props.arcCurvature} 
                  onChange={e => props.setArcCurvature(Number(e.target.value))} 
                  className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-400 ring-1 ring-white/5" 
                />
                <div className="flex gap-1.5 mt-2">
                  {[
                    { label: 'Tenso', val: 40 },
                    { label: 'Clásico', val: 80 },
                    { label: 'Pronunciado', val: 130 },
                    { label: 'Bóveda', val: 180 }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => props.setArcCurvature(preset.val)}
                      className={`flex-1 py-1 text-[8px] font-mono rounded border transition-all ${props.arcCurvature === preset.val ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40' : 'bg-black/30 text-slate-500 border-white/5 hover:text-slate-300'}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grosor del trazo */}
              <div>
                <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                  <span>Grosor del Trazo</span>
                  <span className="text-cyan-300 font-bold">{props.arcThickness}px</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="0.5" 
                  value={props.arcThickness} 
                  onChange={e => props.setArcThickness(Number(e.target.value))} 
                  className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-400 ring-1 ring-white/5" 
                />
              </div>

              {/* Opacidad del arco */}
              <div>
                <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                  <span>Opacidad del Vínculo</span>
                  <span className="text-cyan-300 font-bold">{Math.round(props.arcOpacity * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05" 
                  value={props.arcOpacity} 
                  onChange={e => props.setArcOpacity(Number(e.target.value))} 
                  className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-400 ring-1 ring-white/5" 
                />
              </div>

              {/* Tipo de Trazo */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-[9px] text-slate-400 uppercase block mb-2 font-mono tracking-widest">Patrón de Trazo</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'solid', label: 'Sólido' },
                    { id: 'dashed', label: 'Discontinuo' },
                    { id: 'dotted', label: 'Punteado' },
                    { id: 'pulse', label: 'Pulso' }
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => props.setArcStrokeStyle(style.id as any)}
                      className={`py-1.5 text-[9px] font-mono rounded-lg border transition-all text-center ${props.arcStrokeStyle === style.id ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)] font-bold' : 'bg-black/40 text-slate-400 border-white/5 hover:bg-white/5 hover:text-slate-200'}`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resplandor / Glow */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                  <span>Aura Luminosa (Glow)</span>
                  <span className="text-cyan-300 font-bold">{props.arcGlow}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  step="1" 
                  value={props.arcGlow} 
                  onChange={e => props.setArcGlow(Number(e.target.value))} 
                  className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-400 ring-1 ring-white/5" 
                />
              </div>

              {/* Nodos de Anclaje */}
              <div className="pt-2 border-t border-white/5">
                <label className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-all">
                  <span className="text-[9px] text-slate-300 font-mono uppercase tracking-wider">Nodos de Anclaje del Vínculo</span>
                  <input 
                    type="checkbox" 
                    checked={props.showArcTerminals} 
                    onChange={e => props.setShowArcTerminals(e.target.checked)} 
                    className="accent-cyan-500 w-3.5 h-3.5 bg-black/50 border-white/20 rounded" 
                  />
                </label>
              </div>

              {/* Armonía Cromática */}
              <div className="pt-2 border-t border-white/5">
                <span className="text-[9px] text-slate-400 uppercase block mb-2 font-mono tracking-widest">Armonía Cromática</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: 'sync', label: 'Sync', color: '#64748b' },
                    { id: 'cyan', label: 'Cyan', color: '#22d3ee' },
                    { id: 'emerald', label: 'Esmeralda', color: '#34d399' },
                    { id: 'gold', label: 'Oro', color: '#fbbf24' },
                    { id: 'violet', label: 'Violeta', color: '#c084fc' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => props.setArcColorMode(mode.id as any)}
                      className={`py-1.5 text-[8px] font-mono rounded-lg border transition-all flex flex-col items-center gap-1 ${props.arcColorMode === mode.id ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-black/40 text-slate-500 border-white/5 hover:text-slate-300'}`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mode.color }}></div>
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GROUP 2: MORFOLOGÍA TRANSVERSAL (PREFIX, INFIX, SUFFIX & GEOMETRY)        */}
        {/* ========================================================================= */}
        {shouldRender('morfologia') && (
          <div className="mb-6 p-5 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl relative shadow-inner animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <span className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-bold">Morfología</span>
              <label className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                <input type="checkbox" checked={props.autoCompose} onChange={e => props.setAutoCompose(e.target.checked)} className="accent-cyan-500 w-3 h-3 bg-black/50 border-white/20 rounded" />
                <span className="text-[9px] text-cyan-200/70 font-rajdhani tracking-widest uppercase">Auto-Componer</span>
              </label>
            </div>
            
            <div className="mt-4 space-y-4">
              {/* Prefixes */}
              <div>
                <span className="text-[9px] text-slate-400 uppercase block mb-1.5 font-mono tracking-widest">Prefijos (Inicio)</span>
                <div className="grid grid-cols-5 gap-1.5">
                  <button 
                    onClick={() => props.setSelectedPrefix(null)}
                    className={`p-1.5 text-[10px] rounded-lg border transition-all ${props.selectedPrefix === null ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                    title="Ninguno"
                  >
                    ∅
                  </button>
                  {TAELIM_MORPHEMES.filter(m => m.type === 'prefix').map(m => (
                    <button
                      key={m.id}
                      onClick={() => props.setSelectedPrefix(props.selectedPrefix === m.id ? null : m.id)}
                      className={`p-1.5 text-[10px] rounded-lg border font-mono transition-all ${props.selectedPrefix === m.id ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'bg-black/40 border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10'}`}
                      title={`${m.label}: ${m.description}`}
                    >
                      {m.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Infixes */}
              <div>
                <span className="text-[9px] text-slate-400 uppercase block mb-1.5 font-mono tracking-widest">Infijos (Evidencia)</span>
                <div className="grid grid-cols-5 gap-1.5">
                  <button 
                    onClick={() => props.setSelectedInfix(null)}
                    className={`p-1.5 text-[10px] rounded-lg border transition-all ${props.selectedInfix === null ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                    title="Ninguno"
                  >
                    ∅
                  </button>
                  {TAELIM_MORPHEMES.filter(m => m.type === 'infix').map(m => (
                    <button
                      key={m.id}
                      onClick={() => props.setSelectedInfix(props.selectedInfix === m.id ? null : m.id)}
                      className={`p-1.5 text-[10px] rounded-lg border font-mono transition-all ${props.selectedInfix === m.id ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-black/40 border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10'}`}
                      title={`${m.label}: ${m.description}`}
                    >
                      {m.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suffixes */}
              <div>
                <span className="text-[9px] text-slate-400 uppercase block mb-1.5 font-mono tracking-widest">Sufijos (Final)</span>
                <div className="grid grid-cols-5 gap-1.5">
                  <button 
                    onClick={() => props.setSelectedSuffix(null)}
                    className={`p-1.5 text-[10px] rounded-lg border transition-all ${props.selectedSuffix === null ? 'bg-violet-500/20 border-violet-500/50 text-violet-100 shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'bg-black/40 border-white/5 text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                    title="Ninguno"
                  >
                    ∅
                  </button>
                  {TAELIM_MORPHEMES.filter(m => m.type === 'suffix').map(m => (
                    <button
                      key={m.id}
                      onClick={() => props.setSelectedSuffix(props.selectedSuffix === m.id ? null : m.id)}
                      className={`p-1.5 text-[10px] rounded-lg border font-mono transition-all ${props.selectedSuffix === m.id ? 'bg-violet-500/20 border-violet-500/50 text-violet-100 shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'bg-black/40 border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10'}`}
                      title={`${m.label}: ${m.description}`}
                    >
                      {m.symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Configuration Tabs */}
              <div className="pt-4 border-t border-white/5 mt-4">
                <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-xl backdrop-blur-md border border-white/5">
                  {['Prefijo', 'Infijo', 'Sufijo'].map((tab, i) => (
                    <button 
                      key={tab}
                      onClick={() => props.setActiveMorphemeTab(i)}
                      className={`flex-1 py-1.5 text-[9px] rounded-lg transition-all uppercase font-bold tracking-[0.2em] ${props.activeMorphemeTab === i ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Config Controls for Active Tab */}
                <div className="space-y-4 bg-black/40 rounded-xl p-4 border border-white/5 shadow-inner">
                  {(() => {
                    const config = props.activeMorphemeTab === 0 ? props.prefixConfig : props.activeMorphemeTab === 1 ? props.infixConfig : props.suffixConfig;
                    const setConfig = props.activeMorphemeTab === 0 ? props.setPrefixConfig : props.activeMorphemeTab === 1 ? props.setInfixConfig : props.setSuffixConfig;
                    const label = props.activeMorphemeTab === 0 ? 'Prefijo' : props.activeMorphemeTab === 1 ? 'Infijo' : 'Sufijo';

                    return (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">{label} Config</span>
                          <button 
                            onClick={() => setConfig({ size: 40, thickness: 2, x: 0, y: 0, rotation: 0, flipX: false, flipY: false, useCustomColor: false, color: '#22d3ee' })}
                            className="text-[9px] text-slate-500 hover:text-cyan-300 uppercase tracking-wider transition-colors px-2 py-1 bg-white/5 rounded-md hover:bg-cyan-900/40"
                          >
                            Reset
                          </button>
                        </div>
                        
                        {/* Size */}
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                            <span>Tamaño</span> <span className="text-cyan-300">{config.size}px</span>
                          </div>
                          <input 
                            type="range" min="10" max="100" value={config.size} 
                            onChange={e => setConfig({ ...config, size: Number(e.target.value) })}
                            className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-500 ring-1 ring-white/5" 
                          />
                        </div>

                        {/* Thickness */}
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                            <span>Grosor</span> <span className="text-cyan-300">{config.thickness}px</span>
                          </div>
                          <input 
                            type="range" min="0.5" max="10" step="0.5" value={config.thickness} 
                            onChange={e => setConfig({ ...config, thickness: Number(e.target.value) })}
                            className="w-full h-1 bg-black/60 rounded-full appearance-none accent-cyan-500 ring-1 ring-white/5" 
                          />
                        </div>

                        {/* Offset X */}
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                            <span>Offset X</span> <span className="text-emerald-300">{config.x}px</span>
                          </div>
                          <input 
                            type="range" min="-100" max="100" value={config.x} 
                            onChange={e => setConfig({ ...config, x: Number(e.target.value) })}
                            className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-500 ring-1 ring-white/5" 
                          />
                        </div>

                        {/* Offset Y */}
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                            <span>Offset Y</span> <span className="text-emerald-300">{config.y}px</span>
                          </div>
                          <input 
                            type="range" min="-100" max="100" value={config.y} 
                            onChange={e => setConfig({ ...config, y: Number(e.target.value) })}
                            className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-500 ring-1 ring-white/5" 
                          />
                        </div>

                        {/* Rotation */}
                        <div>
                          <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                            <span>Rotación</span> <span className="text-orange-300">{config.rotation}°</span>
                          </div>
                          <input 
                            type="range" min="0" max="360" value={config.rotation} 
                            onChange={e => setConfig({ ...config, rotation: Number(e.target.value) })}
                            className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5" 
                          />
                        </div>

                        {/* Flips */}
                        <div className="flex gap-3 pt-2">
                          <button 
                            onClick={() => setConfig({ ...config, flipX: !config.flipX })}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-bold transition-all border ${config.flipX ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5 hover:text-slate-300'}`}
                          >
                            Voltear H
                          </button>
                          <button 
                            onClick={() => setConfig({ ...config, flipY: !config.flipY })}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-bold transition-all border ${config.flipY ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5 hover:text-slate-300'}`}
                          >
                            Voltear V
                          </button>
                        </div>
                        
                        {/* Custom Color Toggle */}
                        <div className="pt-4 border-t border-white/5 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer mb-3 w-max hover:opacity-80 transition-opacity">
                            <input type="checkbox" checked={config.useCustomColor} onChange={e => setConfig({ ...config, useCustomColor: e.target.checked })} className="accent-cyan-500 w-3 h-3 bg-black/50 border-white/20 rounded" />
                            <span className="text-[9px] text-slate-400 uppercase font-mono tracking-widest">Color Propio</span>
                          </label>
                          
                          {config.useCustomColor && (
                            <div className="flex items-center gap-3 bg-black/30 rounded-lg p-2 border border-white/5">
                              <div className="relative w-8 h-8 rounded-md overflow-hidden border border-white/10 shadow-sm">
                                <input 
                                  type="color" 
                                  value={config.color} 
                                  onChange={e => setConfig({ ...config, color: e.target.value })}
                                  className="absolute -top-2 -left-2 w-12 h-12 border-none cursor-pointer" 
                                />
                              </div>
                              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">{config.color}</span>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GROUP 3: TRAZO & CALIGRAFÍA (PRESSURE MODULATION & STROKE ENGINE)         */}
        {/* ========================================================================= */}
        {shouldRender('caligrafia') && (
          <div className="mb-6 p-5 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl relative shadow-inner animate-fade-in">
            <div className="flex items-center justify-between text-cyan-400 mb-4 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <PenTool size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-rajdhani">Modulación de Trazo</span>
              </div>
              <button 
                onClick={() => props.setSmoothEnds(!props.smoothEnds)} 
                className={`p-1.5 rounded-lg transition-colors border ${props.smoothEnds ? 'bg-cyan-900/30 text-cyan-300 border-cyan-500' : 'text-slate-600 border-slate-800 hover:text-slate-400'}`}
                title="Suavizar puntas y transiciones"
              >
                <Circle size={14} className={props.smoothEnds ? 'fill-current' : ''} />
              </button>
            </div>

            {/* GLOBAL OVERRIDES */}
            {props.activePoints.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 p-3 mb-4 rounded-xl relative shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <Layers size={12} className="text-cyan-400" />
                  <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">Global Override</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8px] text-slate-500 block mb-1 uppercase font-mono">Grosor Nodos</label>
                    <input type="range" min="1" max="50" step="0.5" className="w-full h-1 bg-slate-800 rounded-none appearance-none accent-cyan-400" 
                      onChange={(e) => props.updateAllNodes(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-[8px] text-slate-500 block mb-1 uppercase font-mono">Grosor Trazos</label>
                    <input type="range" min="1" max="50" step="0.5" className="w-full h-1 bg-slate-800 rounded-none appearance-none accent-emerald-400" 
                      onChange={(e) => props.updateAllMids(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            )}
            
            {props.activePoints.length === 0 ? (
              <p className="text-xs text-slate-600 italic font-mono uppercase text-center py-4 border border-dashed border-slate-800 rounded-xl">Esperando Input...</p>
            ) : (
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar bg-black/30 p-2.5 rounded-xl border border-slate-800">
                
                {/* Single Point */}
                {props.activePoints.length === 1 && props.segmentPressures.length > 0 && (
                  <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-900/20 px-1.5 py-0.5 border border-cyan-900/50 rounded">{props.activePoints[0].char}</span>
                      <span className="text-[9px] text-slate-500 uppercase font-mono">Punto Único</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] text-slate-500 w-8 uppercase font-mono">Base</span>
                      <input 
                        type="range" min="1" max="50" step="0.5" 
                        value={props.segmentPressures[0].start} 
                        onChange={(e) => props.updateSegment(0, 'start', Number(e.target.value))}
                        className="flex-1 h-1 bg-slate-800 rounded-none appearance-none accent-cyan-500" 
                      />
                    </div>
                  </div>
                )}

                {/* Segments */}
                {props.activePoints.length > 1 && props.segmentPressures.map((seg, idx) => {
                  const charStart = props.activePoints[idx]?.char || '?';
                  const charEnd = props.activePoints[idx+1]?.char || '?';

                  return (
                    <div key={idx} className="bg-slate-900/70 p-2.5 rounded-lg border-l-2 border-slate-700 hover:border-cyan-500 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 border border-cyan-900 rounded">{charStart}</span>
                          <ArrowRight size={10} className="text-slate-600" />
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 border border-emerald-900 rounded">{charEnd}</span>
                        </div>
                        <span className="text-[9px] text-slate-600 font-mono">SEG_{idx < 9 ? '0'+(idx+1) : idx+1}</span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] text-slate-500 w-8 uppercase font-mono">Start</span>
                          <input 
                            type="range" min="1" max="50" step="0.5" 
                            value={seg.start} 
                            onChange={(e) => props.updateSegment(idx, 'start', Number(e.target.value))}
                            className="flex-1 h-1 bg-slate-800 rounded-none appearance-none accent-cyan-500" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] text-slate-500 w-8 uppercase font-mono">Mid</span>
                          <input 
                            type="range" min="1" max="50" step="0.5" 
                            value={seg.mid} 
                            onChange={(e) => props.updateSegment(idx, 'mid', Number(e.target.value))}
                            className="flex-1 h-1 bg-slate-800 rounded-none appearance-none accent-slate-400" 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] text-slate-500 w-8 uppercase font-mono">End</span>
                          <input 
                            type="range" min="1" max="50" step="0.5" 
                            value={seg.end} 
                            onChange={(e) => props.updateSegment(idx, 'end', Number(e.target.value))}
                            className="flex-1 h-1 bg-slate-800 rounded-none appearance-none accent-emerald-500" 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-4 border-t border-white/5 mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 uppercase font-mono tracking-widest">
                  <span>Influencia Ángulo</span> 
                  <span className="text-cyan-300 font-bold">{props.calligraphyAmount}%</span>
                </div>
                <input type="range" min="0" max="100" value={props.calligraphyAmount} onChange={(e) => props.setCalligraphyAmount(Number(e.target.value))} className="w-full h-1 bg-slate-800 rounded-none appearance-none accent-cyan-500" />
              </div>
              
              <div className={props.calligraphyAmount === 0 ? 'opacity-30 pointer-events-none' : ''}>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 uppercase font-mono tracking-widest">
                  <span>Rotación Pluma</span> 
                  <span className="text-cyan-300 font-bold">{props.penAngle}°</span>
                </div>
                <input type="range" min="0" max="180" value={props.penAngle} onChange={(e) => props.setPenAngle(Number(e.target.value))} className="w-full h-1 bg-slate-800 rounded-none appearance-none accent-cyan-500" />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GROUP 4: FÍSICA & EFECTOS (ORGANIC GEOMETRY & FLUID FX)                   */}
        {/* ========================================================================= */}
        {shouldRender('fisica') && (
          <div className="mb-6 p-5 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl relative shadow-inner animate-fade-in space-y-6">
            
            {/* Geometría Orgánica */}
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-4 border-b border-white/5 pb-2">
                <Move size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-rajdhani">Geometría Orgánica</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                    <span>Tensión Curva</span> 
                    <span className="text-emerald-300 font-bold">{props.tension.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={props.tension} onChange={(e) => props.setTension(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-500 ring-1 ring-white/5" />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                    <span>Caos Nodos / Fluidez</span> 
                    <span className="text-emerald-300 font-bold">{props.fluidity}</span>
                  </div>
                  <input type="range" min="0" max="40" value={props.fluidity} onChange={(e) => props.setFluidity(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-500 ring-1 ring-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                      <span>Frec. Onda</span>
                      <span className="text-emerald-300 font-bold">{props.waveFreq}</span>
                    </div>
                    <input type="range" min="0" max="20" step="0.5" value={props.waveFreq} onChange={e => props.setWaveFreq(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-400 ring-1 ring-white/5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                      <span>Amp. Onda</span>
                      <span className="text-emerald-300 font-bold">{props.waveAmp}</span>
                    </div>
                    <input type="range" min="0" max="40" value={props.waveAmp} onChange={e => props.setWaveAmp(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-emerald-400 ring-1 ring-white/5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dinámica de Fluidos (FX) */}
            <div>
              <div className="flex items-center gap-2 text-orange-400 mb-4 border-b border-white/5 pb-2">
                <Droplets size={14} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-rajdhani">Dinámica de Fluidos (FX)</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                    <span>Densidad Tinta</span> 
                    <span className="text-orange-300 font-bold">{props.inkDensity}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={props.inkDensity} onChange={(e) => props.setInkDensity(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5" />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                    <span>Erosión</span> 
                    <span className="text-orange-300 font-bold">{props.erosion}</span>
                  </div>
                  <input type="range" min="0" max="20" step="0.5" value={props.erosion} onChange={(e) => props.setErosion(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5" />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                    <span>Esparcimiento Partículas</span> 
                    <span className="text-orange-300 font-bold">{props.particles}</span>
                  </div>
                  <input type="range" min="0" max="50" value={props.particles} onChange={(e) => props.setParticles(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                      <span>Ecos</span> 
                      <span className="text-orange-300 font-bold">{props.echoes}</span>
                    </div>
                    <input type="range" min="0" max="10" step="1" value={props.echoes} onChange={e => props.setEchoes(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                      <span>Offset</span> 
                      <span className="text-orange-300 font-bold">{props.echoOffset}</span>
                    </div>
                    <input type="range" min="0" max="100" value={props.echoOffset} onChange={e => props.setEchoOffset(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5" />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <div className="flex justify-between text-[9px] text-slate-400 mb-2 uppercase font-mono tracking-widest">
                    <span>Bioluminiscencia (Glow)</span> 
                    <span className="text-orange-300 font-bold">{props.glow}</span>
                  </div>
                  <input type="range" min="0" max="50" value={props.glow} onChange={(e) => props.setGlow(Number(e.target.value))} className="w-full h-1 bg-black/60 rounded-full appearance-none accent-orange-500 ring-1 ring-white/5 shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* GROUP 5: MATRIZ & GUÍAS (GRID, NODES & LABELS)                            */}
        {/* ========================================================================= */}
        {shouldRender('matriz') && (
          <div className="mb-6 p-5 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl relative shadow-inner animate-fade-in">
            <div className="flex items-center gap-2 text-slate-400 mb-4 border-b border-white/5 pb-2">
              <Grid3X3 size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Grid & Guías</span>
            </div>
            
            <div className="space-y-4">
              {/* Toggles */}
              <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                <button 
                  onClick={() => props.setShowGridLines(!props.showGridLines)}
                  className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${props.showGridLines ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
                >
                  Líneas
                </button>
                <button 
                  onClick={() => props.setShowGridLabels(!props.showGridLabels)}
                  className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${props.showGridLabels ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
                >
                  Letras
                </button>
                <button 
                  onClick={() => props.setShowGridPoints(!props.showGridPoints)}
                  className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${props.showGridPoints ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}
                >
                  Puntos
                </button>
              </div>

              {/* Points Mode */}
              {props.showGridPoints && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => props.setGridPointMode('all')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${props.gridPointMode === 'all' ? 'bg-white/10 text-white border-white/20' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5 hover:text-slate-300'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => props.setGridPointMode('active')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all border ${props.gridPointMode === 'active' ? 'bg-white/10 text-white border-white/20' : 'bg-black/40 text-slate-500 border-white/5 hover:bg-white/5 hover:text-slate-300'}`}
                  >
                    Solo Activos
                  </button>
                </div>
              )}

              {/* Point Style */}
              {props.showGridPoints && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                      <span>Tamaño Vértice</span>
                      <span className="text-slate-300">{props.gridPointSize}px</span>
                    </div>
                    <input 
                      type="range" min="2" max="10" step="0.5" 
                      value={props.gridPointSize} 
                      onChange={e => props.setGridPointSize(Number(e.target.value))} 
                      className="w-full h-1 bg-black/60 rounded-full appearance-none accent-slate-400 ring-1 ring-white/5" 
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase mb-2 block font-mono tracking-widest">Color</label>
                    <div className="flex items-center gap-3 bg-black/30 p-1.5 rounded-lg border border-white/5">
                      <div className="relative w-full h-4 rounded-sm overflow-hidden border border-white/10">
                        <input 
                          type="color" 
                          value={props.gridPointColor} 
                          onChange={e => props.setGridPointColor(e.target.value)} 
                          className="absolute -top-2 -left-2 w-16 h-12 border-none cursor-pointer" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Opacity */}
              <div className="pt-2">
                <div className="flex justify-between text-[9px] text-slate-400 uppercase font-mono mb-2 tracking-widest">
                  <span>Opacidad Grid</span> <span className="text-slate-300 font-bold">{Math.round(props.gridOpacity * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={props.gridOpacity} 
                  onChange={e => props.setGridOpacity(Number(e.target.value))} 
                  className="w-full h-1 bg-black/60 rounded-full appearance-none accent-slate-400 ring-1 ring-white/5" 
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GROUP 6: DIDÁCTICA & COLOR (ANIMATION, NUMBERS & GRADIENTS)                */}
        {/* ========================================================================= */}
        {shouldRender('didactica') && (
          <div className="mb-6 p-5 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl relative shadow-inner animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
              <span className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-bold">Didáctica & Color</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={props.toggleAnimation} 
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border shadow-sm ${props.isAnimating ? 'bg-orange-900/30 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:bg-orange-800/40' : 'bg-black/40 text-slate-300 border-white/5 hover:border-cyan-500/50 hover:text-cyan-300'}`}
              >
                {props.isAnimating ? <Pause size={14} /> : <Play size={14} />}
                {props.isAnimating ? 'Pausar' : 'Replay'}
              </button>
              <button 
                onClick={() => props.setShowSequence(!props.showSequence)} 
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border shadow-sm ${props.showSequence ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-emerald-800/40' : 'bg-black/40 text-slate-300 border-white/5 hover:border-cyan-500/50 hover:text-cyan-300'}`}
              >
                <Hash size={14} /> Orden
              </button>
            </div>
            
            <div className="mt-5 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Palette size={12} className="opacity-70"/> Color del Trazo</span>
                <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <input type="checkbox" checked={props.isGradient} onChange={e => props.setIsGradient(e.target.checked)} className="accent-cyan-500 w-3 h-3 bg-black/50 border-white/20 rounded" />
                  <span className="text-[9px] uppercase tracking-widest text-slate-300 font-bold">Gradiente</span>
                </label>
              </div>
              
              {props.isGradient ? (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                      <span className="text-[8px] uppercase tracking-widest text-slate-500 w-8 font-mono">Start</span>
                      <div className="relative w-full h-4 rounded-sm overflow-hidden border border-white/10">
                        <input type="color" value={props.gradientColors.start} onChange={e => props.setGradientColors({...props.gradientColors, start: e.target.value})} className="absolute -top-2 -left-2 w-12 h-12 border-none cursor-pointer" />
                      </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                      <span className="text-[8px] uppercase tracking-widest text-slate-500 w-8 font-mono">End</span>
                      <div className="relative w-full h-4 rounded-sm overflow-hidden border border-white/10">
                        <input type="color" value={props.gradientColors.end} onChange={e => props.setGradientColors({...props.gradientColors, end: e.target.value})} className="absolute -top-2 -left-2 w-12 h-12 border-none cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  {/* Color Presets */}
                  <div className="flex gap-2 justify-between">
                    {[
                      {s: '#22d3ee', e: '#a855f7', n: 'Cyber'},
                      {s: '#facc15', e: '#ef4444', n: 'Heat'},
                      {s: '#4ade80', e: '#0ea5e9', n: 'Nature'},
                      {s: '#f472b6', e: '#db2777', n: 'Neon'},
                      {s: '#e2e8f0', e: '#64748b', n: 'Steel'}
                    ].map((p, i) => (
                      <button 
                        key={i} 
                        onClick={() => props.applyColorPreset(p.s, p.e)}
                        className="flex-1 h-3 rounded-full border border-white/10 hover:border-white hover:scale-110 transition-all shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
                        style={{background: `linear-gradient(90deg, ${p.s}, ${p.e})`}}
                        title={p.n}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] uppercase font-mono text-slate-400 w-14">Sólido</span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/10">
                      <input 
                        type="color" 
                        value={props.strokeColor} 
                        onChange={e => props.setStrokeColor(e.target.value)} 
                        className="absolute -top-2 -left-2 w-12 h-12 border-none cursor-pointer" 
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-300 uppercase font-bold">{props.strokeColor}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GROUP 7: ESTILOS & PRESETS (SYSTEM & CUSTOM PRESETS)                      */}
        {/* ========================================================================= */}
        {shouldRender('estilos') && (
          <div className="mb-6 p-5 border border-white/5 bg-black/20 backdrop-blur-md rounded-2xl relative shadow-inner animate-fade-in">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <label className="text-[10px] font-bold text-cyan-400 uppercase flex items-center gap-2 tracking-[0.2em]"><Wand2 size={12}/> Estilos Tael'im</label>
              <div className="flex gap-3">
                <button onClick={props.handleImportClick} className="text-[9px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-mono uppercase transition-colors tracking-widest" title="Cargar sesión"><Upload size={10}/> Load</button>
                <button onClick={() => props.setIsSavingPreset(!props.isSavingPreset)} className="text-[9px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-mono uppercase transition-colors tracking-widest"><Save size={10}/> Save</button>
              </div>
            </div>

            {props.isSavingPreset && (
              <div className="flex gap-2 mb-4 animate-fade-in">
                <input type="text" value={props.newPresetName} onChange={e => props.setNewPresetName(e.target.value)} placeholder="NOMBRE DEL ESTILO..." className="flex-1 bg-black/40 border border-white/10 rounded-lg text-xs px-3 py-2 text-white font-mono uppercase focus:border-cyan-500/50 outline-none" />
                <button onClick={props.saveCurrentAsPreset} className="bg-cyan-600/80 hover:bg-cyan-500 px-4 rounded-lg text-white text-[10px] font-bold tracking-widest transition-colors shadow-[0_0_10px_rgba(34,211,238,0.2)]">OK</button>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 mb-4">
              {['ink', 'calligraphy', 'marker', 'liquid', 'tech', 'chaos', 'ghost', 'void'].map(p => (
                <button key={p} onClick={() => props.loadSystemPreset(p)} className="bg-black/40 hover:bg-white/5 border border-white/5 hover:border-cyan-500/30 rounded-lg py-2 text-[9px] text-slate-400 hover:text-cyan-200 uppercase truncate px-2 font-mono transition-all text-center">{p}</button>
              ))}
            </div>

            {/* Custom Presets */}
            {props.customPresets && props.customPresets.length > 0 && (
              <div className="pt-3 border-t border-white/5">
                <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 block tracking-widest font-mono">Estilos del Usuario</label>
                <div className="flex flex-wrap gap-2">
                  {props.customPresets.map(p => (
                    <div key={p.id} className="group relative flex items-center">
                      <button onClick={() => props.applyPresetState(p)} className="bg-cyan-900/20 hover:bg-cyan-800/40 border border-cyan-500/20 rounded-lg py-1.5 pl-3 pr-6 text-[9px] text-cyan-200 uppercase truncate font-mono transition-all shadow-[0_0_10px_rgba(34,211,238,0.1)]">{p.name}</button>
                      <button onClick={() => props.onDeletePreset && props.onDeletePreset(p.id)} className="absolute right-1.5 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-0.5"><X size={10}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TaelimControls;
