import { MatrixProject, MatrixNode } from '../types/matrix';

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function exportSvg(svgElement: SVGSVGElement, name = 'matriz-taelim-24') {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '960');
  clone.setAttribute('height', '720');

  // Insert embedded font & vector styling
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `
    .node .core { fill: #e8c47d; stroke: #fff0cb; stroke-width: 1.6; }
    .node text { fill: #0b111c; font-family: Inter, sans-serif; font-weight: 800; font-size: 11px; text-anchor: middle; dominant-baseline: central; }
    .node .halo { fill: none; stroke: #f1d79f; stroke-width: 0.8; opacity: 0.45; }
    .node.selected .core { fill: #78e6df; stroke: #e1fffc; }
    .node.locked .core { fill: #b8a7ff; stroke: #e4dcff; }
  `;
  clone.insertBefore(style, clone.firstChild);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, `${name}.svg`);
}

export async function copySvgCode(svgElement: SVGSVGElement): Promise<boolean> {
  try {
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    await navigator.clipboard.writeText(svgString);
    return true;
  } catch (err) {
    return false;
  }
}

export function exportPng(
  svgElement: SVGSVGElement,
  scale = 2,
  background: 'dark' | 'transparent' = 'dark',
  name = 'matriz-taelim-24'
) {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const width = 960 * scale;
    const height = 720 * scale;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (background === 'dark') {
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Radial ambient lighting
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width * 0.6
      );
      grad.addColorStop(0, '#101a2c');
      grad.addColorStop(0.7, '#070b13');
      grad.addColorStop(1, '#04070c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(pngBlob => {
      if (pngBlob) {
        downloadBlob(pngBlob, `${name}@${scale}x.png`);
      }
      URL.revokeObjectURL(url);
    }, 'image/png');
  };
  img.src = url;
}

export function exportJson(project: MatrixProject) {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  downloadBlob(blob, `${project.name.toLowerCase().replace(/\s+/g, '_')}_taelim_matrix.json`);
}

export function exportTaelimCode(nodes: MatrixNode[], name = 'CustomMatrix'): string {
  // Returns code compatible with Taelim matrix representations (Suite Veyvan)
  const mapping = nodes.map(n => `  { letter: '${n.letter}', x: ${Math.round(n.x)}, y: ${Math.round(n.y)} }`).join(',\n');
  return `// Matriz Tael'im (Algante / Común / Universal): ${name}
export const ${name.replace(/[^a-zA-Z0-9_]/g, '')}_COORDINATES = [
${mapping}
];`;
}