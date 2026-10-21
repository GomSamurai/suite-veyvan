
export enum Tonality {
  POSITIVE = 'Positiva',
  NEUTRAL = 'Neutra',
  NEGATIVE = 'Negativa/Conflicto',
  TRANSFORMATIVE = 'Transformadora',
  MIXED = 'Mixta'
}

export type NavigationTab = 'glossary' | 'stats' | 'translator' | 'constructor' | 'taelim' | 'codex' | 'academy' | 'calligram' | 'lore';

// Tipologías y Geometría Sagrada de Caligramas Tael'vohn
export type CalligramGeometry = 'mandala' | 'estela' | 'delta' | 'diamante' | 'infinito' | 'asemic';
export type CalligramPalette = 'iloniae' | 'uniae' | 'valniae' | 'anniae' | 'enniae' | 'tyniae' | 'oxidado';
export type StrokeStyleMode = 'plasma' | 'filigrana' | 'organico' | 'precision';
export type ArcStyleMode = 'continuo' | 'punteado' | 'pulsos' | 'doble';
export type ArcColorMode = 'sincronizado' | 'dorado' | 'plata' | 'esmeralda';

export interface UnitCustomTransform {
  index: number;
  offsetX: number; // Desplazamiento relativo X en píxeles del lienzo (-400 a 400)
  offsetY: number; // Desplazamiento relativo Y en píxeles del lienzo (-400 a 400)
  rotation: number; // Rotación adicional en grados (-180 a 180)
  scale: number; // Multiplicador de escala individual (0.4 a 2.5)
}

export interface CalligramConfig {
  geometry: CalligramGeometry;
  palette: CalligramPalette;
  // Disposición & Geometría Global
  globalRadius: number; // Radio de dispersión o separación general (80 a 400)
  stelaRotation: number; // Orientación angular global (-180 a 180)
  sacredScale: number; // Escala global del sigilo (0.5 a 2.0)
  intertwineLevel: number; // Grado de solapamiento y fusión de trazos (0 a 100)
  
  // Cálamo & Trazos (Trazo & Dinámica)
  strokeWidth: number; // Grosor de presión del cálamo (1.0 a 10.0)
  penAngle: number; // Ángulo de corte del cálamo (0 a 180 grados)
  calligraphyInfluence: number; // Influencia caligráfica / variación de grosor (0 a 100)
  strokeRenderMode: StrokeStyleMode; // Estilo de trazo (plasma, filigrana, orgánico, precisión)
  smoothEnds?: boolean; // Remates suaves / redondeados
  nodeStartPressure?: number; // Presión en nodo inicial (0.2 a 3.0)
  nodeMidPressure?: number; // Presión en puntos medios (0.2 a 3.0)
  nodeEndPressure?: number; // Presión en nodo final (0.2 a 3.0)

  // Física & Dinámica de Ondulación (como en Tael'im)
  tension?: number; // Tensión de spline / rigidez (0.05 a 0.8, default 0.35)
  fluidity?: number; // Factor de fluidez (0 a 100)
  waveFreq?: number; // Frecuencia de onda (0 a 10, default 0)
  waveAmp?: number; // Amplitud de onda (0 a 30, default 0)

  // Atmósfera & FX (como en Tael'im)
  glowIntensity: number; // Halo de resonancia etérea (0 a 100)
  echoes?: number; // Ecos de plasma / capas duplicadas (0 a 5, default 0)
  echoOffset?: number; // Desplazamiento de ecos (2 a 30, default 10)
  inkDensity?: number; // Salpicaduras de densidad de tinta (0 a 10, default 0)
  particles?: number; // Partículas estelares orbitando (0 a 20, default 0)
  erosion?: number; // Efecto de erosión / desgaste (0 a 100, default 0)
  breathingAnimation: boolean; // Ciclo de aliento (pulso vira)

  // Color Completo & Personalizado Libre (como en Tael'im)
  colorMode?: 'palette' | 'custom' | 'gradient'; // Modo de color
  customColorPrimary?: string; // Color primario personalizado (HEX libre)
  customColorSecondary?: string; // Color secundario / filigrana personalizado (HEX libre)
  customColorBackground?: string; // Color de fondo personalizado (HEX libre)
  customColorArc?: string; // Color de los arcos personalizado (HEX libre)
  isGradient?: boolean; // Activar gradiente de color en los trazos
  gradientColors?: { start: string; end: string }; // Colores de gradiente inicial y final

  // Arcos de Vínculo
  matrixGap?: number; // Distancia entre matrices (70 a 350 px)
  arcTension: number; // Amplitud y tensión de curvatura (0 a 100)
  arcThickness: number; // Grosor de la línea del arco (0.5 a 8.0)
  arcStyle: ArcStyleMode; // Estilo de trazo del arco (continuo, punteado, pulsos, doble)
  arcColorMode: ArcColorMode; // Color del arco (sincronizado, dorado, plata, esmeralda)
  arcOpacity: number; // Opacidad del arco (10 a 100)
  showArcTerminals: boolean; // Nodos esféricos conectores en los extremos
  arcGlow?: number; // Aura luminosa del arco (0 a 50)
  
