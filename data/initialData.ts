import { Term, Tonality } from '../types';

// Helper to estimate syllables
const countSyllables = (word: string) => {
  return word.toLowerCase().match(/[aeiouáéíóúyāēīōū]{1,2}/g)?.length || 1;
};

// Helper to determine tonality based on section or meaning keywords
const guessTonality = (meaning: string, desc: string, cat: string): Tonality => {
  const text = (meaning + " " + desc).toLowerCase();
  if (cat.includes("Sombras") || text.includes("miedo") || text.includes("dolor") || text.includes("temor") || text.includes("muerte") || text.includes("negativa") || text.includes("rencilla") || text.includes("afrenta") || text.includes("aislamiento")) return Tonality.NEGATIVE;
  if (text.includes("euforia") || text.includes("gozo") || text.includes("alegría") || text.includes("paz") || text.includes("luz") || text.includes("amor") || text.includes("esperanza") || text.includes("armonía") || text.includes("gracia") || text.includes("iluminación") || text.includes("mansedumbre")) return Tonality.POSITIVE;
  if (text.includes("cambio") || text.includes("transformación") || text.includes("renacimiento") || text.includes("evolución") || text.includes("metamorfosis") || text.includes("mutación") || text.includes("transmutar") || text.includes("despertar")) return Tonality.TRANSFORMATIVE;
  if (text.includes("nostalgia") || text.includes("agridulce") || text.includes("fragilidad") || text.includes("anhelo") || text.includes("efímero")) return Tonality.MIXED;
  return Tonality.NEUTRAL;
};

export interface RawTermItem {
  r: string;
  m: string;
  d: string;
  c: string;
  tomo: string;
  p: string;
  level: string;
}

