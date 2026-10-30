import { PatternType, MatrixNode, MatrixParameters, GuidesConfig, FibonacciSpiralConfig } from '../types/matrix';
import { CANONICAL_ALPHABET } from '../constants/phonemes';

export const PHI = (1 + Math.sqrt(5)) / 2; // 1.618033988749895
export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 720;
export const CENTER_X = CANVAS_WIDTH / 2;
export const CENTER_Y = CANVAS_HEIGHT / 2;

export function polarToCartesian(cx: number, cy: number, r: number, angleRad: number): [number, number] {
  return [cx + r * Math.cos(angleRad), cy + r * Math.sin(angleRad)];
}

export function generateRawPatternPoints(
  pattern: PatternType,
  params: MatrixParameters,
  existingNodes?: MatrixNode[]
): [number, number][] {
  const points: [number, number][] = [];
  const rad = params.radius || 220;
  const goldenAngle = (params.angle || 137.5) * (Math.PI / 180);
  const cx = CENTER_X;
  const cy = CENTER_Y;

  switch (pattern) {
    case 'grid64': {
      const dx = 118;
      const dy = 118;
      for (let i = 0; i < 24; i++) {
        const c = i % 6;
        const r = Math.floor(i / 6);
        points.push([cx + (c - 2.5) * dx, cy + (r - 1.5) * dy]);
      }
      break;
    }

    case 'grid46': {
      const dx = 145;
      const dy = 96;
      for (let i = 0; i < 24; i++) {
        const c = i % 4;
        const r = Math.floor(i / 4);
        points.push([cx + (c - 1.5) * dx, cy + (r - 2.5) * dy]);
      }
      break;
    }

    case 'square': {
      const step = 110;
      const temp: [number, number][] = [];
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (r === 2 && c === 2) continue;
          temp.push([cx + (c - 2) * step, cy + (r - 2) * step]);
        }
      }
      points.push(...temp.slice(0, 24));
      break;
    }

    case 'goldenGrid': {
      const dx = 120;
      const dy = dx / PHI;
      for (let i = 0; i < 24; i++) {
        const c = i % 6;
        const r = Math.floor(i / 6);
        points.push([cx + (c - 2.5) * dx, cy + (r - 1.5) * dy]);
      }
      break;
    }

    case 'goldenGridVertical': {
      const dy = 110;
      const dx = dy / PHI;
      for (let i = 0; i < 24; i++) {
        const c = i % 4;
        const r = Math.floor(i / 4);
        points.push([cx + (c - 1.5) * dx, cy + (r - 2.5) * dy]);
      }
      break;
    }

    case 'circle': {
      for (let i = 0; i < 24; i++) {
        const angle = (i * 2 * Math.PI) / 24 - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, rad, angle));
      }
      break;
    }

    case 'ring': {
      for (let i = 0; i < 24; i++) {
        const isInner = i < 8;
        const r = isInner ? rad * 0.46 : rad * 0.92;
        const j = isInner ? i : i - 8;
        const count = isInner ? 8 : 16;
        const angle = (j * 2 * Math.PI) / count - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, r, angle));
      }
      break;
    }

    case 'triple': {
      const radii = [rad * 0.36, rad * 0.68, rad * 0.98];
      for (let i = 0; i < 24; i++) {
        const ringIdx = Math.floor(i / 8);
        const j = i % 8;
        const offset = (ringIdx % 2) * (Math.PI / 8);
        const angle = (j * Math.PI) / 4 - Math.PI / 2 + offset;
        points.push(polarToCartesian(cx, cy, radii[ringIdx], angle));
      }
      break;
    }

    case 'polar': {
      for (let i = 0; i < 24; i++) {
        const r = rad * Math.sqrt((i + 1) / 24);
        const angle = i * goldenAngle - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, r, angle));
      }
      break;
    }

    case 'fibonacci': {
      for (let i = 0; i < 24; i++) {
        const r = 16 + rad * Math.sqrt((i + 1) / 24);
        const angle = i * goldenAngle - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, Math.min(r, rad * 1.05), angle));
      }
      break;
    }

    case 'mandala': {
      for (let i = 0; i < 24; i++) {
        const isInner = i % 2 === 0;
        const r = isInner ? rad * 0.55 : rad * 0.98;
        const angle = (i * 2 * Math.PI) / 24 - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, r, angle));
      }
      break;
    }

    case 'hex': {
      // SACRED HEXAGON / METATRON'S CUBE (6 + 12 + 6 = 24 points)
      // Crown 1: 6 inner vertices of regular hexagon
      for (let i = 0; i < 6; i++) {
        const a = (i * 2 * Math.PI) / 6 - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, rad * 0.45, a));
      }
      // Crown 2: 12 nodes (6 hexagon vertices + 6 edge midpoints)
      const r2 = rad * 0.86;
      for (let i = 0; i < 12; i++) {
        const a = (i * 2 * Math.PI) / 12 - Math.PI / 2;
        const isVertex = i % 2 === 0;
        const currentR = isVertex ? r2 : r2 * (Math.sqrt(3) / 2);
        points.push(polarToCartesian(cx, cy, currentR, a));
      }
      // Crown 3: 6 outer stellar apex nodes (star of David / Metatron points)
      for (let i = 0; i < 6; i++) {
        const a = (i * 2 * Math.PI) / 6 + Math.PI / 6 - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, rad * 1.18, a));
      }
      break;
    }

    case 'flowerOfLife': {
      // Sacred Flower of Life (6 + 12 + 6 = 24 petal and rosette intersections)
      for (let i = 0; i < 6; i++) {
        const a = (i * 2 * Math.PI) / 6 - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, rad * 0.48, a));
      }
      for (let i = 0; i < 12; i++) {
        const a = (i * 2 * Math.PI) / 12 - Math.PI / 2;
        const r = i % 2 === 0 ? rad * 0.85 : rad * 0.98;
        points.push(polarToCartesian(cx, cy, r, a));
      }
      for (let i = 0; i < 6; i++) {
        const a = (i * 2 * Math.PI) / 6 + Math.PI / 6 - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, rad * 1.22, a));
      }
      break;
    }

    case 'cylinder': {
      for (let i = 0; i < 24; i++) {
        const c = i % 8;
        const r = Math.floor(i / 8);
        const angle = (c / 8 - 0.5) * Math.PI;
        points.push([cx + Math.sin(angle) * rad, cy + (r - 1) * rad * 0.58]);
      }
      break;
    }

    case 'goldenRect': {
      const w = rad * 2.2;
      const h = w / PHI;
      for (let i = 0; i < 24; i++) {
        const c = i % 6;
        const r = Math.floor(i / 6);
        points.push([cx + (c - 2.5) * (w / 5), cy + (r - 1.5) * (h / 3)]);
      }
      break;
    }

    case 'wave': {
      const totalWidth = rad * 2.6;
      const step = totalWidth / 23;
      const freq = params.waveFreq || 4;
      const amp = params.waveAmp || 85;
      for (let i = 0; i < 24; i++) {
        const x = cx - totalWidth / 2 + i * step;
        const y = cy + Math.sin((i / 23) * Math.PI * freq) * amp;
        points.push([x, y]);
      }
      break;
    }

    case 'delta': {
      const rows = [1, 2, 3, 4, 5, 6];
      let idx = 0;
      for (let r = 0; r < rows.length; r++) {
        const count = rows[r];
        const y = cy - rad * 0.8 + (r / 5) * (rad * 1.6);
        for (let c = 0; c < count; c++) {
          const x = cx + (c - (count - 1) / 2) * (rad * 0.5);
          points.push([x, y]);
          idx++;
        }
      }
      while (points.length < 24) {
        const angle = (points.length * 2 * Math.PI) / 3 - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, rad * 0.35, angle));
      }
      break;
    }

    case 'helix': {
      const length = rad * 2.4;
      const step = length / 11;
      for (let i = 0; i < 12; i++) {
        const x = cx - length / 2 + i * step;
        const phase = (i / 11) * Math.PI * 3;
        points.push([x, cy + Math.sin(phase) * (rad * 0.45)]);
        points.push([x, cy - Math.sin(phase) * (rad * 0.45)]);
      }
      break;
    }

    case 'custom':
    default: {
      if (existingNodes && existingNodes.length === 24) {
        return existingNodes.map(n => [n.x, n.y]);
      }
      for (let i = 0; i < 24; i++) {
        const angle = (i * 2 * Math.PI) / 24 - Math.PI / 2;
        points.push(polarToCartesian(cx, cy, rad, angle));
      }
      break;
    }
  }

  // Apply Global Parametric Transforms (Scale, Rotation, Spacing)
  const rotRad = (params.rotation * Math.PI) / 180;
  const cosR = Math.cos(rotRad);
  const sinR = Math.sin(rotRad);
  const s = params.scale;
  const sp = params.spacing;

  return points.map(([px, py]) => {
    let dx = (px - cx) * s * sp;
    let dy = (py - cy) * s * sp;
    return [
      cx + dx * cosR - dy * sinR,
      cy + dx * sinR + dy * cosR
    ];
  });
}

