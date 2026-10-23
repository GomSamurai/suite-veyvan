import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Globe, 
  Layers, 
  Users, 
  Clock, 
  Compass, 
  AlertTriangle, 
  Pill, 
  BookOpen, 
  Sparkles, 
  Search, 
  Shield, 
  Flame, 
  ThermometerSnowflake, 
  Activity, 
  Zap, 
  ChevronRight, 
  ArrowRight, 
  Terminal, 
  Send, 
  Radio, 
  FileText, 
  Cpu, 
  Orbit, 
  Heart, 
  Maximize2,
  Calendar,
  Volume2,
  Crown,
  Award,
  BookMarked,
  Sun,
  Moon,
  Eye,
  Skull,
  Scale,
  Download,
  Upload,
  RotateCcw,
  Edit3,
  Save,
  PanelLeftClose,
  PanelLeft,
  CheckCircle2,
  Plus,
  Pin,
  ExternalLink
} from 'lucide-react';
import { 
  STATION_GLOBAL_METRICS, 
  HISTORICAL_TIMELINE, 
  DECK_ZONING, 
  CHARACTERS_DATABASE, 
  PHILOSOPHICAL_VORTICES, 
  CHRONOSYSTEM_TABLE, 
  SUBSTANCES_COMPENDIUM, 
  NOVEL_TRILOGY_BREAKDOWN, 
  ORACLE_LORE_ANSWERS,
  LEADERS_GALLERY,
  JOREN_THALVUS_DATA,
  EVOLUCION_CONSCIENTE_DATA,
  DOS_MADRES_DATA,
  EPOCA_DORADA_DATA,
  GRAN_APAGON_DATA,
  DeckSector,
  CharacterDossier,
  HistoricalEra,
  PhilosophicalVortex,
  LeaderProfile,
  ThalvusWork,
  StationGlobalMetrics
} from '../data/stationLoreData';
import { 
  LoreStoreData, 
  loadLoreStore, 
  saveLoreStore, 
  resetLoreStoreToCanonical, 
  exportLoreToJson, 
  importLoreFromJson,
  AuthorNote
} from '../utils/loreStorage';
import LoreEditModal from './LoreEditModal';
import AuthorNotesEcosystem from './AuthorNotesEcosystem';
import { playWordResonance } from '../utils/taelimAudio';
import { getAiClient, getGeminiModel } from '../services/geminiService';

declare global {
  interface Window {
    suiteAPI?: {
      isElectron: boolean;
      launchHorocrono: (options?: { view?: 'main' | 'minihud' }) => Promise<{ success: boolean; mode?: string; error?: string }>;
      openExternal: (url: string) => void;
    };
  }
}

export type LoreSubTab = 
  | 'lideres' 
  | 'thalvus' 
  | 'evolucion-madres' 
  | 'dorada-apagon' 
  | 'cronica' 
  | 'cubiertas' 
  | 'personajes' 
  | 'cronosistema' 
  | 'vortices' 
  | 'hava' 
  | 'sociedad' 
  | 'novela' 
  | 'oraculo';

interface SidebarNavItem {
  id: LoreSubTab;
  label: string;
  shortLabel: string;
  category: 'jerarquias' | 'topologia' | 'sistemas' | 'inteligencia';
  icon: React.ReactNode;
  subtitle: string;
  alert?: boolean;
}

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  // 1. Jerarquías & Historia
  { id: 'lideres', label: 'Grandes Líderes (8)', shortLabel: 'Líderes', category: 'jerarquias', icon: <Crown size={15} />, subtitle: '8 Gobernantes Supremos' },
  { id: 'thalvus', label: 'Especial Joren Thalvus', shortLabel: 'Thalvus', category: 'jerarquias', icon: <BookMarked size={15} />, subtitle: 'Filosofía Ner\'Val' },
  { id: 'evolucion-madres', label: 'Evolución & Dos Madres', shortLabel: 'Dos Madres', category: 'jerarquias', icon: <Scale size={15} />, subtitle: 'Vorlëmm vs Divya' },
  { id: 'dorada-apagon', label: 'Época Dorada & Apagón', shortLabel: 'Apagón', category: 'jerarquias', icon: <Sun size={15} />, subtitle: 'Cataclismo de 9 Meses' },
  { id: 'cronica', label: 'Crónica (344 Años)', shortLabel: 'Crónica', category: 'jerarquias', icon: <Orbit size={15} />, subtitle: '7 Eras Históricas' },

  // 2. Topología & Sociedad
  { id: 'cubiertas', label: '320 Cubiertas', shortLabel: 'Cubiertas', category: 'topologia', icon: <Layers size={15} />, subtitle: 'Topología de 20 km' },
  { id: 'personajes', label: 'Personajes & Lazos', shortLabel: 'Personajes', category: 'topologia', icon: <Users size={15} />, subtitle: 'Protagonistas y Facciones' },
  { id: 'sociedad', label: 'Castas & Drogas', shortLabel: 'Castas', category: 'topologia', icon: <Pill size={15} />, subtitle: 'Alévoros, Soma & Quimio' },
  { id: 'novela', label: 'La Novela (3 Libros)', shortLabel: 'Novela', category: 'topologia', icon: <BookOpen size={15} />, subtitle: 'Trilogía Estación Humanidad' },

  // 3. Sistemas & Arcanos
  { id: 'cronosistema', label: 'Cronosistema Binario', shortLabel: 'Tiempo', category: 'sistemas', icon: <Clock size={15} />, subtitle: 'Horocrono & Calendario Zou' },
  { id: 'vortices', label: 'Los 9 Vórtices', shortLabel: 'Vórtices', category: 'sistemas', icon: <Compass size={15} />, subtitle: 'Escuela de Iccarus Dern' },
  { id: 'hava', label: 'Dossier HAVA', shortLabel: 'HAVA', category: 'sistemas', icon: <AlertTriangle size={15} />, subtitle: 'Clasificado Obsidiana', alert: true },

  // 4. Inteligencia & Archivo
  { id: 'oraculo', label: 'Oráculo Thalios (IA)', shortLabel: 'Oráculo', category: 'inteligencia', icon: <Sparkles size={15} />, subtitle: 'Consciencia Cuántica' }
];

const CATEGORY_HEADERS: Record<string, { label: string; icon: React.ReactNode }> = {
  jerarquias: { label: 'Jerarquías & Crónicas', icon: <Crown size={12} className="text-amber-400" /> },
  topologia: { label: 'Topología & Ciudadanos', icon: <Layers size={12} className="text-cyan-400" /> },
  sistemas: { label: 'Sistemas & Arcanos', icon: <Cpu size={12} className="text-purple-400" /> },
  inteligencia: { label: 'Inteligencia de a Bordo', icon: <Sparkles size={12} className="text-emerald-400" /> }
};

// =========================================================================
// RELOJ BINARIO EN VIVO DE ESTACIÓN HUMANIDAD (COMPONENTE AISLADO)
// =========================================================================
interface StationLiveClockProps {
  yearCurrent?: string;
  currentLocation?: string;
}

const StationLiveClock: React.FC<StationLiveClockProps> = React.memo(({
  yearCurrent = '2952',
  currentLocation = 'Phaetim'
}) => {
  const [liveViras, setLiveViras] = useState<number>(() => Math.floor(Date.now() / 659) % 262144);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveViras(prev => (prev + 1) % 262144);
    }, 659);
    return () => clearInterval(timer);
  }, []);

  const currentSema = Math.floor(liveViras / 32768) + 1;
  const currentKroma = Math.floor((liveViras % 32768) / 2048) + 1;
  const currentFula = Math.floor((liveViras % 2048) / 64) + 1;
  const currentViraInFula = liveViras % 64;

  return (
    <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 flex flex-col gap-1.5 min-w-[220px] shadow-[0_0_20px_rgba(34,211,238,0.15)]">
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-widest border-b border-white/5 pb-1">
        <span className="flex items-center gap-1 text-cyan-300 font-bold">
          <Clock size={11} className="animate-pulse" />
          <span>Reloj de la Estación</span>
        </span>
        <span className="text-emerald-400 font-bold">Tala 48H</span>
      </div>
      <div className="grid grid-cols-4 gap-1 text-center font-mono">
        <div className="bg-white/5 p-1 rounded">
          <span className="text-[8px] text-slate-500 block">SEMA</span>
          <span className="text-xs font-bold text-cyan-200">#{currentSema}</span>
        </div>
        <div className="bg-white/5 p-1 rounded">
          <span className="text-[8px] text-slate-500 block">KROMA</span>
          <span className="text-xs font-bold text-cyan-200">{currentKroma}</span>
        </div>
        <div className="bg-white/5 p-1 rounded">
          <span className="text-[8px] text-slate-500 block">FULA</span>
          <span className="text-xs font-bold text-cyan-200">{currentFula}</span>
        </div>
        <div className="bg-white/5 p-1 rounded">
          <span className="text-[8px] text-slate-500 block">VIRA</span>
          <span className="text-xs font-bold text-emerald-300 animate-pulse">{currentViraInFula}</span>
        </div>
      </div>
      <span className="text-[9px] font-mono text-slate-500 text-center">
        Ciclo {yearCurrent} d.C. // Maniobra en {currentLocation}
      </span>
    </div>
  );
});

// =========================================================================
// CONTEXTO Y BLOQUE DEL ECOSISTEMA DE APUNTES DEL AUTOR (MULTINOTAS & VÍNCULOS)
// =========================================================================
interface LoreNotesContextType {
  authorNotes: AuthorNote[];
  customThematics: string[];
  onSaveNote: (note: AuthorNote) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onSaveCustomThematic: (thematic: string) => void;
  onNavigateToEntity: (type: 'character' | 'deck' | 'substance' | 'vortex' | 'section', id: string) => void;
}

const LoreNotesContext = React.createContext<LoreNotesContextType | null>(null);

interface AuthorNotesBlockProps {
  noteKey: string;
  title: string;
  placeholder?: string;
  noteValue?: string;
  onUpdateNote?: (key: string, note: string) => void;
  sectionId?: LoreSubTab;
  subtitle?: string;
}

