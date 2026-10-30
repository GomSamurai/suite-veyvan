export type PatternType =
  | 'grid64'
  | 'grid46'
  | 'square'
  | 'goldenGrid'
  | 'goldenGridVertical'
  | 'circle'
  | 'ring'
  | 'triple'
  | 'polar'
  | 'fibonacci'
  | 'mandala'
  | 'hex'
  | 'flowerOfLife'
  | 'cylinder'
  | 'goldenRect'
  | 'wave'
  | 'delta'
  | 'helix'
  | 'custom';

export interface MatrixNode {
  index: number; // 0 to 23
  letter: string;
  x: number;
  y: number;
  locked: boolean;
}

export interface MatrixParameters {
  scale: number; // 0.4 to 2.5 (default 1.0)
  rotation: number; // -180 to 180 degrees
  spacing: number; // 0.5 to 2.0 (default 1.0)
  angle: number; // Golden angle degrees (default 137.5)
  radius: number; // Base radius in px (default 215)
  divisions: number; // 3 to 24 (default 24)
  nodeSize: number; // Node core radius in px (default 13)
  waveFreq: number; // Wave frequency (default 4)
  waveAmp: number; // Wave amplitude in px (default 80)
}

export interface FibonacciSpiralConfig {
  scale: number; // 0.4 to 2.5 (default 1.0)
  rotation: number; // -180 to 180 (default 0)
  turns: number; // 1 to 5 (default 2.5)
  direction: 'clockwise' | 'counterclockwise'; // default 'clockwise'
}

export interface SnapModesConfig {
  grid: boolean; // Cuadrícula ortogonal
  hexGrid: boolean; // Malla hexagonal sagrada
  axes: boolean; // Ejes cartesianos y diagonales
  goldenRatio: boolean; // Marco Áureo φ
  circles: boolean; // Círculos armónicos concéntricos
  fibonacci: boolean; // Espiral de Fibonacci
  slots: boolean; // Ranuras de la plantilla actual
  interNode: boolean; // Imán entre nodos cercanos
}

export interface GuidesConfig {
  snap: boolean;
  snapStep: number; // 10, 15, 20, 25, 30, 50
  snapModes: SnapModesConfig;
  gridVisible: boolean;
  hexGridVisible: boolean;
  hexGridSize: number; // 30 to 80 (default 50)
  axes: boolean;
  concentricCircles: boolean;
  goldenRatio: boolean;
  goldenRatioOrientation: 'horizontal' | 'vertical' | 'custom';
  goldenRatioAngle: number; // -180 to 180 degrees (0 for horizontal, 90 for vertical)
  goldenRatioScale: number; // 0.5 to 2.0 (default 1.0)
  goldenRatioSubdivisions: boolean; // Show internal harmonic divisions
  fibonacciSpiral: boolean;
  fibonacciConfig: FibonacciSpiralConfig;
  flowerOfLife: boolean;
  letterLabels: boolean;
  indices: boolean;
  sequentialConnections: boolean;
  connectionStyle: 'solid' | 'glow' | 'dashed' | 'neon';
}

export type PressureMode = 'uniform' | 'crescendo' | 'decrescendo' | 'tapered' | 'nib';

export interface WordTraceConfig {
  word: string;
  enabled: boolean;
  color: string;
  strokeWidth: number;
  showGlow: boolean;
  closed: boolean;
  pressureMode: PressureMode;
  pressureIntensity: number; // 0.2 to 2.5 (default 1.0)
  nibAngle: number; // 0 to 90 degrees (default 45)
}

export interface MatrixProject {
  id: string;
  name: string;
  createdAt: string;
  pattern: PatternType;
  parameters: MatrixParameters;
  guides: GuidesConfig;
  nodes: MatrixNode[];
  wordTrace: WordTraceConfig;
}