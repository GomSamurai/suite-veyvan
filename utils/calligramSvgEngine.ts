import { 
  CalligramConfig, 
  CalligramGeometry, 
  CalligramPalette,
  UnitCustomTransform,
  StrokeStyleMode,
  ArcStyleMode,
  ArcColorMode
} from '../types';
import { parseTaelimExpression, GlyphUnit } from './taelimParser';
import { getBezierPointsWithWeight, getBrushPath, SegmentPressure } from './taelimMath';

/**
 * MOTOR DE GEOMETRÍA SAGRADA Y RENDERIZADO VECTORIAL AVANZADO // TAEL'VOHN SVG ENGINE 2.0
 * Genera el marcado vectorial puro (SVG) con soporte de manipulación dinámica individual de símbolos,
 * arcos de vínculo elásticos inquebrantables, estilos de cálamo y geometrías sagradas personalizables.
 */

// Retícula Canónica Algante (6 columnas x 4 filas) -> Matriz Litúrgica de Alta Jerarquía / Sacerdotes del Émulo
export const ALGANTE_GRID: string[][] = [
  ['P', 'V', 'U', 'Y', 'M', 'B'],
  ['F', 'R', 'E', 'A', 'D', 'C'],
  ['H', 'N', 'I', 'L', 'Z', 'Q'],
  ['K', 'S', 'O', 'T', 'G', 'J']
];

// Retícula Canónica Común (4 columnas x 6 filas) -> Matriz Secular / Pasillos Obreros y Cubiertas Medias
export const COMUN_GRID: string[][] = [
  ['B', 'L', 'A', 'V'],
  ['C', 'N', 'E', 'S'],
  ['D', 'R', 'I', 'T'],
  ['F', 'M', 'O', 'Z'],
  ['G', 'K', 'U', 'H'],
  ['J', 'P', 'Y', 'Q']
];

export const CELL_SIZE = 20;

// Mapeos de caracteres a coordenadas locales
export const ALGANTE_GRID_MAP = new Map<string, { x: number; y: number }>();
ALGANTE_GRID.forEach((row, y) => {
  row.forEach((char, x) => {
    ALGANTE_GRID_MAP.set(char.toUpperCase(), { x, y });
  });
});

export const COMUN_GRID_MAP = new Map<string, { x: number; y: number }>();
COMUN_GRID.forEach((row, y) => {
  row.forEach((char, x) => {
    COMUN_GRID_MAP.set(char.toUpperCase(), { x, y });
  });
});

// Alias compatible para referencias existentes
export const GRID_MAP = ALGANTE_GRID_MAP;

export interface PaletteTheme {
  id: CalligramPalette;
  name: string;
  loreLabel: string;
  primary: string;
  secondary: string;
  glow: string;
  fillAccent: string;
  borderStroke: string;
}

export const PALETTES: Record<CalligramPalette, PaletteTheme> = {
  iloniae: {
    id: 'iloniae',
    name: 'Oro Litúrgico',
    loreLabel: 'Iloniae (Sabiduría y Prosperidad del Émulo)',
    primary: '#f59e0b',
    secondary: '#fef08a',
    glow: 'rgba(245, 158, 11, 0.8)',
    fillAccent: 'rgba(245, 158, 11, 0.08)',
    borderStroke: 'rgba(245, 158, 11, 0.3)'
  },
  uniae: {
    id: 'uniae',
    name: 'Plasma de Vacío',
    loreLabel: 'Uniae (Serenidad y Paz Interior)',
    primary: '#06b6d4',
    secondary: '#a5f3fc',
    glow: 'rgba(6, 182, 212, 0.85)',
    fillAccent: 'rgba(6, 182, 212, 0.08)',
    borderStroke: 'rgba(6, 182, 212, 0.35)'
  },
  valniae: {
    id: 'valniae',
    name: 'Fuego de Fricción',
    loreLabel: 'Valniae (Pasión y Superación del Dolor)',
    primary: '#f43f5e',
    secondary: '#fda4af',
    glow: 'rgba(244, 63, 94, 0.8)',
    fillAccent: 'rgba(244, 63, 94, 0.08)',
    borderStroke: 'rgba(244, 63, 94, 0.35)'
  },
  anniae: {
    id: 'anniae',
    name: 'Luz de la Cuna',
    loreLabel: 'Anniae (Memoria de la Tierra y Pureza)',
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    glow: 'rgba(248, 250, 252, 0.85)',
    fillAccent: 'rgba(248, 250, 252, 0.08)',
    borderStroke: 'rgba(248, 250, 252, 0.35)'
  },
  enniae: {
    id: 'enniae',
    name: 'Púrpura Arcano',
    loreLabel: 'Enniae (Misterio y Poder Oculto)',
    primary: '#a855f7',
    secondary: '#f3e8ff',
    glow: 'rgba(168, 85, 247, 0.8)',
    fillAccent: 'rgba(168, 85, 247, 0.08)',
    borderStroke: 'rgba(168, 85, 247, 0.35)'
  },
  tyniae: {
    id: 'tyniae',
    name: 'Brote de la Semilla',
    loreLabel: 'Tyniae (Crecimiento y Regeneración Vital)',
    primary: '#10b981',
    secondary: '#a7f3d0',
    glow: 'rgba(16, 185, 129, 0.8)',
    fillAccent: 'rgba(16, 185, 129, 0.08)',
    borderStroke: 'rgba(16, 185, 129, 0.35)'
  },
  oxidado: {
    id: 'oxidado',
    name: 'Acero de Mamparo',
    loreLabel: 'Oxidado (Tenacidad de Cubiertas Bajas)',
    primary: '#94a3b8',
    secondary: '#e2e8f0',
    glow: 'rgba(148, 163, 184, 0.6)',
    fillAccent: 'rgba(148, 163, 184, 0.06)',
    borderStroke: 'rgba(148, 163, 184, 0.25)'
  }
};

export interface LocalPoint {
  x: number;
  y: number;
  char: string;
}

export interface UnitPlacement {
  index: number;
  unit: GlyphUnit;
  cx: number;
  cy: number;
  baseCx: number;
  baseCy: number;
  rotation: number;
  scale: number;
  localPoints: LocalPoint[];
  worldPoints: { x: number; y: number }[];
}

export const VIEW_SIZE = 1000;
export const CENTER = VIEW_SIZE / 2;

/**
 * Obtiene los puntos de un radical en coordenadas locales de la retícula
 * Soporta modo Algante (6x4, centro 2.5/1.5) y modo Común (4x6, centro 1.5/2.5)
 */
export function getRadicalLocalPoints(
  cleanRoot: string, 
  gridMode: 'algante' | 'comun' = 'algante'
): LocalPoint[] {
  const letters = cleanRoot.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const points: LocalPoint[] = [];
  const isComun = gridMode === 'comun';
  const targetMap = isComun ? COMUN_GRID_MAP : ALGANTE_GRID_MAP;
  const centerX = isComun ? 1.5 : 2.5;
  const centerY = isComun ? 2.5 : 1.5;

  for (const rawChar of letters) {
    let char = rawChar;
    // Sustituciones fonológicas canónicas para grafías no nativas
    if (!targetMap.has(char)) {
      if (char === 'W') char = 'V';
      else if (char === 'X') char = 'S';
    }

    const coord = targetMap.get(char);
    if (coord) {
      points.push({
        x: (coord.x - centerX) * CELL_SIZE,
        y: (coord.y - centerY) * CELL_SIZE,
        char
      });
    }
  }

  if (points.length === 0) {
    points.push({ x: 0, y: -CELL_SIZE, char: 'A' }, { x: CELL_SIZE, y: CELL_SIZE, char: 'V' });
  }

  return points;
}

/**
 * Transforma un punto local (lx, ly) a coordenadas globales del lienzo
 */
export function toWorld(lx: number, ly: number, cx: number, cy: number, rotDeg: number, s: number) {
  const rad = (rotDeg * Math.PI) / 180;
  const rx = lx * s * Math.cos(rad) - ly * s * Math.sin(rad);
  const ry = lx * s * Math.sin(rad) + ly * s * Math.cos(rad);
  return { x: cx + rx, y: cy + ry };
}

/**
 * Calcula la disposición base de los radicales según el arquetipo de Geometría Sagrada
 */
