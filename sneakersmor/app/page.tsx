import Link from "next/link";
import { productos, marcas, coleccionesList } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import InstagramStrip from "@/components/InstagramStrip";

export default function HomePage() {
  const destacados = productos.filter((p) => p.destacado).slice(0, 8);
  const nuevos = productos.filter((p) => p.nuevoIngreso).slice(0, 4);
  const masVendidos = productos.filter((p) => p.masVendido).slice(0, 4);
  const ofertas = productos.filter((p) => p.enOferta).slice(0, 4);

  return (
    <>
      <Hero />

      <Seccion titulo="Destacados" subtitulo="La selección de esta semana" href="/tienda">
        <Grid productos={destacados} />
      </Seccion>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="box-label pl-6 py-8 md:py-10 px-6 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <p className="sku-tag mb-2">Paquete de emprendimiento</p>
            <h2 className="font-display text-2xl md:text-3xl max-w-md">
              Vende sneakers sin inventario propio, nosotros surtimos tu pedido.
            </h2>
          </div>
          <Link
            href="/tienda?filtro=mayoreo"
            className="shrink-0 bg-ember text-chalk px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-ember-dim transition-colors"
          >
            Ver precios de mayoreo
          </Link>
        </div>
      </section>

      <Seccion titulo="Nuevos ingresos" subtitulo="Recién llegados al catálogo" href="/tienda?filtro=nuevo">
        <Grid productos={nuevos} />
      </Seccion>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="box-label pl-6 py-8 md:py-10 px-6 flex flex-col md:flex-row items-center gap-6 justify-between border border-ember/30 bg-ember/5 dark:bg-ember/10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-ember/20 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10">
            <p className="sku-tag mb-2 text-ember dark:text-ember font-bold">Lleva más, paga menos</p>
            <h2 className="font-display text-2xl md:text-3xl max-w-md">
              Descuentos automáticos en tu carrito
            </h2>
            <div className="mt-4 space-y-2 text-sm text-ink/70 dark:text-chalk/70">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-ember rounded-full" /> 
                <strong>10% de descuento</strong> al llevar 3 a 5 pares.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-ember rounded-full" /> 
                <strong>15% de descuento</strong> al llevar 6 pares o más.
              </p>
              <p className="flex items-center gap-2 text-ember font-bold">
                <span className="w-2 h-2 bg-ember rounded-full" /> 
                Envío GRATIS a partir de 3 pares.
              </p>
            </div>
          </div>
          <Link
            href="/tienda"
            className="relative z-10 shrink-0 bg-ember text-chalk px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-ember-dim transition-colors"
          >
            Comprar ahora
          </Link>
        </div>
      </section>

      {ofertas.length > 0 && (
        <Seccion titulo="Ofertas" subtitulo="Por tiempo limitado" href="/tienda?filtro=oferta">
          <Grid productos={ofertas} />
        </Seccion>
      )}



      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <p className="sku-tag mb-2">Colecciones</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {coleccionesList.map((c) => {
            const prod = productos.find(p => p.coleccion === c);
            const bgImage = c === "General" ? "/step-up-logo.png" : (prod?.imagenes[0] || `https://picsum.photos/seed/${c}/600/450`);
            return (
              <Link
                key={c}
                href={`/tienda?coleccion=${encodeURIComponent(c)}`}
                className="group relative aspect-[4/3] overflow-hidden box-label pl-0"
              >
                <div className="absolute inset-0 bg-ink/40 dark:bg-ink/50 group-hover:bg-ink/20 transition-colors z-10" />
                <div
                  className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
                <span className="absolute bottom-4 left-4 z-20 font-display text-xl text-chalk">{c}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <ReviewsCarousel />
      <InstagramStrip />
    </>
  );
}

function Seccion({
  titulo,
  subtitulo,
  href,
  children,
}: {
  titulo: string;
  subtitulo: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl md:text-3xl">{titulo}</h2>
          <p className="text-sm text-ink/60 dark:text-chalk/60">{subtitulo}</p>
        </div>
        <Link href={href} className="font-mono text-xs uppercase tracking-widest hover:text-ember shrink-0">
          Ver todo →
        </Link>
      </div>
      {children}
    </section>
  );
}

function Grid({ productos }: { productos: typeof import("@/lib/data").productos }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
      {productos.map((p, i) => (
        <ProductCard key={p.id} producto={p} index={i} />
      ))}
    </div>
  );
}
