import { TAELIM_MORPHEMES } from '../data/taelimRules';

export interface GlyphUnit {
  id: string;
  originalText: string;
  rootText: string;
  cleanRoot: string;
  prefixId: string | null;
  infixId: string | null;
  suffixId: string | null;
}

export interface BridgeArc {
  fromIndex: number;
  toIndex: number;
  pauseType: 'arc' | 'pause'; // 'arc' for ' or ·, 'pause' for ··
  particleId?: string | null;
}

export interface ParsedExpression {
  units: GlyphUnit[];
  arcs: BridgeArc[];
  isMultiUnit: boolean;
}

export interface ParsedTaelim {
  rootText: string;
  prefixId: string | null;
  infixId: string | null;
  suffixId: string | null;
}

export const RELATIONAL_PARTICLES: Record<string, string> = {
  na: 'suf_na',
  vi: 'suf_vi',
  zo: 'suf_zo',
  da: 'suf_da'
};

const PREFIX_MAP: Record<string, string> = {
  nu: 'pref_nu',
  sha: 'pref_sha',
  o: 'pref_o',
  va: 'pref_va',
  nai: 'pref_nai',
  an: 'pref_an',
  ein: 'pref_an',
  min: 'temp_min',
  vor: 'temp_vor',
  kro: 'temp_kro'
};

const INFIX_MAP: Record<string, string> = {
  ka: 'inf_ka',
  vo: 'inf_vo',
  te: 'inf_te',
  ri: 'inf_ri'
};

const SUFFIX_MAP: Record<string, string> = {
  or: 'suf_or',
  im: 'suf_im',
  ya: 'suf_ya',
  yā: 'suf_ya',
  tue: 'suf_tue',
  tuē: 'suf_tue',
  vun: 'suf_vun',
  aen: 'asp_aen',
  re: 'asp_re',
  in: 'asp_in',
  el: 'clos_el',
  un: 'clos_un',
  nil: 'clos_nil',
  he: 'clos_he',
  fi: 'clos_fi',
  ri: 'clos_ri',
  // Partículas relacionales canónicas (Casos fluídos)
  na: 'suf_na',
  vi: 'suf_vi',
  zo: 'suf_zo',
  da: 'suf_da'
};

/**
 * Normalizes text to uppercase English A-Z without accents/macrons
 */
