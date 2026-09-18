import ScrollProgress from "@/components/ScrollProgress";
import Nav from "@/components/Nav";
import HeroV2 from "@/components/HeroV2";
import TerroirV2 from "@/components/TerroirV2";
import ProcesoV2 from "@/components/ProcesoV2";
import ProductoV2 from "@/components/ProductoV2";
import CatalogV2 from "@/components/CatalogV2";
import FaqV2 from "@/components/FaqV2";
import CalculadoraPedidoInteractive from "@/components/CalculadoraPedidoInteractive";
import FormularioContactoV2 from "@/components/FormularioContactoV2";
import CierreV2 from "@/components/CierreV2";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="contenido">
        {/* CAP 1: Hero cinematográfico */}
        <HeroV2 />

        {/* CAP 2: Terroir con 3D y bento grid */}
        <TerroirV2 />

        {/* CAP 3: Proceso artesanal */}
        <ProcesoV2 />

        {/* CAP 4: Producto 3D y especificaciones */}
        <ProductoV2 />

        {/* CAP 5: Catálogo con precios y CTAs */}
        <CatalogV2 />

        {/* Configurador de Pedido e Impuesto Directo */}
        <CalculadoraPedidoInteractive />

        {/* Preguntas frecuentes */}
        <FaqV2 />

        {/* CAP 6: Formulario de contacto */}
        <section id="formulario-contacto">
          <FormularioContactoV2 />
        </section>

        {/* CAP 7: Cierre cinematográfico */}
        <CierreV2 />
      </main>
      <Footer />
    </>
  );
}

