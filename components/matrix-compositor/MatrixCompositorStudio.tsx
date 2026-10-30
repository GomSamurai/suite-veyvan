import React, { useState, useEffect, useRef } from 'react';
import { 
  PatternType, 
  MatrixNode, 
  MatrixParameters, 
  GuidesConfig, 
  WordTraceConfig, 
  MatrixProject 
} from './types/matrix';
import { 
  createInitialNodes, 
  generateRawPatternPoints, 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  CENTER_X, 
  CENTER_Y 
} from './utils/matrixMath';
import { PATTERN_NAMES } from './constants/presets';
import { playMatrixArpeggio, playPhonemeTone, playSoftClick } from './utils/audioEngine';
import { StudioToolbar } from './StudioToolbar';
import { PatternSelector } from './PatternSelector';
import { ParametricControls } from './ParametricControls';
import { AutoAlignPanel } from './AutoAlignPanel';
import { GuidesPanel } from './GuidesPanel';
import { CanvasStage } from './CanvasStage';
import { NodeInspector } from './NodeInspector';
import { PhonemePalette } from './PhonemePalette';
import { WordTraceComposer } from './WordTraceComposer';
import { ProjectsVaultModal } from './ProjectsVaultModal';
import { 
  RotateCcw, 
  RotateCw, 
  Crosshair, 
  FlipHorizontal, 
  Shuffle, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const DEFAULT_PARAMS: MatrixParameters = {
  scale: 1.0,
  rotation: 0,
  spacing: 1.0,
  angle: 137.5,
  radius: 220,
  divisions: 24,
  nodeSize: 13,
  waveFreq: 4,
  waveAmp: 80,
};


const DEFAULT_GUIDES: GuidesConfig = {
  snap: true,
  snapStep: 25,
  snapModes: {
    grid: true,
    hexGrid: false,
    axes: true,
    goldenRatio: true,
    circles: true,
    fibonacci: true,
    slots: true,
    interNode: true,
  },
  gridVisible: false,
  hexGridVisible: false,
  hexGridSize: 50,
  axes: true,
  concentricCircles: true,
  goldenRatio: true,
  goldenRatioOrientation: 'horizontal',
  goldenRatioAngle: 0,
  goldenRatioScale: 1.0,
  goldenRatioSubdivisions: true,
  fibonacciSpiral: true,
  fibonacciConfig: {
    scale: 1.0,
    rotation: 0,
    turns: 2.5,
    direction: 'clockwise',
  },
  flowerOfLife: false,
  letterLabels: true,
  indices: false,
  sequentialConnections: false,
  connectionStyle: 'glow',
};

export function mergeGuidesSafe(g?: Partial<GuidesConfig>): GuidesConfig {
  return {
    ...DEFAULT_GUIDES,
    ...(g || {}),
    snapModes: {
      ...DEFAULT_GUIDES.snapModes,
      ...(g?.snapModes || {}),
    },
    fibonacciConfig: {
      ...DEFAULT_GUIDES.fibonacciConfig,
      ...(g?.fibonacciConfig || {}),
    },
  };
}



const DEFAULT_WORD_TRACE: WordTraceConfig = {
  word: 'KAEL',
  enabled: true,
  color: '#e9c47e',
  strokeWidth: 3.5,
  showGlow: true,
  closed: false,
  pressureMode: 'uniform',
  pressureIntensity: 1.0,
  nibAngle: 45,
};

export const MatrixCompositorStudio: React.FC = () => {
  const [pattern, setPattern] = useState<PatternType>('grid64');
  const [parameters, setParameters] = useState<MatrixParameters>(DEFAULT_PARAMS);
  const [guides, setGuides] = useState<GuidesConfig>(DEFAULT_GUIDES);
  const [wordTrace, setWordTrace] = useState<WordTraceConfig>(DEFAULT_WORD_TRACE);
  const [nodes, setNodes] = useState<MatrixNode[]>(() =>
    createInitialNodes('grid64', DEFAULT_PARAMS)
  );
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Resizable Sidebars Widths with persistence
  const [leftWidth, setLeftWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('taelim_left_panel_width');
      return saved ? Math.max(260, Math.min(560, Number(saved))) : 320;
    } catch {
      return 320;
    }
  });

  const [rightWidth, setRightWidth] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('taelim_right_panel_width');
      return saved ? Math.max(280, Math.min(600, Number(saved))) : 360;
    } catch {
      return 360;
    }
  });

  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);

  // Collapse states for side panels
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Pointer drag resizing for sidebars
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.max(260, Math.min(560, e.clientX));
        setLeftWidth(newWidth);
      } else if (isResizingRight) {
        const newWidth = Math.max(280, Math.min(600, window.innerWidth - e.clientX));
        setRightWidth(newWidth);
      }
    };

    const handlePointerUp = () => {
      if (isResizingLeft) {
        setIsResizingLeft(false);
        try { localStorage.setItem('taelim_left_panel_width', String(leftWidth)); } catch {}
      }
      if (isResizingRight) {
        setIsResizingRight(false);
        try { localStorage.setItem('taelim_right_panel_width', String(rightWidth)); } catch {}
      }
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingLeft, isResizingRight, leftWidth, rightWidth]);

  const saveHistorySnapshot = () => {
    const snap = JSON.stringify({ pattern, parameters, guides, wordTrace, nodes });
    setHistory(prev => [...prev.slice(-30), snap]);
    setFuture([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const current = JSON.stringify({ pattern, parameters, guides, wordTrace, nodes });
    setFuture(prev => [current, ...prev]);

    const prevSnap = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));

    try {
      const parsed = JSON.parse(prevSnap);
      setPattern(parsed.pattern);
      setParameters(parsed.parameters);
      setGuides(mergeGuidesSafe(parsed.guides));
      setWordTrace(parsed.wordTrace);
      setNodes(parsed.nodes);
      showToast('Deshecho');
    } catch (e) {}
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const nextSnap = future[0];
    setFuture(prev => prev.slice(1));

    const current = JSON.stringify({ pattern, parameters, guides, wordTrace, nodes });
    setHistory(prev => [...prev, current]);

    try {
      const parsed = JSON.parse(nextSnap);
      setPattern(parsed.pattern);
      setParameters(parsed.parameters);
      setGuides(mergeGuidesSafe(parsed.guides));
      setWordTrace(parsed.wordTrace);
      setNodes(parsed.nodes);
      showToast('Rehecho');
    } catch (e) {}
  };

  // Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, future, pattern, parameters, guides, wordTrace, nodes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2200);
  };

  const handleSelectPattern = (newPattern: PatternType) => {
    saveHistorySnapshot();
    setPattern(newPattern);
    const newNodes = createInitialNodes(newPattern, parameters, nodes);
    setNodes(newNodes);

    // Auto-harmonize golden ratio frame orientation based on selected pattern
    if (newPattern === 'grid46' || newPattern === 'goldenGridVertical') {
      setGuides(prev => ({
        ...prev,
        goldenRatioOrientation: 'vertical',
        goldenRatioAngle: 0
      }));
    } else if (newPattern === 'grid64' || newPattern === 'goldenGrid') {
      setGuides(prev => ({
        ...prev,
        goldenRatioOrientation: 'horizontal',
        goldenRatioAngle: 0
      }));
    }

    showToast(`Patrón "${PATTERN_NAMES[newPattern]}" activado`);
  };

  const handleParamChange = (updated: Partial<MatrixParameters>) => {
    const newParams = { ...parameters, ...updated };
    setParameters(newParams);

    if (pattern !== 'custom') {
      const newNodes = createInitialNodes(pattern, newParams, nodes);
      setNodes(newNodes);
    }
  };

  const handleResetParams = () => {
    saveHistorySnapshot();
    setParameters(DEFAULT_PARAMS);
    const newNodes = createInitialNodes(pattern, DEFAULT_PARAMS, nodes);
    setNodes(newNodes);
    showToast('Parámetros restaurados');
  };

  const handleUpdateNodePos = (index: number, x: number, y: number) => {
    setNodes(prev => {
      const clone = [...prev];
      if (clone[index] && !clone[index].locked) {
        clone[index] = { ...clone[index], x, y };
      }
      return clone;
    });
    if (pattern !== 'custom') {
      setPattern('custom');
    }
  };

  const handleToggleLockNode = (index: number) => {
    saveHistorySnapshot();
    setNodes(prev => {
      const clone = [...prev];
      if (clone[index]) {
        clone[index] = { ...clone[index], locked: !clone[index].locked };
      }
      return clone;
    });
    showToast(nodes[index]?.locked ? 'Nodo desbloqueado' : 'Nodo bloqueado');
  };

  // Swapping two phonemes between matrix slots via right-click
  const handleSwapNodes = (idxA: number, idxB: number) => {
    if (idxA === idxB || idxA < 0 || idxB < 0 || idxA >= nodes.length || idxB >= nodes.length) return;

    const nodeA = nodes[idxA];
    const nodeB = nodes[idxB];

    if (nodeA.locked || nodeB.locked) {
      showToast('No se puede permutar: uno de los nodos está bloqueado');
      return;
    }

    saveHistorySnapshot();

    const letterA = nodeA.letter;
    const letterB = nodeB.letter;

    setNodes(prev => {
      const clone = [...prev];
      clone[idxA] = { ...clone[idxA], letter: letterB };
      clone[idxB] = { ...clone[idxB], letter: letterA };
      return clone;
    });

    playPhonemeTone(letterB, 0.15);
    setTimeout(() => playPhonemeTone(letterA, 0.22), 90);

    setSelectedNodeIndex(idxB);
    showToast(`Fonema permutado: [${letterA.toUpperCase()}] ⇄ [${letterB.toUpperCase()}]`);
  };

  // Auto-alignment apply callback
  const handleApplyAutoAlignedNodes = (newNodes: MatrixNode[], desc: string) => {
    saveHistorySnapshot();
    setNodes(newNodes);
    setPattern('custom');
    showToast(desc);
  };

  // Mass Operations
  const handleCenterGroup = () => {
    saveHistorySnapshot();
    const cx = CENTER_X;
    const cy = CENTER_Y;
    const avgX = nodes.reduce((acc, n) => acc + n.x, 0) / 24;
    const avgY = nodes.reduce((acc, n) => acc + n.y, 0) / 24;
    const offsetX = cx - avgX;
    const offsetY = cy - avgY;

    setNodes(prev =>
      prev.map(n => (n.locked ? n : { ...n, x: n.x + offsetX, y: n.y + offsetY }))
    );
    setPattern('custom');
    showToast('Centro baricéntrico alineado');
  };

  const handleMirrorX = () => {
    saveHistorySnapshot();
    const cx = CENTER_X;
    setNodes(prev =>
      prev.map(n => (n.locked ? n : { ...n, x: 2 * cx - n.x }))
    );
    setPattern('custom');
    showToast('Reflejado horizontalmente (Eje X)');
  };

  const handleShuffleLetters = () => {
    saveHistorySnapshot();
    const letters = nodes.map(n => n.letter);
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    setNodes(prev => prev.map((n, i) => (n.locked ? n : { ...n, letter: letters[i] })));
    showToast('Fonemas permutados');
  };

  const handlePlayWordSound = (word: string) => {
    const letters = word.toLowerCase().replace(/[^a-z]/g, '').split('');
    letters.forEach((char, idx) => {
      setTimeout(() => {
        playPhonemeTone(char, 0.22);
      }, idx * 180);
    });
  };

  // Build current project object for export/saving
  const currentProject: MatrixProject = {
    id: 'current-composition',
    name: PATTERN_NAMES[pattern] || 'Matriz Tael\'im',
    createdAt: new Date().toISOString(),
    pattern,
    parameters,
    guides,
    nodes,
    wordTrace,
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#05080e] text-slate-100 overflow-hidden font-sans rounded-xl border border-white/10 shadow-2xl relative">
      {/* 1. TOP STUDIO TOOLBAR */}
      <StudioToolbar
        patternName={PATTERN_NAMES[pattern]}
        nodeCount={nodes.length}
        zoom={zoom}
        onZoomIn={() => setZoom(z => Math.min(2.5, z + 0.1))}
        onZoomOut={() => setZoom(z => Math.max(0.4, z - 0.1))}
        onResetZoom={() => setZoom(1.0)}
        onOpenVault={() => setIsVaultOpen(true)}
        onPlayArpeggio={() => playMatrixArpeggio(nodes)}
      />

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <main className="flex-1 flex min-h-0 relative overflow-hidden">
        
        {/* LEFT COLUMN: PATTERNS, PARAMS, AUTO-ALIGN & GUIDES */}
        <aside
          style={{ width: isLeftCollapsed ? 0 : leftWidth }}
          className={`h-full border-r border-[#1e2c3e] bg-[#080d16]/95 backdrop-blur flex flex-col z-20 transition-[opacity] duration-150 flex-shrink-0 relative ${
            isLeftCollapsed ? 'opacity-0 overflow-hidden border-none pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="p-4 border-b border-[#1f2e42] flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>01 · Geometría & Patrones</span>
            </h2>
            <button
              onClick={() => setIsLeftCollapsed(true)}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
              title="Colapsar panel izquierdo"
            >
              <ChevronLeft size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Pattern Selector */}
            <PatternSelector
              activePattern={pattern}
              onSelectPattern={handleSelectPattern}
            />

            {/* Parametric Controls */}
            <div className="pt-4 border-t border-slate-800/80">
              <ParametricControls
                params={parameters}
                pattern={pattern}
                onChange={handleParamChange}
                onReset={handleResetParams}
              />
            </div>

            {/* Auto-Alignment & Grid Snapping Panel */}
            <div className="pt-4 border-t border-slate-800/80">
              <AutoAlignPanel
                nodes={nodes}
                activePattern={pattern}
                params={parameters}
                guides={guides}
                onApplyNewNodes={handleApplyAutoAlignedNodes}
              />
            </div>

            {/* Guides Panel with Golden Ratio Frame Orientation Controls */}
            <div className="pt-4 border-t border-slate-800/80">
              <GuidesPanel
                guides={guides}
                onChange={updated => setGuides(prev => ({ ...prev, ...updated }))}
              />
            </div>

            {/* Mass Transform Actions */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-1">
                Operaciones Masivas
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={handleCenterGroup}
                  className="p-2 bg-[#0a121e] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Crosshair size={13} />
                  <span>Centrar</span>
                </button>
                <button
                  onClick={handleMirrorX}
                  className="p-2 bg-[#0a121e] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FlipHorizontal size={13} />
                  <span>Reflejar X</span>
                </button>
                <button
                  onClick={handleShuffleLetters}
                  className="p-2 bg-[#0a121e] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Shuffle size={13} />
                  <span>Mezclar</span>
                </button>
                <button
                  onClick={() => handleSelectPattern(pattern)}
                  className="p-2 bg-[#0a121e] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Restaurar</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Resizer Splitter Handle (Left Sidebar) */}
        {!isLeftCollapsed && (
          <div
            onPointerDown={e => {
              e.preventDefault();
              setIsResizingLeft(true);
            }}
            className="w-1.5 hover:w-2 -ml-0.5 z-30 cursor-col-resize h-full group flex items-center justify-center transition-all bg-[#0a111a] hover:bg-cyan-500/40 select-none flex-shrink-0"
            title="Arrastra para reescalar panel izquierdo"
          >
            <div className="w-0.5 h-8 bg-slate-600 group-hover:bg-cyan-400 rounded-full transition-colors" />
          </div>
        )}

        {/* Expand Left Button when collapsed */}
        {isLeftCollapsed && (
          <button
            onClick={() => setIsLeftCollapsed(false)}
            className="absolute left-2 top-3 z-30 p-2 bg-[#080d16] border border-slate-700 rounded text-slate-300 hover:text-white shadow-lg cursor-pointer"
            title="Expandir panel izquierdo"
          >
            <ChevronRight size={14} />
          </button>
        )}

        {/* CENTER COLUMN: CANVAS STAGE */}
        <section className="flex-1 h-full flex flex-col min-w-0 bg-[#060a12] relative overflow-hidden">
          
          {/* Quick Actions Bar at top of stage */}
          <div className="h-10 bg-[#080d16]/80 border-b border-[#1c293a] px-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Lienzo Vectorial /
              </span>
              <strong className="text-xs font-mono text-cyan-300 uppercase">
                {PATTERN_NAMES[pattern]}
              </strong>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-slate-300 rounded text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                title="Deshacer (Ctrl+Z)"
              >
                <RotateCcw size={11} />
                <span>Deshacer</span>
              </button>
              <button
                onClick={handleRedo}
                disabled={future.length === 0}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-slate-300 rounded text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                title="Rehacer (Ctrl+Y)"
              >
                <RotateCw size={11} />
                <span>Rehacer</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="flex-1 w-full h-full relative">
            <CanvasStage
              nodes={nodes}
              selectedNodeIndex={selectedNodeIndex}
              guides={guides}
              wordTrace={wordTrace}
              nodeSize={parameters.nodeSize}
              zoom={zoom}
              activePattern={pattern}
              params={parameters}
              onSelectNode={idx => setSelectedNodeIndex(idx)}
              onSwapNodes={handleSwapNodes}
              onUpdateNodePos={handleUpdateNodePos}
              onDragEnd={saveHistorySnapshot}
              onShowToast={showToast}
            />

            {/* Toast Alert Notification */}
            {toastMessage && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-fade-in pointer-events-none z-40">
                {toastMessage}
              </div>
            )}
          </div>

          {/* Stage Bottom Status Strip */}
          <div className="h-8 bg-[#080d16] border-t border-[#1c293a] px-4 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span>● <span className="text-amber-300">Dorado</span> = Libre</span>
              <span>● <span className="text-cyan-300">Cian</span> = Seleccionado</span>
              <span>● <span className="text-purple-300">Púrpura</span> = Bloqueado</span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:inline text-cyan-300">Click Der en nodo = Permutar posición</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-500">
              <span>Mantén <kbd className="px-1 bg-slate-800 text-slate-300 rounded">Shift</kbd> para ignorar snap</span>
            </div>
          </div>
        </section>

        {/* Resizer Splitter Handle (Right Sidebar) */}
        {!isRightCollapsed && (
          <div
            onPointerDown={e => {
              e.preventDefault();
              setIsResizingRight(true);
            }}
            className="w-1.5 hover:w-2 -mr-0.5 z-30 cursor-col-resize h-full group flex items-center justify-center transition-all bg-[#0a111a] hover:bg-cyan-500/40 select-none flex-shrink-0"
            title="Arrastra para reescalar panel derecho"
          >
            <div className="w-0.5 h-8 bg-slate-600 group-hover:bg-cyan-400 rounded-full transition-colors" />
          </div>
        )}

        {/* Expand Right Button when collapsed */}
        {isRightCollapsed && (
          <button
            onClick={() => setIsRightCollapsed(false)}
            className="absolute right-2 top-3 z-30 p-2 bg-[#080d16] border border-slate-700 rounded text-slate-300 hover:text-white shadow-lg cursor-pointer"
            title="Expandir panel derecho"
          >
            <ChevronLeft size={14} />
          </button>
        )}

        {/* RIGHT COLUMN: INSPECTOR, PALETTE & WORD TRACE */}
        <aside
          style={{ width: isRightCollapsed ? 0 : rightWidth }}
          className={`h-full border-l border-[#1e2c3e] bg-[#080d16]/95 backdrop-blur flex flex-col z-20 transition-[opacity] duration-150 flex-shrink-0 relative ${
            isRightCollapsed ? 'opacity-0 overflow-hidden border-none pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="p-4 border-b border-[#1f2e42] flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>02 · Inspector & Trazado</span>
            </h2>
            <button
              onClick={() => setIsRightCollapsed(true)}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
              title="Colapsar panel derecho"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
            {/* Node Inspector */}
            <NodeInspector
              selectedNode={nodes[selectedNodeIndex] || null}
              onUpdateCoords={(x, y) => handleUpdateNodePos(selectedNodeIndex, x, y)}
              onToggleLock={() => handleToggleLockNode(selectedNodeIndex)}
            />

            {/* Word Trace Glyph Composer with Calligraphic Pressure */}
            <WordTraceComposer
              config={wordTrace}
              onChange={updated => setWordTrace(prev => ({ ...prev, ...updated }))}
              onPlayWordSound={handlePlayWordSound}
            />

            {/* 24 Phonemes Palette with Left-Click Select & Right-Click Swap */}
            <div className="pt-2 border-t border-slate-800/80">
              <PhonemePalette
                nodes={nodes}
                selectedIndex={selectedNodeIndex}
                onSelectNode={idx => setSelectedNodeIndex(idx)}
                onSwapNodes={handleSwapNodes}
              />
            </div>
          </div>
        </aside>

      </main>

      {/* 3. PROJECTS & EXPORT VAULT MODAL */}
      <ProjectsVaultModal
        isOpen={isVaultOpen}
        currentProject={currentProject}
        svgElement={document.querySelector('svg')}
        onClose={() => setIsVaultOpen(false)}
        onLoadProject={proj => {
          setPattern(proj.pattern);
          setParameters(proj.parameters);
          setGuides(mergeGuidesSafe(proj.guides));
          setWordTrace(proj.wordTrace);
          setNodes(proj.nodes);
        }}
        onSaveProject={name => {
          showToast(`Proyecto "${name}" guardado`);
        }}
        onShowToast={showToast}
      />
    </div>
  );
};

export default MatrixCompositorStudio;