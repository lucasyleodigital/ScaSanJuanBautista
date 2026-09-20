import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Cookies | SCA San Juan Bautista de Peñolite",
  robots: { index: false, follow: true },
};

export default function PoliticaCookiesPage() {
  return (
    <LegalPageLayout title="Política de Cookies" updated="20 de septiembre de 2026">
      <p>
        Esta web no utiliza cookies de análisis, publicidad ni redes
        sociales. No instalamos ningún elemento de seguimiento de terceros y
        no compartimos tu navegación con nadie.
      </p>

      <h2>1. Almacenamiento técnico que sí usamos</h2>
      <p>
        Guardamos una única preferencia en el almacenamiento local de tu
        navegador (<code>sessionStorage</code>), y solo si añades{" "}
        <code>?motion=on</code> a la dirección de la web: sirve para forzar
        las animaciones aunque tu sistema operativo tenga activada la opción
        de &quot;reducir movimiento&quot;. No identifica a nadie, no se envía
        a ningún servidor y desaparece al cerrar la pestaña. Al ser
        estrictamente necesario para el funcionamiento solicitado por el
        propio usuario, no requiere consentimiento previo según la normativa
        vigente (artículo 22.2 LSSI-CE).
      </p>

      <h2>2. Si en el futuro añadimos analítica</h2>
      <p>
        Si en algún momento incorporamos herramientas de analítica (por
        ejemplo, para medir visitas) o de publicidad, actualizaremos esta
        página y solicitaremos tu consentimiento explícito mediante un
        aviso, antes de instalar ninguna cookie no esencial.
      </p>

      <h2>3. Cómo gestionar el almacenamiento de tu navegador</h2>
      <p>
        Puedes borrar el almacenamiento local de tu navegador en cualquier
        momento desde su configuración de privacidad. Al no usar cookies de
        terceros, esto no afecta a ningún servicio externo.
      </p>
    </LegalPageLayout>
  );
}
