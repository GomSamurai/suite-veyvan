import {
  STATION_GLOBAL_METRICS,
  HISTORICAL_TIMELINE,
  DECK_ZONING,
  CHARACTERS_DATABASE,
  PHILOSOPHICAL_VORTICES,
  CHRONOSYSTEM_TABLE,
  SUBSTANCES_COMPENDIUM,
  NOVEL_TRILOGY_BREAKDOWN,
  LEADERS_GALLERY,
  JOREN_THALVUS_DATA,
  EVOLUCION_CONSCIENTE_DATA,
  DOS_MADRES_DATA,
  EPOCA_DORADA_DATA,
  GRAN_APAGON_DATA,
  StationGlobalMetrics,
  LeaderProfile,
  CharacterDossier,
  DeckSector,
  HistoricalEra,
  PhilosophicalVortex,
  ThalvusWork
} from '../data/stationLoreData';
import { detectLoreEntitiesInText } from './loreEntitiesRegistry';

export type NoteThematicCategory = 
  | 'canon'            // Canon & Verdad Revelada
  | 'borrador'         // Borrador de Escena
  | 'personaje'        // Psicología & Vínculos
  | 'filosofia'        // Filosofía & Vórtices
  | 'farmacologia'     // Sustancias & Quimio
  | 'topologia'        // Cubiertas & Arquitectura
  | 'conspiracion'     // Secretos & Dossier HAVA
  | 'cronosistema'     // Tiempo & Ritmos
  | 'sociedad'         // Castas, Tabúes & Alévoros
  | 'novela'           // Trilogía & Trama
  | 'duda_pendiente'   // Pregunta / Investigación abierta
  | string;            // Temáticas personalizadas dinámicas creadas por el autor

export type NotePriority = 'crucial' | 'alta' | 'media' | 'borrador';

export type SmartLinkType = 
  | 'personaje'
  | 'facción'
  | 'cubierta'
  | 'sustancia'
  | 'vortice'
  | 'transversal'
  | 'historia'
  | 'novela'
  | 'hava'
  | 'cronosistema'
  | 'apunte'
  | 'personalizado';

export interface SmartLoreLink {
  id: string;               // Identificador o slug (ej: 'dreda', 'hexpace', 'sec-polares', 'note_123')
  type: SmartLinkType;      // Categoría de la entidad vinculada
  name: string;             // Nombre visible (ej: 'Dreda Aran', 'Hexpace', 'Zona Polar // C302-320')
  role?: string;            // Rol de la relación (ej: 'Protagonista', 'Causa', 'Escenario', 'Regla Canónica')
  detail?: string;          // Breve contexto o descripción (ej: 'Alévora', 'Estimulante Sintético')
  color?: string;           // Color de acento visual
}

export interface AuthorNoteLinkedEntities {
  characterIds?: string[];       // Ej: ['vorlemm', 'pwaoo', 'dreda']
  deckRanges?: string[];         // Ej: ['C201-C240', 'C001-C040']
  substanceNames?: string[];     // Ej: ['Hexpace', 'Soma']
  eras?: string[];               // Ej: ['Gran Apagón', 'Época Dorada']
  vortices?: string[];           // Ej: ['vor-veheli']
}

export interface AuthorNote {
  id: string;                      // Identificador único
  sectionId: string;               // Subpestaña o clave de sección ('sociedad', 'cubiertas', 'personajes', etc.)
  key?: string;                    // Clave específica opcional (ej: 'sociedad_notes', 'deck_C201-C240_notes')
  title: string;                   // Título del apunte
  content: string;                 // Cuerpo del texto o reflexión
  category: NoteThematicCategory;  // Categoría temática dinámica o canónica
  customTag?: string;              // Etiqueta personalizada (#tag)
  priority?: NotePriority;         // Nivel de relevancia
  isPinned?: boolean;              // Fijada al inicio
  smartLinks?: SmartLoreLink[];    // Vínculos inteligentes enriquecidos y configurables
  linkedEntities?: AuthorNoteLinkedEntities; // Compatibilidad histórica
  createdAt: string;               // ISO Timestamp
  updatedAt: string;               // ISO Timestamp
}

