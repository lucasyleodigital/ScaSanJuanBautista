import Link from "next/link";
import Footer from "./Footer";

export default function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-negro text-tx-crema">
      <header className="border-b border-rule px-6 py-6 md:px-10">
        <Link
          href="/"
          className="font-sans text-[11px] tracking-[0.14em] text-dorado uppercase no-underline transition-colors hover:text-ambar"
        >
          ← Volver a la web
        </Link>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:px-0">
        <h1 className="mb-2 font-serif text-3xl text-tx-crema md:text-4xl">
          {title}
        </h1>
        <p className="mb-10 text-xs text-tx-bajo">
          Última actualización: {updated}
        </p>

        <div className="legal-content flex flex-col gap-6 text-sm leading-relaxed text-tx-medio">
          {children}
        </div>
      </main>

      <Footer />

      <style>{`
        .legal-content h2 {
          font-family: var(--font-fraunces), Georgia, serif;
          font-size: 20px;
          color: #F0E8CC;
          margin-top: 8px;
        }
        .legal-content ul {
          list-style: disc;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .legal-content a {
          color: #C8961E;
        }
        .legal-content strong {
          color: #F0E8CC;
        }
        .legal-content .placeholder {
          color: #C8961E;
          background: rgba(200, 150, 30, 0.12);
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
