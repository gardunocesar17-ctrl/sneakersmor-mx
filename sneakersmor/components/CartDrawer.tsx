"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatoMXN } from "@/lib/format";

export default function CartDrawer() {
  const { items, abierto, setAbierto, quitar, actualizarCantidad, subtotal, descuento, costoEnvio, total, totalItems } = useCart();

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAbierto(false)}
            className="fixed inset-0 bg-ink/50 z-50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-stone dark:bg-asphalt z-50 flex flex-col shadow-soft"
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-ink/10 dark:border-chalk/10">
              <h2 className="font-display text-lg">Tu carrito</h2>
              <button onClick={() => setAbierto(false)} aria-label="Cerrar carrito">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 && (
                <p className="text-sm text-ink/60 dark:text-chalk/60 mt-8 text-center">
                  Aún no agregas ningún par. Explora la tienda y encuentra tu siguiente sneaker.
                </p>
              )}
              {items.map((item) => (
                <div key={`${item.productId}-${item.talla}`} className="flex gap-3 box-label pl-3 p-2">
                  <div className="relative w-20 h-20 shrink-0 bg-stone-soft dark:bg-asphalt-raised">
                    <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm leading-tight truncate">{item.nombre}</p>
                    <p className="sku-tag">Talla MX {item.talla}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-ink/15 dark:border-chalk/15">
                        <button
                          className="w-6 h-6 flex items-center justify-center"
                          onClick={() => actualizarCantidad(item.productId, item.talla, item.cantidad - 1)}
                          aria-label="Disminuir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-mono">{item.cantidad}</span>
                        <button
                          className="w-6 h-6 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => actualizarCantidad(item.productId, item.talla, item.cantidad + 1)}
                          disabled={item.cantidad >= item.maxStock}
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-mono text-xs">{formatoMXN(item.precio * item.cantidad)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => quitar(item.productId, item.talla)}
                    aria-label="Quitar del carrito"
                    className="text-ink/40 dark:text-chalk/40 hover:text-ember transition-colors self-start"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="border-t border-ink/10 dark:border-chalk/10 p-5 space-y-3">
                <div className="flex justify-between font-mono text-sm">
                  <span>Subtotal</span>
                  <span className={descuento > 0 ? "line-through text-ink/50 dark:text-chalk/50" : ""}>{formatoMXN(subtotal)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between font-mono text-sm text-ember">
                    <span>Descuento {totalItems >= 6 ? "(15%)" : "(10%)"}</span>
                    <span>-{formatoMXN(descuento)}</span>
                  </div>
                )}
                <div className="flex justify-between font-mono text-sm">
                  <span>Envío</span>
                  <span className={costoEnvio === 0 ? "text-ember font-bold" : ""}>
                    {costoEnvio === 0 ? "GRATIS" : `+${formatoMXN(costoEnvio)}`}
                  </span>
                </div>
                <div className="flex justify-between font-mono text-base font-bold">
                  <span>Total</span>
                  <span>{formatoMXN(total)}</span>
                </div>
                
                <Link
                  href="/checkout"
                  onClick={() => setAbierto(false)}
                  className="block text-center bg-ember text-chalk py-3 font-mono text-xs uppercase tracking-widest hover:bg-ember-dim transition-colors mt-2"
                >
                  Ir a pagar
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
