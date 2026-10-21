import { CalligramGeometry, CalligramPalette, CalligramAiInsight } from '../types';
import { getAiClient, getGeminiModel } from './geminiService';
import { MASTER_CONSTRUCCION_PROMPT } from '../data/canonicalLoreConstruccion';
import { Type } from '@google/genai';

/**
 * SERVICIO INTELIGENTE DE VISIÓN Y ONTOLOGÍA CALIGRÁFICA // PROTOCOLO TAEL'VOHN
 * Oráculo erudito que interpreta las vibraciones conceptuales de una expresión en Dialecto Transversal
 * y determina su geometría sagrada arquetípica y su carga cromática según la teología de Estación Humanidad.
 */

// Respaldo heurístico canónico e infalible
export function getHeuristicCalligramInsight(expression: string): CalligramAiInsight {
  const lower = expression.toLowerCase();

  // 1. Detección de Geometría
  let geometry: CalligramGeometry = 'mandala';
  let geomRationale = 'La cadencia armónica y equilibrada de la enunciación requiere una distribución orbital concéntrica alrededor del núcleo sagrado (Koa), canalizando la contemplación cíclica.';

  if (lower.includes('dran') || lower.includes('amtti') || lower.includes('kael') || lower.includes('tam') || lower.includes('friccion') || lower.includes('despertar')) {
    geometry = 'delta';
    geomRationale = 'La tensión de fricción y el anhelo de salto evolutivo exigen el Delta Sagrado de tres vértices: la base sostiene el esfuerzo material mientras el vértice superior proyecta la mutación de la consciencia.';
  } else if (lower.includes('khaen') || lower.includes('dua') || lower.includes('khuva') || lower.includes('siv') || lower.includes('resistencia') || lower.includes('paz')) {
    geometry = 'diamante';
    geomRationale = 'La expresión invoca contención interior y templo invulnerable ante el abismo; el Diamante de Contención proyecta cuatro esquinas de equilibrio que protegen la fibra íntima de la entropía exterior.';
  } else if (lower.includes('kosmir') || lower.includes('khor') || lower.includes('rhea') || lower.includes('infinito') || lower.includes('red') || lower.includes('universo')) {
    geometry = 'infinito';
    geomRationale = 'El flujo ininterrumpido de consciencia y el entrelazamiento de almas requieren el Lazo Infinito de Kosmir, disolviendo el principio y el fin en una lemniscata de retorno eterno.';
  } else if (lower.includes('vas') || lower.includes('dun') || lower.includes('thy') || lower.includes('juramento') || lower.includes('alévoro') || lower.includes('monolito')) {
    geometry = 'estela';
    geomRationale = 'La solemnidad ceremonial y la jerarquía de los estratos sagrados del Émulo reclaman la Estela Monolítica Algante: un tótem vertical entrelazado donde cada radical se eleva sobre el precedente como testimonio inmutable.';
  } else if (lower.includes('flujo') || lower.includes('aliento') || lower.includes('vira') || lower.includes('asémico') || lower.includes('niebla') || lower.includes('vhaer')) {
    geometry = 'asemic';
    geomRationale = 'La naturaleza inefable del aliento rehúsa las jaulas métricas convencionales; la expresión demanda el Monotrazado Asémico continuo, uniendo todos los nexos fónicos en una sola exhalación líquida.';
  }

  // 2. Detección de Paleta Cromática
  let palette: CalligramPalette = 'uniae';
  let palRationale = 'Resonancia en Plasma de Vacío (Uniae): azul cian sereno que calma la vibración mental y convoca la paz de la contemplación pura.';

  if (lower.includes('vim') || lower.includes('dran') || lower.includes('fuego') || lower.includes('valniae') || lower.includes('pasion') || lower.includes('alerta')) {
    palette = 'valniae';
    palRationale = 'Carga en Fuego de Fricción (Valniae): escarlata vivo y rubí de tensión sagrada, invocando el calor de la batalla interior contra el letargo de la carne.';
  } else if (lower.includes('eos') || lower.includes('ael') || lower.includes('luz') || lower.includes('iloniae') || lower.includes('sabiduria') || lower.includes('oro')) {
    palette = 'iloniae';
    palRationale = 'Vibración en Oro Litúrgico (Iloniae): resplandor áureo del Émulo reservado a las verdades de estado y a la elevación de los maestros Veyvān.';
  } else if (lower.includes('rha') || lower.includes('nor') || lower.includes('tyniae') || lower.includes('semilla') || lower.includes('tierra') || lower.includes('brote')) {
    palette = 'tyniae';
    palRationale = 'Tono de Regeneración de la Semilla (Tyniae): esmeralda bio-luminiscente que recuerda el sueño celular de los bosques perdidos de la Cuna.';
  } else if (lower.includes('dae') || lower.includes('zael') || lower.includes('enniae') || lower.includes('arcano') || lower.includes('misterio') || lower.includes('sombra')) {
    palette = 'enniae';
    palRationale = 'Frecuencia en Púrpura Arcano (Enniae): violeta abisal que custodia los secretos no revelados y los tránsitos de la sombra que fecundan la luz.';
  } else if (lower.includes('rha-min') || lower.includes('cubierta') || lower.includes('metal') || lower.includes('oxido') || lower.includes('mamparo')) {
    palette = 'oxidado';
    palRationale = 'Acero de Mamparo y Humo (Oxidado): grafito sobrio y austero que honra la tenacidad de las cubiertas bajas y la resistencia sin adorno.';
  } else if (lower.includes('anniae') || lower.includes('blanco') || lower.includes('puro') || lower.includes('origen') || lower.includes('esperanza')) {
    palette = 'anniae';
    palRationale = 'Luz Pura de la Cuna (Anniae): blancura diamantina inmaculada que evoca el rocío del amanecer terrestre antes del gran viaje.';
  }

  return {
    sacredMeaning: `En este sigilo, la enunciación «${expression}» colapsa la distancia entre el sonido y la geometría. Los nexos fónicos de sus raíces se entrelazan formando un cuerpo visual que actúa como canalizador del Rhea: el observador no lee meramente caracteres, sino que contempla la arquitectura de una intención inmortal tallada en la materia del alma.`,
    recommendedGeometry: geometry,
    geometryRationale: geomRationale,
    recommendedPalette: palette,
    paletteRationale: palRationale,
    contemplationMantra: 'Inhala en el centro del glifo primario; exhala siguiendo el arco de vínculo hasta que la mente se vuelva transparente como el mamparo ante las estrellas.'
  };
}

