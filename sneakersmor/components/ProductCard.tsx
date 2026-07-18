"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatoMXN } from "@/lib/format";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProductCard({ producto, index = 0 }: { producto: Product; index?: number }) {
  const [purchased, setPurchased] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      setPurchased(JSON.parse(localStorage.getItem("purchased_inventory") || "{}"));
    } catch (e) {}
  }, []);

  const totalOriginalStock = producto.tallas.reduce((acc, t) => acc + t.stock, 0);
  const totalPurchased = producto.tallas.reduce((acc, t) => acc + (purchased[`${producto.id}-${t.talla}`] || 0), 0);
  const realStock = Math.max(0, totalOriginalStock - totalPurchased);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/producto/${producto.slug}`} className="group block box-label overflow-hidden pl-4">
        <div className="relative aspect-square overflow-hidden bg-stone-soft dark:bg-asphalt-raised">
          <Image
            src={producto.imagenes[0]}
            alt={`${producto.nombre} - ${producto.colorPrincipal}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          {producto.imagenes[1] && (
            <Image
              src={producto.imagenes[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {producto.nuevoIngreso && (
              <span className="bg-jungle text-chalk text-[10px] font-mono uppercase tracking-widest px-2 py-1">
                Nuevo
              </span>
            )}
            {producto.enOferta && (
              <span className="bg-ember text-chalk text-[10px] font-mono uppercase tracking-widest px-2 py-1">
                Oferta
              </span>
            )}
          </div>
        </div>
        <div className="p-3 border-t border-ink/10 dark:border-chalk/10">
          <p className="sku-tag">{producto.sku}</p>
          <h3 className="font-display text-base leading-tight mt-1">{producto.nombre}</h3>
          <p className="text-xs text-ink/60 dark:text-chalk/60">{producto.marca} · Modelo: {producto.coleccion}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-sm">{formatoMXN(producto.precio)}</span>
            {producto.precioAnterior && (
              <span className="font-mono text-xs text-ink/40 dark:text-chalk/40 line-through">
                {formatoMXN(producto.precioAnterior)}
              </span>
            )}
          </div>
          <p className="mt-3 text-[11px] font-mono font-bold text-ember" suppressHydrationWarning>
            {realStock > 0 ? `Disponibles: ${realStock} pares` : "Agotado"}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
