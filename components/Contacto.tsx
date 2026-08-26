"use client";

import { useState } from "react";
import Reveal from "./Reveal";

/**
 * Capítulo 7 — el formulario no envía a un backend real todavía (la
 * conexión de email se conecta tras la aprobación de la junta, ver
 * STORYBOARD.md). Aquí solo confirma en pantalla para que el flujo se
 * pueda probar en la demo.
 */
export default function Contacto() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section id="pedido" className="relative bg-verde-oscuro px-6 py-24 text-tx-crema md:px-10">
        <div className="mx-auto max-w-[700px]">
          <Reveal as="span" className="mb-4 block font-sans text-[9px] tracking-[0.35em] text-dorado uppercase">
            — Solicitar pedido —
          </Reveal>
          <Reveal as="h2" className="font-serif text-[clamp(28px,4vw,44px)] leading-[1.15]">
            Lleve el aceite de Peñolite
            <br />a su mesa o su negocio
          </Reveal>

          {sent ? (
            <Reveal delay={0.1} className="mt-10 border border-dorado/30 bg-dorado-suave p-8 text-center">
              <p className="font-serif text-lg text-tx-crema">Solicitud recibida.</p>
              <p className="mt-2 text-sm text-tx-medio">
                La cooperativa se pondrá en contacto para confirmar precio y
                disponibilidad de campaña.
              </p>
            </Reveal>
          ) : (
            <Reveal delay={0.1}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                <Field label="Nombre" name="nombre" required />
                <Field label="Email" name="email" type="email" required />
                <Field label="Teléfono" name="telefono" type="tel" />
                <div className="flex flex-col gap-2">
                  <label htmlFor="formato" className="font-sans text-[9px] tracking-[0.25em] text-dorado uppercase">
                    Formato
                  </label>
                  <select
                    id="formato"
                    name="formato"
                    className="w-full border border-rule bg-white/4 px-4 py-3 font-serif text-sm text-tx-crema outline-none transition-colors focus:border-dorado focus:bg-white/7"
                  >
                    <option className="bg-verde-oscuro">2 Litros</option>
                    <option className="bg-verde-oscuro">5 Litros</option>
                    <option className="bg-verde-oscuro">Ambos / no lo sé</option>
                  </select>
                </div>
                <div className="col-span-full flex flex-col gap-2">
                  <label htmlFor="mensaje" className="font-sans text-[9px] tracking-[0.25em] text-dorado uppercase">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    className="w-full resize-y border border-rule bg-white/4 px-4 py-3 font-serif text-sm text-tx-crema outline-none transition-colors focus:border-dorado focus:bg-white/7"
                  />
                </div>
                <button
                  type="submit"
                  data-cursor-active
                  className="group relative col-span-full mt-2 overflow-hidden bg-dorado py-4 font-sans text-[11px] tracking-[0.22em] text-negro uppercase transition-colors duration-350"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-ambar transition-transform duration-400 ease-[cubic-bezier(.83,0,.17,1)] group-hover:scale-x-100" />
                  <span className="relative">Enviar solicitud</span>
                </button>
                <p className="col-span-full text-[11px] leading-relaxed text-tx-bajo">
                  Al enviar este formulario, autoriza a la cooperativa a
                  contactarle por email o teléfono para gestionar su pedido.
                </p>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <section id="contacto" className="relative bg-negro px-6 py-24 text-tx-crema md:px-10">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-14 md:grid-cols-2">
          <Reveal className="flex flex-col gap-7">
            <ContactRow label="Dirección" value="Carr. Peñolite, 29 · 23359 Peñolite, Jaén" />
            <ContactRow
              label="Email"
              value="sanjuanbautista.sca@gmail.com"
              href="mailto:sanjuanbautista.sca@gmail.com"
            />
            <ContactRow label="CIF" value="F23006992" />
            <ContactRow label="Fundada" value="23 de julio de 1958" />
          </Reveal>

          <Reveal delay={0.1} className="relative h-80 overflow-hidden border border-rule bg-verde-oscuro">
            <iframe
              src="https://maps.google.com/maps?q=38.3241501,-2.7975902&z=16&t=h&output=embed"
              title="Ubicación de la cooperativa en Peñolite"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-full w-full border-0 transition-[filter] duration-400 [filter:grayscale(.35)_sepia(.18)_saturate(1.15)_brightness(.82)_contrast(1.08)] hover:[filter:grayscale(.15)_sepia(.1)_saturate(1.1)_brightness(.92)_contrast(1.04)]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-2.5 bg-gradient-to-t from-negro/88 via-negro/40 to-transparent px-5 pt-16 pb-4">
              <span className="text-xs text-tx-medio">Peñolite, Jaén</span>
              <a
                href="https://www.google.com/maps/place/SOCIEDAD+COOPERATIVA+ANDALUZA+SAN+JUAN+BAUTISTA/@38.3241501,-2.8001651,17z"
                target="_blank"
                rel="noopener"
                data-cursor-active
                className="pointer-events-auto border border-rule bg-negro/60 px-5 py-2 font-sans text-[9px] tracking-[0.2em] text-dorado uppercase backdrop-blur-sm transition-colors hover:border-dorado"
              >
                Abrir en Google Maps
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-sans text-[9px] tracking-[0.25em] text-dorado uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full border border-rule bg-white/4 px-4 py-3 font-serif text-sm text-tx-crema outline-none transition-colors focus:border-dorado focus:bg-white/7"
      />
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = href ? (
    <a href={href} className="transition-colors hover:text-dorado">
      {value}
    </a>
  ) : (
    value
  );
  return (
    <div className="border-t border-rule pt-5">
      <div className="mb-2 font-sans text-[9px] tracking-[0.25em] text-dorado uppercase">{label}</div>
      <div className="font-serif text-base leading-relaxed text-tx-crema">{content}</div>
    </div>
  );
}
