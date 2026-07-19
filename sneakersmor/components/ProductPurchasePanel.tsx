"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { formatoMXN } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { Truck, ShieldCheck, PackageCheck } from "lucide-react";

import { useStock } from "@/lib/useStock";

export default function ProductPurchasePanel({ producto }: { producto: Product }) {
  const [talla, setTalla] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState("");
  const { getRealStock: getGlobalStock } = useStock();

  const getRealStock = (tallaStr: string, originalStock: number) => {
    return getGlobalStock(producto.id, tallaStr, originalStock);
  };

  const originalStockTalla = producto.tallas.find((t) => t.talla === talla)?.stock ?? 0;
  const stockTalla = talla ? getRealStock(talla, originalStockTalla) : 0;
  
  const { items, agregar } = useCart();
  
  const enCarrito = items.find((i) => i.productId === producto.id && i.talla === talla)?.cantidad || 0;
  const maxDisponible = Math.max(0, stockTalla - enCarrito);

  const handleAgregar = () => {
    if (!talla) {
      setError("Selecciona una talla antes de agregar al carrito");
      return;
    }
    if (cantidad > maxDisponible) {
      setError(`Solo puedes agregar ${maxDisponible} par(es) más. Ya tienes ${enCarrito} en tu carrito.`);
      return;
    }
    setError("");
    agregar({
      productId: producto.id,
      slug: producto.slug,
      nombre: producto.nombre,
      imagen: producto.imagenes[0],
      precio: producto.precio,
      talla,
      cantidad,
      maxStock: stockTalla,
    });
    setCantidad(1); // Reset to 1 after adding
  };

  return (
    <div>
      <p className="sku-tag mb-2">{producto.sku} · {producto.marca}</p>
      <h1 className="font-display text-3xl md:text-4xl leading-tight">{producto.nombre}</h1>
      <p className="text-sm text-ink/60 dark:text-chalk/60 mt-1">{producto.colorPrincipal} · {producto.coleccion}</p>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-mono text-2xl">{formatoMXN(producto.precio)}</span>
        {producto.precioAnterior && (
          <span className="font-mono text-base text-ink/40 dark:text-chalk/40 line-through">
            {formatoMXN(producto.precioAnterior)}
          </span>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <p className="sku-tag">Talla (MX)</p>
          <a href="#guia-tallas" className="text-xs font-mono underline text-ink/60 dark:text-chalk/60">
            Guía de tallas
          </a>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {producto.tallas.map((t) => {
            const currentStock = getRealStock(t.talla, t.stock);
            return (
              <button
                key={t.talla}
                disabled={currentStock === 0}
                onClick={() => {
                  setTalla(t.talla);
                  setError("");
                }}
                className={`h-11 text-sm font-mono border transition-colors relative ${
                  currentStock === 0
                    ? "border-ink/10 dark:border-chalk/10 text-ink/25 dark:text-chalk/25 line-through cursor-not-allowed"
                    : talla === t.talla
                    ? "bg-ember text-chalk border-ember"
                    : "border-ink/15 dark:border-chalk/15 hover:border-ember"
                }`}
              >
                {t.talla}
              </button>
            );
          })}
        </div>
        {talla && (
          <p className="text-xs font-mono mt-2 text-ink/70 dark:text-chalk/70" suppressHydrationWarning>
            {stockTalla > 0 ? (
              <>Disponibles: <span className="font-bold text-ember">{stockTalla} pares</span> en talla {talla}</>
            ) : (
              <span className="font-bold text-ember">Agotado en talla {talla}</span>
            )}
          </p>
        )}
        {error && <p className="text-xs font-mono text-ember mt-2">{error}</p>}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center border border-ink/15 dark:border-chalk/15 h-11">
          <button 
            className="w-10 h-full text-ink/70 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed" 
            onClick={() => setCantidad((c) => Math.max(1, c - 1))} 
            disabled={!talla || maxDisponible === 0}
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="w-10 text-center font-mono">{cantidad}</span>
          <button 
            className="w-10 h-full text-ink/70 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed" 
            onClick={() => setCantidad((c) => Math.min(maxDisponible, c + 1))} 
            disabled={!talla || cantidad >= maxDisponible}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAgregar}
          disabled={!talla || maxDisponible === 0}
          className="flex-1 bg-ink dark:bg-chalk text-chalk dark:text-ink h-11 font-mono text-xs uppercase tracking-widest hover:bg-ember dark:hover:bg-ember transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!talla ? "Selecciona talla" : stockTalla === 0 ? "Agotado" : maxDisponible === 0 ? "Límite en carrito" : "Agregar al carrito"}
        </button>
      </div>

      <div className="mt-8 space-y-3 text-sm text-ink/70 dark:text-chalk/70">
        <div className="flex items-center gap-3">
          <Truck size={16} className="text-ember shrink-0" />
          Envío gratis · {producto.envioDiasHabiles}
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck size={16} className="text-ember shrink-0" />
          Garantía de {producto.garantiaDias} días
        </div>
        <div className="flex items-center gap-3">
          <PackageCheck size={16} className="text-ember shrink-0" />
          {producto.incluyeCaja ? "Incluye caja original" : "Sin caja"}
        </div>
      </div>
    </div>
  );
}
