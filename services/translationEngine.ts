import { initialData } from '../data/initialData';
import { MorphemeToken, TranslationResult } from '../types';
import { getAiClient, getGeminiModel } from './geminiService';
import { MASTER_CONSTRUCCION_PROMPT, CANONICAL_DOCUMENTS_SYNCED } from '../data/canonicalLoreConstruccion';

// Canonical Prefixes, Infixes, Suffixes, Particles & Pronouns
export const TIME_PREFIXES: Record<string, { label: string; meaning: string }> = {
  nu: { label: 'nu-', meaning: 'Presente (aquí y ahora, vivencia inmediata)' },
  min: { label: 'min-', meaning: 'Pasado (memoria, lo que ya resonó)' },
  vor: { label: 'vor-', meaning: 'Futuro (proyección, potencialidad venidera)' },
  sha: { label: 'sha-', meaning: 'Potencial (duda, posibilidad latente)' },
  kro: { label: 'kro-', meaning: 'Eterno (tiempo cósmico, ciclo inmutable)' }
};

export const EVIDENCE_INFIXES: Record<string, { label: string; meaning: string }> = {
  ka: { label: 'ka-', meaning: 'Sensorial (lo sé porque lo siento en la piel o el alma)' },
  vo: { label: 'vo-', meaning: 'Empírico (lo sé porque es observable objetivamente)' },
  te: { label: 'te-', meaning: 'Deductivo (lo sé por deducción lógica/racional)' },
  ri: { label: 'ri-', meaning: 'Testimonial (lo sé por memoria comunitaria transmitida)' }
};

export const ASPECT_SUFFIXES: Record<string, { label: string; meaning: string }> = {
  aen: { label: '-aen', meaning: 'Continuo (en desarrollo constante sin freno)' },
  re: { label: '-re', meaning: 'Habitual (acción repetida o ritual cíclico)' },
  in: { label: '-in', meaning: 'Incoativo (inicio o nacimiento del acto)' },
  el: { label: '-el', meaning: 'Completivo (cierre armónico, pleno y consumado)' },
  un: { label: '-un', meaning: 'Interruptivo (ruptura abrupta o fracaso)' },
  nil: { label: '-nil', meaning: 'Negación de hecho (no ocurrió / vacío fáctico)' }
};

export const RELATIONAL_PARTICLES: Record<string, { label: string; meaning: string }> = {
  na: { label: "'na", meaning: 'En / Dentro de (Inesivo)' },
  vi: { label: "'vi", meaning: 'Con / A través de (Instrumental)' },
  zo: { label: "'zo", meaning: 'Hacia / Dirección (Direccional)' },
  da: { label: "'da", meaning: 'Desde / Origen (Ablativo)' }
};

export const PRONOUNS_ALGANTE: Record<string, { label: string; meaning: string }> = {
  eos: { label: 'Eos', meaning: 'El "Yo" Soberano (autoridad, verdad que rige el cosmos)' },
  lir: { label: 'Lir', meaning: 'El "Yo" Poético y vulnerable (arte, amor abierto)' },
  vas: { label: 'Vas', meaning: 'El "Yo" Servidor/Recipiente (almas de la multitud, Alévoros)' },
  omi: { label: 'O-Mi', meaning: 'El "Yo" Observador/Testigo imparcial (sabios)' },
  vai: { label: 'Vai', meaning: 'El "Tú" Espejo e igual (nobleza entre pares)' },
  ael: { label: 'Ael', meaning: 'El "Tú" Elevado / Maestro (autoridad admirada)' },
  tirha: { label: 'Ti-Rha', meaning: 'El "Tú" de la Raíz / Inferior material' },
  sivti: { label: 'Siv-Ti', meaning: 'El "Tú" en el Silencio / El enemigo anulado' },
  vahn: { label: 'Vahn', meaning: 'Nosotros Áureo (unidos en propósito sagrado)' },
  nus: { label: 'Nus', meaning: 'Nosotros Exclusivo (mi grupo frente a ti)' },
  khorim: { label: 'Khor-im', meaning: 'Nosotros la Red (la comunidad consciente)' }
};

// Map of canonical roots for fast lookup
export const ROOT_MAP = new Map(initialData.map(t => [t.root.toLowerCase(), t]));

// Compact dictionary summary for AI prompt context
const COMPACT_ROOTS_SUMMARY = initialData.slice(0, 150).map(t => `${t.root} (${t.meaning})`).join(', ');