export function createInitialNodes(
  pattern: PatternType,
  params: MatrixParameters,
  existingNodes?: MatrixNode[]
): MatrixNode[] {
  const points = generateRawPatternPoints(pattern, params, existingNodes);
  return CANONICAL_ALPHABET.map((letter, i) => {
    const prev = existingNodes?.[i];
    return {
      index: i,
      letter: prev ? prev.letter : letter,
      x: points[i] ? points[i][0] : CENTER_X,
      y: points[i] ? points[i][1] : CENTER_Y,
      locked: prev ? prev.locked : false,
    };
  });
}

// Generate customizable Fibonacci spiral path coordinates
export function generateFibonacciSpiralPoints(
  config?: FibonacciSpiralConfig,
  cx = CENTER_X,
  cy = CENTER_Y,
  count = 200
): { x: number; y: number }[] {
  const scale = config?.scale || 1.0;
  const rotRad = ((config?.rotation || 0) * Math.PI) / 180;
  const turns = config?.turns || 2.5;
  const isClockwise = config?.direction !== 'counterclockwise';
  const sign = isClockwise ? 1 : -1;
  const rMax = 230 * scale;

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const r = 8 + rMax * Math.sqrt(t);
    const a = rotRad + sign * t * turns * 2 * Math.PI - Math.PI / 2;
    pts.push({
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    });
  }
  return pts;
}

