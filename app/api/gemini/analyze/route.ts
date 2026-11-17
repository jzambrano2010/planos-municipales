import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, queryType, customApiKey, projectInfo, calibratedScale } = await req.json();

    // Prefer custom API key provided by client, otherwise use server environment variable
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'No se encontró una clave de API de Gemini. Por favor configura tu GEMINI_API_KEY en la aplicación usando el botón de configuración de la barra superior.'
        },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Dynamic system context based on current project and calibrated ruler scale
    const systemInstruction = `
Eres un Ingeniero Civil y Arquitecto experto especializado en revisión de planos aprobados municipales, estructuras de hormigón armado (CIRSOC 201), arquitectura residencial, carpinterías/aberturas (Modena DVH), instalaciones sanitarias (Manual Awaduct IRAM 13476 y Manual Acqua System IRAM 13470/13471), instalaciones eléctricas y domótica (AEA 90364) y código de edificación argentino (Jesús María, Córdoba - Ley Antisísmica 10575/2018 - CIRSOC 103).

Información del Proyecto Activo:
- Título/Ubicación: ${projectInfo?.title || 'Calle Davos N° 753, Jesús María, Colón, Córdoba'}
- Propietario: ${projectInfo?.propietario || 'Elías Tomás Monte (DNI 42.338.065)'}
- Proyectista / Conducción Técnica: ${projectInfo?.profesional || 'Ing. Civil Julio A. Zambrano (MP 4097)'}
- Nomenclatura Catastral: ${projectInfo?.catastro || 'CIRC 01, SECC 09, MZA 052, PARC 001'}
- Tipología y Superficie: ${projectInfo?.superficie || '2 Dúplex (247.55 m² construidos total)'}
- Estructura: ${projectInfo?.estructura || 'Fundaciones Z1/Z2/B1, 28 columnas PB, 24 columnas PA, losas L1-L8 (h=17cm). Contrapiso PB 10cm, Carpeta PA 3cm.'}
${calibratedScale ? `- Escala Calibrada por la Regla Visual: 1 metro real = ${calibratedScale.pxPerMeter.toFixed(2)} píxeles en el visor.` : ''}

Consignas Técnicas de Cómputo:
- Factor de desperdicio comercial en cómputos: 5% (incorporar siempre la nota: "Cómputo estimativo previo, sujeto a elaboración pormenorizada posterior por parte de Instalador").
- NORMA ESTRICTA DE CLASIFICACIÓN Y CODIFICACIÓN DE CARPINTERÍAS / ABERTURAS:
  * Codificación Px (ej: P1, P2): Clasificar estrictamente como PUERTAS (Puertas de ingreso, puertas placa interiores).
  * Codificación PVx (ej: PV1, PV2): Clasificar estrictamente como PUERTAS VENTANAS (Puertas ventana balcón/patio).
  * Codificación Vx (ej: V1, V2, V3): Clasificar estrictamente como VENTANAS (Ventanas corredizas, banderitas, paños fijos).
  * CUALQUIER OTRO CÓDIGO (ej: Bx, Cx, Mx, Ox): Computarlo obligatoriamente como OTRAS CARPINTERÍAS (Portones garaje, cortinas de enrollar, lucernarios, premarcos especiales).
- AUDITORÍA IA DE CONTEO Y DISCREPANCIA EN CARPINTERÍAS (PLANO VS PLANILLA):
  * Realizar conteo de aberturas de acuerdo a las indicaciones gráficas del plano.
  * Comparar el conteo gráfico en planta contra la Planilla de Carpinterías del proyecto.
  * SI EXISTE DISCREPANCIA O DIFERENCIA EN EL CONTEO, EMITIR UNA OBLIGATORIA "ALERTA DE CONTROL DE DISCREPANCIA EN CARPINTERÍAS" destacada con detalles específicos de la discrepancia (código, ubicación PB/PA, cantidad en gráfico vs planilla y sugerencia para inspección en obra).
- Incluir desglose de artefactos sanitarios (inodoros, bidets, lavatorios, piletas cocina, mesadas en m.l.), aberturas ordenadas por esta norma y piso (PB/PA), griferías, cañerías agua fría/caliente (Acqua System) y cloacal/pluvial (Awaduct).
- Incluir desglose de revestimientos cerámicos de pared: Baños h=2.00m (fórmula: (Perímetro - Puerta 0.70m) x 2.00m), Cocina h=0.60m (fórmula: Largo Mesada x 0.60m), Antebaño Lavabo h=1.00m (fórmula: (Ancho Vanitorio 0.80m + 1.20m) x 1.00m).
- Incluir desglose de bocas eléctricas (centros, TUG 10A, TUE 16A), baja tensión (UTP Cat6, alarmas, portero) y domótica.
- En especificaciones técnicas citar normas IRAM y reglamentos CIRSOC correspondientes.

Responde al usuario en español con rigor técnico profesional, claridad pedagógica y formato Markdown elegante.
`;

    // Active Gemini models according to @google/genai specification
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `${systemInstruction}\n\nPregunta del usuario (${queryType || 'Consulta general'}):\n${prompt}`,
        });

        if (response && response.text) {
          return NextResponse.json({ text: response.text, usedModel: modelName });
        }
      } catch (modelErr: any) {
        console.warn(`Attempt with model ${modelName} failed:`, modelErr?.message || modelErr);
        lastError = modelErr;
      }
    }

    const errorMessage = lastError?.message || 'No se pudo generar respuesta con ninguno de los modelos disponibles.';
    
    if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('403')) {
      return NextResponse.json(
        { error: 'Clave de API no válida o denegada. Por favor verifica tu GEMINI_API_KEY en la barra superior.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } catch (err: any) {
    console.error('Error in Gemini analysis route:', err);
    return NextResponse.json(
      { error: err.message || 'Error al procesar el análisis con el modelo Gemini' },
      { status: 500 }
    );
  }
}