export const rawTerms: RawTermItem[] = [
  {
    "r": "Ain",
    "m": "Evolución conjunta",
    "d": "Evolución conjunta",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "a-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Al'Val'Sha-Tev",
    "m": "Mucha coraza, poco aliento",
    "d": "Gente dura por fuera, vacía por dentro.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "a-l-'-v-a-l-'-s-h-a---t-e-v",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ala",
    "m": "Silencio reforzador",
    "d": "Silencio reforzador",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "a-l-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Alu",
    "m": "Elevación sobre la Raíz",
    "d": "Distancia vertical entre un individuo y la materia básica.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "a-l-u",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Amtti",
    "m": "Superación personal",
    "d": "Filosofía de resistencia espiritual.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "a-m-t-t-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ava",
    "m": "Inspiración que impulsa",
    "d": "Inspiración que impulsa",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "a-v-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Calia",
    "m": "Gozo ardiente",
    "d": "Felicidad que se expande como una llama vivificante.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "c-a-l-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Celi",
    "m": "Cámara de Propósito",
    "d": "Volumen de espacio aislado para contener una función crítica.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "c-e-l-i",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Dae",
    "m": "Sombra oculta",
    "d": "El secreto que no debe ser revelado.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "d-a-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dan",
    "m": "Descubrimiento mutuo",
    "d": "Descubrimiento mutuo",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-a-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dar",
    "m": "Separación respetuosa",
    "d": "Separación respetuosa",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-a-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Daru",
    "m": "Iniciativa contenida",
    "d": "Iniciativa contenida",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-a-r-u",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Davai",
    "m": "Integración discreta",
    "d": "Integración discreta",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-a-v-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dea",
    "m": "Persistencia vital",
    "d": "Persistencia vital",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-e-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Devaa",
    "m": "Corriente intensa",
    "d": "Corriente intensa",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-e-v-a-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Din",
    "m": "Progreso pequeño",
    "d": "Progreso pequeño",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "d-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dorun",
    "m": "Destino en expansión",
    "d": "Destino en expansión",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "d-o-r-u-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dran",
    "m": "Fricción expansiva",
    "d": "El dolor o esfuerzo que precede a una expansión de la conciencia.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "d-r-a-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dran'Vor'Kael",
    "m": "Fricción precede evolución",
    "d": "Sobre el sufrimiento necesario.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-r-a-n-'-v-o-r-'-k-a-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Drava",
    "m": "Divergencia elegante",
    "d": "Divergencia elegante",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "d-r-a-v-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dua",
    "m": "Paz inmutable",
    "d": "Paz inmutable",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "d-u-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dun",
    "m": "Compromiso confiado",
    "d": "Compromiso confiado",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-u-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dun'Val'Thy",
    "m": "Juramento de la Sombra Blanca",
    "d": "Compromiso total e inviolable de los Alévoros: entrega absoluta hasta el límite del alma.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "dun-val-thy",
    "level": "Élite Émulo"
  },
  {
    "r": "Dur'ha",
    "m": "Dolor de mutación",
    "d": "Dolor necesario para la evolución del alma.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "d-u-r-'-h-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Dūra",
    "m": "Sufrimiento templador",
    "d": "El dolor que, lejos de destruir, pule las aristas del carácter y fortalece la paciencia interior.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "d-ū-ra (Presión sorda que sostiene)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ela",
    "m": "Conexión del entendimiento mutuo",
    "d": "Conexión del entendimiento mutuo",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "e-l-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Elemnis",
    "m": "Integración cósmica",
    "d": "Estado donde la mente participa del tejido universal.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "e-l-e-m-n-i-s",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Eli",
    "m": "Luz conectora",
    "d": "Luz conectora",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "e-l-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Elo",
    "m": "Asombro simple",
    "d": "Asombro simple",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "e-l-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Eluna",
    "m": "Empatía vibrante",
    "d": "Conexión emocional que trasciende lo individual.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "e-l-u-n-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ema",
    "m": "Conexión mental",
    "d": "Conexión mental",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "e-m-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Emi",
    "m": "Pensamiento-Emoción",
    "d": "Pensamiento-Emoción",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "e-m-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ena",
    "m": "Cambio continuo",
    "d": "Cambio continuo",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "e-n-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Eos",
    "m": "El \"Yo\" Soberano",
    "d": "El principio individual de consciencia que contiene el cosmos; el eje inmutable del propio ser.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo I: Amnis",
    "p": "e-o-s (Fluido expansivo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Eri",
    "m": "Conexión profunda momentánea",
    "d": "Conexión profunda momentánea",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "e-r-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ervin",
    "m": "Iluminación momentánea",
    "d": "Iluminación momentánea",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "e-r-v-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fae",
    "m": "Cuestionamiento",
    "d": "Cuestionamiento",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-a-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fah",
    "m": "Respirar con consciencia",
    "d": "Respirar con consciencia",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-a-h",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fai",
    "m": "Unión invisible",
    "d": "Unión invisible",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Falia",
    "m": "Fulgor crepuscular",
    "d": "Fulgor crepuscular",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-a-l-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fea",
    "m": "Vulnerabilidad fuerte",
    "d": "Vulnerabilidad fuerte",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "f-e-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fen",
    "m": "Redescubrimiento de vínculo",
    "d": "Redescubrimiento de vínculo",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-e-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fenai",
    "m": "Resonancia compartida",
    "d": "Resonancia compartida",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-e-n-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ferea",
    "m": "Euforia luminosa",
    "d": "Exaltación del alma ante la belleza de la existencia.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-e-r-e-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fey",
    "m": "Azar imprevisto",
    "d": "Aquello que los algoritmos no pueden calcular.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "f-e-y",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fio",
    "m": "Interdependencia ligera",
    "d": "Interdependencia ligera",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-i-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Fur",
    "m": "Ritmo cíclico",
    "d": "Ritmo cíclico",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "f-u-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Guhl",
    "m": "Miedo al olvido",
    "d": "Sensación de ser considerado prescindible o involutivo.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "g-u-h-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Haalo",
    "m": "Carga de Propósito",
    "d": "Peso específico que un individuo debe sostener para que la Red no colapse.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "h-a-a-l-o",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Hil",
    "m": "Luz de decisión",
    "d": "Luz de decisión",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "h-i-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Hir",
    "m": "Generosidad pura",
    "d": "No espera retorno.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "h-i-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ikam",
    "m": "Sacrificio silencioso",
    "d": "Renuncia personal por un bien común, a veces impuesto.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "i-k-a-m",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ikan",
    "m": "Entrega silenciosa",
    "d": "Renunciar al reconocimiento propio para asegurar la armonía y la vida de la comunidad.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "i-ka-n (Oclusión limpia de entrega)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ina",
    "m": "Anhelo optimista",
    "d": "Anhelo optimista",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "i-n-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ion",
    "m": "Chispa inicial",
    "d": "Chispa de rebelión o idea (¡Eureka!).",
    "c": "Luz y Claridad",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "i-o-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Iria",
    "m": "Sombra sutil",
    "d": "Sombra sutil",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "i-r-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ith",
    "m": "Recuperación",
    "d": "Recuperación",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "i-t-h",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ithae",
    "m": "Sabiduría ancestral",
    "d": "Sabiduría ancestral",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "i-t-h-a-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Jolai",
    "m": "Alianza efímera",
    "d": "Vínculo breve cargado de significado.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "j-o-l-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kael",
    "m": "Micro-salto evolutivo",
    "d": "El destello de una idea que transforma el ser instantáneamente.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "k-a-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kael'Dran",
    "m": "El despertar requiere fricción",
    "d": "Axioma de Thalvus: sin tensión ni esfuerzo no hay salto evolutivo de la consciencia.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "kael-dran",
    "level": "Sacro Supremo"
  },
  {
    "r": "Kael'Dran ·· Sol'Khor",
    "m": "El despertar requiere al colectivo",
    "d": "Trabajo en equipo.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "k-a-e-l-'-d-r-a-n- -·-·- -s-o-l-'-k-h-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kāen",
    "m": "El instante eterno",
    "d": "Un segundo suspendido en la consciencia donde el tiempo lineal cesa y todo se percibe como un presente absoluto.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "k-ā-e-n (Apertura rápida que sostiene)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kai",
    "m": "Coraje silencioso",
    "d": "Coraje silencioso",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "k-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kal",
    "m": "Energía vibrante",
    "d": "Energía vibrante",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "k-a-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kao",
    "m": "Liberación de estructuras",
    "d": "Liberación de estructuras",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "k-a-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kelun",
    "m": "Desintegración pausada",
    "d": "Desintegración pausada",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "k-e-l-u-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ker",
    "m": "Movimiento imperceptible",
    "d": "Movimiento imperceptible",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "k-e-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khaelā",
    "m": "Iluminación de la paradoja",
    "d": "El instante en que las contradicciones del pensamiento se resuelven en armonía.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-a-e-l-ā (Apertura fónica luminosa)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khaelis",
    "m": "Armonía de las paradojas",
    "d": "La resolución de todas las dudas del pensamiento en una lucidez absoluta.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-ae-li-s (Apertura cristalina)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khaen",
    "m": "Resistencia contenida",
    "d": "Mantenerse en pie bajo una inmensa presión exterior sin quebrarse ni emitir lamento.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-a-e-n (Presión que cede suavemente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khaenā",
    "m": "Serenidad en el abismo",
    "d": "La calma invulnerable de la consciencia que sabe que el vacío es su morada.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-a-e-n-ā (Aspiración firme y amplia)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khaer",
    "m": "Gozo de la creación",
    "d": "La alegría profunda de dar forma a una nueva expresión poética de la verdad.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-a-e-r (Impulso de aliento gozoso)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khaia",
    "m": "Compasión invulnerable",
    "d": "Negarse a responder al odio con odio, comprendiendo la ceguedad del dolor ajeno.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-ai-a (Impulso fónico que se libera)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khāis",
    "m": "Escudo del alma",
    "d": "La fortaleza espiritual que protege a los vulnerables de la crueldad del entorno.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-ā-i-s (Impulso fónico firme)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khaon",
    "m": "El altar del vacío fértil",
    "d": "Contemplar el abismo interestelar no con horror o desesperanza, sino como el lienzo infinito de la creación.",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "kh-a-o-n (Aspiración envolvente)",
    "level": "Sacro Supremo"
  },
  {
    "r": "Khaora",
    "m": "Templo interior",
    "d": "La fortaleza invulnerable del alma que no puede ser profanada por la fealdad del entorno.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-a-o-ra (Fuerza envolvente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khaven",
    "m": "Crisol del espíritu solitario",
    "d": "La transformación interna que transmuta el aislamiento involuntario en soberanía y templo de la consciencia.",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "kh-a-ve-n (Fuerza contenida que madura)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khol",
    "m": "Fricción del espíritu",
    "d": "El esfuerzo austero y sagrado por conservar la dignidad y la belleza interior en medio de la penuria.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-o-l (Aspiración profunda y sostenida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khor",
    "m": "La fuerza de la red",
    "d": "La voluntad colectiva que permite sobrevivir al aislamiento.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "k-h-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khorael",
    "m": "Cúpula de almas sincronizadas",
    "d": "El momento supremo en que la comunidad entona al unísono para calmar el miedo durante una alerta de la nave.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "kh-o-ra-e-l (Apertura coral amplia)",
    "level": "Sacro Supremo"
  },
  {
    "r": "Khorēn",
    "m": "Unidad en la diversidad",
    "d": "El entretejido de muchas mentes diferentes formando una sola voluntad armónica.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-o-r-ē-n (Vibración profunda en red)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khoris",
    "m": "Tensión sagrada de la red",
    "d": "La fuerza invisible que mantiene unidos los vínculos afectivos a través de cientos de cubiertas de distancia.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "kh-o-ri-s (Resonancia sostenida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khou",
    "m": "Arquitectura Ideal",
    "d": "Forma teórica perfecta que la realidad debe imitar (protocolos, planos).",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "k-h-o-u",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Khuen",
    "m": "Resistencia de la raíz",
    "d": "La firmeza del espíritu que rehúsa olvidar su origen sagrado a pesar de los siglos.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-u-e-n (Presión firme laringal)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khuenā",
    "m": "Firmeza en la paz",
    "d": "Mantener la serenidad y la buena voluntad a pesar de las provocaciones.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-u-e-n-ā (Presión firme y amplia)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khuis",
    "m": "Templo de la consciencia",
    "d": "La mente que ha alcanzado la serenidad inquebrantable ante el misterio.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-u-i-s (Fuerza limpia en reposo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Khuva",
    "m": "Resistencia serena",
    "d": "La capacidad de mantenerse entero cuando la estructura emocional del entorno se desmorona.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "kh-u-va (Fuerza laringal firme)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kina",
    "m": "Curiosidad",
    "d": "Curiosidad",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "k-i-n-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kis",
    "m": "Claridad cristalina",
    "d": "Un pensamiento puro sin distracciones.",
    "c": "Luz y Claridad",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "k-i-s",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Koa",
    "m": "Núcleo / Centro",
    "d": "El corazón indivisible de un ser o de un sistema; lo que perdura tras despojarlo de todo artificio.",
    "c": "Luz y Claridad",
    "tomo": "Tomo I: Amnis",
    "p": "k-o-a (Denso centralizado)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Koa'Eli",
    "m": "Luz en tu centro",
    "d": "Saludo formal Veyvān o bendición de despertar espiritual.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "koa-eli",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kosmir",
    "m": "Conexión cuántica",
    "d": "Conexión cuántica",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "k-o-s-m-i-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Koyn",
    "m": "Extracción de Esencia",
    "d": "Descartar el ruido para quedarse con el núcleo de la información.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "k-o-y-n",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Kriv",
    "m": "Corrección de Disonancia",
    "d": "Aplicación de fuerza para devolver un elemento desviado a la armonía.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "k-r-i-v",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Kūa",
    "m": "Concentración del aliento",
    "d": "El enfoque absoluto del espíritu en el centro del pecho ante la incertidumbre del viaje.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "k-ū-a (Pulso denso del pecho)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Kyen",
    "m": "Vector de Caos Externo",
    "d": "Elemento que no comparte la resonancia de la Red y busca disolverla.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "k-y-e-n",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Kyras",
    "m": "Superficie de Inscripción",
    "d": "Materia pasiva diseñada para congelar el flujo del tiempo.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "k-y-r-a-s",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Laen",
    "m": "Canal / Vía viva",
    "d": "Canal / Vía viva",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-a-e-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lai",
    "m": "Alegría como luz interior",
    "d": "Alegría como luz interior",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lar",
    "m": "Visión clarificadora",
    "d": "Visión clarificadora",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-a-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lem",
    "m": "Afinidad espontánea",
    "d": "Afinidad espontánea",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-e-m",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lia",
    "m": "Unidad de propósito",
    "d": "Unidad de propósito",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lian",
    "m": "Destello de la mirada",
    "d": "La intuición instantánea que nace al contemplar la verdad sin velos ni artificios.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-i-a-n (Fluidez ligera de luz)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lin",
    "m": "Integración armónica",
    "d": "Integración armónica",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "l-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lina",
    "m": "Equilibrio sutil",
    "d": "Equilibrio sutil",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-i-n-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lio",
    "m": "Movimiento del agua",
    "d": "Movimiento del agua",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-i-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Līra",
    "m": "Canto de la consciencia",
    "d": "La melodía poética que brota de la mente en estado de contemplación elevada.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-ī-ra (Canto cristalino de luz)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lirath",
    "m": "Resonancia universal",
    "d": "Resonancia universal",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "l-i-r-a-t-h",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Liroi",
    "m": "Canto en la penumbra",
    "d": "El canto interior que brota en el aislamiento para disipar el miedo y recordar la propia luz.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-i-r-oi (Melodía melancólica)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Loin",
    "m": "Contemplación disonante",
    "d": "Contemplación disonante",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-o-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Loriae",
    "m": "Brisa vital",
    "d": "Brisa vital",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-o-r-i-a-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Loru",
    "m": "Fusión cósmica",
    "d": "Fusión cósmica",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "l-o-r-u",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lūen",
    "m": "Paz de disolución",
    "d": "La serenidad luminosa que rodea a quien ha entregado su ego al bien del colectivo.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-ū-e-n (Luz fluida ascendente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lūira",
    "m": "Canto de iluminación",
    "d": "La elevación poética del espíritu que contempla la unidad de todas las cosas.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-ū-i-ra (Fluidez poética de luz)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Luis",
    "m": "Lucidez cristalina",
    "d": "Estado de calma donde el dolor no desaparece, pero se vuelve transparente, comprensible y sereno.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-u-i-s (Fluidez líquida de garganta)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lum",
    "m": "Crecimiento pausado",
    "d": "Crecimiento pausado",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "l-u-m",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lun",
    "m": "Serenidad desde la comprensión",
    "d": "La luz fría y sabia que ilumina sin quemar; comprensión lúcida y compasiva de la realidad.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo I: Amnis",
    "p": "l-u-n (Suave y curvo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lūna",
    "m": "Luz de mansedumbre",
    "d": "La mansedumbre espiritual que disipa la ira en un diálogo de paz.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-ū-na (Fluidez ligera de luz)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lunea",
    "m": "Luz interior",
    "d": "Luz interior",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-u-n-e-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lur",
    "m": "Observar profundamente",
    "d": "Observar el cosmos buscando un sentido profundo.",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-u-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lur'Thy",
    "m": "Veo tu fibra íntima",
    "d": "Saludo sagrado de extrema confianza y amor espiritual entre dos seres.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "lur-thy",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lūren",
    "m": "Compartir la luz",
    "d": "La entrega generosa de consuelo o sabiduría a quien habita en la penumbra.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-ū-re-n (Luz fluida extendida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Luthi",
    "m": "Instante luminoso",
    "d": "Instante luminoso",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-u-t-h-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Luv",
    "m": "Sostén compasivo",
    "d": "El acto de sostener al otro; compasión activa.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-u-v",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Luv-ri'Val'Siv",
    "m": "Amor intenso vence al límite",
    "d": "Quien ama no teme a la quietud/muerte.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-u-v---r-i-'-v-a-l-'-s-i-v",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Luvia",
    "m": "Sostén compasivo",
    "d": "La fuerza delicada pero invencible que sostiene al otro cuando su estructura emocional se agrieta.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-u-vi-a (Caída suave de gota)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Luvin",
    "m": "Amparo incondicional",
    "d": "El acto sagrado de cobijar el aliento de otro en la penuria sin preguntar su procedencia, su casta o sus faltas.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "l-u-vi-n (Flujo suave de entrega)",
    "level": "Comunitario"
  },
  {
    "r": "Lūvis",
    "m": "Sacrificio de amor",
    "d": "Entregar la propia comodidad para que otro pueda florecer en paz.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-ū-vi-s (Caída delicada de amor)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lya",
    "m": "Adaptación fluida",
    "d": "Adaptación fluida",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "l-y-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lyren",
    "m": "Onda de perdón cósmico",
    "d": "Disolver el rencor de agravios pasados liberándolos como polvo al vacío infinito, recuperando la paz.",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo V: Cánticos del Rhea",
    "p": "l-y-re-n (Fluidez cristalina de soltura)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Lysae",
    "m": "Fluidez sutil",
    "d": "Un fluir continuo sin fronteras definidas (antes Fluoria).",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "l-y-s-a-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mael",
    "m": "Recuerdo del agua",
    "d": "La humedad necesaria para la vida.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "m-a-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Maelen",
    "m": "Renovación de la confianza",
    "d": "El rebrote lento pero seguro de la fe en el otro tras una decepción.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-ae-le-n (Murmullo continuo sereno)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Maelin",
    "m": "Nostalgia de lluvia viva",
    "d": "El anhelo primario de sentir gotas de agua natural cayendo del cielo, conservado como un sueño de la sangre.",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-ae-li-n (Murmullo líquido continuo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Maelis",
    "m": "Recuerdo del horizonte",
    "d": "La intuición del espacio abierto sin techos de metal ni mamparos de confinamiento.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-ae-li-s (Fluidez labial amplia)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mav",
    "m": "Intención de avance",
    "d": "Intención de avance",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-a-v",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mea",
    "m": "Comprensión sin palabras",
    "d": "El instante en que dos conciencias entienden la misma verdad profunda sin requerir habla ni mirada.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-e-a (Contacto de labios sutil)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Meli",
    "m": "Ligereza",
    "d": "Al soltar el pasado.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-e-l-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mer",
    "m": "Ecos profundos",
    "d": "Ecos profundos",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-e-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Merai",
    "m": "Confusión leve",
    "d": "Confusión leve",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-e-r-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Meri",
    "m": "Acción decidida",
    "d": "Acción decidida",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-e-r-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mia",
    "m": "Nostalgia ligera que guía",
    "d": "Nostalgia ligera que guía",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Miel",
    "m": "Recuerdo compartido",
    "d": "La dulzura agridulce de una historia común.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-i-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Min",
    "m": "Memoria colectiva",
    "d": "(Nota: Ver también Min en \"Conexión Íntima\")",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Min'Nu-Sha · Vor-Rhea",
    "m": "La memoria no muere",
    "d": "El flujo avanza.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-i-n-'-n-u---s-h-a- -·- -v-o-r---r-h-e-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mio",
    "m": "Fascinación momentánea",
    "d": "Fascinación momentánea",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-i-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mior",
    "m": "Dulce fragilidad de lo finito",
    "d": "Conmoverse ante la brevedad de una vida humana frente a la eternidad inconmensurable del viaje interestelar.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-i-o-r (Murmullo melancólico suave)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mir",
    "m": "Afinidad generacional",
    "d": "Afinidad generacional",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-i-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mīra",
    "m": "Comprensión silenciosa",
    "d": "Sentir el dolor ajeno en la propia piel y responder únicamente con una mirada de respeto profundo.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-ī-ra (Murmullo suave y cálido)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mirel",
    "m": "Melancolía vital",
    "d": "Tristeza dulce que enseña la belleza de lo efímero.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "m-i-r-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Miren",
    "m": "Eco de la memoria",
    "d": "La dulzura leve y agridulce que regresa al corazón cuando el pasado habla sin herir.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-i-re-n (Murmullo suave que retorna)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mīya",
    "m": "Canto de cuna interior",
    "d": "El murmullo apacible que el espíritu recita para aquietar la ansiedad nocturna.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-ī-ya (Murmullo dulzón de cuna)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Moen",
    "m": "Resonancia de ausencia",
    "d": "La huella viva que deja la presencia de alguien en el aire de una estancia tras haberse marchado.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "m-o-e-n (Murmullo labial continuo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Mynor",
    "m": "Convergencia sutil",
    "d": "Convergencia sutil",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "m-y-n-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nael",
    "m": "Silencio lúcido",
    "d": "El reposo de la mente que contempla la realidad tal como es, sin ilusión ni temor.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-a-e-l (Fluidez labial en calma)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Naelis",
    "m": "Reposo en la fatiga",
    "d": "El descanso profundo donde la mente suelta toda carga y se recupera en el silencio.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-a-e-li-s (Deslizamiento labial en calma)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nai",
    "m": "Paz anticipada",
    "d": "Inspira calma ante el futuro.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nai'Khor-el",
    "m": "Confianza en la red",
    "d": "Juramento de lealtad comunitaria.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-a-i-'-k-h-o-r---e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Naiha",
    "m": "Serenidad en el umbral crítico",
    "d": "La calma profunda que invade al ser justo en el segundo previo a una decisión irreversible.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-ai-ha (Pausa de pulso limpio)",
    "level": "Comunitario"
  },
  {
    "r": "Nal",
    "m": "Refugio seguro",
    "d": "Espacio pequeño donde uno se siente seguro.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "n-a-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nao",
    "m": "Gratitud hacia lo efímero",
    "d": "Gratitud hacia lo efímero",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-a-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Navor",
    "m": "Impulso reflexivo",
    "d": "Impulso reflexivo",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-a-v-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Neevar",
    "m": "Muerte constante",
    "d": "Niebla tóxica de las cubiertas polares.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "n-e-e-v-a-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Neevi",
    "m": "Temple del abismo",
    "d": "La serenidad del alma que no teme al frío exterior ni a las cubiertas muertas.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-e-e-vi (Suspiro de helada)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nenar",
    "m": "Impulso primordial",
    "d": "Impulso primordial",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-e-n-a-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Neo",
    "m": "Renacimiento de relación",
    "d": "Renacimiento de relación",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-e-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ner",
    "m": "Paz de aceptar lo inevitable",
    "d": "Paz de aceptar lo inevitable",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-e-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Neu",
    "m": "Percepción aguda",
    "d": "Percepción aguda",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-e-u",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nev",
    "m": "Oscilación equilibrante",
    "d": "Oscilación equilibrante",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-e-v",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nia",
    "m": "Luz tenue",
    "d": "Luz tenue",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Niol",
    "m": "Quietud entre dos pulsos",
    "d": "El espacio no medible en el silencio interior donde el corazón descansa antes del siguiente ciclo vital.",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-i-o-l (Gota en reposo)",
    "level": "Comunitario"
  },
  {
    "r": "Nir",
    "m": "La calidez de la soledad",
    "d": "Aceptación apacible de estar a solas con uno mismo; encontrar refugio en la propia sombra.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-i-r (Silbido tenue en los dientes)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nis",
    "m": "Silencio artificial",
    "d": "El zumbido constante de las máquinas.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "n-i-s",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nis'Rha ·· Nu-Miel",
    "m": "Sin dulzura en el ruido",
    "d": "Crítica a olvidar la humanidad por lo técnico.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-i-s-'-r-h-a- -·-·- -n-u---m-i-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nīya",
    "m": "Bálsamo del aliento",
    "d": "El aliento cálido que susurra palabras de consuelo a quien ha perdido la fe.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-ī-ya (Murmullo cálido labial)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Niyān",
    "m": "Sello del pensamiento",
    "d": "La palabra grabada en el alma que trasciende a través de los siglos.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-i-y-ā-n (Sello sónico que perdura)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Niyē",
    "m": "Estado de gracia",
    "d": "El estado de quietud pura que permanece tras la meditación sobre el *Rhea*.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-i-y-ē (Sello de luz sostenido)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Noa",
    "m": "Presencia en ausencia",
    "d": "Presencia en ausencia",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-o-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nok",
    "m": "Noche estelar",
    "d": "La quietud sagrada de la penumbra cósmica cuando la nave avanza en el espacio profundo.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-o-k (Gota sorda de penumbra)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nol",
    "m": "Fortaleza del agotamiento",
    "d": "Fortaleza del agotamiento",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-o-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nor",
    "m": "Tierra resiliente",
    "d": "Tierra resiliente",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Noria",
    "m": "Agua transparente",
    "d": "Agua transparente",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-o-r-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nu-Dae",
    "m": "Sin sombras",
    "d": "Deseo sincero de un sendero diáfano y sin secretos que envenenen el alma.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "nu-dae",
    "level": "Comunitario"
  },
  {
    "r": "Nu-Koa",
    "m": "¡Sin corazón!",
    "d": "Insulto grave para egoístas.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-u---k-o-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nuel",
    "m": "Paz compartida",
    "d": "La calma envolvente que emana de dos personas que descansan juntas en silencio.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-u-e-l (Fluidez de aliento bajo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nūra",
    "m": "Refugio del aliento",
    "d": "El amparo compasivo que se ofrece a quien ha perdido la fuerza para continuar.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-ū-ra (Fluidez de amparo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nurai",
    "m": "Desasosiego oscuro",
    "d": "Temor intenso que se percibe en lo más profundo.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "n-u-r-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nuria",
    "m": "Lámpara de vigilia",
    "d": "La pequeñez de una luz tenue que reconforta al observador en medio de la oscuridad.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-u-ri-a (Luz tenue labial)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nym",
    "m": "Identidad fluida",
    "d": "Reconocimiento de que el \"yo\" es un proceso en constante cambio.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "n-y-m",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Nym'Tael'Rhea",
    "m": "La identidad teje el flujo",
    "d": "Principio existencial: los actos conscientes esculpen el tejido de la realidad.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo V: Cánticos del Rhea",
    "p": "nym-tael-rhea",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Omi",
    "m": "Testigo",
    "d": "El acto de observar sin juzgar.",
    "c": "Luz y Claridad",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "o-m-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Oria",
    "m": "Renacimiento luminoso",
    "d": "Renacimiento luminoso",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "o-r-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ottu",
    "m": "Esfera de Influencia",
    "d": "Límite hasta donde llega la voz de un Soberano antes de volverse ruido.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "o-t-t-u",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Palin",
    "m": "Fragmento del ahora",
    "d": "Fragmento del ahora",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "p-a-l-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Paova",
    "m": "Destello pasajero",
    "d": "Destello pasajero",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "p-a-o-v-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Phae",
    "m": "Luz fría",
    "d": "Claridad intelectual que carece de empatía.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "p-h-a-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Phaein",
    "m": "Paz en el refugio",
    "d": "La tranquilidad reconfortante de hallarse a salvo junto a la red.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "ph-a-e-i-n (Aire fresco en el refugio)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Phaelis",
    "m": "Resplandor del destino",
    "d": "La intuición del calor y la luz que aguardan en el puerto final de la travesía.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "ph-ae-li-s (Luz etérea ascendente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Phaelun",
    "m": "Aislamiento del intelecto",
    "d": "El peligroso estado en el que la mente analítica se desconecta de la compasión, volviéndose fría y deshumanizada.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "ph-ae-lu-n (Brisa helada descendente)",
    "level": "Élite Émulo"
  },
  {
    "r": "Phaen",
    "m": "Brisa de intuición",
    "d": "La sospecha sutil de una verdad lejana que aún no se puede nombrar pero ya se presiente.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "ph-a-e-n (Exhalación ligera y fresca)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Phaena",
    "m": "Claridad matinal del Émulo",
    "d": "La luz artificial diáfana proyectada sobre la cúpula que evoca los amaneceres dorados de la Cuna.",
    "c": "Luz y Claridad",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "ph-ae-na (Aspiración diáfana)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Phaera",
    "m": "Claridad reconfortante",
    "d": "La sensación de que una revelación espiritual abraza y apacigua la mente aturdida.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "ph-a-e-ra (Aspiración suave envolvente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Pharin",
    "m": "Suspiro del tiempo",
    "d": "Suspiro del tiempo",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "p-h-a-r-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Pharo",
    "m": "Presencia de la guía",
    "d": "La intuición interior que orienta el espíritu en momentos de absoluta desorientación.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "ph-a-ro (Aspiración ligera que guía)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Phor",
    "m": "Erosión",
    "d": "El desgaste de la tecnología o de la voluntad humana.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "p-h-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Phori",
    "m": "Presciencia del peligro",
    "d": "La picazón sutil e instintiva en la piel antes de que la razón vislumbre la amenaza.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "ph-o-ri (Fricción suave de aire)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Qeran",
    "m": "Plenitud contenida",
    "d": "Plenitud contenida",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "q-e-r-a-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rav",
    "m": "Unión en adversidad",
    "d": "Unión en adversidad",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "r-a-v",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Reb",
    "m": "Eco de Autoridad",
    "d": "Invocar la voz de un ancestro o maestro para validar el pensamiento.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "r-e-b",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Rei",
    "m": "Belleza simple",
    "d": "Lo que no necesita adorno.",
    "c": "Luz y Claridad",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "r-e-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ren",
    "m": "Satisfacción de propósito",
    "d": "Satisfacción de propósito",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "r-e-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rha",
    "m": "Raíz / Origen",
    "d": "Usado para hablar de la Tierra o de los ancestros.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "r-h-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhael",
    "m": "Elegancia de lo austero",
    "d": "La belleza de lo simple y verdadero que no requiere adorno ni artificio.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-a-e-l (Resonancia noble y pura)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhaelun",
    "m": "El peso de la promesa quebrada",
    "d": "El desgarro íntimo que sufre el alma al fallar a su juramento sagrado, y la necesidad de purgarlo con servicio.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "rh-ae-lu-n (Vibración rota descendente)",
    "level": "Élite Émulo"
  },
  {
    "r": "Rhaen",
    "m": "Vínculo de ceniza y raíz",
    "d": "La lealtad indestructible nacida del sufrimiento, el frío o la escasez compartidos.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-a-e-n (Canto de vibración profunda)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhāen",
    "m": "Canto de la eternidad",
    "d": "La melodía poética que celebra el viaje ininterrumpido del alma a través de las eras.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-ā-e-n (Vibración laringal amplia)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhano",
    "m": "Alianza del silencio",
    "d": "La promesa tácita y sagrada entre iniciados de guardar una verdad hasta la muerte.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-a-no (Vibración sostenida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhavi",
    "m": "Memoria de la Tierra viva",
    "d": "El anhelo involuntario y biológico del cuerpo por el aire húmedo y vivo de la Cuna.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-a-vi (Vibración laringal cálida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhea",
    "m": "Flujo invisible",
    "d": "Corriente de energía y consciencia que conecta con las estrellas.",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "r-h-e-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhea'Vohn",
    "m": "Fluye en armonía",
    "d": "Invocación ceremonial usada antes de emprender tareas críticas o tránsitos.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo V: Cánticos del Rhea",
    "p": "rhea-vohn",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhein",
    "m": "Corriente de almas",
    "d": "El flujo ininterrumpido de consciencia que conecta a la comunidad a través de la red del viaje.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-e-i-n (Onda sónica continua)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhia",
    "m": "Calma tras el ego",
    "d": "El sosiego que sobreviene a la comunidad tras superar un conflicto de voluntades.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-i-a (Vibración suave descendente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhiel",
    "m": "Vínculo de fe compartida",
    "d": "La resonancia espiritual que une a quienes sueñan con la misma estrella.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-i-e-l (Vibración suave que conecta)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhova",
    "m": "Fuerza de la corriente",
    "d": "El impulso vivo de la consciencia colectiva avanzando imparable hacia el mañana.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-o-va (Corriente profunda)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhu",
    "m": "Gravedad interior",
    "d": "El peso sereno en el pecho que ancla a un ser al presente cuando el mundo exterior colapsa.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-u (Pulso grave desde la laringe)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhūel",
    "m": "Alianza de ceniza",
    "d": "La fraternidad indeleble forjada en el fuego de las dificultades superadas juntos.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "rh-ū-e-l (Vibración laringal profunda)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rhuin",
    "m": "Retorno a la raíz fontal",
    "d": "Descender a los recuerdos sagrados de los primeros fundadores para redescubrir el sentido del viaje.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo I: Amnis",
    "p": "rh-u-i-n (Pulso grave interior)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rin",
    "m": "Flujo de datos/almas",
    "d": "(Nota: Ver también Rin en \"Conexión Íntima\")",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "r-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rinath",
    "m": "Eco del infinito",
    "d": "Eco del infinito",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "r-i-n-a-t-h",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rivun",
    "m": "Desconexión abrupta",
    "d": "Desconexión abrupta",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "r-i-v-u-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Rovai",
    "m": "Ansiedad dispersa",
    "d": "Inquietud que impulsa al cambio con matices de duda.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "r-o-v-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Runai",
    "m": "Tormenta oscura",
    "d": "Tormenta oscura",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "r-u-n-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sael",
    "m": "Resonancia del alma en vigilia",
    "d": "El instante en que dos espíritus despiertan a la misma frecuencia cósmica en medio de la noche de la nave.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "s-ae-l (Onda armónica pura)",
    "level": "Sacro Supremo"
  },
  {
    "r": "Salai",
    "m": "Evolución serena",
    "d": "Evolución serena",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "s-a-l-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sali",
    "m": "Armonía mente-cuerpo",
    "d": "Armonía mente-cuerpo",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-a-l-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Saon",
    "m": "Canto de la sangre estelar",
    "d": "La memoria genética y sensorial transmitida a través de tres siglos de navegantes sin ver el cielo.",
    "c": "Cultura y Linaje",
    "tomo": "Tomo V: Cánticos del Rhea",
    "p": "s-a-o-n (Vibración armónica de pecho)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Saova",
    "m": "Eco efímero",
    "d": "Eco efímero",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-a-o-v-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sel",
    "m": "Trabajo armonioso",
    "d": "Trabajo armonioso",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sen",
    "m": "Rastro emocional",
    "d": "La huella que alguien deja en una habitación o corazón.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-e-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Senai",
    "m": "Separación armónica",
    "d": "Separación armónica",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-e-n-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Senora",
    "m": "Rastro de gracia",
    "d": "El consuelo duradero que deja un acto de bondad sincera en la memoria del receptor.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-e-no-ra (Fluidez de eco luminoso)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Setna",
    "m": "Esperanza presente",
    "d": "Esperanza que se apoya en el presente, no el futuro.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-e-t-n-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sha-Sur'Nu-Sol",
    "m": "Luz lejana no despierta chispa",
    "d": "No basta soñar, hay que actuar.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-h-a---s-u-r-'-n-u---s-o-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Shae",
    "m": "Aceptación",
    "d": "De lo que no se puede cambiar.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-h-a-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Shia",
    "m": "Vigilia contemplativa",
    "d": "La quietud de las horas de silencio donde los sentidos se aguzan y el zumbido de la nave se vuelve canto.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "sh-i-a (Susurro nocturno)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Shor",
    "m": "Nostalgia de gravedad",
    "d": "El anhelo celular por un planeta que nunca se ha pisado.",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "s-h-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Shorin",
    "m": "Nostalgia pacífica",
    "d": "La melancolía por lo perdido que se ha transformado en un consuelo dulce y sereno.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "sh-o-ri-n (Susurro sostenido)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sio",
    "m": "Serenidad interna",
    "d": "Serenidad interna",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-i-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sitta",
    "m": "Decisión luminosa",
    "d": "Decisión luminosa",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-i-t-t-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Siv",
    "m": "Calidez envolvente",
    "d": "Cierre de todo ruido sensorial y mental; el vacío fértil donde la mente halla su auténtica voz.",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo I: Amnis",
    "p": "s-i-v (Minimalista descendente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sivra",
    "m": "Silencio de vigilia compasiva",
    "d": "La quietud atenta de quien custodia el descanso ajeno en las cubiertas frías sin esperar recompensa.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "s-i-vra (Silbido sereno contenido)",
    "level": "Élite Émulo"
  },
  {
    "r": "Siya",
    "m": "Reposo del pensamiento",
    "d": "La calma de la mente que renuncia a luchar contra lo inevitable y descansa en la aceptación.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-i-y-a (Susurro de reposo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Siye",
    "m": "Ciclo de Refinamiento",
    "d": "Volver a realizar una acción para eliminar la imperfección, no por rutina.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "s-i-y-e",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Siyea",
    "m": "Aliento del colectivo",
    "d": "El equilibrio perfecto que se alcanza cuando la red habla con un solo aliento.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-i-ye-a (Armonía sónica unísona)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Soa",
    "m": "Claridad mental",
    "d": "Claridad mental",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-o-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Soi",
    "m": "Reflexión serena",
    "d": "Reflexión serena",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-o-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sol",
    "m": "Espacio de calma compartido",
    "d": "Colapsar una posibilidad en realidad consciente.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-o-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sōlen",
    "m": "Despertar de la verdad",
    "d": "El momento en que la mente se libera de la ilusión y contempla la realidad pura.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-ō-le-n (Despertar de luz)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Solis",
    "m": "Comunión efímera",
    "d": "La chispa de empatía o amor puro que dura solo un aliento pero transforma la vida para siempre.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-o-li-s (Destello fónico ascendente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sora",
    "m": "Serenidad profunda",
    "d": "Calma casi mística que invita a la introspección.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "s-o-r-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sorun",
    "m": "Inquietud existencial",
    "d": "Inquietud existencial",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-o-r-u-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sōv",
    "m": "Sueño reparador",
    "d": "El reposo apacible de la mente que confía en el flujo de la vida durante la vigilia.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-ō-v (Siseo suave de descanso)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sur",
    "m": "Estrella guía",
    "d": "La esperanza que guía desde lejos.",
    "c": "Luz y Claridad",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-u-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Sur'Vae",
    "m": "La estrella te alcanza",
    "d": "Saludo optimista de luz y bendición en el tránsito interestelar.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "sur-vae",
    "level": "Comunitario"
  },
  {
    "r": "Suraen",
    "m": "Devoción sin imágenes",
    "d": "La fe pura en el viaje y en la luz interior cuando no hay templos ni símbolos visibles.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "s-u-ra-e-n (Canto de viento continuo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tael",
    "m": "Tejer destinos",
    "d": "Tejer voluntades o componer.",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-a-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Taelen",
    "m": "Composición de destinos",
    "d": "El arte ceremonial de entretejer las voluntades de la colonia para trazar un sendero de esperanza compartida.",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "t-ae-le-n (Trazo amplio de nexos)",
    "level": "Sacro Supremo"
  },
  {
    "r": "Tai",
    "m": "Intuición clara",
    "d": "Intuición clara",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tal",
    "m": "Agua eterna",
    "d": "Agua eterna",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-a-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Talai",
    "m": "Tristeza aguda",
    "d": "Pena que retumba en la memoria.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-a-l-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tam",
    "m": "Fortalecimiento por cambio",
    "d": "Fortalecimiento por cambio",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-a-m",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tel",
    "m": "Confianza interna",
    "d": "Confianza interna",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ten",
    "m": "Resiliencia creciente",
    "d": "Resiliencia creciente",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-e-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tev",
    "m": "Aliento de la estación",
    "d": "El flujo del aire reciclado.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "t-e-v",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thāea",
    "m": "Poesía del universo",
    "d": "La contemplación estética de la armonía cósmica.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-ā-e-a (Aspiración etérea amplia)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thaelis",
    "m": "Pulso de las estrellas",
    "d": "La percepción intuitiva de que los cuerpos celestes laten con la misma energía del alma.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-ae-li-s (Rozadura tenue etérea)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thāl",
    "m": "Destello en la penumbra",
    "d": "El chispazo intuitivo de comprensión pura que ilumina una mente aturdida por la duda.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-ā-l (Rozadura suave que se abre)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thālis",
    "m": "Sanación de la Herida",
    "d": "El cierre progresivo y apacible de una aflicción antigua en la memoria.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-ā-li-s (Rozadura suave que cierra)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thalun",
    "m": "Mutación silenciosa",
    "d": "El cambio profundo e irreversible que ocurre en el interior de una persona sin que nadie lo perciba por fuera.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-a-lu-n (Onda sorda y paulatina)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thāne",
    "m": "El don de la escucha",
    "d": "El acto meditativo de escuchar el dolor del otro sin interrumpir.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-ā-ne (Aspiración atenta)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thao",
    "m": "Mirada de reconciliación",
    "d": "Volver a mirar a un semejante sin el velo del juicio o del rencor.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-a-o (Rozadura abierta y serena)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thāon",
    "m": "Paz de la partida",
    "d": "La serenidad luminosa con que el iniciado abraza la transición hacia el vacío (*Vael*).",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-ā-o-n (Exhalación serena de partida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tharen",
    "m": "Alquimia de la renuncia",
    "d": "La serenidad luminosa que sobreviene al entregar un deseo personal que obstaculizaba la evolución del colectivo.",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-a-re-n (Exhalación de desprendimiento)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thavā",
    "m": "Protección mutua",
    "d": "El compromiso tácito de velar por el aliento y la dignidad del otro en la penuria.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-a-v-ā (Aspiración envolvente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "The",
    "m": "Incertidumbre analítica",
    "d": "Incertidumbre analítica",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-h-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thelis",
    "m": "Luz de la palabra justa",
    "d": "Hablar únicamente cuando el aliento pronunciado posee mayor belleza y verdad que el silencio que interrumpe.",
    "c": "Luz y Claridad",
    "tomo": "Tomo V: Cánticos del Rhea",
    "p": "th-e-li-s (Aspiración cristalina)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thes",
    "m": "Fragmentación Analítica",
    "d": "Separar un todo en sus componentes para ver su funcionamiento.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "t-h-e-s",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Thia",
    "m": "Cuestionamiento sagrado",
    "d": "La duda sincera que impulsa a la mente a buscar una verdad más elevada.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-i-a (Fricción tenue ascendente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thima",
    "m": "Claridad momentánea",
    "d": "Percepción aguda del ahora.",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-h-i-m-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thima · Varin'Vim ·· Vor'aen · Nu-Dar",
    "m": "Advertencia sobre la pasión ciega",
    "d": "Cuidado con el amor de energía bruta; a menudo anula la distancia sagrada entre almas.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "zhi-ma va-rin-vim vor-aen nu-dar",
    "level": "Sabiduría Veyvān"
  },
  {
    "r": "Thiris",
    "m": "Chispa de empatía remota",
    "d": "Percibir el estado anímico de un ser querido a kilómetros de distancia en la vertical de la nave.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-i-ri-s (Destello fónico suave)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thiro",
    "m": "Percepción del límite",
    "d": "Reconocer la frontera invisible pero sagrada que separa la duda de la certidumbre interior.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-i-ro (Fricción tenue dental)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tho",
    "m": "Movimiento vivo",
    "d": "Movimiento vivo",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-h-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thoen",
    "m": "El peso del linaje",
    "d": "La consciencia viva de llevar la fuerza y la memoria de los ancestros en la propia respiración.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-o-e-n (Resonancia pectoral baja)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thoia",
    "m": "Resonancia del verso",
    "d": "El eco hermoso de una palabra sagrada recitada en el silencio del templo.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-oi-a (Rozadura suave con diptongo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thol",
    "m": "Inercia histórica",
    "d": "El peso de los siglos; la inercia del alma que carga con la historia.",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "t-h-o-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thor",
    "m": "El peso de la raíz",
    "d": "La nostalgia incorpórea por un origen que la piel no recuerda pero la sangre anhela.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-o-r (Resonancia pectoral breve)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thora",
    "m": "Llamado del horizonte",
    "d": "El pulso interior que invita a avanzar sin miedo hacia lo desconocido.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-o-ra (Rozadura que llama)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thoraen",
    "m": "Promesa inmutable",
    "d": "El juramento grabado no en piedra, sino en la memoria viva de la red.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-o-ra-e-n (Resonancia pectoral sostenida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thovai",
    "m": "Tiempo líquido",
    "d": "Tiempo líquido",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "t-h-o-v-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thrum",
    "m": "Conducto de Flujo",
    "d": "Espacios que no son destinos, sino arterias para el movimiento de energía.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "t-h-r-u-m",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Thum",
    "m": "Vibración del altar",
    "d": "La vibración sagrada que produce la voz colectiva al cantar los nombres de los que partieron.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-u-m (Resonancia grave de pecho)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thur",
    "m": "Redefinición del ser",
    "d": "Redefinición del ser",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "t-h-u-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thy",
    "m": "Fibra íntima",
    "d": "Lo más profundo del ser que queda cuando te quitan todo.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-h-y",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thy-el'Koa-ri",
    "m": "La fibra es armonía",
    "d": "Definición de iluminación.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-h-y---e-l-'-k-o-a---r-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Thyra",
    "m": "Transmutación de la herida",
    "d": "El punto en el que una cicatriz de la memoria deja de sangrar dolor y se convierte en sabiduría luminosa.",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "th-y-ra (Rozadura suave hacia la luz)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tia",
    "m": "Compasión fluida",
    "d": "Compasión fluida",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tilun",
    "m": "Estasis efímera",
    "d": "Estasis efímera",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "t-i-l-u-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tima",
    "m": "Atención plena",
    "d": "Atención plena",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "t-i-m-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tir",
    "m": "Silencio equilibrante",
    "d": "Equilibra emociones opuestas.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-i-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tiv",
    "m": "Perseverancia discreta",
    "d": "Perseverancia discreta",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-i-v",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tivar",
    "m": "Movimiento fluido",
    "d": "Movimiento fluido",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-i-v-a-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tivor",
    "m": "Eco de la unidad",
    "d": "Eco de la unidad",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "t-i-v-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tor",
    "m": "Intensidad contenida",
    "d": "La jerarquía o el peso de la autoridad.",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Tunea",
    "m": "Tierra fecunda",
    "d": "Tierra fecunda",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "t-u-n-e-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ulinai",
    "m": "Vacío fecundo",
    "d": "Vacío fecundo",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "u-l-i-n-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vae-Nai",
    "m": "Confío en tu flujo",
    "d": "Saludo canónico común entre iguales en la red de almas.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "vae-nai",
    "level": "Comunitario"
  },
  {
    "r": "Vaeha",
    "m": "Aliento del ciclo naciente",
    "d": "La primera respiración consciente al activarse los ciclos de luz reciclada, agradeciendo el sostenimiento de la vida.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo V: Cánticos del Rhea",
    "p": "v-ae-ha (Inhalación viva)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vael",
    "m": "Vacío potencial",
    "d": "El vacío que no está vacío; plenitud del espacio cargada de potencial.",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "v-a-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vael'nu'Siv",
    "m": "El vacío es energía potencial",
    "d": "Mantra para disipar la claustrofobia y la angustia del abismo cósmico.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "vael-nu-siv",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vael'nu'Siv ·· Vael'Vim",
    "m": "El vacío es energía",
    "d": "Para combatir la depresión del espacio.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-a-e-l-'-n-u-'-s-i-v- -·-·- -v-a-e-l-'-v-i-m",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vaelen",
    "m": "Elevación en el vacío",
    "d": "El instante del tránsito espiritual donde la mente se desprende de la carne sin resistencia.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-ae-le-n (Deslizamiento etéreo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vaelis",
    "m": "Disolución en el silencio",
    "d": "Dejar que el ruido del pensamiento se apague progresivamente hasta fusionarse con el *[[Sistema_Tael'im",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-ae-li-s (Deslizamiento de aire tenue)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vaeril",
    "m": "El despertar del aliento",
    "d": "El instante en que un discípulo comprende por primera vez que el Transversal no comunica cosas, sino que transforma la realidad.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo I: Amnis",
    "p": "v-ae-ri-l (Inhalación de revelación)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vaes",
    "m": "El aliento suspendido",
    "d": "La pequeña pausa entre dos pensamientos donde la mente percibe la vastedad del vacío antes de la siguiente idea.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-a-e-s (Inhalación retenida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vaesun",
    "m": "Soltar la rencilla",
    "d": "La decisión consciente de perdonar una afrenta antigua para no envenenar la red.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-a-e-su-n (Exhalación de soltura)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vahnā",
    "m": "Abrazo en la distancia",
    "d": "La certidumbre de que el vínculo entre dos almas permanece intacto a pesar de las cubiertas o abismos que las separen.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-a-h-n-ā (Exhalación cálida y amplia)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vahnis",
    "m": "Santuario del encuentro",
    "d": "El espacio de refugio emocional creado cuando los seres se reúnen en armonía.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-a-h-ni-s (Exhalación cálida en refugio)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vahra",
    "m": "Honor de la raíz",
    "d": "La dignidad moral que impide a una persona traicionar sus principios sagrados.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-a-hra (Vibración de exhalación firme)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vain",
    "m": "Quietud receptiva",
    "d": "Abrirse al silencio sin expectativas, listo para recibir la resonancia del entorno.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-a-i-n (Inhalación suave y abierta)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Val",
    "m": "Apreciación cotidiana",
    "d": "El casco de la nave o la piel que separa del vacío.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-a-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Val'Thy",
    "m": "Hasta el límite de tu alma",
    "d": "Despedida intensa: compromiso de darlo todo sin retroceder.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "val-thy",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Valee",
    "m": "Alegría espontánea",
    "d": "Sin causa externa.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-a-l-e-e",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vao",
    "m": "Renovación periódica",
    "d": "Renovación periódica",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-a-o",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Var",
    "m": "Unión persistente",
    "d": "A pesar de la distancia.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-a-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vari",
    "m": "Aire conector",
    "d": "Aire conector",
    "c": "Naturaleza y Elementos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-a-r-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Varin",
    "m": "Unión sincera",
    "d": "Encuentro de almas en propósito común.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-a-r-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vator",
    "m": "Válvula de Permiso",
    "d": "Punto donde se decide quién tiene derecho a pasar de un estado a otro.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "v-a-t-o-r",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Vea",
    "m": "Tranquilidad tras adversidad",
    "d": "Tranquilidad tras adversidad",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-e-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vehlaen",
    "m": "El dialecto Transversal",
    "d": "El dialecto Transversal",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-e-h-l-a-e-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vehlu",
    "m": "Sincronía cósmica",
    "d": "Sincronía cósmica",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "v-e-h-l-u",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vei",
    "m": "Proyección de Probabilidad",
    "d": "Actuar sin compromiso de finalidad para observar la reacción del sistema.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "v-e-i",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Vel",
    "m": "Entender sin palabras",
    "d": "Entender sin palabras",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vera",
    "m": "Certeza iluminadora",
    "d": "Certeza iluminadora",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-e-r-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Veyl",
    "m": "Armonía del trazo",
    "d": "La belleza fluida del glifo caligráfico cuando se dibuja con una exhalación pura.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-e-y-l (Fluidez ligera del trazo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vhaer",
    "m": "Vértigo de la eternidad",
    "d": "El estremecimiento celular que produce asomarse a la inmensidad del vacío cósmico sin estrellas.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "vh-a-e-r (Aire soplado contra el paladar)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vheis",
    "m": "El roce de la eternidad",
    "d": "La vivencia momentánea pero imborrable de que la consciencia trasciende el cuerpo biológico y el casco de metal.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "vh-e-i-s (Aliento suspendido en el éter)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Via",
    "m": "Purificación de relación",
    "d": "Purificación de relación",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-i-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vihne",
    "m": "Entendimiento silencioso",
    "d": "Comprender el propósito del sufrimiento lejano sin requerir explicaciones racionales.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-i-h-ne (Susurro de exhalación)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vihra",
    "m": "Resonancia de miradas",
    "d": "La conexión instantánea al cruzar los ojos con quien comparte la misma causa o dolor.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-i-hra (Vibración de mirada)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vil",
    "m": "Fragilidad que fortalece",
    "d": "Fragilidad que fortalece",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-i-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vim",
    "m": "Alegría constante",
    "d": "Fuerza para sobrevivir, pero carente de propósito espiritual.",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-i-m",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vimiel",
    "m": "Dulzura en la austeridad",
    "d": "La gratitud sentida al compartir el escaso nutriente en pasta con una sonrisa de complicidad fraterna.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-i-m-i-e-l (Aliento cálido compartido)",
    "level": "Comunitario"
  },
  {
    "r": "Vimor",
    "m": "Vibración serena",
    "d": "Vibración serena",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-i-m-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vīra",
    "m": "Aliento del amanecer",
    "d": "La fuerza limpia que llena los pulmones al despertar con un propósito claro.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-ī-ra (Aliento fresco renovado)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Virei",
    "m": "Calma tras la angustia",
    "d": "El alivio límpido y fresco que sobreviene tras liberar la pena contenida.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-i-re-i (Fluidez ligera de aire)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Voa",
    "m": "Cambio natural",
    "d": "Cambio natural",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-o-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Voae",
    "m": "Renacer de la voz",
    "d": "El renacer de la capacidad de cantar y crear tras un periodo de silencio.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-o-a-e (Apertura amplia de aliento)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Voen",
    "m": "Templo de la respiración",
    "d": "La certeza silenciosa de que la respiración es la única morada verdadera del espíritu.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-o-e-n (Aliento cálido sostenido)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vohn",
    "m": "Resonancia armónica",
    "d": "Sentir que la propia vibración emocional encaja con la de otro.",
    "c": "Conexiones y Relaciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-o-h-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vohra",
    "m": "Resonancia de la verdad",
    "d": "La vibración inconfundible de la honestidad cuando se habla con el corazón.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-o-hra (Vibración limpia de pecho)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Voira",
    "m": "Mirada a través del mamparo",
    "d": "Capacidad meditativa de contemplar el mar de estrellas con los ojos de la mente, ignorando las paredes de acero.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "v-oi-ra (Proyección etérea)",
    "level": "Sacro Supremo"
  },
  {
    "r": "Voktha",
    "m": "Filtro de Intención",
    "d": "Estructura selectiva que permite el paso de la luz pero detiene la entropía.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "v-o-k-t-h-a",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Vor-Sol'Khor-el",
    "m": "Futuro despertar armonioso",
    "d": "Himno a la esperanza.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "v-o-r---s-o-l-'-k-h-o-r---e-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Voraen",
    "m": "Visión del futuro",
    "d": "El destello de convicción de que la travesía alcanzará un puerto fértil.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-o-ra-e-n (Proyección amplia de aliento)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vorin",
    "m": "Transición forzada",
    "d": "Transición forzada",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "v-o-r-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vra",
    "m": "Flujo de crecimiento",
    "d": "Flujo de crecimiento",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "v-r-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vrae",
    "m": "Extensión Grabadora",
    "d": "Objeto que transfiere la intención del \"Yo\" (Eos) a la materia inerte (Rha).",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "v-r-a-e",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Vuel",
    "m": "Abrazo del origen",
    "d": "Reconocer que la historia de la Cuna no se ha perdido, sino que florece en la travesía.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-u-e-l (Inhalación profunda)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vūel",
    "m": "Inhalación de plenitud",
    "d": "Inhalar con la certeza de hallarse en completa armonía con el cosmos.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-ū-e-l (Inhalación plena de aire)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vurin",
    "m": "Abismo reflexivo",
    "d": "Abismo reflexivo",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "v-u-r-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Vyr",
    "m": "Impulso de control",
    "d": "La voluntad que busca encasillar.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "v-y-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Yod",
    "m": "Abismo social",
    "d": "La distancia infranqueable entre estratos.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "y-o-d",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Yohā",
    "m": "Renacer de la esperanza",
    "d": "La exhalación profunda tras superar una crisis de la fe o un colapso del alma.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "y-o-h-ā (Aliento amplio que renace)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Yohai",
    "m": "Metamorfosis radical",
    "d": "Metamorfosis radical",
    "c": "Transformaciones y Ciclos",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "y-o-h-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Yottu",
    "m": "Horizonte interno",
    "d": "Horizonte interno",
    "c": "Dinámicas del Cosmos",
    "tomo": "Tomo VII: Los Nueve Vórtices",
    "p": "y-o-t-t-u",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zael",
    "m": "Velo de misterio",
    "d": "La aceptación serena de que hay secretos del cosmos que trascienden la razón humana.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-a-e-l (Siseo etéreo que se disuelve)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zaen",
    "m": "Fractura del ego",
    "d": "La disolución momentánea de la frontera entre el \"yo\" (*Eos*) y el cosmos; observarse desde fuera sin juzgar.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-a-e-n (Siseo suave que se disuelve)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zaenā",
    "m": "Aceptación de la fragilidad",
    "d": "Abrazar la vulnerabilidad propia como parte natural de la travesía del alma.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-a-e-n-ā (Siseo amplio sostenido)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zaenis",
    "m": "Disolución de fronteras",
    "d": "Sentir que no hay separación entre el ser, la comunidad y el universo.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-a-e-ni-s (Siseo etéreo de unión)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zaer",
    "m": "Pureza de intención",
    "d": "Actuar sin engaño ni desconfianza, buscando únicamente el bien del colectivo.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-a-e-r (Siseo limpio sin doblez)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zaora",
    "m": "Calma crepuscular",
    "d": "La serenidad que sobreviene al aceptar el paso inevitable de las generaciones en la nave.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-a-o-ra (Brisa suave descendente)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zelai",
    "m": "Alegría inocente en la penumbra",
    "d": "La risa pura que florece espontáneamente en medio de la estrechez de las cubiertas de trabajo.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo V: Cánticos del Rhea",
    "p": "z-e-l-ai (Chispa de luz saltarina)",
    "level": "Comunitario"
  },
  {
    "r": "Zentha",
    "m": "Matriz de Memoria",
    "d": "Estructura física que libera a la mente de la carga de recordar.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo II: Matriz del Aliento",
    "p": "z-e-n-t-h-a",
    "level": "Nivel Técnico / Veyvān"
  },
  {
    "r": "Zia",
    "m": "Rayo de esperanza",
    "d": "Una pequeña chispa de luz espiritual que cruza y disipa la penumbra del alma.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-i-a (Chispa de siseo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zil",
    "m": "Chispa de felicidad",
    "d": "Chispa de felicidad",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "z-i-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zin",
    "m": "Eco emocional",
    "d": "Eco emocional",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "z-i-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Ziren",
    "m": "Gozo austero del ser",
    "d": "Felicidad que no requiere estímulo sensorial externo, emanada directamente del equilibrio interior y la sobriedad.",
    "c": "Emociones y Estados Internos",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-i-re-n (Siseo alegre continuo)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zōen",
    "m": "Reverencia por la vida",
    "d": "La contemplación sagrada del aliento en cualquier ser, por humilde que sea.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-ō-e-n (Resonancia de siseo sagrado)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zor",
    "m": "Conciencia ampliada",
    "d": "Conciencia ampliada",
    "c": "Sensaciones y Percepciones",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "z-o-r",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zūel",
    "m": "Trazo de la mente",
    "d": "El flujo continuo de la pluma que refleja la calma interior del escriba.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-ū-e-l (Movimiento ininterrumpido)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zul",
    "m": "Horizonte inalcanzable",
    "d": "La dirección hacia Protozeus.",
    "c": "Sombras, Crisis y Entorno",
    "tomo": "Tomo VI: Sombra Blanca",
    "p": "z-u-l",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zul-Nai",
    "m": "Confía en el horizonte",
    "d": "Despedida estándar entre navegantes y habitantes de la Estación.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "zul-nai",
    "level": "Comunitario"
  },
  {
    "r": "Zunai",
    "m": "Fuerza interior",
    "d": "Resiliencia sutil (antes Valoria).",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-u-n-a-i",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zunth",
    "m": "Fuerza enraizada en el suelo",
    "d": "Perseverancia silenciosa de quien resiste en las cubiertas más bajas sin elevar quejas ni retroceder un paso.",
    "c": "Impulsos, Acción y Tiempo",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "z-u-n-th (Cierre firme)",
    "level": "Comunitario"
  },
  {
    "r": "Zura",
    "m": "Desprendimiento sereno",
    "d": "Soltar el apego a un recuerdo, a una etapa o a una persona sin rencor, dejando que el flujo continúe.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-u-ra (Brisa suave que pasa)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zūva",
    "m": "Disolución de la culpa",
    "d": "Soltar el remordimiento tras haber enmendado la acción ante la comunidad.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-ū-va (Siseo suave que disuelve)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zyra",
    "m": "Acto de soltar",
    "d": "Soltar lo antiguo para permitir lo nuevo.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-y-r-a",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zyra'Shor-un",
    "m": "Final doloroso de la nostalgia",
    "d": "Aceptar la Estación como hogar.",
    "c": "Frases y Proverbios",
    "tomo": "Tomo III: Vocabularium Rha",
    "p": "z-y-r-a-'-s-h-o-r---u-n",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zyraen",
    "m": "Ofrenda del ser",
    "d": "El acto de dedicar los propios talentos y pensamientos al bien de la comunidad.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-y-ra-e-n (Soltura generosa)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zyren",
    "m": "El aliento de partida",
    "d": "El rito de liberar la última respiración en paz durante la gran reintegración al *Rhea*.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-y-re-n (Exhalación final serena)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zyria",
    "m": "Soltar la queja",
    "d": "Acallar la protesta estéril y canalizar la energía hacia la acción sanadora.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-y-ri-a (Soltura fluida)",
    "level": "Iniciado Veyvān"
  },
  {
    "r": "Zyro",
    "m": "Soltura suprema",
    "d": "El acto final de desapego absoluto donde el alma se funde en la paz del infinito.",
    "c": "Estados Abstractos y Consciencia",
    "tomo": "Tomo IV: Códice de la Consciencia",
    "p": "z-y-ro (Soltura final de aliento)",
    "level": "Iniciado Veyvān"
  }
];

export const initialData: Term[] = rawTerms.map((t, index) => ({
  id: `canon-${index + 1}`,
  root: t.r,
  meaning: t.m,
  description: t.d || t.m,
  category: t.c,
  tonality: guessTonality(t.m, t.d || "", t.c),
  syllables: countSyllables(t.r),
  tomo: t.tomo,
  phonetics: t.p,
  level: t.level,
  addedAt: new Date().toISOString()
}));
