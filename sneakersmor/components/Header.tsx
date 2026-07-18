"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Menu, X, Instagram, ChevronDown, ChevronUp } from "lucide-react";
import { UserPlus, User, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "./AuthModal";
import { coleccionesList } from "@/lib/data";

const links = [
  { href: "/tienda", label: "Tienda" },
  { href: "/tienda?filtro=nuevo", label: "Nuevos" },
];



export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [authAbierto, setAuthAbierto] = useState(false);
  const [authMenu, setAuthMenu] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const { totalItems, setAbierto } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) {
      router.push(`/tienda?q=${encodeURIComponent(busqueda.trim())}`);
      setMenuAbierto(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-stone/90 dark:bg-asphalt/90 backdrop-blur-md border-b border-ink/10 dark:border-chalk/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="font-display text-xl tracking-tight shrink-0">
            SneakersMor<span className="text-ember">.MX</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest">

            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ember transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>


          <div className="flex items-center gap-2">
            <a href="https://www.instagram.com/sneakersmor.mx/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-ember md:mr-2 hover:opacity-80 transition-opacity">
              <Instagram size={16} /> <span className="hidden md:inline">Conócenos</span>
            </a>
            <div className="relative hidden md:block">
              {user ? (
                <>
                  <button
                    onClick={() => setAuthMenu(!authMenu)}
                    aria-label="Perfil"
                    className="w-9 h-9 flex items-center justify-center border border-ink/15 dark:border-chalk/15 hover:border-ember transition-colors bg-ember/5 text-ember"
                  >
                    <User size={16} />
                  </button>
                  {authMenu && (
                    <div className="absolute top-full right-0 mt-2 bg-stone dark:bg-asphalt border border-ink/10 dark:border-chalk/10 shadow-2xl z-50 w-48 font-mono text-xs uppercase tracking-widest flex flex-col">
                      <Link href="/perfil" onClick={() => setAuthMenu(false)} className="px-4 py-3 hover:bg-ink/5 dark:hover:bg-chalk/5 border-b border-ink/10 dark:border-chalk/10">
                        Mi Perfil
                      </Link>
                      <button onClick={() => { logout(); setAuthMenu(false); }} className="px-4 py-3 text-left hover:bg-ink/5 dark:hover:bg-chalk/5 text-ember flex items-center gap-2">
                        <LogOut size={14} /> Cerrar Sesión
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAuthAbierto(!authAbierto)}
                    aria-label="Entrar / Registrarse"
                    className="w-9 h-9 flex items-center justify-center border border-ink/15 dark:border-chalk/15 hover:border-ember transition-colors"
                  >
                    <UserPlus size={16} />
                  </button>
                  <AuthModal isOpen={authAbierto} onClose={() => setAuthAbierto(false)} />
                </>
              )}
            </div>
            <button
              onClick={() => setAbierto(true)}
              aria-label="Abrir carrito"
              className="relative w-9 h-9 flex items-center justify-center border border-ink/15 dark:border-chalk/15 hover:border-ember transition-colors"
            >
              <ShoppingBag size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-ember text-chalk text-[10px] font-mono w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuAbierto((v) => !v)}
              aria-label="Abrir menú"
              className="md:hidden w-9 h-9 flex items-center justify-center border border-ink/15 dark:border-chalk/15"
            >
              {menuAbierto ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {menuAbierto && (
        <div className="md:hidden border-t border-ink/10 dark:border-chalk/10 px-4 py-4 space-y-4">

          <nav className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest">
            {user ? (
              <>
                <Link href="/perfil" onClick={() => setMenuAbierto(false)} className="py-2 hover:text-ember transition-colors flex items-center gap-2">
                  <User size={14} /> Mi Perfil ({user.name})
                </Link>
                <button onClick={() => { logout(); setMenuAbierto(false); }} className="py-2 text-left text-ember flex items-center gap-2 transition-colors">
                  <LogOut size={14} /> Cerrar Sesión
                </button>
              </>
            ) : (
              <button onClick={() => { setAuthAbierto(true); setMenuAbierto(false); }} className="py-2 text-left hover:text-ember flex items-center gap-2 transition-colors">
                <UserPlus size={14} /> Iniciar Sesión / Registro
              </button>
            )}

            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuAbierto(false)} className="py-2 hover:text-ember transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
      
      {/* Móvil version de auth modal si se abre desde el menú */}
      <div className="md:hidden">
        <AuthModal isOpen={authAbierto} onClose={() => setAuthAbierto(false)} />
      </div>
    </header>
  );
}
