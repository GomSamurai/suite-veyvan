import React, { useState, useEffect, useMemo } from 'react';
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
  Scale
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
  ThalvusWork
} from '../data/stationLoreData';
import { playWordResonance } from '../utils/taelimAudio';
import { getAiClient, getGeminiModel } from '../services/geminiService';

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

const LoreAtlas: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<LoreSubTab>('lideres');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estados de Inspección de Modales / Detalles
  const [selectedLeader, setSelectedLeader] = useState<LeaderProfile>(LEADERS_GALLERY[0]);
  const [selectedThalvusWork, setSelectedThalvusWork] = useState<ThalvusWork>(JOREN_THALVUS_DATA.works[0]);
  const [selectedBlackoutMonthIndex, setSelectedBlackoutMonthIndex] = useState<number>(0);
  const [selectedDeckSector, setSelectedDeckSector] = useState<DeckSector | null>(DECK_ZONING[3]); // C233 por defecto
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterDossier | null>(CHARACTERS_DATABASE[0]); // Pwaoo
  const [selectedEra, setSelectedEra] = useState<HistoricalEra | null>(HISTORICAL_TIMELINE[5]); // Presente
  const [selectedVortex, setSelectedVortex] = useState<PhilosophicalVortex | null>(PHILOSOPHICAL_VORTICES[0]); // Vor-Veheli
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0);
  const [deckSearchQuery, setDeckSearchQuery] = useState<string>('');

  // Calculadora de Cronosistema
  const [calcYears, setCalcYears] = useState<number>(28);
  const [calcNemas, setCalcNemas] = useState<number>(319);

  // Reloj de la Estación en Vivo (Simulado en Viras)
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
    if (!searchTerm.trim()) return CHARACTERS_DATABASE;
    const q = searchTerm.toLowerCase();
    return CHARACTERS_DATABASE.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.alias.toLowerCase().includes(q) || 
      c.deckOrigin.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  // Salto a cubierta por número
  const handleJumpToDeck = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(deckSearchQuery.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num >= 1 && num <= 320) {
      const found = DECK_ZONING.find(sec => {
        const parts = sec.deckRange.replace(/C/g, '').split('-').map(s => parseInt(s.trim(), 10));
        return num >= parts[0] && num <= parts[1];
      });
      if (found) setSelectedDeckSector(found);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
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

          {/* Reloj Activo del Cronosistema */}
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
              Ciclo 2952 d.C. // Maniobra en Phaetim
            </span>
          </div>
        </div>

        {/* MÉTRICAS GLOBALES VITALES */}
        <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Tiempo de Viaje:</span>
            <span className="text-sm font-bold font-mono text-cyan-300">344 AÑOS</span>
            <span className="text-[9px] text-slate-500 block">2672 ➔ 2952 d.C.</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Estructura Vertical:</span>
            <span className="text-sm font-bold font-mono text-cyan-300">320 CUBIERTAS</span>
            <span className="text-[9px] text-slate-500 block">20 km de altura total</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Población Activa:</span>
            <span className="text-sm font-bold font-mono text-cyan-300">1.200.000</span>
            <span className="text-[9px] text-slate-500 block">8% del diseño original</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Potencia Reactor:</span>
            <span className="text-sm font-bold font-mono text-amber-300">42% (MUTILADO)</span>
            <span className="text-[9px] text-slate-500 block">Post-Apagón año 72.4</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Ubicación Actual:</span>
            <span className="text-sm font-bold font-mono text-cyan-300">PHAETIM</span>
            <span className="text-[9px] text-slate-500 block">Gigante Azul de frenado</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[9px] font-mono text-slate-400 block uppercase">Destino Final:</span>
            <span className="text-sm font-bold font-mono text-emerald-300">PROTOZEUS</span>
            <span className="text-[9px] text-slate-500 block">3023 d.C. (71 años)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NAVEGACIÓN POR VENTANAS DE LORE (13 VENTANAS MAESTRAS)                    */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar text-xs font-rajdhani uppercase tracking-wider font-bold">
        {[
          { id: 'lideres' as LoreSubTab, label: 'Grandes Líderes (8)', icon: <Crown size={14} /> },
          { id: 'thalvus' as LoreSubTab, label: 'Especial Joren Thalvus', icon: <BookMarked size={14} /> },
          { id: 'evolucion-madres' as LoreSubTab, label: 'Evolución & Dos Madres', icon: <Scale size={14} /> },
          { id: 'dorada-apagon' as LoreSubTab, label: 'Época Dorada & Apagón', icon: <Sun size={14} /> },
          { id: 'cronica' as LoreSubTab, label: 'Crónica (344 Años)', icon: <Orbit size={14} /> },
          { id: 'cubiertas' as LoreSubTab, label: '320 Cubiertas', icon: <Layers size={14} /> },
          { id: 'personajes' as LoreSubTab, label: 'Personajes & Lazos', icon: <Users size={14} /> },
          { id: 'cronosistema' as LoreSubTab, label: 'Cronosistema', icon: <Clock size={14} /> },
          { id: 'vortices' as LoreSubTab, label: 'Los 9 Vórtices', icon: <Compass size={14} /> },
          { id: 'hava' as LoreSubTab, label: 'Dossier HAVA', icon: <AlertTriangle size={14} />, alert: true },
          { id: 'sociedad' as LoreSubTab, label: 'Castas & Drogas', icon: <Pill size={14} /> },
          { id: 'novela' as LoreSubTab, label: 'La Novela (3 Libros)', icon: <BookOpen size={14} /> },
          { id: 'oraculo' as LoreSubTab, label: 'Oráculo Thalios (IA)', icon: <Sparkles size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              playWordResonance('Khor');
            }}
            className={`px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
              activeSubTab === tab.id
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.35)] ring-1 ring-cyan-500/40'
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className={activeSubTab === tab.id ? 'text-cyan-300' : 'text-slate-500'}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.alert && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Clasificado Obsidiana" />
            )}
          </button>
        ))}
      </div>

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
                {LEADERS_GALLERY.map((leader, lIdx) => {
                  const isSelected = selectedLeader.id === leader.id;
                  return (
                    <div
                      key={leader.id}
                      onClick={() => {
                        setSelectedLeader(leader);
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
                        <span className="text-[10px] font-mono text-slate-400">
                          {leader.period}
                        </span>
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
                  <span className="text-xs font-mono text-slate-400">
                    Mandato: <strong className="text-slate-200">{selectedLeader.period}</strong> ({selectedLeader.mandateYears} años)
                  </span>
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
                {JOREN_THALVUS_DATA.works.map((work) => {
                  const isSelected = selectedThalvusWork.id === work.id;
                  return (
                    <div
                      key={work.id}
                      onClick={() => {
                        setSelectedThalvusWork(work);
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
                    <span className="text-xs font-mono text-slate-400">
                      Año: {selectedThalvusWork.year}
                    </span>
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
                {HISTORICAL_TIMELINE.map((era, eIdx) => {
                  const isSelected = selectedEra?.id === era.id;
                  return (
                    <div
                      key={era.id}
                      onClick={() => setSelectedEra(era)}
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
                        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          era.status === 'presente' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' 
                            : (era.status === 'futura' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500')
                        }`}>
                          {era.status}
                        </span>
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
          <div className="lg:col-span-7">
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
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-200">
                    Estado: {selectedEra.status.toUpperCase()}
                  </span>
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
                {DECK_ZONING.map(sector => {
                  const isSelected = selectedDeckSector?.id === sector.id;
                  return (
                    <div
                      key={sector.id}
                      onClick={() => setSelectedDeckSector(sector)}
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
                        <span className="text-[10px] font-mono font-bold block text-amber-300">
                          {sector.energyPct}
                        </span>
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
          <div className="lg:col-span-6">
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

                  {selectedDeckSector.havaImpact && (
                    <span className="px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                      <AlertTriangle size={11} />
                      <span>BLANCO HAVA</span>
                    </span>
                  )}
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
                  return (
                    <div
                      key={char.id}
                      onClick={() => setSelectedCharacter(char)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/50 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white">{char.name}</h4>
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
          <div className="lg:col-span-7">
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
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-300 block">{selectedCharacter.ageYears} Años Terrestres</span>
                    <span className="text-[10px] font-mono text-slate-500 block">{selectedCharacter.ageNemas} Nemas de Vida</span>
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
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 4: CRONOSISTEMA & CALCULADORA                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'cronosistema' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* Tabla de Medidas Binarias */}
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
                {PHILOSOPHICAL_VORTICES.map(v => {
                  const isSelected = selectedVortex?.id === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVortex(v)}
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
          <div className="lg:col-span-7">
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
              {SUBSTANCES_COMPENDIUM.map(sub => (
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* VENTANA 8: LA NOVELA (3 LIBROS // OBRA UNITARIA)                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'novela' && (
        <div className="space-y-6 animate-fade-in">
          {/* Selector de Libro */}
          <div className="grid grid-cols-3 gap-3">
            {NOVEL_TRILOGY_BREAKDOWN.map((b, bIdx) => (
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
          {NOVEL_TRILOGY_BREAKDOWN[selectedBookIndex] && (
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-5 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                    {NOVEL_TRILOGY_BREAKDOWN[selectedBookIndex].timelineLabel}
                  </span>
                  <h3 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider mt-0.5">
                    Libro {NOVEL_TRILOGY_BREAKDOWN[selectedBookIndex].bookNumber}: {NOVEL_TRILOGY_BREAKDOWN[selectedBookIndex].title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-amber-300 italic">
                  «{NOVEL_TRILOGY_BREAKDOWN[selectedBookIndex].subtitle}»
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  Tesis Central del Libro:
                </span>
                <p className="text-xs text-slate-200 font-sans leading-relaxed">
                  {NOVEL_TRILOGY_BREAKDOWN[selectedBookIndex].theme}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  Sinopsis Argumental:
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {NOVEL_TRILOGY_BREAKDOWN[selectedBookIndex].summary}
                </p>
              </div>

              {/* Capítulos y Pérdidas */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest block font-bold">
                  Capítulos Canónicos Destacados:
                </span>
                <div className="space-y-2">
                  {NOVEL_TRILOGY_BREAKDOWN[selectedBookIndex].keyChapters.map(chap => (
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
        </div>
      )}
    </div>
  );
};

export default LoreAtlas;
