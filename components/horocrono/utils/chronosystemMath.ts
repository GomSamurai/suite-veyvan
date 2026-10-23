import { CircadianPhase, ChronosTime, EarthTime, AgeCalculationResult } from '../types/chronos';

// Exact canonical constants
export const SECONDS_PER_VIRA = 0.6591796875; // 172800 / 262144
export const VIRAS_PER_FULA = 64; // 2^6
export const FULAS_PER_KROMA = 32; // 2^5
export const KROMAS_PER_SEMA = 16; // 2^4
export const SEMAS_PER_TALA = 8; // 2^3
export const TALAS_PER_NEMA = 16; // 2^4
export const NEMAS_PER_KORA = 32; // 2^5
export const KORAS_PER_ERA = 64; // 2^6

export const VIRAS_PER_KROMA = VIRAS_PER_FULA * FULAS_PER_KROMA; // 2,048
export const VIRAS_PER_SEMA = VIRAS_PER_KROMA * KROMAS_PER_SEMA; // 32,768
export const VIRAS_PER_TALA = VIRAS_PER_SEMA * SEMAS_PER_TALA; // 262,144 (2^18)
export const VIRAS_PER_NEMA = VIRAS_PER_TALA * TALAS_PER_NEMA; // 4,194,304 (2^22)
export const VIRAS_PER_KORA = VIRAS_PER_NEMA * NEMAS_PER_KORA; // 134,217,728 (2^27)
export const VIRAS_PER_ERA = VIRAS_PER_KORA * KORAS_PER_ERA; // 8,589,934,592 (2^33)

export const SECONDS_PER_FULA = VIRAS_PER_FULA * SECONDS_PER_VIRA; // 42.1875 s
export const SECONDS_PER_KROMA = VIRAS_PER_KROMA * SECONDS_PER_VIRA; // 1,350 s (22.5 min)
export const SECONDS_PER_SEMA = VIRAS_PER_SEMA * SECONDS_PER_VIRA; // 21,600 s (6 hours)
export const SECONDS_PER_TALA = VIRAS_PER_TALA * SECONDS_PER_VIRA; // 172,800 s (48 hours)
export const SECONDS_PER_NEMA = VIRAS_PER_NEMA * SECONDS_PER_VIRA; // 2,764,800 s (32 days)

// Millisecond constants for organic sub-second Vira rhythm
export const MS_PER_VIRA = 659.1796875; // 172,800,000 ms / 262,144 viras (exact pulse)
export const MS_PER_FULA = MS_PER_VIRA * VIRAS_PER_FULA; // 42,187.5 ms
export const MS_PER_KROMA = MS_PER_VIRA * VIRAS_PER_KROMA; // 1,350,000 ms (22.5 min)
export const MS_PER_SEMA = MS_PER_VIRA * VIRAS_PER_SEMA; // 21,600,000 ms (6 hours)
export const MS_PER_TALA = MS_PER_VIRA * VIRAS_PER_TALA; // 172,800,000 ms (48 hours)

