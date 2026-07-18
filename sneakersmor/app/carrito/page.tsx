"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatoMXN } from "@/lib/format";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CarritoPage() {
  const { items, quitar, actualizarCantidad, subtotal } = useCart();
  const [cupon, setCupon] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [mensajeCupon, setMensajeCupon] = useState("");

  const aplicarCupon = () => {
    if (cupon.trim().toUpperCase() === "MOR10") {
      setDescuentoAplicado(subtotal * 0.1);
      setMensajeCupon("Cupón aplicado: 10% de descuento");
    } else {
      setDescuentoAplicado(0);
      setMensajeCupon("Cupón no válido");
    }
  };

  const envio = subtotal > 0 && subtotal < 1500 ? 149 : 0;
  const total = subtotal - descuentoAplicado + envio;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display text-3xl mb-8">Tu carrito</h1>

      {items.length === 0 ? (
        <div className="box-label pl-6 p-10 text-center">
          <p className="font-display text-xl mb-2">Tu carrito está vacío</p>
          <p className="text-sm text-ink/60 dark:text-chalk/60 mb-6">Explora el catálogo y encuentra tu próximo par.</p>
          <Link href="/tienda" className="inline-block bg-ink dark:bg-chalk text-chalk dark:text-ink px-6 py-3 font-mono text-xs uppercase tracking-widest">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.talla}`} className="flex gap-4 box-label pl-4 p-3">
                <div className="relative w-24 h-24 shrink-0 bg-stone-soft dark:bg-asphalt-raised">
                  <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <Link href={`/producto/${item.slug}`} className="font-display text-base hover:text-ember">
                    {item.nombre}
                  </Link>
                  <p className="sku-tag mt-1">Talla MX {item.talla}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-ink/15 dark:border-chalk/15 h-9">
                      <button
                        className="w-8 h-full flex items-center justify-center"
                        onClick={() => actualizarCantidad(item.productId, item.talla, item.cantidad - 1)}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-mono">{item.cantidad}</span>
                      <button
                        className="w-8 h-full flex items-center justify-center"
                        onClick={() => actualizarCantidad(item.productId, item.talla, item.cantidad + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-mono text-sm">{formatoMXN(item.precio * item.cantidad)}</span>
                  </div>
                </div>
                <button
                  onClick={() => quitar(item.productId, item.talla)}
                  className="text-ink/40 dark:text-chalk/40 hover:text-ember self-start"
                  aria-label="Quitar del carrito"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <aside className="box-label pl-6 p-6 h-fit space-y-4">
            <h2 className="font-display text-lg">Resumen</h2>

            <div className="flex gap-2">
              <input
                value={cupon}
                onChange={(e) => setCupon(e.target.value)}
                placeholder="Código de cupón"
                className="flex-1 border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-10 text-sm outline-none focus:border-ember"
              />
              <button onClick={aplicarCupon} className="border border-ink/15 dark:border-chalk/15 px-4 text-xs font-mono uppercase tracking-widest hover:border-ember">
                Aplicar
              </button>
            </div>
            {mensajeCupon && <p className="text-xs font-mono text-ink/60 dark:text-chalk/60">{mensajeCupon}</p>}

            <div className="space-y-2 text-sm border-t border-ink/10 dark:border-chalk/10 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatoMXN(subtotal)}</span>
              </div>
              {descuentoAplicado > 0 && (
                <div className="flex justify-between text-jungle-bright">
                  <span>Descuento</span>
                  <span className="font-mono">-{formatoMXN(descuentoAplicado)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-mono">{envio === 0 ? "Gratis" : formatoMXN(envio)}</span>
              </div>
              <div className="flex justify-between font-display text-lg border-t border-ink/10 dark:border-chalk/10 pt-3 mt-2">
                <span>Total</span>
                <span className="font-mono">{formatoMXN(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block text-center bg-ember text-chalk py-3 font-mono text-xs uppercase tracking-widest hover:bg-ember-dim transition-colors"
            >
              Continuar al pago
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
