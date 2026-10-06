import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Privacidad | SCA San Juan Bautista de Peñolite",
  alternates: { canonical: "/politica-privacidad" },
  robots: { index: false, follow: true },
};

export default function PoliticaPrivacidadPage() {
  return (
    <LegalPageLayout
      title="Política de Privacidad"
      updated="6 de octubre de 2026"
    >
      <p>
        SCA San Juan Bautista de Peñolite (en adelante, &quot;la
        cooperativa&quot;) es responsable del tratamiento de los datos
        personales que el usuario facilita a través del configurador de pedido
        y de los medios de contacto de este sitio web, de acuerdo
        con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de
        Protección de Datos Personales y garantía de los derechos digitales
        (LOPD-GDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>
          <strong>Responsable:</strong> SCA San Juan Bautista de Peñolite
        </li>
        <li>
          <strong>CIF:</strong> F23006992
        </li>
        <li>
          <strong>Domicilio:</strong> Calle Peñolite, 1, Peñolite (Puente de
          Génave), Jaén
        </li>
        <li>
          <strong>Contacto para asuntos de privacidad:</strong>{" "}
          info@dehesapenolite.com
        </li>
      </ul>

      <h2>2. ¿Qué datos recogemos?</h2>
      <p>
        A través del configurador de pedido recogemos: nombre y apellidos,
        correo electrónico, teléfono, dirección de entrega (calle, localidad
        y código postal), tipo de comprador (particular, hostelería o
        distribuidor), formato y cantidad de producto solicitado, y el
        importe estimado del pedido. Si nos escribes por correo electrónico
        o por WhatsApp, tratamos además los datos que tú mismo nos facilites
        en esa conversación.
      </p>

      <h2>3. ¿Con qué finalidad tratamos tus datos?</h2>
      <p>
        Utilizamos estos datos exclusivamente para gestionar tu solicitud de
        presupuesto o pedido: contactarte por email o teléfono, preparar la
        oferta correspondiente y, si el pedido se confirma, organizar el
        envío y el cobro, que se realiza directamente a la cooperativa por
        Bizum o transferencia bancaria. No usamos tus datos para fines comerciales distintos ni
        elaboramos perfiles automatizados.
      </p>

      <p>
        <strong>Protección frente a envíos automáticos (bots).</strong>
      </p>
      <p>
        Para evitar pedidos falsos o automatizados, el formulario de pedido
        incorpora una comprobación anti-bots de Cloudflare (Cloudflare
        Turnstile). Este servicio analiza, en el momento de enviar el
        formulario, datos técnicos de tu navegador y tu dirección IP para
        distinguir a una persona de un programa automático. Lo utilizamos
        por nuestro interés legítimo en la seguridad del sitio web y no se
        emplea con fines publicitarios ni de elaboración de perfiles.
      </p>

      <h2>4. Legitimación</h2>
      <p>
        La base legal del tratamiento es tu consentimiento, otorgado al
        rellenar y enviar el formulario, y la ejecución de las gestiones
        precontractuales y contractuales necesarias para atender tu
        solicitud de compra. La comprobación anti-bots se basa en el interés
        legítimo de la cooperativa en proteger el sitio web.
      </p>

      <h2>5. ¿A quién cedemos tus datos?</h2>
      <p>
        No cedemos tus datos a terceros para sus propios fines, salvo
        obligación legal. Para poder prestar el servicio nos apoyamos en
        proveedores que actúan como encargados del tratamiento y solo tratan
        los datos necesarios para su función:
      </p>
      <ul>
        <li>
          <strong>Supabase:</strong> base de datos donde se guardan los
          pedidos y sus datos de contacto para que la cooperativa pueda
          gestionarlos.
        </li>
        <li>
          <strong>Resend y Web3Forms:</strong> envío de los correos de
          confirmación al cliente y de aviso de pedido a la cooperativa.
        </li>
        <li>
          <strong>Cloudflare:</strong> gestión del dominio y del correo
          electrónico de la cooperativa, y comprobación anti-bots
          (Turnstile).
        </li>
        <li>
          <strong>Vercel:</strong> alojamiento del sitio web.
        </li>
      </ul>
      <p>
        Algunos de estos proveedores pueden tratar datos fuera del Espacio
        Económico Europeo; en ese caso, la transferencia se ampara en las
        garantías previstas en el RGPD (como las cláusulas contractuales
        tipo o el Marco de Privacidad de Datos UE-EE. UU.).
      </p>

      <h2>6. ¿Cuánto tiempo conservamos tus datos?</h2>
      <p>
        Conservamos los datos del formulario mientras dure la gestión de tu
        solicitud o pedido, y posteriormente durante los plazos legalmente
        exigibles (por ejemplo, obligaciones fiscales y contables), tras lo
        cual se eliminan o anonimizan.
      </p>

      <h2>7. Tus derechos</h2>
      <p>
        Puedes ejercer tus derechos de acceso, rectificación, supresión,
        oposición, limitación del tratamiento y portabilidad de tus datos
        escribiendo a{" "}
        <a href="mailto:info@dehesapenolite.com">
          info@dehesapenolite.com
        </a>
        , indicando el derecho que deseas ejercer y adjuntando copia de un
        documento que acredite tu identidad. También puedes presentar una
        reclamación ante la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          www.aepd.es
        </a>
        ) si consideras que tus derechos no se han respetado.
      </p>

      <h2>8. Menores de edad</h2>
      <p>
        Este sitio web no está dirigido a menores de 14 años. No recogemos
        conscientemente datos de menores de esa edad.
      </p>

      <h2>9. Seguridad</h2>
      <p>
        Aplicamos las medidas técnicas y organizativas razonables para
        proteger tus datos personales frente a accesos no autorizados,
        pérdida o alteración.
      </p>
    </LegalPageLayout>
  );
}