// Definition of the 4 circadian phases
export const CIRCADIAN_PHASES: Record<string, CircadianPhase> = {
  vigilia_primaria: {
    id: 'vigilia_primaria',
    name: 'Vigilia Primaria',
    subname: 'Producción Crítica & Cenit de Rendimiento',
    semas: [1, 2],
    colorTemp: '5500K',
    colorHex: '#38BDF8',
    glowClass: 'shadow-[0_0_25px_rgba(56,189,248,0.35)] border-sky-400',
    intensityPercent: 100,
    description: 'Amanecer artificial y cenit biológico. Máxima actividad en reactores, laboratorios y factorías.',
    functionText: 'Producción Crítica · Sin pausas de comida formales · Micro-descanso 1 Kr (22 min)',
    lightStatus: 'Luz Blanca Fría Espectral (5500K)'
  },
  interludio_personal: {
    id: 'interludio_personal',
    name: 'Interludio Personal',
    subname: 'Transición Social & Doméstica',
    semas: [3],
    colorTemp: '3000K',
    colorHex: '#FBBF24',
    glowClass: 'shadow-[0_0_25px_rgba(251,191,36,0.35)] border-amber-400',
    intensityPercent: 70,
    description: 'El puente armónico del ciclo Tala. Trueque en cubiertas intermedias y banquetes en el Émulo.',
    functionText: 'Gestión Social · Escolarización · Ración Compartida · Trámites de Módulo',
    lightStatus: 'Luz Cálida de Ocaso Dorado (3000K)'
  },
  vigilia_secundaria: {
    id: 'vigilia_secundaria',
    name: 'Vigilia Secundaria',
    subname: 'Mantenimiento Técnico & Cierre Operativo',
    semas: [4, 5],
    colorTemp: '4000K',
    colorHex: '#A78BFA',
    glowClass: 'shadow-[0_0_25px_rgba(167,139,250,0.35)] border-violet-400',
    intensityPercent: 85,
    description: 'Segundo impulso productivo. Logística de transporte, depuración de filtros y guardias técnicas.',
    functionText: 'Mantenimiento · Logística · Consumo de estimulantes en puestos de riesgo',
    lightStatus: 'Luz Neutra de Enfoque Espectral (4000K)'
  },
  induccion_reposo: {
    id: 'induccion_reposo',
    name: 'Inducción al Reposo',
    subname: 'Preparación de Silencio & Descompresión',
    semas: [6],
    colorTemp: '2200K',
    colorHex: '#F97316',
    glowClass: 'shadow-[0_0_25px_rgba(249,115,22,0.35)] border-orange-500',
    intensityPercent: 30,
    description: 'Declive lumínico. En Kroma 8 ocurre el silenciamiento de recalibración de soporte vital.',
    functionText: 'Higiene · Cena Ligera · Silencio de cubierta · Advertencia de Kroma 8',
    lightStatus: 'Luz Ámbar Tenue Crepuscular (2200K)'
  },
  letargo_profundo: {
    id: 'letargo_profundo',
    name: 'Ciclo de Letargo',
    subname: 'Apagón Nocturno & Hibernación Corta',
    semas: [7, 8],
    colorTemp: '0K (Mínimo)',
    colorHex: '#4338CA',
    glowClass: 'shadow-[0_0_25px_rgba(67,56,202,0.35)] border-indigo-500',
    intensityPercent: 5,
    description: 'Apagón oficial de 12 horas. Descanso reparador tras el ciclo de vigilia extendida de 30 horas.',
    functionText: 'Sueño Profundo REM 1 y REM 2 · Silencio de comunicaciones · Luces rojas de emergencia',
    lightStatus: 'Oscuridad Progresiva a Total (5% Reserva)'
  }
};

/**
 * Returns the corresponding circadian phase for a given Sema (1-8).
 */
export function getCircadianPhase(sema: number): CircadianPhase {
  if (sema === 1 || sema === 2) return CIRCADIAN_PHASES.vigilia_primaria;
  if (sema === 3) return CIRCADIAN_PHASES.interludio_personal;
  if (sema === 4 || sema === 5) return CIRCADIAN_PHASES.vigilia_secundaria;
  if (sema === 6) return CIRCADIAN_PHASES.induccion_reposo;
  return CIRCADIAN_PHASES.letargo_profundo;
}

/**
 * Calculates current ChronosTime from a date or timestamp.
 * Sincronía estándar: 48 horas continuas divididas exactamente en potencias de 2.
 */
