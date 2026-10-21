import React, { useMemo } from 'react';
import { parseTaelimExpression, GlyphUnit, BridgeArc } from '../utils/taelimParser';
import { TAELIM_MORPHEMES } from '../data/taelimRules';
import { getBezierPointsWithWeight, getBrushPath, SegmentPressure } from '../utils/taelimMath';

// Grid Configuration (Algante Standard: 6 cols x 4 rows)
const ALGANTE_GRID: string[][] = [
  ['P', 'V', 'U', 'Y', 'M', 'B'],
  ['F', 'R', 'E', 'A', 'D', 'C'],
  ['H', 'N', 'I', 'L', 'Z', 'Q'],
  ['K', 'S', 'O', 'T', 'G', 'J']
];

// Grid Configuration (Común Standard: 4 cols x 6 rows)
const COMUN_GRID: string[][] = [
  ['B', 'L', 'A', 'V'],
  ['C', 'N', 'E', 'S'],
  ['D', 'R', 'I', 'T'],
  ['F', 'M', 'O', 'Z'],
  ['G', 'K', 'U', 'H'],
  ['J', 'P', 'Y', 'Q'] 
];

interface Props {
  root: string;
  className?: string;
  strokeColor?: string;
  mode?: 'algante' | 'comun';
  showMorphemes?: boolean;
  showArcs?: boolean;
  // Customizable stroke options
  strokeStartWidth?: number;
  strokeEndWidth?: number;
  strokeGlow?: boolean;
  // Customizable bridge arc options
  arcThickness?: number;
  arcOpacity?: number;
  arcCurvature?: number;
  arcDash?: boolean;
}

const CELL_SIZE = 22;      // Internal unit size for grid spacing
const PADDING = 18;        // Internal padding
const MATRIX_GAP = 28;     // Spacing between multiple matrices
const DEFAULT_ARC_CURVATURE = 24;  // Default amplitude of connecting bridge arcs

interface UnitLayoutData {
  unitIndex: number;
  unit: GlyphUnit;
  offsetX: number;
  offsetY: number;
  points: { x: number; y: number; char: string }[];
  gridDots: { x: number; y: number }[];
}

