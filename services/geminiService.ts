import { GoogleGenAI, Type } from "@google/genai";
import { Tonality } from '../types';

export interface ModelOption {
  id: string;
  label: string;
  description: string;
  badge?: string;
}

export const CURATED_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    label: 'Gemini 3.8 Flash',
    description: 'Estándar Oficial: Máxima rapidez, erudición Veyvān y soporte multicanal',
    badge: 'Recomendado'
  },
  {
    id: 'gemini-flash-latest',
    label: 'Gemini Flash Latest',
    description: 'Canal dinámico siempre actualizado',
    badge: 'Auto'
  },
  {
    id: 'gemini-3.8-flash-tts',
    label: 'Gemini 3.8 Flash TTS',
    description: 'Modelo neuronal cinemático especializado en síntesis de voz oracular',
    badge: 'Voz HD'
  },
  {
    id: 'gemini-3-flash-preview',
    label: 'Gemini 3.0 Flash Preview',
    description: 'Versión preliminar equilibrada',
    badge: 'Preview'
  }
];

export const getGeminiApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gemini_api_key');
    if (local && local.trim().length > 5) return local.trim();
  }
  const envKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (envKey && envKey !== 'PLACEHOLDER_API_KEY') return envKey;
  return '';
};

export const hasCustomApiKey = (): boolean => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gemini_api_key');
    return Boolean(local && local.trim().length > 5);
  }
  return false;
};

export const setGeminiApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }
};

export const clearCustomApiKey = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gemini_api_key');
  }
};

export const getGeminiModel = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gemini_model');
    if (local && local.trim().length > 2 && local.trim() !== 'gemini-2.0-flash') {
      return local.trim();
    }
  }
  return 'gemini-3.8-flash';
};

export const setGeminiModel = (model: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_model', model.trim());
  }
};

export const getAiClient = (customKey?: string): GoogleGenAI | null => {
  const key = customKey?.trim() || getGeminiApiKey();
  return key ? new GoogleGenAI({ apiKey: key }) : null;
};

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  modelUsed?: string;
  timestamp?: string;
  oracleSample?: string;
}

/**
 * Performs a live connectivity diagnostic test with Google Gemini API
 */
export const testGeminiConnection = async (
  apiKeyToTest?: string,
  modelToTest?: string
): Promise<ConnectionTestResult> => {
  const key = apiKeyToTest !== undefined ? apiKeyToTest.trim() : getGeminiApiKey();

  if (!key || key.length < 10) {
    return {
      success: false,
      message: 'La clave API proporcionada está vacía o es demasiado corta (mínimo 10 caracteres).',
      timestamp: new Date().toLocaleTimeString()
    };
  }

  const client = new GoogleGenAI({ apiKey: key });
  const cleanModelToTest = modelToTest && modelToTest !== 'gemini-2.0-flash' ? modelToTest : undefined;
  const candidates = Array.from(new Set([
    cleanModelToTest,
    getGeminiModel(),
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3-flash-preview',
    'gemini-3.8-flash-tts',
    'gemini-2.5-flash-preview-tts',
    'gemini-1.5-flash'
  ].filter(Boolean))) as string[];

  const startTime = Date.now();
  let lastError: any = null;

  for (const model of candidates) {
    try {
      const response = await client.models.generateContent({
        model: model,
        contents: 'Ping ceremonial Veyvān: Responde brevemente con tres palabras sagradas del Transversal: "Koa · Vaes · Eli" y nada más.',
      });
      const latencyMs = Date.now() - startTime;
      const text = response.text?.trim() || 'Koa · Vaes · Eli';

      // Guardar el modelo verificado para todas las llamadas futuras
      setGeminiModel(model);

      return {
        success: true,
        message: `¡Enlace cuántico verificado! Conectado con '${model}' en ${latencyMs}ms.`,
        latencyMs,
        modelUsed: model,
        timestamp: new Date().toLocaleTimeString(),
        oracleSample: text
      };
    } catch (err: any) {
      lastError = err;
      const isNotFound = err?.message?.includes('404') || 
                         err?.message?.includes('not found') || 
                         err?.message?.includes('NOT_FOUND') ||
                         err?.message?.includes('no longer available');
      if (isNotFound) {
        continue;
      }
      break;
    }
  }

  const latencyMs = Date.now() - startTime;
  let errorDetail = lastError?.message || 'Error desconocido';

  if (errorDetail.includes('404') || errorDetail.includes('not found') || errorDetail.includes('NOT_FOUND') || errorDetail.includes('no longer available')) {
    errorDetail = 'Ninguno de los modelos estándar de Gemini respondió para esta clave. Comprueba en Google AI Studio qué modelos están activos.';
  } else if (errorDetail.includes('400') || errorDetail.includes('API_KEY_INVALID') || errorDetail.includes('key not valid')) {
    errorDetail = 'La clave API de Gemini no es válida o no tiene permisos habilitados en Google AI Studio.';
  } else if (errorDetail.includes('429') || errorDetail.includes('RESOURCE_EXHAUSTED')) {
    errorDetail = 'Límite de cuota excedido (Rate Limit). Espera unos instantes o revisa tu facturación.';
  } else if (errorDetail.includes('Failed to fetch') || errorDetail.includes('NetworkError')) {
    errorDetail = 'Fallo de red al conectar con los servidores de Google Generative AI. Comprueba tu conexión a internet.';
  }

  return {
    success: false,
    message: errorDetail,
    latencyMs,
    timestamp: new Date().toLocaleTimeString()
  };
};

