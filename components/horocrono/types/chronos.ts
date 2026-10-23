export interface CircadianPhase {
  id: string;
  name: string;
  subname: string;
  semas: number[];
  colorTemp: string;
  colorHex: string;
  glowClass: string;
  intensityPercent: number;
  description: string;
  functionText: string;
  lightStatus: string;
}

export interface ChronosTime {
  totalSecondsInTala: number;
  progressInTala: number; // 0 to 1
  talaElapsedFormatted: string; // "31:45:12 / 48:00:00"
  sema: number; // 1 to 8
  semaProgress: number; // 0 to 1
  kroma: number; // 0 to 15 within Sema
  globalKroma: number; // 0 to 127 within Tala
  fula: number; // 0 to 31 within Kroma
  vira: number; // 0 to 63 within Fula
  fractionVira: number;
  viraProgress: number; // 0 to 1 through current Vira
  viraMsRemaining: number; // ms until next Vira tick
  totalVirasInTala: number;
  talaIndex: number;
  nemaIndex: number;
  koraIndex: number;
  eraIndex: number;
  displayCode: string; // e.g. "Ta-048 · S-06:Kr-08:Fu-12:Vi-40"
  binaryRegister: string; // 18-bit binary representation of current Tala position
  phase: CircadianPhase;
  isKroma8Active: boolean; // Exactly Sema 6, Kroma 8
  kroma8CountdownViras: number; // viras until next Kroma 8
  kroma8CountdownSeconds: number;
}

export interface EarthTime {
  date: Date;
  dateFormatted: string; // "Jueves, 22 de Octubre de 2026"
  timeFormatted24: string; // "16:21:04"
  timeFormatted12: string; // "04:21:04 PM"
  timezone: string;
}

export interface LapRecord {
  id: string;
  lapNumber: number;
  lapViras: number;
  totalViras: number;
  lapFormatted: string;
  totalFormatted: string;
  earthSecondsLap: number;
  earthSecondsTotal: number;
}

export interface ShiftPreset {
  id: string;
  label: string;
  fulas: number;
  kromas: number;
  totalViras: number;
  earthSeconds: number;
  nameTransversal?: string;
  description: string;
  category: 'operativo' | 'descanso' | 'seguridad';
}

export interface AgeCalculationResult {
  birthDate: Date;
  earthDaysLived: number;
  earthYearsLived: number;
  totalVirasLived: number;
  talasLived: number;
  nemasLived: number; // 1 Nema = 16 Talas = 32 Earth days
  nemasDecimal: number;
  korasLived: number; // 1 Kora = 32 Nemas = 1024 Earth days (~2.8 Earth years)
  erasLived: number;
  nextNemaDaysRemaining: number;
  sleepCyclesTala: number;
  deckLifeStats: {
    deckTier: string;
    levelName: string;
    averageLifespanNemas: number;
    userSurvivalPercent: number;
    hazardIndex: string;
    loreNote: string;
  }[];
}
