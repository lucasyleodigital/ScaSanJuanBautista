export default function Footer() {
  return (
    <footer className="relative border-t border-rule bg-negro px-6 pt-16 pb-10 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="mb-1.5 font-serif text-base text-tx-crema">
              San Juan Bautista de Peñolite
            </div>
            <p className="max-w-xs text-[11px] leading-relaxed text-tx-bajo">
              Cooperativa de aceite de oliva virgen extra fundada en 1958 en
              Peñolite, Sierra de Segura, Jaén.
            </p>
          </div>
          <FooterCol
            title="Navegación"
            links={[
              ["Historia", "#historia"],
              ["El Olivar", "#olivar"],
              ["Productos", "#productos"],
              ["Calidad", "#calidad"],
            ]}
          />
          <FooterCol
            title="Cooperativa"
            links={[
              ["Solicitar pedido", "#pedido"],
              ["Contacto", "#contacto"],
            ]}
          />
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
