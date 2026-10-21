export interface WeightedPoint {
  x: number;
  y: number;
  w: number; // Width at this specific sub-point
}

export interface SegmentPressure {
  start: number;
  mid: number;
  end: number;
}

// Helper: Mapa de coordenadas
export const getGridMap = (grid: string[][]) => {
  const map = new Map<string, {x: number, y: number}[]>();
  grid.forEach((row, y) => {
    row.forEach((char, x) => {
      if (!map.has(char)) map.set(char, []);
      map.get(char)?.push({ x, y });
    });
  });
  return map;
};

// --- GEOMETRY MATH HELPERS ---
export const getDistance = (p1: {x:number, y:number}, p2: {x:number, y:number}) => 
  Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

export const getControlPoint = (
  current: {x:number, y:number}, 
  previous: {x:number, y:number}, 
  next: {x:number, y:number}, 
  reverse: boolean,
  tension: number
) => {
  const p = previous || current;
  const n = next || current;
  const smoothing = tension;

  const o = {
    x: n.x - p.x + (n.x - current.x),
    y: n.y - p.y + (n.y - current.y)
  };

  const angle = Math.atan2(o.y, o.x) + (reverse ? Math.PI : 0);
  const length = getDistance(current, n) * smoothing;
  
  return {
    x: current.x + Math.cos(angle) * length,
    y: current.y + Math.sin(angle) * length
  };
};

// Smoothstep function for organic width transition
export const smoothStep = (t: number) => {
  return t * t * (3 - 2 * t);
};

export const getBezierPointsWithWeight = (
  points: {x: number, y: number}[], 
  segments: SegmentPressure[],
  tension: number, 
  resolution: number,
  waveFreq: number, 
  waveAmp: number,
  useSmoothing: boolean
): WeightedPoint[] => {
  if (points.length < 2) {
    // Single point fallback
    return points.map(p => ({ ...p, w: segments[0]?.start || 10 }));
  }
  
  const finalPoints: WeightedPoint[] = [];
  
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1]; 
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2]; 

    // Get pressure profile for this segment (p1 -> p2)
    const seg = segments[i] || { start: 10, mid: 10, end: 10 };

    const cp1 = getControlPoint(p1, p0, p2, false, tension);
    const cp2 = getControlPoint(p2, p1, p3, true, tension);

    // Increase resolution slightly for smoother width transitions
    const step = 1 / (resolution * 1.5); 

    for (let t = 0; t < 1; t += step) {
      const x = Math.pow(1-t, 3)*p1.x + 3*Math.pow(1-t, 2)*t*cp1.x + 3*(1-t)*Math.pow(t, 2)*cp2.x + Math.pow(t, 3)*p2.x;
      const y = Math.pow(1-t, 3)*p1.y + 3*Math.pow(1-t, 2)*t*cp1.y + 3*(1-t)*Math.pow(t, 2)*cp2.y + Math.pow(t, 3)*p2.y;
      
      // Interpolate width: Start -> Mid -> End
      let currentW;
      
      // Determine local T (0 to 1) for the half-segment
      let localT;
      let wStart, wEnd;

      if (t <= 0.5) {
        // First half: Start -> Mid
        localT = t * 2;
        wStart = seg.start;
        wEnd = seg.mid;
      } else {
        // Second half: Mid -> End
        localT = (t - 0.5) * 2;
        wStart = seg.mid;
        wEnd = seg.end;
      }

      // Apply smoothing to the interpolation factor
      const factor = useSmoothing ? smoothStep(localT) : localT;
      currentW = wStart + (wEnd - wStart) * factor;

      let finalX = x;
      let finalY = y;

      if (waveAmp > 0) {
        const tx = (3*Math.pow(1-t, 2)*(cp1.x-p1.x) + 6*(1-t)*t*(cp2.x-cp1.x) + 3*t*t*(p2.x-cp2.x));
        const ty = (3*Math.pow(1-t, 2)*(cp1.y-p1.y) + 6*(1-t)*t*(cp2.y-cp1.y) + 3*t*t*(p2.y-cp2.y));
        const mag = Math.sqrt(tx*tx + ty*ty) || 1;
        const nx = -ty / mag; 
        const ny = tx / mag; 
        
        const wave = Math.sin((i + t) * waveFreq * Math.PI) * waveAmp;
        
        finalX += nx * wave;
        finalY += ny * wave;
      }

      finalPoints.push({ x: finalX, y: finalY, w: currentW });
    }
  }
  
  // Explicitly add the very last point with the exact End weight of the last segment
  const lastSeg = segments[segments.length - 1];
  const lastP = points[points.length - 1];
  finalPoints.push({ 
    x: lastP.x,
    y: lastP.y,
    w: lastSeg ? lastSeg.end : 10 
  });

  return finalPoints;
};

