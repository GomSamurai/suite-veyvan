import React from 'react';
import Navigation from './components/Navigation';
import StatsDashboard from './components/StatsDashboard';
import GlossaryList from './components/GlossaryList';
import Constructor from './components/Constructor';
import Taelim from './components/Taelim';
import Translator from './components/Translator';
import CodexComposer from './components/CodexComposer';
import VeyvanAcademy from './components/VeyvanAcademy';
import CalligramStudio from './components/CalligramStudio';
import LoreAtlas from './components/LoreAtlas';
import { useLexicon } from './context/LexiconContext';
import HorocronoRoot from './components/horocrono/HorocronoRoot';
import { ThaliosAudioHUD } from './components/ThaliosAudioHUD';
import { ThaliosVoiceSettingsModal } from './components/ThaliosVoiceSettingsModal';
import MatrixCompositorStudio from './components/matrix-compositor/MatrixCompositorStudio';

class SafeBoundary extends React.Component<{ children: React.ReactNode; name: string }, { hasError: boolean; error: string }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error?.message || 'Error desconocido' };
  }
  componentDidCatch(error: any, info: any) {
    console.error('Disonancia en componente:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 border border-amber-500/30 bg-amber-950/20 rounded-3xl text-amber-200 font-mono text-sm max-w-xl mx-auto my-12 space-y-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 font-bold text-base text-amber-400">
            <span>⚠ Disonancia en {this.props.name}</span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">{this.state.error}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: '' })}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs uppercase cursor-pointer transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            Reintentar Inicialización
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  // Enrutamiento directo e integrado para Horocrono y Mini-HUD (Nativo / Popout)
  const isHorocronoMode = typeof window !== 'undefined' && (
    window.location.search.includes('view=horocrono') || 
    window.location.hash.includes('horocrono') ||
    window.location.search.includes('view=minihud') || 
    window.location.hash.includes('minihud')
  );

  if (isHorocronoMode) {
    return <HorocronoRoot />;
  }

  const {
    activeTab,
    setActiveTab,
    terms,
    presets,
    isLoading,
    addTerm,
    updateTerm,
    handleSavePreset,
    handleDeletePreset,
    handleExport,
    handleImport,
    traceInTaelim
  } = useLexicon();

  // Gestión de Calibración de Voz y Síntesis de Thalios Solaris
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = React.useState(false);

  // Gestión de Modo Solar (Claro) / Modo Vacío (Oscuro)
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('suite_veyvan_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('suite_veyvan_theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('suite_veyvan_theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-cyan-400 gap-4">
        <div className="w-12 h-12 border border-cyan-500/30 border-t-cyan-400 rounded-none animate-spin"></div>
        <p className="animate-pulse font-mono uppercase tracking-widest text-xs">Inicializando Protocolos...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-transparent text-slate-300 dark:text-slate-300 light:text-slate-800 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden flex flex-row">
      {/* Barra Lateral Dinámica y Coherente */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExport={handleExport}
        onImport={handleImport}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenVoiceSettings={() => setIsVoiceSettingsOpen(true)}
      />
      
      {/* Columna Principal de Trabajo & Vistas */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden relative">
        <main className={`flex-1 w-full relative custom-scrollbar z-10 ${activeTab === 'matrixCompositor' ? 'p-1.5 sm:p-2 overflow-hidden flex flex-col' : 'overflow-y-auto py-4 sm:py-6 px-3 sm:px-8'}`}>
          <div className={activeTab === 'glossary' ? 'block animate-fade-in' : 'hidden'}>
            <GlossaryList terms={terms} onUpdateTerm={updateTerm} />
          </div>

          <div className={activeTab === 'translator' ? 'block animate-fade-in' : 'hidden'}>
            <Translator />
          </div>
          
          <div className={activeTab === 'taelim' ? 'block h-full animate-fade-in' : 'hidden'}>
             <Taelim 
               terms={terms} 
               customPresets={presets}
               onSavePreset={handleSavePreset}
               onDeletePreset={handleDeletePreset}
               onImportSession={handleImport}
             />
          </div>

          <div className={activeTab === 'matrixCompositor' ? 'block h-full flex-1 min-h-0 animate-fade-in' : 'hidden'}>
            {activeTab === 'matrixCompositor' && (
              <SafeBoundary name="Compositor de Matrices Tael'im">
                <MatrixCompositorStudio />
              </SafeBoundary>
            )}
          </div>

          <div className={activeTab === 'calligram' ? 'block animate-fade-in' : 'hidden'}>
            {activeTab === 'calligram' && (
              <SafeBoundary name="Caligramas (Tael'vohn)">
                <CalligramStudio />
              </SafeBoundary>
            )}
          </div>

          <div className={activeTab === 'lore' ? 'block animate-fade-in' : 'hidden'}>
            {activeTab === 'lore' && (
              <SafeBoundary name="Atlas de Estación Humanidad (Lore)">
                <LoreAtlas />
              </SafeBoundary>
            )}
          </div>

          <div className={activeTab === 'codex' ? 'block animate-fade-in' : 'hidden'}>
            {activeTab === 'codex' && <CodexComposer terms={terms} onTraceInTaelim={traceInTaelim} />}
          </div>

          <div className={activeTab === 'academy' ? 'block animate-fade-in' : 'hidden'}>
            {activeTab === 'academy' && <VeyvanAcademy terms={terms} />}
          </div>

          <div className={activeTab === 'constructor' ? 'block animate-fade-in' : 'hidden'}>
            <SafeBoundary name="Forja de Radicales">
              <Constructor onAddTerm={addTerm} existingTerms={terms} />
            </SafeBoundary>
          </div>

          <div className={activeTab === 'stats' ? 'block animate-fade-in' : 'hidden'}>
            {activeTab === 'stats' && <StatsDashboard terms={terms} />}
          </div>
        </main>

        <footer className="relative z-20 flex justify-between items-center px-6 py-2.5 text-slate-500 text-[10px] uppercase tracking-widest bg-black/40 dark:bg-black/40 light:bg-slate-100/90 backdrop-blur-md border-t border-white/5 dark:border-white/5 light:border-slate-200 flex-shrink-0">
          <p>Sistema Operativo Transversal // Protocolo Thalios Solaris 4.0 // Estación Humanidad</p>
          <div className="flex gap-2">
              <span className="text-cyan-400 font-mono tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">● 412 RADICALES CANÓNICOS</span>
              <span className="text-emerald-500 opacity-80 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)] ml-4">● SINTAXIS VOS ACTIVA</span>
          </div>
        </footer>
      </div>

      {/* Mini-HUD Flotante de Audio y Espectrograma de Thalios Solaris */}
      <ThaliosAudioHUD onOpenSettings={() => setIsVoiceSettingsOpen(true)} />

      {/* Modal de Configuración Integral del Núcleo de Voz */}
      <ThaliosVoiceSettingsModal 
        isOpen={isVoiceSettingsOpen} 
        onClose={() => setIsVoiceSettingsOpen(false)} 
      />
    </div>
  );
};

export default App;