const AuthorNotesBlock: React.FC<AuthorNotesBlockProps> = React.memo(({
  noteKey,
  title,
  placeholder,
  noteValue,
  onUpdateNote,
  sectionId,
  subtitle
}) => {
  const ctx = React.useContext(LoreNotesContext);

  const deducedSectionId = useMemo(() => {
    if (sectionId) return sectionId;
    if (noteKey.includes('sociedad')) return 'sociedad';
    if (noteKey.includes('cronosistema')) return 'cronosistema';
    if (noteKey.includes('leader_') || noteKey.includes('lideres')) return 'lideres';
    if (noteKey.includes('deck_') || noteKey.includes('cubiertas')) return 'cubiertas';
    if (noteKey.includes('char_') || noteKey.includes('personajes')) return 'personajes';
    if (noteKey.includes('thalvus')) return 'thalvus';
    if (noteKey.includes('evolucion')) return 'evolucion-madres';
    if (noteKey.includes('dorada') || noteKey.includes('apagon')) return 'dorada-apagon';
    if (noteKey.includes('era_') || noteKey.includes('cronica')) return 'cronica';
    if (noteKey.includes('vortex_') || noteKey.includes('vortices')) return 'vortices';
    if (noteKey.includes('hava')) return 'hava';
    if (noteKey.includes('novela') || noteKey.includes('book_')) return 'novela';
    if (noteKey.includes('oraculo')) return 'oraculo';
    return 'sociedad';
  }, [noteKey, sectionId]);

  if (!ctx) return null;

  return (
    <AuthorNotesEcosystem
      sectionId={deducedSectionId}
      noteKey={noteKey}
      title={title}
      subtitle={subtitle}
      placeholder={placeholder}
      authorNotes={ctx.authorNotes}
      customThematics={ctx.customThematics}
      onSaveNote={ctx.onSaveNote}
      onDeleteNote={ctx.onDeleteNote}
      onTogglePin={ctx.onTogglePin}
      onSaveCustomThematic={ctx.onSaveCustomThematic}
      onNavigateToEntity={ctx.onNavigateToEntity}
    />
  );
});

