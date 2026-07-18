"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    p: "¿Cuánto tarda el envío?",
    r: "De 3 a 5 días hábiles a la mayor parte de México; algunas zonas extendidas pueden tardar hasta 6 días.",
  },
  {
    p: "¿Puedo cambiar de talla si no me queda?",
    r: "Sí, tienes 10 días naturales después de recibir tu pedido para solicitar un cambio de talla sin costo.",
  },
  {
    p: "¿Manejan venta al mayoreo?",
    r: "Sí, contamos con paquetes de emprendimiento y precios especiales por volumen. Escríbenos desde la sección Mayoreo.",
  },
  {
    p: "¿Los tenis incluyen caja original?",
    r: "Todos nuestros modelos se envían en caja, protegidos para que lleguen en perfecto estado.",
  },
];

export default function Footer() {
  const [abierto, setAbierto] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  return (
    <footer className="mt-24 border-t border-ink/10 dark:border-chalk/10">
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-2xl mb-2">Preguntas frecuentes</h2>
          <p className="text-sm text-ink/60 dark:text-chalk/60 mb-6">Todo lo que necesitas saber antes de comprar.</p>
          <div className="divide-y divide-ink/10 dark:divide-chalk/10 border-t border-b border-ink/10 dark:border-chalk/10">
            {faqs.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setAbierto(abierto === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left font-display text-sm"
                >
                  {f.p}
                  <span className="font-mono text-ember">{abierto === i ? "–" : "+"}</span>
                </button>
                {abierto === i && (
                  <p className="pb-4 text-sm text-ink/60 dark:text-chalk/60">{f.r}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="box-label pl-5 p-6 flex flex-col justify-center">
          <h2 className="font-display text-2xl mb-2">Súmate a la lista</h2>
          <p className="text-sm text-ink/60 dark:text-chalk/60 mb-4">
            Acceso anticipado a nuevos ingresos y ofertas de mayoreo. Sin spam.
          </p>
          {enviado ? (
            <p className="font-mono text-sm text-jungle-bright">Listo, ya estás dentro.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setEnviado(true);
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="flex-1 bg-transparent border border-ink/15 dark:border-chalk/15 px-3 h-11 text-sm outline-none focus:border-ember"
              />
              <button className="bg-ink dark:bg-chalk text-chalk dark:text-ink px-5 font-mono text-xs uppercase tracking-widest">
                Enviar
              </button>
            </form>
          )}
        </div>
      </section>

      <div className="border-t border-ink/10 dark:border-chalk/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-lg">SneakersMor<span className="text-ember">.MX</span></p>
            <p className="text-xs text-ink/50 dark:text-chalk/50 mt-2">Cuernavaca, Morelos, México</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40 dark:text-chalk/40 mb-3">Ayuda</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/checkout" className="hover:text-ember">Envíos</Link></li>
              <li><Link href="/cambios" className="hover:text-ember">Cambios</Link></li>
              <li><Link href="/admin" className="hover:text-ember">Panel administrador</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40 dark:text-chalk/40 mb-3">Síguenos</p>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.instagram.com/sneakersmor.mx/" target="_blank" rel="noopener noreferrer" className="hover:text-ember">Instagram</a></li>
            </ul>
          </div>
        </div>
        <p className="text-center text-[11px] font-mono text-ink/40 dark:text-chalk/40 pb-8">
          © {new Date().getFullYear()} SneakersMor.MX — Catálogo de muestra, listo para tus productos reales.
        </p>
      </div>
    </footer>
  );
}