/**
 * Consulta la IA avanzada con visión ontológica para asesorar en la forja de un caligrama sagrado.
 */
export async function analyzeCalligramOntology(expression: string): Promise<CalligramAiInsight> {
  const client = getAiClient();
  const fallback = getHeuristicCalligramInsight(expression);

  if (!client || !expression.trim()) {
    return fallback;
  }

  const model = getGeminiModel();

  const prompt = `
${MASTER_CONSTRUCCION_PROMPT}

Eres el Gran Maestro Escriba Veyvān y Maestro de Geometría Sagrada Tael'im de la Estación Humanidad.
Has sido convocado a la Forja de Sigilos del Rhea (Tael'vohn) para contemplar la siguiente enunciación sagrada en Dialecto Transversal:

«${expression}»

Tu tarea es realizar un análisis ontológico y visual supremo de esta composición caligráfica.

DIRECTRICES FUNDAMENTALES:
1. IDIOMA: Responde EXCLUSIVAMENTE en ESPAÑOL elevado, poético y filosófico. Está TERMINANTEMENTE PROHIBIDO usar palabras en inglés o anglicismos (nada de "canvas", "presets", "feedback", "layout", "input", etc.).
2. FIDELIDAD AL LORE: Respeta la doctrina de Estación Humanidad (344 años de viaje en el vacío interestelar, el Émulo, las cubiertas polares, Joren Thalvus, Vorlëmm Hatz, los Alévoros, la sintaxis VOS y la geometría Tael'im).
3. DETERMINACIÓN DE GEOMETRÍA SAGRADA: Elige EXACTAMENTE uno de los siguientes valores para "recommendedGeometry":
   - "mandala" (Sello Orbital concéntrico; para armonía, meditación, paz o proverbios cerrados).
   - "estela" (Totem vertical jerárquico; para juramentos, autoridad, historia y solemnidad ceremonial).
   - "delta" (Triángulo de Fricción; para sufrimiento templador, mutación, despertar espiritual o superación).
   - "diamante" (Rombo de Contención; para invulnerabilidad, templanza, secreto, silencio y custodia del núcleo).
   - "infinito" (Lazo Lemniscata de Kosmir; para interconexión universal, la Red, el amor indestructible o el retorno cíclico).
   - "asemic" (Monotrazado continuo y fluido del aliento; para emociones inefables, misticismo y flujo puro del Rhea).
4. DETERMINACIÓN DE PALETA CROMÁTICA SAGRADA: Elige EXACTAMENTE uno de los siguientes valores para "recommendedPalette":
   - "iloniae" (Oro Litúrgico del Émulo; sabiduría y verdad trascendental).
   - "uniae" (Plasma de Vacío; serenidad y calma mental límpida).
   - "valniae" (Fuego de Fricción; pasión, peligro sagrado y lucha interior).
   - "anniae" (Luz Pura de la Cuna; memoria de la Tierra, inocencia y pureza).
   - "enniae" (Púrpura Arcano; secreto, poder interior y misterio).
   - "tyniae" (Regeneración de la Semilla; brote verde, crecimiento y sanación).
   - "oxidado" (Acero de Mamparo; sobriedad austera de las cubiertas bajas).

Devuelve tu respuesta en formato JSON con la siguiente estructura:
- "sacredMeaning": Explicación ontológica y poética profunda del significado trascendental del sigilo (2-3 oraciones lúcidas).
- "recommendedGeometry": Uno de los 6 valores permitidos.
- "geometryRationale": Justificación filosófica de por qué esta geometría sagrada manifiesta el alma de la frase.
- "recommendedPalette": Uno de los 7 valores permitidos.
- "paletteRationale": Explicación de la carga vibratoria del color seleccionado.
- "contemplationMantra": Una breve indicación o guía de respiración y contemplación meditativa para el observador del caligrama.
`;

  try {
    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sacredMeaning: { type: Type.STRING },
            recommendedGeometry: { 
              type: Type.STRING, 
              enum: ['mandala', 'estela', 'delta', 'diamante', 'infinito', 'asemic'] 
            },
            geometryRationale: { type: Type.STRING },
            recommendedPalette: { 
              type: Type.STRING, 
              enum: ['iloniae', 'uniae', 'valniae', 'anniae', 'enniae', 'tyniae', 'oxidado'] 
            },
            paletteRationale: { type: Type.STRING },
            contemplationMantra: { type: Type.STRING }
          },
          required: [
            'sacredMeaning', 
            'recommendedGeometry', 
            'geometryRationale', 
            'recommendedPalette', 
            'paletteRationale', 
            'contemplationMantra'
          ]
        }
      }
    });

    const text = response.text;
    if (!text) return fallback;

    const parsed = JSON.parse(text) as CalligramAiInsight;
    return {
      sacredMeaning: parsed.sacredMeaning || fallback.sacredMeaning,
      recommendedGeometry: parsed.recommendedGeometry || fallback.recommendedGeometry,
      geometryRationale: parsed.geometryRationale || fallback.geometryRationale,
      recommendedPalette: parsed.recommendedPalette || fallback.recommendedPalette,
      paletteRationale: parsed.paletteRationale || fallback.paletteRationale,
      contemplationMantra: parsed.contemplationMantra || fallback.contemplationMantra
    };
  } catch (error) {
    console.warn("Fallo en la consulta ontológica con Gemini, utilizando sabiduría canónica de respaldo:", error);
    return fallback;
  }
}

