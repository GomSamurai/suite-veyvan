import React from 'react';
import { 
  Clock, 
  Timer, 
  Hourglass, 
  ArrowLeftRight, 
  Dna, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Radio, 
  Maximize2,
  Sliders,
  Calendar
} from 'lucide-react';
import { chronoAudio } from '../utils/audioEngine';

export type ActiveTab = 'clock' | 'chrono' | 'timer' | 'calendar' | 'converter' | 'age' | 'codex';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMiniHud: boolean;
  setIsMiniHud: (val: boolean) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  isHumming: boolean;
  setIsHumming: (val: boolean) => void;
  volume: number;
  setVolume: (val: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMiniHud,
  setIsMiniHud,
  isMuted,
  setIsMuted,
  isHumming,
  setIsHumming,
  volume,
  setVolume
}) => {
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    chronoAudio.setMuted(next);
  };

  const toggleHum = () => {
    const active = chronoAudio.toggleReactorHum();
    setIsHumming(active);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    chronoAudio.setVolume(val);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'clock', label: 'Horologio Dual', icon: Clock },
    { id: 'chrono', label: 'Cronómetro Binario', icon: Timer },
    { id: 'timer', label: 'Temporizador de Turno', icon: Hourglass },
    { id: 'calendar', label: 'Calendario & Zou', icon: Calendar },
    { id: 'converter', label: 'Conversor Universal', icon: ArrowLeftRight },
    { id: 'age', label: 'Edad Biológica (Nemas)', icon: Dna },
    { id: 'codex', label: 'Códice del Cronosistema', icon: BookOpen }
  ];

  return (
    <header className="border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Logo & Ship Protocol */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg md:text-xl tracking-wider text-neutral-100 uppercase">
                  HOROCRONO
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  NTU-01
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  STANDALONE
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Cronosistema Canónico // Estación Humanidad · Ciclo Tala (48h)
              </p>
            </div>
          </div>

          {/* Quick Sound & HUD Controls */}
          <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto">
            {/* Reactor Hum Toggle */}
            <button
              onClick={toggleHum}
              title={isHumming ? "Desactivar Zumbido de Reactores de Nave" : "Activar Zumbido Ambiental de Nave"}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                isHumming
                  ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isHumming ? 'animate-pulse text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">Reactor Hum</span>
            </button>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? "Activar Sonido Diegético" : "Silenciar Sonido"}
              className={`p-2 rounded-lg border transition-all ${
                isMuted
                  ? 'bg-red-950/40 border-red-500/40 text-red-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-cyan-400'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Volume slider */}
            {!isMuted && (
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-neutral-900 rounded-lg border border-neutral-800">
                <Sliders className="w-3 h-3 text-neutral-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer"
                  title="Volumen del Sistema"
                />
              </div>
            )}

            {/* Mini HUD Independent Plugin Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.horocronoAPI?.openMiniHud) {
                  window.horocronoAPI.openMiniHud();
                } else {
                  const popup = window.open('?view=minihud#minihud', 'HorocronoMiniHud', 'width=480,height=380,resizable=yes');
                  if (!popup) {
                    setIsMiniHud(!isMiniHud);
                  }
                }
              }}
              title="Abrir Plugin Independiente Mini-HUD (Ventana Flotante Always on Top)"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mini-HUD Flotante</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pt-3 pb-0.5 mt-2 scrollbar-none border-t border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
