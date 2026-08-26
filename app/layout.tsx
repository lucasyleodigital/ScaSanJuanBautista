import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import GrainOverlay from "@/components/GrainOverlay";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "SCA San Juan Bautista de Peñolite — AOVE Picual · Sierra de Segura · Desde 1958",
  description:
    "Aceite de Oliva Virgen Extra Picual 100% de la Sierra de Segura. Cooperativa fundada en 1958 en Peñolite, Jaén. Acidez máxima 0,5°.",
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
        {/*
          ?motion=on fuerza el motion completo aunque el SO pida
          prefers-reduced-motion — imprescindible para demos en equipos con
          animaciones del sistema desactivadas. Se aplica antes de la
          hidratación para que los overrides CSS de globals.css (que miran
          html:not(.force-motion)) ya vean la clase en el primer paint.
        */}
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
        <CustomCursor />
        <GrainOverlay />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
