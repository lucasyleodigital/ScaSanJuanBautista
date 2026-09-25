import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Privacidad | SCA San Juan Bautista de Peñolite",
  robots: { index: false, follow: true },
};

export default function PoliticaPrivacidadPage() {
  return (
    <LegalPageLayout
      title="Política de Privacidad"
      updated="20 de septiembre de 2026"
    >
      <p>
        SCA San Juan Bautista de Peñolite (en adelante, &quot;la
        cooperativa&quot;) es responsable del tratamiento de los datos
        personales que el usuario facilita a través del formulario de
        contacto y del configurador de pedido de este sitio web, de acuerdo
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
          sca.sanjuanbautistaonline@gmail.com
        </li>
      </ul>

      <h2>2. ¿Qué datos recogemos?</h2>
      <p>
        A través del formulario de contacto y del configurador de pedido
        recogemos: nombre, correo electrónico, teléfono, empresa (si
        procede), código postal, tipo de comprador, formato y cantidad de
        producto solicitado, y cualquier mensaje adicional que el usuario
        decida escribir.
      </p>

      <h2>3. ¿Con qué finalidad tratamos tus datos?</h2>
      <p>
        Utilizamos estos datos exclusivamente para gestionar tu solicitud de
        presupuesto o pedido: contactarte por email o teléfono, preparar la
        oferta correspondiente y, si el pedido se confirma, organizar el
        envío. No usamos tus datos para fines comerciales distintos ni
        elaboramos perfiles automatizados.
      </p>

      <h2>4. Legitimación</h2>
      <p>
        La base legal del tratamiento es tu consentimiento, otorgado al
        rellenar y enviar el formulario, y la ejecución de las gestiones
        precontractuales necesarias para atender tu solicitud de compra.
      </p>

      <h2>5. ¿A quién cedemos tus datos?</h2>
      <p>
        No cedemos tus datos a terceros, salvo obligación legal. Para el
        envío técnico de los correos generados por el formulario nos
        apoyamos en un proveedor de mensajería transaccional (Web3Forms),
        que actúa como encargado del tratamiento y solo procesa los datos
        estrictamente necesarios para hacer llegar el correo a su destino.
        Los pedidos y sus datos de contacto también se guardan en una base
        de datos (Supabase) para que la cooperativa pueda gestionarlos.
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
        <a href="mailto:sca.sanjuanbautistaonline@gmail.com">
          sca.sanjuanbautistaonline@gmail.com
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