  // Simbología Sagrada & Guías
  showNexuses: boolean; // Retícula de nexos de la matriz
  showDiacritics: boolean; // Afijos morfológicos (prefijos, infijos, sufijos)
  showParticles: boolean; // Partículas relacionales ('na, 'vi, etc.)
  showChromaticResonance: boolean; // Sello de resonancia de color
  showSacredGuides: boolean; // Guías geométricas del arquetipo (círculos, ejes, polígonos)

  // Morfología & Afijos
  diacriticScale?: number; // Escala general de diacríticos (0.5 a 2.0)
  diacriticThickness?: number; // Grosor de trazo de diacríticos (1.0 a 5.0)
  
  // Transformaciones individuales por radical (manipulación interactiva libre)
  customTransforms: Record<number, UnitCustomTransform>;
}

export interface CalligramAiInsight {
  sacredMeaning: string; // Interpretación poética y ontológica del sigilo
  recommendedGeometry: CalligramGeometry;
  geometryRationale: string; // Fundamento ontológico de la geometría recomendada
  recommendedPalette: CalligramPalette;
  paletteRationale: string; // Fundamento ontológico de la vibración cromática
  contemplationMantra: string; // Guía meditativa para la contemplación del sigilo
}

export interface CalligramPreset {
  id: string;
  name: string;
  description: string;
  category: 'liturgico' | 'castas' | 'mistico' | 'asemic' | 'personalizado';
  config: Partial<CalligramConfig>;
  createdAt?: string;
  author?: string;
}

export interface MorphemeToken {
  part: string;
  type: 'time' | 'evidence' | 'root' | 'aspect' | 'particle' | 'pronoun' | 'closure' | 'plural' | 'unknown';
  meaning: string;
}

export interface TranslationResult {
  sourceText: string;
  transversalText: string;
  literalSpanish: string;
  poeticSpanish: string;
  syntaxOrder: string;
  sociolect: 'algante' | 'oxidado';
  tokens: MorphemeToken[];
  philosophicalNote?: string;
  sociolectAlgante?: string;
  sociolectOxidado?: string;
  // Síntesis Aforística Veyvān (Máxima Brevedad & Belleza)
  compactTransversal?: string;
  compactPoetic?: string;
  compactLiteral?: string;
  compactTokens?: MorphemeToken[];
}

export interface Term {
  id: string;
  root: string; // The "Raíz"
  meaning: string;
  description: string;
  category: string;
  tonality: Tonality;
  syllables: number;
  addedAt: string;
  tomo?: string;
  phonetics?: string;
  level?: string;
}

export const TOMOS = [
  "Todos los Tomos",
  "Tomo I: Amnis",
  "Tomo II: Matriz del Aliento",
  "Tomo III: Vocabularium Rha",
  "Tomo IV: Códice de la Consciencia",
  "Tomo V: Cánticos del Rhea",
  "Tomo VI: Sombra Blanca",
  "Tomo VII: Los Nueve Vórtices"
] as const;

export interface TaelimPreset {
  id: string;
  name: string;
  // Physics & Geometry
  tension: number;
  fluidity: number;
  waveFreq: number;
  waveAmp: number;
  // Effects
  glow: number;
  echoes: number;
  echoOffset: number;
  inkDensity: number;
  erosion: number;
  particles: number;
  // Calligraphy
  penAngle: number;
  calligraphyAmount: number;
  smoothEnds?: boolean; // Added
  // Engine
  engine: 'plasma' | 'tech' | 'pluma' | 'nexo';
  // Colors & Appearance
  isGradient?: boolean; // Added
  gradientColors?: { start: string; end: string }; // Added
  // Thickness Settings (Snapshot of current style)
  baseNodeThickness?: number; // Added
  baseStrokeThickness?: number; // Added
  
  // Grid Settings
  showGridLines?: boolean;
  showGridLabels?: boolean;
  showGridPoints?: boolean;
  gridPointMode?: 'all' | 'active';
  gridPointSize?: number;
  gridPointColor?: string;

  // Arcos de Vínculo
  matrixGap?: number;
  arcOpacity?: number;
  arcThickness?: number;
  arcCurvature?: number;
  arcStrokeStyle?: 'solid' | 'dashed' | 'dotted' | 'pulse';
  showArcParticles?: boolean;
  showArcTerminals?: boolean;
  arcGlow?: number;
  arcColorMode?: 'sync' | 'cyan' | 'emerald' | 'gold' | 'violet';
}

export interface LexiData {
  version: number;
  terms: Term[];
  presets: TaelimPreset[];
}

export interface FilterState {
  search: string;
  category: string;
  tonality: string;
}

export interface StatMetric {
  name: string;
  value: number;
  color?: string;
}

export const CATEGORIES = [
  "Emociones y Estados Internos",
  "Conexiones y Relaciones",
  "Sensaciones y Percepciones",
  "Transformaciones y Ciclos",
  "Naturaleza y Elementos",
  "Estados Abstractos y Consciencia",
  "Dinámicas del Cosmos",
  "Impulsos, Acción y Tiempo",
  "Sombras, Crisis y Entorno",
  "Luz y Claridad",
  "Frases y Proverbios"
];