export function computeArchetypePlacements(
  units: GlyphUnit[], 
  config: CalligramConfig
): { baseCx: number; baseCy: number; baseRot: number }[] {
  const numUnits = Math.max(1, units.length);
  const intertwine = (config.intertwineLevel || 35) / 100;
  const customRadius = config.matrixGap ? (config.matrixGap * 1.8) : (config.globalRadius || 260);
  const result: { baseCx: number; baseCy: number; baseRot: number }[] = [];

  switch (config.geometry) {
    case 'mandala': {
      const radius = Math.max(80, customRadius - (intertwine * 100));
      for (let idx = 0; idx < numUnits; idx++) {
        const angleDeg = (360 / numUnits) * idx - 90 + config.stelaRotation;
        const rad = (angleDeg * Math.PI) / 180;
        result.push({
          baseCx: CENTER + radius * Math.cos(rad),
          baseCy: CENTER + radius * Math.sin(rad),
          baseRot: angleDeg + 90
        });
      }
      break;
    }

    case 'estela': {
      const baseSpacing = config.matrixGap ? config.matrixGap : Math.max(70, (customRadius * 0.6) - (intertwine * 60));
      const totalH = (numUnits - 1) * baseSpacing;
      const startY = CENTER - totalH / 2;
      for (let idx = 0; idx < numUnits; idx++) {
        result.push({
          baseCx: CENTER + (idx % 2 === 0 ? -1 : 1) * (intertwine * 15),
          baseCy: startY + idx * baseSpacing,
          baseRot: config.stelaRotation
        });
      }
      break;
    }

    case 'delta': {
      const r = Math.max(100, customRadius - (intertwine * 80));
      for (let idx = 0; idx < numUnits; idx++) {
        let cx = CENTER;
        let cy = CENTER;
        if (numUnits === 1) {
          cx = CENTER; cy = CENTER;
        } else if (numUnits === 2) {
          cx = idx === 0 ? CENTER - r * 0.7 : CENTER + r * 0.7;
          cy = idx === 0 ? CENTER + r * 0.5 : CENTER - r * 0.5;
        } else {
          const t = (idx / numUnits) * 3;
          const cornerIdx = Math.floor(t) % 3;
          const progress = t - Math.floor(t);
          const corners = [
            { x: CENTER, y: CENTER - r },
            { x: CENTER + r * 0.866, y: CENTER + r * 0.5 },
            { x: CENTER - r * 0.866, y: CENTER + r * 0.5 }
          ];
          const c1 = corners[cornerIdx];
          const c2 = corners[(cornerIdx + 1) % 3];
          cx = c1.x + (c2.x - c1.x) * progress;
          cy = c1.y + (c2.y - c1.y) * progress;
        }
        result.push({
          baseCx: cx,
          baseCy: cy,
          baseRot: config.stelaRotation
        });
      }
      break;
    }

    case 'diamante': {
      const rx = Math.max(100, customRadius * 1.1 - (intertwine * 90));
      const ry = Math.max(80, customRadius * 0.85 - (intertwine * 70));
      for (let idx = 0; idx < numUnits; idx++) {
        const angle = (2 * Math.PI * idx) / numUnits - Math.PI / 2;
        result.push({
          baseCx: CENTER + rx * Math.cos(angle),
          baseCy: CENTER + ry * Math.sin(angle),
          baseRot: config.stelaRotation
        });
      }
      break;
    }

    case 'infinito': {
      const a = Math.max(100, customRadius * 1.05 - (intertwine * 80));
      for (let idx = 0; idx < numUnits; idx++) {
        const t = (2 * Math.PI * idx) / numUnits;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        result.push({
          baseCx: CENTER + (a * Math.cos(t)) / denom,
          baseCy: CENTER + ((a * Math.sin(t) * Math.cos(t)) / denom) * 1.4,
          baseRot: config.stelaRotation
        });
      }
      break;
    }

    case 'asemic':
    default: {
      const baseRad = Math.max(90, customRadius * 0.75 - (intertwine * 70));
      for (let idx = 0; idx < numUnits; idx++) {
        const t = idx / Math.max(1, numUnits - 1);
        const angle = (t - 0.5) * Math.PI * 1.4 - Math.PI / 2;
        result.push({
          baseCx: CENTER + baseRad * Math.cos(angle),
          baseCy: CENTER + (t - 0.5) * 320,
          baseRot: config.stelaRotation + (idx * 15)
        });
      }
      break;
    }
  }

  return result;
}

/**
 * Genera la ruta de pincel fluido para una secuencia de puntos con opciones de cálamo y física
 */
function generateBrushPathString(
  points: { x: number; y: number }[], 
  baseWidth: number,
  penAngleDeg: number = 45,
  calligraphyInfluence: number = 40,
  tension: number = 0.35,
  waveFreq: number = 0,
  waveAmp: number = 0,
  smoothEnds: boolean = true,
  startPressure: number = 1.25,
  midPressure: number = 0.9,
  endPressure: number = 0.55
): string {
  if (points.length < 2) return '';

  const segments: SegmentPressure[] = points.slice(0, points.length - 1).map((_, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === points.length - 2;
    return {
      start: isFirst ? baseWidth * startPressure : baseWidth,
      mid: baseWidth * midPressure,
      end: isLast ? baseWidth * endPressure : baseWidth
    };
  });

  const weightedPoints = getBezierPointsWithWeight(
    points,
    segments,
    tension,
    18,
    waveFreq,
    waveAmp,
    smoothEnds
  );

  return getBrushPath(weightedPoints, {
    angleInfluence: calligraphyInfluence / 100,
    penAngleDeg: penAngleDeg,
    roundedCaps: smoothEnds
  });
}

/**
 * Renderizado Canónico de la Partícula Relacional o Pausa Litúrgica sobre el Vértice del Arco
 * Sistema Tael'im (Sección 3.3, 4.3):
 * - 'na (Inesivo): Círculo con punto central interior ⊙ (Canónico Koa'na'Eli)
 * - 'vi (Instrumental): Doble trazo oblicuo de mediación ⫽
 * - 'zo (Direccional): Ángulo directriz hacia adelante ›
 * - 'da (Ablativo): Ángulo de procedencia hacia atrás ‹
 * - ·· (Pausa Especular): Dos orbes gemelos con auras concéntricas
 */
