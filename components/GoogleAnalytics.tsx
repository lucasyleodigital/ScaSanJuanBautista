"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { hasAnalyticsConsent, type CookieConsentValue } from "@/components/CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Carga GA4 solo si el visitante ya aceptó cookies analíticas, y reacciona
 * en caliente si las acepta después sin recargar la página. */
export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(hasAnalyticsConsent());

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<CookieConsentValue>).detail;
      setEnabled(detail?.analytics === true);
    };
    window.addEventListener("penolite:cookie-consent", onConsent);
    return () => window.removeEventListener("penolite:cookie-consent", onConsent);
  }, []);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
