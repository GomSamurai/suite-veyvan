import React, { useRef, useState, useEffect } from 'react';
import { MatrixNode, GuidesConfig, WordTraceConfig, PatternType, MatrixParameters } from './types/matrix';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  CENTER_X, 
  CENTER_Y, 
  PHI, 
  applyMagneticSnap, 
  generateRawPatternPoints, 
  generateFibonacciSpiralPoints 
} from './utils/matrixMath';
import { playPhonemeTone, playSnapChime } from './utils/audioEngine';

interface Props {
  nodes: MatrixNode[];
  selectedNodeIndex: number;
  guides: GuidesConfig;
  wordTrace: WordTraceConfig;
  nodeSize: number;
  zoom: number;
  activePattern?: PatternType;
  params?: MatrixParameters;
  onSelectNode: (index: number) => void;
  onSwapNodes?: (indexA: number, indexB: number) => void;
  onUpdateNodePos: (index: number, x: number, y: number) => void;
  onDragEnd: () => void;
  onShowToast: (msg: string) => void;
}

export const CanvasStage: React.FC<Props> = ({
  nodes,
  selectedNodeIndex,
  guides,
  wordTrace,
  nodeSize,
  zoom,
  activePattern = ('grid64' as PatternType),
  params,
  onSelectNode,
  onSwapNodes,
  onUpdateNodePos,
  onDragEnd,
  onShowToast,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const cx = CENTER_X;
  const cy = CENTER_Y;

  // Active pattern slot coordinates for magnetic snap
  const targetSlotPoints = React.useMemo(() => {
    if (!params) return [];
    return generateRawPatternPoints(activePattern, params);
  }, [activePattern, params]);

  // Transform client pointer coordinates to SVG coordinate system
  const getSvgCoordinates = (e: React.PointerEvent<SVGSVGElement>): [number, number] => {
    if (!svgRef.current) return [0, 0];
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const svgX = (clientX / rect.width) * CANVAS_WIDTH;
    const svgY = (clientY / rect.height) * CANVAS_HEIGHT;
    return [svgX, svgY];
  };

  const handlePointerDownNode = (e: React.PointerEvent, index: number) => {
    if (e.button === 0) {
      e.stopPropagation();
      const node = nodes[index];
      if (node.locked) {
        onSelectNode(index);
        playPhonemeTone(node.letter, 0.2);
        onShowToast(`Nodo ${node.letter.toUpperCase()} bloqueado`);
        return;
      }
      onSelectNode(index);
      playPhonemeTone(node.letter, 0.2);
      setDraggingIndex(index);
      (e.target as Element).setPointerCapture(e.pointerId);
    }
  };

  const handleContextMenuNode = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedNodeIndex !== null && selectedNodeIndex !== undefined && selectedNodeIndex !== index) {
      if (onSwapNodes) {
        onSwapNodes(selectedNodeIndex, index);
      }
    } else {
      onSelectNode(index);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingIndex !== null) {
      const [rawX, rawY] = getSvgCoordinates(e);
      const otherNodes = nodes.filter((_, i) => i !== draggingIndex);
      const [snappedX, snappedY] = applyMagneticSnap(
        rawX,
        rawY,
        guides,
        cx,
        cy,
        e.shiftKey,
        otherNodes,
        targetSlotPoints
      );
      onUpdateNodePos(draggingIndex, snappedX, snappedY);
    } else if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingIndex !== null) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch (err) {}
      setDraggingIndex(null);
      onDragEnd();
      onShowToast('Posición actualizada');
    }
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button === 1 || e.buttons === 4 || e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Generate word path points
  const wordTracePoints = React.useMemo(() => {
    if (!wordTrace.enabled || !wordTrace.word.trim()) return [];
    const letters = wordTrace.word.toLowerCase().replace(/[^a-z]/g, '').split('');
    const points: { x: number; y: number; letter: string }[] = [];

    letters.forEach(char => {
      const match = nodes.find(n => n.letter.toLowerCase() === char);
      if (match) {
        points.push({ x: match.x, y: match.y, letter: char });
      }
    });
    return points;
  }, [wordTrace, nodes]);

  // Generate customizable Fibonacci spiral path string
  const fibonacciPathString = React.useMemo(() => {
    if (!guides.fibonacciSpiral) return '';
    const pts = generateFibonacciSpiralPoints(guides.fibonacciConfig, cx, cy, 220);
    return pts.map((p, i) => (i === 0 ? 'M ' : ' L ') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('');
  }, [guides.fibonacciSpiral, guides.fibonacciConfig, cx, cy]);

  // Render calligraphic ribbon stroke with variable pressure
  const renderCalligraphicRibbons = (
    points: { x: number; y: number; letter: string }[],
    config: WordTraceConfig
  ) => {
    if (points.length < 2) return null;
    const m = points.length - 1;
    const baseWidth = (config.strokeWidth || 3.5) * 1.5;
    const mode = config.pressureMode || 'uniform';
    const intensity = config.pressureIntensity ?? 1.0;
    const nibAngleRad = ((config.nibAngle ?? 45) * Math.PI) / 180;

    const widths: number[] = points.map((_, j) => {
      const u = m === 0 ? 0.5 : j / m;
      let factor = 1.0;
      if (mode === 'crescendo') {
        const startF = Math.max(0.2, 1 - 0.7 * intensity);
        const endF = 1 + 1.25 * intensity;
        factor = startF + u * (endF - startF);
      } else if (mode === 'decrescendo') {
        const startF = 1 + 1.25 * intensity;
        const endF = Math.max(0.2, 1 - 0.7 * intensity);
        factor = startF + u * (endF - startF);
      } else if (mode === 'tapered') {
        factor = Math.max(0.25, 0.35 / intensity) + 1.8 * intensity * Math.sin(u * Math.PI);
      }
      return Math.max(1.2, baseWidth * factor);
    });

    const ribbons: { points: string; key: number }[] = [];
    for (let i = 0; i < m; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      if (len < 0.5) continue;

      let w1 = widths[i];
      let w2 = widths[i + 1];

      if (mode === 'nib') {
        const segAngle = Math.atan2(dy, dx);
        const nibFactor = 0.25 + 1.75 * intensity * Math.abs(Math.sin(segAngle - nibAngleRad));
        w1 = Math.max(1.5, baseWidth * nibFactor);
        w2 = w1;
      }

      const nx = -dy / len;
      const ny = dx / len;

      const r1 = w1 / 2;
      const r2 = w2 / 2;

      const q1x = p1.x + nx * r1;
      const q1y = p1.y + ny * r1;
      const q2x = p2.x + nx * r2;
      const q2y = p2.y + ny * r2;
      const q3x = p2.x - nx * r2;
      const q3y = p2.y - ny * r2;
      const q4x = p1.x - nx * r1;
      const q4y = p1.y - ny * r1;

      ribbons.push({
        key: i,
        points: `${q1x.toFixed(1)},${q1y.toFixed(1)} ${q2x.toFixed(1)},${q2y.toFixed(1)} ${q3x.toFixed(1)},${q3y.toFixed(1)} ${q4x.toFixed(1)},${q4y.toFixed(1)}`,
      });
    }

    return (
      <g id="calligraphic-trace" filter="url(#glow-cyan)" opacity="0.9">
        {ribbons.map(r => (
          <polygon key={r.key} points={r.points} fill={config.color} />
        ))}
        {points.map((p, idx) => {
          let r = widths[idx] / 2;
          if (mode === 'nib' && m > 0) {
            const segIdx = Math.min(idx, m - 1);
            const pA = points[segIdx];
            const pB = points[segIdx + 1];
            const segAngle = Math.atan2(pB.y - pA.y, pB.x - pA.x);
            const nibFactor = 0.25 + 1.75 * intensity * Math.abs(Math.sin(segAngle - nibAngleRad));
            r = (baseWidth * nibFactor) / 2;
          }
          return (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={r}
              fill={config.color}
            />
          );
        })}
      </g>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-radial from-[#121f33] via-[#09111c] to-[#05080e] overflow-hidden flex items-center justify-center select-none">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3048_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* SVG Stage */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="w-full h-full max-h-[820px] transition-transform duration-75 cursor-crosshair"
        style={{
          transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
        }}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Frame */}
        <rect
          x="12"
          y="12"
          width={CANVAS_WIDTH - 24}
          height={CANVAS_HEIGHT - 24}
          rx="12"
          fill="none"
          stroke="#1f2d3f"
          strokeWidth="1"
        />

        {/* GUIDES OVERLAYS */}
        <g id="guides-group">
          {/* 1. Orthogonal Grid Overlay */}
          {guides.gridVisible && (
            <g id="orthogonal-grid-overlay" opacity="0.22" stroke="#475569" strokeWidth="0.7">
              {(() => {
                const step = guides.snapStep || 25;
                const lines = [];
                for (let x = cx % step; x < CANVAS_WIDTH; x += step) {
                  lines.push(<line key={`gx-${x}`} x1={x} y1={12} x2={x} y2={CANVAS_HEIGHT - 12} />);
                }
                for (let y = cy % step; y < CANVAS_HEIGHT; y += step) {
                  lines.push(<line key={`gy-${y}`} x1={12} y1={y} x2={CANVAS_WIDTH - 12} y2={y} />);
                }
                return lines;
              })()}
            </g>
          )}

          {/* 2. Hexagonal Sacred Honeycomb Overlay */}
          {guides.hexGridVisible && (
            <g id="hex-grid-overlay" opacity="0.28" stroke="#06b6d4" strokeWidth="0.8" fill="none">
              {(() => {
                const size = guides.hexGridSize || 50;
                const hexes = [];
                for (let q = -8; q <= 8; q++) {
                  for (let r = -6; r <= 6; r++) {
                    const hx = cx + size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
                    const hy = cy + size * ((3 / 2) * r);
                    if (hx >= -size && hx <= CANVAS_WIDTH + size && hy >= -size && hy <= CANVAS_HEIGHT + size) {
                      const pts = [];
                      for (let a = 0; a < 6; a++) {
                        const angle = (a * 2 * Math.PI) / 6;
                        pts.push(`${(hx + size * Math.cos(angle)).toFixed(1)},${(hy + size * Math.sin(angle)).toFixed(1)}`);
                      }
                      hexes.push(
                        <polygon
                          key={`hx-${q}-${r}`}
                          points={pts.join(' ')}
                          strokeDasharray="2 3"
                        />
                      );
                    }
                  }
                }
                return hexes;
              })()}
            </g>
          )}

          {/* 3. Cartesian Axes & Diagonals */}
          {guides.axes && (
            <g opacity="0.6">
              <line
                x1="20"
                y1={cy}
                x2={CANVAS_WIDTH - 20}
                y2={cy}
                stroke="#445771"
                strokeWidth="0.8"
                strokeDasharray="4 6"
              />
              <line
                x1={cx}
                y1="20"
                x2={cx}
                y2={CANVAS_HEIGHT - 20}
                stroke="#445771"
                strokeWidth="0.8"
                strokeDasharray="4 6"
              />
              {/* 45 degree diagonals */}
              <line
                x1={cx - 300}
                y1={cy - 300}
                x2={cx + 300}
                y2={cy + 300}
                stroke="#334b6e"
                strokeWidth="0.6"
                strokeDasharray="2 5"
              />
              <line
                x1={cx - 300}
                y1={cy + 300}
                x2={cx + 300}
                y2={cy - 300}
                stroke="#334b6e"
                strokeWidth="0.6"
                strokeDasharray="2 5"
              />
            </g>
          )}

          {/* 4. Concentric Harmonic Circles */}
          {guides.concentricCircles && (
            <g opacity="0.55">
              {[75, 150, 225, 300].map(r => (
                <circle
                  key={r}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="#3a506b"
                  strokeWidth="0.8"
                  strokeDasharray="3 7"
                />
              ))}
            </g>
          )}

          {/* 5. DYNAMIC GOLDEN RATIO FRAME */}
          {guides.goldenRatio && (
            <g
              opacity="0.75"
              transform={`rotate(${guides.goldenRatioAngle || 0} ${cx} ${cy})`}
            >
              {(() => {
                const scale = guides.goldenRatioScale || 1.0;
                const isVertical = guides.goldenRatioOrientation === 'vertical';

                let w = 540 * scale;
                let h = w / PHI;
                if (isVertical) {
                  h = 540 * scale;
                  w = h / PHI;
                }

                const x0 = cx - w / 2;
                const y0 = cy - h / 2;

                return (
                  <>
                    <rect
                      x={x0}
                      y={y0}
                      width={w}
                      height={h}
                      fill="none"
                      stroke={isVertical ? '#22d3ee' : '#d9b16a'}
                      strokeWidth="1.4"
                    />

                    {isVertical ? (
                      <line
                        x1={x0}
                        y1={y0 + h / PHI}
                        x2={x0 + w}
                        y2={y0 + h / PHI}
                        stroke={isVertical ? '#22d3ee' : '#d9b16a'}
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    ) : (
                      <line
                        x1={x0 + w / PHI}
                        y1={y0}
                        x2={x0 + w / PHI}
                        y2={y0 + h}
                        stroke={isVertical ? '#22d3ee' : '#d9b16a'}
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    )}

                    {guides.goldenRatioSubdivisions && (
                      <g
                        opacity="0.65"
                        stroke={isVertical ? '#22d3ee' : '#d9b16a'}
                        strokeWidth="0.8"
                        strokeDasharray="2 3"
                      >
                        {isVertical ? (
                          <>
                            <line x1={x0 + w / PHI} y1={y0 + h / PHI} x2={x0 + w / PHI} y2={y0 + h} />
                            <line
                              x1={x0 + w / PHI}
                              y1={y0 + h - (h - h / PHI) / PHI}
                              x2={x0 + w}
                              y2={y0 + h - (h - h / PHI) / PHI}
                            />
                          </>
                        ) : (
                          <>
                            <line x1={x0 + w / PHI} y1={y0 + h / PHI} x2={x0 + w} y2={y0 + h / PHI} />
                            <line
                              x1={x0 + w - (w - w / PHI) / PHI}
                              y1={y0 + h / PHI}
                              x2={x0 + w - (w - w / PHI) / PHI}
                              y2={y0 + h}
                            />
                          </>
                        )}
                      </g>
                    )}

                    <text
                      x={x0 + 6}
                      y={y0 - 8}
                      fill={isVertical ? '#22d3ee' : '#d9b16a'}
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="600"
                    >
                      {isVertical ? 'φ = 1.618 (Común Vertical)' : 'φ = 1.618 (Algante Horizontal)'}
                      {guides.goldenRatioAngle ? ` · ${guides.goldenRatioAngle}°` : ''}
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* 6. Customizable Fibonacci Spiral */}
          {guides.fibonacciSpiral && (
            <path
              d={fibonacciPathString}
              fill="none"
              stroke="#5eead4"
              strokeWidth="1.3"
              strokeDasharray="4 5"
              opacity="0.75"
            />
          )}

          {/* 7. Sequential Alphabet Path (01 -> 24) */}
          {guides.sequentialConnections && nodes.length === 24 && (
            <path
              d={nodes.map((n, i) => (i === 0 ? 'M ' : ' L ') + n.x + ' ' + n.y).join('') + ' Z'}
              fill="none"
              stroke="#c084fc"
              strokeWidth="1.2"
              strokeDasharray="3 4"
              opacity="0.6"
            />
          )}
        </g>

        {/* LIVE WORD TRACE GLYPH CALAMUS */}
        {wordTrace.enabled && wordTracePoints.length > 1 && (
          <g id="word-trace-layer">
            {wordTrace.pressureMode && wordTrace.pressureMode !== 'uniform' ? (
              renderCalligraphicRibbons(wordTracePoints, wordTrace)
            ) : (
              <>
                <path
                  d={wordTracePoints.map((p, i) => (i === 0 ? 'M ' : ' L ') + p.x + ' ' + p.y).join('')}
                  fill="none"
                  stroke={wordTrace.color}
                  strokeWidth={wordTrace.strokeWidth * 1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-cyan)"
                  opacity="0.85"
                />
                {wordTracePoints.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={wordTrace.strokeWidth * 1.8}
                    fill={wordTrace.color}
                    opacity="0.9"
                  />
                ))}
              </>
            )}
          </g>
        )}

        {/* MATRIX NODES (THE 24 SACRED POINTS) */}
        <g id="nodes-layer">
          {nodes.map((node, i) => {
            const isSelected = i === selectedNodeIndex;
            const isLocked = node.locked;

            return (
              <g
                key={i}
                transform={`translate(${node.x} ${node.y})`}
                className="cursor-pointer group"
                onPointerDown={e => handlePointerDownNode(e, i)}
                onContextMenu={e => handleContextMenuNode(e, i)}
              >
                {/* Outer Halo */}
                <circle
                  r={nodeSize + 8}
                  fill="none"
                  stroke={isSelected ? '#75e4de' : isLocked ? '#c084fc' : '#f1d79f'}
                  strokeWidth={isSelected ? 1.8 : 0.8}
                  opacity={isSelected ? 0.9 : 0.35}
                />

                {/* Core Circle */}
                <circle
                  r={nodeSize}
                  fill={isSelected ? '#75e4de' : isLocked ? '#a855f7' : '#e9c47e'}
                  stroke={isSelected ? '#ffffff' : '#fef08a'}
                  strokeWidth="1.6"
                  filter={isSelected ? 'url(#glow-cyan)' : 'drop-shadow(0 0 5px rgba(233,196,126,0.4))'}
                />

                {/* Letter Label */}
                {guides.letterLabels && (
                  <text
                    x="0"
                    y="0"
                    fill="#080e18"
                    fontSize={Math.max(10, nodeSize - 2)}
                    fontWeight="800"
                    fontFamily="Inter, sans-serif"
                    textAnchor="middle"
                    dominantBaseline="central"
                    pointerEvents="none"
                  >
                    {node.letter.toUpperCase()}
                  </text>
                )}

                {/* Ordinal Index (01 - 24) */}
                {guides.indices && (
                  <text
                    x="0"
                    y={nodeSize + 14}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};