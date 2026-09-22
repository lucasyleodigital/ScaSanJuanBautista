import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Aviso Legal | SCA San Juan Bautista de Peñolite",
  robots: { index: false, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <LegalPageLayout title="Aviso Legal" updated="20 de septiembre de 2026">
      <p>
        En cumplimiento del deber de información recogido en el artículo 10 de
        la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se facilitan los
        siguientes datos:
      </p>

      <h2>1. Titular del sitio web</h2>
      <ul>
        <li>
          <strong>Razón social:</strong> SCA San Juan Bautista de Peñolite
        </li>
        <li>
          <strong>CIF:</strong> F23006992
        </li>
        <li>
          <strong>Domicilio social:</strong> Calle Peñolite, 1, Peñolite
          (Puente de Génave), Jaén
        </li>
        <li>
          <strong>Inscripción registral:</strong> Registro de Sociedades
          Cooperativas Andaluzas,{" "}
          <span className="placeholder">[número de inscripción pendiente]</span>
        </li>
        <li>
          <strong>Correo electrónico:</strong> sca.sanjuanbautistaonline@gmail.com
        </li>
        <li>
          <strong>Teléfono:</strong> +34 953 435 316
        </li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web tiene por objeto informar sobre la actividad de la
        cooperativa y sus productos, y facilitar a los usuarios un canal de
        contacto para solicitar presupuestos y pedidos de Aceite de Oliva
        Virgen Extra. La contratación efectiva del pedido (confirmación de
        cantidad, precio final, forma de pago y envío) se cierra siempre por
        correo electrónico o teléfono directamente con la cooperativa, no de
        forma automática a través del formulario web.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        El acceso y uso de este sitio web atribuye la condición de usuario y
        supone la aceptación de las condiciones aquí establecidas. El usuario
        se compromete a hacer un uso adecuado de los contenidos y servicios
        que se ofrecen y a no emplearlos para incurrir en actividades
        ilícitas o contrarias a la buena fe y al ordenamiento legal.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Los textos, imágenes, diseño gráfico y demás contenidos de este sitio
        web son titularidad de SCA San Juan Bautista de Peñolite o se
        utilizan con la correspondiente autorización, y están protegidos por
        la normativa de propiedad intelectual e industrial. Queda prohibida
        su reproducción, distribución o transformación total o parcial sin
        autorización expresa del titular.
      </p>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        El titular no garantiza la disponibilidad y continuidad permanente
        del sitio web, ni se hace responsable de los daños que puedan
        derivarse de la falta de disponibilidad o de errores de acceso
        causados por fallos ajenos a su control.
      </p>

      <h2>6. Legislación aplicable y jurisdicción</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para
        cualquier controversia derivada del uso de este sitio web, las partes
        se someten a los Juzgados y Tribunales que correspondan conforme a
        derecho.
      </p>
    </LegalPageLayout>
  );
}
