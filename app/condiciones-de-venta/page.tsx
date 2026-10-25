import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Condiciones de Venta, Envíos y Devoluciones | SCA San Juan Bautista de Peñolite",
  description:
    "Plazos de preparación y entrega, formas de pago, derecho de desistimiento de 14 días y garantía de los pedidos de aceite Dehesa de Peñolite.",
  alternates: { canonical: "/condiciones-de-venta" },
  robots: { index: true, follow: true },
};

export default function CondicionesDeVentaPage() {
  return (
    <LegalPageLayout title="Condiciones de Venta, Envíos y Devoluciones" updated="25 de octubre de 2026">
      <p>
        Estas condiciones se aplican a los pedidos que se hacen en
        www.dehesapenolite.com. El vendedor es SCA San Juan Bautista de
        Peñolite (CIF F23006992), Calle Peñolite, 1, Peñolite (Puente de
        Génave), Jaén. Contacto: <a href="mailto:pedidos@dehesapenolite.com">pedidos@dehesapenolite.com</a>{" "}
        · +34 953 435 316 · WhatsApp +34 620 022 801.
      </p>

      <h2>1. Cómo se hace un pedido</h2>
      <p>
        Eliges las cajas en el configurador de pedido, indicas tus datos de
        entrega y envías el pedido. Te lo confirmamos por email, teléfono o
        WhatsApp con el importe final, incluidos los portes. Los precios
        incluyen el IVA.
      </p>

      <h2>2. Formas de pago</h2>
      <p>
        El pago se hace directamente a la cooperativa, por Bizum o por
        transferencia bancaria. No se cobra nada en la web.
      </p>

      <h2>3. Preparación y plazos de entrega</h2>
      <ul>
        <li>
          <strong>Preparación:</strong> preparamos y enviamos el pedido en un
          plazo de 24 horas desde que lo confirmamos y recibimos el pago.
        </li>
        <li>
          <strong>Entrega:</strong> entre 24 horas y 6 o 7 días, según la zona
          de destino.
        </li>
        <li>
          <strong>Coste del envío:</strong> se calcula según el peso del
          pedido y la provincia de entrega, y lo ves en el configurador antes
          de enviar el pedido.
        </li>
        <li>
          <strong>Canarias, Ceuta y Melilla:</strong> el envío se presupuesta
          aparte. Escríbenos y te lo confirmamos antes de cerrar el pedido.
        </li>
      </ul>
      <p>
        Las cajas se envían embaladas para evitar roturas en el transporte.
      </p>

      <h2>4. Derecho de desistimiento (devoluciones)</h2>
      <p>
        Si compras como consumidor, tienes <strong>14 días naturales</strong>{" "}
        desde que recibes el pedido para desistir de la compra, sin tener que
        dar ningún motivo.
      </p>
      <ul>
        <li>
          <strong>Cómo hacerlo:</strong> comunícanoslo antes de que acabe el
          plazo por email a{" "}
          <a href="mailto:pedidos@dehesapenolite.com">pedidos@dehesapenolite.com</a>,
          por teléfono o por WhatsApp. Puedes usar el formulario de abajo,
          aunque no es obligatorio.
        </li>
        <li>
          <strong>Devolución del producto:</strong> debes enviarnos el
          producto en un plazo máximo de 14 días naturales desde que nos
          comunicas tu decisión. Los gastos directos de la devolución corren
          a tu cargo.
        </li>
        <li>
          <strong>Reembolso:</strong> te devolvemos el importe pagado,
          incluidos los gastos del envío original, en un plazo máximo de 14
          días naturales desde que nos comunicas tu decisión, por el mismo
          medio de pago que usaste. Podemos esperar a recibir el producto
          antes de hacer el reembolso.
        </li>
        <li>
          <strong>Excepción:</strong> por razones de higiene y protección de
          la salud, no se pueden devolver por desistimiento los envases
          precintados que se hayan abierto después de la entrega.
        </li>
      </ul>

      <h2>5. Productos dañados o que no se corresponden con el pedido</h2>
      <p>
        Si el pedido llega dañado o no es lo que pediste, avísanos cuanto
        antes, a ser posible con fotos del paquete y del producto. Te lo
        reponemos o te devolvemos el importe, sin ningún coste para ti.
        Además, los productos cuentan con la garantía legal de conformidad
        que establece la ley.
      </p>

      <h2>6. Formulario de desistimiento</h2>
      <p>
        Solo tienes que rellenarlo y enviárnoslo si quieres desistir del
        contrato:
      </p>
      <div className="placeholder-box">
        <p>
          A la atención de SCA San Juan Bautista de Peñolite, Calle Peñolite,
          1, Peñolite (Puente de Génave), Jaén ·
          pedidos@dehesapenolite.com:
        </p>
        <p>
          Por la presente le comunico que desisto de mi contrato de venta del
          siguiente bien: ____________________
        </p>
        <p>Pedido el / recibido el: ____________________</p>
        <p>Nombre del consumidor: ____________________</p>
        <p>Domicilio del consumidor: ____________________</p>
        <p>Firma del consumidor (solo si se envía en papel)</p>
        <p>Fecha: ____________________</p>
      </div>

      <h2>7. Atención al cliente y reclamaciones</h2>
      <p>
        Para cualquier duda o reclamación puedes escribirnos a{" "}
        <a href="mailto:pedidos@dehesapenolite.com">pedidos@dehesapenolite.com</a>{" "}
        o llamarnos al +34 953 435 316. Te responderemos lo antes posible.
      </p>

      <style>{`
        .placeholder-box {
          border: 1px solid rgba(200, 150, 30, 0.35);
          border-radius: 8px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #F0E8CC;
        }
      `}</style>
    </LegalPageLayout>
  );
}
