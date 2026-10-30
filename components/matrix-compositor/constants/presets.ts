import { PatternType, MatrixProject } from '../types/matrix';

export interface PatternCategory {
  category: 'Retículas Canónicas (Algante & Común)' | 'Familias Radiales' | 'Estructuras Sagradas' | 'Personalizada';
  items: {
    id: PatternType;
    label: string;
    sublabel: string;
    description: string;
    topology: string;
    recommendedOrientation?: 'horizontal' | 'vertical';
  }[];
}

export const PATTERN_CATEGORIES: PatternCategory[] = [
  {
    category: 'Retículas Canónicas (Algante & Común)',
    items: [
      {
        id: 'grid64',
        label: 'Rectangular 6 × 4',
        sublabel: 'Algante Litúrgica (Horizontal)',
        description: 'Matriz horizontal de la Élite Veyvān. Utilizada en decretos sagrados y formalismos.',
        topology: '6 cols × 4 filas',
        recommendedOrientation: 'horizontal',
      },
      {
        id: 'grid46',
        label: 'Rectangular 4 × 6',
        sublabel: 'Común Secular (Vertical)',
        description: 'Matriz vertical del Aliento General. Empleada en cubiertas operativas, nexos y habla común.',
        topology: '4 cols × 6 filas',
        recommendedOrientation: 'vertical',
      },
      {
        id: 'goldenGrid',
        label: 'Retícula Áurea 6 × 4',
        sublabel: 'Algante Áurea (Horizontal)',
        description: 'Paso modular áureo φ horizontal (1.618033) para la escritura Algante.',
        topology: '6 × 4 Modular φ',
        recommendedOrientation: 'horizontal',
      },
      {
        id: 'goldenGridVertical',
        label: 'Retícula Áurea 4 × 6',
        sublabel: 'Común Áurea (Vertical)',
        description: 'Paso modular áureo φ vertical (1.618033) adaptado a la lectura estelar común.',
        topology: '4 × 6 Modular φ',
        recommendedOrientation: 'vertical',
      },
      {
        id: 'square',
        label: 'Cuadrícula 5 × 5',
        sublabel: 'Centro Sagrado Vacío',
        description: '24 cuadrantes perimetrales con el núcleo reservado al vacío primordial.',
        topology: '5 × 5 (N=24)',
      },
    ],
  },
  {
    category: 'Familias Radiales',
    items: [
      {
        id: 'circle',
        label: 'Círculo de 24 Divisiones',
        sublabel: 'Rosa de los Vientos',
        description: '24 divisiones angulares exactas de 15° cada una en circunferencia única.',
        topology: '1 Circunferencia',
      },
      {
        id: 'ring',
        label: 'Anillo Doble (8 + 16)',
        sublabel: 'Corona del Rector',
        description: 'Octógono interior de 8 vocales y corona perimetral de 16 consonantes.',
        topology: '8 interior + 16 exterior',
      },
      {
        id: 'triple',
        label: 'Roseta Triple (3 × 8)',
        sublabel: 'Tríada de los Vórtices',
        description: 'Tres anillos concéntricos escalonados en desfase angular áureo.',
        topology: '3 anillos × 8 nodos',
      },
      {
        id: 'polar',
        label: 'Distribución Polar Áurea',
        sublabel: 'Espiral de Fermat',
        description: 'Dispersión polar calculada mediante el ángulo dorado sagrado (137.5°).',
        topology: 'Vórtice Polar',
      },
      {
        id: 'fibonacci',
        label: 'Espiral de Fibonacci',
        sublabel: 'Nautilus del Rhea',
        description: 'Crecimiento logarítmico continuo de radio y fase angular.',
        topology: 'Espiral Continua',
      },
      {
        id: 'mandala',
        label: 'Mandala de 24 Pétalos',
        sublabel: 'Simetría Rotacional',
        description: 'Geometría sagrada meditativa con 12 lóbulos interiores y 12 coronas exteriores.',
        topology: 'Doble Corona 12+12',
      },
    ],
  },
  {
    category: 'Estructuras Sagradas',
    items: [
      {
        id: 'hex',
        label: 'Hexágono Sagrado (6 + 12 + 6)',
        sublabel: 'Cubo de Metatrón / Geometría Sagrada',
        description: 'Triple corona concéntrica regular (6 núcleo + 12 lados + 6 puntas estelares). El hexágono sagrado primordial.',
        topology: 'Hexágono 3 Coronas (N=24)',
      },
      {
        id: 'flowerOfLife',
        label: 'Flor de la Vida Hexagonal',
        sublabel: 'Roseta Sagrada de 24 Nodos',
        description: 'Intersección armónica de seis pétalos nodales y vértices de hexagrama en simetría perfecta.',
        topology: 'Flor de la Vida (N=24)',
      },
      {
        id: 'cylinder',
        label: 'Cilindro Desplegado 3 × 8',
        sublabel: 'Casco de 320 Cubiertas',
        description: 'Proyección cilíndrica del casco exterior de Estación Humanidad.',
        topology: 'Proyección Cilíndrica',
      },
      {
        id: 'goldenRect',
        label: 'Rectángulo Áureo',
        sublabel: 'Proporción Divina',
        description: 'Los 24 nodos dispuestos a lo largo de las divisiones de la espiral dorada.',
        topology: 'Proporción 1:1.618',
      },
      {
        id: 'wave',
        label: 'Onda Paramétrica',
        sublabel: 'Fluctuación Senoidal',
        description: 'Onda armónica senoidal que simboliza la respiración y los pulsos del Rhea.',
        topology: 'Curva Senoidal',
      },
      {
        id: 'delta',
        label: 'Delta Triangular Veyvān',
        sublabel: 'Tríada Trascendente',
        description: 'Triángulo sagrado con 3 vértices principales y 8 estratos de subdivisión.',
        topology: 'Triangular Delta',
      },
      {
        id: 'helix',
        label: 'Doble Hélice Transversal',
        sublabel: 'Memoria Genética',
        description: 'Dos cadenas senoidales entrelazadas de 12 nodos cada una en contrapunto.',
        topology: '2 Cadenas × 12',
      },
    ],
  },
  {
    category: 'Personalizada',
    items: [
      {
        id: 'custom',
        label: 'Personalizada / Libre',
        sublabel: 'Modo Escultor',
        description: 'Manipulación libre de coordenadas X e Y sin ataduras algorítmicas.',
        topology: 'Coordenadas Libres',
      },
    ],
  },
];

