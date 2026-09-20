"use client";

import React, { useState, useId } from "react";
import { useAudio } from "./AudioEngine";
import { Check, ShoppingBag, Send, PhoneCall, Award, Truck, ShieldCheck, Sparkles } from "lucide-react";

export default function CalculadoraPedidoInteractive() {
  const [profile, setProfile] = useState<"particular" | "horeca" | "distribuidor">("particular");
  const [qty5L, setQty5L] = useState<number>(1);
  const [qty2L, setQty2L] = useState<number>(0);
  const [shippingRegion, setShippingRegion] = useState<"peninsula" | "baleares" | "ue">("peninsula");

  const { playClick, playGoldDrop, playSuccess } = useAudio();

  // Price calculations
  const price5LBox = 85.0; // 3 x 5L = 15L
  const price2LBox = 69.0; // 12 x 2L = 24L

  const totalLitros5L = qty5L * 15;
  const totalLitros2L = qty2L * 24;
  const totalLitros = totalLitros5L + totalLitros2L;

  const rawSubtotal = qty5L * price5LBox + qty2L * price2LBox;

  // Discount for larger volume orders
  const volumeDiscountPercent = totalLitros >= 100 ? 0.1 : totalLitros >= 50 ? 0.05 : 0;
  const discountAmount = rawSubtotal * volumeDiscountPercent;

  // Shipping cost
  const shippingCost =
    rawSubtotal === 0
      ? 0
      : shippingRegion === "peninsula"
      ? rawSubtotal > 150
        ? 0
        : 8.5
      : shippingRegion === "baleares"
      ? 18.0
      : 35.0;

  const finalTotal = rawSubtotal - discountAmount + shippingCost;
  const pricePerLiterAvg = totalLitros > 0 ? (rawSubtotal / totalLitros).toFixed(2) : "0.00";

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

  const generateWhatsAppLink = () => {
    playSuccess();
    const text = encodeURIComponent(
      `Hola SCA San Juan Bautista Peñolite 👋\nMe gustaría realizar un pedido:\n\n` +
        `- Cajas 5L (3x5L=15L): ${qty5L} (${qty5L * price5LBox}€)\n` +
        `- Cajas 2L (12x2L=24L): ${qty2L} (${qty2L * price2LBox}€)\n` +
        `- Total Litros: ${totalLitros} L\n` +
        `- Envío a: ${shippingRegion.toUpperCase()}\n` +
        `- Importe Estimado: ${finalTotal.toFixed(2)}€\n\n` +
        `Por favor indicadme disponibilidad y forma de pago. Gracias.`
    );
    return `https://wa.me/34953435316?text=${text}`;
  };

  const generateEmailLink = () => {
    playSuccess();
    const subject = encodeURIComponent(`Solicitud de Pedido AOVE Peñolite - ${totalLitros}L`);
    const body = encodeURIComponent(
      `Estimada Cooperativa San Juan Bautista,\n\nQuisiera solicitar información sobre el siguiente pedido:\n` +
        `- Cajas 3x5L: ${qty5L}\n` +
        `- Cajas 12x2L: ${qty2L}\n` +
        `- Total litros: ${totalLitros} Litros\n` +
        `- Perfil: ${profile}\n\n` +
        `Quedo a la espera de confirmación y datos para transferencia. Un cordial saludo.`
    );
    return `mailto:sca.sanjuanbautistaonline@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-negro text-tx-crema overflow-hidden">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                  <p className="text-xs text-tx-muted mt-1">Formato familiar (15L Total) · 5,66 € / litro</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block font-mono text-lg font-bold text-dorado">85,00 €</span>
                    <span className="text-[10px] text-tx-muted">IVA inc.</span>
                  </div>
                  <div className="flex items-center border border-white/20 rounded-lg bg-black/50">
                    <button
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

              {/* Product 2: Caja 12x2L */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:border-dorado/40 transition-all gap-4">
                <div>
                  <h4 className="font-semibold text-tx-crema text-base">Caja 12 Garrafas × 2 Litros</h4>
                  <p className="text-xs text-tx-muted mt-1">Formato manejable (24L Total) · 2,88 € / litro</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block font-mono text-lg font-bold text-dorado">69,00 €</span>
                    <span className="text-[10px] text-tx-muted">IVA inc.</span>
                  </div>
                  <div className="flex items-center border border-white/20 rounded-lg bg-black/50">
                    <button
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

          {/* Right Column: Dynamic Price Invoice Card */}
          <div className="lg:col-span-5 bg-gradient-to-b from-dorado/15 to-black border border-dorado/40 p-6 sm:p-8 rounded-2xl shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-dorado/30 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-dorado" />
                <h3 className="font-serif text-xl text-tx-crema">Resumen del Pedido</h3>
              </div>
              <span className="text-xs font-mono bg-dorado/20 text-dorado px-2.5 py-1 rounded-full border border-dorado/40">
                SCA SAN JUAN BAUTISTA
              </span>
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
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playGoldDrop}
                className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20 text-sm tracking-wide"
                data-cursor="WHATSAPP"
              >
                <PhoneCall className="w-4 h-4" />
                Pedir por WhatsApp (+34 953 435 316)
              </a>

              <a
                href={generateEmailLink()}
                onMouseEnter={playGoldDrop}
                className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-tx-crema font-medium rounded-xl flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
                data-cursor="EMAIL"
              >
                <Send className="w-4 h-4 text-dorado" />
                Pedir por Email
              </a>
            </div>

            <p className="text-center text-[11px] text-tx-muted mt-4">
              Atención directa de la cooperativa en Peñolite, Jaén. Envío protegido en caja térmica anti-roturas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