export interface GeneratedSigilResult {
  expression: string;
  label: string;
  sacredMeaning: string;
  recommendedGeometry: CalligramGeometry;
  recommendedPalette: CalligramPalette;
  arcStyle: 'continuo' | 'punteado' | 'pulsos' | 'doble';
  arcTension: number;
  sacredScale: number;
}

/**
 * Genera una fórmula e intención sagrada completa en Transversal a partir de una idea del usuario en español.
 */
export async function generateSigilFromPrompt(userIdea: string): Promise<GeneratedSigilResult> {
  const cleanIdea = userIdea.trim().toLowerCase();

  // Respaldo heurístico erudito si Gemini no está configurado o falla
  let fallbackResult: GeneratedSigilResult = {
    expression: "Kael'Dran ·· Sol'Khor",
    label: "Despertar del Aliento Colectivo",
    sacredMeaning: "Invocación de la mutación de la consciencia colectiva en los mamparos ante la inmensidad del viaje estelar.",
    recommendedGeometry: "delta",
    recommendedPalette: "uniae",
    arcStyle: "continuo",
    arcTension: 55,
    sacredScale: 1.8
  };

  if (cleanIdea.includes('amor') || cleanIdea.includes('union') || cleanIdea.includes('distancia') || cleanIdea.includes('alma') || cleanIdea.includes('afecto')) {
    fallbackResult = {
      expression: "Thima · Varin'Vim ·· Vor'aen · Nu-Dar",
      label: "Amor y Distancia Sagrada",
      sacredMeaning: "El lazo inquebrantable que une a dos consciencias separadas por cubiertas polares e incontables años-luz.",
      recommendedGeometry: "infinito",
      recommendedPalette: "iloniae",
      arcStyle: "doble",
      arcTension: 75,
      sacredScale: 1.6
    };
  } else if (cleanIdea.includes('juramento') || cleanIdea.includes('honor') || cleanIdea.includes('orden') || cleanIdea.includes('pacto') || cleanIdea.includes('fidelidad')) {
    fallbackResult = {
      expression: "Dun'Val'Thy",
      label: "Juramento Solemne Alévoro",
      sacredMeaning: "Pacto de obsidiana inquebrantable grabado en el estrato más alto del Templo.",
      recommendedGeometry: "estela",
      recommendedPalette: "iloniae",
      arcStyle: "continuo",
      arcTension: 40,
      sacredScale: 2.4
    };
  } else if (cleanIdea.includes('proteccion') || cleanIdea.includes('defensa') || cleanIdea.includes('refugio') || cleanIdea.includes('templo') || cleanIdea.includes('paz') || cleanIdea.includes('seguridad')) {
    fallbackResult = {
      expression: "Khuva'na'Siv · Dua'Khaen",
      label: "Santuario de Contención Interior",
      sacredMeaning: "Custodia de la fibra pura del espíritu ante la hostilidad térmica del espacio exterior.",
      recommendedGeometry: "diamante",
      recommendedPalette: "enniae",
      arcStyle: "continuo",
      arcTension: 60,
      sacredScale: 2.1
    };
  } else if (cleanIdea.includes('fuego') || cleanIdea.includes('friccion') || cleanIdea.includes('lucha') || cleanIdea.includes('fuerza') || cleanIdea.includes('poder') || cleanIdea.includes('guerra')) {
    fallbackResult = {
      expression: "Dran'Valniae ·· Kael'Vas",
      label: "Fricción y Ascenso del Fuego Sagrado",
      sacredMeaning: "La transmutación del sufrimiento en potencia evolutiva para resistir la fatiga de los mamparos.",
      recommendedGeometry: "delta",
      recommendedPalette: "valniae",
      arcStyle: "pulsos",
      arcTension: 70,
      sacredScale: 2.2
    };
  } else if (cleanIdea.includes('semilla') || cleanIdea.includes('tierra') || cleanIdea.includes('vida') || cleanIdea.includes('esperanza') || cleanIdea.includes('renacer')) {
    fallbackResult = {
      expression: "Rha'tyniae ·· Vor-Vira",
      label: "Regeneración del Brote Primordial",
      sacredMeaning: "Sello bio-luminiscente que alimenta la memoria de los bosques de la Cuna y la germinación futura.",
      recommendedGeometry: "mandala",
      recommendedPalette: "tyniae",
      arcStyle: "continuo",
      arcTension: 50,
      sacredScale: 2.0
    };
  } else if (cleanIdea.includes('vacio') || cleanIdea.includes('silencio') || cleanIdea.includes('estrellas') || cleanIdea.includes('cosmos') || cleanIdea.includes('abismo')) {
    fallbackResult = {
      expression: "Vael'nu'Siv ·· Vael'Vim",
      label: "Resonancia del Abismo Cósmico",
      sacredMeaning: "Contemplación lúcida del vacío entre estrellas como madre de todo potencial energético.",
      recommendedGeometry: "mandala",
      recommendedPalette: "uniae",
      arcStyle: "punteado",
      arcTension: 55,
      sacredScale: 2.1
    };
  }

  const client = getAiClient();
  if (!client) {
    return fallbackResult;
  }

  const model = getGeminiModel();
  const prompt = `
${MASTER_CONSTRUCCION_PROMPT}

Eres el Gran Maestro Escriba Veyvān y Creador Supremo de Sigilos Tael'vohn.
Un iniciado te solicita un sigilo caligráfico para la siguiente intención conceptual:
«${userIdea}»

Genera un sigilo sagrado completo con una expresión en Dialecto Transversal auténtico (respetando la sintaxis VOS, prefijos temporales como Vor-/Min-, infijos como -aen-, sufijos como -Vim/-Dran/-Dar, partículas relacionales como 'na, 'nu, 'vi y pausas fónicas · o ··).

NORMAS SUPREMAS:
1. Idioma: EXCLUSIVAMENTE ESPAÑOL sin anglicismos.
2. La expresión en Transversal debe usar raíces reales (Vael, Thima, Dun, Val, Thy, Kael, Dran, Koa, Khor, Eli, Dua, Khaen, Khuva, Siv, Rha, Vor, Min, Sol, Vim, Vira, Sha, Vas, etc.).
3. recommendedGeometry debe ser uno de: "mandala", "estela", "delta", "diamante", "infinito", "asemic".
4. recommendedPalette debe ser uno de: "iloniae", "uniae", "valniae", "anniae", "enniae", "tyniae", "oxidado".
5. arcStyle debe ser uno de: "continuo", "punteado", "pulsos", "doble".
6. sacredScale: número entre 1.5 y 3.5 para garantizar que la composición llene el lienzo de forma sublime sin dejar espacios vacíos desproporcionados.
`;

  try {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            expression: { type: Type.STRING },
            label: { type: Type.STRING },
            sacredMeaning: { type: Type.STRING },
            recommendedGeometry: { 
              type: Type.STRING, 
              enum: ['mandala', 'estela', 'delta', 'diamante', 'infinito', 'asemic'] 
            },
            recommendedPalette: { 
              type: Type.STRING, 
              enum: ['iloniae', 'uniae', 'valniae', 'anniae', 'enniae', 'tyniae', 'oxidado'] 
            },
            arcStyle: {
              type: Type.STRING,
              enum: ['continuo', 'punteado', 'pulsos', 'doble']
            },
            arcTension: { type: Type.NUMBER },
            sacredScale: { type: Type.NUMBER }
          },
          required: [
            'expression', 'label', 'sacredMeaning', 'recommendedGeometry', 
            'recommendedPalette', 'arcStyle', 'arcTension', 'sacredScale'
          ]
        }
      }
    });

    const text = response.text;
    if (!text) return fallbackResult;
    const parsed = JSON.parse(text);
    return {
      expression: parsed.expression || fallbackResult.expression,
      label: parsed.label || fallbackResult.label,
      sacredMeaning: parsed.sacredMeaning || fallbackResult.sacredMeaning,
      recommendedGeometry: parsed.recommendedGeometry || fallbackResult.recommendedGeometry,
      recommendedPalette: parsed.recommendedPalette || fallbackResult.recommendedPalette,
      arcStyle: parsed.arcStyle || fallbackResult.arcStyle,
      arcTension: typeof parsed.arcTension === 'number' ? parsed.arcTension : fallbackResult.arcTension,
      sacredScale: typeof parsed.sacredScale === 'number' ? Math.min(5.0, Math.max(1.2, parsed.sacredScale)) : fallbackResult.sacredScale
    };
  } catch (err) {
    console.warn("Fallo al generar sigilo por IA, aplicando resultado heurístico:", err);
    return fallbackResult;
  }
}