export function cleanRadicalLetters(raw: string): string {
  return String(raw || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

/**
 * Parses a single sub-token that represents a radical with potential affixes.
 */
export function parseSingleRadicalToken(token: string): {
  rootText: string;
  cleanRoot: string;
  prefixId: string | null;
  infixId: string | null;
  suffixId: string | null;
} {
  const clean = token.trim();
  if (!clean) {
    return { rootText: '', cleanRoot: '', prefixId: null, infixId: null, suffixId: null };
  }

  // Split into components by ' or -
  const rawParts = clean.split(/['\-]/).filter(Boolean);
  if (rawParts.length === 1) {
    const only = rawParts[0];
    return {
      rootText: only,
      cleanRoot: cleanRadicalLetters(only),
      prefixId: null,
      infixId: null,
      suffixId: null
    };
  }

  let prefixId: string | null = null;
  let infixId: string | null = null;
  let suffixId: string | null = null;
  const rootCandidates: string[] = [];

  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    const partLower = part.toLowerCase();

    // Check prefix if at beginning
    if (i === 0 && PREFIX_MAP[partLower]) {
      prefixId = PREFIX_MAP[partLower];
      continue;
    }

    // Check evidential infix if at beginning of 2-part compound (e.g. Vo'Neu, Ka'Tael, Te'Sur)
    if (i === 0 && rawParts.length === 2 && INFIX_MAP[partLower]) {
      infixId = INFIX_MAP[partLower];
      continue;
    }

    // Check infix if in middle
    if (i > 0 && i < rawParts.length - 1 && INFIX_MAP[partLower] && !infixId) {
      infixId = INFIX_MAP[partLower];
      continue;
    }

    // Check suffix if at end
    if (i === rawParts.length - 1 && (SUFFIX_MAP[partLower] || RELATIONAL_PARTICLES[partLower])) {
      suffixId = SUFFIX_MAP[partLower] || RELATIONAL_PARTICLES[partLower];
      continue;
    }

    // Otherwise it's part of the root
    rootCandidates.push(part);
  }

  // If all parts were consumed as affixes (e.g. Vor'aen), retain the first part as base
  if (rootCandidates.length === 0) {
    if (rawParts.length >= 2) {
      rootCandidates.push(rawParts[0]);
    } else {
      rootCandidates.push(clean);
    }
  }

  const rootText = rootCandidates.join('') || clean;
  const cleanRoot = cleanRadicalLetters(rootText);

  return {
    rootText,
    cleanRoot,
    prefixId,
    infixId,
    suffixId
  };
}

export function isAffix(part: string): boolean {
  const p = part.toLowerCase();
  return Boolean(PREFIX_MAP[p] || INFIX_MAP[p] || SUFFIX_MAP[p] || RELATIONAL_PARTICLES[p]);
}

/**
 * Parses an entire Transversal sentence or expression into multi-glyph units and bridge arcs.
 * Respects:
 * - Separate roots in expressions like Dun'Val'Thy (3 units connected by arcs)
 * - Relational particles like Koa'na'Eli (2 units connected by particle 'na' arc)
 * - Punctuation pauses (·, ··, spaces, newlines)
 * - Prefixes & suffixes attached to individual radicals
 */
export function parseTaelimExpression(expression: string): ParsedExpression {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { units: [], arcs: [], isMultiUnit: false };
  }

  // Step 1: Detect pauses and major words
  // If expression contains '··', it indicates a major specular pause
  // We first segment by major punctuation '··', '·', or whitespace
  const majorChunks: { text: string; pauseAfter: 'arc' | 'pause' | 'none' }[] = [];

  // Match sequences of ·· or · or \n or ,
  const splitRegex = /(··|·|\n+|,)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = splitRegex.exec(trimmed)) !== null) {
    const chunk = trimmed.substring(lastIndex, match.index).trim();
    if (chunk) {
      const sep = match[0];
      majorChunks.push({
        text: chunk,
        pauseAfter: sep === '··' ? 'pause' : 'arc'
      });
    }
    lastIndex = match.index + match[0].length;
  }
  const remaining = trimmed.substring(lastIndex).trim();
  if (remaining) {
    majorChunks.push({ text: remaining, pauseAfter: 'none' });
  }

  // If no major punctuation found, use raw text as single chunk with space separation
  const chunksToProcess = majorChunks.length > 0 ? majorChunks : [{ text: trimmed, pauseAfter: 'none' as const }];

  const units: GlyphUnit[] = [];
  const arcs: BridgeArc[] = [];
  let pendingPause: 'pause' | 'arc' | null = null;
  let pendingParticle: string | null = null;

  for (let cIdx = 0; cIdx < chunksToProcess.length; cIdx++) {
    const chunkItem = chunksToProcess[cIdx];
    // Split chunk into words by space
    const spaceWords = chunkItem.text.split(/\s+/).filter(Boolean);

    for (let wIdx = 0; wIdx < spaceWords.length; wIdx++) {
      const word = spaceWords[wIdx];

      // Check if word itself is a standalone relational particle (e.g. "na", "'na'", "vi", "'vi'", etc.)
      const cleanWordKey = word.replace(/['\-\s·]/g, '').toLowerCase();
      if (RELATIONAL_PARTICLES[cleanWordKey] && units.length > 0) {
        pendingParticle = RELATIONAL_PARTICLES[cleanWordKey];
        continue;
      }

      // If word is a single affixed root or copula (e.g. Min'ka'Rhaen, Vor'aen, Nu'te'Vaesun, Nu-Dar)
      // treat as 1 unit with its morphemes instead of splitting affixes into separate units
      const rawSubParts = word.split(/['\-]/).filter(Boolean);
      const substantiveRoots = rawSubParts.filter(p => !isAffix(p));

      if (substantiveRoots.length <= 1 && !rawSubParts.some(p => RELATIONAL_PARTICLES[p.toLowerCase()])) {
        const parsed = parseSingleRadicalToken(word);
        if (parsed.cleanRoot.length > 0) {
          const newIndex = units.length;
          units.push({
            id: `unit_${newIndex}_${parsed.cleanRoot}`,
            originalText: word,
            rootText: parsed.rootText,
            cleanRoot: parsed.cleanRoot,
            prefixId: parsed.prefixId,
            infixId: parsed.infixId,
            suffixId: parsed.suffixId
          });
          if (newIndex > 0) {
            arcs.push({
              fromIndex: newIndex - 1,
              toIndex: newIndex,
              pauseType: pendingPause || 'arc',
              particleId: pendingParticle || null
            });
            pendingPause = null;
            pendingParticle = null;
          }
        }
        continue;
      }

      // Check if word has apostrophes that separate distinct roots or particles
      // e.g. Dun'Val'Thy or Koa'na'Eli or Al'Val'Sha-Tev
      const apostropheParts = word.split("'").filter(Boolean);

      let pIdx = 0;
      while (pIdx < apostropheParts.length) {
        const part = apostropheParts[pIdx];
        const partLower = part.toLowerCase();

        // Check if this part is a standalone relational particle between radicals (e.g. 'na' in Koa'na'Eli)
        if (RELATIONAL_PARTICLES[partLower] && units.length > 0 && pIdx + 1 < apostropheParts.length) {
          const nextPart = apostropheParts[pIdx + 1];
          const parsedNext = parseSingleRadicalToken(nextPart);
          if (parsedNext.cleanRoot.length > 0) {
            const nextIndex = units.length;
            units.push({
              id: `unit_${nextIndex}_${parsedNext.cleanRoot}`,
              originalText: nextPart,
              rootText: parsedNext.rootText,
              cleanRoot: parsedNext.cleanRoot,
              prefixId: parsedNext.prefixId,
              infixId: parsedNext.infixId,
              suffixId: parsedNext.suffixId
            });
            arcs.push({
              fromIndex: nextIndex - 1,
              toIndex: nextIndex,
              pauseType: pendingPause || 'arc',
              particleId: RELATIONAL_PARTICLES[partLower]
            });
            pendingPause = null;
            pendingParticle = null;
            pIdx += 2;
            continue;
          }
        }

        // Check if this part is hyphenated two capitalized roots, e.g. "Vae-Nai" or "Zul-Nai"
        const hyphenParts = part.split('-').filter(Boolean);
        if (
          hyphenParts.length === 2 &&
          !PREFIX_MAP[hyphenParts[0].toLowerCase()] &&
          hyphenParts[0][0] === hyphenParts[0][0].toUpperCase() &&
          hyphenParts[1][0] === hyphenParts[1][0].toUpperCase() &&
          !SUFFIX_MAP[hyphenParts[1].toLowerCase()]
        ) {
          for (let hIdx = 0; hIdx < hyphenParts.length; hIdx++) {
            const parsed = parseSingleRadicalToken(hyphenParts[hIdx]);
            if (parsed.cleanRoot.length === 0) continue;
            const newIndex = units.length;
            units.push({
              id: `unit_${newIndex}_${parsed.cleanRoot}`,
              originalText: hyphenParts[hIdx],
              rootText: parsed.rootText,
              cleanRoot: parsed.cleanRoot,
              prefixId: parsed.prefixId,
              infixId: parsed.infixId,
              suffixId: parsed.suffixId
            });
            if (newIndex > 0) {
              arcs.push({
                fromIndex: newIndex - 1,
                toIndex: newIndex,
                pauseType: pendingPause || 'arc'
              });
              pendingPause = null;
            }
          }
          pIdx++;
          continue;
        }

        // Normal radical token (might have affixes, e.g. Sha-Tev, Dun, Val, Luv-ri)
        const parsed = parseSingleRadicalToken(part);
        if (parsed.cleanRoot.length > 0) {
          const newIndex = units.length;
          units.push({
            id: `unit_${newIndex}_${parsed.cleanRoot}`,
            originalText: part,
            rootText: parsed.rootText,
            cleanRoot: parsed.cleanRoot,
            prefixId: parsed.prefixId,
            infixId: parsed.infixId,
            suffixId: parsed.suffixId
          });
          if (newIndex > 0) {
            arcs.push({
              fromIndex: newIndex - 1,
              toIndex: newIndex,
              pauseType: pendingPause || 'arc'
            });
            pendingPause = null;
          }
        }
        pIdx++;
      }
    }

    if (chunkItem.pauseAfter === 'pause') {
      pendingPause = 'pause';
    }
  }

  // Fallback: If no valid units were detected, create a single empty or raw unit
  if (units.length === 0 && trimmed) {
    const cleanOnly = cleanRadicalLetters(trimmed);
    units.push({
      id: `unit_0_${cleanOnly}`,
      originalText: trimmed,
      rootText: trimmed,
      cleanRoot: cleanOnly,
      prefixId: null,
      infixId: null,
      suffixId: null
    });
  }

  return {
    units,
    arcs,
    isMultiUnit: units.length > 1
  };
}

/**
 * Backward compatible single-word parser
 */
export function parseTaelimWord(word: string): ParsedTaelim {
  const parsed = parseTaelimExpression(word);
  if (parsed.units.length > 0) {
    const first = parsed.units[0];
    return {
      rootText: first.cleanRoot || first.rootText,
      prefixId: first.prefixId,
      infixId: first.infixId,
      suffixId: first.suffixId
    };
  }
  return { rootText: '', prefixId: null, infixId: null, suffixId: null };
}