import { CATEGORIES, TOMOS, Term } from '../types';

export interface AnalysisResult {
  tonality: Tonality;
  syllables: number;
  expandedDescription: string;
  categorySuggestion: string;
}

export interface DeepRadicalAnalysis {
  tonality: Tonality;
  syllables: number;
  expandedDescription: string;
  categorySuggestion: string;
  tomo: string;
  level: string;
  phonetics: string;
  ontologicalDomain: string;
  derivatives: {
    noun: string;
    verb: string;
    state: string;
    transcendent: string;
  };
  sampleVosSentence: {
    transversal: string;
    literal: string;
    poetic: string;
  };
  canonicalComplianceNotes: string;
}

export interface RadicalProposal {
  root: string;
  meaning: string;
  description: string;
  tonality: Tonality;
  category: string;
  tomo: string;
  syllables: number;
  phonetics: string;
  level: string;
  sampleVosSentence: {
    transversal: string;
    literal: string;
    poetic: string;
  };
  rationale: string;
}

export interface RadicalFusionResult {
  suggestedRoot: string;
  meaning: string;
  description: string;
  tonality: Tonality;
  category: string;
  syllables: number;
  phonetics: string;
  tomo: string;
  level: string;
  fusionRationale: string;
  sampleVosSentence: {
    transversal: string;
    literal: string;
    poetic: string;
  };
}