function renderCanonicalArcParticleSvg(
  particleId: string | null | undefined,
  pauseType: 'arc' | 'pause' | undefined,
  cpX: number,
  cpY: number,
  palette: PaletteTheme,
  arcThickness: number,
  showParticlesConfig: boolean
): string {
  const x = Number(cpX.toFixed(1));
  const y = Number(cpY.toFixed(1));
  const thick = Math.max(1.8, arcThickness * 0.9);

  // 1. Inesivo ('na) -> Círculo exterior con punto central interior ⊙ (Koa'na'Eli canon)
  if (particleId === 'suf_na') {
    return `
      <g id="particula-arco-inesivo" transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="16" fill="${palette.fillAccent}" stroke="${palette.secondary}" stroke-width="${thick.toFixed(1)}" opacity="0.95" />
        <circle cx="0" cy="0" r="22" fill="none" stroke="${palette.primary}" stroke-width="0.8" stroke-dasharray="2 4" opacity="0.6" />
        <circle cx="0" cy="0" r="4" fill="${palette.primary}" />
        <rect x="-18" y="-30" width="36" height="15" rx="4" fill="#030712" stroke="${palette.borderStroke}" stroke-width="0.8" opacity="0.92" />
        <text x="0" y="-19" fill="${palette.secondary}" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">'na</text>
        <text x="0" y="32" fill="${palette.secondary}" font-family="sans-serif" font-size="8" text-anchor="middle" letter-spacing="1" opacity="0.75">INESIVO</text>
      </g>
    `;
  }

  // 2. Instrumental ('vi) -> Doble trazo oblicuo ⫽
  if (particleId === 'suf_vi') {
    return `
      <g id="particula-arco-instrumental" transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="15" fill="${palette.fillAccent}" stroke="${palette.secondary}" stroke-width="0.9" opacity="0.8" stroke-dasharray="3 3" />
        <line x1="-5" y1="8" x2="-1" y2="-8" stroke="${palette.secondary}" stroke-width="${(thick * 1.2).toFixed(1)}" stroke-linecap="round" />
        <line x1="2" y1="8" x2="6" y2="-8" stroke="${palette.secondary}" stroke-width="${(thick * 1.2).toFixed(1)}" stroke-linecap="round" />
        <rect x="-18" y="-30" width="36" height="15" rx="4" fill="#030712" stroke="${palette.borderStroke}" stroke-width="0.8" opacity="0.92" />
        <text x="0" y="-19" fill="${palette.secondary}" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">'vi</text>
        <text x="0" y="32" fill="${palette.secondary}" font-family="sans-serif" font-size="8" text-anchor="middle" letter-spacing="1" opacity="0.75">INSTRUMENTAL</text>
      </g>
    `;
  }

  // 3. Direccional ('zo) -> Ángulo hacia adelante ›
  if (particleId === 'suf_zo') {
    return `
      <g id="particula-arco-direccional" transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="15" fill="${palette.fillAccent}" stroke="${palette.secondary}" stroke-width="0.9" opacity="0.8" />
        <path d="M -5 -7 L 5 0 L -5 7" fill="none" stroke="${palette.secondary}" stroke-width="${(thick * 1.25).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="-18" y="-30" width="36" height="15" rx="4" fill="#030712" stroke="${palette.borderStroke}" stroke-width="0.8" opacity="0.92" />
        <text x="0" y="-19" fill="${palette.secondary}" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">'zo</text>
        <text x="0" y="32" fill="${palette.secondary}" font-family="sans-serif" font-size="8" text-anchor="middle" letter-spacing="1" opacity="0.75">DIRECCIONAL</text>
      </g>
    `;
  }

  // 4. Ablativo ('da) -> Ángulo hacia atrás ‹
  if (particleId === 'suf_da') {
    return `
      <g id="particula-arco-ablativo" transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="15" fill="${palette.fillAccent}" stroke="${palette.secondary}" stroke-width="0.9" opacity="0.8" />
        <path d="M 5 -7 L -5 0 L 5 7" fill="none" stroke="${palette.secondary}" stroke-width="${(thick * 1.25).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="-18" y="-30" width="36" height="15" rx="4" fill="#030712" stroke="${palette.borderStroke}" stroke-width="0.8" opacity="0.92" />
        <text x="0" y="-19" fill="${palette.secondary}" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">'da</text>
        <text x="0" y="32" fill="${palette.secondary}" font-family="sans-serif" font-size="8" text-anchor="middle" letter-spacing="1" opacity="0.75">ABLATIVO</text>
      </g>
    `;
  }

  // 5. Pausa Litúrgica Especular (··)
  if (pauseType === 'pause') {
    return `
      <g id="particula-arco-pausa" transform="translate(${x}, ${y})">
        <circle cx="-8" cy="0" r="3.8" fill="${palette.primary}" />
        <circle cx="-8" cy="0" r="8" fill="none" stroke="${palette.secondary}" stroke-width="0.9" opacity="0.8" />
        <circle cx="8" cy="0" r="3.8" fill="${palette.primary}" />
        <circle cx="8" cy="0" r="8" fill="none" stroke="${palette.secondary}" stroke-width="0.9" opacity="0.8" />
        <text x="0" y="-18" fill="${palette.secondary}" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle" opacity="0.9">·· PAUSA ··</text>
      </g>
    `;
  }

  // 6. Si no hay partícula semántica pero las partículas sobre arco están activadas
  if (showParticlesConfig) {
    return `
      <g id="particula-arco-armonica" transform="translate(${x}, ${y})">
        <circle cx="0" cy="0" r="3.2" fill="${palette.secondary}" />
        <circle cx="0" cy="0" r="7" fill="none" stroke="${palette.secondary}" stroke-width="0.7" opacity="0.5" stroke-dasharray="2 3" />
        <text x="0" y="-12" fill="${palette.secondary}" font-family="monospace" font-size="10" text-anchor="middle" opacity="0.8">·</text>
      </g>
    `;
  }

  return '';
}

/**
 * Renderizado Canónico de Prefijos Morfológicos (Punto Inicial)
 * Sistema Tael'im (Sección 3.3 y 4.2)
 */
