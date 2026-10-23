import React, { useState, useEffect, useRef } from 'react';
import { ChronosTime, EarthTime } from '../types/chronos';
import { chronoAudio } from '../utils/audioEngine';
import { 
  SECONDS_PER_VIRA, 
  VIRAS_PER_FULA, 
  VIRAS_PER_KROMA, 
  formatVirasDecomposed 
} from '../utils/chronosystemMath';
import { getCurrentZouPhase, getFestivalsForTala } from '../data/stationCalendarData';
import { 
  Pin, 
  PinOff, 
  Settings, 
  Minus, 
  X, 
  Volume2, 
  VolumeX, 
  HeartPulse, 
  ExternalLink,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Timer as TimerIcon,
  Hourglass,
  Cpu,
  Radio,
  Eye,
  Check,
  Compass,
  Calendar
} from 'lucide-react';

interface MiniHudPluginProps {
  chronosTime: ChronosTime;
  earthTime: EarthTime;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  onClose?: () => void;
}

interface HudPreferences {
  showMacroCoordinates: boolean;
  showBinaryRegister: boolean;
  showCircadianSpectrum: boolean;
  showStopwatch: boolean;
  showTimer: boolean;
  showEarthTime: boolean;
  showFestivalAlert: boolean;
  showZouPhase: boolean;
}

const DEFAULT_PREFS: HudPreferences = {
  showMacroCoordinates: true,
  showBinaryRegister: false,
  showCircadianSpectrum: true,
  showStopwatch: false,
  showTimer: false,
  showEarthTime: true,
  showFestivalAlert: true,
  showZouPhase: false
};