// Snaps coordinates to a regular 2D hexagonal honeycomb lattice
export function snapToHexGrid(
  x: number,
  y: number,
  size = 50,
  cx = CENTER_X,
  cy = CENTER_Y
): [number, number] {
  const dx = x - cx;
  const dy = y - cy;
  const q = ((Math.sqrt(3) / 3) * dx - (1 / 3) * dy) / size;
  const r = ((2 / 3) * dy) / size;

  let xHex = q;
  let zHex = r;
  let yHex = -xHex - zHex;

  let rx = Math.round(xHex);
  let ry = Math.round(yHex);
  let rz = Math.round(zHex);

  const xDiff = Math.abs(rx - xHex);
  const yDiff = Math.abs(ry - yHex);
  const zDiff = Math.abs(rz - zHex);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  const snappedX = cx + size * (Math.sqrt(3) * rx + (Math.sqrt(3) / 2) * rz);
  const snappedY = cy + size * ((3 / 2) * rz);
  return [Math.round(snappedX), Math.round(snappedY)];
}

// Comprehensive Magnetic Snap Engine during Pointer Drag
export function applyMagneticSnap(
  rawX: number,
  rawY: number,
  guides: GuidesConfig,
  cx = CENTER_X,
  cy = CENTER_Y,
  ignoreSnap = false,
  otherNodes?: MatrixNode[],
  targetSlotPoints?: [number, number][]
): [number, number] {
  if (!guides.snap || ignoreSnap) {
    return [
      Math.max(20, Math.min(CANVAS_WIDTH - 20, rawX)),
      Math.max(20, Math.min(CANVAS_HEIGHT - 20, rawY)),
    ];
  }

  const modes = guides.snapModes || {
    grid: true,
    hexGrid: false,
    axes: true,
    goldenRatio: true,
    circles: true,
    fibonacci: true,
    slots: true,
    interNode: true,
  };

  let x = rawX;
  let y = rawY;
  const snapDist = 14;

  // 1. Inter-node alignment snap (Align with other nodes X or Y)
  if (modes.interNode && otherNodes && otherNodes.length > 0) {
    for (const n of otherNodes) {
      if (Math.abs(rawX - n.x) < 8) x = n.x;
      if (Math.abs(rawY - n.y) < 8) y = n.y;
    }
  }

  // 2. Active Pattern Slots Snap
  if (modes.slots && targetSlotPoints && targetSlotPoints.length > 0) {
    let closestDistSq = Infinity;
    let closestSlot: [number, number] | null = null;
    for (const slot of targetSlotPoints) {
      const dSq = (rawX - slot[0]) ** 2 + (rawY - slot[1]) ** 2;
      if (dSq < closestDistSq) {
        closestDistSq = dSq;
        closestSlot = slot;
      }
    }
    if (closestSlot && closestDistSq <= snapDist * snapDist) {
      return [closestSlot[0], closestSlot[1]];
    }
  }

  // 3. Hexagonal Honeycomb Lattice Snap
  if (modes.hexGrid) {
    const hexSize = guides.hexGridSize || 50;
    const [hexX, hexY] = snapToHexGrid(rawX, rawY, hexSize, cx, cy);
    const hexDistSq = (rawX - hexX) ** 2 + (rawY - hexY) ** 2;
    if (hexDistSq <= (snapDist * 1.3) ** 2) {
      x = hexX;
      y = hexY;
    }
  }

  // 4. Customizable Fibonacci Spiral Snap
  if (modes.fibonacci && guides.fibonacciSpiral && guides.fibonacciConfig) {
    const spiralPts = generateFibonacciSpiralPoints(guides.fibonacciConfig, cx, cy, 180);
    let minSpiralDistSq = Infinity;
    let bestPt: { x: number; y: number } | null = null;
    for (const sp of spiralPts) {
      const dSq = (rawX - sp.x) ** 2 + (rawY - sp.y) ** 2;
      if (dSq < minSpiralDistSq) {
        minSpiralDistSq = dSq;
        bestPt = sp;
      }
    }
    if (bestPt && minSpiralDistSq <= (snapDist * 1.2) ** 2) {
      x = bestPt.x;
      y = bestPt.y;
    }
  }

  // 5. Golden Ratio Frame Snap
  if (modes.goldenRatio && guides.goldenRatio) {
    const scale = guides.goldenRatioScale || 1.0;
    const isVertical = guides.goldenRatioOrientation === 'vertical';
    let w = 540 * scale;
    let h = w / PHI;
    if (isVertical) {
      h = 540 * scale;
      w = h / PHI;
    }
    const x0 = cx - w / 2;
    const x1 = cx + w / 2;
    const y0 = cy - h / 2;
    const y1 = cy + h / 2;
    const phiX = isVertical ? null : x0 + w / PHI;
    const phiY = isVertical ? y0 + h / PHI : null;

    if (Math.abs(rawX - x0) < 10) x = x0;
    else if (Math.abs(rawX - x1) < 10) x = x1;
    else if (phiX !== null && Math.abs(rawX - phiX) < 10) x = phiX;

    if (Math.abs(rawY - y0) < 10) y = y0;
    else if (Math.abs(rawY - y1) < 10) y = y1;
    else if (phiY !== null && Math.abs(rawY - phiY) < 10) y = phiY;
  }

  // 6. Center Axes & Diagonals Snap
  if (modes.axes) {
    if (Math.abs(x - cx) < 10) x = cx;
    if (Math.abs(y - cy) < 10) y = cy;
    const dx = x - cx;
    const dy = y - cy;
    if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 8) {
      const avg = (Math.abs(dx) + Math.abs(dy)) / 2;
      x = cx + Math.sign(dx) * avg;
      y = cy + Math.sign(dy) * avg;
    }
  }

  // 7. Concentric Harmonic Circles Snap
  if (modes.circles) {
    const dist = Math.hypot(x - cx, y - cy);
    const concentricRadii = [75, 150, 225, 300];
    const nearest = concentricRadii.sort((a, b) => Math.abs(a - dist) - Math.abs(b - dist))[0];
    if (Math.abs(dist - nearest) < 10) {
      const angle = Math.atan2(y - cy, x - cx);
      x = cx + nearest * Math.cos(angle);
      y = cy + nearest * Math.sin(angle);
    }
  }

  // 8. Orthogonal Grid Snap
  if (modes.grid) {
    const stepSize = guides.snapStep || 25;
    const gridX = cx + Math.round((rawX - cx) / stepSize) * stepSize;
    const gridY = cy + Math.round((rawY - cy) / stepSize) * stepSize;
    if (Math.abs(rawX - gridX) < snapDist) x = gridX;
    if (Math.abs(rawY - gridY) < snapDist) y = gridY;
  }

  return [
    Math.max(20, Math.min(CANVAS_WIDTH - 20, Math.round(x))),
    Math.max(20, Math.min(CANVAS_HEIGHT - 20, Math.round(y))),
  ];
}

