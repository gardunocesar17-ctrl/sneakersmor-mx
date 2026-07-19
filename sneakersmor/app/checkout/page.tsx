"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatoMXN } from "@/lib/format";
import { CreditCard, Landmark, CheckCircle2 } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Suspense } from "react";

function CheckoutContent() {
  const { items, subtotal, descuento, costoEnvio, total, vaciar } = useCart();
  const { user, addOrder } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [metodoPago, setMetodoPago] = useState<"transferencia" | "mercadopago">("transferencia");
  const [procesando, setProcesando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [montoFinal, setMontoFinal] = useState(0);
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    telefono: "",
    calle: "",
    ciudad: "",
    estado: "",
    cp: "",
  });

  // Se usan los valores directos del carrito (subtotal, descuento, costoEnvio, total)

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      setCompletado(true);
      // Solo en caso de regresar de MercadoPago vaciamos, el pedido idealmente ya se guardó antes o lo maneja el backend.
      vaciar();
    }
  }, [searchParams, vaciar]);

  const registrarPedido = (metodo: string) => {
    if (user && items.length > 0) {
      addOrder({
        id: String(Date.now()),
        date: new Date().toLocaleDateString("es-MX", { year: 'numeric', month: 'long', day: 'numeric' }),
        items: [...items],
        total,
        status: metodo === "mercadopago" ? "Aprobado" : "En proceso",
        metodoPago: metodo
      });

      // Deducir inventario SOLO si es mercadopago (transferencia no deduce hasta confirmar)
      if (metodo === "mercadopago") {
        const updateStock = async () => {
          try {
            const invRef = doc(db, "store", "inventory");
            const invSnap = await getDoc(invRef);
            const purchased = invSnap.exists() ? invSnap.data() : {};
            items.forEach((item) => {
              const key = `${item.productId}-${item.talla}`;
              purchased[key] = (purchased[key] || 0) + item.cantidad;
            });
            await setDoc(invRef, purchased);
          } catch (e) {
            console.error("Error al descontar inventario", e);
          }
        };
        updateStock();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);
    
    if (metodoPago === "mercadopago") {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, datos }),
        });
        
        const data = await res.json();
        
        if (data.init_point) {
          registrarPedido("mercadopago");
          window.location.href = data.init_point;
          return;
        } else {
          alert("Error: " + (data.error || "No se pudo iniciar el pago"));
          setProcesando(false);
        }
      } catch (err) {
        console.error(err);
        alert("Ocurrió un error al contactar al procesador de pagos.");
        setProcesando(false);
      }
    } else {
      setTimeout(() => {
        setMontoFinal(total);
        registrarPedido("transferencia");
        setProcesando(false);
        setCompletado(true);
        vaciar();
      }, 1200);
    }
  };

  if (items.length === 0 && !completado) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-16 text-center">
        <p className="font-display text-xl mb-2">No hay nada que pagar todavía</p>
        <p className="text-sm text-ink/60 dark:text-chalk/60 mb-6">Agrega productos al carrito antes de continuar.</p>
        <button onClick={() => router.push("/tienda")} className="bg-ink dark:bg-chalk text-chalk dark:text-ink px-6 py-3 font-mono text-xs uppercase tracking-widest">
          Ir a la tienda
        </button>
      </div>
    );
  }

  if (completado) {
    const isMercadoPago = searchParams.get("status") === "success";

    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-20 text-center">
        <CheckCircle2 size={48} className="mx-auto text-jungle-bright mb-4" />
        <h1 className="font-display text-3xl mb-2">{isMercadoPago ? "Pedido confirmado" : "Pedido en proceso"}</h1>
        
        {isMercadoPago ? (
          <p className="text-sm text-ink/60 dark:text-chalk/60 mb-8">
            Tu pago ha sido procesado con éxito. Te enviamos la confirmación a tu correo. Tiempo estimado de entrega: 3 a 5 días hábiles.
          </p>
        ) : (
          <div className="mb-8 text-left max-w-md mx-auto bg-stone-soft dark:bg-asphalt-raised p-6 border border-ink/10 dark:border-chalk/10">
            <p className="text-sm text-ink/80 dark:text-chalk/80 mb-4 text-center">
              Para completar tu pedido, realiza la transferencia con los siguientes datos y envíanos el comprobante por Instagram.
            </p>
            <div className="space-y-2 font-mono text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-ink/50 dark:text-chalk/50">Monto a pagar:</span>
                <span className="font-bold text-ember">{formatoMXN(montoFinal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/50 dark:text-chalk/50">Beneficiario:</span>
                <span className="text-right">Cesar Fernando Rodriguez Garduño</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/50 dark:text-chalk/50">CLABE:</span>
                <span className="font-bold">722969010175367841</span>
              </div>
            </div>
            
            <a
              href="https://www.instagram.com/sneakersmor.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-ember text-chalk py-3 font-mono text-xs uppercase tracking-widest hover:bg-ember-dim transition-colors"
            >
              Enviar comprobante por IG
            </a>
          </div>
        )}

        <button onClick={() => router.push("/tienda")} className="bg-ink dark:bg-chalk text-chalk dark:text-ink px-6 py-3 font-mono text-xs uppercase tracking-widest border border-ink/20 hover:bg-ink/5 dark:hover:bg-chalk/10 transition-colors">
          Seguir comprando
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-lg mb-4">Datos de envío</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Campo label="Nombre completo" value={datos.nombre} onChange={(v) => setDatos({ ...datos, nombre: v })} required />
              <Campo label="Correo electrónico" type="email" value={datos.email} onChange={(v) => setDatos({ ...datos, email: v })} required />
              <Campo label="Teléfono" type="tel" value={datos.telefono} onChange={(v) => setDatos({ ...datos, telefono: v })} required />
              <Campo label="Código postal" value={datos.cp} onChange={(v) => setDatos({ ...datos, cp: v })} required />
              <Campo label="Calle y número" value={datos.calle} onChange={(v) => setDatos({ ...datos, calle: v })} required className="sm:col-span-2" />
              <Campo label="Ciudad" value={datos.ciudad} onChange={(v) => setDatos({ ...datos, ciudad: v })} required />
              <Campo label="Estado" value={datos.estado} onChange={(v) => setDatos({ ...datos, estado: v })} required />
            </div>
          </section>

          <section>
            <h2 className="font-display text-lg mb-4">Método de pago</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetodoPago("transferencia")}
                className={`flex items-center gap-3 border px-4 h-14 transition-colors ${
                  metodoPago === "transferencia" ? "border-ember bg-ember/5" : "border-ink/15 dark:border-chalk/15"
                }`}
              >
                <Landmark size={18} /> Transferencia / Depósito
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago("mercadopago")}
                className={`flex items-center gap-3 border px-4 h-14 transition-colors ${
                  metodoPago === "mercadopago" ? "border-ember bg-ember/5" : "border-ink/15 dark:border-chalk/15"
                }`}
              >
                <CreditCard size={18} /> Mercado Pago
              </button>
            </div>
            {metodoPago === "transferencia" && (
              <div className="mt-4 p-4 border border-ember/20 bg-ember/5 text-sm text-ink/80 dark:text-chalk/80">
                <p>
                  Al confirmar tu pedido, te daremos los <strong>datos de la cuenta bancaria</strong>. 
                  Deberás realizar tu pago y enviarnos el comprobante por <strong>mensaje privado de Instagram</strong> para que podamos preparar tu envío.
                </p>
              </div>
            )}
            {metodoPago === "mercadopago" && (
              <p className="text-sm text-ink/60 dark:text-chalk/60 mt-4">
                Se te redirigirá a Mercado Pago para completar tu pago de forma segura con tarjeta de crédito, débito o efectivo.
              </p>
            )}
          </section>
        </div>

        <aside className="box-label pl-6 p-6 h-fit space-y-3">
          <h2 className="font-display text-lg mb-2">Tu pedido</h2>
          {items.map((item) => (
            <div key={`${item.productId}-${item.talla}`} className="flex justify-between text-sm">
              <span className="truncate pr-2">{item.nombre} · MX {item.talla} × {item.cantidad}</span>
              <span className="font-mono shrink-0">{formatoMXN(item.precio * item.cantidad)}</span>
            </div>
          ))}
          <div className="border-t border-ink/10 dark:border-chalk/10 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-sm">
              <span className="text-ink/70 dark:text-chalk/70">Subtotal</span>
              <span className={descuento > 0 ? "line-through text-ink/50 dark:text-chalk/50" : ""}>{formatoMXN(subtotal)}</span>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-sm text-ember">
                <span>Descuento</span>
                <span>-{formatoMXN(descuento)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-ink/70 dark:text-chalk/70">Envío</span>
              <span>{costoEnvio === 0 ? "GRATIS" : formatoMXN(costoEnvio)}</span>
            </div>
            <div className="flex justify-between font-display text-lg border-t border-ink/10 dark:border-chalk/10 pt-3">
              <span>Total</span>
              <span className="font-mono">{formatoMXN(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={procesando || (!user && items.length > 0)}
            className="w-full bg-ember text-chalk py-3 font-mono text-xs uppercase tracking-widest hover:bg-ember-dim transition-colors disabled:opacity-60"
          >
            {procesando ? "Procesando…" : (!user ? "Inicia sesión para pagar" : "Confirmar y pagar")}
          </button>
          <p className="text-[11px] text-ink/40 dark:text-chalk/40 text-center">
            {metodoPago === 'mercadopago' ? "Serás redirigido a Mercado Pago para un pago seguro." : "No se te cobrará nada en este momento."}
          </p>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  className = "",
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="sku-tag block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-11 text-sm outline-none focus:border-ember"
      />
    </label>
  );
}
