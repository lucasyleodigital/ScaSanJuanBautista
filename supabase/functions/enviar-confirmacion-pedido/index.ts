import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const EMAIL_EVA = "sca.sanjuanbautistaonline@gmail.com";

async function enviarEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("Error de Resend:", await res.text());
  }
  return res.ok;
}

function resumenPedidoHtml(pedido: Record<string, any>) {
  return `
    <table style="width:100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
      <tr><td style="padding:4px 0;">Cajas de 3x5L</td><td style="text-align:right;">${pedido.cajas_3x5l}</td></tr>
      <tr><td style="padding:4px 0;">Cajas de 6x2L</td><td style="text-align:right;">${pedido.cajas_6x2l}</td></tr>
      <tr><td style="padding:4px 0;">Envío a</td><td style="text-align:right;">${pedido.destino_envio}</td></tr>
      <tr><td style="padding:8px 0; border-top:1px solid #ddd;"><strong>Total estimado</strong></td><td style="text-align:right; padding:8px 0; border-top:1px solid #ddd;"><strong>${pedido.total_estimado} €</strong></td></tr>
    </table>
  `;
}

// Se dispara desde un Database Webhook de Supabase cada vez que se inserta
// una fila en `pedidos`. Manda dos emails vía Resend: confirmación al
// cliente y aviso a Eva. Si Resend falla, no se reintenta: el pedido ya
// quedó guardado en la base de datos, que es la fuente de verdad real.
Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json();
    const pedido = payload.record;

    if (!pedido) {
      return new Response("Sin datos de pedido", { status: 200 });
    }

    if (pedido.email) {
      await enviarEmail({
        from: "Dehesa de Peñolite <pedidos@dehesapenolite.com>",
        to: [pedido.email],
        subject: "Hemos recibido tu pedido — Dehesa de Peñolite",
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
            <h2 style="color:#6b4f1d;">Gracias por tu pedido, ${pedido.nombre}</h2>
            <p>Hemos recibido correctamente tu pedido de ${pedido.total_litros} litros de aceite de oliva virgen extra. En breve nos pondremos en contacto contigo para confirmar el pago y el envío.</p>
            ${resumenPedidoHtml(pedido)}
            <p style="font-size:13px; color:#555;">Dirección de envío: ${pedido.direccion}, ${pedido.localidad}, ${pedido.codigo_postal}</p>
            <p>Si tienes cualquier duda, responde a este mismo email.</p>
          </div>
        `,
      });
    }

    await enviarEmail({
      from: "Web Dehesa de Peñolite <pedidos@dehesapenolite.com>",
      to: [EMAIL_EVA],
      subject: `Nuevo pedido — ${pedido.nombre} (${pedido.total_litros}L)`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
          <h2>Nuevo pedido en la web</h2>
          <p><strong>${pedido.nombre}</strong> — ${pedido.email ?? "sin email"} — ${pedido.telefono ?? "sin teléfono"}</p>
          ${resumenPedidoHtml(pedido)}
          <p style="font-size:13px; color:#555;">Dirección de envío: ${pedido.direccion}, ${pedido.localidad}, ${pedido.codigo_postal}</p>
          <p style="font-size:13px; color:#555;">Revisa el pedido completo en el Panel de Eva.</p>
        </div>
      `,
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error interno", { status: 500 });
  }
});
