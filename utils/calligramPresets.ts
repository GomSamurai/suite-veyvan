import { CalligramPreset, CalligramConfig } from '../types';

export const CANONICAL_PRESETS: CalligramPreset[] = [
  // 1. LITURGIA DEL RHEA (Órbitas y Santuarios Centrales)
  {
    id: 'rhea-primordial',
    name: 'Códice del Rhea Primordial',
    description: 'Mandala ceremonial concéntrico con trazo de plasma áureo y arcos de vinculación armónica pura.',
    category: 'liturgico',
    config: {
      geometry: 'mandala',
      palette: 'uniae',
      globalRadius: 260,
      stelaRotation: 0,
      sacredScale: 1.0,
      intertwineLevel: 35,
      strokeWidth: 3.5,
      penAngle: 45,
      calligraphyInfluence: 40,
      strokeRenderMode: 'plasma',
      arcTension: 55,
      arcThickness: 2.2,
      arcStyle: 'continuo',
      arcColorMode: 'sincronizado',
      arcOpacity: 85,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: true,
      glowIntensity: 70,
      breathingAnimation: false
    }
  },
  {
    id: 'templo-alto-khaen',
    name: 'Inscripción de Templo Alto (Khaen)',
    description: 'Filigrana áurea con arcos dobles concéntricos de oro litúrgico. Sello ceremonial de consagración.',
    category: 'liturgico',
    config: {
      geometry: 'mandala',
      palette: 'valniae',
      globalRadius: 280,
      stelaRotation: 15,
      sacredScale: 1.05,
      intertwineLevel: 45,
      strokeWidth: 4.2,
      penAngle: 50,
      calligraphyInfluence: 60,
      strokeRenderMode: 'filigrana',
      arcTension: 65,
      arcThickness: 2.6,
      arcStyle: 'doble',
      arcColorMode: 'dorado',
      arcOpacity: 95,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: true,
      glowIntensity: 85,
      breathingAnimation: false
    }
  },
  {
    id: 'nebulosa-abisal',
    name: 'Resonancia de Nebulosa Abisal',
    description: 'Luminiscencia de aguamarina con arcos de pulsos cuánticos en suspensión sobre el vacío.',
    category: 'liturgico',
    config: {
      geometry: 'mandala',
      palette: 'iloniae',
      globalRadius: 240,
      stelaRotation: -30,
      sacredScale: 0.95,
      intertwineLevel: 25,
      strokeWidth: 2.8,
      penAngle: 40,
      calligraphyInfluence: 30,
      strokeRenderMode: 'plasma',
      arcTension: 75,
      arcThickness: 1.8,
      arcStyle: 'pulsos',
      arcColorMode: 'plata',
      arcOpacity: 80,
      showArcTerminals: true,
      showNexuses: false,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: false,
      glowIntensity: 95,
      breathingAnimation: false
    }
  },
  {
    id: 'vortices-purpura',
    name: 'Aliento de los Nueve Vórtices',
    description: 'Púrpura arcano ceremonial con arcos rítmicos punteados y modulación orgánica de cálamo.',
    category: 'liturgico',
    config: {
      geometry: 'mandala',
      palette: 'enniae',
      globalRadius: 290,
      stelaRotation: 45,
      sacredScale: 1.0,
      intertwineLevel: 50,
      strokeWidth: 4.0,
      penAngle: 60,
      calligraphyInfluence: 55,
      strokeRenderMode: 'organico',
      arcTension: 50,
      arcThickness: 2.4,
      arcStyle: 'punteado',
      arcColorMode: 'esmeralda',
      arcOpacity: 90,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: false,
      showChromaticResonance: true,
      showSacredGuides: true,
      glowIntensity: 75,
      breathingAnimation: false
    }
  },

  // 2. HERÁLDICA DE CASTAS (Algante, Veyvān y Mamparo)
  {
    id: 'estela-algante',
    name: 'Estela Ceremonial Algante',
    description: 'Tótem vertical entrelazado con filigrana áurea y nervio interior de oro grabado en obsidiana.',
    category: 'castas',
    config: {
      geometry: 'estela',
      palette: 'anniae',
      globalRadius: 260,
      stelaRotation: 0,
      sacredScale: 1.0,
      intertwineLevel: 55,
      strokeWidth: 4.8,
      penAngle: 45,
      calligraphyInfluence: 70,
      strokeRenderMode: 'filigrana',
      arcTension: 50,
      arcThickness: 2.8,
      arcStyle: 'doble',
      arcColorMode: 'dorado',
      arcOpacity: 95,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: true,
      glowIntensity: 65,
      breathingAnimation: false
    }
  },
  {
    id: 'codice-veyvan',
    name: 'Códice Viviente Veyvān',
    description: 'Estela orgánica en brote de semilla esmeralda. Simboliza regeneración continua y transmisión de sabiduría.',
    category: 'castas',
    config: {
      geometry: 'estela',
      palette: 'tyniae',
      globalRadius: 270,
      stelaRotation: 0,
      sacredScale: 1.0,
      intertwineLevel: 40,
      strokeWidth: 3.6,
      penAngle: 45,
      calligraphyInfluence: 50,
      strokeRenderMode: 'organico',
      arcTension: 60,
      arcThickness: 2.2,
      arcStyle: 'continuo',
      arcColorMode: 'esmeralda',
      arcOpacity: 90,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: false,
      glowIntensity: 80,
      breathingAnimation: false
    }
  },
  {
    id: 'mamparo-inquebrantable',
    name: 'Bóveda de Mamparo Oxidado',
    description: 'Rombo de contención en acero puro y precisión quirúrgica. Máxima sobriedad de las cubiertas bajas.',
    category: 'castas',
    config: {
      geometry: 'diamante',
      palette: 'oxidado',
      globalRadius: 250,
      stelaRotation: 0,
      sacredScale: 1.0,
      intertwineLevel: 15,
      strokeWidth: 3.0,
      penAngle: 90,
      calligraphyInfluence: 10,
      strokeRenderMode: 'precision',
      arcTension: 35,
      arcThickness: 1.8,
      arcStyle: 'continuo',
      arcColorMode: 'plata',
      arcOpacity: 85,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: false,
      showChromaticResonance: false,
      showSacredGuides: true,
      glowIntensity: 35,
      breathingAnimation: false
    }
  },
  {
    id: 'sombra-blanca',
    name: 'Monolito de la Sombra Blanca',
    description: 'Estela austera de trazo afilado y arcos punteados de ritmo fónico exacto.',
    category: 'castas',
    config: {
      geometry: 'estela',
      palette: 'oxidado',
      globalRadius: 280,
      stelaRotation: 0,
      sacredScale: 0.95,
      intertwineLevel: 20,
      strokeWidth: 2.4,
      penAngle: 45,
      calligraphyInfluence: 20,
      strokeRenderMode: 'precision',
      arcTension: 70,
      arcThickness: 1.6,
      arcStyle: 'punteado',
      arcColorMode: 'plata',
      arcOpacity: 75,
      showArcTerminals: true,
      showNexuses: false,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: false,
      showSacredGuides: true,
      glowIntensity: 45,
      breathingAnimation: false
    }
  },

  // 3. DINÁMICAS FILOSÓFICAS Y MÍSTICAS (Dran, Kael, Kosmir)
  {
    id: 'salto-kael',
    name: 'Vórtice del Despertar (Kael)',
    description: 'Delta sagrado de fricción material. Trazos de plasma que transmutan la tensión en iluminación.',
    category: 'mistico',
    config: {
      geometry: 'delta',
      palette: 'valniae',
      globalRadius: 280,
      stelaRotation: 0,
      sacredScale: 1.0,
      intertwineLevel: 45,
      strokeWidth: 4.0,
      penAngle: 45,
      calligraphyInfluence: 50,
      strokeRenderMode: 'plasma',
      arcTension: 85,
      arcThickness: 2.4,
      arcStyle: 'pulsos',
      arcColorMode: 'dorado',
      arcOpacity: 90,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: true,
      glowIntensity: 85,
      breathingAnimation: false
    }
  },
  {
    id: 'diamante-abismo',
    name: 'Diamante del Santuario Interior',
    description: 'Contención absoluta ante el vacío abisal con filigrana áurea y cuatro esquinas sagradas.',
    category: 'mistico',
    config: {
      geometry: 'diamante',
      palette: 'enniae',
      globalRadius: 260,
      stelaRotation: 0,
      sacredScale: 1.0,
      intertwineLevel: 40,
      strokeWidth: 3.6,
      penAngle: 45,
      calligraphyInfluence: 50,
      strokeRenderMode: 'filigrana',
      arcTension: 60,
      arcThickness: 2.2,
      arcStyle: 'doble',
      arcColorMode: 'plata',
      arcOpacity: 90,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: true,
      glowIntensity: 80,
      breathingAnimation: false
    }
  },
  {
    id: 'lazo-kosmir',
    name: 'Lazo Eterno de Kosmir',
    description: 'Lemniscata universal de retorno cíclico. Disuelve los límites individuales en la red de almas.',
    category: 'mistico',
    config: {
      geometry: 'infinito',
      palette: 'iloniae',
      globalRadius: 280,
      stelaRotation: 0,
      sacredScale: 1.0,
      intertwineLevel: 50,
      strokeWidth: 3.8,
      penAngle: 45,
      calligraphyInfluence: 45,
      strokeRenderMode: 'plasma',
      arcTension: 70,
      arcThickness: 2.4,
      arcStyle: 'continuo',
      arcColorMode: 'sincronizado',
      arcOpacity: 90,
      showArcTerminals: true,
      showNexuses: true,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: true,
      glowIntensity: 85,
      breathingAnimation: false
    }
  },
  {
    id: 'friccion-cuantica',
    name: 'Lemniscata de Fricción Cuántica',
    description: 'Flujo en ocho con arcos de pulsos de fuego transmutativo y corte de precisión.',
    category: 'mistico',
    config: {
      geometry: 'infinito',
      palette: 'valniae',
      globalRadius: 260,
      stelaRotation: 15,
      sacredScale: 0.95,
      intertwineLevel: 30,
      strokeWidth: 2.8,
      penAngle: 45,
      calligraphyInfluence: 30,
      strokeRenderMode: 'precision',
      arcTension: 90,
      arcThickness: 2.0,
      arcStyle: 'pulsos',
      arcColorMode: 'dorado',
      arcOpacity: 85,
      showArcTerminals: true,
      showNexuses: false,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: false,
      glowIntensity: 75,
      breathingAnimation: false
    }
  },

  // 4. ASÉMICO Y POESÍA DEL ALIENTO (Vira)
  {
    id: 'aliento-continuo',
    name: 'Pincelada Continua del Aliento (Vira)',
    description: 'Monotrazado asémico unificado. Todo el sigilo discurre en una sola respiración fluida.',
    category: 'asemic',
    config: {
      geometry: 'asemic',
      palette: 'uniae',
      globalRadius: 260,
      stelaRotation: 0,
      sacredScale: 1.05,
      intertwineLevel: 65,
      strokeWidth: 4.8,
      penAngle: 45,
      calligraphyInfluence: 80,
      strokeRenderMode: 'organico',
      arcTension: 50,
      arcThickness: 2.0,
      arcStyle: 'continuo',
      arcColorMode: 'sincronizado',
      arcOpacity: 85,
      showArcTerminals: false,
      showNexuses: false,
      showDiacritics: false,
      showParticles: false,
      showChromaticResonance: true,
      showSacredGuides: false,
      glowIntensity: 65,
      breathingAnimation: false
    }
  },
  {
    id: 'rastro-eter',
    name: 'Rastro de Éter en el Vacío',
    description: 'Trazo asémico fino de plasma celeste suspendido en la noche pura del espacio interestelar.',
    category: 'asemic',
    config: {
      geometry: 'asemic',
      palette: 'iloniae',
      globalRadius: 250,
      stelaRotation: -20,
      sacredScale: 1.0,
      intertwineLevel: 45,
      strokeWidth: 2.6,
      penAngle: 35,
      calligraphyInfluence: 40,
      strokeRenderMode: 'plasma',
      arcTension: 60,
      arcThickness: 1.6,
      arcStyle: 'continuo',
      arcColorMode: 'plata',
      arcOpacity: 80,
      showArcTerminals: false,
      showNexuses: false,
      showDiacritics: true,
      showParticles: false,
      showChromaticResonance: true,
      showSacredGuides: false,
      glowIntensity: 90,
      breathingAnimation: false
    }
  },
  {
    id: 'manuscrito-obsidiana',
    name: 'Manuscrito de Obsidiana Afilada',
    description: 'Monotrazado riguroso y minimalista. Geometría asémica de trazo puro y sin ornamentos.',
    category: 'asemic',
    config: {
      geometry: 'asemic',
      palette: 'oxidado',
      globalRadius: 270,
      stelaRotation: 0,
      sacredScale: 0.95,
      intertwineLevel: 30,
      strokeWidth: 2.2,
      penAngle: 90,
      calligraphyInfluence: 15,
      strokeRenderMode: 'precision',
      arcTension: 45,
      arcThickness: 1.5,
      arcStyle: 'continuo',
      arcColorMode: 'plata',
      arcOpacity: 70,
      showArcTerminals: false,
      showNexuses: true,
      showDiacritics: false,
      showParticles: false,
      showChromaticResonance: false,
      showSacredGuides: true,
      glowIntensity: 40,
      breathingAnimation: false
    }
  },
  {
    id: 'germinacion-esmeralda',
    name: 'Germinación Esmeralda Silente',
    description: 'Pincelada asémica ondulada con energía regenerativa de la casta botánica de los Veyvān.',
    category: 'asemic',
    config: {
      geometry: 'asemic',
      palette: 'tyniae',
      globalRadius: 280,
      stelaRotation: 10,
      sacredScale: 1.0,
      intertwineLevel: 55,
      strokeWidth: 4.2,
      penAngle: 50,
      calligraphyInfluence: 65,
      strokeRenderMode: 'organico',
      arcTension: 55,
      arcThickness: 2.2,
      arcStyle: 'continuo',
      arcColorMode: 'esmeralda',
      arcOpacity: 90,
      showArcTerminals: false,
      showNexuses: false,
      showDiacritics: true,
      showParticles: true,
      showChromaticResonance: true,
      showSacredGuides: false,
      glowIntensity: 75,
      breathingAnimation: false
    }
  }
];