export interface LoreStoreData {
  metrics: StationGlobalMetrics;
  leaders: LeaderProfile[];
  thalvus: typeof JOREN_THALVUS_DATA;
  evolucion: typeof EVOLUCION_CONSCIENTE_DATA;
  madres: typeof DOS_MADRES_DATA;
  dorada: typeof EPOCA_DORADA_DATA;
  apagon: typeof GRAN_APAGON_DATA;
  timeline: HistoricalEra[];
  decks: DeckSector[];
  characters: CharacterDossier[];
  vortices: PhilosophicalVortex[];
  substances: typeof SUBSTANCES_COMPENDIUM;
  trilogy: typeof NOVEL_TRILOGY_BREAKDOWN;
  authorNotes?: AuthorNote[]; // Ecosistema enriquecido de apuntes múltiples
  customThematics?: string[]; // Temáticas personalizadas creadas por el autor
  customNotes: Record<string, string>; // Mapeo de compatibilidad histórica
  lastModified?: string;
}

const STORAGE_KEY = 'taelvohn_station_lore_custom_v2';

export const getDefaultLoreStore = (): LoreStoreData => {
  return {
    metrics: { ...STATION_GLOBAL_METRICS },
    leaders: JSON.parse(JSON.stringify(LEADERS_GALLERY)),
    thalvus: JSON.parse(JSON.stringify(JOREN_THALVUS_DATA)),
    evolucion: JSON.parse(JSON.stringify(EVOLUCION_CONSCIENTE_DATA)),
    madres: JSON.parse(JSON.stringify(DOS_MADRES_DATA)),
    dorada: JSON.parse(JSON.stringify(EPOCA_DORADA_DATA)),
    apagon: JSON.parse(JSON.stringify(GRAN_APAGON_DATA)),
    timeline: JSON.parse(JSON.stringify(HISTORICAL_TIMELINE)),
    decks: JSON.parse(JSON.stringify(DECK_ZONING)),
    characters: JSON.parse(JSON.stringify(CHARACTERS_DATABASE)),
    vortices: JSON.parse(JSON.stringify(PHILOSOPHICAL_VORTICES)),
    substances: JSON.parse(JSON.stringify(SUBSTANCES_COMPENDIUM)),
    trilogy: JSON.parse(JSON.stringify(NOVEL_TRILOGY_BREAKDOWN)),
    authorNotes: [],
    customThematics: [],
    customNotes: {}
  };
};


export const normalizeThematicCategory = (cat?: string): string => {
  if (!cat || !cat.trim()) return 'Canon & Verdad';
  const c = cat.trim().toLowerCase();
  switch (c) {
    case 'sociedad':
    case 'castas & alévoros':
    case 'castas & alevoros':
      return 'Castas & Alévoros';
    case 'cronosistema':
    case 'tiempo & cronosistema':
      return 'Tiempo & Cronosistema';
    case 'topologia':
    case 'topología':
    case 'topología & cubiertas':
    case 'topologia & cubiertas':
      return 'Topología & Cubiertas';
    case 'canon':
    case 'canon & verdad':
      return 'Canon & Verdad';
    case 'filosofia':
    case 'filosofía':
    case 'filosofía & ontología':
    case 'filosofia & ontologia':
      return 'Filosofía & Ontología';
    case 'farmacologia':
    case 'farmacología':
    case 'farmacología & quimio':
    case 'farmacologia & quimio':
      return 'Farmacología & Quimio';
    case 'conspiracion':
    case 'conspiración':
    case 'dossier hava & secreto':
      return 'Dossier HAVA & Secreto';
    case 'novela':
    case 'trama & estructura':
      return 'Trama & Estructura';
    case 'borrador':
    case 'borrador de novela':
      return 'Borrador de Novela';
    case 'personaje':
    case 'personajes & vínculos':
    case 'personajes & vinculos':
      return 'Personajes & Vínculos';
    case 'duda_pendiente':
    case 'duda / por resolver':
      return 'Duda / Por Resolver';
    default:
      return cat;
  }
};

