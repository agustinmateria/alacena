import { Resend } from "resend";

function construirHtmlEmail({ personas, dias, listaDeCompras }) {
  const filasDias = dias
    .map(
      (d) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;">
            <p style="margin:0 0 4px;font-weight:600;color:#18181b;">${d.dia}</p>
            <p style="margin:0;color:#52525b;font-size:14px;">🍽️ Almuerzo: ${d.almuerzo}</p>
            <p style="margin:0;color:#52525b;font-size:14px;">🌙 Cena: ${d.cena}</p>
          </td>
        </tr>`
    )
    .join("");

  const itemsCompras = listaDeCompras.map((item) => `<li style="margin-bottom:4px;">${item}</li>`).join("");

  return `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <h1 style="color:#18181b;font-size:22px;">Tu menú semanal 🥘</h1>
    <p style="color:#52525b;">Armado para ${personas} ${Number(personas) === 1 ? "persona" : "personas"}. ¡Buen provecho!</p>
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">${filasDias}</table>
    <h2 style="color:#18181b;font-size:18px;margin-top:32px;">Lista de compras 🛒</h2>
    <ul style="color:#52525b;padding-left:20px;">${itemsCompras}</ul>
    <p style="color:#a1a1aa;font-size:12px;margin-top:32px;">Enviado por Alacena.</p>
  </div>`;
}

/**
 * Envía el plan semanal completo por email. Se llama desde el webhook de
 * Stripe, una vez confirmado el pago.
 */
export async function enviarPlanPorEmail({ destinatario, personas, dias, listaDeCompras }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(`⚠️  Falta configurar RESEND_API_KEY. No se envió el email a ${destinatario}.`);
    return { enviado: false, motivo: "Falta configurar RESEND_API_KEY" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = construirHtmlEmail({ personas, dias, listaDeCompras });

  // TODO: enviar el email con Resend.
  //
  // En modo de prueba (sin dominio propio verificado en Resend), solo se
  // puede enviar a la MISMA dirección con la que te registraste en
  // resend.com — probá con esa dirección o vas a recibir un error.
  //
  // const { data, error } = await resend.emails.send({
  //   from: "Alacena <onboarding@resend.dev>",
  //   to: destinatario,
  //   subject: "Tu menú semanal de Alacena 🍽️",
  //   html,
  // });
  // if (error) throw new Error(error.message);
  // return { enviado: true, id: data.id };

  console.warn("⚠️  TODO sin completar en lib/enviar-plan.js: el email no se envió realmente.");
  return { enviado: false, motivo: "TODO sin completar en lib/enviar-plan.js" };
}