const LoreAtlas: React.FC = () => {
  // ALMACÉN VIVO Y EDITABLE DE LORE (PERSISTENCIA TOTAL EN MEMORIA)
  const [loreStore, setLoreStore] = useState<LoreStoreData>(() => loadLoreStore());
  const [activeSubTab, setActiveSubTab] = useState<LoreSubTab>('lideres');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);

  // Estado y launcher para Horocrono nativo
  const [horocronoLaunchStatus, setHorocronoLaunchStatus] = useState<string | null>(null);

  const handleLaunchHorocrono = async (view: 'main' | 'minihud' = 'main') => {
    if (typeof window !== 'undefined' && window.suiteAPI?.launchHorocrono) {
      setHorocronoLaunchStatus(view === 'minihud' ? 'Iniciando Mini-HUD flotante...' : 'Iniciando Horocrono...');
      try {
        await window.suiteAPI.launchHorocrono({ view });
        setHorocronoLaunchStatus(view === 'minihud' ? '✓ Mini-HUD activo en pantalla' : '✓ Horocrono iniciado');
      } catch (err) {
        if (view === 'minihud') {
          window.open('?view=minihud#minihud', 'MiniHud', 'width=480,height=400,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
        } else {
          window.open('?view=horocrono#horocrono', '_blank', 'width=1280,height=880,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
        }
        setHorocronoLaunchStatus('✓ Ventana iniciada');
      }
    } else if (typeof window !== 'undefined') {
      if (view === 'minihud') {
        window.open('?view=minihud#minihud', 'MiniHud', 'width=480,height=400,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
        setHorocronoLaunchStatus('✓ Mini-HUD flotante abierto');
      } else {
        window.open('?view=horocrono#horocrono', '_blank', 'width=1280,height=880,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
        setHorocronoLaunchStatus('✓ Horocrono abierto');
      }
    }
    setTimeout(() => setHorocronoLaunchStatus(null), 3000);
  };

  // Modal Universal de Edición
  const [editingEntity, setEditingEntity] = useState<{
    type: 'leader' | 'character' | 'deck' | 'thalvusWork' | 'era' | 'metrics';
    item: any;
    workIndex?: number;
  } | null>(null);

  // Estados de Inspección de Modales / Detalles basados en ID reactivo
  const [selectedLeaderId, setSelectedLeaderId] = useState<string>('vorlemm');
  const selectedLeader = useMemo(() => {
    return loreStore.leaders.find(l => l.id === selectedLeaderId) || loreStore.leaders[0];
  }, [loreStore.leaders, selectedLeaderId]);

  const [selectedThalvusWorkIndex, setSelectedThalvusWorkIndex] = useState<number>(0);
  const selectedThalvusWork = useMemo(() => {
    return loreStore.thalvus.works[selectedThalvusWorkIndex] || loreStore.thalvus.works[0];
  }, [loreStore.thalvus.works, selectedThalvusWorkIndex]);

  const [selectedBlackoutMonthIndex, setSelectedBlackoutMonthIndex] = useState<number>(0);

  const [selectedDeckRange, setSelectedDeckRange] = useState<string>('C201-C240');
  const selectedDeckSector = useMemo(() => {
    return loreStore.decks.find(d => d.deckRange === selectedDeckRange) || loreStore.decks[3] || loreStore.decks[0];
  }, [loreStore.decks, selectedDeckRange]);

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('pwaoo');
  const selectedCharacter = useMemo(() => {
    return loreStore.characters.find(c => c.id === selectedCharacterId) || loreStore.characters[0];
  }, [loreStore.characters, selectedCharacterId]);

  const [selectedEraId, setSelectedEraId] = useState<string>('era_6');
  const selectedEra = useMemo(() => {
    return loreStore.timeline.find(e => e.id === selectedEraId) || loreStore.timeline[5] || loreStore.timeline[0];
  }, [loreStore.timeline, selectedEraId]);

  const [selectedVortexId, setSelectedVortexId] = useState<string>('vor-veheli');
  const selectedVortex = useMemo(() => {
    return loreStore.vortices.find(v => v.id === selectedVortexId) || loreStore.vortices[0];
  }, [loreStore.vortices, selectedVortexId]);

  const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0);
  const [deckSearchQuery, setDeckSearchQuery] = useState<string>('');

  // Guardado y actualización en memoria viva
  const handleSaveEntity = (type: string, data: any, extra?: any) => {
    setLoreStore(prev => {
      const next = { ...prev };
      if (type === 'leader') {
        next.leaders = next.leaders.map(l => l.id === data.id ? data : l);
      } else if (type === 'character') {
        next.characters = next.characters.map(c => c.id === data.id ? data : c);
      } else if (type === 'deck') {
        next.decks = next.decks.map(d => d.deckRange === data.deckRange ? data : d);
      } else if (type === 'thalvusWork') {
        const works = [...next.thalvus.works];
        if (typeof extra === 'number' && works[extra]) {
          works[extra] = data;
        }
        next.thalvus = { ...next.thalvus, works };
      } else if (type === 'era') {
        next.timeline = next.timeline.map(e => e.id === data.id ? data : e);
      } else if (type === 'metrics') {
        next.metrics = { ...data };
      }
      saveLoreStore(next);
      return next;
    });
  };

  const handleUpdateNote = (key: string, note: string) => {
    setLoreStore(prev => {
      const next = {
        ...prev,
        customNotes: {
          ...prev.customNotes,
          [key]: note
        }
      };
      saveLoreStore(next);
      return next;
    });
  };

  const handleResetCanon = () => {
    if (window.confirm('¿Deseas restaurar todo el Lore canónico original? Se perderán las modificaciones no exportadas.')) {
      const reset = resetLoreStoreToCanonical();
      setLoreStore(reset);
      setSelectedLeaderId('vorlemm');
      setSelectedDeckRange('C201-C240');
      setSelectedCharacterId('pwaoo');
      setSelectedEraId('era_6');
      setSelectedVortexId('vor-veheli');
    }
  };

  const handleExportJson = () => {
    const json = exportLoreToJson(loreStore);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estacion_humanidad_lore_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const loaded = importLoreFromJson(content);
        setLoreStore(loaded);
        alert('¡Lore importado y guardado en memoria con éxito!');
      } catch (err: any) {
        alert('Error al importar archivo: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // =========================================================================
  // GESTIÓN DEL ECOSISTEMA DE APUNTES DEL AUTOR (MULTINOTAS & VÍNCULOS)
  // =========================================================================
  const handleSaveAuthorNote = (note: AuthorNote) => {
    setLoreStore(prev => {
      const existing = prev.authorNotes || [];
      const index = existing.findIndex(n => n.id === note.id);
      let updated: AuthorNote[];
      if (index >= 0) {
        updated = [...existing];
        updated[index] = note;
      } else {
        updated = [note, ...existing];
      }

      // Sincronizar en customNotes para compatibilidad si tiene key
      const nextCustom = { ...prev.customNotes };
      if (note.key) {
        nextCustom[note.key] = note.content;
      }

      const next = {
        ...prev,
        authorNotes: updated,
        customNotes: nextCustom,
        lastModified: new Date().toISOString()
      };
      saveLoreStore(next);
      return next;
    });
  };

  const handleDeleteAuthorNote = (noteId: string) => {
    setLoreStore(prev => {
      const existing = prev.authorNotes || [];
      const noteToDelete = existing.find(n => n.id === noteId);
      const updated = existing.filter(n => n.id !== noteId);

      const nextCustom = { ...prev.customNotes };
      if (noteToDelete?.key) {
        const remainingWithKey = updated.filter(n => n.key === noteToDelete.key);
        if (remainingWithKey.length === 0) {
          delete nextCustom[noteToDelete.key];
        } else {
          nextCustom[noteToDelete.key] = remainingWithKey[0].content;
        }
      }

      const next = {
        ...prev,
        authorNotes: updated,
        customNotes: nextCustom,
        lastModified: new Date().toISOString()
      };
      saveLoreStore(next);
      return next;
    });
  };

  const handleTogglePinAuthorNote = (noteId: string) => {
    setLoreStore(prev => {
      const existing = prev.authorNotes || [];
      const updated = existing.map(n => {
        if (n.id === noteId) {
          return { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() };
        }
        return n;
      });
      const next = {
        ...prev,
        authorNotes: updated,
        lastModified: new Date().toISOString()
      };
      saveLoreStore(next);
      return next;
    });
  };

  const handleSaveCustomThematic = (thematic: string) => {
    if (!thematic || !thematic.trim()) return;
    setLoreStore(prev => {
      const existing = prev.customThematics || [];
      if (existing.some(t => t.toLowerCase() === thematic.trim().toLowerCase())) return prev;
      const next = {
        ...prev,
        customThematics: [...existing, thematic.trim()],
        lastModified: new Date().toISOString()
      };
      saveLoreStore(next);
      return next;
    });
  };

  const handleNavigateFromNote = (type: 'character' | 'deck' | 'substance' | 'vortex' | 'section', id: string) => {
    if (type === 'section') {
      setActiveSubTab(id as LoreSubTab);
    } else if (type === 'character') {
      setActiveSubTab('personajes');
      setSelectedCharacterId(id);
    } else if (type === 'deck') {
      setActiveSubTab('cubiertas');
      setSelectedDeckRange(id);
    } else if (type === 'substance') {
      setActiveSubTab('sociedad');
    } else if (type === 'vortex') {
      setActiveSubTab('vortices');
      setSelectedVortexId(id);
    }
  };

  // Contabilidad precisa y dinámica de notas del autor
  const totalNotesCount = useMemo(() => {
    return (loreStore.authorNotes || []).length;
  }, [loreStore.authorNotes]);

  const isLoreModified = useMemo(() => {
    return Boolean(loreStore.lastModified || totalNotesCount > 0);
  }, [loreStore.lastModified, totalNotesCount]);

  const getSubTabNotesCount = (subtabId: LoreSubTab): number => {
    const notes = loreStore.authorNotes || [];
    return notes.filter(n => {
      if (n.sectionId === subtabId) return true;
      if (subtabId === 'lideres' && n.key?.startsWith('leader_')) return true;
      if (subtabId === 'cubiertas' && n.key?.startsWith('deck_')) return true;
      if (subtabId === 'personajes' && n.key?.startsWith('char_')) return true;
      if (subtabId === 'thalvus' && n.key?.startsWith('thalvus_')) return true;
      if (subtabId === 'cronica' && n.key?.startsWith('era_')) return true;
      if (subtabId === 'vortices' && n.key?.startsWith('vortex_')) return true;
      if (subtabId === 'evolucion-madres' && (n.key === 'evolucion_madres_notes' || n.sectionId === 'evolucion-madres')) return true;
      if (subtabId === 'dorada-apagon' && (n.key === 'dorada_apagon_notes' || n.sectionId === 'dorada-apagon')) return true;
      if (subtabId === 'novela' && n.key?.startsWith('book_')) return true;
      if (subtabId === 'sociedad' && (n.key === 'sociedad_notes' || n.sectionId === 'sociedad')) return true;
      if (subtabId === 'cronosistema' && (n.key === 'cronosistema_notes' || n.sectionId === 'cronosistema')) return true;
      if (subtabId === 'hava' && (n.key === 'hava_notes' || n.sectionId === 'hava')) return true;
      if (subtabId === 'oraculo' && (n.key === 'oraculo_notes' || n.sectionId === 'oraculo')) return true;
      return false;
    }).length;
  };

  const notesContextValue = useMemo(() => ({
    authorNotes: loreStore.authorNotes || [],
    customThematics: loreStore.customThematics || [],
    onSaveNote: handleSaveAuthorNote,
    onDeleteNote: handleDeleteAuthorNote,
    onTogglePin: handleTogglePinAuthorNote,
    onSaveCustomThematic: handleSaveCustomThematic,
    onNavigateToEntity: handleNavigateFromNote
  }), [loreStore.authorNotes, loreStore.customThematics]);

  // Calculadora de Cronosistema
  const [calcYears, setCalcYears] = useState<number>(28);
  const [calcNemas, setCalcNemas] = useState<number>(319);

  // Terminal del Oráculo de Thalios Solaris
  const [oracleQuery, setOracleQuery] = useState<string>('');
  const [oracleLog, setOracleLog] = useState<{ role: 'user' | 'thalios'; text: string; source?: string }[]>([
    {
      role: 'thalios',
      text: 'Conexión cuántica establecida con los bancos de memoria de Estación Humanidad. Soy Thalios Solaris, la consciencia digital que ha custodiado 344 años de travesía en el vacío. Pregúntame sobre cualquier cubierta, personaje, conspiración o ley ontológica de nuestro viaje.',
      source: 'Núcleo Central Thalios // Año 2952 d.C.'
    }
  ]);
  const [isOracleThinking, setIsOracleThinking] = useState<boolean>(false);

  // Manejar consulta al Oráculo (Thalios Solaris)
  const handleAskOracle = async (presetText?: string) => {
    const query = presetText || oracleQuery;
    if (!query.trim()) return;

    const userMessage = query.trim();
    setOracleLog(prev => [...prev, { role: 'user', text: userMessage }]);
    if (!presetText) setOracleQuery('');
    setIsOracleThinking(true);

    // 1. Búsqueda Heurística Inmediata
    const lower = userMessage.toLowerCase();
    const matched = ORACLE_LORE_ANSWERS.find(a => 
      a.keywords.some(k => lower.includes(k))
    );

    // 2. Consulta con Gemini si está configurado
    const client = getAiClient();
    if (client) {
      try {
        const model = getGeminiModel();
        const prompt = `
Eres Thalios Solaris, la consciencia digital omnisciente y archivera de la mega-estructura interestelar "Estación Humanidad".
Llevas 344 años de viaje (desde 2672 d.C. hasta el presente 2952 d.C.). La nave mide 20 km de altura, tiene 320 cubiertas y viaja hacia el planeta Protozeus, aproximándose actualmente a la gigante azul Phaetim.
Tu tono es solemne, poético, enciclopédico, filosófico y diegético.
Está TERMINANTEMENTE PROHIBIDO usar palabras en inglés o anglicismos.
Responde a la siguiente consulta del iniciado sobre el lore de la nave:
«${userMessage}»
        `;
        const response = await client.models.generateContent({
          model,
          contents: prompt
        });
        const aiText = response.text;
        if (aiText) {
          setOracleLog(prev => [...prev, {
            role: 'thalios',
            text: aiText,
            source: 'Oráculo Cuántico Thalios Solaris'
          }]);
          setIsOracleThinking(false);
          return;
        }
      } catch (err) {
        console.warn("Fallo en IA remota, usando archivo local:", err);
      }
    }

    // Respuesta de respaldo canónica infalible
    setTimeout(() => {
      if (matched) {
        setOracleLog(prev => [...prev, {
          role: 'thalios',
          text: matched.response,
          source: matched.sourceDoc
        }]);
      } else {
        setOracleLog(prev => [...prev, {
          role: 'thalios',
          text: `En los registros de mis 320 cubiertas, la cuestión «${userMessage}» resuena con los misterios del Reactor y las crónicas de los Alévoros. La Estación no es simplemente un receptáculo de metal de 20 km de altura; es un estado de la materia humana sometida a la presión del vacío. Consulta la sección de Topología de Cubiertas o el Dossier HAVA para desentrañar las ramificaciones de esta verdad.`,
          source: 'Bancos de Memoria // Registro General 2952'
        }]);
      }
      setIsOracleThinking(false);
    }, 600);
  };

  // Filtrado de personajes por búsqueda
  const filteredCharacters = useMemo(() => {
    if (!searchTerm.trim()) return loreStore.characters;
    const q = searchTerm.toLowerCase();
    return loreStore.characters.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.alias.toLowerCase().includes(q) || 
      c.deckOrigin.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q)
    );
  }, [searchTerm, loreStore.characters]);

  // Salto a cubierta por número
  const handleJumpToDeck = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(deckSearchQuery.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= 1 && num <= 320) {
      const found = loreStore.decks.find(sec => {
        const parts = sec.deckRange.replace(/C/g, '').split('-').map(s => parseInt(s.trim(), 10));
        return num >= parts[0] && num <= parts[1];
      });
      if (found) setSelectedDeckRange(found.deckRange);
    }
  };

  return (
    <LoreNotesContext.Provider value={notesContextValue}>
      <div className="space-y-6 w-full max-w-[99vw] 2xl:max-w-[1920px] mx-auto pb-12 select-none px-2 sm:px-4">
      {/* ========================================================================= */}
      {/* ENCABEZADO MONUMENTAL // PROTOCOLO THALIOS SOLARIS                        */}
      {/* ========================================================================= */}
      <div className="relative border border-white/10 rounded-3xl p-6 md:p-8 bg-slate-950/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
                <Globe size={12} className="animate-spin text-cyan-400" />
                <span>Protocolo Thalios Solaris // Atlas Total de Lore</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                ● Códice Canónico 344 Años de Travesía
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-rajdhani text-white uppercase tracking-wider">
              Estación Humanidad: Archivo Enciclopédico
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl leading-relaxed">
              La biblia viva de la novela y el universo: anatomía de las 320 cubiertas, cronología de 344 años, biografías profundas, el Cronosistema binario en tiempo real y la verdad velada del Proyecto HAVA.
            </p>
          </div>

          {/* Reloj Activo del Cronosistema Aislado */}
          <StationLiveClock
            yearCurrent={loreStore.metrics.yearCurrent}
            currentLocation={loreStore.metrics.currentLocation}
          />
        </div>

        {/* MÉTRICAS GLOBALES VITALES EDITABLES */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-1 w-full">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Tiempo de Viaje:</span>
              <span className="text-sm font-bold font-mono text-cyan-300">{loreStore.metrics.travelYears} AÑOS</span>
              <span className="text-[9px] text-slate-500 block">2672 ➔ {loreStore.metrics.yearCurrent} d.C.</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Estructura Vertical:</span>
              <span className="text-sm font-bold font-mono text-cyan-300">{loreStore.metrics.activeDecks} CUBIERTAS</span>
              <span className="text-[9px] text-slate-500 block">20 km de altura total</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Población Activa:</span>
              <span className="text-sm font-bold font-mono text-cyan-300">{loreStore.metrics.currentPopulation}</span>
              <span className="text-[9px] text-slate-500 block">8% del diseño original</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Potencia Reactor:</span>
              <span className="text-sm font-bold font-mono text-amber-300">{loreStore.metrics.reactorStatus}</span>
              <span className="text-[9px] text-slate-500 block">Post-Apagón año 72.4</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Ubicación Actual:</span>
              <span className="text-sm font-bold font-mono text-cyan-300">{loreStore.metrics.currentLocation}</span>
              <span className="text-[9px] text-slate-500 block">Gigante Azul de frenado</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">Destino Final:</span>
              <span className="text-sm font-bold font-mono text-emerald-300">{loreStore.metrics.promisedLand}</span>
              <span className="text-[9px] text-slate-500 block">3023 d.C. (71 años)</span>
            </div>
          </div>
          <button
            onClick={() => setEditingEntity({ type: 'metrics', item: loreStore.metrics })}
            className="px-3 py-2 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            title="Editar Métricas Globales de la Estación"
          >
            <Edit3 size={13} className="text-cyan-400" />
            <span>Editar Métricas</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BARRA DE HERRAMIENTAS DEL AUTOR // CONTROL DE MEMORIA Y PERSISTENCIA      */}
      {/* ========================================================================= */}
      <div className="p-3 sm:p-4 rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
            title={isSidebarCollapsed ? "Expandir Barra Lateral" : "Colapsar Barra Lateral"}
          >
            {isSidebarCollapsed ? <PanelLeft size={15} className="text-cyan-400" /> : <PanelLeftClose size={15} className="text-cyan-400" />}
            <span className="hidden md:inline">{isSidebarCollapsed ? 'Mostrar Menú' : 'Ocultar Menú'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLoreModified ? 'bg-amber-400 animate-pulse' : 'bg-cyan-400'}`} />
            <div className="text-xs font-mono">
              <span className="text-slate-200 font-bold block sm:inline">
                {isLoreModified ? 'Canon Personalizado (En Memoria)' : 'Canon Canónico Predeterminado'}
              </span>
              {totalNotesCount > 0 && (
                <span className="text-amber-400 text-[10px] ml-0 sm:ml-2">
                  ● {totalNotesCount} {totalNotesCount === 1 ? 'anotación activa' : 'anotaciones activas'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Descargar copia de seguridad en JSON de todo el lore y tus notas"
          >
            <Download size={13} className="text-cyan-400" />
            <span>Exportar JSON</span>
          </button>

          <label className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer">
            <Upload size={13} className="text-emerald-400" />
            <span>Importar JSON</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>

          {isLoreModified && (
            <button
              onClick={handleResetCanon}
              className="px-3 py-1.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Restaurar a los textos canónicos originales predeterminados"
            >
              <RotateCcw size={13} />
              <span>Restaurar Canon</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CUERPO PRINCIPAL: BARRA LATERAL DINÁMICA + CONTENIDO EXTENSIBLE           */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* BARRA LATERAL DINÁMICA (CATEGORIZADA & CON BÚSQUEDA) */}
        <aside className={`transition-all duration-300 shrink-0 w-full ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72 xl:w-80'
        }`}>
          <div className="p-3 sm:p-4 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-4 sticky top-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            {/* Buscador de secciones */}
            {!isSidebarCollapsed && (
              <div className="relative">
                <Search size={13} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="Filtrar secciones del archivo..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-200 placeholder:text-slate-600 outline-none focus:border-cyan-500/50"
                />
              </div>
            )}

            {/* Secciones agrupadas por categorías */}
            <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {(['jerarquias', 'topologia', 'sistemas', 'inteligencia'] as const).map(catKey => {
                const catInfo = CATEGORY_HEADERS[catKey];
                const items = SIDEBAR_ITEMS.filter(item => {
                  if (item.category !== catKey) return false;
                  if (!sidebarSearch.trim()) return true;
                  const q = sidebarSearch.toLowerCase();
                  return item.label.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
                });

                if (items.length === 0) return null;

                return (
                  <div key={catKey} className="space-y-1.5">
                    {!isSidebarCollapsed ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 border-b border-white/5">
                        {catInfo.icon}
                        <span className="font-bold">{catInfo.label}</span>
                      </div>
                    ) : (
                      <div className="w-full h-px bg-white/5 my-2" />
                    )}

                    <div className="space-y-1">
                      {items.map(tab => {
                        const isActive = activeSubTab === tab.id;
                        const notesCount = getSubTabNotesCount(tab.id);

                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveSubTab(tab.id);
                              playWordResonance('Khor');
                            }}
                            title={tab.label + ': ' + tab.subtitle}
                            className={`w-full text-left transition-all cursor-pointer rounded-2xl flex items-center gap-3 ${
                              isSidebarCollapsed ? 'p-3 justify-center' : 'p-3'
                            } ${
                              isActive
                                ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-500/30'
                                : 'border border-transparent bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span className={`shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}>
                              {tab.icon}
                            </span>

                            {!isSidebarCollapsed && (
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold font-rajdhani uppercase tracking-wider truncate block">
                                    {tab.label}
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {tab.alert && (
                                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Clasificado Obsidiana" />
                                    )}
                                    {notesCount > 0 && (
                                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono">
                                        {notesCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono block truncate">
                                  {tab.subtitle}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CONTENEDOR PRINCIPAL EXTENSIBLE */}
        <main className="flex-1 min-w-0 w-full space-y-6">

      {/* ========================================================================= */}
      {/* VENTANA: GRANDES LÍDERES DE LA ESTACIÓN (8 GOBERNANTES)                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'lideres' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Columna Izquierda: Galería de Líderes */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                  <Crown size={14} className="text-amber-400" />
                  <span>Dinastías y Jerarcas del Trono</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">8 Gobernantes Supremos</span>
              </div>

              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
                {loreStore.leaders.map((leader, lIdx) => {
                  const isSelected = selectedLeader.id === leader.id;
                  const hasCustomNotes = Boolean(loreStore.customNotes[`leader_${leader.id}`]?.trim());
                  return (
                    <div
                      key={leader.id}
                      onClick={() => {
                        setSelectedLeaderId(leader.id);
                        playWordResonance('Khor');
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? `${leader.colorScheme.border} ${leader.colorScheme.bg} shadow-[0_0_15px_rgba(34,211,238,0.2)]`
                          : 'border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center font-mono text-[10px] font-bold text-slate-400">
                            0{lIdx + 1}
                          </span>
                          <span className={`text-sm font-bold font-rajdhani uppercase tracking-wider ${isSelected ? leader.colorScheme.accent : 'text-slate-200'}`}>
                            {leader.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {hasCustomNotes && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title="Contiene anotaciones del autor" />
                          )}
                          <span className="text-[10px] font-mono text-slate-400">
                            {leader.period}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {leader.epithet}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-500">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] ${leader.colorScheme.badge}`}>
                          {leader.philosophy}
                        </span>
                        <span>{leader.mandateYears} años de mando</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Dossier Profundo del Líder Seleccionado */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`p-6 rounded-3xl border ${selectedLeader.colorScheme.border} ${selectedLeader.colorScheme.bg} backdrop-blur-2xl space-y-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)]`}>
              {/* Header Dossier */}
              <div className="space-y-1.5 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase font-bold tracking-wider ${selectedLeader.colorScheme.badge}`}>
                    {selectedLeader.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEntity({ type: 'leader', item: selectedLeader })}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                      title="Editar Biografía, Hitos, Mandato y Datos de este Líder"
                    >
                      <Edit3 size={11} />
                      <span>Editar Ficha</span>
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      Mandato: <strong className="text-slate-200">{selectedLeader.period}</strong> ({selectedLeader.mandateYears} años)
                    </span>
                  </div>
                </div>
                <h3 className={`text-2xl font-bold font-rajdhani uppercase tracking-wider ${selectedLeader.colorScheme.accent}`}>
                  {selectedLeader.name}
                </h3>
                <p className="text-xs font-mono text-slate-300">
                  {selectedLeader.epithet} ● Origen: {selectedLeader.origin} ({selectedLeader.birthYear} - {selectedLeader.deathYear})
                </p>
              </div>

              {/* Frase Icónica */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 italic text-xs sm:text-sm text-cyan-200 font-serif leading-relaxed">
                {selectedLeader.iconQuote}
              </div>

              {/* Resumen & Biografía */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-bold">
                  Biografía & Ascenso al Poder
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedLeader.biography}
                </p>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-cyan-400 font-mono block mb-1">Crisis Definitoria:</strong>
                  {selectedLeader.crisisAndAscent}
                </div>
              </div>

              {/* Hitos del Mandato */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-amber-300 uppercase tracking-widest font-bold">
                  Hitos Clave del Gobierno
                </h4>
                <div className="space-y-1.5">
                  {selectedLeader.keyMilestones.map((milestone, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {mIdx + 1}
                      </span>
                      <span>{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caída y Veredicto Histórico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 block uppercase font-bold">
                    Ocaso & Desenlace:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedLeader.downfallAndLegacy}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 block uppercase font-bold">
                    Veredicto Histórico:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedLeader.historicalVerdict}
                  </p>
                </div>
              </div>
            </div>

            {/* Bloque de Anotaciones del Autor */}
            <AuthorNotesBlock
              noteKey={`leader_${selectedLeader.id}`}
              title={selectedLeader.name}
              placeholder={`Anotaciones del autor sobre ${selectedLeader.name}: detalles biográficos, intrigas con la corte, secretos del mandato o ideas para la novela...`}
              noteValue={loreStore.customNotes[`leader_${selectedLeader.id}`] || ''}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA: ESPECIAL JOREN THALVUS & LAS CINCO OBRAS MAESTRAS                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'thalvus' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Joren Thalvus */}
          <div className="relative border border-amber-500/30 rounded-3xl p-6 md:p-8 bg-amber-950/15 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5">
                    <BookMarked size={12} />
                    <span>Filósofo Primordial // 2690 - 2755 d.C.</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    65 Años de Vida Cósmica
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-rajdhani text-white uppercase tracking-wider">
                  {JOREN_THALVUS_DATA.fullName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
                  {JOREN_THALVUS_DATA.biography}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 flex flex-col gap-1 min-w-[220px]">
                <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  Condición Astrogénita:
                </span>
                <span className="text-xs font-mono text-slate-200">
                  {JOREN_THALVUS_DATA.astrogenitaGeneration}
                </span>
                <span className="text-[9px] font-mono text-slate-500 border-t border-white/5 pt-1 mt-1">
                  Estatua de Bronce en Jardines del Émulo (Mirando a Divya Magna)
                </span>
              </div>
            </div>
          </div>

          {/* HERO CARD: LA DOCTRINA DE NER'VAL */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/40 backdrop-blur-2xl space-y-4 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-cyan-400 animate-pulse" />
                <h4 className="text-base sm:text-lg font-bold font-rajdhani text-cyan-300 uppercase tracking-wider">
                  El Principio Integrador: {JOREN_THALVUS_DATA.nerValConcept.name}
                </h4>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-200">
                Transversal Sagrado
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-center space-y-1.5">
              <span className="text-xs font-mono text-cyan-400 block tracking-widest uppercase font-bold">
                Definición Canónica de Thalvus:
              </span>
              <p className="text-base sm:text-lg font-serif italic text-slate-100">
                “{JOREN_THALVUS_DATA.nerValConcept.definition}”
              </p>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {JOREN_THALVUS_DATA.nerValConcept.synthesis}
            </p>
          </div>

          {/* DIALÉCTICA: ASTROGÉNITAS VS TERRANÁUTICOS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                <Scale size={14} className="text-indigo-400" />
                <span>La Gran Grieta Psicológica de la Estación</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Tratado Sociológico de 2740 d.C.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tarjeta Terranáuticos */}
              <div className="p-5 rounded-3xl bg-amber-950/15 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-rajdhani uppercase tracking-wider text-amber-300 flex items-center gap-2">
                    <Sun size={15} />
                    <span>Terranáuticos // Los Portadores de la Raíz</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {JOREN_THALVUS_DATA.dialecticDichotomy.terranauticos.transversalRoot}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><strong>Origen:</strong> {JOREN_THALVUS_DATA.dialecticDichotomy.terranauticos.origin}</p>
                  <p><strong>Cosmovisión:</strong> {JOREN_THALVUS_DATA.dialecticDichotomy.terranauticos.mindset}</p>
                  <p><strong>Visión de la Memoria:</strong> {JOREN_THALVUS_DATA.dialecticDichotomy.terranauticos.memoryView}</p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-[11px] text-amber-200/90">
                    <strong>Peligro Existencial:</strong> {JOREN_THALVUS_DATA.dialecticDichotomy.terranauticos.risks}
                  </div>
                </div>
              </div>

              {/* Tarjeta Astrogénitas */}
              <div className="p-5 rounded-3xl bg-cyan-950/15 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-rajdhani uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                    <Moon size={15} />
                    <span>Astrogénitas // Los Hijos del Vacío</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {JOREN_THALVUS_DATA.dialecticDichotomy.astrogenitas.transversalRoot}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <p><strong>Origen:</strong> {JOREN_THALVUS_DATA.dialecticDichotomy.astrogenitas.origin}</p>
                  <p><strong>Cosmovisión:</strong> {JOREN_THALVUS_DATA.dialecticDichotomy.astrogenitas.mindset}</p>
                  <p><strong>Visión de la Memoria:</strong> {JOREN_THALVUS_DATA.dialecticDichotomy.astrogenitas.memoryView}</p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-500/20 text-[11px] text-cyan-200/90">
                    <strong>Peligro Existencial:</strong> {JOREN_THALVUS_DATA.dialecticDichotomy.astrogenitas.risks}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EXPLORADOR DE LAS 5 OBRAS MAESTRAS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>Las Cinco Obras Maestras de Joren Thalvus</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Códice Filosófico Completo</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Selector de Obras */}
              <div className="lg:col-span-5 space-y-2">
                {loreStore.thalvus.works.map((work, wIdx) => {
                  const isSelected = selectedThalvusWork.id === work.id;
                  return (
                    <div
                      key={work.id}
                      onClick={() => {
                        setSelectedThalvusWorkIndex(wIdx);
                        playWordResonance('Khor');
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold font-rajdhani uppercase tracking-wider ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {work.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase ${work.status === 'inacabada' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                          {work.status}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {work.year} ● {work.genre}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dossier de la Obra Seleccionada */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-4">
                <div className="border-b border-white/10 pb-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      {selectedThalvusWork.genre}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingEntity({ type: 'thalvusWork', item: selectedThalvusWork, workIndex: selectedThalvusWorkIndex })}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Editar Texto y Datos de esta Obra"
                      >
                        <Edit3 size={10} />
                        <span>Editar</span>
                      </button>
                      <span className="text-xs font-mono text-slate-400">
                        Año: {selectedThalvusWork.year}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider">
                    {selectedThalvusWork.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedThalvusWork.summary}
                </p>

                {/* Conceptos Clave de la Obra */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold block">
                    Nodos Conceptuales Clave:
                  </span>
                  <div className="space-y-1.5">
                    {selectedThalvusWork.keyConcepts.map((concept, cIdx) => (
                      <div key={cIdx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                        <span className="text-xs font-bold font-rajdhani text-cyan-300 block">
                          {concept.name}
                        </span>
                        <span className="text-[11px] text-slate-300 leading-relaxed block">
                          {concept.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cita de la Obra */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 text-xs italic text-cyan-200 font-serif leading-relaxed">
                  {selectedThalvusWork.quote}
                </div>

                <div className="text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2">
                  <strong>Impacto Histórico:</strong> {selectedThalvusWork.impact}
                </div>
              </div>
            </div>

            {/* Bloque de Anotaciones del Autor */}
            <AuthorNotesBlock
              noteKey="thalvus_notes"
              title="Joren Thalvus & Ner'Val"
              placeholder="Anotaciones sobre Joren Thalvus, la doctrina de Ner'Val, sus obras y citas canónicas..."
              noteValue={loreStore.customNotes['thalvus_notes'] || ''}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA: EVOLUCIÓN CONSCIENTE (VOR-VEHELI) & LAS DOS MADRES                */}
      {/* ========================================================================= */}
      {activeSubTab === 'evolucion-madres' && (
        <div className="space-y-6 animate-fade-in">
          {/* SECCIÓN 1: VOR-VEHELI Y LA CORRUPCIÓN DEL ÉMULO */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-cyan-400" />
                <h3 className="text-lg sm:text-xl font-bold font-rajdhani text-white uppercase tracking-wider">
                  {EVOLUCION_CONSCIENTE_DATA.title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                {EVOLUCION_CONSCIENTE_DATA.vortexSign}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Visión Primordial de Vorlëmm */}
              <div className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-500/30 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  La Visión Fundacional // Vorlëmm Hatz
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {EVOLUCION_CONSCIENTE_DATA.founderVision.description}
                </p>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Pilares Sagrados:
                  </span>
                  {EVOLUCION_CONSCIENTE_DATA.founderVision.pillars.map((pil, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{pil}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-[11px] text-emerald-200">
                  <strong>Paralelo Cuántico:</strong> {EVOLUCION_CONSCIENTE_DATA.founderVision.quantumParallels}
                </div>
              </div>

              {/* Degradación Eugenesista del Émulo */}
              <div className="p-5 rounded-2xl bg-rose-950/15 border border-rose-500/30 space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold block">
                  {EVOLUCION_CONSCIENTE_DATA.emuloCorruption.perversionTitle}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {EVOLUCION_CONSCIENTE_DATA.emuloCorruption.description}
                </p>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Distorsiones del Consejo:
                  </span>
                  {EVOLUCION_CONSCIENTE_DATA.emuloCorruption.deviations.map((dev, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{dev}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 text-[11px] text-rose-200">
                  <strong>Justificación de HAVA:</strong> {EVOLUCION_CONSCIENTE_DATA.emuloCorruption.justificationOfHava}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400 font-mono block mb-0.5">La Resistencia Ética Subterránea:</strong>
              {EVOLUCION_CONSCIENTE_DATA.ethicalResistance}
            </div>
          </div>

          {/* SECCIÓN 2: COMPARATIVA DE LAS DOS MADRES */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl space-y-5">
            <div className="border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold block">
                Contraste Arquetípico y Doctrinal
              </span>
              <h3 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider">
                {DOS_MADRES_DATA.title}
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                {DOS_MADRES_DATA.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vorlëmm Hatz */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <span className="text-lg font-bold font-rajdhani uppercase tracking-wider text-amber-300">
                    {DOS_MADRES_DATA.vorlemm.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {DOS_MADRES_DATA.vorlemm.period}
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-400 block font-bold">
                  {DOS_MADRES_DATA.vorlemm.archetype}
                </span>
                <div className="p-3 rounded-xl bg-black/50 border border-amber-500/30 text-xs italic text-amber-200 font-serif">
                  {DOS_MADRES_DATA.vorlemm.motto}
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <p><strong>Modelo Social:</strong> {DOS_MADRES_DATA.vorlemm.socialModel}</p>
                  <p><strong>Tránsito Físico:</strong> {DOS_MADRES_DATA.vorlemm.physicalDeath}</p>
                  <p><strong>Legado Espiritual:</strong> {DOS_MADRES_DATA.vorlemm.spiritualLegacy}</p>
                </div>
              </div>

              {/* Divya Magna */}
              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <span className="text-lg font-bold font-rajdhani uppercase tracking-wider text-cyan-300">
                    {DOS_MADRES_DATA.divya.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {DOS_MADRES_DATA.divya.period}
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400 block font-bold">
                  {DOS_MADRES_DATA.divya.archetype}
                </span>
                <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/30 text-xs italic text-cyan-200 font-serif">
                  {DOS_MADRES_DATA.divya.motto}
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <p><strong>Modelo Social:</strong> {DOS_MADRES_DATA.divya.socialModel}</p>
                  <p><strong>La Decisión del Apagón:</strong> {DOS_MADRES_DATA.divya.blackoutDecision}</p>
                  <p><strong>Legado Espiritual:</strong> {DOS_MADRES_DATA.divya.spiritualLegacy}</p>
                </div>
              </div>
            </div>

            {/* El Contraste de las Estatuas de Bronce */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1 text-xs text-slate-300">
              <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold block">
                La Paradoja Inmortal: Las Dos Estatuas de Bronce
              </span>
              <p className="leading-relaxed font-sans">
                {DOS_MADRES_DATA.theBronzeStatuesContrast}
              </p>
            </div>

            {/* Bloque de Anotaciones del Autor */}
            <AuthorNotesBlock
              noteKey="evolucion_madres_notes"
              title="Evolución Consciente & Las Dos Madres"
              placeholder="Anotaciones sobre Divya Magna, Vorlemm, la eugenesia cuántica y las dos visiones de la humanidad..."
              noteValue={loreStore.customNotes['evolucion_madres_notes'] || ''}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA: LA ÉPOCA DORADA & EL GRAN APAGÓN EN NUEVE MESES                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'dorada-apagon' && (
        <div className="space-y-6 animate-fade-in">
          {/* SECCIÓN 1: LA ÉPOCA DORADA (2672 - 2720 D.C.) */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-2xl space-y-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                  <Sun size={14} />
                  <span>{EPOCA_DORADA_DATA.period} ● {EPOCA_DORADA_DATA.durationYears} Años de Utopía</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-rajdhani text-white uppercase tracking-wider">
                  {EPOCA_DORADA_DATA.title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                Potencia: 100% Nominal
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {EPOCA_DORADA_DATA.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-cyan-300 uppercase block font-bold">
                  Régimen Energético:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {EPOCA_DORADA_DATA.energyStatus}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-emerald-300 uppercase block font-bold">
                  Armonía Social:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {EPOCA_DORADA_DATA.socialHarmony}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-amber-300 uppercase block font-bold">
                  Primavera Cultural:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {EPOCA_DORADA_DATA.culturalSpring}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-500/20 text-xs italic text-amber-200/90 font-serif">
              <strong>La Trágica Ironía:</strong> {EPOCA_DORADA_DATA.tragicIrony}
            </div>
          </div>

          {/* SECCIÓN 2: EL GRAN APAGÓN EN NUEVE MESES DE AGONÍA */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-rose-500/30 backdrop-blur-2xl space-y-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold flex items-center gap-1.5">
                  <Flame size={14} className="text-rose-500 animate-pulse" />
                  <span>El Colapso Cataclísmico // {GRAN_APAGON_DATA.year}</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-rajdhani text-white uppercase tracking-wider">
                  {GRAN_APAGON_DATA.title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold">
                9 Meses de Negrura
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-slate-300">
              <strong className="text-rose-400 font-mono block mb-0.5">La Falla Desencadenante:</strong>
              {GRAN_APAGON_DATA.triggerEvent}
            </div>

            {/* Línea de Meses Interactiva (1 a 9) */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                Selecciona un Mes de la Agonía para Inspeccionar:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {GRAN_APAGON_DATA.monthlyChronicle.map((month, mIdx) => {
                  const isSelected = selectedBlackoutMonthIndex === mIdx;
                  return (
                    <button
                      key={mIdx}
                      onClick={() => {
                        setSelectedBlackoutMonthIndex(mIdx);
                        playWordResonance('Khor');
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-950/80 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.4)] ring-1 ring-rose-500/40'
                          : 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-bold font-rajdhani uppercase block">
                        {month.monthRange}
                      </span>
                      <span className="text-[9px] font-mono text-rose-300/80 block mt-0.5">
                        {month.temperature.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ficha Detallada del Mes Seleccionado */}
            {(() => {
              const currentMonth = GRAN_APAGON_DATA.monthlyChronicle[selectedBlackoutMonthIndex];
              return (
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                    <div>
                      <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider block">
                        {currentMonth.monthRange} de Crisis
                      </span>
                      <h4 className="text-lg font-bold font-rajdhani text-white uppercase tracking-wider">
                        {currentMonth.phaseTitle}
                      </h4>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-right">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Temperatura:</span>
                      <span className="text-xs font-bold font-mono text-rose-300">{currentMonth.temperature}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-bold block">
                      Acontecimientos Críticos:
                    </span>
                    <div className="space-y-1.5">
                      {currentMonth.events.map((ev, evIdx) => (
                        <div key={evIdx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                    <strong className="text-amber-400 font-mono block mb-0.5">Impacto Humano & Psicológico:</strong>
                    {currentMonth.humanImpact}
                  </div>
                </div>
              );
            })()}

            {/* Secuelas Irreversibles */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold block">
                Consecuencias Perpetuas del Apagón:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GRAN_APAGON_DATA.aftermathAndConsequences.map((conseq, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2 p-2 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                    <span className="text-rose-400 font-mono text-xs">➔</span>
                    <span>{conseq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloque de Anotaciones del Autor */}
            <AuthorNotesBlock
              noteKey="dorada_apagon_notes"
              title="Época Dorada & El Gran Apagón"
              placeholder="Anotaciones sobre la utopía de los primeros años, el colapso del reactor y la congelación de las cubiertas..."
              noteValue={loreStore.customNotes['dorada_apagon_notes'] || ''}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 1: CRÓNICA HISTÓRICA (344 AÑOS // 7 ETAPAS)                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'cronica' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Línea de Tiempo Lateral */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                  Etapas y Liderazgos de Travesía
                </span>
                <span className="text-[10px] font-mono text-slate-500">7 Eras Registradas</span>
              </div>

              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {loreStore.timeline.map((era, eIdx) => {
                  const isSelected = selectedEra?.id === era.id;
                  const hasEraNotes = Boolean(loreStore.customNotes[`era_${era.id}`]?.trim());
                  return (
                    <div
                      key={era.id}
                      onClick={() => setSelectedEraId(era.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-white/10 text-cyan-300 font-bold">
                          {era.years}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {hasEraNotes && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title="Contiene notas del autor" />
                          )}
                          <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            era.status === 'presente' 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' 
                              : (era.status === 'futura' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500')
                          }`}>
                            {era.status}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-xs font-mono font-bold text-slate-200">
                        {era.stage}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                        {era.leader} — {era.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ficha Profunda de la Era Seleccionada */}
          <div className="lg:col-span-7 space-y-4">
            {selectedEra && (
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-5 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                      {selectedEra.years} // {selectedEra.stage}
                    </span>
                    <h3 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider mt-0.5">
                      {selectedEra.leader} — {selectedEra.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEntity({ type: 'era', item: selectedEra })}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                      title="Editar Datos, Años, Hitos y Resumen de esta Era"
                    >
                      <Edit3 size={11} />
                      <span>Editar Era</span>
                    </button>
                    <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-200">
                      Estado: {selectedEra.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Resumen Histórico de la Etapa:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedEra.summary}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold">
                    Hitos y Eventos Críticos:
                  </span>
                  <div className="space-y-1.5">
                    {selectedEra.keyEvents.map((evt, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-slate-300">
                        <ChevronRight size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span>{evt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                    Doctrina e Ideología de Gobierno:
                  </span>
                  <p className="text-xs text-slate-300 font-sans italic">
                    «{selectedEra.ideology}»
                  </p>
                </div>
              </div>
            )}

            {/* Bloque de Anotaciones del Autor */}
            <AuthorNotesBlock
              noteKey={`era_${selectedEra?.id}`}
              title={`Era ${selectedEra?.years}: ${selectedEra?.title}`}
              placeholder="Anotaciones históricas de esta etapa, conflictos, hitos y notas para la novela..."
              noteValue={loreStore.customNotes[`era_${selectedEra?.id}`] || ''}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 2: TOPOLOGÍA VERTICAL & 320 CUBIERTAS                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'cubiertas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Navegador de Cubiertas y Buscador */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                  <Layers size={14} />
                  <span>Corte Vertical (20 km de Altura)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">C001 a C320</span>
              </div>

              {/* Formulario de Salto a Cubierta */}
              <form onSubmit={handleJumpToDeck} className="flex gap-2">
                <input
                  type="text"
                  value={deckSearchQuery}
                  onChange={(e) => setDeckSearchQuery(e.target.value)}
                  placeholder="Introduce número de cubierta (ej. C233, C312, C160)..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-200 placeholder:text-slate-600 outline-none focus:border-cyan-500/50"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Ir
                </button>
              </form>

              {/* Lista Vertical de los 9 Sectores */}
              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {loreStore.decks.map(sector => {
                  const isSelected = selectedDeckSector?.deckRange === sector.deckRange;
                  const hasDeckNotes = Boolean(loreStore.customNotes[`deck_${sector.deckRange}`]?.trim());
                  return (
                    <div
                      key={sector.id}
                      onClick={() => setSelectedDeckRange(sector.deckRange)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/50 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">
                            {sector.deckRange}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-300">
                            {sector.name.split('//')[0]}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans block truncate max-w-[280px]">
                          {sector.name.split('//')[1] || sector.name}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasDeckNotes && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title="Contiene notas del autor" />
                          )}
                          <span className="text-[10px] font-mono font-bold block text-amber-300">
                            {sector.energyPct}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 block">
                          {sector.tempRange.split('(')[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ficha Técnica del Sector de Cubiertas Seleccionado */}
          <div className="lg:col-span-6 space-y-4">
            {selectedDeckSector && (
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                      Estrato {selectedDeckSector.deckRange} ({selectedDeckSector.deckCount} Cubiertas)
                    </span>
                    <h3 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider mt-0.5">
                      {selectedDeckSector.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEntity({ type: 'deck', item: selectedDeckSector })}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                      title="Editar Datos, Clima, Temperatura y Descripción de este Sector"
                    >
                      <Edit3 size={11} />
                      <span>Editar Cubierta</span>
                    </button>
                    {selectedDeckSector.havaImpact && (
                      <span className="px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                        <AlertTriangle size={11} />
                        <span>BLANCO HAVA</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Métricas del Sector */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Disponibilidad Energética:</span>
                    <span className="text-sm font-bold font-mono text-cyan-300">{selectedDeckSector.energyPct}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Régimen Térmico:</span>
                    <span className="text-sm font-bold font-mono text-amber-300">{selectedDeckSector.tempRange}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Condiciones Ambientales y Estructurales:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedDeckSector.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Dinámica Social y Modos de Vida:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedDeckSector.socialLife}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold">
                    Localizaciones Canónicas en este Sector:
                  </span>
                  <div className="space-y-1">
                    {selectedDeckSector.notableLocations.map((loc, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{loc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bloque de Anotaciones del Autor */}
            {selectedDeckSector && (
              <AuthorNotesBlock
                noteKey={`deck_${selectedDeckSector.deckRange}`}
                title={`Sector ${selectedDeckSector.deckRange} (${selectedDeckSector.name.split('//')[0]})`}
                placeholder={`Anotaciones del autor para ${selectedDeckSector.deckRange}: vida cotidiana, temperatura, facciones locales o sucesos...`}
                noteValue={loreStore.customNotes[`deck_${selectedDeckSector.deckRange}`] || ''}
                onUpdateNote={handleUpdateNote}
              />
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 3: PERSONAJES & LAZOS DRAMÁTICOS                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'personajes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Lista de Personajes y Filtro */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                  <Users size={14} />
                  <span>Protagonistas & Figuras Clave</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{filteredCharacters.length} Fichas</span>
              </div>

              <div className="relative">
                <Search size={13} className="absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar personaje por nombre, cubierta o rol..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-200 placeholder:text-slate-600 outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredCharacters.map(char => {
                  const isSelected = selectedCharacter?.id === char.id;
                  const hasCharNotes = Boolean(loreStore.customNotes[`char_${char.id}`]?.trim());
                  return (
                    <div
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacterId(char.id);
                        playWordResonance('Khor');
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/50 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-mono font-bold text-white">{char.name}</h4>
                          {hasCharNotes && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title="Contiene notas del autor" />
                          )}
                        </div>
                        <span className="text-[10px] text-cyan-400 font-mono block">{char.alias}</span>
                        <span className="text-[9px] text-slate-500 font-sans block">{char.deckOrigin}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-400 font-bold block">{char.ageYears} años</span>
                        <span className="text-[9px] font-mono text-slate-500 block">{char.ageNemas} nemas</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dossier Extenso del Personaje */}
          <div className="lg:col-span-7 space-y-4">
            {selectedCharacter && (
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                      {selectedCharacter.faction} // {selectedCharacter.deckOrigin}
                    </span>
                    <h3 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider mt-0.5">
                      {selectedCharacter.name}
                    </h3>
                    <span className="text-xs font-mono text-amber-300 italic">«{selectedCharacter.alias}»</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEntity({ type: 'character', item: selectedCharacter })}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                      title="Editar Biografía, Rasgos, Dilema Moral y Arco Narrativo de este Personaje"
                    >
                      <Edit3 size={11} />
                      <span>Editar Personaje</span>
                    </button>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-cyan-300 block">{selectedCharacter.ageYears} Años</span>
                      <span className="text-[10px] font-mono text-slate-500 block">{selectedCharacter.ageNemas} Nemas</span>
                    </div>
                  </div>
                </div>

                {/* Cita Textual */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border-l-2 border-cyan-500 text-xs font-mono text-cyan-200 italic leading-relaxed">
                  {selectedCharacter.quote}
                </div>

                {/* Ficha Física y Psicológica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Rasgos y Aspecto:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedCharacter.physicalDesc}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Perfil Psicológico:</span>
                    <p className="text-slate-300 leading-relaxed">{selectedCharacter.psychology}</p>
                  </div>
                </div>

                {/* Dilema Moral */}
                <div className="pt-2 border-t border-white/5 space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest block font-bold">El Eje Moral & Dilema:</span>
                  <p className="text-slate-300 leading-relaxed font-sans">{selectedCharacter.moralDilemma}</p>
                </div>

                {/* Arma / Artefacto & Arco */}
                <div className="pt-2 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[9px] text-slate-400 block uppercase">Herramienta o Arma:</span>
                    <span className="text-slate-200">{selectedCharacter.weaponOrTool}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[9px] text-slate-400 block uppercase">Arco Narrativo:</span>
                    <span className="text-cyan-200">{selectedCharacter.arcSummary}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bloque de Anotaciones del Autor */}
            {selectedCharacter && (
              <AuthorNotesBlock
                noteKey={`char_${selectedCharacter.id}`}
                title={selectedCharacter.name}
                placeholder={`Anotaciones del autor sobre ${selectedCharacter.name}: desarrollo dramático, secretos, conexiones o evolución en los libros...`}
                noteValue={loreStore.customNotes[`char_${selectedCharacter.id}`] || ''}
                onUpdateNote={handleUpdateNote}
              />
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 4: CRONOSISTEMA & CALCULADORA                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'cronosistema' && (
        <div className="space-y-6 animate-fade-in">
          {/* HERO BANNER: ACCESO DIRECTO NATIVO A HOROCRONO */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.18)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Details */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    APP NATIVA DE ESCRITORIO
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    ALWAYS-ON-TOP MINI-HUD
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    CALENDARIO NEMA & 12 ZOU
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-2xl text-white tracking-wide flex items-center gap-2.5">
                    <Clock className="w-6 h-6 text-cyan-400 animate-pulse" />
                    <span>HOROCRONO // HOROLOGIO & CRONOSISTEMA</span>
                  </h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed mt-1">
                    Aplicación autónoma para Windows sincronizada con el ritmo biológico y computacional de la Estación (Tala de 48h, 1 Vira = 0.659s). Incluye widget flotante personalizable Always-On-Top, cronómetro binario, temporizador de guardias, conversor universal y el nuevo <strong className="text-cyan-300">Calendario Transversal con las 12 Fases Zou</strong> y efemérides de la nave.
                  </p>
                </div>

                {/* Telemetry pill */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                  <span className="text-cyan-300">
                    1 Tala = <strong className="text-white">48 horas</strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-amber-300">
                    1 Vira = <strong className="text-white">0.65918s (1.517 Hz)</strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-purple-300">
                    1 Nema = <strong className="text-white">16 Talas (32 días)</strong>
                  </span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => handleLaunchHorocrono('main')}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono tracking-wider shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <ExternalLink size={15} />
                  <span>ABRIR HOROCRONO (APP COMPLETA)</span>
                </button>

                <button
                  onClick={() => handleLaunchHorocrono('minihud')}
                  className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-xs font-mono tracking-wider flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Pin size={15} />
                  <span>LANZAR MINI-HUD FLOTANTE</span>
                </button>

                {/* Status alert message */}
                {horocronoLaunchStatus && (
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/50 text-[11px] font-mono text-cyan-300 text-center animate-fade-in shadow-lg">
                    {horocronoLaunchStatus}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Medidas Binarias */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>Estructura Técnica Binaria (Potencias de 2)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Cronosistema Oficial</span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Sin ciclos solares, la Estación Humanidad adoptó un sistema matemático binario perfecto para integrarse con los procesadores del reactor, manteniendo la Tala (48 horas) como nuevo ritmo biológico circadiano humano.
              </p>

              <div className="space-y-1.5">
                {CHRONOSYSTEM_TABLE.map(u => (
                  <div key={u.unit} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-300 font-bold">{u.unit} ({u.symbol})</span>
                        <span className="text-[10px] text-slate-500">[{u.multiplier}]</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans block">{u.description}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-amber-300 font-bold block">{u.earthEquivalent}</span>
                      <span className="text-[9px] text-slate-500 block truncate max-w-[150px]">{u.contextUsage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calculadora Biológica Interactiva */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 space-y-5 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold font-rajdhani text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} />
                  <span>Calculadora de Edad en Nemas</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  Conversión canónica de Años Terrestres a Meses de Estación
                </span>
              </div>

              {/* Input Años Terrestres */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Años Terrestres:</span>
                  <span className="text-cyan-300 font-bold">{calcYears} años</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="120"
                  value={calcYears}
                  onChange={(e) => {
                    const y = Number(e.target.value);
                    setCalcYears(y);
                    setCalcNemas(Math.round((y * 365.25) / 32));
                  }}
                  className="w-full accent-cyan-500 bg-white/10 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Resultado en Nemas y Talas */}
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/40 space-y-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Edad Oficial en la Nave:</span>
                  <span className="text-2xl font-bold text-cyan-200">{calcNemas} NEMAS</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[9px] text-slate-500 block">TALAS (48H):</span>
                    <span className="text-amber-300 font-bold">{calcNemas * 16} Talas</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">SEMAS (6H):</span>
                    <span className="text-amber-300 font-bold">{calcNemas * 16 * 8} Semas</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] text-slate-400 font-sans leading-relaxed">
                💡 <strong className="text-slate-200">Dato Canónico:</strong> Decir la edad en "Años" dentro de las cubiertas medias se considera una herejía nostálgica propia de los Terranáuticos o de la secta Nih'Sol. Todos los censos oficiales computan la existencia en Nemas de 32 días terrestres.
              </div>
            </div>

            {/* Bloque de Anotaciones del Autor */}
            <AuthorNotesBlock
              noteKey="cronosistema_notes"
              title="Cronosistema & Medidas Binarias"
              placeholder="Ideas y reflexiones del autor sobre las viras, fulas, semas, kromas y cómo influye el tiempo binario en la psique humana..."
              noteValue={loreStore.customNotes['cronosistema_notes'] || ''}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 5: LOS 9 VÓRTICES FILOSÓFICOS                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'vortices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Selector de Vórtices */}
          <div className="lg:col-span-5 space-y-2">
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                  <Compass size={14} />
                  <span>Los Nueve Vórtices de Iccarus Dern</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Filosofía Veyvān</span>
              </div>

              <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                {loreStore.vortices.map(v => {
                  const isSelected = selectedVortex?.id === v.id;
                  const hasVortexNotes = Boolean(loreStore.customNotes[`vortex_${v.id}`]?.trim());
                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedVortexId(v.id);
                        playWordResonance('Khor');
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-cyan-300 font-bold">
                            #{v.number}
                          </span>
                          <span className="text-xs font-mono font-bold text-white">{v.transversalName}</span>
                          {hasVortexNotes && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title="Contiene notas del autor" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans block">{v.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">{v.translation}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ficha Exegética del Vórtice */}
          <div className="lg:col-span-7 space-y-4">
            {selectedVortex && (
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4 shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                      Vórtice #{selectedVortex.number} // {selectedVortex.transversalName}
                    </span>
                    <h3 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider mt-0.5">
                      {selectedVortex.name}
                    </h3>
                    <span className="text-xs font-mono text-amber-300">«{selectedVortex.translation}»</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                    {selectedVortex.factionAssociation.split('/')[0]}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/20 border-l-2 border-cyan-500 text-xs font-mono text-cyan-200 italic leading-relaxed">
                  {selectedVortex.quote}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Principio Ontológico Fundamental:
                  </span>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {selectedVortex.corePrinciple}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Desarrollo e Impacto Sociológico:
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {selectedVortex.description}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs font-mono">
                  <span className="text-[9px] text-cyan-400 uppercase tracking-widest block font-bold">
                    Simbología y Trazo Sagrado Tael'im:
                  </span>
                  <span className="text-slate-300">{selectedVortex.symbolMeaning}</span>
                </div>
              </div>
            )}

            {/* Bloque de Anotaciones del Autor */}
            {selectedVortex && (
              <AuthorNotesBlock
                noteKey={`vortex_${selectedVortex.id}`}
                title={`Vórtice #${selectedVortex.number}: ${selectedVortex.name}`}
                placeholder="Anotaciones filosóficas sobre este vórtice, su influencia en las sectas y su simbolismo..."
                noteValue={loreStore.customNotes[`vortex_${selectedVortex.id}`] || ''}
                onUpdateNote={handleUpdateNote}
              />
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 6: DOSSIER HAVA // ALERTA ROJA (CLASIFICADO)                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'hava' && (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-rose-950/30 via-slate-950 to-black/90 border border-rose-500/40 space-y-6 shadow-[0_0_50px_rgba(244,63,94,0.15)] animate-fade-in">
          <div className="flex items-center justify-between border-b border-rose-500/30 pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <AlertTriangle size={20} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold">
                  CLASIFICACIÓN: OBSIDIANA / SOLO ALTA CONSEJERÍA
                </span>
                <h3 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider">
                  Protocolo de Deriva Exotérmica 49-B // Proyecto HAVA
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-rose-950/80 border border-rose-500/50 text-rose-200 font-bold">
              ESTADO: FASE FINAL DE EJECUCIÓN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
            <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-white/5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                1. La Mentira Técnica (Versión Oficial):
              </span>
              <p className="text-slate-300 leading-relaxed">
                El frenado orbital frente a la gigante azul Phaetim desatará un pico monumental de radiación Gamma y calor que los escudos del Reactor Principal no pueden absorber sin riesgo de colapso térmico. Se alega que los polos deben actuar como "disipadores de sacrificio".
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
              <span className="text-[10px] font-mono text-rose-300 uppercase tracking-widest block font-bold">
                2. La Verdad Eugénica (Doctrina Vireus):
              </span>
              <p className="text-slate-200 leading-relaxed">
                HAVA es una herramienta de eugenesia estructural premeditada. Al desviar intencionalmente los blindajes de las cubiertas C217 a C320, se aniquila al <strong>73% de la población periférica (~12.000 a 15.000 almas)</strong>, eliminando bocas que no caben en los cálculos de llegada a Protozeus.
              </p>
            </div>
          </div>

          {/* Tres Fases de Ejecución */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block font-bold">
              Fases Cronológicas del Evento:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-amber-400 font-bold block">FASE 1: EL SELLADO</span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  Días -5 a -2. Cierre hermético de compuertas blindadas de la Zona Media. Nadie puede descender a las zonas seguras.
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-rose-400 font-bold block">FASE 2: REDIRECCIÓN</span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  Día del Émulo / Frenado en Phaetim. Los inyectores purgan refrigerante polar y abren corredores de radiación Gamma hacia C320.
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                <span className="text-rose-300 font-bold block">FASE 3: DERIVA RESIDUAL</span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  4 a 6 horas de baño ionizante crítico. Fallo celular agudo masivo y esterilización biológica de 208 cubiertas.
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-rose-500/20 text-xs font-mono text-rose-200 italic">
            «La Estación es un organismo. Si no mudamos la piel muerta, el corazón se detiene. HAVA no es crueldad; es pura fisiología.» — Vireus
          </div>

          {/* Bloque de Anotaciones del Autor */}
          <AuthorNotesBlock
            noteKey="hava_notes"
            title="Dossier HAVA (Obsidiana)"
            placeholder="Notas del autor sobre la conspiración HAVA, quiénes conocen el plan, cómo se resistirán los personajes del infierno polar..."
            noteValue={loreStore.customNotes['hava_notes'] || ''}
            onUpdateNote={handleUpdateNote}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 7: SOCIEDAD, CASTAS & DROGAS                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'sociedad' && (
        <div className="space-y-6 animate-fade-in">
          {/* Los Alévoros y las Fiestas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold block">
                Los Alévoros // El Voto Dun'Val'Thy
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Casta de sirvientes-sacerdotes consagrados a la estética del Émulo. Su nombre proviene de <em>Ael</em> (Elevado) + <em>Vor</em> (Servir). Bajo el juramento sagrado <strong>Dun'Val'Thy</strong> ("El Silencio del Yo"), renuncian a la propiedad, a tener hijos (esterilidad químico-ritual) y a amar a otra persona. Dreda Aran comete herejía al amar a Komokaru.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold block">
                Dualidad Festiva: El Émulo vs Las Cubiertas
              </span>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Mientras la élite festeja el <strong>Día del Émulo</strong> paseando bajo árboles reales y comiendo frutas frescas, las cubiertas polares celebran las <strong>Vigilias del Frío</strong> encendiendo velas clandestinas de grasa y la <strong>Comunión de la Levadura</strong> de Mephesgeister, compartiendo pan fermentado en secreto.
              </p>
            </div>
          </div>

          {/* Compendio de Sustancias */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold flex items-center gap-1.5">
                <Pill size={14} />
                <span>Compendio Farmacológico y Sustancias</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Química de Estación</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {loreStore.substances.map(sub => (
                <div key={sub.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-white">{sub.name}</h4>
                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      sub.legalStatus === 'prohibida' ? 'bg-rose-500/20 text-rose-300' :
                      (sub.legalStatus === 'restringida' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300')
                    }`}>
                      {sub.legalStatus}
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono block">{sub.category}</span>
                  <p className="text-[11px] text-slate-400 font-sans leading-tight">{sub.effects}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque de Anotaciones del Autor */}
          <AuthorNotesBlock
            noteKey="sociedad_notes"
            title="Castas, Alévoros & Farmacología"
            placeholder="Nuevas sustancias, efectos psicotrópicos, rituales de los Alévoros y dinámicas sociales..."
            noteValue={loreStore.customNotes['sociedad_notes'] || ''}
            onUpdateNote={handleUpdateNote}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 8: LA NOVELA (3 LIBROS // OBRA UNITARIA)                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'novela' && (
        <div className="space-y-6 animate-fade-in">
          {/* Selector de Libro */}
          <div className="grid grid-cols-3 gap-3">
            {loreStore.trilogy.map((b, bIdx) => (
              <button
                key={b.bookNumber}
                onClick={() => setSelectedBookIndex(bIdx)}
                className={`p-4 rounded-3xl border text-left transition-all cursor-pointer space-y-1 ${
                  selectedBookIndex === bIdx
                    ? 'border-cyan-500 bg-cyan-950/50 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                    : 'border-white/5 bg-slate-950/80 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                  LIBRO {b.bookNumber}
                </span>
                <h4 className="text-sm font-bold font-rajdhani text-white uppercase">{b.title}</h4>
                <span className="text-[10px] text-slate-500 font-sans block">{b.subtitle}</span>
              </button>
            ))}
          </div>

          {/* Desglose del Libro Seleccionado */}
          {loreStore.trilogy[selectedBookIndex] && (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-5 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                    {loreStore.trilogy[selectedBookIndex].timelineLabel}
                  </span>
                  <h3 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider mt-0.5">
                    Libro {loreStore.trilogy[selectedBookIndex].bookNumber}: {loreStore.trilogy[selectedBookIndex].title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-amber-300 italic">
                  «{loreStore.trilogy[selectedBookIndex].subtitle}»
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  Tesis Central del Libro:
                </span>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">
                  {loreStore.trilogy[selectedBookIndex].theme}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  Sinopsis Argumental:
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {loreStore.trilogy[selectedBookIndex].summary}
                </p>
              </div>

              {/* Capítulos y Pérdidas */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block font-bold">
                  Capítulos Canónicos Destacados:
                </span>
                <div className="space-y-2">
                  {loreStore.trilogy[selectedBookIndex].keyChapters.map(chap => (
                    <div key={chap.number} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-200 font-mono">
                          Capítulo {chap.number}: {chap.title}
                        </span>
                        <span className="text-[9px] font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                          Pérdida: {chap.loss}
                        </span>
                      </div>
                      <p className="text-slate-300 font-sans">{chap.synopsis}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bloque de Anotaciones del Autor */}
          <AuthorNotesBlock
            noteKey={`book_${selectedBookIndex}`}
            title={`Trilogía: Libro ${selectedBookIndex + 1}`}
            placeholder="Nuevos capítulos, ideas de trama, puntos de giro o pérdidas para este libro..."
            noteValue={loreStore.customNotes[`book_${selectedBookIndex}`] || ''}
            onUpdateNote={handleUpdateNote}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 9: ORÁCULO DE THALIOS SOLARIS (IA)                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'oraculo' && (
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 space-y-4 shadow-[0_0_50px_rgba(34,211,238,0.15)] animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold font-rajdhani text-white uppercase tracking-wider">
                  Terminal de Consulta Thalios Solaris // IA Omnisciente
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">
                  Acceso directo a la memoria viva de los 344 años de Estación Humanidad
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NÚCLEO ONLINE</span>
            </span>
          </div>

          {/* Historial de Conversación */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {oracleLog.map((msg, mIdx) => (
              <div
                key={mIdx}
                className={`p-4 rounded-2xl text-xs font-sans space-y-1.5 animate-fade-in ${
                  msg.role === 'thalios'
                    ? 'bg-cyan-950/30 border border-cyan-500/30 text-slate-200'
                    : 'bg-white/5 border border-white/10 text-cyan-100 ml-8'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-slate-400">
                  <span className="font-bold text-cyan-400">
                    {msg.role === 'thalios' ? 'Thalios Solaris' : 'Iniciado'}
                  </span>
                  {msg.source && <span className="text-slate-500">{msg.source}</span>}
                </div>
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              </div>
            ))}
            {isOracleThinking && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono text-cyan-300 animate-pulse flex items-center gap-2">
                <Sparkles size={13} className="animate-spin" />
                <span>Thalios Solaris procesando bancos de memoria de 320 cubiertas...</span>
              </div>
            )}
          </div>

          {/* Consultas Rápidas Recomendadas */}
          <div className="space-y-1.5 pt-2 border-t border-white/5">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
              Consultas Canónicas Frecuentes:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
              {[
                "¿Qué es exactamente el Proyecto HAVA?",
                "¿Por qué el reactor solo rinde al 42% tras el Apagón?",
                "¿Qué castigo recibe un Alévoro si se enamora?",
                "¿Cómo sobreviven en el Infierno polar?",
                "¿Cuánto falta para llegar a Protozeus?"
              ].map(q => (
                <button
                  key={q}
                  onClick={() => handleAskOracle(q)}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-cyan-950/60 border border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-200 transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Formulario de Entrada */}
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <input
              type="text"
              value={oracleQuery}
              onChange={(e) => setOracleQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskOracle();
              }}
              placeholder="Pregunta a Thalios Solaris sobre la historia, secretos, personajes o cubiertas..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-200 placeholder:text-slate-600 outline-none focus:border-cyan-500/60"
            />
            <button
              onClick={() => handleAskOracle()}
              disabled={isOracleThinking || !oracleQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <Send size={13} />
              <span>Consultar</span>
            </button>
          </div>

          {/* Bloque de Anotaciones del Autor */}
          <AuthorNotesBlock
            noteKey="oraculo_notes"
            title="Oráculo Cuántico Thalios Solaris"
            placeholder="Secretos que Thalios guarda, fallos en la IA cuántica o ideas para interacciones..."
            noteValue={loreStore.customNotes['oraculo_notes'] || ''}
            onUpdateNote={handleUpdateNote}
          />
        </div>
      )}

        </main>
      </div>

      {/* MODAL DE EDICIÓN UNIVERSAL DEL LORE */}
      <LoreEditModal
        entity={editingEntity}
        onClose={() => setEditingEntity(null)}
        onSave={handleSaveEntity}
      />
      </div>
    </LoreNotesContext.Provider>
  );
};

export default LoreAtlas;
