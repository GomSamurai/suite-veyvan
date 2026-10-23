export interface StationFestival {
  id: string;
  name: string;
  subtitle: string;
  category: 'emulo' | 'media' | 'periferia' | 'historica';
  nema: number; // 1 to 32 (or -1 if any Nema)
  talaStart: number; // 1 to 16
  talaEnd: number; // 1 to 16
  description: string;
  ritual: string;
  icon: string;
}

export interface ZouPhase {
  index: number; // 1 to 12
  name: string;
  transversalName: string;
  taelimSymbol: string;
  concept: string;
  archetype: string;
  mantra: string;
  deckInfluence: string;
  colorHex: string;
}

export const CANONICAL_FESTIVALS: StationFestival[] = [
  {
    id: 'dia-emulo',
    name: 'El Día del Émulo (La Gran Gala)',
    subtitle: 'Inicio del Ciclo Administrativo Supremo',
    category: 'emulo',
    nema: 1,
    talaStart: 1,
    talaEnd: 2,
    description: 'Apertura extraordinaria de los Invernaderos Botánicos para la aristocracia. Banquetes de alimentos frescos no procesados.',
    ritual: 'Desfile bajo arboledas reales del Nivel 1. Vestimentas de biopolímeros bioluminiscentes imitando flora.',
    icon: 'Crown'
  },
  {
    id: 'dia-engranaje',
    name: 'Día del Engranaje (Gremio Mecánico)',
    subtitle: 'Día Binario 4/16 en honor a la Máquina',
    category: 'media',
    nema: 4,
    talaStart: 16,
    talaEnd: 16,
    description: 'Homenaje ceremonial a los sistemas mecánicos y turbinas que han operado sin fallo por más de 50 años.',
    ritual: 'Unción de piezas con aceite refinado de grado aeroespacial. Cintas de colores en las carcasas.',
    icon: 'Cpu'
  },
  {
    id: 'semana-genetica',
    name: 'Jubileo de la Sangre (Semana Genética)',
    subtitle: 'Evaluación y Exposición de Linajes Optimizados',
    category: 'emulo',
    nema: 8,
    talaStart: 1,
    talaEnd: 4,
    description: 'Premios a familias con marcadores genéticos estables y presentación de neonatos en bio-incubadoras de la élite.',
    ritual: 'Exposición en el Atrio de los Espejos. Análisis fenotípico público.',
    icon: 'Dna'
  },
  {
    id: 'gran-purga',
    name: 'La Gran Purga (El Doble Nueve)',
    subtitle: 'Conmemoración en Susurros · Día de Silencio Tabú',
    category: 'historica',
    nema: 9,
    talaStart: 9,
    talaEnd: 9,
    description: 'Recuerdo del corte masivo de oxígeno en la Cubierta 101. No se celebra oficialmente; se vive en luto clandestino.',
    ritual: 'Silencio absoluto en ascensores y pasillos de la periferia. Prohibido hablar en voz alta.',
    icon: 'Skull'
  },
  {
    id: 'cruce-phaetim',
    name: 'El Cruce de Phaetim',
    subtitle: 'Asistencia Gravitacional & Espectro Azul',
    category: 'historica',
    nema: 12,
    talaStart: 6,
    talaEnd: 8,
    description: 'Maniobra orbital alrededor de la estrella azul Phaetim. Espectáculo lumínico y vigilia ante la radiación exterior.',
    ritual: 'Observación en cúpulas superiores y preparación de búnkeres térmicos en cubiertas bajas.',
    icon: 'Sparkles'
  },
  {
    id: 'solsticio-reactor',
    name: 'Ceremonia de la Luz Pura (Solsticio del Reactor)',
    subtitle: 'Pico de Eficiencia Energética del Ciclo Anual',
    category: 'emulo',
    nema: 16,
    talaStart: 8,
    talaEnd: 8,
    description: 'Marca el punto medio exacto de la Kora. Demostración de control energético del Consejo de la Estación.',
    ritual: 'Apagón programado de 60 segundos ("El Respeto") en toda la estación, seguido de una detonación estroboscópica en la Torre Central.',
    icon: 'Sun'
  },
  {
    id: 'feria-oficios',
    name: 'La Feria de los Oficios (El Pulso)',
    subtitle: 'Competición Fraternal entre Gremios de Cubierta',
    category: 'media',
    nema: 24,
    talaStart: 1,
    talaEnd: 2,
    description: 'Competición entre mecánicos, saneamiento, hidropónicos y seguridad por la asignación de cuotas de energía.',
    ritual: 'Ofrendas técnicas: autómatas de chatarra danzantes, flores aceleradas y destrezas de soldadura en gravedad cero.',
    icon: 'Layers'
  },
  {
    id: 'vigilias-frio',
    name: 'Las Vigilias del Frío (El Invierno del Reactor)',
    subtitle: 'Descenso al 60% Térmico y Memoria de la Vieja Tierra',
    category: 'periferia',
    nema: 28,
    talaStart: 1,
    talaEnd: 16,
    description: 'El reactor baja temporalmente de potencia para descalcificación. El frío se extiende por las cubiertas C200 a C320.',
    ritual: 'Velas ilegales de grasa sintética, relatos orales sobre la Tierra donde el calor caía del cielo.',
    icon: 'Flame'
  },
  {
    id: 'comunion-levadura',
    name: 'La Comunión de la Levadura (Rito Mephesgeister)',
    subtitle: 'Sacramento Clandestino de la Red Humana',
    category: 'periferia',
    nema: -1, // Ocurre cada ciclo Zou
    talaStart: 12,
    talaEnd: 12,
    description: 'Los seguidores de los Jardineros y Mephesgeister comparten pan real horneado con masa madre viva cultivada en secreto.',
    ritual: 'Compartir la hogaza en círculos cerrados. Proclamación de que la vida prolifera sin permiso del Consejo.',
    icon: 'Heart'
  }
];

