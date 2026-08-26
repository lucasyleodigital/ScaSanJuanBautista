import { Handshake, Leaf, Users } from "lucide-react";
import Reveal from "./Reveal";

const VALORES = [
  {
    icon: Handshake,
    title: "Cooperativismo real",
    text: "Más de 500 familias socias deciden juntas, comparten riesgo y reparten el resultado con justicia.",
  },
  {
    icon: Leaf,
    title: "Respeto por la tierra",
    text: "Cultivo tradicional en pendiente, sin forzar el olivar más allá de lo que la sierra puede dar cada año.",
  },
  {
    icon: Users,
    title: "Continuidad generacional",
    text: "Los mismos apellidos que fundaron la cooperativa en 1958 siguen llevando sus aceitunas hoy.",
  },
];

/**
 * Capítulo 6 — cierre emocional antes del CTA: de "producto" a "comunidad".
 */
export default function Cooperativa() {
  return (
    <section id="cooperativa" className="relative bg-crema px-6 py-24 text-tx-oscuro md:px-10">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-16 md:grid-cols-2">
        <div>
          <Reveal as="span" className="mb-4 block font-sans text-[9px] tracking-[0.35em] text-verde-oliva uppercase">
            — Capítulo 05 —
          </Reveal>
          <Reveal as="h2" className="font-serif text-[clamp(32px,5vw,56px)] leading-[1.15] text-tx-oscuro">
            No es una marca.
            <br />
            Es un pueblo entero.
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 max-w-lg text-base leading-relaxed text-tx-medio-osc">
            Detrás de cada botella hay más de 500 familias que han decidido,
            durante 66 años, seguir haciendo las cosas juntas. La cooperativa
            no es un intermediario: es la forma en que Peñolite se organiza
            para sobrevivir y prosperar del olivar.
          </Reveal>

          <div className="mt-10 flex flex-col gap-4">
            {VALORES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="flex items-start gap-4 border-l-2 border-verde-oliva bg-verde-oliva/6 p-5">
                  <v.icon className="mt-0.5 shrink-0 text-verde-oliva" size={20} strokeWidth={1.6} />
                  <div>
                    <h4 className="mb-1 font-sans text-[11px] tracking-[0.1em] text-verde-oliva uppercase">
                      {v.title}
                    </h4>
                    <p className="text-[13px] leading-relaxed text-tx-medio-osc">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Reveal className="bg-verde-oliva px-10 py-12 text-center text-crema">
            <div className="font-serif text-[72px] leading-none text-dorado tabular-nums">500+</div>
            <div className="mt-2 text-xs tracking-[0.15em] text-crema/60 uppercase">
              Familias socias
            </div>
          </Reveal>
          <Reveal delay={0.1} className="bg-pergamino p-6 text-center font-serif text-xl text-verde-oliva">
            Fundada el 23 de julio de 1958
          </Reveal>
        </div>
      </div>
    </section>
  );
}