export function calculateChronosTime(date: Date = new Date(), epochOffsetSeconds: number = 0): ChronosTime {
  const timestampMs = date.getTime();
  // Continuous milliseconds incorporating any epoch offset
  const continuousMs = timestampMs + (epochOffsetSeconds * 1000);
  
  // Continuous Viras since epoch: 1 Vira = 659.1796875 ms exactly
  const totalContinuousViras = continuousMs / MS_PER_VIRA;
  
  // Tala cycle: Exactly 262,144 Viras per Tala (48 hours)
  const virasInTalaContinuous = ((totalContinuousViras % VIRAS_PER_TALA) + VIRAS_PER_TALA) % VIRAS_PER_TALA;
  const totalVirasInTala = Math.floor(virasInTalaContinuous);
  const fractionVira = virasInTalaContinuous - totalVirasInTala;
  const viraProgress = fractionVira; // 0.00 to 1.00 progression through current Vira
  const viraMsRemaining = Math.max(0, (1 - fractionVira) * MS_PER_VIRA);
  
  // Continuous elapsed seconds within the 48h Tala
  const secInTala = virasInTalaContinuous * SECONDS_PER_VIRA;
  const progressInTala = virasInTalaContinuous / VIRAS_PER_TALA;
  
  // Tala elapsed formatted (00h:00m:00s to 47h:59m:59s)
  const talaHours = Math.floor(secInTala / 3600);
  const talaMinutes = Math.floor((secInTala % 3600) / 60);
  const talaSeconds = Math.floor(secInTala % 60);
  const talaElapsedFormatted = `${String(talaHours).padStart(2, '0')}:${String(talaMinutes).padStart(2, '0')}:${String(talaSeconds).padStart(2, '0')} / 48:00:00`;

  // Macro calendar calculation (Anchor year 344 post-Exodus default)
  // 1 Tala index increments every 262,144 Viras (48 hours)
  const totalTalasSinceEpoch = Math.floor(totalContinuousViras / VIRAS_PER_TALA);
  const talaIndex = ((totalTalasSinceEpoch % TALAS_PER_NEMA) + TALAS_PER_NEMA) % TALAS_PER_NEMA;
  const totalNemas = Math.floor(totalTalasSinceEpoch / TALAS_PER_NEMA);
  const nemaIndex = ((totalNemas % NEMAS_PER_KORA) + NEMAS_PER_KORA) % NEMAS_PER_KORA;
  const totalKoras = Math.floor(totalNemas / NEMAS_PER_KORA);
  const koraIndex = ((totalKoras % KORAS_PER_ERA) + KORAS_PER_ERA) % KORAS_PER_ERA;
  const eraIndex = Math.max(1, Math.floor(totalKoras / KORAS_PER_ERA) + 1);

  // Micro time directly in binary units:
  // Sema: 1 to 8 (each Sema is 32,768 Viras = 6 hours)
  const semaIndexZero = Math.floor(totalVirasInTala / VIRAS_PER_SEMA);
  const sema = semaIndexZero + 1; // 1-8
  const virasInSema = totalVirasInTala % VIRAS_PER_SEMA;
  const semaProgress = (virasInSema + fractionVira) / VIRAS_PER_SEMA;

  // Kroma: 0 to 15 within Sema (each Kroma is 2,048 Viras = 22.5 min)
  const kroma = Math.floor(virasInSema / VIRAS_PER_KROMA);
  const globalKroma = Math.floor(totalVirasInTala / VIRAS_PER_KROMA); // 0 to 127 in Tala
  const virasInKroma = virasInSema % VIRAS_PER_KROMA;

  // Fula: 0 to 31 within Kroma (each Fula is 64 Viras = 42.1875 s)
  const fula = Math.floor(virasInKroma / VIRAS_PER_FULA);
  const vira = virasInKroma % VIRAS_PER_FULA; // 0 to 63 (advances every 0.65918 seconds organically!)

  // Circadian phase
  const phase = getCircadianPhase(sema);

  // Kroma 8 check: precisely Sema 6, Kroma 8
  const isKroma8Active = (sema === 6 && kroma === 8);

  // Countdown to next Kroma 8:
  // Kroma 8 starts in Sema 6 at viras: (5 * 32,768) + (8 * 2,048) = 163,840 + 16,384 = 180,224 Viras
  const targetKroma8Viras = (5 * VIRAS_PER_SEMA) + (8 * VIRAS_PER_KROMA);
  let kroma8CountdownViras = targetKroma8Viras - totalVirasInTala;
  if (kroma8CountdownViras < 0) {
    kroma8CountdownViras += VIRAS_PER_TALA;
  }
  const kroma8CountdownSeconds = Math.round(kroma8CountdownViras * SECONDS_PER_VIRA);

  // Display code: "Ta-XX · S-0X:Kr-XX:Fu-XX:Vi-XX"
  const displayCode = `Ta-${String(talaIndex).padStart(2, '0')} · S-0${sema}:Kr-${String(kroma).padStart(2, '0')}:Fu-${String(fula).padStart(2, '0')}:Vi-${String(vira).padStart(2, '0')}`;

  // Binary Register: 18 bits (262,144 states)
  const binaryRegister = totalVirasInTala.toString(2).padStart(18, '0');

  return {
    totalSecondsInTala: secInTala,
    progressInTala,
    talaElapsedFormatted,
    sema,
    semaProgress,
    kroma,
    globalKroma,
    fula,
    vira,
    fractionVira,
    viraProgress,
    viraMsRemaining,
    totalVirasInTala,
    talaIndex,
    nemaIndex,
    koraIndex,
    eraIndex,
    displayCode,
    binaryRegister,
    phase,
    isKroma8Active,
    kroma8CountdownViras,
    kroma8CountdownSeconds
  };
}

