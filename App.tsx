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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-cyan-400 gap-4">
        <div className="w-12 h-12 border border-cyan-500/30 border-t-cyan-400 rounded-none animate-spin"></div>
        <p className="animate-pulse font-mono uppercase tracking-widest text-xs">Inicializando Protocolos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden flex flex-col">
      <div className="animate-fade-in">
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onExport={handleExport}
          onImport={handleImport}
        />
      </div>
      
      {/* 
        Main content wrapper with overflow-auto. 
        Using display:none preserves component state when switching tabs.
      */}
      <main className="flex-1 overflow-y-auto container mx-auto py-8 px-4 relative custom-scrollbar z-10">
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
          <Constructor onAddTerm={addTerm} />
        </div>

        <div className={activeTab === 'stats' ? 'block animate-fade-in' : 'hidden'}>
          {activeTab === 'stats' && <StatsDashboard terms={terms} />}
        </div>
      </main>

      <footer className="relative z-20 flex justify-between items-center px-6 py-3 text-slate-500 text-[10px] uppercase tracking-widest bg-black/40 backdrop-blur-md border-t border-white/5">
        <p>Sistema Operativo Transversal // Protocolo Thalios Solaris 4.0 // Estación Humanidad</p>
        <div className="flex gap-2">
            <span className="text-cyan-400 font-mono tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">● 412 RADICALES CANÓNICOS</span>
            <span className="text-emerald-500 opacity-80 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)] ml-4">● SINTAXIS VOS ACTIVA</span>
        </div>
      </footer>
    </div>
  );
};

export default App;