const MiniTaelim: React.FC<Props> = ({ 
  root, 
  className = "", 
  strokeColor = "currentColor", 
  mode = 'algante',
  showMorphemes = true,
  showArcs = true,
  strokeStartWidth = 4.8,
  strokeEndWidth = 2.0,
  strokeGlow = true,
  arcThickness = 2.0,
  arcOpacity = 0.85,
  arcCurvature = DEFAULT_ARC_CURVATURE,
  arcDash = false
}) => {
  const currentGrid = mode === 'algante' ? ALGANTE_GRID : COMUN_GRID;
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  const matrixWidth = (cols - 1) * CELL_SIZE;
  const matrixHeight = (rows - 1) * CELL_SIZE;
  const effArcCurvature = arcCurvature ?? DEFAULT_ARC_CURVATURE;
  const effArcThickness = arcThickness ?? 2.0;
  const effArcOpacity = arcOpacity ?? 0.85;

  // Precompute Map for character positions in the grid
  const gridMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    currentGrid.forEach((row, y) => {
      row.forEach((char, x) => {
        map.set(char, { x, y });
      });
    });
    return map;
  }, [currentGrid]);

  // Parse expression into canonical Tael'im multi-radical units and bridge arcs
  const parsed = useMemo(() => {
    return parseTaelimExpression(root || '');
  }, [root]);

  const units = parsed.units;
  const arcs = parsed.arcs;
  const numUnits = Math.max(1, units.length);

  // Dynamic ViewBox calculation:
  // - Algante: Matrices descend vertically in a column
  // - Común: Matrices flow horizontally in sequence
  const { viewBoxWidth, viewBoxHeight } = useMemo(() => {
    if (mode === 'algante') {
      const w = matrixWidth + (PADDING * 2) + (numUnits > 1 ? effArcCurvature + 16 : 6);
      const h = numUnits * matrixHeight + (numUnits - 1) * MATRIX_GAP + (PADDING * 2) + 8;
      return { viewBoxWidth: w, viewBoxHeight: h };
    } else {
      const w = numUnits * matrixWidth + (numUnits - 1) * MATRIX_GAP + (PADDING * 2) + 8;
      const h = matrixHeight + (PADDING * 2) + (numUnits > 1 ? effArcCurvature + 14 : 6);
      return { viewBoxWidth: w, viewBoxHeight: h };
    }
  }, [mode, matrixWidth, matrixHeight, numUnits, effArcCurvature]);

  // Compute layout & points for each unit
  const unitsData = useMemo<UnitLayoutData[]>(() => {
    return units.map((unit, uIdx) => {
      let offsetX: number;
      let offsetY: number;

      if (mode === 'algante') {
        offsetX = PADDING + 4;
        offsetY = PADDING + 4 + uIdx * (matrixHeight + MATRIX_GAP);
      } else {
        offsetX = PADDING + 4 + uIdx * (matrixWidth + MATRIX_GAP);
        offsetY = PADDING + 4 + (numUnits > 1 ? effArcCurvature : 0);
      }

      // Compute grid dots for this matrix
      const gridDots: { x: number; y: number }[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          gridDots.push({
            x: offsetX + (x * CELL_SIZE),
            y: offsetY + (y * CELL_SIZE)
          });
        }
      }

      // Compute active character points
      const points: { x: number; y: number; char: string }[] = [];
      const cleanChars = unit.cleanRoot.split('');

      cleanChars.forEach(char => {
        const pos = gridMap.get(char);
        if (pos) {
          points.push({
            x: offsetX + (pos.x * CELL_SIZE),
            y: offsetY + (pos.y * CELL_SIZE),
            char
          });
        }
      });

      return {
        unitIndex: uIdx,
        unit,
        offsetX,
        offsetY,
        points,
        gridDots
      };
    });
  }, [units, mode, matrixWidth, matrixHeight, rows, cols, gridMap, numUnits]);

  // If no units have points, do not render
  const totalPointsCount = unitsData.reduce((acc, u) => acc + u.points.length, 0);
  if (totalPointsCount === 0) return null;

  const titleFormula = units.map(u => u.cleanRoot).join(' · ');

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      title={`Caligrafía Tael'im (${mode === 'algante' ? 'Algante / Émulo' : 'Común / Periferia'}): ${root} [${titleFormula}]`}
    >
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id={`mini-glow-${mode}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. LAYER: Background Matrix Grid Dots */}
        <g className="grid-layer opacity-15 fill-current text-slate-400">
          {unitsData.map((uData, uIdx) => (
            <g key={`matrix-dots-${uIdx}`}>
              {uData.gridDots.map((d, dIdx) => (
                <circle key={dIdx} cx={d.x} cy={d.y} r={1.3} />
              ))}
            </g>
          ))}
        </g>

        {/* 2. LAYER: Arcos de Vínculo (Connecting Multi-Radical Chains) */}
        {showArcs && arcs.length > 0 && (
          <g className="arcs-layer">
            {arcs.map((arc, aIdx) => {
              const fromUnit = unitsData[arc.fromIndex];
              const toUnit = unitsData[arc.toIndex];
              if (!fromUnit || !toUnit || fromUnit.points.length === 0 || toUnit.points.length === 0) return null;

              const pStart = fromUnit.points[fromUnit.points.length - 1];
              const pEnd = toUnit.points[0];

              let d = '';
              let midX = 0;
              let midY = 0;

              if (mode === 'comun') {
                // Horizontal flow: graceful arch over the top
                const dx = pEnd.x - pStart.x;
                const archH = Math.min(65, Math.max(16, Math.abs(dx) * 0.28)) * (effArcCurvature / DEFAULT_ARC_CURVATURE);
                midX = (pStart.x + pEnd.x) / 2;
                midY = Math.min(pStart.y, pEnd.y) - archH;
                const cp1X = pStart.x + dx * 0.35;
                const cp1Y = midY;
                const cp2X = pStart.x + dx * 0.65;
                const cp2Y = midY;
                d = `M ${pStart.x} ${pStart.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${pEnd.x} ${pEnd.y}`;
              } else {
                // Algante: Vertical descending flow: arch sweeps gracefully to the right
                const dy = pEnd.y - pStart.y;
                midY = (pStart.y + pEnd.y) / 2;
                midX = Math.max(pStart.x, pEnd.x) + effArcCurvature;
                const cp1X = midX;
                const cp1Y = pStart.y + dy * 0.35;
                const cp2X = midX;
                const cp2Y = pStart.y + dy * 0.65;
                d = `M ${pStart.x} ${pStart.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${pEnd.x} ${pEnd.y}`;
              }

              const isPause = arc.pauseType === 'pause';
              const dashed = isPause || arcDash;

              return (
                <g key={`mini-arc-${aIdx}`}>
                  {/* Subtle Glow */}
                  {strokeGlow && (
                    <path 
                      d={d}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={effArcThickness * 2.2}
                      strokeDasharray={dashed ? '4 3' : undefined}
                      opacity={effArcOpacity * 0.25}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Core Arc Stroke */}
                  <path 
                    d={d}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={effArcThickness}
                    strokeDasharray={dashed ? '4 3' : undefined}
                    opacity={effArcOpacity}
                    strokeLinecap="round"
                  />

                  {/* Terminal Anchors */}
                  <circle cx={pStart.x} cy={pStart.y} r={Math.max(1.8, effArcThickness * 1.2)} fill={strokeColor} opacity={effArcOpacity} />
                  <circle cx={pEnd.x} cy={pEnd.y} r={Math.max(1.8, effArcThickness * 1.2)} fill={strokeColor} opacity={effArcOpacity} />

                  {/* Liturgical Specular Pause (··) */}
                  {isPause && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <circle cx={-3} cy={0} r={1.6} fill={strokeColor} opacity={effArcOpacity} />
                      <circle cx={3} cy={0} r={1.6} fill={strokeColor} opacity={effArcOpacity} />
                    </g>
                  )}

                  {/* Relational Particle Diacritic ('na, 'vi, 'zo, 'da) */}
                  {arc.particleId && (() => {
                    const morpheme = TAELIM_MORPHEMES.find(m => m.id === arc.particleId);
                    if (!morpheme) return null;
                    return (
                      <g className="arc-particle" opacity={effArcOpacity}>
                        {morpheme.render({
                          x: midX,
                          y: midY,
                          size: 14,
                          color: strokeColor,
                          strokeWidth: Math.max(1.2, effArcThickness * 0.75)
                        })}
                      </g>
                    );
                  })()}
                </g>
              );
            })}
          </g>
        )}

        {/* 3. LAYER: Radical Units Glyphs & Morphemes */}
        {unitsData.map((uData, uIdx) => {
          if (uData.points.length === 0) return null;

          const startPt = uData.points[0];
          const endPt = uData.points[uData.points.length - 1];
          const startW = strokeStartWidth;
          const endW = strokeEndWidth;

          // Calligraphic tapered brush path calculation
          let brushD = '';
          if (uData.points.length >= 2) {
            const numSegs = uData.points.length - 1;
            const segments: SegmentPressure[] = [];
            for (let s = 0; s < numSegs; s++) {
              const t0 = s / numSegs;
              const t1 = (s + 1) / numSegs;
              const tMid = (t0 + t1) / 2;
              segments.push({
                start: startW + (endW - startW) * t0,
                mid: startW + (endW - startW) * tMid,
                end: startW + (endW - startW) * t1
              });
            }

            const weightedPoints = getBezierPointsWithWeight(
              uData.points,
              segments,
              0.2, // Smooth tension
              12,  // Resolution
              0,
              0,
              true
            );

            brushD = getBrushPath(weightedPoints, {
              angleInfluence: 0.15,
              penAngleDeg: 45,
              roundedCaps: true
            });
          } else if (uData.points.length === 1) {
            const p = uData.points[0];
            const r = startW / 2;
            brushD = `M ${p.x} ${p.y - r} A ${r} ${r} 0 1 0 ${p.x} ${p.y + r} A ${r} ${r} 0 1 0 ${p.x} ${p.y - r} Z`;
          }

          // Fallback simple line path if brush path is empty
          const fallbackPathD = uData.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

          // Determine attached morphemes
          const prefMorpheme = uData.unit.prefixId ? TAELIM_MORPHEMES.find(m => m.id === uData.unit.prefixId) : null;
          const infMorpheme = uData.unit.infixId ? TAELIM_MORPHEMES.find(m => m.id === uData.unit.infixId) : null;
          const suffMorpheme = uData.unit.suffixId ? TAELIM_MORPHEMES.find(m => m.id === uData.unit.suffixId) : null;

          return (
            <g key={`radical-unit-${uIdx}`}>
              {/* Outer Glow Stroke */}
              {strokeGlow && (
                brushD ? (
                  <path 
                    d={brushD}
                    fill={strokeColor}
                    opacity="0.25"
                    filter={`url(#mini-glow-${mode})`}
                  />
                ) : (
                  <path 
                    d={fallbackPathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={Math.max(startW, endW) * 1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.2"
                  />
                )
              )}

              {/* Core Calligraphic Trace */}
              {brushD ? (
                <path 
                  d={brushD}
                  fill={strokeColor}
                  opacity="0.95"
                  className="drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]"
                />
              ) : (
                <path 
                  d={fallbackPathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={(startW + endW) / 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_3px_rgba(0,0,0,0.8)]"
                />
              )}

              {/* Node Circles with scaled thickness */}
              {uData.points.map((p, i) => {
                const fraction = uData.points.length > 1 ? i / (uData.points.length - 1) : 0;
                const pointW = startW + (endW - startW) * fraction;
                const radius = Math.max(1.8, pointW / 2 + 0.6);
                return (
                  <circle 
                    key={i} 
                    cx={p.x} 
                    cy={p.y} 
                    r={radius} 
                    fill={strokeColor}
                    className="opacity-95"
                  />
                );
              })}

              {/* Morphological Diacritics (Prefix, Infix, Suffix) */}
              {showMorphemes && (
                <g className="unit-morphemes" style={{ pointerEvents: 'none' }}>
                  {prefMorpheme && (
                    <g key={`pref-${uIdx}`}>
                      {prefMorpheme.render({
                        x: startPt.x,
                        y: startPt.y,
                        size: 13,
                        color: strokeColor,
                        strokeWidth: 1.6
                      })}
                    </g>
                  )}
                  {infMorpheme && (
                    <g key={`inf-${uIdx}`}>
                      {infMorpheme.render({
                        x: startPt.x,
                        y: startPt.y,
                        size: 13,
                        color: strokeColor,
                        strokeWidth: 1.6
                      })}
                    </g>
                  )}
                  {suffMorpheme && (
                    <g key={`suff-${uIdx}`}>
                      {suffMorpheme.render({
                        x: endPt.x,
                        y: endPt.y,
                        size: 13,
                        color: strokeColor,
                        strokeWidth: 1.6
                      })}
                    </g>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MiniTaelim;