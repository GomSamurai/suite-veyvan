export interface PhonemeInfo {
  letter: string;
  index: number;
  concept: string;
  family: 'Vocal Primordial' | 'Consonante Base' | 'Consonante de Flujo' | 'Consonante de Estructura' | 'Consonante Abisal';
  axis: string;
  desc: string;
  freq: number; // Resonant frequency in 432 Hz sacred scale
}

export const CANONICAL_ALPHABET = [
  'a', 'e', 'i', 'o', 'u', 'p', 'v', 'y', 'm', 'b', 'f', 'r',
  'd', 'c', 'h', 'n', 'l', 'z', 'q', 'k', 's', 't', 'g', 'j'
] as const;

export const PHONEME_DATA: Record<string, PhonemeInfo> = {
  a: {
    letter: 'a',
    index: 1,
    concept: 'Alma / Expansión',
    family: 'Vocal Primordial',
    axis: 'Vocal Primordial',
    desc: 'Apertura incondicional de la consciencia hacia el abismo cósmico.',
    freq: 216.0, // A3
  },
  e: {
    letter: 'e',
    index: 2,
    concept: 'Esencia sutil',
    family: 'Vocal Primordial',
    axis: 'Vocal Central',
    desc: 'La verdad destilada tras el colapso de lo material.',
    freq: 288.0, // D4
  },
  i: {
    letter: 'i',
    index: 3,
    concept: 'Inspiración aguda',
    family: 'Vocal Primordial',
    axis: 'Vocal Ascendente',
    desc: 'La chispa intelectual que penetra la oscuridad polar.',
    freq: 324.0, // E4
  },
  o: {
    letter: 'o',
    index: 4,
    concept: 'Observador desapegado',
    family: 'Vocal Primordial',
    axis: 'Vocal Reflexiva',
    desc: 'La mirada neutral que contempla el universo sin juicio.',
    freq: 243.0, // B3
  },
  u: {
    letter: 'u',
    index: 5,
    concept: 'Fluidez profunda',
    family: 'Vocal Primordial',
    axis: 'Vocal Descendente',
    desc: 'El curso del Rhea en las profundidades de la memoria.',
    freq: 162.0, // E3
  },
  p: {
    letter: 'p',
    index: 6,
    concept: 'Sombra y Contención',
    family: 'Consonante Abisal',
    axis: 'Consonante Límite',
    desc: 'El silencio necesario para que la luz del reactor sea visible.',
    freq: 405.0, // G#4
  },
  v: {
    letter: 'v',
    index: 7,
    concept: 'Límite y Umbral',
    family: 'Consonante de Estructura',
    axis: 'Consonante Puerta',
    desc: 'La frontera entre el ser y el no-ser en el mamparo exterior.',
    freq: 225.0, // A#3
  },
  y: {
    letter: 'y',
    index: 8,
    concept: 'Centro sutil',
    family: 'Vocal Primordial',
    axis: 'Semivocal Neutra',
    desc: 'Punto de equilibrio entre el interior y la proyección sagrada.',
    freq: 364.5, // F#4
  },
  m: {
    letter: 'm',
    index: 9,
    concept: 'Memoria de la Cuna',
    family: 'Consonante Base',
    axis: 'Consonante Labial',
    desc: 'El recuerdo de la Vieja Tierra custodiado en el alma.',
    freq: 240.0, // B3b
  },
  b: {
    letter: 'b',
    index: 10,
    concept: 'Origen y Génesis',
    family: 'Consonante Base',
    axis: 'Consonante Base',
    desc: 'El primer latido antes de la fragmentación estelar.',
    freq: 144.0, // D3
  },
  f: {
    letter: 'f',
    index: 11,
    concept: 'Fuego y Aliento',
    family: 'Consonante de Flujo',
    axis: 'Consonante Fricativa',
    desc: 'El calor sagrado que desafía el cero absoluto del vacío.',
    freq: 384.0, // G4
  },
  r: {
    letter: 'r',
    index: 12,
    concept: 'Resonancia del Rhea',
    family: 'Consonante de Flujo',
    axis: 'Consonante de Flujo',
    desc: 'La vibración armónica continua que esculpe la realidad.',
    freq: 256.0, // C4 (Pithagorean 256Hz)
  },
  d: {
    letter: 'd',
    index: 13,
    concept: 'Dualidad',
    family: 'Consonante Abisal',
    axis: 'Consonante Dialéctica',
    desc: 'La tensión necesaria entre dos polos complementarios.',
    freq: 216.0, // A3
  },
  c: {
    letter: 'c',
    index: 14,
    concept: 'Calma y Sosiego',
    family: 'Consonante Abisal',
    axis: 'Consonante Serena',
    desc: 'La quietud que sobrevive a las tormentas de plasma del reactor.',
    freq: 192.0, // G3
  },
  h: {
    letter: 'h',
    index: 15,
    concept: 'Eco y Resonancia',
    family: 'Consonante de Flujo',
    axis: 'Consonante Aérea',
    desc: 'El susurro del aliento que persiste en el vacío de la nave.',
    freq: 432.0, // A4 (Sacred Master Tuning)
  },
  n: {
    letter: 'n',
    index: 16,
    concept: 'Nexo y Enlace',
    family: 'Consonante de Estructura',
    axis: 'Consonante Relacional',
    desc: 'El puente sintáctico que une voluntades e individuos.',
    freq: 300.0, // D#4
  },
  l: {
    letter: 'l',
    index: 17,
    concept: 'Luz y Manifestación',
    family: 'Consonante de Estructura',
    axis: 'Consonante Radiante',
    desc: 'El despertar visible y la emanación del núcleo de energía.',
    freq: 360.0, // F4
  },
  z: {
    letter: 'z',
    index: 18,
    concept: 'Ciclo infinito',
    family: 'Consonante de Estructura',
    axis: 'Consonante Espiral',
    desc: 'El retorno eterno de los ciclos del cronosistema.',
    freq: 450.0, // A#4
  },
  q: {
    letter: 'q',
    index: 19,
    concept: 'Contención grave',
    family: 'Consonante Abisal',
    axis: 'Consonante Abisal',
    desc: 'La presión del abismo en las cubiertas polares exteriores.',
    freq: 135.0, // C#3
  },
  k: {
    letter: 'k',
    index: 20,
    concept: 'Fuerza y Estructura',
    family: 'Consonante de Estructura',
    axis: 'Consonante Firme',
    desc: 'La columna de titanio y la voluntad inquebrantable.',
    freq: 270.0, // C#4
  },
  s: {
    letter: 's',
    index: 21,
    concept: 'Silencio sagrado',
    family: 'Consonante de Flujo',
    axis: 'Consonante Sibilante',
    desc: 'La ausencia de ruido donde la verdad del cosmos se revela.',
    freq: 480.0, // B4
  },
  t: {
    letter: 't',
    index: 22,
    concept: 'Tierra y Firmeza',
    family: 'Consonante Base',
    axis: 'Consonante Ancla',
    desc: 'La solidez necesaria para sostener 344 años de tránsito.',
    freq: 337.5, // E4
  },
  g: {
    letter: 'g',
    index: 23,
    concept: 'Gusto y Materia',
    family: 'Consonante Base',
    axis: 'Consonante Raíz',
    desc: 'El anclaje terrenal y la experiencia sensorial corpórea.',
    freq: 180.0, // F#3
  },
  j: {
    letter: 'j',
    index: 24,
    concept: 'Júbilo sagrado',
    family: 'Consonante Abisal',
    axis: 'Consonante Elevada',
    desc: 'El gozo de existir a pesar de la finitud humana.',
    freq: 320.0, // D#4
  },
};