// Canonical famous compositions and proverbs (Estación Humanidad Canon)
export const CANONICAL_PROVERBS: Array<{
  keywords: string[];
  transversalText: string;
  literalSpanish: string;
  poeticSpanish: string;
  philosophicalNote: string;
  sociolectAlgante: string;
  sociolectOxidado: string;
  compactTransversal: string;
  compactPoetic: string;
  compactLiteral: string;
}> = [
  {
    keywords: ['frenesí', 'respeto', 'amor', 'falta', 'thima', 'varin'],
    transversalText: "Thima · Varin'Vim ·· Vor'aen · Nu-Dar",
    literalSpanish: "Atención plena / cuidado (Thima) · [del] frenesí del amor biológico (Varin'Vim) ·· lleva continuamente (Vor'aen) · [hacia] la invasión / falta de distancia sagrada (Nu-Dar).",
    poeticSpanish: "«Cuidado con el frenesí del amor, pues a menudo devora la distancia sagrada y engendra la falta de respeto.»",
    philosophicalNote: "Para los Veyvān, el amor desmedido como pura energía vital (Vim) borra la individualidad sagrada (Dar). Quien ama sin mesura destruye el espacio inviolable del otro.",
    sociolectAlgante: "Aeth-Thima lir'Varin'Vim, ael vor'aen na nu-daril.",
    sociolectOxidado: "Ojo con la quema del apego: el que se ciega de celo te mea el pacto.",
    compactTransversal: "Thim'Varin ·· Nu-Dar",
    compactPoetic: "«Ama con vigilia: el frenesí ciego arrasa la distancia sagrada.»",
    compactLiteral: "Thim'Varin (atención en el amor) ·· Nu-Dar (sin invadir la separación sagrada)."
  },
  {
    keywords: ['coraza', 'aliento', 'dura', 'vacía', 'alval'],
    transversalText: "Al'Val'Sha-Tev",
    literalSpanish: "Exceso de límite rígido (Al'Val) · vacío interior de aliento (Sha-Tev).",
    poeticSpanish: "«Mucha coraza, poco aliento; hombres de titanio por fuera, huecos de alma en su núcleo.»",
    philosophicalNote: "Aforismo crítico contra quienes erigen defensas herméticas ante el abismo pero carecen de vida espiritual para sostener el peso del cosmos.",
    sociolectAlgante: "Al'Val'Sha-Tev lir'eos.",
    sociolectOxidado: "Puro blindaje y ni un soplo adentro.",
    compactTransversal: "Al'Val-Tev",
    compactPoetic: "«Blindaje de titanio, aliento vacío.»",
    compactLiteral: "Al'Val (exceso de coraza) - Tev (carente de aliento interior)."
  },
  {
    keywords: ['fricción', 'evolución', 'dolor', 'dran', 'kael'],
    transversalText: "Dran'Vor'Kael",
    literalSpanish: "Fricción / conflicto (Dran) · proyecta hacia el futuro (Vor) · despertar evolutivo (Kael).",
    poeticSpanish: "«La fricción antecede a la evolución; ningún alma despierta sin el roce doloroso del abismo.»",
    philosophicalNote: "Principio rector de los 344 años de éxodo interestelar: la nave no avanza sin desgarro, y la consciencia no madura sin tensión.",
    sociolectAlgante: "Dran'Vor'Kael na'Vahn.",
    sociolectOxidado: "Sin raspadura no hay salto.",
    compactTransversal: "Dran'Kael",
    compactPoetic: "«La fricción despierta.»",
    compactLiteral: "Dran (fricción/tensión) · Kael (salto evolutivo de consciencia)."
  },
  {
    keywords: ['penuria', 'silencio', 'sufrir', 'rhaen', 'khol'],
    transversalText: "Min'ka'Rhaen · Khol'im · Vas'or",
    literalSpanish: "En el pasado sentido en la piel (Min'ka'Rhaen) · [encontró] la unión nacida del dolor (Khol'im) · [entre] los humildes recipientes de vida (Vas'or).",
    poeticSpanish: "«En el silencio de la penuria, las almas sencillas hallaron la profunda unión que nace de sufrir juntos.»",
    philosophicalNote: "Resonancia de las cubiertas bajas periféricas: la escasez extrema unificó los corazones donde el Émulo solo sembró ego.",
    sociolectAlgante: "Min'ka'Rhaen khol'im na vas'ael.",
    sociolectOxidado: "Dolor juntos, cuerda que no rompe.",
    compactTransversal: "Rhaen'Khol",
    compactPoetic: "«El dolor compartido crea hermandad indestructible.»",
    compactLiteral: "Rhaen (vínculo de ceniza) · Khol (fricción del espíritu)."
  },
  {
    keywords: ['perdón', 'rencor', 'alquimia', 'vaesun', 'rhia'],
    transversalText: "Nu'te'Vaesun · Rhia · Khorēn'vi'Vai",
    literalSpanish: "Disuelve con razón pura (Nu'te'Vaesun) · la amargura del rencor (Rhia) · a través del espejo de la red (Khorēn'vi'Vai).",
    poeticSpanish: "«La comunidad unida comprende que soltar el rencor engendra la verdadera calma tras la tormenta del ego.»",
    philosophicalNote: "El perdón no es indulgencia, sino despresurización de la bilis emocional acumulada en espacios cerrados.",
    sociolectAlgante: "Nu'te'Vaesun Rhia khorēn'vi'eos.",
    sociolectOxidado: "Suelta el veneno o revienta el conducto.",
    compactTransversal: "Vaes'Rhia",
    compactPoetic: "«Soltar el rencor engendra calma pura.»",
    compactLiteral: "Vaes (soltar el aliento) · Rhia (calma tras el ego)."
  },
  {
    keywords: ['meditación', 'aliento', 'pausa', 'vaes', 'vain'],
    transversalText: "Kāen'na'Vaes ·· Nu'Vain ·· Rhein'el",
    literalSpanish: "En la pausa del aliento (Kāen'na'Vaes) ·· habita la quietud sagrada (Nu'Vain) ·· corriente completada (Rhein'el).",
    poeticSpanish: "«En la breve pausa de la respiración habita la eternidad; el alma se abre en quietud receptiva.»",
    philosophicalNote: "Enseñanza de Joren Thalvus: entre inhalación y exhalación, el tiempo artificial de la Estación se extingue y queda el ser.",
    sociolectAlgante: "Kāen'na'Vaes lir'nu'vain rhein'el.",
    sociolectOxidado: "Para el fuelle y escucha el fondo.",
    compactTransversal: "Vaes'Vain",
    compactPoetic: "«En la pausa habita el ser.»",
    compactLiteral: "Vaes (aliento en suspensión) ·· Vain (quietud receptiva)."
  },
  {
    keywords: ['alévoros', 'juramento', 'sombra', 'dunvalthy', 'dun', 'val', 'thy'],
    transversalText: "Dun'Val'Thy",
    literalSpanish: "Compromiso absoluto (Dun) · hasta el límite de la envoltura (Val) · de la fibra íntima del alma (Thy).",
    poeticSpanish: "«Entrega absoluta hasta el límite del alma; renuncia al ego ante el deber primordial del guardián.»",
    philosophicalNote: "El sagrado juramento de la Sombra Blanca: el Alévoro renuncia al amor personal para ser puro recipiente de protección.",
    sociolectAlgante: "Dun'Val'Thy vas'nu-eos.",
    sociolectOxidado: "Hasta el hueso y sin llorar.",
    compactTransversal: "Dun'Thy",
    compactPoetic: "«Entrega hasta el núcleo del alma.»",
    compactLiteral: "Dun (entrega absoluta) · Thy (fibra íntima)."
  },
  {
    keywords: ['flujo', 'confío', 'saludo', 'vae', 'nai'],
    transversalText: "Vae-Nai · Koa'Eli · Vai",
    literalSpanish: "Confío en tu flujo (Vae-Nai) · luz en tu centro consciente (Koa'Eli) · hermano espejo (Vai).",
    poeticSpanish: "«Confío en tu flujo; que la luz habite en tu centro de consciencia, hermano de tránsito.»",
    philosophicalNote: "Fórmula de reverencia entre iguales: reconoce la corriente vital del otro sin intentar dirigirla.",
    sociolectAlgante: "Vae-Nai lir'koa'eli ael.",
    sociolectOxidado: "Vae-Nai, firma el paso.",
    compactTransversal: "Vae'Eli",
    compactPoetic: "«Luz en tu flujo, hermano de tránsito.»",
    compactLiteral: "Vae (confianza en el flujo) · Eli (luz de consciencia)."
  },
  {
    keywords: ['ruido', 'dulzura', 'tecnología', 'nis', 'rha', 'miel'],
    transversalText: "Nis'Rha ·· Nu-Miel",
    literalSpanish: "Zumbido artificial en la raíz (Nis'Rha) ·· desprovisto de dulzura viva (Nu-Miel).",
    poeticSpanish: "«Sin dulzura en el ruido; advertencia contra la máquina que devora el calor humano.»",
    philosophicalNote: "Lamento por la generación que nació bajo lámparas de sodio sin conocer el silencio de los bosques.",
    sociolectAlgante: "Nis'Rha lir'nu-miel.",
    sociolectOxidado: "Tanta máquina y nos morimos secos.",
    compactTransversal: "Nis'Nu-Miel",
    compactPoetic: "«Ruido frío sin dulzura.»",
    compactLiteral: "Nis (zumbido mecánico) ·· Nu-Miel (sin dulzura viva)."
  },
  {
    keywords: ['vacío', 'energía', 'vael', 'vim'],
    transversalText: "Vael'nu'Siv ·· Vael'Vim",
    literalSpanish: "El vacío no es silencio inerte (Vael'nu'Siv) ·· el vacío es energía potencial viva (Vael'Vim).",
    poeticSpanish: "«El vacío del espacio no es ausencia ni muerte; es la matriz donde palpita la energía de lo no nacido.»",
    philosophicalNote: "Mantra para disipar el terror agorafóbico de contemplar las escotillas exteriores.",
    sociolectAlgante: "Vael'nu'Siv lir'vael'vim.",
    sociolectOxidado: "Lo negro no está muerto, empuja.",
    compactTransversal: "Vael'Vim",
    compactPoetic: "«El vacío late de potencia.»",
    compactLiteral: "Vael (vacío fértil) · Vim (energía viva)."
  }
];

