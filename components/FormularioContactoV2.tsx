"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { colors, motion, typography, spacing } from "@/lib/design-tokens";
import { CheckCircle, AlertCircle } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Access key de Web3Forms — envía el formulario directo a
// sca.sanjuanbautistaonline@gmail.com sin backend propio. Gratis hasta
// 250 envíos/mes. Si en el futuro se pasa a Resend con dominio propio,
// solo hay que cambiar el fetch de handleSubmit.
const WEB3FORMS_ACCESS_KEY = "ce93b6c3-2a1b-4f9d-b8c9-6a8dc15e8c66";

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  tipoComprador: "particular" | "hosteleria" | "retail" | "distribuidor";
  formato: "3x5l" | "6x2l";
  cantidad: number;
  codigoPostal: string;
  mensaje: string;
}

export default function FormularioContactoV2() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    tipoComprador: "particular",
    formato: "3x5l",
    cantidad: 1,
    codigoPostal: "",
    mensaje: "",
  });

  const [validation, setValidation] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  // Validación en tiempo real
  const validateField = (name: string, value: string) => {
    let isValid = true;

    switch (name) {
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case "telefono":
        isValid = /^\d{9,}$/.test(value);
        break;
      case "nombre":
      case "empresa":
        isValid = value.length > 2;
        break;
      case "codigoPostal":
        isValid = /^\d{5}$/.test(value);
        break;
      default:
        isValid = true;
    }

    setValidation((prev) => ({ ...prev, [name]: isValid }));
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cantidad" ? Math.max(1, parseInt(value) || 1) : value,
    }));

    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar todos los campos
    const allValid = Object.values(validation).every((v) => v);
    if (!allValid || sending) return;

    setSending(true);
    setSendError(false);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Solicitud de presupuesto — ${formData.nombre} (${formData.formato})`,
          from_name: "Web SCA San Juan Bautista de Peñolite",
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          empresa: formData.empresa || "—",
          tipo_comprador: formData.tipoComprador,
          formato: formData.formato,
          cantidad_cajas: formData.cantidad,
          codigo_postal: formData.codigoPostal,
          mensaje: formData.mensaje || "—",
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Envío rechazado");

      gsap.to(formRef.current, { opacity: 0, y: -20, duration: 0.5 });
      setSubmitted(true);
      setSending(false);

      setTimeout(() => {
        setSubmitted(false);
        setFormData((prev) => ({
          nombre: "",
          email: "",
          telefono: "",
          empresa: "",
          tipoComprador: "particular",
          formato: prev.formato,
          cantidad: 1,
          codigoPostal: "",
          mensaje: "",
        }));
        setValidation({});

        gsap.to(formRef.current, { opacity: 1, y: 0, duration: 0.5 });
      }, 3000);
    } catch {
      setSending(false);
      setSendError(true);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: motion.easeDivine,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Recibe el formato elegido al pulsar "Solicitar Presupuesto" en el catálogo
  useEffect(() => {
    const onFormatoSeleccionado = (e: Event) => {
      const formato = (e as CustomEvent<"3x5l" | "6x2l">).detail;
      setFormData((prev) => ({ ...prev, formato }));
    };
    window.addEventListener("penolite:formato-seleccionado", onFormatoSeleccionado);
    return () =>
      window.removeEventListener("penolite:formato-seleccionado", onFormatoSeleccionado);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: colors.verdeOliva }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Título */}
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
          Solicita tu Presupuesto
        </h2>

        <p
          style={{
            fontFamily: typography.fontSans,
            fontSize: "16px",
            color: colors.txMedio,
            marginBottom: spacing.xxl,
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          Completa el formulario y nos pondremos en contacto en 24 horas para
          preparar tu presupuesto de compra y envío.
        </p>

        {/* Formulario */}
        {!submitted ? (
          <form ref={formRef} onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
                gap: spacing.lg,
                marginBottom: spacing.xl,
              }}
            >
              {/* Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  style={{
                    display: "block",
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.dorado,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: `${colors.doradoSuave}`,
                    border:
                      validation.nombre === false
                        ? `2px solid #ff4444`
                        : `1px solid ${colors.rule}`,
                    borderRadius: "4px",
                    fontFamily: typography.fontSans,
                    fontSize: "14px",
                    color: colors.txCrema,
                    transition: `all ${motion.durationQuick}ms`,
                  }}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.dorado,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: `${colors.doradoSuave}`,
                    border:
                      validation.email === false
                        ? `2px solid #ff4444`
                        : `1px solid ${colors.rule}`,
                    borderRadius: "4px",
                    fontFamily: typography.fontSans,
                    fontSize: "14px",
                    color: colors.txCrema,
                    transition: `all ${motion.durationQuick}ms`,
                  }}
                  required
                />
              </div>

              {/* Teléfono */}
              <div>
                <label
                  htmlFor="telefono"
                  style={{
                    display: "block",
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.dorado,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="(+34) 123 456 789"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: `${colors.doradoSuave}`,
                    border:
                      validation.telefono === false
                        ? `2px solid #ff4444`
                        : `1px solid ${colors.rule}`,
                    borderRadius: "4px",
                    fontFamily: typography.fontSans,
                    fontSize: "14px",
                    color: colors.txCrema,
                    transition: `all ${motion.durationQuick}ms`,
                  }}
                  required
                />
              </div>

              {/* Empresa */}
              <div>
                <label
                  htmlFor="empresa"
                  style={{
                    display: "block",
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.dorado,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Empresa (opcional)
                </label>
                <input
                  id="empresa"
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Tu empresa"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: `${colors.doradoSuave}`,
                    border: `1px solid ${colors.rule}`,
                    borderRadius: "4px",
                    fontFamily: typography.fontSans,
                    fontSize: "14px",
                    color: colors.txCrema,
                    transition: `all ${motion.durationQuick}ms`,
                  }}
                />
              </div>

              {/* Tipo de comprador */}
              <div>
                <label
                  htmlFor="tipoComprador"
                  style={{
                    display: "block",
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.dorado,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Tipo de comprador
                </label>
                <select
                  id="tipoComprador"
                  name="tipoComprador"
                  value={formData.tipoComprador}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: `${colors.doradoSuave}`,
                    border: `1px solid ${colors.rule}`,
                    borderRadius: "4px",
                    fontFamily: typography.fontSans,
                    fontSize: "14px",
                    color: colors.txCrema,
                    cursor: "pointer",
                  }}
                >
                  <option value="particular">Particular</option>
                  <option value="hosteleria">Hostelería</option>
                  <option value="retail">Retail/Tienda</option>
                  <option value="distribuidor">Distribuidor</option>
                </select>
              </div>

              {/* Formato */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.dorado,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Formato deseado
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: spacing.sm,
                  }}
                >
                  {[
                    { value: "3x5l" as const, label: "Caja 3 garrafas × 5L", price: "85€" },
                    { value: "6x2l" as const, label: "Caja 6 garrafas × 2L", price: "69€" },
                  ].map((opt) => {
                    const selected = formData.formato === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, formato: opt.value }))
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          textAlign: "left",
                          background: selected ? colors.dorado : colors.doradoSuave,
                          border: `1px solid ${selected ? colors.dorado : colors.rule}`,
                          borderRadius: "4px",
                          fontFamily: typography.fontSans,
                          cursor: "pointer",
                          transition: `all ${motion.durationQuick}ms`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: selected ? colors.negro : colors.txCrema,
                            marginBottom: "2px",
                          }}
                        >
                          {opt.label}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: selected ? colors.negro : colors.txBajo,
                          }}
                        >
                          {opt.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cantidad */}
              <div>
                <label
                  htmlFor="cantidad"
                  style={{
                    display: "block",
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.dorado,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Cantidad de cajas
                </label>
                <input
                  id="cantidad"
                  type="number"
                  name="cantidad"
                  min="1"
                  value={formData.cantidad}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: `${colors.doradoSuave}`,
                    border: `1px solid ${colors.rule}`,
                    borderRadius: "4px",
                    fontFamily: typography.fontSans,
                    fontSize: "14px",
                    color: colors.txCrema,
                  }}
                />
              </div>

              {/* Código postal */}
              <div>
                <label
                  htmlFor="codigoPostal"
                  style={{
                    display: "block",
                    fontFamily: typography.fontSans,
                    fontSize: "12px",
                    color: colors.dorado,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Código postal
                </label>
                <input
                  id="codigoPostal"
                  type="text"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  placeholder="28001"
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: `${colors.doradoSuave}`,
                    border:
                      validation.codigoPostal === false
                        ? `2px solid #ff4444`
                        : `1px solid ${colors.rule}`,
                    borderRadius: "4px",
                    fontFamily: typography.fontSans,
                    fontSize: "14px",
                    color: colors.txCrema,
                    transition: `all ${motion.durationQuick}ms`,
                  }}
                  required
                />
              </div>
            </div>

            {/* Mensaje */}
            <div style={{ marginBottom: spacing.xl }}>
              <label
                htmlFor="mensaje"
                style={{
                  display: "block",
                  fontFamily: typography.fontSans,
                  fontSize: "12px",
                  color: colors.dorado,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                Mensaje (opcional)
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos más sobre tu pedido..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: `${colors.doradoSuave}`,
                  border: `1px solid ${colors.rule}`,
                  borderRadius: "4px",
                  fontFamily: typography.fontSans,
                  fontSize: "14px",
                  color: colors.txCrema,
                  resize: "none",
                }}
              />
            </div>

            {/* Botón envío */}
            <button
              type="submit"
              disabled={sending}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: colors.dorado,
                color: colors.negro,
                border: "none",
                fontFamily: typography.fontSans,
                fontSize: "14px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 600,
                cursor: sending ? "wait" : "pointer",
                opacity: sending ? 0.7 : 1,
                borderRadius: "4px",
                transition: `all ${motion.durationStd}ms`,
              }}
              onMouseEnter={(e) => {
                if (sending) return;
                gsap.to(e.currentTarget, {
                  scale: 1.02,
                  boxShadow: `0 12px 32px rgba(200, 150, 30, 0.3)`,
                  duration: 0.3,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  boxShadow: "none",
                  duration: 0.3,
                });
              }}
            >
              {sending ? "Enviando..." : "Enviar Presupuesto"}
            </button>

            {sendError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  marginTop: spacing.md,
                  padding: spacing.md,
                  background: "rgba(255, 68, 68, 0.1)",
                  border: "1px solid rgba(255, 68, 68, 0.4)",
                  borderRadius: "4px",
                }}
              >
                <AlertCircle size={20} color="#ff4444" style={{ flexShrink: 0 }} />
                <p
                  style={{
                    fontFamily: typography.fontSans,
                    fontSize: "13px",
                    color: colors.txMedio,
                    lineHeight: "1.5",
                  }}
                >
                  No se ha podido enviar. Escríbenos directamente a{" "}
                  <a
                    href="mailto:sca.sanjuanbautistaonline@gmail.com"
                    style={{ color: colors.dorado }}
                  >
                    sca.sanjuanbautistaonline@gmail.com
                  </a>{" "}
                  o inténtalo de nuevo en unos minutos.
                </p>
              </div>
            )}
          </form>
        ) : (
          // Mensaje de éxito
          <div
            style={{
              textAlign: "center",
              padding: spacing.xxxl,
              background: `linear-gradient(135deg, ${colors.doradoSuave} 0%, transparent 100%)`,
              border: `1px solid ${colors.rule}`,
              borderRadius: "8px",
              animation: "fadeIn 0.6s ease-out",
            }}
          >
            <CheckCircle
              size={48}
              color={colors.dorado}
              style={{ margin: "0 auto 16px" }}
            />
            <h3
              style={{
                fontFamily: typography.fontSerif,
                fontSize: "28px",
                color: colors.txCrema,
                marginBottom: spacing.md,
              }}
            >
              ¡Presupuesto enviado!
            </h3>
            <p
              style={{
                fontFamily: typography.fontSans,
                fontSize: "16px",
                color: colors.txMedio,
                lineHeight: "1.6",
              }}
            >
              Gracias por tu interés. Nos pondremos en contacto en 24 horas
              para confirmar tu pedido y envío.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        input::placeholder,
        textarea::placeholder {
          color: ${colors.txBajo};
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: ${colors.dorado} !important;
          box-shadow: 0 0 0 3px ${colors.doradoSuave};
        }

        /* El navegador ignora la mayoría de estilos del <select> abierto,
           así que forzamos contraste legible en las opciones del desplegable */
        select option {
          color: ${colors.txOscuro};
          background: ${colors.crema};
        }
      `}</style>
    </section>
  );
}
