import React, { useState, useEffect, useRef } from 'react';
import { 
  calculateChronosTime, 
  calculateEarthTime 
} from './utils/chronosystemMath';
import { chronoAudio } from './utils/audioEngine';
import { ChronosTime, EarthTime } from './types/chronos';
import { Header, ActiveTab } from './components/Header';
import { DualClock } from './components/DualClock';
import { CircadianBar } from './components/CircadianBar';
import { Chronometer } from './components/Chronometer';
import { ShiftTimer } from './components/ShiftTimer';
import { TimeConverter } from './components/TimeConverter';
import { BiologicalAgeCalculator } from './components/BiologicalAgeCalculator';
import { ChronoCodex } from './components/ChronoCodex';
import { TransversalCalendar } from './components/TransversalCalendar';
import { MiniHudWidget } from './components/MiniHudWidget';
import { MiniHudPlugin } from './components/MiniHudPlugin';
import { Shield, Sparkles } from 'lucide-react';

interface HorocronoRootProps {
  onClose?: () => void;
}

export const HorocronoRoot: React.FC<HorocronoRootProps> = ({ onClose }) => {
  const isDedicatedMiniHud = typeof window !== 'undefined' && (
    window.location.search.includes('view=minihud') || 
    window.location.hash.includes('minihud')
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('clock');
  const [isMiniHud, setIsMiniHud] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHumming, setIsHumming] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);
  const [epochOffsetSeconds, setEpochOffsetSeconds] = useState<number>(0);

  const [chronosTime, setChronosTime] = useState<ChronosTime>(() => calculateChronosTime(new Date(), 0));
  const [earthTime, setEarthTime] = useState<EarthTime>(() => calculateEarthTime(new Date()));

  const lastKroma8AlertRef = useRef<boolean>(false);

  // High-precision organic clock loop (25ms frequency = 40Hz)
  // Ensures every single Vira (0.65918s) is captured at its exact microsecond transition
  useEffect(() => {
    let lastEarthSec = -1;

    const interval = setInterval(() => {
      const now = new Date();
      const currentChrono = calculateChronosTime(now, epochOffsetSeconds);
      setChronosTime(currentChrono);

      // Earth civil time only needs string recalculation when second changes
      const currentSec = now.getSeconds();
      if (currentSec !== lastEarthSec) {
        lastEarthSec = currentSec;
        setEarthTime(calculateEarthTime(now));
      }

      // Trigger Kroma 8 warning chime once when transitioning into Kroma 8
      if (currentChrono.isKroma8Active && !lastKroma8AlertRef.current) {
        lastKroma8AlertRef.current = true;
        chronoAudio.playKroma8Warning();
      } else if (!currentChrono.isKroma8Active && lastKroma8AlertRef.current) {
        lastKroma8AlertRef.current = false;
      }
    }, 25);

    return () => clearInterval(interval);
  }, [epochOffsetSeconds]);

  // Dedicated Floating Mini-HUD Window (Electron or Popout)
  if (isDedicatedMiniHud) {
    return (
      <div className="w-screen h-screen p-2 bg-transparent select-none overflow-hidden">
        <MiniHudPlugin
          chronosTime={chronosTime}
          earthTime={earthTime}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />
      </div>
    );
  }

  // In-app Mini-HUD view fallback
  if (isMiniHud) {
    return (
      <div className="min-h-screen bg-[#07090e] scanline-bg station-grid flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <MiniHudPlugin
            chronosTime={chronosTime}
            earthTime={earthTime}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onClose={() => setIsMiniHud(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] scanline-bg station-grid flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMiniHud={isMiniHud}
        setIsMiniHud={setIsMiniHud}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isHumming={isHumming}
        setIsHumming={setIsHumming}
        volume={volume}
        setVolume={setVolume}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        {/* Circadian Deck Lighting Bar (Always present in top for immersion) */}
        <CircadianBar chronosTime={chronosTime} />

        {/* Tab Content */}
        {activeTab === 'clock' && (
          <DualClock chronosTime={chronosTime} earthTime={earthTime} />
        )}

        {activeTab === 'chrono' && (
          <Chronometer />
        )}

        {activeTab === 'timer' && (
          <ShiftTimer />
        )}

        {activeTab === 'calendar' && (
          <TransversalCalendar chronosTime={chronosTime} earthTime={earthTime} />
        )}

        {activeTab === 'converter' && (
          <TimeConverter />
        )}

        {activeTab === 'age' && (
          <BiologicalAgeCalculator />
        )}

        {activeTab === 'codex' && (
          <ChronoCodex />
        )}
      </main>

      {/* Futuristic Footer */}
      <footer className="border-t border-white/10 bg-neutral-950/90 backdrop-blur-md py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>HOROCRONO // PROTOCOLO TEMPORAL THALIOS SOLARIS</span>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-400">NTU-01 ESTACIÓN HUMANIDAD</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-neutral-400">
              1 Vira = <strong className="text-cyan-400">0.65918s</strong> · 1 Tala = <strong className="text-cyan-400">48h</strong>
            </span>
            <span className="text-neutral-700">|</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Sincronía Nominal
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default HorocronoRoot;
