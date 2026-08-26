// Fuente única de verdad para los valores de los selects del formulario.
// Se usa en el formulario (UI), en la validación del backend y al armar
// el prompt para el LLM, así los tres lugares quedan sincronizados.

export const OPCIONES_PRESUPUESTO = [
  { value: "ajustado", label: "Ajustado" },
  { value: "medio", label: "Medio" },
  { value: "holgado", label: "Holgado" },
];

export const OPCIONES_TIEMPO = [
  { value: "menos_30", label: "Menos de 30 min" },
  { value: "hasta_1_hora", label: "Hasta 1 hora" },
  { value: "sin_apuro", label: "Sin apuro" },
];

export const PERSONAS_MIN = 1;
export const PERSONAS_MAX = 8;

export function etiquetaPresupuesto(value) {
  return OPCIONES_PRESUPUESTO.find((o) => o.value === value)?.label ?? value;
}

export function etiquetaTiempo(value) {
  return OPCIONES_TIEMPO.find((o) => o.value === value)?.label ?? value;
}
