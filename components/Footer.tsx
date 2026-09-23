"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-rule bg-negro px-6 pt-16 pb-10 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Image
              src="/images/logo/logo-footer.png"
              alt="SCA San Juan Bautista de Peñolite"
              width={400}
              height={400}
              className="mb-4 h-28 w-28 shrink-0 md:h-36 md:w-36"
            />
            <div className="mb-3 font-serif text-base text-tx-crema">
              San Juan Bautista de Peñolite
            </div>
            <p className="mb-5 max-w-xs text-[11px] leading-relaxed text-tx-bajo">
              Cooperativa de aceite de oliva virgen extra fundada en 1958 en
              Peñolite, Sierra de Segura, Jaén.
            </p>
            <a
              href="/#formulario-contacto"
              data-cursor-active
              className="group relative inline-block overflow-hidden border border-dorado px-5 py-2.5 font-sans text-[10.5px] tracking-[0.16em] text-dorado uppercase no-underline transition-colors duration-350 hover:text-negro"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-dorado transition-transform duration-350 ease-[cubic-bezier(.83,0,.17,1)] group-hover:scale-y-100" />
              <span className="relative">Solicitar Pedido</span>
            </a>
          </div>
          <FooterCol
            title="Navegación"
            links={[
              ["Historia", "/#historia"],
              ["El Olivar", "/#olivar"],
              ["Productos", "/#productos"],
              ["Calidad", "/#calidad"],
            ]}
          />
          <FooterCol
            title="Cooperativa"
            links={[["Contacto", "/#cooperativa"]]}
          />
        </div>
        <div className="mb-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-dorado/10 pt-7 text-[11px] text-tx-bajo">
          <a href="/aviso-legal" className="no-underline transition-colors hover:text-tx-crema">
            Aviso Legal
          </a>
          <a href="/politica-privacidad" className="no-underline transition-colors hover:text-tx-crema">
            Política de Privacidad
          </a>
          <a href="/politica-cookies" className="no-underline transition-colors hover:text-tx-crema">
            Política de Cookies
          </a>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("penolite:abrir-preferencias-cookies"))
            }
            className="no-underline transition-colors hover:text-tx-crema"
          >
            Preferencias de Cookies
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dorado/10 pt-7">
          <span className="text-[11px] text-tx-bajo">
            © {new Date().getFullYear()} SCA San Juan Bautista de Peñolite
          </span>
          <span className="text-[11px] text-tx-bajo">
            Diseño y desarrollo{" "}
            <a
              href="https://www.lucasyleodigital.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dorado/60 no-underline transition-colors hover:text-dorado"
            >
              Lucas y Leo Digital
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div className="mb-4 font-sans text-[9px] tracking-[0.25em] text-dorado uppercase">{title}</div>
      <ul className="flex flex-col gap-2.5">
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="text-sm text-tx-medio no-underline transition-colors hover:text-tx-crema">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
