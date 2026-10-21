import React from 'react';

export type MorphemeType = 'prefix' | 'infix' | 'suffix';

export interface MorphemeRenderProps {
  x: number;
  y: number;
  size: number;
  color: string;
  strokeWidth: number;
  opacity?: number;
  filter?: string;
}

export interface Morpheme {
  id: string;
  label: string;
  type: MorphemeType;
  symbol: string;
  description: string;
  // Render function takes context and returns SVG elements
  render: (props: MorphemeRenderProps) => React.ReactNode;
}

export const TAELIM_MORPHEMES: Morpheme[] = [
  // --- PREFIXES (General) ---
  {
    id: 'pref_nu',
    label: 'Nu- (Negación)',
    type: 'prefix',
    symbol: '•',
    description: 'Punto grueso antes del inicio',
    render: ({ x, y, size, color, opacity, filter }) => (
      <circle cx={x - size * 1.8} cy={y} r={size * 0.5} fill={color} opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'pref_sha',
    label: 'Sha- (Duda)',
    type: 'prefix',
    symbol: '~',
    description: 'Onda antes del inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <path 
        d={`M ${x - size * 2.5} ${y} C ${x - size * 2} ${y - size * 0.8}, ${x - size * 1.5} ${y + size * 0.8}, ${x - size * 0.8} ${y}`}
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth * 1.2} 
        strokeLinecap="round"
        opacity={opacity}
        filter={filter}
      />
    )
  },
  {
    id: 'pref_o',
    label: 'O- (Introspección)',
    type: 'prefix',
    symbol: '◦',
    description: 'Círculo abierto en el inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <circle cx={x} cy={y} r={size * 0.6} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'pref_va',
    label: 'Va- (Proyección)',
    type: 'prefix',
    symbol: '—',
    description: 'Línea proyectada desde el inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <line x1={x} y1={y} x2={x - size * 2.0} y2={y} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'pref_nai',
    label: 'Nai- (Intensidad)',
    type: 'prefix',
    symbol: '⚡',
    description: 'Relámpago antes del inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <path 
        d={`M ${x - size * 2.2} ${y - size * 0.8} L ${x - size * 1.4} ${y} L ${x - size * 1.8} ${y} L ${x - size * 0.8} ${y + size * 0.8}`}
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth * 1.2} 
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={opacity}
        filter={filter}
      />
    )
  },
  {
    id: 'pref_an',
    label: 'An- (Pregunta)',
    type: 'prefix',
    symbol: '¿',
    description: 'Interrogación abierta antes del inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <path 
        d={`M ${x - size * 1.5} ${y - size * 0.6} C ${x - size * 2.2} ${y - size * 0.6}, ${x - size * 2.2} ${y + size * 0.3}, ${x - size * 1.5} ${y + size * 0.3} M ${x - size * 1.5} ${y + size * 0.7} L ${x - size * 1.5} ${y + size * 0.7}`}
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth * 1.2} 
        strokeLinecap="round"
        opacity={opacity}
        filter={filter}
      />
    )
  },

  // --- PREFIXES (Temporal) ---
  {
    id: 'temp_nu',
    label: 'nu- (Presente)',
    type: 'prefix',
    symbol: '`',
    description: 'Acento grave',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <path d={`M ${x - size * 1.0} ${y - size * 1.0} L ${x - size * 0.5} ${y - size * 0.5}`} stroke={color} strokeWidth={strokeWidth * 2} strokeLinecap="round" opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'temp_min',
    label: 'min- (Pasado)',
    type: 'prefix',
    symbol: '_',
    description: 'Línea debajo del inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <line x1={x - size * 1.0} y1={y + size * 1.4} x2={x + size * 1.0} y2={y + size * 1.4} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'temp_vor',
    label: 'vor- (Futuro)',
    type: 'prefix',
    symbol: '→',
    description: 'Flecha desde el inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x}, ${y})`} opacity={opacity} filter={filter}>
        <path d={`M 0 0 L ${-size * 1.5} 0 M ${-size * 0.5} ${-size * 0.4} L 0 0 L ${-size * 0.5} ${size * 0.4}`} stroke={color} strokeWidth={strokeWidth * 1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )
  },
  {
    id: 'temp_kro',
    label: 'kro- (Eterno)',
    type: 'prefix',
    symbol: '●',
    description: 'Círculo sólido en el inicio',
    render: ({ x, y, size, color, opacity, filter }) => (
      <circle cx={x} cy={y} r={size * 0.5} fill={color} opacity={opacity} filter={filter} />
    )
  },

  // --- INFIXES (Evidentiality) ---
  {
    id: 'inf_ka',
    label: 'ka- (Sensorial)',
    type: 'infix',
    symbol: '..',
    description: 'Diagonal sobre el inicio',
    render: ({ x, y, size, color, opacity, filter }) => (
      <g opacity={opacity} filter={filter}>
        <circle cx={x - size * 0.5} cy={y - size * 0.8} r={size * 0.2} fill={color} />
        <circle cx={x + size * 0.5} cy={y - size * 0.8} r={size * 0.2} fill={color} />
      </g>
    )
  },
  {
    id: 'inf_vo',
    label: 'vo- (Empírico)',
    type: 'infix',
    symbol: '.',
    description: 'Punto sobre el inicio',
    render: ({ x, y, size, color, opacity, filter }) => (
      <circle cx={x} cy={y - size * 1.0} r={size * 0.25} fill={color} opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'inf_te',
    label: 'te- (Deductivo)',
    type: 'infix',
    symbol: '△',
    description: 'Triángulo en el inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <path d={`M ${x} ${y - size * 0.8} L ${x + size * 0.5} ${y + size * 0.2} L ${x - size * 0.5} ${y + size * 0.2} Z`} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} opacity={opacity} filter={filter} strokeLinejoin="round" />
    )
  },
  {
    id: 'inf_ri',
    label: 'ri- (Testimonial)',
    type: 'infix',
    symbol: '«',
    description: 'Comillas antes del inicio',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x - size * 1.5}, ${y}) scale(0.8)`} opacity={opacity} filter={filter}>
        <path d="M 10 -10 L 0 0 L 10 10 M 20 -10 L 10 0 L 20 10" fill="none" stroke={color} strokeWidth={strokeWidth * 2} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )
  },

  // --- SUFFIXES (Nominal) ---
  {
    id: 'suf_or',
    label: 'or (Plural disperso)',
    type: 'suffix',
    symbol: '∴',
    description: 'Tres puntos en triángulo después del final',
    render: ({ x, y, size, color, opacity, filter }) => (
      <g transform={`translate(${x + size * 1.2}, ${y})`} opacity={opacity} filter={filter}>
        <circle cx={0} cy={-size * 0.4} r={size * 0.2} fill={color} />
        <circle cx={-size * 0.4} cy={size * 0.4} r={size * 0.2} fill={color} />
        <circle cx={size * 0.4} cy={size * 0.4} r={size * 0.2} fill={color} />
      </g>
    )
  },
  {
    id: 'suf_im',
    label: 'im (Plural armónico)',
    type: 'suffix',
    symbol: 'O',
    description: 'Círculo rodeando el final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <circle cx={x} cy={y} r={size * 1.0} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'suf_ya',
    label: '-yā (Centro)',
    type: 'suffix',
    symbol: '☉',
    description: 'Punto dentro de círculo al final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g opacity={opacity} filter={filter}>
        <circle cx={x} cy={y} r={size * 0.8} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} />
        <circle cx={x} cy={y} r={size * 0.2} fill={color} />
      </g>
    )
  },
  {
    id: 'suf_tue',
    label: '-tuē (Espejo)',
    type: 'suffix',
    symbol: '||',
    description: 'Dos líneas paralelas al final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x + size * 1.0}, ${y})`} opacity={opacity} filter={filter}>
        <line x1={-size * 0.25} y1={-size * 0.6} x2={-size * 0.25} y2={size * 0.6} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
        <line x1={size * 0.25} y1={-size * 0.6} x2={size * 0.25} y2={size * 0.6} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
      </g>
    )
  },
  {
    id: 'suf_vun',
    label: '-vun (Entorno)',
    type: 'suffix',
    symbol: '□',
    description: 'Cuadrado rodeando el final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <rect x={x - size * 0.9} y={y - size * 0.9} width={size * 1.8} height={size * 1.8} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} opacity={opacity} filter={filter} rx={size * 0.1} />
    )
  },

  // --- SUFFIXES (Verbal Aspect) ---
  {
    id: 'asp_aen',
    label: 'aen (Continuo)',
    type: 'suffix',
    symbol: '🌀',
    description: 'Espiral al final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <path 
        d={`M ${x} ${y} m ${-size*0.1} 0 a ${size*0.1},${size*0.1} 0 1,0 ${size*0.2},0 a ${size*0.2},${size*0.2} 0 1,0 ${-size*0.4},0 a ${size*0.4},${size*0.4} 0 1,0 ${size*0.8},0`}
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth * 1.2} 
        strokeLinecap="round"
        opacity={opacity}
        filter={filter}
      />
    )
  },
  {
    id: 'asp_re',
    label: 're (Habitual)',
    type: 'suffix',
    symbol: '//',
    description: 'Doble barra al final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x + size * 1.0}, ${y})`} opacity={opacity} filter={filter}>
        <line x1={-size * 0.3} y1={size * 0.6} x2={size * 0.3} y2={-size * 0.6} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
        <line x1={size * 0.1} y1={size * 0.6} x2={size * 0.7} y2={-size * 0.6} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
      </g>
    )
  },
  {
    id: 'asp_in',
    label: 'in (Incoativo)',
    type: 'suffix',
    symbol: '→',
    description: 'Flecha desde el final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x}, ${y})`} opacity={opacity} filter={filter}>
        <path d={`M 0 0 L ${size * 1.5} 0 M ${size * 1.0} ${-size * 0.4} L ${size * 1.5} 0 L ${size * 1.0} ${size * 0.4}`} stroke={color} strokeWidth={strokeWidth * 1.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )
  },

  // --- SUFFIXES (Closure/Modifier) ---
  {
    id: 'clos_el',
    label: '-el (Cierre positivo)',
    type: 'suffix',
    symbol: '/',
    description: 'Trazo ascendente al final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <line x1={x + size * 0.6} y1={y + size * 0.6} x2={x + size * 1.4} y2={y - size * 0.6} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'clos_un',
    label: '-un (Cierre negativo)',
    type: 'suffix',
    symbol: '\\',
    description: 'Trazo descendente al final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <line x1={x + size * 0.6} y1={y - size * 0.6} x2={x + size * 1.4} y2={y + size * 0.6} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'clos_ri',
    label: '-ri (Intensificación)',
    type: 'suffix',
    symbol: '!!',
    description: 'Doble trazo final (simulado)',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      // Visual representation: double line next to end point
      <line x1={x + size * 0.4} y1={y - size * 0.4} x2={x + size * 0.4} y2={y + size * 0.4} stroke={color} strokeWidth={strokeWidth * 2.5} strokeLinecap="round" opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'clos_nil',
    label: 'nil (Negación hecho)',
    type: 'suffix',
    symbol: '∅',
    description: 'Símbolo de vacío al final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x + size * 1.2}, ${y})`} opacity={opacity} filter={filter}>
        <circle cx={0} cy={0} r={size * 0.5} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} />
        <line x1={size * 0.35} y1={-size * 0.35} x2={-size * 0.35} y2={size * 0.35} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
      </g>
    )
  },
  {
    id: 'clos_he',
    label: '-he (Pasado/Eco)',
    type: 'suffix',
    symbol: '⌒',
    description: 'Arco sobre el final',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <path d={`M ${x - size * 0.6} ${y - size * 0.6} Q ${x} ${y - size * 1.4} ${x + size * 0.6} ${y - size * 0.6}`} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" opacity={opacity} filter={filter} />
    )
  },
  {
    id: 'clos_fi',
    label: '-Fi (Futuro/Semilla)',
    type: 'suffix',
    symbol: '↑',
    description: 'Punto con línea ascendente',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x + size * 1.0}, ${y})`} opacity={opacity} filter={filter}>
        <circle cx={0} cy={0} r={size * 0.2} fill={color} />
        <line x1={0} y1={0} x2={0} y2={-size * 1.0} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
        <path d={`M ${-size * 0.3} ${-size * 0.7} L 0 ${-size * 1.0} L ${size * 0.3} ${-size * 0.7}`} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )
  },
  // --- SUFFIXES (Partículas Relacionales / Casos Fluídos) ---
  {
    id: 'suf_na',
    label: "'na (Inesivo - En/Dentro)",
    type: 'suffix',
    symbol: '⊙',
    description: 'Anillo con punto interior al final (Inesivo: en o dentro del núcleo)',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x + size * 0.9}, ${y})`} opacity={opacity} filter={filter}>
        <circle cx={0} cy={0} r={size * 0.45} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} />
        <circle cx={0} cy={0} r={size * 0.16} fill={color} />
      </g>
    )
  },
  {
    id: 'suf_vi',
    label: "'vi (Instrumental - Con/A través)",
    type: 'suffix',
    symbol: '⫽',
    description: 'Doble trazo oblicuo de mediación al final (Instrumental: con o por)',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x + size * 0.9}, ${y})`} opacity={opacity} filter={filter}>
        <line x1={-size * 0.22} y1={size * 0.5} x2={size * 0.05} y2={-size * 0.5} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
        <line x1={size * 0.12} y1={size * 0.5} x2={size * 0.39} y2={-size * 0.5} stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
      </g>
    )
  },
  {
    id: 'suf_zo',
    label: "'zo (Direccional - Hacia)",
    type: 'suffix',
    symbol: '›',
    description: 'Ángulo directriz hacia adelante al final (Direccional: hacia / rumbo)',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x + size * 0.9}, ${y})`} opacity={opacity} filter={filter}>
        <path d={`M ${-size * 0.2} ${-size * 0.45} L ${size * 0.25} 0 L ${-size * 0.2} ${size * 0.45}`} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )
  },
  {
    id: 'suf_da',
    label: "'da (Ablativo - Desde/Origen)",
    type: 'suffix',
    symbol: '‹',
    description: 'Ángulo de procedencia hacia atrás al final (Ablativo: desde la raíz / origen)',
    render: ({ x, y, size, color, strokeWidth, opacity, filter }) => (
      <g transform={`translate(${x + size * 0.9}, ${y})`} opacity={opacity} filter={filter}>
        <path d={`M ${size * 0.2} ${-size * 0.45} L ${-size * 0.25} 0 L ${size * 0.2} ${size * 0.45}`} fill="none" stroke={color} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )
  }
];
