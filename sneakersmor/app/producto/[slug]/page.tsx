import { notFound } from "next/navigation";
import { getProductoBySlug, productos } from "@/lib/data";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductCard from "@/components/ProductCard";
import type { Metadata } from "next";

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const producto = getProductoBySlug(params.slug);
  if (!producto) return {};
  return {
    title: producto.nombre,
    description: producto.descripcion,
    openGraph: {
      title: `${producto.nombre} · SneakersMor.MX`,
      description: producto.descripcion,
      images: [producto.imagenes[0]],
    },
  };
}

export default function ProductoPage({ params }: { params: { slug: string } }) {
  const producto = getProductoBySlug(params.slug);
  if (!producto) notFound();

  const relacionados = productos
    .filter((p) => p.id !== producto.id && (p.marca === producto.marca || p.categoria === producto.categoria))
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    image: producto.imagenes,
    description: producto.descripcion,
    sku: producto.sku,
    brand: { "@type": "Brand", name: producto.marca },
    offers: {
      "@type": "Offer",
      priceCurrency: "MXN",
      price: producto.precio,
      availability: producto.tallas.some((t) => t.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="font-mono text-[11px] uppercase tracking-widest text-ink/50 dark:text-chalk/50 mb-6">
        Tienda / {producto.categoria} / <span className="text-ink dark:text-chalk">{producto.nombre}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <ProductGallery imagenes={producto.imagenes} nombre={producto.nombre} />
        <ProductPurchasePanel producto={producto} />
      </div>

      <section className="mt-16 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-xl mb-4">Descripción</h2>
          <div className="text-sm leading-relaxed text-ink/80 dark:text-chalk/80" dangerouslySetInnerHTML={{ __html: producto.descripcion }} />
        </div>
        <div>
          <h2 className="font-display text-xl mb-4">Ficha técnica</h2>
          <dl className="divide-y divide-ink/10 dark:divide-chalk/10 border-t border-b border-ink/10 dark:border-chalk/10 text-sm">
            <Fila etiqueta="Materiales" valor={producto.materiales} />
            <Fila etiqueta="Tipo de suela" valor={producto.tipoSuela} />
            <Fila etiqueta="Peso" valor={producto.peso} />
            <Fila etiqueta="Colores disponibles" valor={producto.colores.join(", ")} />
            <Fila etiqueta="Incluye caja" valor={producto.incluyeCaja ? "Sí" : "No"} />
            <Fila etiqueta="Garantía" valor={`${producto.garantiaDias} días`} />
            <Fila etiqueta="Tiempo de envío" valor={producto.envioDiasHabiles} />
            <Fila etiqueta="Método de fabricación" valor={producto.fabricacion} />
            <Fila etiqueta="Cuidados" valor={producto.cuidados} />
          </dl>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {relacionados.map((p, i) => (
              <ProductCard key={p.id} producto={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-ink/50 dark:text-chalk/50">{etiqueta}</dt>
      <dd className="text-right">{valor}</dd>
    </div>
  );
}