/**
 * Auto-armoniza la composición caligráfica completa calculando proporciones áureas,
 * escala óptima para ocupar el lienzo y tensiones armónicas.
 */
export function autoHarmonizeComposition(
  expression: string, 
  unitsCount: number,
  currentGeometry: CalligramGeometry
): {
  recommendedScale: number;
  recommendedGap: number;
  recommendedTension: number;
  recommendedIntertwine: number;
  customTransforms: Record<number, { index: number; offsetX: number; offsetY: number; rotation: number; scale: number }>;
  explanation: string;
} {
  const count = Math.max(1, unitsCount);
  
  // 1. Escala óptima según densidad para no dejar espacios muertos
  let recommendedScale = 1.6;
  if (count === 1) {
    recommendedScale = 3.6; // Ocupa todo el centro con grandeza
  } else if (count === 2) {
    recommendedScale = 2.6;
  } else if (count === 3) {
    recommendedScale = 2.1;
  } else if (count === 4) {
    recommendedScale = 1.75;
  } else if (count >= 5) {
    recommendedScale = 1.35;
  }

  let recommendedGap = 130;
  let recommendedTension = 55;
  let recommendedIntertwine = 35;

  const transforms: Record<number, { index: number; offsetX: number; offsetY: number; rotation: number; scale: number }> = {};

  if (currentGeometry === 'estela') {
    recommendedGap = count <= 2 ? 260 : (count === 3 ? 180 : 130);
    recommendedTension = 35;
    // Proporción áurea jerárquica vertical
    for (let i = 0; i < count; i++) {
      const isTop = i === 0;
      const isBottom = i === count - 1;
      transforms[i] = {
        index: i,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scale: isTop ? 1.15 : (isBottom ? 0.95 : 1.05)
      };
    }
  } else if (currentGeometry === 'mandala') {
    recommendedGap = 140;
    recommendedTension = 65;
    // Armonización orbital con ligeros ángulos de resonancia
    for (let i = 0; i < count; i++) {
      transforms[i] = {
        index: i,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scale: 1.0 + (i % 2 === 0 ? 0.08 : -0.05)
      };
    }
  } else if (currentGeometry === 'delta') {
    recommendedGap = 160;
    recommendedTension = 70;
    for (let i = 0; i < count; i++) {
      transforms[i] = {
        index: i,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scale: i === 0 ? 1.25 : 1.0
      };
    }
  } else {
    for (let i = 0; i < count; i++) {
      transforms[i] = {
        index: i,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
        scale: 1.0
      };
    }
  }

  return {
    recommendedScale,
    recommendedGap,
    recommendedTension,
    recommendedIntertwine,
    customTransforms: transforms,
    explanation: `Armonización áurea completada para ${count} radical${count > 1 ? 'es' : ''}. Se ha recalibrado la escala a ${recommendedScale.toFixed(2)}x para maximizar el uso sagrado del lienzo eliminando vacíos, equilibrando los nexos fónicos con tensión de arco ${recommendedTension}.`
  };
}