// Variable Width Brush using per-point weights + Rounded Caps
export const getBrushPath = (
  rawPoints: WeightedPoint[], 
  opts: {
    angleInfluence?: number, 
    penAngleDeg?: number,
    roundedCaps?: boolean
  } = {}
) => {
  const angleInfluence = opts.angleInfluence ?? 0.3;
  const penAngleDeg = opts.penAngleDeg ?? 45;
  const roundedCaps = opts.roundedCaps ?? true;

  // Filter duplicate/too-close points to avoid NaN normals and rendering artifacts
  const points: WeightedPoint[] = [];
  if (rawPoints.length > 0) {
      points.push(rawPoints[0]);
      for (let i = 1; i < rawPoints.length; i++) {
          const p = rawPoints[i];
          const prev = points[points.length - 1];
          const dist = Math.sqrt(Math.pow(p.x - prev.x, 2) + Math.pow(p.y - prev.y, 2));
          // Filter threshold 0.5px
          if (dist > 0.5) points.push(p);
      }
  }

  if (points.length < 2) {
      if (points.length === 1) {
           const p = points[0];
           const r = p.w / 2;
           // Full circle
           return `M ${p.x} ${p.y-r} A ${r} ${r} 0 1 0 ${p.x} ${p.y+r} A ${r} ${r} 0 1 0 ${p.x} ${p.y-r} Z`;
      }
      return '';
  }

  const leftSide: {x: number, y: number}[] = [];
  const rightSide: {x: number, y: number}[] = [];
  const penAngleRad = (penAngleDeg * Math.PI) / 180;

  points.forEach((p, i) => {
    let baseWidth = p.w;

    let dx, dy;
    if (i === 0) {
      dx = points[i+1].x - p.x;
      dy = points[i+1].y - p.y;
    } else if (i === points.length - 1) {
      dx = p.x - points[i-1].x;
      dy = p.y - points[i-1].y;
    } else {
      dx = points[i+1].x - points[i-1].x;
      dy = points[i+1].y - points[i-1].y;
    }
    const len = Math.sqrt(dx*dx + dy*dy) || 1;
    let nx = -dy / len;
    let ny = dx / len;

    if (angleInfluence > 0) {
      const strokeAngle = Math.atan2(dy, dx);
      const angleDiff = Math.abs(Math.cos(strokeAngle - penAngleRad));
      const calligraphicFactor = 0.2 + (0.8 * angleDiff);
      baseWidth = baseWidth * (1 - angleInfluence) + (baseWidth * calligraphicFactor * angleInfluence);
    }

    const halfW = baseWidth / 2;
    leftSide.push({ x: p.x + nx * halfW, y: p.y + ny * halfW });
    rightSide.push({ x: p.x - nx * halfW, y: p.y - ny * halfW });
  });

  // Construct SVG Path
  // 1. Start at first Right point
  let d = `M ${rightSide[0].x} ${rightSide[0].y}`;

  // 2. Start Cap (Round)
  if (roundedCaps) {
      const startW = points[0].w / 2;
      // Arc from Right to Left
      // SWEEP FLAG = 0 (Counter-Clockwise) ensures the arc bulges OUTWARD (Convex)
      // because we are moving from Right Side to Left Side (across the back of the start point)
      d += ` A ${startW} ${startW} 0 0 0 ${leftSide[0].x} ${leftSide[0].y}`;
  } else {
      d += ` L ${leftSide[0].x} ${leftSide[0].y}`;
  }

  // 3. Left Side Line
  for (let i = 1; i < leftSide.length; i++) {
      d += ` L ${leftSide[i].x} ${leftSide[i].y}`;
  }

  // 4. End Cap (Round)
  const lastIdx = leftSide.length - 1;
  if (opts.roundedCaps) {
      const endW = points[lastIdx].w / 2;
      // Arc from Left to Right
      // SWEEP FLAG = 0 (Counter-Clockwise) ensures the arc bulges OUTWARD (Convex)
      // because we are moving from Left Side to Right Side (across the front of the end point)
      d += ` A ${endW} ${endW} 0 0 0 ${rightSide[lastIdx].x} ${rightSide[lastIdx].y}`;
  } else {
      d += ` L ${rightSide[lastIdx].x} ${rightSide[lastIdx].y}`;
  }

  // 5. Right Side Line (Backwards)
  for (let i = rightSide.length - 2; i >= 0; i--) {
      d += ` L ${rightSide[i].x} ${rightSide[i].y}`;
  }

  d += ' Z';
  return d;
};