// Bipartite optimal nearest slot assignment
export function snapNodesToPatternSlots(
  nodes: MatrixNode[],
  targetPattern: PatternType,
  params: MatrixParameters
): MatrixNode[] {
  const targetPoints = generateRawPatternPoints(targetPattern, params);
  if (targetPoints.length === 0) return nodes;

  const availableSlots = targetPoints.map((pt, slotIdx) => ({ x: pt[0], y: pt[1], slotIdx }));
  const pairs: { nodeIdx: number; slotIdx: number; distSq: number }[] = [];

  nodes.forEach((n, nodeIdx) => {
    if (n.locked) return;
    availableSlots.forEach((slot, slotIdx) => {
      const dx = n.x - slot.x;
      const dy = n.y - slot.y;
      pairs.push({ nodeIdx, slotIdx, distSq: dx * dx + dy * dy });
    });
  });

  pairs.sort((a, b) => a.distSq - b.distSq);

  const assignedNodes = new Set<number>();
  const assignedSlots = new Set<number>();
  const newPositions: { [nodeIdx: number]: { x: number; y: number } } = {};
  const unlockedCount = nodes.filter(n => !n.locked).length;

  for (const pair of pairs) {
    if (!assignedNodes.has(pair.nodeIdx) && !assignedSlots.has(pair.slotIdx)) {
      assignedNodes.add(pair.nodeIdx);
      assignedSlots.add(pair.slotIdx);
      newPositions[pair.nodeIdx] = {
        x: Math.round(availableSlots[pair.slotIdx].x),
        y: Math.round(availableSlots[pair.slotIdx].y),
      };
      if (assignedNodes.size === unlockedCount) break;
    }
  }

  return nodes.map((n, i) => {
    if (n.locked || !newPositions[i]) return n;
    return { ...n, x: newPositions[i].x, y: newPositions[i].y };
  });
}