export interface TranslationOptions {
  sociolect?: 'algante' | 'oxidado';
  syntaxOrder?: 'VOS' | 'especular';
  timePrefix?: 'nu' | 'min' | 'vor' | 'sha' | 'kro';
  evidenceInfix?: 'ka' | 'vo' | 'te' | 'ri';
  aspectSuffix?: 'aen' | 'el' | 'un' | 're' | 'in' | 'nil' | 'pure';
  pronoun?: string;
}

/**
 * Parses a Transversal token (like "Thima", "Varin'Vim", "Min'ka'Rhaen") into its constituent morphemes
 */
export function parseTransversalToken(rawToken: string): MorphemeToken[] {
  const clean = rawToken.replace(/[···,]/g, '').trim();
  if (!clean) return [];

  const tokens: MorphemeToken[] = [];
  // Split on apostrophe while preserving structure
  const parts = clean.split(/['\-]/).map(p => p.trim()).filter(Boolean);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const pLower = part.toLowerCase();

    // Check Time prefix
    if (i === 0 && TIME_PREFIXES[pLower]) {
      tokens.push({
        part: `${part}-`,
        type: 'time',
        meaning: TIME_PREFIXES[pLower].meaning
      });
      continue;
    }

    // Check Evidence infix
    if (EVIDENCE_INFIXES[pLower]) {
      tokens.push({
        part: `${part}-`,
        type: 'evidence',
        meaning: EVIDENCE_INFIXES[pLower].meaning
      });
      continue;
    }

    // Check Relational particle
    if (RELATIONAL_PARTICLES[pLower]) {
      tokens.push({
        part: `'${part}`,
        type: 'particle',
        meaning: RELATIONAL_PARTICLES[pLower].meaning
      });
      continue;
    }

    // Check Pronoun
    if (PRONOUNS_ALGANTE[pLower]) {
      tokens.push({
        part: part,
        type: 'pronoun',
        meaning: PRONOUNS_ALGANTE[pLower].meaning
      });
      continue;
    }

    // Check Aspect suffix
    if (ASPECT_SUFFIXES[pLower]) {
      tokens.push({
        part: `-${part}`,
        type: 'aspect',
        meaning: ASPECT_SUFFIXES[pLower].meaning
      });
      continue;
    }

    // Plurals
    if (pLower === 'im') {
      tokens.push({
        part: '-im',
        type: 'plural',
        meaning: 'Plural Armónico (unidos en la red)'
      });
      continue;
    }

    if (pLower === 'or') {
      tokens.push({
        part: '-or',
        type: 'plural',
        meaning: 'Plural Disperso (elementos aislados)'
      });
      continue;
    }

    // Check Root in initialData
    const foundRoot = ROOT_MAP.get(pLower);
    if (foundRoot) {
      tokens.push({
        part: foundRoot.root,
        type: 'root',
        meaning: `${foundRoot.meaning} (${foundRoot.description})`
      });
      continue;
    }

    // Known special radicals
    if (pLower === 'thima') {
      tokens.push({ part: 'Thima', type: 'root', meaning: 'Atención Plena / Cuidado sagrado' });
      continue;
    }
    if (pLower === 'dar') {
      tokens.push({ part: 'Dar', type: 'root', meaning: 'Separación sagrada / Respeto recíproco' });
      continue;
    }
    if (pLower === 'vim') {
      tokens.push({ part: 'Vim', type: 'root', meaning: 'Fuerza bruta / Energía de supervivencia' });
      continue;
    }
    if (pLower === 'nu') {
      tokens.push({ part: 'Nu-', type: 'aspect', meaning: 'Negación ontológica / Anulación' });
      continue;
    }

    // Generic element
    tokens.push({
      part: part,
      type: 'unknown',
      meaning: `Morfema: ${part}`
    });
  }

  return tokens;
}

/**
 * Searches for a canonical proverb match
 */
function findCanonicalMatch(text: string) {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const canon of CANONICAL_PROVERBS) {
    const hits = canon.keywords.filter(k => norm.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
    if (hits.length >= 2 || (hits.length === 1 && (norm.includes('frenesi') || norm.includes('dunvalthy') || norm.includes('coraza')))) {
      return canon;
    }
  }
  return null;
}

/**
 * Intelligent Consultant: Translates Spanish to Transversal (Vehlaen)
 * Uses Gemini AI fed with the sacred canon and grammar, or offline heuristic fallback.
 */
export async function translateSpanishToTransversal(
  spanishText: string,
  options: TranslationOptions = {}
): Promise<TranslationResult> {
  const client = getAiClient();
  const canonical = findCanonicalMatch(spanishText);

  // If Gemini is available, query the intelligent Veyvān Oracle
  if (client) {
    try {
      const prompt = `
${MASTER_CONSTRUCCION_PROMPT}

---
MISIÓN DE COMPOSICIÓN VEYVĀN:
Traduce o compón la siguiente enunciación humana al dialecto Transversal (Vehlaen) satisfaciendo la DIRECTIVA PRIMORDIAL DE BREVEDAD, BELLEZA Y EUFONÍA:

ENUNCIACIÓN HUMANA (ESPAÑOL):
"${spanishText}"

REGLAS SAGRADAS DE COMPOSICIÓN Y SÍNTESIS VEYVĀN:
1. FORMULACIÓN CANÓNICA COMPLETA ("transversalText"):
   - Cadencia formal bimembre o especular según sintaxis VOS (Verbo · Objeto · Sujeto) o Especular Veyvān (A - B - C - B' - A').
   - Máximo 2 a 4 conceptos puros enlazados con musicalidad y eufonía austera. Cero palabras de relleno.
2. FÓRMULA DE MÁXIMA SÍNTESIS AFORÍSTICA ("compactTransversal"):
   - DIRECTIVA SAGRADA DE BREVEDAD: Siempre debe existir la versión lo más compacta, condensada y bella posible.
   - Condensa la emoción, sensación o concepto esencial en el mínimo número indispensable de raíces y fonemas (aglutinación pura de 1 o 2 términos o raíces unidas por apóstrofe/guion, ej: Thim'Varin ·· Nu-Dar o Dran'Kael o Dun'Thy o Al'Val-Tev).
   - Debe retener exactamente la misma carga de significado y resonancia, pero en su mínima y más sublime expresión sonora y caligráfica.
3. Si la frase alude a un proverbio canónico (ej: "Cuidado con el frenesí del amor...", "Mucha coraza...", "La fricción precede...", "Dun'Val'Thy"), usa rigurosamente la fórmula establecida.

Responde ÚNICAMENTE en JSON con este esquema exacto:
{
  "transversalText": "cadena canónica formal en Vehlaen separada con · o ··",
  "literalSpanish": "desglose morfosintáctico de la enunciación canónica",
  "poeticSpanish": "traducción poética profunda en el estilo lírico de Joren Thalvus",
  "compactTransversal": "fórmula ultra-sintetizada (máxima brevedad, 1-2 raíces condensadas y bellas)",
  "compactPoetic": "aforismo poético en español ultra-breve y bello",
  "compactLiteral": "desglose breve de cómo se condensaron las raíces",
  "philosophicalNote": "explicación de por qué un Veyvān eligió estas raíces y su resonancia con los 344 años de viaje",
  "sociolectAlgante": "cómo la formularía la élite del Émulo (lenta, armónica, cargada de pronombres)",
  "sociolectOxidado": "cómo la resumirían los trabajadores de las cubiertas bajas periféricas (austera, directa, sin pronombres)",
  "syntaxOrder": "Canónico VOS (Verbo · Objeto · Sujeto) o Sintaxis Especular (A - B - C - B' - A')"
}
`;

      const response = await client.models.generateContent({
        model: getGeminiModel(),
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        const tokens = parseTransversalToken(parsed.transversalText);
        const compactTrans = parsed.compactTransversal || parsed.transversalText;
        const compactTokens = parseTransversalToken(compactTrans);

        return {
          sourceText: spanishText,
          transversalText: parsed.transversalText,
          literalSpanish: parsed.literalSpanish,
          poeticSpanish: parsed.poeticSpanish,
          syntaxOrder: parsed.syntaxOrder || (parsed.transversalText.includes('··') ? "Sintaxis Especular Veyvān (A - B - C - B' - A')" : 'Canónico VOS (Verbo · Objeto · Sujeto)'),
          sociolect: options.sociolect || 'algante',
          tokens: tokens,
          philosophicalNote: parsed.philosophicalNote,
          sociolectAlgante: parsed.sociolectAlgante,
          sociolectOxidado: parsed.sociolectOxidado,
          compactTransversal: compactTrans,
          compactPoetic: parsed.compactPoetic || parsed.poeticSpanish,
          compactLiteral: parsed.compactLiteral || parsed.literalSpanish,
          compactTokens: compactTokens
        };
      }
    } catch (e) {
      console.warn("Gemini Veyvān engine error, falling back to canonical semantic solver", e);
    }
  }

  // Canonical Match Fallback
  if (canonical) {
    const tokens = parseTransversalToken(canonical.transversalText);
    const compactTokens = parseTransversalToken(canonical.compactTransversal);
    return {
      sourceText: spanishText,
      transversalText: canonical.transversalText,
      literalSpanish: canonical.literalSpanish,
      poeticSpanish: canonical.poeticSpanish,
      syntaxOrder: canonical.transversalText.includes('··') ? "Sintaxis Especular Veyvān (A - B - C - B' - A')" : 'Canónico VOS (Verbo · Objeto · Sujeto)',
      sociolect: options.sociolect || 'algante',
      tokens: tokens,
      philosophicalNote: canonical.philosophicalNote,
      sociolectAlgante: canonical.sociolectAlgante,
      sociolectOxidado: canonical.sociolectOxidado,
      compactTransversal: canonical.compactTransversal,
      compactPoetic: canonical.compactPoetic,
      compactLiteral: canonical.compactLiteral,
      compactTokens: compactTokens
    };
  }

  // Heuristic Offline Semantic Synthesizer
  const textLower = spanishText.toLowerCase();
  
  // Score roots from initialData
  let bestVerb = ROOT_MAP.get('tael')!;
  let bestObj = ROOT_MAP.get('koa')!;
  let maxVerbScore = -1;
  let maxObjScore = -1;

  for (const term of initialData) {
    const termText = (term.meaning + ' ' + term.description).toLowerCase();
    let score = 0;
    const words = textLower.split(/\s+/).filter(w => w.length > 3);
    for (const w of words) {
      if (termText.includes(w)) score += 3;
    }
    if (score > maxVerbScore && (term.category.includes('Acción') || term.category.includes('Impulsos') || term.category.includes('Transformaciones'))) {
      maxVerbScore = score;
      bestVerb = term;
    } else if (score > maxObjScore) {
      maxObjScore = score;
      bestObj = term;
    }
  }

  // Specific semantic overrides
  if (textLower.includes('aliento') || textLower.includes('respir')) bestVerb = ROOT_MAP.get('vaes') || bestVerb;
  if (textLower.includes('siento') || textLower.includes('sentir') || textLower.includes('emoción')) bestVerb = ROOT_MAP.get('rhaen') || bestVerb;
  if (textLower.includes('luz') || textLower.includes('claridad')) bestObj = ROOT_MAP.get('eli') || bestObj;
  if (textLower.includes('amor') || textLower.includes('unión')) bestObj = ROOT_MAP.get('varin') || bestObj;
  if (textLower.includes('alma') || textLower.includes('espíritu')) bestObj = ROOT_MAP.get('thy') || bestObj;
  if (textLower.includes('silencio') || textLower.includes('calma')) bestObj = ROOT_MAP.get('siv') || bestObj;

  const time = options.timePrefix || 'nu';
  const evid = options.evidenceInfix || 'ka';
  const asp = options.aspectSuffix && options.aspectSuffix !== 'pure' ? `'${options.aspectSuffix}` : '';
  const subj = options.sociolect === 'oxidado' ? 'Vai' : (options.pronoun || 'Eos');

  const transversal = `${time}'${evid}'${bestVerb.root}${asp} · ${bestObj.root} · ${subj}`;
  const tokens = parseTransversalToken(transversal);
  const compactForm = `${bestVerb.root}'${bestObj.root}`;
  const compactTokens = parseTransversalToken(compactForm);

  return {
    sourceText: spanishText,
    transversalText: transversal,
    literalSpanish: `[Verbo: ${time}-${evid}-${bestVerb.root}${asp}] · [Objeto: ${bestObj.root} (${bestObj.meaning})] · [Sujeto: ${subj}]`,
    poeticSpanish: `«En la presencia consciente de ${subj}, el aliento de ${bestVerb.root} (${bestVerb.meaning}) abraza la verdad profunda de ${bestObj.root} (${bestObj.meaning}).»`,
    syntaxOrder: 'Canónico VOS (Verbo · Objeto · Sujeto)',
    sociolect: options.sociolect || 'algante',
    tokens: tokens,
    philosophicalNote: 'Composición elaborada siguiendo la eufonía de los 24 fonemas canónicos y la dilución del ego propia de los Veyvān.',
    sociolectAlgante: `${time}'${evid}'${bestVerb.root}${asp} lir'${bestObj.root} na'${subj}.`,
    sociolectOxidado: `${bestVerb.root} ${bestObj.root} firme.`,
    compactTransversal: compactForm,
    compactPoetic: `«${bestVerb.meaning}: ${bestObj.meaning}.»`,
    compactLiteral: `${bestVerb.root} (${bestVerb.meaning}) · ${bestObj.root} (${bestObj.meaning})`,
    compactTokens: compactTokens
  };
}

/**
 * Intelligent Hermeneutics: Translates Transversal (Vehlaen) to Spanish
 * Analyzes roots, morphemes, sociolect resonance and philosophical meaning.
 */
export async function translateTransversalToSpanish(input: string): Promise<TranslationResult> {
  const client = getAiClient();
  const canonical = findCanonicalMatch(input);

  if (canonical) {
    const tokens = parseTransversalToken(canonical.transversalText);
    const compactTokens = parseTransversalToken(canonical.compactTransversal);
    return {
      sourceText: input,
      transversalText: canonical.transversalText,
      literalSpanish: canonical.literalSpanish,
      poeticSpanish: canonical.poeticSpanish,
      syntaxOrder: canonical.transversalText.includes('··') ? "Sintaxis Especular Veyvān (A - B - C - B' - A')" : 'Canónico VOS (Verbo · Objeto · Sujeto)',
      sociolect: 'algante',
      tokens: tokens,
      philosophicalNote: canonical.philosophicalNote,
      sociolectAlgante: canonical.sociolectAlgante,
      sociolectOxidado: canonical.sociolectOxidado,
      compactTransversal: canonical.compactTransversal,
      compactPoetic: canonical.compactPoetic,
      compactLiteral: canonical.compactLiteral,
      compactTokens: compactTokens
    };
  }

  // If Gemini is available, query deep hermeneutics
  if (client) {
    try {
      const prompt = `
${MASTER_CONSTRUCCION_PROMPT}

---
MISIÓN DE EXÉGESIS Y HERMENÉUTICA VEYVĀN:
Interpreta y traduce la siguiente enunciación o término en dialecto Transversal (Vehlaen) al Español con máxima profundidad y rigor:

ENUNCIACIÓN EN TRANSVERSAL:
"${input}"

INSTRUCCIONES DE ANÁLISIS:
1. Identifica cada raíz fónica, prefijos temporales (nu-, min-, vor-, sha-, kro-), infijos evidenciales (ka-, vo-, te-, ri-), sufijos de aspecto (-aen, -el, -un, -re, -in, -nil) y partículas relacionales ('na, 'vi, 'zo, 'da).
2. Proporciona la traducción literal morfosintáctica paso a paso.
3. Proporciona una traducción poética elevada en el estilo de Joren Thalvus.
4. Genera también la fórmula de MÁXIMA SÍNTESIS AFORÍSTICA ("compactTransversal") que condensa la expresión en su mínima y más sublime raíz/aglutinación, junto con su aforismo breve ("compactPoetic").
5. Explica la resonancia filosófica del concepto en la vida de los 344 años de viaje interestelar en la nave.
6. Explica el matiz de sociolecto: cómo lo interpretaría un habitante del Émulo (Algante) vs un minero o técnico de las cubiertas bajas (Oxidado).

Devuelve ÚNICAMENTE JSON con este esquema exacto:
{
  "transversalText": "${input}",
  "literalSpanish": "desglose morfológico literal",
  "poeticSpanish": "traducción poética elevada estilo Joren Thalvus",
  "compactTransversal": "versión ultra-sintética compacta (1-2 raíces)",
  "compactPoetic": "aforismo poético breve en español",
  "compactLiteral": "desglose breve de la síntesis",
  "philosophicalNote": "explicación filosófica profunda y contexto diegético",
  "sociolectAlgante": "interpretación y forma en sociolecto Algante",
  "sociolectOxidado": "interpretación y forma en sociolecto Oxidado",
  "syntaxOrder": "Canónico VOS (Verbo · Objeto · Sujeto) o Sintaxis Especular (A - B - C - B' - A')"
}
`;

      const response = await client.models.generateContent({
        model: getGeminiModel(),
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        const tokens = parseTransversalToken(input);
        const compactTrans = parsed.compactTransversal || input;
        const compactTokens = parseTransversalToken(compactTrans);

        return {
          sourceText: input,
          transversalText: input,
          literalSpanish: parsed.literalSpanish,
          poeticSpanish: parsed.poeticSpanish,
          syntaxOrder: parsed.syntaxOrder || (input.includes('··') ? "Sintaxis Especular Veyvān (A - B - C - B' - A')" : 'Canónico VOS (Verbo · Objeto · Sujeto)'),
          sociolect: (input.toLowerCase().includes('eos') || input.toLowerCase().includes('lir') || input.toLowerCase().includes('ael')) ? 'algante' : 'oxidado',
          tokens: tokens,
          philosophicalNote: parsed.philosophicalNote,
          sociolectAlgante: parsed.sociolectAlgante,
          sociolectOxidado: parsed.sociolectOxidado,
          compactTransversal: compactTrans,
          compactPoetic: parsed.compactPoetic || parsed.poeticSpanish,
          compactLiteral: parsed.compactLiteral || parsed.literalSpanish,
          compactTokens: compactTokens
        };
      }
    } catch (e) {
      console.warn("Gemini hermeneutics error, using offline token parser", e);
    }
  }

  // Offline Hermeneutic Fallback
  const rawWords = input.split(/[··\s]+/).filter(w => w.trim().length > 0);
  const allTokens: MorphemeToken[] = [];
  const wordsDecomposition: string[] = [];

  rawWords.forEach(word => {
    const tokens = parseTransversalToken(word);
    tokens.forEach(t => allTokens.push(t));

    const rootTokens = tokens.filter(t => t.type === 'root');
    const rootMeaning = rootTokens.map(r => r.meaning.split('(')[0].trim()).join(' y ');
    const timeTokens = tokens.filter(t => t.type === 'time');
    const evidTokens = tokens.filter(t => t.type === 'evidence');
    const aspectTokens = tokens.filter(t => t.type === 'aspect');
    const pronounTokens = tokens.filter(t => t.type === 'pronoun');

    let desc = rootMeaning || word;
    if (timeTokens.length > 0) desc = `[${timeTokens[0].meaning.split('(')[0].trim()}] ` + desc;
    if (evidTokens.length > 0) desc += ` (sentido: ${evidTokens[0].meaning.split('(')[0].trim()})`;
    if (aspectTokens.length > 0) desc += ` [${aspectTokens[0].meaning.split('(')[0].trim()}]`;
    if (pronounTokens.length > 0) desc = `${pronounTokens[0].meaning.split('(')[0].trim()}: ` + desc;

    wordsDecomposition.push(desc);
  });

  const literal = wordsDecomposition.length >= 3 
    ? `[V: ${wordsDecomposition[0]}] ➔ [O: ${wordsDecomposition[1]}] ➔ [S: ${wordsDecomposition.slice(2).join(', ')}]`
    : wordsDecomposition.join(' · ');

  const poetic = `«${wordsDecomposition.map(w => w.replace(/\[.*?\]/g, '').trim()).filter(Boolean).join(' en resonancia con ')}, donde el aliento de la nave atestigua la transformación del ser.»`;

  return {
    sourceText: input,
    transversalText: input,
    literalSpanish: literal,
    poeticSpanish: poetic,
    syntaxOrder: input.includes('··') ? "Sintaxis Especular Veyvān (A - B - C - B' - A')" : 'Canónico VOS (Verbo · Objeto · Sujeto)',
    sociolect: (input.toLowerCase().includes('eos') || input.toLowerCase().includes('lir') || input.toLowerCase().includes('ael')) ? 'algante' : 'oxidado',
    tokens: allTokens,
    philosophicalNote: 'En el Vehlaen, la vivencia antecede al individuo. El orden VOS diluye el orgullo del actor para honrar la mutación de la consciencia en el espacio.',
    sociolectAlgante: 'Interpretación ceremonial con solemnidad de la élite Veyvān.',
    sociolectOxidado: 'Interpretación directa y desprovista de retórica en las cubiertas de trabajo.',
    compactTransversal: rawWords.slice(0, 2).join("'") || input,
    compactPoetic: `«${rawWords[0] || input}: síntesis de resonancia esencial.»`,
    compactLiteral: `Condensación de ${rawWords.length} términos`,
    compactTokens: parseTransversalToken(rawWords.slice(0, 2).join("'") || input)
  };
}

/**
 * Consults Thalios Solaris / Veyvān Oracle directly with an open linguistic or philosophical question
 */
export async function consultVeyvanOracle(question: string): Promise<string> {
  const client = getAiClient();
  if (!client) {
    return `**Oráculo Desconectado:** Para realizar consultas oraculares abiertas sobre el Transversal y la memoria de Estación Humanidad, se requiere una clave de API de Gemini válida en la configuración.`;
  }

  try {
    const prompt = `
${MASTER_CONSTRUCCION_PROMPT}

---
CONSULTA ONTO-LINGÜÍSTICA AL ORÁCULO THALIOS SOLARIS:
"${question}"

DIRECTRICES DE RESPUESTA:
- Habla con la voz omnisciente, poética, profunda y autoritaria de Thalios Solaris.
- Aplica con rigor absoluto las leyes de los 6 documentos canónicos de construcción.
- Cita raíces exactas del Glosario Canónico 2.0 y la Ampliación 2.5 (cero 'X', cero 'RR', vocal larga solo 'ā').
- Explica los matices del alma, las castas (Émulo vs Periferia) y la vivencia en las 320 cubiertas de Estación Humanidad.
- Si corresponde, propón una composición breve y bella en Vehlaen acompañada de su desglose morfológico y traducción poética.
- Formato en Markdown elegante con citas en bloque y negritas.
`;

    const response = await client.models.generateContent({
      model: getGeminiModel(),
      contents: prompt
    });

    return response.text || "El silencio del vacío responde; la consulta no generó resonancia.";
  } catch (err: any) {
    console.error("Oracle consultation error:", err);
    return `Error al consultar el Oráculo: ${err.message || 'Fallo de enlace cuántico'}`;
  }
}