export const loadLoreStore = (): LoreStoreData => {
  const defaults = getDefaultLoreStore();
  if (typeof window === 'undefined') return defaults;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaults;

    let authorNotes: AuthorNote[] = Array.isArray(parsed.authorNotes) ? parsed.authorNotes : [];

    // Normalización de categoría y retro-vinculación inteligente
    authorNotes = authorNotes.map(n => {
      const normalizedCat = normalizeThematicCategory(n.category);
      let smartLinks = n.smartLinks ? [...n.smartLinks] : [];

      // 1. Migración de linkedEntities antiguos si existían
      if (smartLinks.length === 0 && n.linkedEntities) {
        if (n.linkedEntities.characterIds) {
          n.linkedEntities.characterIds.forEach(id => {
            smartLinks.push({ id, type: 'personaje', name: id, role: 'Mención' });
          });
        }
        if (n.linkedEntities.deckRanges) {
          n.linkedEntities.deckRanges.forEach(deck => {
            smartLinks.push({ id: deck, type: 'cubierta', name: deck, role: 'Escenario' });
          });
        }
        if (n.linkedEntities.substanceNames) {
          n.linkedEntities.substanceNames.forEach(sub => {
            smartLinks.push({ id: sub, type: 'sustancia', name: sub, role: 'Farmacología' });
          });
        }
        if (n.linkedEntities.vortices) {
          n.linkedEntities.vortices.forEach(v => {
            smartLinks.push({ id: v, type: 'vortice', name: v, role: 'Doctrina' });
          });
        }
      }

      // 2. Si aún no tiene vínculos, auto-detectar menciones en el texto
      if (smartLinks.length === 0 && n.content) {
        const detected = detectLoreEntitiesInText(n.content);
        if (detected.length > 0) {
          smartLinks = detected.map(ent => ({
            id: ent.id,
            type: ent.type,
            name: ent.name,
            role: ent.roleHint || 'Mención',
            detail: ent.detail
          }));
        }
      }

      return {
        ...n,
        category: normalizedCat,
        smartLinks: smartLinks.length > 0 ? smartLinks : undefined
      };
    });

    // MIGRACIÓN AUTOMÁTICA Y TRANSPARENTE:
    // Si parsed.customNotes tiene textos pero authorNotes está vacío o no contiene esas notas,
    // creamos automáticamente los objetos AuthorNote para preservar cada palabra escrita por el autor.
    if (parsed.customNotes && typeof parsed.customNotes === 'object') {
      for (const [key, text] of Object.entries(parsed.customNotes as Record<string, string>)) {
        if (text && typeof text === 'string' && text.trim().length > 0) {
          const alreadyMigrated = authorNotes.some(n => n.key === key || n.content === text);
          if (!alreadyMigrated) {
            let sectionId = 'sociedad';
            let cat = 'Castas & Alévoros';
            let title = 'Apunte Canónico del Autor';

            if (key.includes('sociedad')) {
              sectionId = 'sociedad';
              cat = 'Castas & Alévoros';
              title = 'Reflexión // Castas, Alévoros & Farmacología';
            } else if (key.includes('cronosistema')) {
              sectionId = 'cronosistema';
              cat = 'Tiempo & Cronosistema';
              title = 'Anotaciones de Cronosistema & Tiempo';
            } else if (key.includes('leader_')) {
              sectionId = 'lideres';
              cat = 'Canon & Verdad';
              title = 'Notas sobre Liderazgo';
            } else if (key.includes('deck_')) {
              sectionId = 'cubiertas';
              cat = 'Topología & Cubiertas';
              title = 'Detalles de Cubierta';
            } else if (key.includes('char_')) {
              sectionId = 'personajes';
              cat = 'Personajes & Vínculos';
              title = 'Perfil Psicológico de Personaje';
            } else if (key.includes('thalvus')) {
              sectionId = 'thalvus';
              cat = 'Filosofía & Ontología';
              title = 'Tratados & Ner\'Val';
            } else if (key.includes('hava')) {
              sectionId = 'hava';
              cat = 'Dossier HAVA & Secreto';
              title = 'Dossier Clasificado HAVA';
            } else if (key.includes('novela') || key.includes('book_')) {
              sectionId = 'novela';
              cat = 'Trama & Estructura';
              title = 'Ideas para la Trilogía';
            } else if (key.includes('vortex_')) {
              sectionId = 'vortices';
              cat = 'Filosofía & Ontología';
              title = 'Doctrina de los 9 Vórtices';
            }

            // Detectar vínculos automáticamente en el texto migrado
            const detected = detectLoreEntitiesInText(text);
            const smartLinks = detected.map(ent => ({
              id: ent.id,
              type: ent.type,
              name: ent.name,
              role: ent.roleHint || 'Mención',
              detail: ent.detail
            }));

            authorNotes.push({
              id: `note_migrated_${key}_${Date.now()}`,
              sectionId,
              key,
              title,
              content: text,
              category: cat,
              priority: 'crucial',
              isPinned: true,
              smartLinks: smartLinks.length > 0 ? smartLinks : undefined,
              createdAt: parsed.lastModified || new Date().toISOString(),
              updatedAt: parsed.lastModified || new Date().toISOString()
            });
          }
        }
      }
    }

    return {
      metrics: { ...defaults.metrics, ...(parsed.metrics || {}) },
      leaders: Array.isArray(parsed.leaders) && parsed.leaders.length > 0 ? parsed.leaders : defaults.leaders,
      thalvus: parsed.thalvus || defaults.thalvus,
      evolucion: parsed.evolucion || defaults.evolucion,
      madres: parsed.madres || defaults.madres,
      dorada: parsed.dorada || defaults.dorada,
      apagon: parsed.apagon || defaults.apagon,
      timeline: Array.isArray(parsed.timeline) && parsed.timeline.length > 0 ? parsed.timeline : defaults.timeline,
      decks: Array.isArray(parsed.decks) && parsed.decks.length > 0 ? parsed.decks : defaults.decks,
      characters: Array.isArray(parsed.characters) && parsed.characters.length > 0 ? parsed.characters : defaults.characters,
      vortices: Array.isArray(parsed.vortices) && parsed.vortices.length > 0 ? parsed.vortices : defaults.vortices,
      substances: Array.isArray(parsed.substances) && parsed.substances.length > 0 ? parsed.substances : defaults.substances,
      trilogy: parsed.trilogy || defaults.trilogy,
      authorNotes,
      customThematics: Array.isArray(parsed.customThematics) ? parsed.customThematics : [],
      customNotes: parsed.customNotes || {},
      lastModified: parsed.lastModified
    };
  } catch (err) {
    console.error('Error al cargar lore personalizado de localStorage:', err);
    return defaults;
  }
};

