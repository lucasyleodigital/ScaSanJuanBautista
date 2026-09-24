"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useAudio } from "./AudioEngine";
import { supabase, DEFAULT_PRICING, type PricingConfig, type Promocion } from "@/lib/supabase";
import {
  ShoppingBag,
  Send,
  PhoneCall,
  Award,
  Truck,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Tag,
} from "lucide-react";

// Access key de Web3Forms — mismo destino que el formulario anterior
// (sca.sanjuanbautistaonline@gmail.com), sin backend propio. Gratis
// hasta 250 envíos/mes. Al pasar a Resend con dominio propio, solo hay
// que cambiar el fetch de handleSubmit.
const WEB3FORMS_ACCESS_KEY = "ce93b6c3-2a1b-4f9d-b8c9-6a8dc15e8c66";

interface ContactData {
  nombre: string;
  email: string;
  telefono: string;
  codigoPostal: string;
}

export default function CalculadoraPedidoInteractive() {
  const [profile, setProfile] = useState<"particular" | "horeca" | "distribuidor">("particular");
  const [qty5L, setQty5L] = useState<number>(1);
  const [qty2L, setQty2L] = useState<number>(0);
  const [shippingRegion, setShippingRegion] = useState<"peninsula" | "baleares" | "ue">("peninsula");

  const [contact, setContact] = useState<ContactData>({
    nombre: "",
    email: "",
    telefono: "",
    codigoPostal: "",
  });
  const [validation, setValidation] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promocion | null>(null);
  const [promoStatus, setPromoStatus] = useState<"idle" | "checking" | "invalid">("idle");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const { playClick, playGoldDrop, playSuccess } = useAudio();

  // Recibe el formato elegido al pulsar "Solicitar Presupuesto" en el catálogo
  useEffect(() => {
    const onFormatoSeleccionado = (e: Event) => {
      const formato = (e as CustomEvent<"3x5l" | "6x2l">).detail;
      if (formato === "3x5l") setQty5L((prev) => Math.max(1, prev));
      if (formato === "6x2l") setQty2L((prev) => Math.max(1, prev));
    };
    window.addEventListener("penolite:formato-seleccionado", onFormatoSeleccionado);
    return () =>
      window.removeEventListener("penolite:formato-seleccionado", onFormatoSeleccionado);
  }, []);

  // Tarifas en vivo: las lee Eva desde su panel y se reflejan aquí sin
  // tocar código. Si Supabase no responde, se usan los valores por
  // defecto para que el configurador nunca se quede roto.
  useEffect(() => {
    supabase
      .from("pricing_config")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setPricing(data as PricingConfig);
      });
  }, []);

  // Price calculations
  const price5LBox = pricing.precio_caja_3x5l;
  const price2LBox = pricing.precio_caja_6x2l;

  const totalLitros5L = qty5L * 15;
  const totalLitros2L = qty2L * 12;
  const totalLitros = totalLitros5L + totalLitros2L;

  const rawSubtotal = qty5L * price5LBox + qty2L * price2LBox;

  // Discount for larger volume orders
  const volumeDiscountPercent =
    totalLitros >= 100
      ? pricing.descuento_100l_pct / 100
      : totalLitros >= 50
      ? pricing.descuento_50l_pct / 100
      : 0;
  const discountAmount = rawSubtotal * volumeDiscountPercent;

  // Descuento del código promocional (independiente del descuento por volumen)
  const promoDiscountAmount = appliedPromo?.descuento_pct
    ? rawSubtotal * (appliedPromo.descuento_pct / 100)
    : 0;

  // Shipping cost
  const baseShippingCost =
    rawSubtotal === 0
      ? 0
      : shippingRegion === "peninsula"
      ? rawSubtotal > pricing.envio_gratis_desde
        ? 0
        : pricing.envio_peninsula
      : shippingRegion === "baleares"
      ? pricing.envio_baleares
      : pricing.envio_ue;
  const shippingCost = appliedPromo?.envio_gratis ? 0 : baseShippingCost;

  const finalTotal = rawSubtotal - discountAmount - promoDiscountAmount + shippingCost;
  const pricePerLiterAvg = totalLitros > 0 ? (rawSubtotal / totalLitros).toFixed(2) : "0.00";

  const handleApplyPromo = async () => {
    const codigo = promoInput.trim();
    if (!codigo) return;
    playClick();
    setPromoStatus("checking");
    const { data } = await supabase
      .from("promociones")
      .select("*")
      .eq("activo", true)
      .ilike("codigo", codigo)
      .maybeSingle();

    const promo = data as Promocion | null;
    const caducado = promo?.fecha_fin ? new Date(promo.fecha_fin) < new Date() : false;

    if (promo && !caducado) {
      setAppliedPromo(promo);
      setPromoStatus("idle");
      playSuccess();
    } else {
      setAppliedPromo(null);
      setPromoStatus("invalid");
    }
  };

  const quitarPromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoStatus("idle");
  };

  const handleQtyChange = (type: "5L" | "2L", delta: number) => {
    playClick();
    if (type === "5L") {
      setQty5L((prev) => Math.max(0, prev + delta));
    } else {
      setQty2L((prev) => Math.max(0, prev + delta));
    }
  };

  const select5LId = useId();
  const select2LId = useId();

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
        isValid = value.trim().length > 2;
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

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const generateWhatsAppLink = () => {
    playSuccess();
    const text = encodeURIComponent(
      `Hola SCA San Juan Bautista Peñolite,\nMe gustaría realizar un pedido:\n\n` +
        `- Cajas 5L (3x5L=15L): ${qty5L} (${qty5L * price5LBox}€)\n` +
        `- Cajas 2L (6x2L=12L): ${qty2L} (${qty2L * price2LBox}€)\n` +
        `- Total Litros: ${totalLitros} L\n` +
        `- Envío a: ${shippingRegion.toUpperCase()}\n` +
        (appliedPromo ? `- Código de descuento: ${appliedPromo.codigo}\n` : "") +
        `- Importe Estimado: ${finalTotal.toFixed(2)}€\n\n` +
        `Por favor indicadme disponibilidad y forma de pago. Gracias.`
    );
    return `https://wa.me/34620022801?text=${text}`;
  };

  const allContactValid =
    contact.nombre.length > 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
    /^\d{9,}$/.test(contact.telefono) &&
    /^\d{5}$/.test(contact.codigoPostal) &&
    totalLitros > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!allContactValid || sending) return;

    // Honeypot: si un bot rellenó este campo oculto, se descarta en silencio
    if (honeypotRef.current?.value) {
      setSubmitted(true);
      return;
    }

    setSending(true);
    setSendError(false);

    try {
      // El pedido en la base de datos es la fuente de verdad (lo que ve
      // Eva en su panel) — si esto falla, se avisa al usuario. El email
      // es solo un aviso rápido: si falla, no se bloquea el pedido, que
      // ya ha quedado guardado.
      const { error: dbError } = await supabase.from("pedidos").insert({
        nombre: contact.nombre,
        email: contact.email,
        telefono: contact.telefono,
        codigo_postal: contact.codigoPostal,
        perfil: profile,
        cajas_3x5l: qty5L,
        cajas_6x2l: qty2L,
        total_litros: totalLitros,
        destino_envio: shippingRegion,
        subtotal: Number(rawSubtotal.toFixed(2)),
        descuento: Number((discountAmount + promoDiscountAmount).toFixed(2)),
        portes: Number(shippingCost.toFixed(2)),
        total_estimado: Number(finalTotal.toFixed(2)),
        codigo_promo: appliedPromo?.codigo ?? null,
      });
      if (dbError) throw dbError;

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Pedido configurador — ${contact.nombre} (${totalLitros}L)`,
          from_name: "Web SCA San Juan Bautista de Peñolite",
          nombre: contact.nombre,
          email: contact.email,
          telefono: contact.telefono,
          codigo_postal: contact.codigoPostal,
          perfil_comprador: profile,
          cajas_3x5l: qty5L,
          cajas_6x2l: qty2L,
          total_litros: totalLitros,
          destino_envio: shippingRegion,
          subtotal: rawSubtotal.toFixed(2),
          descuento: (discountAmount + promoDiscountAmount).toFixed(2),
          codigo_promo: appliedPromo?.codigo ?? "ninguno",
          portes: shippingCost.toFixed(2),
          total_estimado: finalTotal.toFixed(2),
        }),
      }).catch(() => {
        // El pedido ya está guardado en la base de datos; si el aviso
        // por email falla, no pasa nada grave.
      });

      playSuccess();
      setSubmitted(true);
      setSending(false);

      setTimeout(() => {
        setSubmitted(false);
        setContact({ nombre: "", email: "", telefono: "", codigoPostal: "" });
        setValidation({});
        quitarPromo();
      }, 4000);
    } catch {
      setSending(false);
      setSendError(true);
    }
  };

  return (
    <section id="formulario-contacto" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-negro text-tx-crema overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-dorado/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dorado/40 bg-dorado/10 text-dorado text-xs font-mono tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Configurador Directo de Cooperativa
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-tx-crema tracking-tight mb-6">
            Directo de la Almazara a tu Mesa
          </h2>
          <p className="text-tx-muted text-base sm:text-lg">
            Calcula en tiempo real tu pedido de AOVE Picual 100% Sierra de Segura sin intermediarios, con las tarifas oficiales de la cooperativa.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Selector & Options */}
          <div className="lg:col-span-7 space-y-8 bg-black/40 backdrop-blur-xl border border-dorado/20 p-6 sm:p-8 rounded-2xl shadow-2xl">
            {/* Step 1: Profile Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-dorado mb-3">
                1. Selecciona tu perfil de comprador
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "particular", label: "Particular / Familia" },
                  { id: "horeca", label: "Restauración / Hostelería" },
                  { id: "distribuidor", label: "Distribución / Export" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setProfile(item.id as "particular" | "horeca" | "distribuidor");
                    }}
                    className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-center ${
                      profile === item.id
                        ? "border-dorado bg-dorado/20 text-white shadow-[0_0_15px_rgba(200,150,30,0.3)]"
                        : "border-white/10 bg-white/5 text-tx-muted hover:border-dorado/50 hover:text-tx-crema"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Formats & Quantities */}
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-widest text-dorado">
                2. Selecciona los Formatos de AOVE
              </label>

              {/* Product 1: Caja 3x5L */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:border-dorado/40 transition-all gap-4">
                <div>
                  <h4 className="font-semibold text-tx-crema text-base">Caja 3 Garrafas × 5 Litros</h4>
                  <p className="text-xs text-tx-muted mt-1">
                    Formato familiar (15L Total) · {(price5LBox / 15).toFixed(2).replace(".", ",")} € / litro
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block font-mono text-lg font-bold text-dorado">
                      {price5LBox.toFixed(2).replace(".", ",")} €
                    </span>
                    <span className="text-[10px] text-tx-muted">IVA inc.</span>
                  </div>
                  <div className="flex items-center border border-white/20 rounded-lg bg-black/50">
                    <button
                      type="button"
                      onClick={() => handleQtyChange("5L", -1)}
                      className="px-3 py-1 text-tx-muted hover:text-white transition-colors"
                      aria-label="Restar caja 5L"
                      data-cursor-compact
                    >
                      -
                    </button>
                    <label htmlFor={select5LId} className="sr-only">Cantidad cajas 5L</label>
                    <input
                      id={select5LId}
                      type="number"
                      value={qty5L}
                      readOnly
                      className="w-10 text-center font-mono font-bold bg-transparent text-sm text-tx-crema focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQtyChange("5L", 1)}
                      className="px-3 py-1 text-tx-muted hover:text-white transition-colors"
                      aria-label="Sumar caja 5L"
                      data-cursor-compact
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Product 2: Caja 6x2L */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:border-dorado/40 transition-all gap-4">
                <div>
                  <h4 className="font-semibold text-tx-crema text-base">Caja 6 Garrafas × 2 Litros</h4>
                  <p className="text-xs text-tx-muted mt-1">
                    Formato manejable (12L Total) · {(price2LBox / 12).toFixed(2).replace(".", ",")} € / litro
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block font-mono text-lg font-bold text-dorado">
                      {price2LBox.toFixed(2).replace(".", ",")} €
                    </span>
                    <span className="text-[10px] text-tx-muted">IVA inc.</span>
                  </div>
                  <div className="flex items-center border border-white/20 rounded-lg bg-black/50">
                    <button
                      type="button"
                      onClick={() => handleQtyChange("2L", -1)}
                      className="px-3 py-1 text-tx-muted hover:text-white transition-colors"
                      aria-label="Restar caja 2L"
                      data-cursor-compact
                    >
                      -
                    </button>
                    <label htmlFor={select2LId} className="sr-only">Cantidad cajas 2L</label>
                    <input
                      id={select2LId}
                      type="number"
                      value={qty2L}
                      readOnly
                      className="w-10 text-center font-mono font-bold bg-transparent text-sm text-tx-crema focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleQtyChange("2L", 1)}
                      className="px-3 py-1 text-tx-muted hover:text-white transition-colors"
                      aria-label="Sumar caja 2L"
                      data-cursor-compact
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Destination */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-dorado mb-3">
                3. Destino de Envío
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "peninsula", label: "España Peninsular" },
                  { id: "baleares", label: "Baleares / Canarias" },
                  { id: "ue", label: "Unión Europea" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setShippingRegion(item.id as "peninsula" | "baleares" | "ue");
                    }}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-medium transition-all text-center ${
                      shippingRegion === item.id
                        ? "border-dorado bg-dorado/20 text-white"
                        : "border-white/10 bg-white/5 text-tx-muted hover:border-dorado/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Contact data */}
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase tracking-widest text-dorado">
                4. Tus Datos de Contacto y Envío
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="nombre"
                  value={contact.nombre}
                  onChange={handleContactChange}
                  placeholder="Nombre completo"
                  aria-label="Nombre completo"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-sm text-tx-crema placeholder:text-tx-muted focus:outline-none"
                  style={{
                    border: `1px solid ${validation.nombre === false ? "#ff4444" : "rgba(255,255,255,0.1)"}`,
                  }}
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                  placeholder="tu@email.com"
                  aria-label="Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-sm text-tx-crema placeholder:text-tx-muted focus:outline-none"
                  style={{
                    border: `1px solid ${validation.email === false ? "#ff4444" : "rgba(255,255,255,0.1)"}`,
                  }}
                  required
                />
                <input
                  type="tel"
                  name="telefono"
                  value={contact.telefono}
                  onChange={handleContactChange}
                  placeholder="Teléfono"
                  aria-label="Teléfono"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-sm text-tx-crema placeholder:text-tx-muted focus:outline-none"
                  style={{
                    border: `1px solid ${validation.telefono === false ? "#ff4444" : "rgba(255,255,255,0.1)"}`,
                  }}
                  required
                />
                <input
                  type="text"
                  name="codigoPostal"
                  value={contact.codigoPostal}
                  onChange={handleContactChange}
                  placeholder="Código postal"
                  aria-label="Código postal"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-sm text-tx-crema placeholder:text-tx-muted focus:outline-none"
                  style={{
                    border: `1px solid ${validation.codigoPostal === false ? "#ff4444" : "rgba(255,255,255,0.1)"}`,
                  }}
                  required
                />
              </div>
            </div>

            {/* Guarantees Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-[11px] text-tx-muted">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-dorado shrink-0" />
                <span>D.O. Sierra de Segura</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-dorado shrink-0" />
                <span>Envío en 24/48h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-dorado shrink-0" />
                <span>Garantía Almazara</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Invoice Card + Submit */}
          <div className="lg:col-span-5 bg-gradient-to-b from-dorado/15 to-black border border-dorado/40 p-6 sm:p-8 rounded-2xl shadow-2xl relative">
            {/* Honeypot antispam: invisible para personas, tentador para bots */}
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
            />

            <div className="flex items-center justify-between border-b border-dorado/30 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-dorado" />
                <h3 className="font-serif text-xl text-tx-crema">Resumen del Pedido</h3>
              </div>
              <span className="text-xs font-mono bg-dorado/20 text-dorado px-2.5 py-1 rounded-full border border-dorado/40">
                SCA SAN JUAN BAUTISTA
              </span>
            </div>

            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle size={48} className="text-dorado mx-auto mb-4" />
                <h4 className="font-serif text-2xl text-tx-crema mb-2">¡Pedido enviado!</h4>
                <p className="text-sm text-tx-muted">
                  Gracias, {contact.nombre || "gracias por tu pedido"}. Nos pondremos en
                  contacto en 24 horas para confirmar el presupuesto y el envío.
                </p>
              </div>
            ) : (
              <>
                {/* Código de descuento */}
                <div className="mb-6">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10">
                      <div className="flex items-center gap-2 text-xs text-emerald-300">
                        <Tag className="w-4 h-4 shrink-0" />
                        <span>
                          Código <span className="font-mono font-bold">{appliedPromo.codigo}</span> aplicado
                          {appliedPromo.descuento_pct ? ` · -${appliedPromo.descuento_pct}%` : ""}
                          {appliedPromo.envio_gratis ? " · envío gratis" : ""}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={quitarPromo}
                        className="text-xs text-tx-muted hover:text-white shrink-0"
                        data-cursor-compact
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-widest text-dorado mb-2">
                        ¿Tienes un código de descuento?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            if (promoStatus === "invalid") setPromoStatus("idle");
                          }}
                          placeholder="Ej: PENOLITE10"
                          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white/5 text-sm text-tx-crema placeholder:text-tx-muted focus:outline-none"
                          style={{
                            border: `1px solid ${promoStatus === "invalid" ? "#ff4444" : "rgba(255,255,255,0.1)"}`,
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={!promoInput.trim() || promoStatus === "checking"}
                          className="px-4 py-2.5 rounded-xl border border-dorado/50 text-dorado text-xs font-semibold uppercase tracking-wide hover:bg-dorado/10 disabled:opacity-50 shrink-0"
                          data-cursor-compact
                        >
                          {promoStatus === "checking" ? "..." : "Aplicar"}
                        </button>
                      </div>
                      {promoStatus === "invalid" && (
                        <p className="mt-1.5 text-xs text-red-400">Código no válido o caducado.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Breakdown List */}
                <div className="space-y-3 font-mono text-sm mb-6">
                  <div className="flex justify-between text-tx-muted">
                    <span>Litros Totales:</span>
                    <span className="text-tx-crema font-bold">{totalLitros} Litros</span>
                  </div>
                  <div className="flex justify-between text-tx-muted">
                    <span>Precio Medio / Litro:</span>
                    <span className="text-dorado">{pricePerLiterAvg} €/L</span>
                  </div>
                  <div className="flex justify-between text-tx-muted">
                    <span>Subtotal Productos:</span>
                    <span className="text-tx-crema">{rawSubtotal.toFixed(2)} €</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Descuento por Volumen ({(volumeDiscountPercent * 100).toFixed(0)}%):</span>
                      <span>-{discountAmount.toFixed(2)} €</span>
                    </div>
                  )}

                  {promoDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Código {appliedPromo?.codigo} ({appliedPromo?.descuento_pct}%):</span>
                      <span>-{promoDiscountAmount.toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="flex justify-between text-tx-muted">
                    <span>Portes de Envío:</span>
                    <span className="text-tx-crema">
                      {shippingCost === 0 ? (
                        <span className="text-emerald-400 uppercase text-xs">GRATIS</span>
                      ) : (
                        `${shippingCost.toFixed(2)} €`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-dorado/20 pt-4 flex justify-between items-baseline">
                    <span className="font-serif text-lg text-tx-crema">Total Estimado:</span>
                    <div className="text-right">
                      <span className="font-mono text-3xl font-extrabold text-dorado drop-shadow-[0_0_10px_rgba(200,150,30,0.5)]">
                        {finalTotal.toFixed(2)} €
                      </span>
                      <span className="block text-[10px] text-tx-muted">IVA del Aceite Incluido</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={!allContactValid || sending}
                    className="w-full py-4 px-4 bg-dorado hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-negro font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg text-sm tracking-wide"
                    data-cursor="ENVIAR"
                  >
                    <Send className="w-4 h-4" />
                    {sending ? "Enviando..." : "Enviar Pedido"}
                  </button>

                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={playGoldDrop}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
                    data-cursor="WHATSAPP"
                  >
                    <PhoneCall className="w-4 h-4" />
                    O pedir por WhatsApp (+34 620 022 801)
                  </a>
                </div>

                {sendError && (
                  <div className="mt-4 flex items-start gap-2 p-3 rounded-lg border border-red-500/40 bg-red-500/10">
                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-tx-muted leading-relaxed">
                      No se ha podido enviar. Escríbenos a{" "}
                      <a href="mailto:sca.sanjuanbautistaonline@gmail.com" className="text-dorado">
                        sca.sanjuanbautistaonline@gmail.com
                      </a>{" "}
                      o usa el botón de WhatsApp.
                    </p>
                  </div>
                )}

                <p className="text-center text-[11px] text-tx-muted mt-4">
                  Atención directa de la cooperativa en Peñolite, Jaén. Envío protegido en caja térmica anti-roturas.
                </p>
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