const STORAGE_KEY_CUSTOM_PRESETS = 'taelvohn_custom_presets_v1';

/**
 * Carga los preajustes personalizados guardados por el usuario desde localStorage
 */
export function loadCustomPresets(): CalligramPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_PRESETS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Error al cargar estilos personalizados de caligramas:", err);
    return [];
  }
}

/**
 * Guarda un nuevo preajuste personalizado o actualiza uno existente
 */
export function saveCustomPreset(preset: CalligramPreset): CalligramPreset[] {
  try {
    const current = loadCustomPresets();
    const existingIndex = current.findIndex(p => p.id === preset.id);
    let updated: CalligramPreset[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = preset;
    } else {
      updated = [preset, ...current];
    }

    localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error al guardar estilo personalizado:", err);
    return loadCustomPresets();
  }
}

/**
 * Elimina un preajuste personalizado por su ID
 */
export function deleteCustomPreset(id: string): CalligramPreset[] {
  try {
    const current = loadCustomPresets();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error al eliminar estilo personalizado:", err);
    return loadCustomPresets();
  }
}

/**
 * Exporta todos los preajustes personalizados como una cadena JSON formateada
 */
export function exportPresetsToJson(presets: CalligramPreset[]): string {
  return JSON.stringify({
    version: 1,
    exportDate: new Date().toISOString(),
    source: "Estación Humanidad - Suite Veyvān",
    presets
  }, null, 2);
}

/**
 * Importa preajustes personalizados desde un texto JSON
 */
export function importPresetsFromJson(jsonStr: string): CalligramPreset[] {
  try {
    const parsed = JSON.parse(jsonStr);
    const incoming: CalligramPreset[] = Array.isArray(parsed) 
      ? parsed 
      : Array.isArray(parsed.presets) 
      ? parsed.presets 
      : [];

    if (incoming.length === 0) {
      throw new Error("El archivo no contiene estilos válidos");
    }

    const current = loadCustomPresets();
    const currentMap = new Map(current.map(p => [p.id, p]));

    for (const item of incoming) {
      if (item && item.id && item.name && item.config) {
        currentMap.set(item.id, {
          ...item,
          category: 'personalizado'
        });
      }
    }

    const merged = Array.from(currentMap.values());
    localStorage.setItem(STORAGE_KEY_CUSTOM_PRESETS, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error("Error al importar estilos personalizados:", err);
    throw err;
  }
}
