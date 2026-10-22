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
  customNotes: Record<string, string>; // Notas y anotaciones libres del autor por sección o entidad
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
    customNotes: {}
  };
};

export const loadLoreStore = (): LoreStoreData => {
  const defaults = getDefaultLoreStore();
  if (typeof window === 'undefined') return defaults;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaults;

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
    customNotes: parsed.customNotes || {},
    lastModified: new Date().toISOString()
  };

  saveLoreStore(merged);
  return merged;
};
