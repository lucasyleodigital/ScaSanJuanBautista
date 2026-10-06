"use client";

import Image from "next/image";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 1.716-.287 1.95H12.427v8.245C19.396 23.238 24 18.179 24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 6.126 4.53 11.191 10.427 12.031Z" />
    </svg>
  );
}

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
              className="mb-4 h-32 w-32 shrink-0 md:h-44 md:w-44"
            />
            <div className="mb-3 font-serif text-base text-tx-crema">
              San Juan Bautista de Peñolite
            </div>
            <p className="mb-5 max-w-xs text-[11px] leading-relaxed text-tx-bajo">
              Cooperativa de aceite de oliva virgen extra fundada en 1958 en
              Peñolite, Sierra de Segura, Jaén.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/#formulario-contacto"
                data-cursor-active
                className="group relative inline-block overflow-hidden border border-dorado px-5 py-2.5 font-sans text-[10.5px] tracking-[0.16em] text-dorado uppercase no-underline transition-colors duration-350 hover:text-negro"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-dorado transition-transform duration-350 ease-[cubic-bezier(.83,0,.17,1)] group-hover:scale-y-100" />
                <span className="relative">Solicitar Pedido</span>
              </a>
              <a
                href="https://www.facebook.com/p/SCA-San-Juan-Bautista-Pe%C3%B1olite-100063301534955/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-active
                aria-label="Síguenos en Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rule text-tx-bajo no-underline transition-colors hover:border-dorado hover:text-dorado"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
          <FooterCol
            title="Navegación"
            links={[
              ["Historia", "/#historia"],
              ["El Olivar", "/#olivar"],
              ["Productos", "/#productos"],
              ["Calidad", "/#calidad"],
              ["Garrafa de 5 litros", "/aceite-oliva-virgen-extra-garrafa-5-litros"],
              ["Garrafa de 2 litros", "/aceite-oliva-virgen-extra-garrafa-2-litros"],
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
