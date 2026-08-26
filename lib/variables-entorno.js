// Fuente única de verdad de las variables de entorno del proyecto.
// La usa la página /estado para mostrar qué falta configurar.
//
// IMPORTANTE: acá nunca se expone el VALOR de una variable, solo si
// existe o no. El valor de una API key jamás tiene que salir del
// servidor.

/**
 * Descripción de cada variable. `donde` es el link exacto de dónde se
 * saca; `para` explica en una línea para qué sirve.
 */
export const VARIABLES_ENTORNO = [
  {
    nombre: "GEMINI_API_KEY",
    para: "Generar el menú con el modelo de Google (Gemini).",
    donde: "https://aistudio.google.com/apikey",
    usadaEn: "lib/llm.js",
  },
  {
    nombre: "RESEND_API_KEY",
    para: "Mandar el email con el menú completo.",
    donde: "https://resend.com/api-keys",
    usadaEn: "lib/enviar-plan.js",
  },
  {
    nombre: "STRIPE_SECRET_KEY",
    para: "Cobrar: crear el link de pago y verificarlo después.",
    donde: "https://dashboard.stripe.com/test/apikeys",
    usadaEn: "app/api/checkout/route.js · app/exito/page.js",
  },
  {
    nombre: "STRIPE_WEBHOOK_SECRET",
    para: "Comprobar que el aviso de pago viene de Stripe y no de un impostor.",
    donde: "https://dashboard.stripe.com/test/webhooks",
    usadaEn: "app/api/webhooks/stripe/route.js",
  },
  {
    nombre: "NEXT_PUBLIC_BASE_URL",
    para: "La dirección pública de tu app, para volver acá después de pagar.",
    donde: "La URL de tu deploy en Vercel (o http://localhost:3000 en local).",
    usadaEn: "app/api/checkout/route.js",
  },
];

// Se leen una por una y de forma explícita a propósito: Next.js
// reemplaza `process.env.ALGO` durante el build, y eso solo funciona si
// el nombre está escrito literalmente (no con process.env[variable]).
function estaConfigurada(nombre) {
  const valores = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  };

  const valor = valores[nombre];
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Devuelve la lista de variables con un booleano `configurada`.
 * Nunca incluye el valor.
 */
export function estadoVariablesEntorno() {
  return VARIABLES_ENTORNO.map((variable) => ({
    ...variable,
    configurada: estaConfigurada(variable.nombre),
  }));
}
