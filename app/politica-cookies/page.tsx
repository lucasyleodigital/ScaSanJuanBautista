import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Cookies | SCA San Juan Bautista de Peñolite",
  alternates: { canonical: "/politica-cookies" },
  robots: { index: false, follow: true },
};

export default function PoliticaCookiesPage() {
  return (
    <LegalPageLayout title="Política de Cookies" updated="12 de octubre de 2026">
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
      <p>
        Además, el formulario de pedido incluye una comprobación anti-bots de
        Cloudflare (Turnstile), necesaria para proteger el formulario de
        envíos automáticos. No se utiliza con fines publicitarios ni de
        seguimiento. Puedes ver más detalles en nuestra{" "}
        <a href="/politica-privacidad">Política de Privacidad</a>.
      </p>

      <h2>2. Cookies analíticas (solo si las aceptas)</h2>
      <p>
        Utilizamos Google Analytics 4 (Google Ireland Limited) para conocer,
        de forma agregada, cómo se usa la web: páginas visitadas, tiempo de
        visita y procedencia aproximada del tráfico. Nos sirve para mejorar
        el sitio. Solo se activa si marcas &quot;Aceptar todo&quot; o
        activas la categoría &quot;Analíticas&quot; en el aviso de cookies;
        nunca antes de que lo autorices, y puedes retirar tu consentimiento
        en cualquier momento.
      </p>
      <ul>
        <li>
          <strong>Cookies:</strong> <code>_ga</code> y{" "}
          <code>_ga_*</code> (identifican de forma anónima a un navegador
          para distinguir visitas). Duración: hasta 2 años.
        </li>
        <li>
          <strong>Titular:</strong> Google. Los datos pueden tratarse fuera
          del Espacio Económico Europeo con las garantías previstas en el
          RGPD.
        </li>
      </ul>
      <p>
        Además usamos Vercel Analytics, una medición de visitas básica que
        no emplea cookies ni identifica a los visitantes, por lo que no
        requiere consentimiento.
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
