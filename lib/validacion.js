import { OPCIONES_PRESUPUESTO, OPCIONES_TIEMPO, PERSONAS_MIN, PERSONAS_MAX } from "@/lib/opciones";

const VALORES_PRESUPUESTO = OPCIONES_PRESUPUESTO.map((o) => o.value);
const VALORES_TIEMPO = OPCIONES_TIEMPO.map((o) => o.value);

/**
 * Valida los datos del formulario. Se usa antes de llamar al LLM y antes
 * de crear la Checkout Session, para no mandar datos rotos a ninguna API.
 * Devuelve `null` si todo está bien, o un mensaje de error en español.
 */
export function validarDatosFormulario(datos) {
  if (!datos || typeof datos !== "object") {
    return "Faltan los datos del formulario.";
  }

  const personas = Number(datos.personas);
  if (!Number.isInteger(personas) || personas < PERSONAS_MIN || personas > PERSONAS_MAX) {
    return `La cantidad de personas tiene que ser un número entero entre ${PERSONAS_MIN} y ${PERSONAS_MAX}.`;
  }

  if (!VALORES_PRESUPUESTO.includes(datos.presupuesto)) {
    return "El presupuesto seleccionado no es válido.";
  }

  if (!VALORES_TIEMPO.includes(datos.tiempo)) {
    return "El tiempo para cocinar seleccionado no es válido.";
  }

  if (datos.restricciones !== undefined && datos.restricciones !== null) {
    if (typeof datos.restricciones !== "string") {
      return "Las restricciones tienen que ser texto.";
    }
    if (datos.restricciones.length > 300) {
      return "Las restricciones son demasiado largas (máximo 300 caracteres).";
    }
  }

  return null;
}