/**
 * Calculates current Earth time formatted in Spanish.
 */
export function calculateEarthTime(date: Date = new Date()): EarthTime {
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayName = daysOfWeek[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const timeFormatted24 = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const timeFormatted12 = `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const dateFormatted = `${dayName}, ${dayNum} de ${monthName} de ${year}`;

  return {
    date,
    dateFormatted,
    timeFormatted24,
    timeFormatted12,
    timezone
  };
}

/**
 * Formats a quantity of Viras into a readable string: "X Kr, Y Fu, Z Vi"
 */
export function formatVirasDecomposed(totalViras: number): string {
  const virasInt = Math.floor(totalViras);
  const kromas = Math.floor(virasInt / VIRAS_PER_KROMA);
  const remainingAfterKr = virasInt % VIRAS_PER_KROMA;
  const fulas = Math.floor(remainingAfterKr / VIRAS_PER_FULA);
  const viras = remainingAfterKr % VIRAS_PER_FULA;

  if (kromas > 0) {
    return `${kromas} Kr · ${String(fulas).padStart(2, '0')} Fu · ${String(viras).padStart(2, '0')} Vi`;
  }
  if (fulas > 0) {
    return `${fulas} Fu · ${String(viras).padStart(2, '0')} Vi`;
  }
  return `${viras} Vi`;
}

/**
 * Canonical Shift Presets for Station Life.
 */
export const SHIFT_PRESETS = [
  {
    id: 'p-1fu',
    label: '1 Fula',
    fulas: 1,
    kromas: 0,
    totalViras: 64,
    earthSeconds: 42.19,
    description: 'Chequeo rápido de esclusa / Recalibración de filtro',
    category: 'seguridad' as const
  },
  {
    id: 'p-5fu',
    label: '5 Fulas',
    fulas: 5,
    kromas: 0,
    totalViras: 320,
    earthSeconds: 210.94, // 3.5 min
    description: 'Ciclo estándar de purga atmosférica de sección',
    category: 'operativo' as const
  },
  {
    id: 'p-1kr',
    label: '1 Kroma',
    fulas: 32,
    kromas: 1,
    totalViras: 2048,
    earthSeconds: 1350, // 22.5 min
    description: 'Turno de guardia elemental / Siesta de inducción rápida',
    category: 'descanso' as const
  },
  {
    id: 'p-2kr',
    label: '2 Kromas',
    fulas: 64,
    kromas: 2,
    totalViras: 4096,
    earthSeconds: 2700, // 45 min
    description: 'Módulo de patrulla de cubierta / Instrucción técnica',
    category: 'operativo' as const
  },
  {
    id: 'p-4kr',
    label: '4 Kromas',
    fulas: 128,
    kromas: 4,
    totalViras: 8192,
    earthSeconds: 5400, // 1.5 horas
    description: 'Guardia técnica intermedia en subestación de energía',
    category: 'operativo' as const
  },
  {
    id: 'p-1se',
    label: '1 Sema',
    fulas: 512,
    kromas: 16,
    totalViras: 32768,
    earthSeconds: 21600, // 6 horas
    description: 'Cuarto de guardia laboral completo (S-01 a S-08)',
    category: 'operativo' as const
  }
];

/**
 * Calculates biological age in Nemas, Koras, Eras and station demographics.
 */
export function calculateStationAge(birthDate: Date, targetDate: Date = new Date()): AgeCalculationResult {
  const diffMs = targetDate.getTime() - birthDate.getTime();
  const earthDaysLived = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
  const earthYearsLived = earthDaysLived / 365.25;

  const totalEarthSeconds = diffMs / 1000;
  const totalVirasLived = Math.floor(totalEarthSeconds / SECONDS_PER_VIRA);
  
  // 1 Nema = 32 Earth days = 16 Talas
  const nemasDecimal = earthDaysLived / 32;
  const nemasLived = Math.floor(nemasDecimal);
  const talasLived = Math.floor(earthDaysLived / 2);
  const korasLived = Math.floor(nemasLived / NEMAS_PER_KORA);
  const erasLived = Math.floor(korasLived / KORAS_PER_ERA);

  const daysIntoCurrentNema = earthDaysLived % 32;
  const nextNemaDaysRemaining = Math.max(0, 32 - daysIntoCurrentNema);

  // Sleep cycles adapted to 48h Tala (14h sleep per Tala)
  const sleepCyclesTala = talasLived;

  // Deck demographic statistics
  const deckLifeStats = [
    {
      deckTier: 'Cubiertas Altas (Niveles 1-50)',
      levelName: 'Émulo & Sector Gubernamental',
      averageLifespanNemas: 950, // ~83 años terrestres
      userSurvivalPercent: Math.min(100, Math.round((nemasLived / 950) * 100)),
      hazardIndex: 'Bajo (0.05)',
      loreNote: 'Simulación solar activa, biomas sintéticos con flora natural, filtros médicos de plasma.'
    },
    {
      deckTier: 'Cubiertas Medias (Niveles 51-200)',
      levelName: 'Área Industrial, Académica & Docks',
      averageLifespanNemas: 720, // ~63 años terrestres
      userSurvivalPercent: Math.min(100, Math.round((nemasLived / 720) * 100)),
      hazardIndex: 'Moderado (0.35)',
      loreNote: 'Luz espectral artificial estricta, dieta de pasta nutritiva balanceada y turnos de 2 Semas.'
    },
    {
      deckTier: 'Cubiertas Bajas (Niveles 201-300)',
      levelName: 'Sector Residencial Denso & Reciclaje',
      averageLifespanNemas: 580, // ~51 años terrestres
      userSurvivalPercent: Math.min(100, Math.round((nemasLived / 580) * 100)),
      hazardIndex: 'Elevado (0.65)',
      loreNote: 'Microcortes de energía, agua racionada con regusto metálico, polvo bioplástico en suspensión.'
    },
    {
      deckTier: 'Cubiertas Polares (Niveles 301-320)',
      levelName: 'El Infierno (Periferia Criogénica)',
      averageLifespanNemas: 410, // ~36 años terrestres
      userSurvivalPercent: Math.min(100, Math.round((nemasLived / 410) * 100)),
      hazardIndex: 'Crítico (0.95)',
      loreNote: 'Sin semas de luz regulares, medición en ciclos de raciones y temperaturas de escarcha perenne.'
    }
  ];

  return {
    birthDate,
    earthDaysLived: Math.round(earthDaysLived),
    earthYearsLived: parseFloat(earthYearsLived.toFixed(1)),
    totalVirasLived,
    talasLived,
    nemasLived,
    nemasDecimal: parseFloat(nemasDecimal.toFixed(2)),
    korasLived,
    erasLived,
    nextNemaDaysRemaining: parseFloat(nextNemaDaysRemaining.toFixed(1)),
    sleepCyclesTala,
    deckLifeStats
  };
}
