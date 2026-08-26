import { NextResponse } from "next/server";
import Stripe from "stripe";

// TODO: cuando completes el hueco de abajo, descomentá estos dos imports.
// import { generarSemanaCompleta } from "@/lib/llm";
// import { enviarPlanPorEmail } from "@/lib/enviar-plan";

export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Falta configurar STRIPE_SECRET_KEY y/o STRIPE_WEBHOOK_SECRET.");
    return NextResponse.json({ error: "Faltan variables de entorno de Stripe." }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // El body tiene que ser el texto CRUDO, sin parsear. Stripe firma los
  // bytes exactos que mandó; si acá se usara req.json(), Next ya habría
  // parseado el body y la firma nunca coincidiría. Por eso: req.text(),
  // nunca req.json().
  const cuerpoCrudo = await req.text();
  const firma = req.headers.get("stripe-signature");

  // TODO:
  // 1) Verificar la firma con stripe.webhooks.constructEvent(cuerpoCrudo,
  //    firma, process.env.STRIPE_WEBHOOK_SECRET). Si falla, devolver 400
  //    (no 500) para que Stripe no reintente para siempre.
  // 2) Si event.type === "checkout.session.completed":
  //    - leer los datos del formulario de event.data.object.metadata
  //    - leer el email de event.data.object.customer_details.email
  //    - generar los 7 días + lista de compras con generarSemanaCompleta()
  //    - enviarlos por email con enviarPlanPorEmail()
  //
  // try {
  //   const event = stripe.webhooks.constructEvent(cuerpoCrudo, firma, process.env.STRIPE_WEBHOOK_SECRET);
  //
  //   if (event.type === "checkout.session.completed") {
  //     const session = event.data.object;
  //     const datosFormulario = session.metadata;
  //     // En modo test, Resend solo entrega a la misma dirección con la
  //     // que te registraste en resend.com (sin dominio verificado no
  //     // manda a cualquier destinatario).
  //     const destinatario = session.customer_details.email;
  //     const plan = await generarSemanaCompleta(datosFormulario);
  //     await enviarPlanPorEmail({ destinatario, personas: datosFormulario.personas, ...plan });
  //   }
  //
  //   return NextResponse.json({ received: true });
  // } catch (err) {
  //   console.error("Firma de webhook inválida:", err.message);
  //   return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  // }

  console.error("TODO sin completar en /api/webhooks/stripe. Firma recibida:", Boolean(firma));
  return NextResponse.json(
    { error: "TODO sin completar en /api/webhooks/stripe: falta verificar la firma y procesar el evento." },
    { status: 501 }
  );
}
