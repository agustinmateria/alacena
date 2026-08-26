import Stripe from "stripe";
import { ResultadoPago } from "@/components/resultado-pago";

export const metadata = {
  title: "Confirmando tu pago — Alacena",
};

/**
 * Verifica el pago del lado del servidor. Nunca confiamos en el redirect
 * de Stripe a secas: alguien podría llegar a esta URL con cualquier
 * session_id sin haber pagado, así que siempre se confirma contra la API
 * de Stripe.
 */
async function verificarPago(sessionId) {
  if (!sessionId) {
    return {
      tipo: "no_verificado",
      mensaje: "No encontramos un identificador de pago en la URL.",
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      tipo: "error",
      mensaje: "Falta configurar STRIPE_SECRET_KEY en las variables de entorno.",
    };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // TODO: recuperar la Checkout Session con stripe.checkout.sessions.retrieve
  // y confirmar que session.payment_status === "paid" antes de mostrar el
  // estado "confirmado".
  //
  // try {
  //   const session = await stripe.checkout.sessions.retrieve(sessionId);
  //   if (session.payment_status === "paid") {
  //     return { tipo: "confirmado", email: session.customer_details?.email };
  //   }
  //   return {
  //     tipo: "no_verificado",
  //     mensaje: "Todavía no encontramos la confirmación de tu pago.",
  //   };
  // } catch (error) {
  //   console.error("Error verificando la sesión de pago:", error);
  //   return { tipo: "error", mensaje: "No pudimos verificar la sesión de pago." };
  // }

  console.error("TODO sin completar en /exito. Session ID recibido:", sessionId);
  return {
    tipo: "error",
    mensaje: "TODO sin completar en /exito: falta verificar la sesión de pago con Stripe.",
  };
}

export default async function PaginaExito({ searchParams }) {
  const { session_id: sessionId } = await searchParams;
  const estado = await verificarPago(sessionId);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <ResultadoPago estado={estado} />
      </div>
    </div>
  );
}
