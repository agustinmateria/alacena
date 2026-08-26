import OpenAI from "openai";
import { etiquetaPresupuesto, etiquetaTiempo } from "@/lib/opciones";

// Gemini expone un endpoint compatible con la API de OpenAI, así que
// usamos el SDK de OpenAI apuntando a la baseURL de Google en vez de
// instalar un SDK aparte.
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

function crearClienteGemini() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: GEMINI_BASE_URL });
}

/**
 * Único punto de contacto con el LLM. Devuelve el texto crudo de la
 * respuesta, o `null` si falta la key o todavía no se completó el TODO.
 */
async function llamarLLM(prompt) {
  const cliente = crearClienteGemini();

  if (!cliente) {
    console.warn("⚠️  Falta configurar GEMINI_API_KEY. Usando datos de ejemplo.");
    return null;
  }

  // TODO: llamar al modelo de Gemini con `prompt` y devolver el texto de
  // la respuesta. Pedile al modelo que responda en JSON (response_format)
  // para poder parsearlo después con JSON.parse(). Usá un modelo "Flash"
  // (ej. "gemini-2.5-flash") para que responda rápido.
  //
  // const respuesta = await cliente.chat.completions.create({
  //   model: "gemini-2.5-flash",
  //   messages: [{ role: "user", content: prompt }],
  //   response_format: { type: "json_object" },
  // });
  // return respuesta.choices[0].message.content;

  console.warn("⚠️  TODO sin completar en lib/llm.js: usando datos de ejemplo.");
  return null;
}

function construirContexto({ personas, restricciones, presupuesto, tiempo }) {
  const partes = [
    `- Cantidad de personas: ${personas}`,
    `- Presupuesto: ${etiquetaPresupuesto(presupuesto)}`,
    `- Tiempo para cocinar entre semana: ${etiquetaTiempo(tiempo)}`,
  ];
  if (restricciones && restricciones.trim()) {
    partes.push(`- Restricciones o cosas que no comen: ${restricciones.trim()}`);
  }
  return partes.join("\n");
}

const ADELANTO_DE_EJEMPLO = {
  lunes: {
    almuerzo: "Ensalada tibia de lentejas, tomate y huevo duro",
    cena: "Pollo al horno con puré de calabaza",
  },
  martes: {
    almuerzo: "Fideos con salsa de tomate fresco y albahaca",
    cena: "Tortilla de papa y cebolla con ensalada verde",
  },
};

/**
 * Genera el adelanto gratuito: lunes y martes (almuerzo y cena).
 * Se llama desde POST /api/adelanto.
 */
export async function generarAdelanto(datosFormulario) {
  const prompt = `Sos un nutricionista práctico. Armá un plan de comidas para
dos días (lunes y martes), con almuerzo y cena para cada uno, según estos datos:

${construirContexto(datosFormulario)}

Respondé ÚNICAMENTE con un JSON con esta forma exacta, sin texto extra:
{
  "lunes": { "almuerzo": "...", "cena": "..." },
  "martes": { "almuerzo": "...", "cena": "..." }
}`;

  const respuesta = await llamarLLM(prompt);
  if (!respuesta) return ADELANTO_DE_EJEMPLO;

  try {
    return JSON.parse(respuesta);
  } catch {
    console.error("El LLM no devolvió un JSON válido para el adelanto. Usando datos de ejemplo.");
    return ADELANTO_DE_EJEMPLO;
  }
}

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const SEMANA_DE_EJEMPLO = {
  dias: [
    { dia: "Lunes", almuerzo: "Ensalada tibia de lentejas, tomate y huevo duro", cena: "Pollo al horno con puré de calabaza" },
    { dia: "Martes", almuerzo: "Fideos con salsa de tomate fresco y albahaca", cena: "Tortilla de papa y cebolla con ensalada verde" },
    { dia: "Miércoles", almuerzo: "Arroz con vegetales salteados y tofu", cena: "Sopa de verduras con pan casero" },
    { dia: "Jueves", almuerzo: "Milanesas al horno con puré de papa", cena: "Wrap de pollo con vegetales" },
    { dia: "Viernes", almuerzo: "Guiso de lentejas", cena: "Pizza casera con vegetales" },
    { dia: "Sábado", almuerzo: "Tarta de verdura con ensalada", cena: "Hamburguesas caseras con ensalada" },
    { dia: "Domingo", almuerzo: "Pastel de papa", cena: "Sándwiches de vegetales grillados" },
  ],
  listaDeCompras: [
    "Lentejas",
    "Tomates",
    "Huevos",
    "Pollo",
    "Calabaza",
    "Fideos",
    "Albahaca fresca",
    "Papas",
    "Cebolla",
    "Arroz",
    "Tofu",
    "Pan casero",
    "Pan para wraps",
    "Masa para pizza",
    "Carne para hamburguesas",
    "Vegetales de estación",
  ],
};

/**
 * Genera la semana completa (7 días) más la lista de compras.
 * Se llama desde el webhook, después de confirmar el pago.
 */
export async function generarSemanaCompleta(datosFormulario) {
  const prompt = `Sos un nutricionista práctico. Armá un plan de comidas
completo para los 7 días de la semana (${DIAS_SEMANA.join(", ")}), con
almuerzo y cena para cada día, más una lista de compras consolidada, según
estos datos:

${construirContexto(datosFormulario)}

Respondé ÚNICAMENTE con un JSON con esta forma exacta, sin texto extra:
{
  "dias": [
    { "dia": "Lunes", "almuerzo": "...", "cena": "..." },
    ... (los 7 días)
  ],
  "listaDeCompras": ["...", "..."]
}`;

  const respuesta = await llamarLLM(prompt);
  if (!respuesta) return SEMANA_DE_EJEMPLO;

  try {
    return JSON.parse(respuesta);
  } catch {
    console.error("El LLM no devolvió un JSON válido para la semana completa. Usando datos de ejemplo.");
    return SEMANA_DE_EJEMPLO;
  }
}
