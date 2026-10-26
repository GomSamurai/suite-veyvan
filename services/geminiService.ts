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

export interface AnalysisResult {
  tonality: Tonality;
  syllables: number;
  expandedDescription: string;
  categorySuggestion: string;
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
      Analyze the following fictional or conlang term:
      Root Word: "${root}"
      Basic Meaning: "${meaning}"

      Tasks:
      1. Determine the emotional tonality (Positive, Neutral, Negative/Conflict, Transformative, Mixed).
      2. Count the syllables in the Root Word roughly based on phonetics.
      3. Write a short, poetic, 1-sentence expanded description or nuance for this term.
      4. Suggest the best category from this list: [Emociones y Estados Internos, Conexiones y Relaciones, Sensaciones y Percepciones, Transformaciones y Ciclos, Naturaleza y Elementos, Estados Abstractos y Consciencia, Dinámicas del Cosmos, Impulsos, Acción y Tiempo, Sombras, Crisis y Entorno, Luz y Claridad].

      Return JSON.
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