export const saveLoreStore = (store: LoreStoreData): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const dataToSave: LoreStoreData = {
      ...store,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    return true;
  } catch (err) {
    console.error('Error al guardar lore en localStorage:', err);
    return false;
  }
};

export const resetLoreStoreToCanonical = (): LoreStoreData => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return getDefaultLoreStore();
};

export const exportLoreToJson = (store: LoreStoreData): string => {
  return JSON.stringify(store, null, 2);
};

export const importLoreFromJson = (jsonStr: string): LoreStoreData => {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('El archivo no contiene un formato de lore válido.');
  }
  const defaults = getDefaultLoreStore();
  const merged: LoreStoreData = {
    metrics: { ...defaults.metrics, ...(parsed.metrics || {}) },
    leaders: Array.isArray(parsed.leaders) && parsed.leaders.length > 0 ? parsed.leaders : defaults.leaders,
    thalvus: parsed.thalvus || defaults.thalvus,
    evolucion: parsed.evolucion || defaults.evolucion,
    madres: parsed.madres || defaults.madres,
    dorada: parsed.dorada || defaults.dorada,
    apagon: parsed.apagon || defaults.apagon,
    timeline: Array.isArray(parsed.timeline) && parsed.timeline.length > 0 ? parsed.timeline : defaults.timeline,
    decks: Array.isArray(parsed.decks) && parsed.decks.length > 0 ? parsed.decks : defaults.decks,
    characters: Array.isArray(parsed.characters) && parsed.characters.length > 0 ? parsed.characters : defaults.characters,
    vortices: Array.isArray(parsed.vortices) && parsed.vortices.length > 0 ? parsed.vortices : defaults.vortices,
    substances: Array.isArray(parsed.substances) && parsed.substances.length > 0 ? parsed.substances : defaults.substances,
    trilogy: parsed.trilogy || defaults.trilogy,
    authorNotes: Array.isArray(parsed.authorNotes) ? parsed.authorNotes : [],
    customThematics: Array.isArray(parsed.customThematics) ? parsed.customThematics : [],
    customNotes: parsed.customNotes || {},
    lastModified: new Date().toISOString()
  };

  saveLoreStore(merged);
  return merged;
};
