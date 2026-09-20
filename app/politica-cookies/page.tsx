import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Cookies | SCA San Juan Bautista de Peñolite",
  robots: { index: false, follow: true },
};

export default function PoliticaCookiesPage() {
  return (
    <LegalPageLayout title="Política de Cookies" updated="21 de septiembre de 2026">
      <p>
        Al entrar en esta web te mostramos un aviso para que decidas qué
        cookies aceptas. Puedes cambiar tu decisión en cualquier momento
        desde el enlace &quot;Preferencias de Cookies&quot; del pie de
        página.
      </p>

      <h2>1. Cookies necesarias (siempre activas)</h2>
      <p>
        Guardamos tu elección de cookies en el almacenamiento local de tu
        navegador (<code>localStorage</code>), y una preferencia de
        accesibilidad en <code>sessionStorage</code> si añades{" "}
        <code>?motion=on</code> a la dirección de la web para forzar las
        animaciones. Ninguna de las dos identifica a nadie ni se envía a un
        servidor. Al ser estrictamente necesarias para el funcionamiento de
        la web, no requieren tu consentimiento previo (artículo 22.2
        LSSI-CE).
      </p>

      <h2>2. Cookies analíticas (solo si las aceptas)</h2>
      <p>
        Actualmente no tenemos ninguna herramienta de analítica con cookies
        instalada — la única analítica activa (Vercel Analytics) no usa
        cookies ni identifica a los visitantes, por lo que no requiere
        consentimiento. Cuando activemos Google Analytics u otra
        herramienta similar, sus cookies solo se instalarán si marcas
        &quot;Aceptar todo&quot; o activas la categoría
        &quot;Analíticas&quot; en el aviso de cookies — nunca antes de que
        lo autorices.
      </p>

      <h2>3. Cómo cambiar tu decisión</h2>
      <p>
        Pulsa &quot;Preferencias de Cookies&quot; en el pie de página de
        cualquier página para volver a abrir el aviso y cambiar tu
        elección, o borra el almacenamiento local de tu navegador desde su
        configuración de privacidad para que vuelva a preguntarte en tu
        próxima visita.
      </p>
    </LegalPageLayout>
  );
}