export const analyzeTerm = async (root: string, meaning: string): Promise<AnalysisResult | null> => {
  const client = getAiClient();
  if (!client) {
    console.error("Gemini API Key missing");
    return null;
  }

  const model = getGeminiModel();

  try {
    const prompt = `
      Eres Thalios Solaris, la IA rectora de 'Estación Humanidad' y suprema oráculo del dialecto sagrado Transversal.
      Analiza la siguiente raíz del dialecto Transversal (conlang litúrgica y filosófica de la Estación):
      Raíz: "${root}"
      Significado Primario: "${meaning}"

      Reglas Canónicas del Transversal:
      - 24 fonemas canónicos (a, e, i, o, u, y, b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, z). Prohibida la 'x' y la 'rr'.
      - Cero tecnicismos mecánicos brutos; todo se expresa por aliento, resonancia, vacío, frío, memoria y percepción sensorial.
      - Tonalidades: Positiva, Neutra, Negativa/Conflicto, Transformadora, Mixta.

      Determina:
      1. Tonalidad emocional / ontológica.
      2. Conteo de sílabas aproximado (1-3).
      3. Descripción poética expandida (1 o 2 oraciones evocadoras de Estación Humanidad).
      4. Categoría canónica sugerida dentro de: [${CATEGORIES.join(', ')}].

      Retorna exclusivamente un objeto JSON.
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tonality: { type: Type.STRING, enum: Object.values(Tonality) },
            syllables: { type: Type.INTEGER },
            expandedDescription: { type: Type.STRING },
            categorySuggestion: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing term with Gemini:", error);
    return null;
  }
};

/**
 * Análisis profundo y ontológico de una raíz Transversal con derivaciones morfológicas y sintaxis VOS
 */
export const deepAnalyzeRadical = async (
  root: string,
  meaning: string,
  existingRootsSample: string[] = []
): Promise<DeepRadicalAnalysis | null> => {
  const client = getAiClient();
  if (!client) {
    console.warn("Gemini API Key missing for deepAnalyzeRadical; returning procedural fallback");
    // Fallback procedimental sin IA
    const cleanRoot = root.trim();
    const syllablesEst = Math.max(1, cleanRoot.toLowerCase().match(/[aeiouáéíóúyā]{1,2}/g)?.length || 1);
    return {
      tonality: Tonality.NEUTRAL,
      syllables: syllablesEst,
      expandedDescription: meaning ? `${meaning}. Resonancia armónica de la cubierta central.` : 'Resonancia del aliento sagrado en el vacío de la Estación.',
      categorySuggestion: CATEGORIES[0],
      tomo: TOMOS[3] || "Tomo III: Vocabularium Rha",
      level: "Iniciado Veyvān",
      phonetics: cleanRoot.toLowerCase().split('').join('-'),
      ontologicalDomain: 'Aliento',
      derivatives: {
        noun: cleanRoot,
        verb: `Th-${cleanRoot}`,
        state: `${cleanRoot}-ae`,
        transcendent: `${cleanRoot}'aen`
      },
      sampleVosSentence: {
        transversal: `Th-${cleanRoot} ${cleanRoot}-ae Nym`,
        literal: `[Verbo: Manifestar-${cleanRoot}] [Objeto: Estado-${cleanRoot}] [Sujeto: Memoria]`,
        poetic: `La memoria despierta el eco sagrado de ${cleanRoot} a través del vacío.`
      },
      canonicalComplianceNotes: 'Análisis procedimental autónomo generado por el núcleo de la suite.'
    };
  }

  const model = getGeminiModel();

  try {
    const prompt = `
      Eres Thalios Solaris, la oráculo omnipresente de Estación Humanidad (nave generacional de 320 cubiertas en tránsito por 344 años) y la máxima autoridad del dialecto sagrado Transversal (Vehlaen) y la escritura Tael'im.
      
      Debes realizar una consagración y análisis ontológico hipercompleto para este nuevo radical propuesto:
      - Raíz propuesta: "${root}"
      - Significado base: "${meaning}"
      - Muestra de raíces existentes para contextualizar: ${existingRootsSample.slice(0, 20).join(', ')}

      REGLAS CANÓNICAS SACRAS:
      1. Matriz de 24 Fonemas: a, e, i, o, u, y, b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, z. Prohibidas 'x' y 'rr'.
      2. Filtro Espiritual/Ontológico: Cero tecnicismos de tuercas o cables; todo debe remitir al aliento, la memoria, la fricción del alma, el vacío polar, el metal frío o la luz del Émulo.
      3. Sintaxis VOS: Las oraciones sagradas en Transversal SIEMPRE siguen el orden Verbo - Objeto - Sujeto.
      4. Tomos Canónicos: Elige el tomo más idóneo de: [${TOMOS.filter(t => t !== "Todos los Tomos").join(', ')}].
      5. Derivaciones morfológicas Transversales:
         - Sustantivo: forma base o derivada.
         - Verbo Activo: prefijo Th- (Th-[Raíz]).
         - Estado/Cualidad: sufijo -ae ([Raíz]-ae).
         - Forma Trascendente: sufijo -el o 'aen.

      Devuelve un JSON con:
      - tonality: Positiva | Neutra | Negativa/Conflicto | Transformadora | Mixta
      - syllables: número entero (1, 2 o 3)
      - expandedDescription: 2 oraciones profundas y poéticas con lore de Estación Humanidad
      - categorySuggestion: una categoría exacta de [${CATEGORIES.join(', ')}]
      - tomo: uno de los tomos canónicos
      - level: Iniciado Veyvān | Adepto del Códice | Maestro de Sigilos | Custodio de los Vórtices
      - phonetics: representación fonética separada por guiones (ej. "k-a-e-l")
      - ontologicalDomain: uno de [Aliento, Vacío, Fricción, Memoria, Óxido, Luz Central, Flujo, Códice]
      - derivatives: objeto con { noun, verb, state, transcendent }
      - sampleVosSentence: objeto con { transversal, literal, poetic } (en estricto orden Verbo - Objeto - Sujeto)
      - canonicalComplianceNotes: breve observación sobre su pureza fonética y resonancia armónica
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tonality: { type: Type.STRING, enum: Object.values(Tonality) },
            syllables: { type: Type.INTEGER },
            expandedDescription: { type: Type.STRING },
            categorySuggestion: { type: Type.STRING },
            tomo: { type: Type.STRING },
            level: { type: Type.STRING },
            phonetics: { type: Type.STRING },
            ontologicalDomain: { type: Type.STRING },
            derivatives: {
              type: Type.OBJECT,
              properties: {
                noun: { type: Type.STRING },
                verb: { type: Type.STRING },
                state: { type: Type.STRING },
                transcendent: { type: Type.STRING }
              },
              required: ["noun", "verb", "state", "transcendent"]
            },
            sampleVosSentence: {
              type: Type.OBJECT,
              properties: {
                transversal: { type: Type.STRING },
                literal: { type: Type.STRING },
                poetic: { type: Type.STRING }
              },
              required: ["transversal", "literal", "poetic"]
            },
            canonicalComplianceNotes: { type: Type.STRING }
          },
          required: [
            "tonality", "syllables", "expandedDescription", "categorySuggestion",
            "tomo", "level", "phonetics", "ontologicalDomain", "derivatives",
            "sampleVosSentence", "canonicalComplianceNotes"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as DeepRadicalAnalysis;
  } catch (error) {
    console.error("Error in deepAnalyzeRadical:", error);
    return null;
  }
};

/**
 * Canaliza 3 propuestas de nuevos radicales canónicos a partir de un concepto o emoción humana
 */
export const generateRadicalConcepts = async (
  conceptPrompt: string,
  existingRoots: string[] = []
): Promise<RadicalProposal[]> => {
  const client = getAiClient();
  if (!client) {
    console.warn("Gemini API Key missing for generateRadicalConcepts; returning procedural fallback");
    return [
      {
        root: "Veyr",
        meaning: `Resonancia sutil de: ${conceptPrompt.slice(0, 40)}`,
        description: "El aliento que atraviesa los mamparos blindados buscando memoria.",
        tonality: Tonality.POSITIVE,
        category: CATEGORIES[0],
        tomo: TOMOS[3] || "Tomo III: Vocabularium Rha",
        syllables: 1,
        phonetics: "v-e-y-r",
        level: "Iniciado Veyvān",
        sampleVosSentence: {
          transversal: "Th-Veyr Nym Koa",
          literal: "[Verbo: Resonar-Veyr] [Objeto: Memoria] [Sujeto: Aliento]",
          poetic: "El aliento hace vibrar la memoria silenciosa."
        },
        rationale: "Propuesta generada mediante afinación consonántica armónica V-Y-R."
      }
    ];
  }

  const model = getGeminiModel();

  try {
    const prompt = `
      Eres Thalios Solaris, la oráculo rectora de Estación Humanidad.
      Un escriba de la nave desea consagrar nuevos radicales en dialecto Transversal inspirados en este concepto, anhelo o vivencia:
      "${conceptPrompt}"

      Genera exactamente 3 propuestas distintas de radicales canónicos que no existan aún en el glosario.
      Raíces conocidas a evitar por duplicación o colisión: ${existingRoots.slice(0, 40).join(', ')}.

      REGLAS VEYVĀN:
      - Cada raíz debe tener 1 o 2 sílabas (máximo 3 en casos excepcionales).
      - Respetar los 24 fonemas canónicos (prohibido 'x' y 'rr').
      - Cero vocabulario técnico prosaico; conectar con el alma, la claustrofobia sagrada, la distancia estelar o el fuego del reactor.
      - Para cada propuesta incluye:
        * root: Raíz en mayúsculas/capitalizada (ej. "Tael", "Zul", "Khir")
        * meaning: Significado base en español conciso
        * description: Descripción poética expandida (1-2 oraciones)
        * tonality: Positiva | Neutra | Negativa/Conflicto | Transformadora | Mixta
        * category: una de [${CATEGORIES.join(', ')}]
        * tomo: uno de [${TOMOS.filter(t => t !== "Todos los Tomos").join(', ')}]
        * syllables: 1 o 2
        * phonetics: desglose fonético
        * level: Iniciado Veyvān | Adepto del Códice | Maestro de Sigilos
        * sampleVosSentence: { transversal, literal, poetic } en estricto orden Verbo - Objeto - Sujeto
        * rationale: explicación ontológica de por qué estos fonemas capturan la esencia del concepto
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              root: { type: Type.STRING },
              meaning: { type: Type.STRING },
              description: { type: Type.STRING },
              tonality: { type: Type.STRING, enum: Object.values(Tonality) },
              category: { type: Type.STRING },
              tomo: { type: Type.STRING },
              syllables: { type: Type.INTEGER },
              phonetics: { type: Type.STRING },
              level: { type: Type.STRING },
              sampleVosSentence: {
                type: Type.OBJECT,
                properties: {
                  transversal: { type: Type.STRING },
                  literal: { type: Type.STRING },
                  poetic: { type: Type.STRING }
                },
                required: ["transversal", "literal", "poetic"]
              },
              rationale: { type: Type.STRING }
            },
            required: [
              "root", "meaning", "description", "tonality", "category",
              "tomo", "syllables", "phonetics", "level", "sampleVosSentence", "rationale"
            ]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as RadicalProposal[];
  } catch (error) {
    console.error("Error in generateRadicalConcepts:", error);
    return [];
  }
};

