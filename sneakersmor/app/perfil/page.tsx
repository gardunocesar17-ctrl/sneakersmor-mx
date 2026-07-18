"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { formatoMXN } from "@/lib/format";
import { Package, User, Clock, CheckCircle2 } from "lucide-react";

export default function PerfilPage() {
  const { user, orders, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push("/");
    }
  }, [mounted, user, router]);

  if (!mounted || !user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl mb-2">Mi Perfil</h1>
          <p className="text-sm text-ink/60 dark:text-chalk/60 flex items-center gap-2">
            <User size={16} /> {user.name} ({user.email})
          </p>
        </div>
        <button 
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="bg-ink/5 dark:bg-chalk/5 hover:bg-ink/10 dark:hover:bg-chalk/10 border border-ink/10 dark:border-chalk/10 text-ink dark:text-chalk px-6 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors w-fit"
        >
          Cerrar sesión
        </button>
      </div>

      <h2 className="font-display text-xl mb-6">Historial de Pedidos</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-ink/10 dark:border-chalk/10 bg-ink/5 dark:bg-chalk/5">
          <Package size={48} className="mx-auto text-ink/20 dark:text-chalk/20 mb-4" />
          <p className="font-mono text-xs uppercase tracking-widest text-ink/60 dark:text-chalk/60 mb-4">
            Aún no has realizado pedidos
          </p>
          <button 
            onClick={() => router.push("/tienda")}
            className="bg-ember text-chalk px-6 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-ember-dim transition-colors"
          >
            Ir a la tienda
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-ink/10 dark:border-chalk/10 bg-stone/50 dark:bg-asphalt/50 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-ink/10 dark:border-chalk/10">
                <div>
                  <p className="font-mono text-xs text-ink/50 dark:text-chalk/50 mb-1">
                    Pedido #{order.id.slice(-6)}
                  </p>
                  <p className="text-sm">{order.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg">{formatoMXN(order.total)}</span>
                  <span className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest px-3 py-1 ${
                    order.status === "Aprobado" ? "bg-jungle-bright/10 text-jungle-bright border border-jungle-bright/30" : "bg-ink/10 dark:bg-chalk/10"
                  }`}>
                    {order.status === "Aprobado" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ink/5 dark:bg-chalk/5 overflow-hidden">
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                      </div>
                      <div>
                        <p className="font-medium">{item.nombre}</p>
                        <p className="text-ink/60 dark:text-chalk/60 text-xs">Talla: {item.talla} · Cantidad: {item.cantidad}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs">{formatoMXN(item.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón de desarrollador para limpiar pruebas */}
      <div className="mt-16 pt-8 border-t border-ember/20 text-center">
        <p className="text-xs text-ink/40 dark:text-chalk/40 mb-3">
          ¿Hiciste pruebas y quieres regresar los productos al stock original?
        </p>
        <button 
          onClick={() => {
            if(confirm("¿Seguro que quieres borrar todo el historial de pedidos y devolver el stock a la normalidad?")) {
              localStorage.removeItem("sneakersmor_orders");
              localStorage.removeItem("purchased_inventory");
              window.location.reload();
            }
          }}
          className="bg-transparent border border-ember text-ember px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-ember hover:text-chalk transition-colors"
        >
          Resetear datos de prueba
        </button>
      </div>
    </div>
  );
}
