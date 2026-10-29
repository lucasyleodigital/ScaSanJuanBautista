"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { colors, typography } from "@/lib/design-tokens";
import Reveal from "./Reveal";

interface Foto {
  src: string;
  ancho: number;
  alto: number;
  titulo: string;
  texto: string;
  credito?: string;
}

interface Epoca {
  etiqueta: string;
  fotos: Foto[];
}

// Pies de foto provisionales: describen lo que se ve en cada imagen.
// Pendiente de que la cooperativa aporte año exacto, nombres y permisos.
const EPOCAS: Epoca[] = [
  {
    etiqueta: "Años 60",
    fotos: [
      {
        src: "/images/historia/almazara-1960.webp",
        ancho: 1074,
        alto: 1295,
        titulo: "Cuadrilla de la almazara",
        texto: "Trabajadores posando junto a la maquinaria de la almazara.",
      },
      {
        src: "/images/historia/cribadora-1960.webp",
        ancho: 960,
        alto: 669,
        titulo: "Cribando la aceituna",
        texto: "Cribado a pie de olivo, entre sacos y cestos.",
      },
    ],
  },
  {
    etiqueta: "Años 70",
    fotos: [
      {
        src: "/images/historia/recogida-1970-familia.webp",
        ancho: 1152,
        alto: 648,
        titulo: "La campaña en familia",
        texto: "Mayores y niños en plena recogida, con la cribadora y las mulas en el olivar.",
      },
      {
        src: "/images/historia/vareo-1970.webp",
        ancho: 1152,
        alto: 648,
        titulo: "Vareando el olivo",
        texto: "Una mujer varea el árbol sobre la red mientras los niños posan con el perro.",
      },
    ],
  },
  {
    etiqueta: "2004 · 2005",
    fotos: [
      {
        src: "/images/historia/premio-2005.webp",
        ancho: 899,
        alto: 505,
        titulo: "Primer premio a la mayor proporción de aceite virgen extra",
        texto: "Socios de la cooperativa en la almazara de Peñolite, campaña 2004-05.",
        credito: "Foto cedida por Juan Carlos Parra",
      },
    ],
  },
];

// Virado cálido suave para que las fotos en color y en blanco y negro
// parezcan una misma colección.
const VIRADO = "sepia(0.22) contrast(1.03)";

export default function MemoriaV2() {
  const [abierta, setAbierta] = useState<Foto | null>(null);

  const cerrar = useCallback(() => setAbierta(null), []);

  useEffect(() => {
    if (!abierta) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierta, cerrar]);

  return (
    <section
      id="memoria"
      className="relative overflow-hidden px-6 py-24 md:py-32"
      style={{ backgroundColor: colors.negro }}
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal>
          <p
            className="mb-4 text-center text-[11px] uppercase"
            style={{
              fontFamily: typography.fontSans,
              letterSpacing: "0.28em",
              color: colors.dorado,
            }}
          >
            Desde 1958
          </p>
        </Reveal>
        <Reveal as="h2" delay={0.05}>
          <span
            className="block text-center"
            style={{
              fontFamily: typography.fontSerif,
              fontSize: "clamp(34px, 5vw, 58px)",
              color: colors.txCrema,
              lineHeight: 1.1,
            }}
          >
            Memoria de Peñolite
          </span>
        </Reveal>
        <Reveal as="p" delay={0.1}>
          <span
            className="mx-auto mt-5 block max-w-xl text-center"
            style={{
              fontFamily: typography.fontSans,
              fontSize: "16px",
              lineHeight: 1.7,
              color: colors.txMedio,
            }}
          >
            Detrás de cada garrafa hay seis décadas de gente de la sierra
            trabajando el mismo olivar. Estas son algunas de sus fotos.
          </span>
        </Reveal>

        <div className="mt-16 flex flex-col gap-16 md:gap-20">
          {EPOCAS.map((epoca) => (
            <div
              key={epoca.etiqueta}
              className="grid gap-6 md:grid-cols-[150px_1fr] md:gap-10"
            >
              <Reveal>
                <div
                  className="md:sticky md:top-28"
                  style={{
                    fontFamily: typography.fontSerif,
                    fontSize: "clamp(28px, 3.4vw, 40px)",
                    color: colors.dorado,
                    lineHeight: 1.1,
                  }}
                >
                  {epoca.etiqueta}
                </div>
              </Reveal>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {epoca.fotos.map((foto, i) => (
                  <Reveal key={foto.src} delay={i * 0.08}>
                    <figure>
                      <button
                        type="button"
                        onClick={() => setAbierta(foto)}
                        data-cursor-active
                        aria-label={`Ampliar foto: ${foto.titulo}`}
                        className="group block w-full cursor-pointer overflow-hidden rounded-md border p-0"
                        style={{ borderColor: colors.rule, background: "none" }}
                      >
                        <Image
                          src={foto.src}
                          alt={`${foto.titulo}. ${foto.texto}`}
                          width={foto.ancho}
                          height={foto.alto}
                          sizes="(min-width: 640px) 380px, 100vw"
                          className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          style={{ filter: VIRADO }}
                        />
                      </button>
                      <figcaption className="mt-3">
                        <p
                          style={{
                            fontFamily: typography.fontSerif,
                            fontSize: "18px",
                            color: colors.txCrema,
                            lineHeight: 1.3,
                          }}
                        >
                          {foto.titulo}
                        </p>
                        <p
                          className="mt-1"
                          style={{
                            fontFamily: typography.fontSans,
                            fontSize: "13px",
                            lineHeight: 1.6,
                            color: colors.txMedio,
                          }}
                        >
                          {foto.texto}
                        </p>
                        {foto.credito && (
                          <p
                            className="mt-1"
                            style={{
                              fontFamily: typography.fontSans,
                              fontSize: "11px",
                              color: colors.txBajo,
                            }}
                          >
                            {foto.credito}
                          </p>
                        )}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {abierta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={abierta.titulo}
          onClick={cerrar}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 p-4"
          style={{ backgroundColor: "rgba(6, 13, 3, 0.94)" }}
        >
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border"
            style={{ borderColor: colors.rule, color: colors.txCrema }}
          >
            <X size={20} />
          </button>
          <Image
            src={abierta.src}
            alt={`${abierta.titulo}. ${abierta.texto}`}
            width={abierta.ancho}
            height={abierta.alto}
            onClick={(e) => e.stopPropagation()}
            className="h-auto max-h-[78vh] w-auto max-w-full rounded-md object-contain"
            style={{ filter: VIRADO }}
          />
          <div
            className="max-w-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{
                fontFamily: typography.fontSerif,
                fontSize: "20px",
                color: colors.txCrema,
              }}
            >
              {abierta.titulo}
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: typography.fontSans,
                fontSize: "13px",
                color: colors.txMedio,
              }}
            >
              {abierta.texto}
              {abierta.credito ? ` ${abierta.credito}.` : ""}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
