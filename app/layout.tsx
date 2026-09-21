import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import GrainOverlay from "@/components/GrainOverlay";
import CustomCursor from "@/components/CustomCursor";
import CookieConsent from "@/components/CookieConsent";
import { AudioProvider } from "@/components/AudioEngine";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const SITE_URL = "https://web-cinematic-lucasyleo-projects.vercel.app";
const SITE_DESCRIPTION =
  "AOVE Picual 100%, D.O. Sierra de Segura, directo de la cooperativa desde 1958. Sin intermediarios: tu dinero llega a los agricultores, no a la distribución.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AOVE Picual Directo del Agricultor, Sin Intermediarios | SCA Peñolite",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/logo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AOVE Picual Directo del Agricultor, Sin Intermediarios",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "SCA San Juan Bautista de Peñolite",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AOVE Picual Directo del Agricultor, Sin Intermediarios",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SCA San Juan Bautista de Peñolite",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo/icon-512.png`,
  telephone: "+34953435316",
  email: "sanjuanbautista.sca@gmail.com",
  foundingDate: "1958",
  description: SITE_DESCRIPTION,
  taxID: "F23006992",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Peñolite, 1",
    addressLocality: "Peñolite (Puente de Génave)",
    addressRegion: "Jaén",
    addressCountry: "ES",
  },
  award: [
    "Medalla de Oro de Andalucía 2022 — Economía y Empresa (Jaencoop Grupo)",
    "Premio Ardilla D.O. Sierra de Segura — Mejor Aceite de Oliva Virgen Extra, Campaña 2017/18",
    "Premio Ardilla D.O. Sierra de Segura — Mejor Aceite de Oliva Virgen Extra, Campaña 2007/08",
    "Premio Ardilla D.O. Sierra de Segura — Mayor Proporción de Aceite de Oliva Virgen Extra, Campaña 2018/19",
    "Premio Ardilla D.O. Sierra de Segura — Mayor Proporción de Aceite Calificado, Campaña 2004/05",
    "Premio Ardilla D.O. Sierra de Segura — 1er Accésit Mejor Depósito de Aceite Virgen Extra, Campaña 2007/08",
    "Premio Ardilla D.O. Sierra de Segura — Accésit Mayor Proporción de Aceite de Oliva Virgen Extra, Campaña 2015/16",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-negro text-tx-crema font-sans"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=new URLSearchParams(location.search).get("motion")==="on";if(p)sessionStorage.setItem("penolite-force-motion","1");if(p||sessionStorage.getItem("penolite-force-motion")==="1")document.documentElement.classList.add("force-motion")}catch(e){}`,
          }}
        />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-dorado focus:text-negro focus:px-4 focus:py-2 focus:text-sm focus:tracking-wide"
        >
          Saltar al contenido
        </a>
        <AudioProvider>
          <CustomCursor />
          <GrainOverlay />
          <SmoothScroll>{children}</SmoothScroll>
        </AudioProvider>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}