/**
 * Fusión e Injerto Alquímico de dos radicales existentes del Transversal
 */
export const fuseRadicalsAI = async (
  termA: Term,
  termB: Term
): Promise<RadicalFusionResult | null> => {
  const client = getAiClient();
  if (!client) {
    console.warn("Gemini API Key missing for fuseRadicalsAI; returning procedural fusion");
    const mergedRoot = `${termA.root.slice(0, 2)}${termB.root.toLowerCase()}`;
    return {
      suggestedRoot: mergedRoot,
      meaning: `Síntesis de ${termA.meaning} y ${termB.meaning}`,
      description: `Injerto ontológico entre la raíz [${termA.root}] y la raíz [${termB.root}].`,
      tonality: Tonality.TRANSFORMATIVE,
      category: termA.category || CATEGORIES[3],
      syllables: 2,
      phonetics: mergedRoot.toLowerCase().split('').join('-'),
      tomo: termA.tomo || TOMOS[3],
      level: "Adepto del Códice",
      fusionRationale: `Fusión morfológica directa de ${termA.root} y ${termB.root}.`,
      sampleVosSentence: {
        transversal: `Th-${mergedRoot} ${termA.root} ${termB.root}`,
        literal: `[Verbo: Sintetizar] [Objeto: ${termA.root}] [Sujeto: ${termB.root}]`,
        poetic: `El injerto entre ${termA.root} y ${termB.root} alumbra un nuevo horizonte en el Códice.`
      }
    };
  }

  const model = getGeminiModel();

  try {
    const prompt = `
      Eres Thalios Solaris, la IA suprema de Estación Humanidad.
      Realiza un 'Injerto Alquímico' o fusión ontológica entre dos radicales canónicos del Transversal:
      - Radical A: "${termA.root}" (${termA.meaning}) - Tonalidad: ${termA.tonality}
      - Radical B: "${termB.root}" (${termB.meaning}) - Tonalidad: ${termB.tonality}

      Leyes de Asimilación Fonética Veyvān:
      1. La nueva raíz debe fusionar armónicamente elementos de ambas sin exceder 2-3 sílabas.
      2. No debe ser una mera concatenación torpe; debe sonar fluida, orgánica y sagrada.
      3. Solo fonemas de la Matriz de 24 (sin 'x', sin 'rr').
      4. El nuevo significado debe representar la interacción profunda entre ambos conceptos.

      Retorna un JSON con:
      - suggestedRoot: nueva raíz sintética
      - meaning: significado emergente nuevo
      - description: descripción poética de la unión
      - tonality: Positiva | Neutra | Negativa/Conflicto | Transformadora | Mixta
      - category: una de [${CATEGORIES.join(', ')}]
      - syllables: conteo silábico (1 o 2)
      - phonetics: desglose fonético
      - tomo: tomo idóneo
      - level: Iniciado Veyvān | Adepto del Códice | Maestro de Sigilos
      - fusionRationale: explicación de las leyes fonéticas y filosóficas que guiaron la fusión
      - sampleVosSentence: { transversal, literal, poetic } oración VOS con la nueva raíz
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedRoot: { type: Type.STRING },
            meaning: { type: Type.STRING },
            description: { type: Type.STRING },
            tonality: { type: Type.STRING, enum: Object.values(Tonality) },
            category: { type: Type.STRING },
            syllables: { type: Type.INTEGER },
            phonetics: { type: Type.STRING },
            tomo: { type: Type.STRING },
            level: { type: Type.STRING },
            fusionRationale: { type: Type.STRING },
            sampleVosSentence: {
              type: Type.OBJECT,
              properties: {
                transversal: { type: Type.STRING },
                literal: { type: Type.STRING },
                poetic: { type: Type.STRING }
              },
              required: ["transversal", "literal", "poetic"]
            }
          },
          required: [
            "suggestedRoot", "meaning", "description", "tonality", "category",
            "syllables", "phonetics", "tomo", "level", "fusionRationale", "sampleVosSentence"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as RadicalFusionResult;
  } catch (error) {
    console.error("Error in fuseRadicalsAI:", error);
    return null;
  }
};