declare global {
  interface Window {
    horocronoAPI?: {
      isElectron: boolean;
      openMiniHud: () => void;
      closeMiniHud: () => void;
      toggleAlwaysOnTop: () => Promise<boolean>;
      setAlwaysOnTop: (flag: boolean) => Promise<boolean>;
      isAlwaysOnTop: () => Promise<boolean>;
      setOpacity: (opacity: number) => void;
      focusMainWindow: () => void;
      minimizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}

export const MiniHudPlugin: React.FC<MiniHudPluginProps> = ({
  chronosTime,
  earthTime,
  isMuted,
  setIsMuted,
  onClose
}) => {
  // Load saved preferences from localStorage
  const [prefs, setPrefs] = useState<HudPreferences>(() => {
    try {
      const saved = localStorage.getItem('horocrono_hud_prefs_v2');
      if (saved) return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_PREFS;
  });

  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true);
  const [opacity, setOpacity] = useState(1.0);
  const [tickAudio, setTickAudio] = useState(false);
  const [isHumming, setIsHumming] = useState(false);
  const [lastVira, setLastVira] = useState(chronosTime.vira);

  // Embedded Mini-Stopwatch State
  const [swRunning, setSwRunning] = useState(false);
  const [swElapsedMs, setSwElapsedMs] = useState(0);
  const [swLaps, setSwLaps] = useState<number[]>([]);
  const swStartRef = useRef<number>(0);

  // Embedded Mini-Timer State (Countdown in Viras)
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerViras, setTimerViras] = useState(2048); // default 1 Kroma (22.5m)
  const [timerInitialViras, setTimerInitialViras] = useState(2048);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerLastRef = useRef<number>(0);

  const isElectron = typeof window !== 'undefined' && !!window.horocronoAPI?.isElectron;

  // Save prefs
  const updatePref = (key: keyof HudPreferences, val: boolean) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem('horocrono_hud_prefs_v2', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Sync initial always on top from Electron
  useEffect(() => {
    if (isElectron && window.horocronoAPI?.isAlwaysOnTop) {
      window.horocronoAPI.isAlwaysOnTop().then((val) => setIsAlwaysOnTop(val));
    }
  }, [isElectron]);

  // Audio tick on vira change if enabled
  useEffect(() => {
    if (tickAudio && chronosTime.vira !== lastVira) {
      setLastVira(chronosTime.vira);
      chronoAudio.playViraTick(chronosTime.vira % 8 === 0);
    } else {
      setLastVira(chronosTime.vira);
    }
  }, [chronosTime.vira, tickAudio, lastVira]);

  // Mini-Stopwatch loop
  useEffect(() => {
    let animId: number;
    if (swRunning) {
      swStartRef.current = performance.now() - swElapsedMs;
      const loop = () => {
        setSwElapsedMs(performance.now() - swStartRef.current);
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [swRunning]);

  // Mini-Timer loop
  useEffect(() => {
    let animId: number;
    if (timerRunning && timerViras > 0) {
      timerLastRef.current = performance.now();
      const loop = () => {
        const now = performance.now();
        const deltaSec = (now - timerLastRef.current) / 1000;
        timerLastRef.current = now;
        const deltaViras = deltaSec / SECONDS_PER_VIRA;

        setTimerViras(prev => {
          const next = prev - deltaViras;
          if (next <= 0) {
            setTimerRunning(false);
            setTimerFinished(true);
            chronoAudio.playShiftAlarm();
            return 0;
          }
          return next;
        });
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [timerRunning, timerViras]);

  const handleToggleAlwaysOnTop = async () => {
    if (isElectron && window.horocronoAPI?.toggleAlwaysOnTop) {
      const next = await window.horocronoAPI.toggleAlwaysOnTop();
      setIsAlwaysOnTop(next);
    } else {
      setIsAlwaysOnTop(!isAlwaysOnTop);
    }
  };

  const handleOpacityCycle = () => {
    const opacities = [1.0, 0.85, 0.70, 0.50, 0.35];
    const currentIndex = opacities.indexOf(opacity);
    const next = opacities[(currentIndex + 1) % opacities.length];
    setOpacity(next);
    if (isElectron && window.horocronoAPI?.setOpacity) {
      window.horocronoAPI.setOpacity(next);
    }
  };

  const handleToggleHum = () => {
    const active = chronoAudio.toggleReactorHum();
    setIsHumming(active);
  };

  const handleFocusMain = () => {
    if (isElectron && window.horocronoAPI?.focusMainWindow) {
      window.horocronoAPI.focusMainWindow();
    }
  };

  const handleMinimize = () => {
    if (isElectron && window.horocronoAPI?.minimizeWindow) {
      window.horocronoAPI.minimizeWindow();
    }
  };

  const handleClose = () => {
    if (isElectron && window.horocronoAPI?.closeWindow) {
      window.horocronoAPI.closeWindow();
    } else if (onClose) {
      onClose();
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    chronoAudio.setMuted(next);
  };

  // Stopwatch values
  const swSeconds = swElapsedMs / 1000;
  const swTotalViras = Math.floor(swSeconds / SECONDS_PER_VIRA);
  const swKromas = Math.floor(swTotalViras / VIRAS_PER_KROMA);
  const swFulas = Math.floor((swTotalViras % VIRAS_PER_KROMA) / VIRAS_PER_FULA);
  const swViras = swTotalViras % VIRAS_PER_FULA;

  // Timer values
  const timerKromas = Math.floor(timerViras / VIRAS_PER_KROMA);
  const timerFulas = Math.floor((timerViras % VIRAS_PER_KROMA) / VIRAS_PER_FULA);
  const timerVirasSub = Math.floor(timerViras % VIRAS_PER_FULA);
  const timerProgress = timerInitialViras > 0 ? (timerViras / timerInitialViras) : 0;

  // Active festivals & Zou phase
  const todayFestivals = getFestivalsForTala(chronosTime.nemaIndex, chronosTime.talaIndex);
  const currentZou = getCurrentZouPhase(chronosTime.nemaIndex, chronosTime.talaIndex);

  return (
    <div 
      className="w-full h-full min-h-[220px] rounded-2xl bg-neutral-950/95 border border-cyan-500/40 box-glow-cyan shadow-2xl flex flex-col justify-between overflow-hidden select-none transition-opacity duration-150 relative text-neutral-100"
      style={{ opacity: opacity }}
    >
      {/* Draggable High-Tech Titlebar */}
      <div 
        className="flex items-center justify-between px-3 py-2 bg-neutral-900/90 border-b border-white/10 cursor-move"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        {/* Title & Pin Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-display font-bold text-xs tracking-wider text-cyan-300 uppercase">
            HOROCRONO // HUD
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {isAlwaysOnTop ? 'PINNED' : 'FLOAT'}
          </span>
        </div>

        {/* Action Controls (Non-draggable) */}
        <div 
          className="flex items-center gap-1"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          {/* Always on top toggle */}
          <button
            onClick={handleToggleAlwaysOnTop}
            title={isAlwaysOnTop ? "Desanclar ventana (Always on Top Activo)" : "Fijar ventana siempre encima (Always on Top)"}
            className={`p-1 rounded transition-colors ${
              isAlwaysOnTop 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {isAlwaysOnTop ? <Pin className="w-3.5 h-3.5 fill-current" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>

          {/* Opacity Cycle Button */}
          <button
            onClick={handleOpacityCycle}
            title={`Opacidad actual: ${Math.round(opacity * 100)}% (Clic para cambiar)`}
            className="px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-400 hover:text-cyan-300 border border-neutral-800 hover:border-neutral-700 bg-neutral-900"
          >
            {Math.round(opacity * 100)}%
          </button>

          {/* Settings / Tool Drawer Button */}
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            title="Panel de Herramientas y Opciones del HUD"
            className={`p-1 rounded transition-colors ${
              showSettingsDrawer 
                ? 'bg-cyan-500 text-neutral-950 font-bold' 
                : 'text-neutral-400 hover:text-cyan-300'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Focus Main Horocrono App */}
          <button
            onClick={handleFocusMain}
            title="Traer al frente la ventana principal de Horocrono"
            className="p-1 rounded text-neutral-400 hover:text-cyan-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Window */}
          {isElectron && (
            <button
              onClick={handleMinimize}
              title="Minimizar"
              className="p-1 rounded text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Close Window */}
          <button
            onClick={handleClose}
            title="Cerrar Mini-HUD"
            className="p-1 rounded text-neutral-400 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TOOL / PREFERENCES DRAWER (Overlay when ⚙️ is clicked) */}
      {showSettingsDrawer ? (
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-neutral-950/95 animate-fade-in font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-cyan-300 uppercase flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span>Herramientas Activas en el HUD</span>
            </span>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[10px]"
            >
              Guardar y Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer">
              <span>Coordenada Canónica Completa</span>
              <input
                type="checkbox"
                checked={prefs.showMacroCoordinates}
                onChange={(e) => updatePref('showMacroCoordinates', e.target.checked)}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer">
              <span>Registro Binario (18-bit Bus)</span>
              <input
                type="checkbox"
                checked={prefs.showBinaryRegister}
                onChange={(e) => updatePref('showBinaryRegister', e.target.checked)}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer">
              <span>Mini-Cronómetro Binario</span>
              <input
                type="checkbox"
                checked={prefs.showStopwatch}
                onChange={(e) => updatePref('showStopwatch', e.target.checked)}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer">
              <span>Mini-Temporizador de Guardia</span>
              <input
                type="checkbox"
                checked={prefs.showTimer}
                onChange={(e) => updatePref('showTimer', e.target.checked)}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer">
              <span>Espectro Circadiano & Kroma 8</span>
              <input
                type="checkbox"
                checked={prefs.showCircadianSpectrum}
                onChange={(e) => updatePref('showCircadianSpectrum', e.target.checked)}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer">
              <span>Efeméride Canónica del Día</span>
              <input
                type="checkbox"
                checked={prefs.showFestivalAlert}
                onChange={(e) => updatePref('showFestivalAlert', e.target.checked)}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer">
              <span>Mantra & Fase Zou Transversal</span>
              <input
                type="checkbox"
                checked={prefs.showZouPhase}
                onChange={(e) => updatePref('showZouPhase', e.target.checked)}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800 cursor-pointer">
              <span>Hora Terrestre Dual (Español)</span>
              <input
                type="checkbox"
                checked={prefs.showEarthTime}
                onChange={(e) => updatePref('showEarthTime', e.target.checked)}
                className="accent-cyan-400"
              />
            </label>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
            <span>Las opciones quedan guardadas automáticamente en memoria.</span>
          </div>
        </div>
      ) : (
        /* MAIN HUD CONTENT DISPLAY */
        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 overflow-y-auto">
          {/* 1. Complete Macro Coordinate Badge (Requested by user!) */}
          {prefs.showMacroCoordinates && (
            <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[10px] font-mono">
              <span className="text-neutral-400">
                Era <strong className="text-cyan-400">{chronosTime.eraIndex}</strong> · Ko <strong className="text-cyan-400">{chronosTime.koraIndex}</strong> · Ne <strong className="text-cyan-400">{chronosTime.nemaIndex + 1}</strong> · Ta <strong className="text-cyan-400">{chronosTime.talaIndex + 1}</strong>
              </span>
              <span className="text-cyan-300 font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                {chronosTime.displayCode}
              </span>
            </div>
          )}

          {/* 2. Main Large Digital Clock & Vira Heartbeat */}
          <div className="text-center py-2.5 bg-neutral-900/80 rounded-xl border border-white/5 relative">
            <div className="flex items-center justify-between px-3 text-[10px] font-mono mb-1">
              <span className="font-bold text-cyan-400 uppercase tracking-wider">
                SEMA 0{chronosTime.sema} · {chronosTime.phase.name}
              </span>
              <span className="text-amber-400/90 font-medium flex items-center gap-1">
                <HeartPulse className="w-3 h-3 animate-pulse" />
                <span>1 Vi = 0.659s (1.517 Hz)</span>
              </span>
            </div>

            {/* Digits Display */}
            <div className="flex items-baseline justify-center gap-2.5 font-mono font-bold text-neutral-100">
              {/* Kroma */}
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl text-cyan-400 glow-cyan">
                  {String(chronosTime.kroma).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest">Kr</span>
              </div>

              <span className="text-xl text-neutral-600">:</span>

              {/* Fula */}
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl text-neutral-100">
                  {String(chronosTime.fula).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest">Fu</span>
              </div>

              <span className="text-xl text-neutral-600">:</span>

              {/* Vira */}
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl text-amber-400 glow-amber">
                  {String(chronosTime.vira).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest">Vi</span>
              </div>
            </div>

            {/* Organic Vira Sub-pulse Bar (0 to 659ms heartbeat) */}
            <div className="mt-2 px-6">
              <div className="w-full h-1 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)] transition-none"
                  style={{ width: `${chronosTime.viraProgress * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3. 18-bit Binary Register Bus */}
          {prefs.showBinaryRegister && (
            <div className="px-2.5 py-1.5 rounded-lg bg-neutral-950/90 border border-neutral-800 text-center font-mono">
              <div className="text-[9px] text-neutral-500 flex justify-between mb-0.5">
                <span>Bus Binario de 18 Bits</span>
                <span className="text-cyan-400">{chronosTime.totalVirasInTala.toLocaleString()} Vi</span>
              </div>
              <div className="text-xs tracking-widest text-neutral-200">
                <span className="text-sky-400">{chronosTime.binaryRegister.slice(0, 3)}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-cyan-400">{chronosTime.binaryRegister.slice(3, 7)}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-300">{chronosTime.binaryRegister.slice(7, 12)}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-amber-400 font-bold">{chronosTime.binaryRegister.slice(12, 18)}</span>
              </div>
            </div>
          )}

          {/* 4. Mini-Stopwatch Tool (Integrated in HUD) */}
          {prefs.showStopwatch && (
            <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-cyan-500/30 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                  <TimerIcon className="w-3 h-3" />
                  <span>Mini-Cronómetro</span>
                </span>
                <span className="text-neutral-500">{swSeconds.toFixed(1)} s</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-neutral-100">
                  {String(swKromas).padStart(2, '0')} Kr : {String(swFulas).padStart(2, '0')} Fu : {String(swViras).padStart(2, '0')} Vi
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSwRunning(!swRunning)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      swRunning ? 'bg-amber-500 text-neutral-950' : 'bg-cyan-500 text-neutral-950'
                    }`}
                  >
                    {swRunning ? 'Pausar' : 'Iniciar'}
                  </button>
                  <button
                    onClick={() => { setSwRunning(false); setSwElapsedMs(0); setSwLaps([]); }}
                    className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Mini-Timer Tool (Integrated in HUD) */}
          {prefs.showTimer && (
            <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-amber-500/30 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Hourglass className="w-3 h-3" />
                  <span>Temporizador de Guardia</span>
                </span>
                <span className="text-neutral-500">{(timerViras * SECONDS_PER_VIRA / 60).toFixed(1)} min</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-neutral-100">
                  {String(timerKromas).padStart(2, '0')} Kr : {String(timerFulas).padStart(2, '0')} Fu : {String(timerVirasSub).padStart(2, '0')} Vi
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (timerFinished) {
                        setTimerViras(timerInitialViras);
                        setTimerFinished(false);
                      }
                      setTimerRunning(!timerRunning);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      timerRunning ? 'bg-amber-500 text-neutral-950' : 'bg-cyan-500 text-neutral-950'
                    }`}
                  >
                    {timerRunning ? 'Pausa' : timerFinished ? 'Reset' : 'Start'}
                  </button>

                  {/* Presets: 1 Kr / 2 Kr */}
                  <button
                    onClick={() => { setTimerRunning(false); setTimerViras(2048); setTimerInitialViras(2048); setTimerFinished(false); }}
                    className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 hover:text-cyan-300"
                    title="1 Kroma (22.5 min)"
                  >
                    1 Kr
                  </button>
                  <button
                    onClick={() => { setTimerRunning(false); setTimerViras(4096); setTimerInitialViras(4096); setTimerFinished(false); }}
                    className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300 hover:text-cyan-300"
                    title="2 Kromas (45 min)"
                  >
                    2 Kr
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 rounded-full bg-neutral-950 overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-150"
                  style={{ width: `${timerProgress * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* 6. Active Station Festival of the Day */}
          {prefs.showFestivalAlert && todayFestivals.length > 0 && (
            <div className="p-2 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-between text-[10px] font-mono">
              <span className="text-amber-400 font-bold truncate max-w-[280px]">
                🎉 {todayFestivals[0].name}
              </span>
              <span className="text-neutral-500 shrink-0 capitalize">{todayFestivals[0].category}</span>
            </div>
          )}

          {/* 7. Zou Consciousness Mantra */}
          {prefs.showZouPhase && (
            <div className="p-2 rounded-lg bg-neutral-900 border border-amber-500/20 text-[10px] font-mono flex items-center gap-2">
              <span className="text-amber-400 font-bold text-sm">{currentZou.taelimSymbol}</span>
              <div className="truncate">
                <span className="text-neutral-400 block truncate">{currentZou.transversalName}: "{currentZou.mantra}"</span>
              </div>
            </div>
          )}

          {/* 8. Circadian Spectrum & Kroma 8 */}
          {prefs.showCircadianSpectrum && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>{chronosTime.phase.lightStatus}</span>
                <span className="text-cyan-400 font-bold">{chronosTime.talaElapsedFormatted.slice(0, 8)} / 48h</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  style={{ width: `${chronosTime.progressInTala * 100}%` }}
                />
              </div>

              {chronosTime.isKroma8Active && (
                <div className="mt-1.5 p-1 rounded bg-red-950/80 border border-red-500/60 text-red-200 text-[9px] font-mono flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3 h-3 text-red-400 shrink-0" />
                  <span>¡KROMA 8 ACTIVO! Silencio de soporte vital (42.2s).</span>
                </div>
              )}
            </div>
          )}

          {/* 9. Earth Time & Quick Control Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            {prefs.showEarthTime ? (
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px]">{earthTime.dateFormatted.split(',')[0]}</span>
                <span className="font-bold text-emerald-400">{earthTime.timeFormatted24}</span>
              </div>
            ) : <div />}

            <div className="flex items-center gap-1.5">
              {/* Reactor hum sound */}
              <button
                onClick={handleToggleHum}
                title={isHumming ? "Desactivar zumbido de nave" : "Activar zumbido de reactores"}
                className={`p-1 rounded text-[10px] border transition-colors ${
                  isHumming ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'text-neutral-500 border-neutral-800 hover:text-neutral-300'
                }`}
              >
                <Radio className={`w-3 h-3 ${isHumming ? 'animate-pulse text-cyan-400' : ''}`} />
              </button>

              {/* Tick Vi sound */}
              <button
                onClick={() => setTickAudio(!tickAudio)}
                title={tickAudio ? "Desactivar tic sonoro de Vira" : "Activar tic sonoro de Vira"}
                className={`p-1 rounded text-[10px] border transition-colors ${
                  tickAudio ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'text-neutral-500 border-neutral-800 hover:text-neutral-300'
                }`}
              >
                <HeartPulse className="w-3 h-3" />
              </button>

              {/* Mute toggle */}
              <button
                onClick={toggleMute}
                title={isMuted ? "Activar audio" : "Silenciar todo"}
                className={`p-1 rounded border transition-colors ${
                  isMuted ? 'text-red-400 border-red-500/30' : 'text-neutral-400 border-neutral-800 hover:text-cyan-300'
                }`}
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