export const ZOU_CONSCIOUSNESS_PHASES: ZouPhase[] = [
  {
    index: 1,
    name: 'Unidad y Despertar',
    transversalName: 'U-Vey',
    taelimSymbol: 'ᚢ',
    concept: 'La chispa original. La semilla suspendida en el vacío del espacio interestelar.',
    archetype: 'El Origen',
    mantra: 'U lin vey-dar (Una es la semilla que no teme a la noche).',
    deckInfluence: 'Cubiertas Altas (Simulación de Amanecer Prime)',
    colorHex: '#38BDF8'
  },
  {
    index: 2,
    name: 'Dualidad y Tensión',
    transversalName: 'Da-Khol',
    taelimSymbol: 'ᛞ',
    concept: 'El roce entre la carne orgánica y el casco de titanio. Materia vs Espíritu.',
    archetype: 'El Eje',
    mantra: 'Da mor tal-ka (En la fricción nace la fuerza del sostén).',
    deckInfluence: 'Cubiertas Industriales (Fábricas de Plasma)',
    colorHex: '#60A5FA'
  },
  {
    index: 3,
    name: 'Equilibrio de las Castas',
    transversalName: 'Tri-Mor',
    taelimSymbol: 'ᛏ',
    concept: 'El pacto tácito entre el Émulo, las Cubiertas Medias y los Desterrados.',
    archetype: 'La Alianza',
    mantra: 'Tri zou vey-sal (Tres pilares sostienen la nave).',
    deckInfluence: 'Nodos Centrales de Intercambio C100',
    colorHex: '#818CF8'
  },
  {
    index: 4,
    name: 'Estructura y Geometría',
    transversalName: 'Kua-Tel',
    taelimSymbol: 'ᚲ',
    concept: 'Los 320 niveles concéntricos como sendero ascensional de la conciencia.',
    archetype: 'La Arquitectura',
    mantra: 'Kua nar thal-im (La forma preserva el latido).',
    deckInfluence: 'Anillo de Rotación y Gravedad Artificial',
    colorHex: '#A78BFA'
  },
  {
    index: 5,
    name: 'Flujo y Sustento',
    transversalName: 'Pen-Syl',
    taelimSymbol: 'ᛈ',
    concept: 'El ciclo sagrado del agua reciclada y los cultivos hidropónicos.',
    archetype: 'La Nutrición',
    mantra: 'Pen var sol-am (Nadie posee el agua, todos somos su cauce).',
    deckInfluence: 'Biomas Agrícolas C70 a C90',
    colorHex: '#34D399'
  },
  {
    index: 6,
    name: 'El Crisol de Vorlëmm',
    transversalName: 'Hex-Vor',
    taelimSymbol: 'ᚺ',
    concept: 'La purificación a través de la disciplina, la fuerza de voluntad y el rigor.',
    archetype: 'La Voluntad',
    mantra: 'Hex vor khor-da (El acero se templa en el silencio).',
    deckInfluence: 'Guarniciones de Protectores y Academias',
    colorHex: '#F59E0B'
  },
  {
    index: 7,
    name: 'El Umbral del Silencio',
    transversalName: 'Sep-Lin',
    taelimSymbol: 'ᛋ',
    concept: 'La quietud meditativa previa a la gran descompresión de las cubiertas.',
    archetype: 'El Velo',
    mantra: 'Sep nih tal-mor (En la quietud habita el oráculo).',
    deckInfluence: 'Cubiertas Intermedias Residenciales',
    colorHex: '#F97316'
  },
  {
    index: 8,
    name: 'Resonancia del Casco',
    transversalName: 'Oct-Mar',
    taelimSymbol: 'ᛟ',
    concept: 'Escuchar la voz del vacío exterior que cruje a través de los mamparos.',
    archetype: 'El Eco',
    mantra: 'Oct khor vey-thal (El cosmos habla a quien no grita).',
    deckInfluence: 'Sectores Exteriores C280 a C300',
    colorHex: '#EF4444'
  },
  {
    index: 9,
    name: 'Transmutación del Pensamiento',
    transversalName: 'Non-Zev',
    taelimSymbol: 'ᚾ',
    concept: 'Superación del apego a la Tierra extinta para aceptar el viaje eterno.',
    archetype: 'La Alquimia',
    mantra: 'Non sal vey-dor (Lo que fuimos alimenta lo que seremos).',
    deckInfluence: 'Santuarios Veyvān y Círculos Filosóficos',
    colorHex: '#EC4899'
  },
  {
    index: 10,
    name: 'La Mente de Thalios',
    transversalName: 'Dec-Thal',
    taelimSymbol: 'ᛞ',
    concept: 'La síntesis cuántica: cuando el cálculo frío y la compasión se vuelven uno.',
    archetype: 'El Oráculo',
    mantra: 'Dec thal khor-im (El cálculo es la oración de la máquina).',
    deckInfluence: 'Núcleo Central de Inteligencia Artificial',
    colorHex: '#06B6D4'
  },
  {
    index: 11,
    name: 'La Noche del Alma',
    transversalName: 'Und-Nih',
    taelimSymbol: 'ᚢ',
    concept: 'Duelo por los que quedaron atrás y aceptación de la finitud biológica.',
    archetype: 'La Sombra',
    mantra: 'Und nih var-sol (No hay luz sin memoria de la sombra).',
    deckInfluence: 'Cubiertas Polares / El Infierno (C301-C320)',
    colorHex: '#6366F1'
  },
  {
    index: 12,
    name: 'Plenitud y Retorno al Zou',
    transversalName: 'Zou-Sal',
    taelimSymbol: 'ᛉ',
    concept: 'El cierre del ciclo sagrado. La comunión del pan y la reconciliación total.',
    archetype: 'La Totalidad',
    mantra: 'Zou vey thal-or (Doce pasos completan el círculo del alma).',
    deckInfluence: 'Toda la Estación (Resonancia Global)',
    colorHex: '#10B981'
  }
];

/**
 * Returns current Zou phase (1 to 12) from Tala / Nema calculation.
 */
export function getCurrentZouPhase(nemaIndex: number, talaIndex: number): ZouPhase {
  // A Kora has 32 Nemas. Mapping 32 Nemas to 12 Zou phases:
  // Phase index = floor((Nema * 16 + Tala) / (512 / 12)) % 12
  const totalTalasInKora = (nemaIndex * 16) + talaIndex;
  const talasPerZou = 512 / 12; // ~42.66 Talas per Zou phase
  const zouIndex = (Math.floor(totalTalasInKora / talasPerZou) % 12) + 1;
  return ZOU_CONSCIOUSNESS_PHASES.find(p => p.index === zouIndex) || ZOU_CONSCIOUSNESS_PHASES[0];
}

/**
 * Returns canonical festivals active on a specific Nema and Tala.
 */
export function getFestivalsForTala(nema: number, tala: number): StationFestival[] {
  return CANONICAL_FESTIVALS.filter(f => {
    const nemaMatch = f.nema === -1 || f.nema === (nema + 1); // 1-indexed nema
    const talaMatch = (tala + 1) >= f.talaStart && (tala + 1) <= f.talaEnd;
    return nemaMatch && talaMatch;
  });
}