export function snapNodesToGridStep(
  nodes: MatrixNode[],
  step = 25
): MatrixNode[] {
  const cx = CENTER_X;
  const cy = CENTER_Y;
  return nodes.map(n => {
    if (n.locked) return n;
    const nx = cx + Math.round((n.x - cx) / step) * step;
    const ny = cy + Math.round((n.y - cy) / step) * step;
    return {
      ...n,
      x: Math.max(20, Math.min(CANVAS_WIDTH - 20, nx)),
      y: Math.max(20, Math.min(CANVAS_HEIGHT - 20, ny)),
    };
  });
}

export function snapNodesToHexLattice(
  nodes: MatrixNode[],
  size = 50
): MatrixNode[] {
  return nodes.map(n => {
    if (n.locked) return n;
    const [nx, ny] = snapToHexGrid(n.x, n.y, size);
    return {
      ...n,
      x: Math.max(20, Math.min(CANVAS_WIDTH - 20, nx)),
      y: Math.max(20, Math.min(CANVAS_HEIGHT - 20, ny)),
    };
  });
}

export function snapNodesToFibonacciSpiral(
  nodes: MatrixNode[],
  config: FibonacciSpiralConfig
): MatrixNode[] {
  const spiralPts = generateFibonacciSpiralPoints(config, CENTER_X, CENTER_Y, 24);
  const sorted = nodes
    .map((n, i) => ({ i, dist: Math.hypot(n.x - CENTER_X, n.y - CENTER_Y), locked: n.locked }))
    .filter(item => !item.locked)
    .sort((a, b) => a.dist - b.dist);

  const newPos: Record<number, { x: number; y: number }> = {};
  sorted.forEach((item, order) => {
    const pt = spiralPts[order] || spiralPts[spiralPts.length - 1];
    newPos[item.i] = { x: Math.round(pt.x), y: Math.round(pt.y) };
  });

  return nodes.map((n, i) => {
    if (n.locked || !newPos[i]) return n;
    return { ...n, x: newPos[i].x, y: newPos[i].y };
  });
}