function renderCanonicalPrefixSvg(
  prefixId: string,
  startPt: { x: number; y: number },
  palette: PaletteTheme,
  scale: number
): string {
  const x = Number((startPt.x - 22 * scale).toFixed(1));
  const y = Number((startPt.y - 14 * scale).toFixed(1));
  const color = palette.primary;
  const sec = palette.secondary;
  const s = scale;

  let glyphSvg = '';
  let badgeLabel = 'PREF';

  switch (prefixId) {
    case 'pref_nu':
      glyphSvg = `
        <circle cx="0" cy="0" r="${(5.5 * s).toFixed(1)}" fill="${color}" />
        <circle cx="0" cy="0" r="${(9 * s).toFixed(1)}" fill="none" stroke="${sec}" stroke-width="0.8" opacity="0.7" />
      `;
      badgeLabel = 'Nu-';
      break;

    case 'pref_sha':
      glyphSvg = `
        <path d="M ${(-12 * s).toFixed(1)} 0 C ${(-8 * s).toFixed(1)} ${(-6 * s).toFixed(1)}, ${(-4 * s).toFixed(1)} ${(6 * s).toFixed(1)}, 0 0" 
              fill="none" stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = 'Sha-';
      break;

    case 'pref_o':
      glyphSvg = `
        <circle cx="0" cy="0" r="${(6.5 * s).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" />
      `;
      badgeLabel = 'O-';
      break;

    case 'pref_va':
      glyphSvg = `
        <line x1="${(10 * s).toFixed(1)}" y1="0" x2="${(-12 * s).toFixed(1)}" y2="0" 
              stroke="${color}" stroke-width="${(2.4 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = 'Va-';
      break;

    case 'pref_nai':
      glyphSvg = `
        <path d="M ${(-12 * s).toFixed(1)} ${(-7 * s).toFixed(1)} L ${(-5 * s).toFixed(1)} 0 L ${(-8 * s).toFixed(1)} 0 L 0 ${(7 * s).toFixed(1)}" 
              fill="none" stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
      `;
      badgeLabel = 'Nai-';
      break;

    case 'pref_an':
      glyphSvg = `
        <path d="M 0 ${(-6 * s).toFixed(1)} C ${(-7 * s).toFixed(1)} ${(-6 * s).toFixed(1)}, ${(-7 * s).toFixed(1)} ${(2 * s).toFixed(1)}, 0 ${(2 * s).toFixed(1)} M 0 ${(6 * s).toFixed(1)} L 0 ${(7 * s).toFixed(1)}" 
              fill="none" stroke="${color}" stroke-width="${(2.0 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = 'An-';
      break;

    case 'temp_min':
      glyphSvg = `
        <line x1="${(-12 * s).toFixed(1)}" y1="${(8 * s).toFixed(1)}" x2="${(12 * s).toFixed(1)}" y2="${(8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(2.5 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = 'min-';
      break;

    case 'temp_vor':
      glyphSvg = `
        <path d="M ${(-14 * s).toFixed(1)} 0 L ${(4 * s).toFixed(1)} 0 M ${(-1 * s).toFixed(1)} ${(-4 * s).toFixed(1)} L ${(4 * s).toFixed(1)} 0 L ${(-1 * s).toFixed(1)} ${(4 * s).toFixed(1)}" 
              fill="none" stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
      `;
      badgeLabel = 'vor-';
      break;

    case 'temp_kro':
      glyphSvg = `
        <circle cx="0" cy="0" r="${(5.5 * s).toFixed(1)}" fill="${color}" />
        <circle cx="0" cy="0" r="${(9.5 * s).toFixed(1)}" fill="none" stroke="${sec}" stroke-width="1.2" opacity="0.8" />
      `;
      badgeLabel = 'kro-';
      break;

    case 'temp_nu':
      glyphSvg = `
        <line x1="${(-6 * s).toFixed(1)}" y1="${(-6 * s).toFixed(1)}" x2="0" y2="0" 
              stroke="${color}" stroke-width="${(2.5 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = 'nu-';
      break;

    default:
      glyphSvg = `<circle cx="0" cy="0" r="${(4.5 * s).toFixed(1)}" fill="${color}" />`;
  }

  return `
    <g id="prefijo-${prefixId}" transform="translate(${x}, ${y})">
      ${glyphSvg}
      <text x="0" y="${(-12 * s).toFixed(1)}" fill="${sec}" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle" opacity="0.9">${badgeLabel}</text>
    </g>
  `;
}

/**
 * Renderizado Canónico de Infijos de Evidencialidad / Eje de la Verdad
 * Sistema Tael'im (Sección 4.2)
 */
function renderCanonicalInfixSvg(
  infixId: string,
  startPt: { x: number; y: number },
  palette: PaletteTheme,
  scale: number
): string {
  const x = Number(startPt.x.toFixed(1));
  const y = Number((startPt.y - 24 * scale).toFixed(1));
  const sec = palette.secondary;
  const s = scale;

  let glyphSvg = '';
  let badgeLabel = 'INF';

  switch (infixId) {
    case 'inf_ka':
      glyphSvg = `
        <circle cx="${(-5 * s).toFixed(1)}" cy="0" r="${(2.6 * s).toFixed(1)}" fill="${sec}" />
        <circle cx="${(5 * s).toFixed(1)}" cy="0" r="${(2.6 * s).toFixed(1)}" fill="${sec}" />
      `;
      badgeLabel = 'ka-';
      break;

    case 'inf_vo':
      glyphSvg = `
        <circle cx="0" cy="0" r="${(3.5 * s).toFixed(1)}" fill="${sec}" />
        <circle cx="0" cy="0" r="${(7.5 * s).toFixed(1)}" fill="none" stroke="${sec}" stroke-width="0.8" opacity="0.7" />
      `;
      badgeLabel = 'vo-';
      break;

    case 'inf_te':
      glyphSvg = `
        <polygon points="0,${(-7 * s).toFixed(1)} ${(6 * s).toFixed(1)},${(4 * s).toFixed(1)} ${(-6 * s).toFixed(1)},${(4 * s).toFixed(1)}" 
                 fill="none" stroke="${sec}" stroke-width="${(1.8 * s).toFixed(1)}" stroke-linejoin="round" />
      `;
      badgeLabel = 'te-';
      break;

    case 'inf_ri':
      glyphSvg = `
        <path d="M ${(-3 * s).toFixed(1)} ${(-6 * s).toFixed(1)} L ${(-8 * s).toFixed(1)} 0 L ${(-3 * s).toFixed(1)} ${(6 * s).toFixed(1)} M ${(3 * s).toFixed(1)} ${(-6 * s).toFixed(1)} L ${(-2 * s).toFixed(1)} 0 L ${(3 * s).toFixed(1)} ${(6 * s).toFixed(1)}" 
              fill="none" stroke="${sec}" stroke-width="${(1.8 * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
      `;
      badgeLabel = 'ri-';
      break;

    default:
      glyphSvg = `<circle cx="0" cy="0" r="${(3 * s).toFixed(1)}" fill="${sec}" />`;
  }

  return `
    <g id="infijo-${infixId}" transform="translate(${x}, ${y})">
      ${glyphSvg}
      <text x="0" y="${(-10 * s).toFixed(1)}" fill="${sec}" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle" opacity="0.9">${badgeLabel}</text>
    </g>
  `;
}

/**
 * Renderizado Canónico de Sufijos Nominales, Aspectuales y de Cierre
 * Sistema Tael'im (Sección 3.3 y 4.2)
 */
function renderCanonicalSuffixSvg(
  suffixId: string,
  endPt: { x: number; y: number },
  palette: PaletteTheme,
  scale: number
): string {
  const x = Number((endPt.x + 20 * scale).toFixed(1));
  const y = Number(endPt.y.toFixed(1));
  const color = palette.secondary;
  const pri = palette.primary;
  const s = scale;

  let glyphSvg = '';
  let badgeLabel = 'SUF';

  switch (suffixId) {
    case 'suf_or':
      glyphSvg = `
        <circle cx="0" cy="${(-5 * s).toFixed(1)}" r="${(2.4 * s).toFixed(1)}" fill="${color}" />
        <circle cx="${(-5 * s).toFixed(1)}" cy="${(5 * s).toFixed(1)}" r="${(2.4 * s).toFixed(1)}" fill="${color}" />
        <circle cx="${(5 * s).toFixed(1)}" cy="${(5 * s).toFixed(1)}" r="${(2.4 * s).toFixed(1)}" fill="${color}" />
      `;
      badgeLabel = '-or';
      break;

    case 'suf_im':
      return `
        <g id="sufijo-im" transform="translate(${endPt.x.toFixed(1)}, ${endPt.y.toFixed(1)})">
          <circle cx="0" cy="0" r="${(13 * s).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(2.0 * s).toFixed(1)}" stroke-dasharray="3 3" />
          <circle cx="0" cy="0" r="${(17 * s).toFixed(1)}" fill="none" stroke="${pri}" stroke-width="0.8" opacity="0.6" />
          <text x="${(20 * s).toFixed(1)}" y="${(-8 * s).toFixed(1)}" fill="${color}" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle" opacity="0.9">-im</text>
        </g>
      `;

    case 'suf_ya':
      glyphSvg = `
        <circle cx="0" cy="0" r="${(8.5 * s).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(1.8 * s).toFixed(1)}" />
        <circle cx="0" cy="0" r="${(2.8 * s).toFixed(1)}" fill="${pri}" />
      `;
      badgeLabel = '-yā';
      break;

    case 'suf_tue':
      glyphSvg = `
        <line x1="${(-3 * s).toFixed(1)}" y1="${(-8 * s).toFixed(1)}" x2="${(-3 * s).toFixed(1)}" y2="${(8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" />
        <line x1="${(3 * s).toFixed(1)}" y1="${(-8 * s).toFixed(1)}" x2="${(3 * s).toFixed(1)}" y2="${(8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = '-tuē';
      break;

    case 'suf_vun':
      return `
        <g id="sufijo-vun" transform="translate(${endPt.x.toFixed(1)}, ${endPt.y.toFixed(1)})">
          <rect x="${(-12 * s).toFixed(1)}" y="${(-12 * s).toFixed(1)}" width="${(24 * s).toFixed(1)}" height="${(24 * s).toFixed(1)}" rx="${(3 * s).toFixed(1)}" 
                fill="none" stroke="${color}" stroke-width="${(2.0 * s).toFixed(1)}" />
          <text x="${(18 * s).toFixed(1)}" y="${(-14 * s).toFixed(1)}" fill="${color}" font-family="monospace" font-size="8" font-weight="bold" opacity="0.9">-vun</text>
        </g>
      `;

    case 'asp_aen':
      glyphSvg = `
        <path d="M 0 0 m ${(-1.5 * s).toFixed(1)} 0 a ${(1.5 * s).toFixed(1)},${(1.5 * s).toFixed(1)} 0 1,0 ${(3 * s).toFixed(1)},0 a ${(3 * s).toFixed(1)},${(3 * s).toFixed(1)} 0 1,0 ${(-6 * s).toFixed(1)},0 a ${(6 * s).toFixed(1)},${(6 * s).toFixed(1)} 0 1,0 ${(12 * s).toFixed(1)},0" 
              fill="none" stroke="${color}" stroke-width="${(1.8 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = '-aen';
      break;

    case 'asp_re':
      glyphSvg = `
        <line x1="${(-4 * s).toFixed(1)}" y1="${(8 * s).toFixed(1)}" x2="${(2 * s).toFixed(1)}" y2="${(-8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" />
        <line x1="${(2 * s).toFixed(1)}" y1="${(8 * s).toFixed(1)}" x2="${(8 * s).toFixed(1)}" y2="${(-8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = '-re';
      break;

    case 'asp_in':
      glyphSvg = `
        <path d="M ${(-8 * s).toFixed(1)} 0 L ${(8 * s).toFixed(1)} 0 M ${(2 * s).toFixed(1)} ${(-5 * s).toFixed(1)} L ${(8 * s).toFixed(1)} 0 L ${(2 * s).toFixed(1)} ${(5 * s).toFixed(1)}" 
              fill="none" stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
      `;
      badgeLabel = '-in';
      break;

    case 'clos_el':
      glyphSvg = `
        <line x1="${(-6 * s).toFixed(1)}" y1="${(8 * s).toFixed(1)}" x2="${(6 * s).toFixed(1)}" y2="${(-8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(2.5 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = '-el';
      break;

    case 'clos_un':
      glyphSvg = `
        <line x1="${(-6 * s).toFixed(1)}" y1="${(-8 * s).toFixed(1)}" x2="${(6 * s).toFixed(1)}" y2="${(8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(2.5 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = '-un';
      break;

    case 'clos_ri':
      glyphSvg = `
        <line x1="${(-3 * s).toFixed(1)}" y1="${(-8 * s).toFixed(1)}" x2="${(-3 * s).toFixed(1)}" y2="${(8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(3.5 * s).toFixed(1)}" stroke-linecap="round" />
        <line x1="${(3 * s).toFixed(1)}" y1="${(-8 * s).toFixed(1)}" x2="${(3 * s).toFixed(1)}" y2="${(8 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(3.5 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = '-ri';
      break;

    case 'clos_nil':
      glyphSvg = `
        <circle cx="0" cy="0" r="${(7.5 * s).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(1.8 * s).toFixed(1)}" />
        <line x1="${(-5 * s).toFixed(1)}" y1="${(5 * s).toFixed(1)}" x2="${(5 * s).toFixed(1)}" y2="${(-5 * s).toFixed(1)}" 
              stroke="${color}" stroke-width="${(1.8 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = '-nil';
      break;

    case 'clos_he':
      glyphSvg = `
        <path d="M ${(-8 * s).toFixed(1)} 0 Q 0 ${(-12 * s).toFixed(1)} ${(8 * s).toFixed(1)} 0" 
              fill="none" stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = '-he';
      break;

    case 'clos_fi':
      glyphSvg = `
        <circle cx="0" cy="${(5 * s).toFixed(1)}" r="${(2.4 * s).toFixed(1)}" fill="${color}" />
        <path d="M 0 ${(5 * s).toFixed(1)} L 0 ${(-9 * s).toFixed(1)} M ${(-4 * s).toFixed(1)} ${(-5 * s).toFixed(1)} L 0 ${(-10 * s).toFixed(1)} L ${(4 * s).toFixed(1)} ${(-5 * s).toFixed(1)}" 
              fill="none" stroke="${color}" stroke-width="${(2.0 * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
      `;
      badgeLabel = '-fi';
      break;

    case 'suf_na':
      glyphSvg = `
        <circle cx="0" cy="0" r="${(7 * s).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${(1.8 * s).toFixed(1)}" />
        <circle cx="0" cy="0" r="${(2.5 * s).toFixed(1)}" fill="${pri}" />
      `;
      badgeLabel = "'na";
      break;

    case 'suf_vi':
      glyphSvg = `
        <line x1="${(-3 * s).toFixed(1)}" y1="${(7 * s).toFixed(1)}" x2="${(1 * s).toFixed(1)}" y2="${(-7 * s).toFixed(1)}" stroke="${color}" stroke-width="${(2.0 * s).toFixed(1)}" stroke-linecap="round" />
        <line x1="${(3 * s).toFixed(1)}" y1="${(7 * s).toFixed(1)}" x2="${(7 * s).toFixed(1)}" y2="${(-7 * s).toFixed(1)}" stroke="${color}" stroke-width="${(2.0 * s).toFixed(1)}" stroke-linecap="round" />
      `;
      badgeLabel = "'vi";
      break;

    case 'suf_zo':
      glyphSvg = `
        <path d="M ${(-4 * s).toFixed(1)} ${(-6 * s).toFixed(1)} L ${(4 * s).toFixed(1)} 0 L ${(-4 * s).toFixed(1)} ${(6 * s).toFixed(1)}" 
              fill="none" stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
      `;
      badgeLabel = "'zo";
      break;

    case 'suf_da':
      glyphSvg = `
        <path d="M ${(4 * s).toFixed(1)} ${(-6 * s).toFixed(1)} L ${(-4 * s).toFixed(1)} 0 L ${(4 * s).toFixed(1)} ${(6 * s).toFixed(1)}" 
              fill="none" stroke="${color}" stroke-width="${(2.2 * s).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" />
      `;
      badgeLabel = "'da";
      break;

    default:
      glyphSvg = `<circle cx="0" cy="0" r="${(4 * s).toFixed(1)}" fill="${color}" />`;
  }

  return `
    <g id="sufijo-${suffixId}" transform="translate(${x}, ${y})">
      ${glyphSvg}
      <text x="0" y="${(-12 * s).toFixed(1)}" fill="${color}" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle" opacity="0.9">${badgeLabel}</text>
    </g>
  `;
}

/**
 * GENERADOR PRINCIPAL DEL CÓDICE VECTORIAL (SVG) CON ARCOS DINÁMICOS
 */
export function generateCalligramSvg(
  expression: string, 
  config: CalligramConfig,
  selectedUnitIndex: number | number[] | null = null
): string {
  const isSelected = (idx: number): boolean => {
    if (selectedUnitIndex === null || selectedUnitIndex === undefined) return false;
    if (Array.isArray(selectedUnitIndex)) return selectedUnitIndex.includes(idx);
    return selectedUnitIndex === idx;
  };

  const parsed = parseTaelimExpression(expression || '');
  const units: GlyphUnit[] = parsed.units.length > 0 ? parsed.units : [
    {
      id: 'default-unit',
      originalText: 'Vael',
      rootText: 'Vael',
      cleanRoot: 'Vael',
      prefixId: null,
      infixId: null,
      suffixId: null
    }
  ];

  const basePalette = PALETTES[config.palette] || PALETTES.uniae;
  const isCustomColor = config.colorMode === 'custom' && Boolean(config.customColorPrimary);
  const isGradient = config.colorMode === 'gradient' || Boolean(config.isGradient);

  const primaryColor = isGradient 
    ? 'url(#caligramaGradiente)' 
    : (isCustomColor ? config.customColorPrimary! : basePalette.primary);

  const secondaryColor = isCustomColor 
    ? (config.customColorSecondary || '#ffffff') 
    : basePalette.secondary;

  const glowColor = isCustomColor 
    ? (config.customColorPrimary || '#22d3ee') 
    : basePalette.glow;

  const fillAccent = isCustomColor 
    ? `${config.customColorPrimary!}18` 
    : basePalette.fillAccent;

  const borderStroke = isCustomColor 
    ? `${config.customColorPrimary!}40` 
    : basePalette.borderStroke;

  const palette: PaletteTheme = {
    id: config.palette,
    name: isCustomColor ? 'Personalizado' : (isGradient ? 'Gradiente Sagrado' : basePalette.name),
    loreLabel: isCustomColor ? 'Frecuencia Cromática Personalizada' : basePalette.loreLabel,
    primary: primaryColor,
    secondary: secondaryColor,
    glow: glowColor,
    fillAccent: fillAccent,
    borderStroke: borderStroke
  };

  const numUnits = units.length;

  // 1. Obtener bases de arquetipo
  const archetypeBases = computeArchetypePlacements(units, config);

  // 2. Aplicar transformaciones individuales dinámicas
  const placements: UnitPlacement[] = units.map((unit, idx) => {
    const base = archetypeBases[idx] || { baseCx: CENTER, baseCy: CENTER, baseRot: 0 };
    const custom: UnitCustomTransform | undefined = config.customTransforms?.[idx];

    const cx = base.baseCx + (custom?.offsetX || 0);
    const cy = base.baseCy + (custom?.offsetY || 0);
    const rot = base.baseRot + (custom?.rotation || 0);
    const s = (config.sacredScale || 1.0) * (custom?.scale || 1.0);

    const gridMode = config.gridMode || 'algante';
    const localPts = getRadicalLocalPoints(unit.cleanRoot, gridMode);
    const worldPts = localPts.map(p => toWorld(p.x, p.y, cx, cy, rot, s));

    return {
      index: idx,
      unit,
      cx,
      cy,
      baseCx: base.baseCx,
      baseCy: base.baseCy,
      rotation: rot,
      scale: s,
      localPoints: localPts,
      worldPoints: worldPts
    };
  });

  // 3. Selección del color del arco
  let resolvedArcColor = isGradient ? (config.gradientColors?.start || '#06b6d4') : palette.primary;
  if (config.customColorArc) {
    resolvedArcColor = config.customColorArc;
  } else if (config.arcColorMode === 'dorado') {
    resolvedArcColor = '#fbbf24';
  } else if (config.arcColorMode === 'plata') {
    resolvedArcColor = '#e2e8f0';
  } else if (config.arcColorMode === 'esmeralda') {
    resolvedArcColor = '#34d399';
  } else if ((config.arcColorMode as string) === 'violet' || (config.arcColorMode as string) === 'violeta') {
    resolvedArcColor = '#a855f7';
  } else if ((config.arcColorMode as string) === 'cyan') {
    resolvedArcColor = '#22d3ee';
  }

  // 4. Parámetros de trazo del arco
  let arcDash = '';
  if (config.arcStyle === 'punteado') arcDash = 'stroke-dasharray="3 7" stroke-linecap="round"';
  else if (config.arcStyle === 'pulsos') arcDash = 'stroke-dasharray="14 8" stroke-linecap="round"';
  else if ((config.arcStyle as string) === 'discontinuo') arcDash = 'stroke-dasharray="9 6" stroke-linecap="round"';

  const arcOpacity = ((config.arcOpacity ?? 85) / 100).toFixed(2);
  const arcThickness = (config.arcThickness ?? 2.2).toFixed(1);

  // Filtros y Animación
  const filterId = 'taelvohn-halo';
  const animStyle = config.breathingAnimation ? 'animation: taelvohnPulse 3.5s ease-in-out infinite;' : '';

  let svgContent = '';

  // 5. Guías de Geometría Sagrada de Fondo (si están activadas)
  if (config.showSacredGuides) {
    svgContent += `
      <!-- Geometría Sagrada de Fondo -->
      <g opacity="0.3" stroke="${palette.borderStroke}" fill="none">
    `;

    if (config.geometry === 'mandala') {
      svgContent += `
        <circle cx="${CENTER}" cy="${CENTER}" r="380" stroke-width="1.2" stroke-dasharray="4 8" />
        <circle cx="${CENTER}" cy="${CENTER}" r="${config.globalRadius || 260}" stroke-width="1.5" />
        <circle cx="${CENTER}" cy="${CENTER}" r="140" stroke-width="1" stroke-dasharray="2 4" />
        <circle cx="${CENTER}" cy="${CENTER}" r="38" stroke-width="2" fill="${palette.fillAccent}" />
        <line x1="${CENTER}" y1="60" x2="${CENTER}" y2="940" stroke-width="0.8" stroke-dasharray="1 6" />
        <line x1="60" y1="${CENTER}" x2="940" y2="${CENTER}" stroke-width="0.8" stroke-dasharray="1 6" />
      `;
    } else if (config.geometry === 'estela') {
      svgContent += `
        <line x1="${CENTER}" y1="80" x2="${CENTER}" y2="920" stroke-width="1.5" stroke-dasharray="6 6" />
        <line x1="${CENTER - 120}" y1="120" x2="${CENTER + 120}" y2="120" stroke-width="1.2" />
        <line x1="${CENTER - 120}" y1="880" x2="${CENTER + 120}" y2="880" stroke-width="1.2" />
        <path d="M ${CENTER - 120} 120 L ${CENTER - 140} 140 L ${CENTER - 140} 860 L ${CENTER - 120} 880" stroke-width="1" />
        <path d="M ${CENTER + 120} 120 L ${CENTER + 140} 140 L ${CENTER + 140} 860 L ${CENTER + 120} 880" stroke-width="1" />
      `;
    } else if (config.geometry === 'delta') {
      svgContent += `
        <polygon points="${CENTER},180 ${CENTER + 320},780 ${CENTER - 320},780" stroke-width="1.5" />
        <circle cx="${CENTER}" cy="${CENTER + 180}" r="160" stroke-width="1" stroke-dasharray="3 6" />
      `;
    } else if (config.geometry === 'diamante') {
      svgContent += `
        <polygon points="${CENTER},160 ${CENTER + 360},${CENTER} ${CENTER},840 ${CENTER - 360},${CENTER}" stroke-width="1.5" />
        <circle cx="${CENTER}" cy="${CENTER}" r="220" stroke-width="0.8" stroke-dasharray="4 6" />
      `;
    } else if (config.geometry === 'infinito') {
      svgContent += `
        <path d="M 220 ${CENTER} C 220 360, 420 360, 500 ${CENTER} C 580 640, 780 640, 780 ${CENTER} C 780 360, 580 360, 500 ${CENTER} C 420 640, 220 640, 220 ${CENTER} Z" stroke-width="1.5" stroke-dasharray="5 5" />
        <circle cx="${CENTER}" cy="${CENTER}" r="30" stroke-width="1" fill="${palette.fillAccent}" />
      `;
    } else {
      svgContent += `
        <circle cx="${CENTER}" cy="${CENTER}" r="320" stroke-width="0.8" stroke-dasharray="2 8" />
        <path d="M 180 820 Q 500 200 820 820" stroke-width="1" stroke-dasharray="4 8" />
      `;
    }

    svgContent += `</g>`;
  }

  // 6. Retícula de Nexos Fónicos si está activada
  if (config.showNexuses) {
    const isComun = (config.gridMode || 'algante') === 'comun';
    const gridCols = isComun ? 4 : 6;
    const gridRows = isComun ? 6 : 4;
    const centerX = isComun ? 1.5 : 2.5;
    const centerY = isComun ? 2.5 : 1.5;

    svgContent += `<g id="nexos-fonicos" opacity="0.35">`;
    placements.forEach(p => {
      for (let gy = 0; gy < gridRows; gy++) {
        for (let gx = 0; gx < gridCols; gx++) {
          const lx = (gx - centerX) * CELL_SIZE;
          const ly = (gy - centerY) * CELL_SIZE;
          const wp = toWorld(lx, ly, p.cx, p.cy, p.rotation, p.scale);
          svgContent += `<circle cx="${wp.x.toFixed(1)}" cy="${wp.y.toFixed(1)}" r="1.5" fill="${palette.primary}" />`;
        }
      }
    });
    svgContent += `</g>`;
  }

  // 7. ARCOS DE VÍNCULO DINÁMICOS ENTRE SÍMBOLOS (Inquebrantables)
  const arcGlowStyle = (config.arcGlow && config.arcGlow > 0) ? `filter: drop-shadow(0 0 ${config.arcGlow}px ${resolvedArcColor});` : '';
  svgContent += `<g id="arcos-de-vinculo" stroke="${resolvedArcColor}" fill="none" style="${arcGlowStyle}">`;
  const tensionNorm = (config.arcTension ?? 55) / 50; // 0 a 2

  for (let i = 0; i < placements.length - 1; i++) {
    const cur = placements[i];
    const nxt = placements[i + 1];
    const p1 = cur.worldPoints[cur.worldPoints.length - 1]; // Salida de radical actual
    const p2 = nxt.worldPoints[0]; // Entrada de radical siguiente

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const nx = -dy / (dist || 1);
    const ny = dx / (dist || 1);
    const curveAmp = Math.max(15, dist * 0.32) * tensionNorm;

    const cpX = midX + nx * curveAmp;
    const cpY = midY + ny * curveAmp;

    if (config.arcStyle === 'doble') {
      // Doble arco concéntrico ceremonial
      const offsetD = 3.5;
      svgContent += `
        <path d="M ${(p1.x + nx * offsetD).toFixed(1)} ${(p1.y + ny * offsetD).toFixed(1)} Q ${(cpX + nx * offsetD).toFixed(1)} ${(cpY + ny * offsetD).toFixed(1)} ${(p2.x + nx * offsetD).toFixed(1)} ${(p2.y + ny * offsetD).toFixed(1)}" 
              stroke-width="${(Number(arcThickness) * 0.65).toFixed(1)}" opacity="${arcOpacity}" stroke-linecap="round" />
        <path d="M ${(p1.x - nx * offsetD).toFixed(1)} ${(p1.y - ny * offsetD).toFixed(1)} Q ${(cpX - nx * offsetD).toFixed(1)} ${(cpY - ny * offsetD).toFixed(1)} ${(p2.x - nx * offsetD).toFixed(1)} ${(p2.y - ny * offsetD).toFixed(1)}" 
              stroke-width="${(Number(arcThickness) * 0.65).toFixed(1)}" opacity="${arcOpacity}" stroke-linecap="round" />
      `;
    } else {
      svgContent += `
        <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" 
              stroke-width="${arcThickness}" opacity="${arcOpacity}" ${arcDash} stroke-linecap="round" />
      `;
    }

    // Terminales / Nodos de Anclaje
    if (config.showArcTerminals) {
      svgContent += `
        <circle cx="${p1.x.toFixed(1)}" cy="${p1.y.toFixed(1)}" r="${Math.max(3, Number(arcThickness) * 1.5)}" fill="${resolvedArcColor}" />
        <circle cx="${p2.x.toFixed(1)}" cy="${p2.y.toFixed(1)}" r="${Math.max(3, Number(arcThickness) * 1.5)}" fill="${resolvedArcColor}" />
      `;
    }

    // Partícula relacional canónica o pausa sobre el vértice del arco
    const matchingArc = parsed.arcs?.find(a => a.fromIndex === cur.index && a.toIndex === nxt.index) || parsed.arcs?.[i];
    const particleId = matchingArc?.particleId;
    const pauseType = matchingArc?.pauseType;

    if (particleId || pauseType === 'pause' || config.showParticles) {
      svgContent += renderCanonicalArcParticleSvg(
        particleId,
        pauseType,
        cpX,
        cpY,
        palette,
        Number(arcThickness),
        config.showParticles ?? true
      );
    }
  }

  // Cerrar lazo en Mandala si tiene más de 2 unidades
  if (config.geometry === 'mandala' && placements.length > 2) {
    const last = placements[placements.length - 1];
    const first = placements[0];
    const p1 = last.worldPoints[last.worldPoints.length - 1];
    const p2 = first.worldPoints[0];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / (dist || 1);
    const ny = dx / (dist || 1);
    const curveAmp = 30 * tensionNorm;

    const cpX = midX + nx * curveAmp;
    const cpY = midY + ny * curveAmp;

    svgContent += `
      <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" 
            stroke-width="${(Number(arcThickness) * 0.6).toFixed(1)}" 
            stroke-dasharray="4 6" 
            opacity="${(Number(arcOpacity) * 0.7).toFixed(2)}" />
    `;
  }
  svgContent += `</g>`;

  // 8. TRAZOS CALIGRÁFICOS PRINCIPALES (Cálamo Veyvān)
  svgContent += `<g id="trazos-caligraficos" filter="url(#${filterId})" style="${animStyle}">`;

  if (config.geometry === 'asemic') {
    // MONOTRAZADO ASÉMICO CONTINUO
    const allWorldPoints: { x: number; y: number }[] = [];
    placements.forEach((p, pIdx) => {
      p.worldPoints.forEach(pt => allWorldPoints.push(pt));
      if (pIdx < placements.length - 1) {
        const nextP = placements[pIdx + 1];
        const lastPt = p.worldPoints[p.worldPoints.length - 1];
        const firstPtNext = nextP.worldPoints[0];
        allWorldPoints.push({ x: (lastPt.x + firstPtNext.x) / 2, y: (lastPt.y + firstPtNext.y) / 2 });
      }
    });

    const asemicPath = generateBrushPathString(
      allWorldPoints, 
      config.strokeWidth * 3.4,
      config.penAngle,
      config.calligraphyInfluence
    );

    svgContent += `
      <path d="${asemicPath}" fill="${palette.primary}" />
      <path d="${asemicPath}" stroke="${palette.secondary}" stroke-width="0.8" fill="none" opacity="0.8" />
    `;

    // Nodos interactivos en modo asémico para arrastre dinámico
    placements.forEach(p => {
      const isThisSelected = isSelected(p.index);
      svgContent += `
        <g id="asemic-nodo-${p.index}" data-radical-index="${p.index}" data-cx="${p.cx.toFixed(1)}" data-cy="${p.cy.toFixed(1)}" style="cursor: grab;">
          <circle cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" r="70" fill="#000000" fill-opacity="0.001" pointer-events="all" />
      `;
      if (isThisSelected) {
        svgContent += `
          <circle cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" r="68" fill="rgba(34,211,238,0.06)" stroke="#22d3ee" stroke-width="1.8" stroke-dasharray="5 5" opacity="0.95" />
          <circle cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" r="5" fill="#22d3ee" />
          <rect x="${(p.cx - 36).toFixed(1)}" y="${(p.cy + 74).toFixed(1)}" width="72" height="18" rx="4" fill="#030712" stroke="#22d3ee" stroke-width="1" opacity="0.9" />
          <text x="${p.cx.toFixed(1)}" y="${(p.cy + 87).toFixed(1)}" fill="#22d3ee" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold">${p.unit.cleanRoot}</text>
        `;
      }
      svgContent += `</g>`;
    });
  } else {
    // TRAZOS POR RADICAL INDIVIDUAL CON SELECCIÓN Y ESTILOS
    placements.forEach(p => {
      const isThisSelected = isSelected(p.index);
      const brushPath = generateBrushPathString(
        p.worldPoints, 
        config.strokeWidth * 3.2,
        config.penAngle,
        config.calligraphyInfluence,
        config.tension ?? 0.35,
        config.waveFreq ?? 0,
        config.waveAmp ?? 0,
        config.smoothEnds ?? true,
        config.nodeStartPressure ?? 1.25,
        config.nodeMidPressure ?? 0.9,
        config.nodeEndPressure ?? 0.55
      );

      svgContent += `
        <g id="radical-nodo-${p.index}" data-radical-index="${p.index}" data-cx="${p.cx.toFixed(1)}" data-cy="${p.cy.toFixed(1)}" style="cursor: grab;">
          <!-- Área de captura amplia invisible para agarre y arrastre táctil/ratón -->
          <circle cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" r="75" fill="#000000" fill-opacity="0.001" pointer-events="all" />
      `;

      // Anillo de selección si este radical está activo en el inspector
      if (isThisSelected) {
        svgContent += `
          <circle cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" r="72" fill="rgba(34,211,238,0.06)" stroke="#22d3ee" stroke-width="1.8" stroke-dasharray="6 4" opacity="0.95" />
          <circle cx="${p.cx.toFixed(1)}" cy="${p.cy.toFixed(1)}" r="4.5" fill="#22d3ee" />
          <rect x="${(p.cx - 36).toFixed(1)}" y="${(p.cy + 76).toFixed(1)}" width="72" height="18" rx="4" fill="#030712" stroke="#22d3ee" stroke-width="1" opacity="0.9" />
          <text x="${p.cx.toFixed(1)}" y="${(p.cy + 89).toFixed(1)}" fill="#22d3ee" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold">${p.unit.cleanRoot}</text>
        `;
      }

      // Ecos de plasma / Capas duplicadas (si están activos)
      const totalEchoes = config.echoes || 0;
      const echoOffset = config.echoOffset || 10;
      if (totalEchoes > 0) {
        for (let echoIdx = 1; echoIdx <= totalEchoes; echoIdx++) {
          const offsetD = echoIdx * echoOffset;
          const echoPoints = p.worldPoints.map(pt => ({ x: pt.x + offsetD, y: pt.y + offsetD }));
          const echoPath = generateBrushPathString(
            echoPoints,
            config.strokeWidth * 3.2 * 0.75,
            config.penAngle,
            config.calligraphyInfluence,
            config.tension ?? 0.35,
            config.waveFreq ?? 0,
            config.waveAmp ?? 0,
            config.smoothEnds ?? true
          );
          svgContent += `
            <path d="${echoPath}" fill="${palette.primary}" opacity="${(0.35 / echoIdx).toFixed(2)}" filter="url(#${filterId})" />
          `;
        }
      }

      // Estilos de trazo seleccionables
      if (config.strokeRenderMode === 'filigrana') {
        svgContent += `
          <path d="${brushPath}" fill="${palette.primary}" opacity="0.8" />
          <path d="${brushPath}" stroke="${palette.secondary}" stroke-width="1.2" fill="none" />
          <path d="M ${p.worldPoints.map(pt => `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' L ')}" fill="none" stroke="#fef08a" stroke-width="1" opacity="0.95" />
        `;
      } else if (config.strokeRenderMode === 'precision') {
        svgContent += `
          <path d="M ${p.worldPoints.map(pt => `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' L ')}" fill="none" stroke="${palette.primary}" stroke-width="${config.strokeWidth * 1.5}" stroke-linecap="round" stroke-linejoin="round" />
          <path d="${brushPath}" stroke="${palette.secondary}" stroke-width="0.5" fill="none" opacity="0.5" stroke-dasharray="2 3" />
        `;
      } else if (config.strokeRenderMode === 'organico') {
        svgContent += `
          <path d="${brushPath}" fill="${palette.primary}" />
          <path d="${brushPath}" stroke="${palette.secondary}" stroke-width="0.8" fill="none" opacity="0.85" />
        `;
      } else {
        // Plasma estándar
        svgContent += `
          <path d="${brushPath}" fill="${palette.primary}" />
          <path d="${brushPath}" stroke="${palette.secondary}" stroke-width="0.6" fill="none" opacity="0.9" />
        `;
      }

      // Salpicaduras de densidad de tinta (procedural)
      if ((config.inkDensity ?? 0) > 0) {
        const density = config.inkDensity!;
        p.worldPoints.forEach((pt, idx) => {
          const seed = (pt.x * pt.y) + idx;
          const count = Math.floor((density / 10) * ((seed % 10) / 10 + 0.6));
          for (let k = 0; k < count; k++) {
            const angle = (seed * (k + 1)) % (Math.PI * 2);
            const dist = 14 + (seed * (k + 1) * 7) % 55;
            const size = 3 * (((seed + k) % 10) / 10);
            svgContent += `
              <circle cx="${(pt.x + Math.cos(angle) * dist).toFixed(1)}" 
                      cy="${(pt.y + Math.sin(angle) * dist).toFixed(1)}" 
                      r="${size.toFixed(1)}" 
                      fill="${palette.primary}" 
                      opacity="0.65" />
            `;
          }
        });
      }

      // Partículas estelares orbitando
      if ((config.particles ?? 0) > 0) {
        const count = Math.floor((config.particles! / 2) + 2);
        p.worldPoints.forEach((pt) => {
          for (let k = 0; k < count; k++) {
            const angle = (pt.x * (k + 1)) % (Math.PI * 2);
            const dist = 16 + (pt.y * (k + 1)) % 65;
            const size = 1.2 + (k % 2) * 1.0;
            svgContent += `
              <circle cx="${(pt.x + Math.cos(angle) * dist).toFixed(1)}" 
                      cy="${(pt.y + Math.sin(angle) * dist).toFixed(1)}" 
                      r="${size.toFixed(1)}" 
                      fill="${palette.secondary}" 
                      opacity="0.75" 
                      filter="url(#${filterId})" />
            `;
          }
        });
      }

      svgContent += `</g>`;
    });
  }

  svgContent += `</g>`;

  // 9. Afijos Morfológicos (Diacríticos y Satélites Canónicos)
  if (config.showDiacritics) {
    svgContent += `<g id="afijos-morfológicos" fill="${palette.secondary}" stroke="${palette.primary}">`;
    placements.forEach(p => {
      const startPt = p.worldPoints[0];
      const endPt = p.worldPoints[p.worldPoints.length - 1];
      const s = (config.diacriticScale ?? 1.0) * Math.min(1.4, Math.max(0.7, p.scale));

      if (p.unit.prefixId) {
        svgContent += renderCanonicalPrefixSvg(p.unit.prefixId, startPt, palette, s);
      }

      if (p.unit.infixId) {
        svgContent += renderCanonicalInfixSvg(p.unit.infixId, startPt, palette, s);
      }

      if (p.unit.suffixId) {
        svgContent += renderCanonicalSuffixSvg(p.unit.suffixId, endPt, palette, s);
      }
    });
    svgContent += `</g>`;
  }

  // 10. Sello de Resonancia Cromática Canónico
  if (config.showChromaticResonance) {
    svgContent += `
      <g id="sello-cromatico" transform="translate(870, 870)" opacity="0.85">
        <circle cx="0" cy="0" r="32" fill="none" stroke="${palette.borderStroke}" stroke-width="1.2" />
        <circle cx="0" cy="0" r="24" fill="${palette.fillAccent}" />
    `;

    switch (config.palette) {
      case 'iloniae':
        svgContent += `
          <circle cx="0" cy="0" r="7" fill="${palette.primary}" />
          <line x1="0" y1="-14" x2="0" y2="-8" stroke="${palette.primary}" stroke-width="2" />
          <line x1="-11" y1="10" x2="-6" y2="6" stroke="${palette.primary}" stroke-width="2" />
          <line x1="11" y1="10" x2="6" y2="6" stroke="${palette.primary}" stroke-width="2" />
        `;
        break;
      case 'valniae':
        svgContent += `<polygon points="0,-12 11,8 -11,8" fill="${palette.primary}" />`;
        break;
      case 'uniae':
        svgContent += `<path d="M -14 0 Q -7 -7 0 0 T 14 0" stroke="${palette.primary}" stroke-width="2.5" fill="none" />`;
        break;
      case 'anniae':
        svgContent += `<circle cx="0" cy="0" r="10" fill="none" stroke="${palette.primary}" stroke-width="2.5" />`;
        break;
      case 'enniae':
        svgContent += `<path d="M 0 0 Q 6 -6 8 0 T 0 10 T -10 0 T 0 -12" stroke="${palette.primary}" stroke-width="2" fill="none" />`;
        break;
      case 'tyniae':
        svgContent += `<path d="M 0 -12 C 10 -4 10 8 0 12 C -10 8 -10 -4 0 -12 Z" fill="${palette.primary}" />`;
        break;
      case 'oxidado':
      default:
        svgContent += `
          <circle cx="-5" cy="0" r="3" fill="${palette.primary}" />
          <circle cx="5" cy="0" r="3" fill="${palette.primary}" />
        `;
        break;
    }

    svgContent += `
        <text x="0" y="48" fill="${palette.secondary}" font-family="monospace" font-size="9" text-anchor="middle" letter-spacing="2">
          ${palette.name.toUpperCase()}
        </text>
      </g>
    `;
  }

  // 11. Titulación ceremonial en la base
  svgContent += `
    <g id="titulacion-ceremonial" transform="translate(${CENTER}, 950)" opacity="0.75">
      <text x="0" y="0" fill="${palette.secondary}" font-family="'Rajdhani', sans-serif" font-weight="700" font-size="16" text-anchor="middle" letter-spacing="4">
        ${expression.toUpperCase()}
      </text>
      <text x="0" y="18" fill="${palette.primary}" font-family="monospace" font-size="9" text-anchor="middle" letter-spacing="3">
        SIGILO TAEL'VOHN // GEOMETRÍA ${config.geometry.toUpperCase()}
      </text>
    </g>
  `;

  // Estilos CSS incrustados para la respiración (sólo si está activa)
  const animKeyframes = `
    @keyframes taelvohnPulse {
      0%, 100% { opacity: 0.95; transform: scale(1); }
      50% { opacity: 0.75; transform: scale(0.99); }
    }
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_SIZE} ${VIEW_SIZE}" width="100%" height="100%" style="background-color: ${config.customColorBackground || 'transparent'};">
  <defs>
    <style>${animKeyframes}</style>
    ${isGradient ? `
    <linearGradient id="caligramaGradiente" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${config.gradientColors?.start || '#06b6d4'}" />
      <stop offset="100%" stop-color="${config.gradientColors?.end || '#a855f7'}" />
    </linearGradient>
    ` : ''}
    <filter id="${filterId}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${((config.glowIntensity ?? 65) * 0.15).toFixed(1)}" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  ${svgContent}
</svg>`;
}

/**
 * Calcula los límites dimensionales (Bounding Box) del caligrama actual
 * para permitir el auto-escalado perfecto y llenar el lienzo sin desperdiciar espacio.
 */
export function computeCalligramBounds(expression: string, config: CalligramConfig) {
  const parsed = parseTaelimExpression(expression || '');
  const units: GlyphUnit[] = parsed.units.length > 0 ? parsed.units : [
    { id: 'default-unit', originalText: 'Vael', rootText: 'Vael', cleanRoot: 'Vael', prefixId: null, infixId: null, suffixId: null }
  ];
  const archetypeBases = computeArchetypePlacements(units, config);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  units.forEach((unit, idx) => {
    const base = archetypeBases[idx] || { baseCx: CENTER, baseCy: CENTER, baseRot: 0 };
    const custom = config.customTransforms?.[idx];
    const cx = base.baseCx + (custom?.offsetX || 0);
    const cy = base.baseCy + (custom?.offsetY || 0);
    const rot = base.baseRot + (custom?.rotation || 0);
    const s = (config.sacredScale || 1.0) * (custom?.scale || 1.0);

    const gridMode = config.gridMode || 'algante';
    const localPts = getRadicalLocalPoints(unit.cleanRoot, gridMode);
    const worldPts = localPts.map(p => toWorld(p.x, p.y, cx, cy, rot, s));

    worldPts.forEach(pt => {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });

    if (cx < minX) minX = cx;
    if (cx > maxX) maxX = cx;
    if (cy < minY) minY = cy;
    if (cy > maxY) maxY = cy;
  });

  if (!isFinite(minX) || maxX <= minX || maxY <= minY) {
    minX = 250;
    maxX = 750;
    minY = 250;
    maxY = 750;
  }

  const width = Math.max(10, maxX - minX);
  const height = Math.max(10, maxY - minY);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}
