"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { CartItem } from "./types";

interface CartContextValue {
  items: CartItem[];
  agregar: (item: CartItem) => void;
  quitar: (productId: string, talla: string) => void;
  actualizarCantidad: (productId: string, talla: string, cantidad: number) => void;
  vaciar: () => void;
  totalItems: number;
  subtotal: number;
  descuento: number;
  costoEnvio: number;
  total: number;
  abierto: boolean;
  setAbierto: (v: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [abierto, setAbierto] = useState(false);

  const agregar = (nuevo: CartItem) => {
    setItems((prev) => {
      const existente = prev.find(
        (i) => i.productId === nuevo.productId && i.talla === nuevo.talla
      );
      if (existente) {
        return prev.map((i) =>
          i.productId === nuevo.productId && i.talla === nuevo.talla
            ? { ...i, cantidad: i.cantidad + nuevo.cantidad }
            : i
        );
      }
      return [...prev, nuevo];
    });
    setAbierto(true);
  };

  const quitar = (productId: string, talla: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.talla === talla))
    );
  };

  const actualizarCantidad = (productId: string, talla: string, cantidad: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.talla === talla
          ? { ...i, cantidad: Math.max(1, cantidad) }
          : i
      )
    );
  };

  const vaciar = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.cantidad, 0),
    [items]
  );

  const { subtotal, descuento, costoEnvio, total } = useMemo(() => {
    const rawSubtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    
    let discountPercent = 0;
    if (totalItems >= 6) {
      discountPercent = 0.15;
    } else if (totalItems >= 3) {
      discountPercent = 0.10;
    }
    
    const rawDescuento = rawSubtotal * discountPercent;
    
    let costoEnvio = 0;
    if (totalItems > 0 && totalItems < 3) {
      costoEnvio = 290;
    }
    
    const finalTotal = rawSubtotal - rawDescuento + costoEnvio;
    
    return { subtotal: rawSubtotal, descuento: rawDescuento, costoEnvio, total: finalTotal };
  }, [items, totalItems]);

  return (
    <CartContext.Provider
      value={{ items, agregar, quitar, actualizarCantidad, vaciar, totalItems, subtotal, descuento, costoEnvio, total, abierto, setAbierto }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
