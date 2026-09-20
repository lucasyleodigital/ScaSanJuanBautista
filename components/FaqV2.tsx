"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";
import FloatingParticles from "./FloatingParticles";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "¿Cuál es el pedido mínimo?",
    answer:
      "La unidad mínima es una caja (3 garrafas de 5L o 6 de 2L). Para cantidades mayores o formatos distintos, contáctanos y te preparamos un presupuesto a medida.",
  },
  {
    question: "¿Enviáis a toda España? ¿Hacéis envíos internacionales?",
    answer:
      "Sí, enviamos a toda la España peninsular. El plazo y el coste dependen del volumen del pedido — te lo confirmamos al recibir tu solicitud. Para Baleares, Canarias o envíos internacionales, contáctanos directamente.",
  },
  {
    question: "¿El aceite está certificado? ¿Qué garantías tiene?",
    answer:
      "Sí. Es Picual 100% con Denominación de Origen Sierra de Segura. Cada lote pasa un análisis de laboratorio externo (polifenoles, acidez, pureza) antes de salir de la almazara.",
  },
  {
    question: "Tengo un restaurante o una empresa, ¿trabajáis con negocios?",
    answer:
      "Sí, buena parte de nuestros clientes son restaurantes y negocios de hostelería — la caja de 6×2L está pensada precisamente para consumo frecuente. Indícalo en el formulario como \"empresa\" y te preparamos condiciones de pedido al por mayor.",
  },
  {
    question: "¿Cómo se paga y cómo se cierra el pedido?",
    answer:
      "Rellena el formulario con la cantidad que necesitas — te contestamos por email o teléfono para confirmar el presupuesto final y la forma de pago antes de cerrar el pedido.",
  },
  {
    question: "¿Cómo debo conservar el aceite?",
    answer:
      "En un lugar fresco y seco, alejado de la luz directa — por eso lo envasamos en garrafas opacas. Así conserva mejor sus propiedades y su sabor durante más tiempo.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqV2() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative py-32 px-6 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${colors.negro} 0%, rgba(36, 61, 15, 0.2) 100%)`,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FloatingParticles />
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2
          style={{
            fontFamily: typography.fontSerif,
            fontSize: "clamp(36px, 5vw, 56px)",
            color: colors.txCrema,
            marginBottom: spacing.md,
            textAlign: "center",
            fontVariationSettings: '"wght" 500',
          }}
        >
          Preguntas Frecuentes
        </h2>

        <p
          style={{
            fontFamily: typography.fontSans,
            fontSize: "16px",
            color: colors.txMedio,
            maxWidth: "560px",
            margin: `0 auto ${spacing.xxl}`,
            textAlign: "center",
            lineHeight: "1.7",
          }}
        >
          Lo que más nos preguntan antes de hacer el primer pedido.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: spacing.sm }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.question}
                style={{
                  border: `1px solid ${colors.rule}`,
                  borderRadius: "8px",
                  background: isOpen ? colors.doradoSuave : "transparent",
                  transition: `background ${motion.durationStd}ms ${motion.easeSmooth}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  data-cursor-active
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: spacing.md,
                    padding: `${spacing.md} ${spacing.lg}`,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: typography.fontSans,
                    fontSize: "16px",
                    color: colors.txCrema,
                    fontWeight: 600,
                  }}
                >
                  {faq.question}
                  <ChevronDown
                    size={18}
                    style={{
                      flexShrink: 0,
                      color: colors.dorado,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: `transform ${motion.durationStd}ms ${motion.easeSmooth}`,
                    }}
                  />
                </button>

                <div
                  className="faq-answer-grid"
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: `grid-template-rows ${motion.durationStd}ms ${motion.easeSmooth}`,
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        fontFamily: typography.fontSans,
                        fontSize: "14px",
                        color: colors.txMedio,
                        lineHeight: "1.7",
                        padding: `0 ${spacing.lg} ${spacing.md}`,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
