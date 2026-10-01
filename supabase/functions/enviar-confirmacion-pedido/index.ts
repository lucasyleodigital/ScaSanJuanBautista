import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const EMAIL_EVA = "sca.sanjuanbautistaonline@gmail.com";
const LOGO_URL = "https://dehesapenolite.com/images/logo/icon-512.png";

const DORADO = "#c8961e";
const VERDE_NOCHE = "#0c1606";
const CREMA = "#f0e8cc";

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

function filaResumen(label: string, valor: string, destacado = false) {
  return `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #e8ddc0; font-family:Georgia,'Times New Roman',serif; font-size:${destacado ? "16px" : "14px"}; color:${destacado ? VERDE_NOCHE : "#4a4a4a"}; font-weight:${destacado ? "700" : "400"};">
        ${label}
      </td>
      <td style="padding:10px 0; border-bottom:1px solid #e8ddc0; font-family:Georgia,'Times New Roman',serif; font-size:${destacado ? "16px" : "14px"}; color:${destacado ? DORADO : "#4a4a4a"}; font-weight:${destacado ? "700" : "400"}; text-align:right;">
        ${valor}
      </td>
    </tr>
  `;
}

function resumenPedidoHtml(pedido: Record<string, any>) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      ${filaResumen("Cajas de 3 garrafas × 5L", String(pedido.cajas_3x5l ?? 0))}
      ${filaResumen("Cajas de 6 garrafas × 2L", String(pedido.cajas_6x2l ?? 0))}
      ${filaResumen("Envío a", String(pedido.destino_envio ?? "-"))}
      ${filaResumen("Total estimado", `${pedido.total_estimado} €`, true)}
    </table>
  `;
}

/** Envoltorio común de marca para ambos emails: cabecera oscura con logo,
 * cuerpo en crema, pie con el contacto oficial. */
function plantillaEmail(opts: { preheader: string; titulo: string; cuerpoHtml: string }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <body style="margin:0; padding:0; background-color:#e9e2c8; font-family:Georgia,'Times New Roman',serif;">
        <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${opts.preheader}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#e9e2c8; padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(12,22,6,0.08);">
                <tr>
                  <td style="background-color:${VERDE_NOCHE}; padding:28px 32px; text-align:center;">
                    <img src="${LOGO_URL}" width="48" height="48" alt="Dehesa de Peñolite" style="display:block; margin:0 auto 10px;" />
                    <div style="font-family:Georgia,'Times New Roman',serif; font-size:18px; letter-spacing:0.04em; color:${CREMA}; font-weight:700;">
                      DEHESA DE PEÑOLITE
                    </div>
                    <div style="font-family:Arial,sans-serif; font-size:11px; letter-spacing:0.12em; color:${DORADO}; text-transform:uppercase; margin-top:4px;">
                      D.O. Sierra de Segura · Desde 1958
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 32px;">
                    <h1 style="margin:0 0 16px; font-family:Georgia,'Times New Roman',serif; font-size:22px; color:${VERDE_NOCHE};">
                      ${opts.titulo}
                    </h1>
                    ${opts.cuerpoHtml}
                  </td>
                </tr>
                <tr>
                  <td style="background-color:${CREMA}; padding:20px 32px; text-align:center;">
                    <div style="font-family:Arial,sans-serif; font-size:12px; color:#6b6450;">
                      SCA San Juan Bautista de Peñolite · Calle Peñolite, 1, Jaén
                    </div>
                    <div style="font-family:Arial,sans-serif; font-size:12px; color:#6b6450; margin-top:4px;">
                      <a href="mailto:pedidos@dehesapenolite.com" style="color:${DORADO}; text-decoration:none;">pedidos@dehesapenolite.com</a>
                      · +34 953 435 316
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// Se dispara desde un trigger de Postgres (pg_net) cada vez que se inserta
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
        html: plantillaEmail({
          preheader: `Gracias por tu pedido, ${pedido.nombre}. Lo tenemos y te escribimos pronto.`,
          titulo: `Gracias por tu pedido, ${pedido.nombre}`,
          cuerpoHtml: `
            <p style="margin:0 0 8px; font-family:Arial,sans-serif; font-size:15px; line-height:1.6; color:#333;">
              Hemos recibido correctamente tu pedido de <strong>${pedido.total_litros} litros</strong> de aceite de oliva virgen extra Picual. En breve nos pondremos en contacto contigo para confirmar el pago y el envío.
            </p>
            ${resumenPedidoHtml(pedido)}
            <p style="margin:16px 0 0; font-family:Arial,sans-serif; font-size:13px; color:#6b6450;">
              Dirección de envío: ${pedido.direccion}, ${pedido.localidad}, ${pedido.codigo_postal}
            </p>
            <p style="margin:20px 0 0; font-family:Arial,sans-serif; font-size:14px; color:#333;">
              Si tienes cualquier duda, responde directamente a este email.
            </p>
          `,
        }),
      });
    }

    await enviarEmail({
      from: "Web Dehesa de Peñolite <pedidos@dehesapenolite.com>",
      to: [EMAIL_EVA],
      subject: `Nuevo pedido — ${pedido.nombre} (${pedido.total_litros}L)`,
      html: plantillaEmail({
        preheader: `Nuevo pedido de ${pedido.nombre}, ${pedido.total_litros}L.`,
        titulo: "Nuevo pedido en la web",
        cuerpoHtml: `
          <p style="margin:0 0 8px; font-family:Arial,sans-serif; font-size:15px; line-height:1.6; color:#333;">
            <strong>${pedido.nombre}</strong><br/>
            ${pedido.email ? `<a href="mailto:${pedido.email}" style="color:${DORADO};">${pedido.email}</a>` : "sin email"} · ${pedido.telefono ?? "sin teléfono"}
          </p>
          ${resumenPedidoHtml(pedido)}
          <p style="margin:16px 0 0; font-family:Arial,sans-serif; font-size:13px; color:#6b6450;">
            Dirección de envío: ${pedido.direccion}, ${pedido.localidad}, ${pedido.codigo_postal}
          </p>
          <p style="margin:20px 0 0; font-family:Arial,sans-serif; font-size:13px; color:#6b6450;">
            Revisa el pedido completo en el Panel de Eva.
          </p>
        `,
      }),
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error interno", { status: 500 });
  }
});