export function snapNodesToGoldenFrame(
  nodes: MatrixNode[],
  guides: GuidesConfig
): MatrixNode[] {
  const cx = CENTER_X;
  const cy = CENTER_Y;
  const scale = guides.goldenRatioScale || 1.0;
  const isVertical = guides.goldenRatioOrientation === 'vertical';

  let w = 540 * scale;
  let h = w / PHI;
  if (isVertical) {
    h = 540 * scale;
    w = h / PHI;
  }

  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - h / 2;
  const y1 = cy + h / 2;
  const phiX = isVertical ? null : x0 + w / PHI;
  const phiY = isVertical ? y0 + h / PHI : null;

  const snapThreshold = 45;

  return nodes.map(n => {
    if (n.locked) return n;
    let newX = n.x;
    let newY = n.y;

    const xTargets = [x0, x1, ...(phiX ? [phiX] : []), cx];
    let closestXDist = Infinity;
    let targetX = newX;
    for (const tx of xTargets) {
      const d = Math.abs(n.x - tx);
      if (d < closestXDist && d <= snapThreshold) {
        closestXDist = d;
        targetX = tx;
      }
    }
    if (closestXDist <= snapThreshold) newX = targetX;

    const yTargets = [y0, y1, ...(phiY ? [phiY] : []), cy];
    let closestYDist = Infinity;
    let targetY = newY;
    for (const ty of yTargets) {
      const d = Math.abs(n.y - ty);
      if (d < closestYDist && d <= snapThreshold) {
        closestYDist = d;
        targetY = ty;
      }
    }
    if (closestYDist <= snapThreshold) newY = targetY;

    return {
      ...n,
      x: Math.round(Math.max(20, Math.min(CANVAS_WIDTH - 20, newX))),
      y: Math.round(Math.max(20, Math.min(CANVAS_HEIGHT - 20, newY))),
    };
  });
}

export function snapNodesToHarmonicCircles(
  nodes: MatrixNode[]
): MatrixNode[] {
  const cx = CENTER_X;
  const cy = CENTER_Y;
  const circles = [75, 150, 225, 300];

  return nodes.map(n => {
    if (n.locked) return n;
    const dx = n.x - cx;
    const dy = n.y - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r < 10) return n;

    let closestR = circles[0];
    let minDiff = Math.abs(r - circles[0]);
    for (const c of circles) {
      const diff = Math.abs(r - c);
      if (diff < minDiff) {
        minDiff = diff;
        closestR = c;
      }
    }

    const angle = Math.atan2(dy, dx);
    return {
      ...n,
      x: Math.round(Math.max(20, Math.min(CANVAS_WIDTH - 20, cx + closestR * Math.cos(angle)))),
      y: Math.round(Math.max(20, Math.min(CANVAS_HEIGHT - 20, cy + closestR * Math.sin(angle)))),
    };
  });
}

export function alignNearbyAxes(
  nodes: MatrixNode[],
  threshold = 24
): MatrixNode[] {
  const clone = nodes.map(n => ({ ...n }));

  const visitedY = new Set<number>();
  for (let i = 0; i < clone.length; i++) {
    if (clone[i].locked || visitedY.has(i)) continue;
    const group = [i];
    for (let j = i + 1; j < clone.length; j++) {
      if (!clone[j].locked && Math.abs(clone[i].y - clone[j].y) <= threshold) {
        group.push(j);
      }
    }
    if (group.length > 1) {
      const avgY = Math.round(group.reduce((sum, idx) => sum + clone[idx].y, 0) / group.length);
      group.forEach(idx => {
        clone[idx].y = avgY;
        visitedY.add(idx);
      });
    }
  }

  const visitedX = new Set<number>();
  for (let i = 0; i < clone.length; i++) {
    if (clone[i].locked || visitedX.has(i)) continue;
    const group = [i];
    for (let j = i + 1; j < clone.length; j++) {
      if (!clone[j].locked && Math.abs(clone[i].x - clone[j].x) <= threshold) {
        group.push(j);
      }
    }
    if (group.length > 1) {
      const avgX = Math.round(group.reduce((sum, idx) => sum + clone[idx].x, 0) / group.length);
      group.forEach(idx => {
        clone[idx].x = avgX;
        visitedX.add(idx);
      });
    }
  }

  return clone;
}