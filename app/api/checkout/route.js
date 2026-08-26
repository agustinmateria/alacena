import { NextResponse } from "next/server";
import Stripe from "stripe";
import { validarDatosFormulario } from "@/lib/validacion";

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Falta configurar STRIPE_SECRET_KEY en las variables de entorno." },
      { status: 500 }
    );
  }

  const datos = await req.json();
  const errorValidacion = validarDatosFormulario(datos);
  if (errorValidacion) {
    return NextResponse.json({ error: errorValidacion }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

  // TODO: crear la Checkout Session de Stripe.
  // - Precio inline (sin price ID precargado): usá price_data con
  //   currency, unit_amount (en centavos) y product_data.name.
  // - metadata: guardá acá los 4 campos del formulario (datos.personas,
  //   datos.restricciones, datos.presupuesto, datos.tiempo). No hay base
  //   de datos, así que el webhook los va a leer de vuelta desde acá.
  // - success_url tiene que incluir {CHECKOUT_SESSION_ID} para que
  //   /exito pueda verificar el pago del lado del servidor.
  //
  // const session = await stripe.checkout.sessions.create({
  //   mode: "payment",
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: "usd",
  //         unit_amount: 999, // USD 9.99
  //         product_data: { name: "Menú semanal completo — Alacena" },
  //       },
  //       quantity: 1,
  //     },
  //   ],
  //   metadata: datos,
  //   success_url: `${baseUrl}/exito?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${baseUrl}/cancelado`,
  // });
  // return NextResponse.json({ url: session.url });

  return NextResponse.json(
    { error: "TODO sin completar en /api/checkout: falta crear la Checkout Session de Stripe." },
    { status: 501 }
  );
}