export const PATTERN_NAMES: Record<PatternType, string> = {
  grid64: 'RECTANGULAR 6 × 4 (ALGANTE)',
  grid46: 'RECTANGULAR 4 × 6 (COMÚN)',
  square: 'CUADRÍCULA 5 × 5',
  goldenGrid: 'RETÍCULA ÁUREA 6 × 4 (ALGANTE)',
  goldenGridVertical: 'RETÍCULA ÁUREA 4 × 6 (COMÚN)',
  circle: 'CÍRCULO · 24 DIVISIONES',
  ring: 'ANILLO DOBLE · 8 + 16',
  triple: 'ROSETA TRIPLE · 3 × 8',
  polar: 'DISTRIBUCIÓN POLAR',
  fibonacci: 'ESPIRAL DE FIBONACCI',
  mandala: 'MANDALA SACRO 24',
  hex: 'HEXÁGONO SAGRADO (6 + 12 + 6)',
  flowerOfLife: 'FLOR DE LA VIDA HEXAGONAL',
  cylinder: 'CILINDRO DESPLEGADO',
  goldenRect: 'RECTÁNGULO ÁUREO',
  wave: 'ONDA PARAMÉTRICA',
  delta: 'DELTA TRIANGULAR',
  helix: 'DOBLE HÉLICE',
  custom: 'PERSONALIZADA / LIBRE',
};