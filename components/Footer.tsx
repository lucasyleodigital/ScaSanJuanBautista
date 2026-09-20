import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t border-rule bg-negro px-6 pt-16 pb-10 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Image
                src="/images/logo/logo-footer.png"
                alt="SCA San Juan Bautista de Peñolite"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0"
              />
              <div className="font-serif text-base text-tx-crema">
                San Juan Bautista de Peñolite
              </div>
            </div>
            <p className="max-w-xs text-[11px] leading-relaxed text-tx-bajo">
              Cooperativa de aceite de oliva virgen extra fundada en 1958 en
              Peñolite, Sierra de Segura, Jaén.
            </p>
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
            links={[
              ["Solicitar pedido", "/#formulario-contacto"],
              ["Contacto", "/#cooperativa"],
            ]}
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
