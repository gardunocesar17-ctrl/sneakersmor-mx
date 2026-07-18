"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export default function AuthModal({ 
  isOpen, 
  onClose, 
  defaultMode = "login" 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  defaultMode?: "login" | "register";
}) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError("");
      setNombre("");
      setEmail("");
      setEdad("");
      setPassword("");
    }
  }, [isOpen, defaultMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const success = login(email, password);
      if (success) {
        onClose();
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } else {
      if (nombre && email && edad && password) {
        const success = register({
          id: String(Date.now()),
          name: nombre,
          email,
          age: edad,
          password
        });
        
        if (success) {
          // Guardar en administradores / registros (simulación legacy panel)
          const newUserLegacy = { nombre, email, edad, pedidos: 0, tipo: "Nuevo Registro" };
          const existing = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
          localStorage.setItem("registeredUsers", JSON.stringify([newUserLegacy, ...existing]));
          
          onClose();
        } else {
          setError("El correo ya está registrado.");
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-ink/20 dark:bg-chalk/10 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-stone dark:bg-asphalt w-[320px] p-6 border border-ink/10 dark:border-chalk/10 shadow-2xl z-50"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-ink/50 dark:text-chalk/50 hover:text-ember transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>

            <h2 className="font-display text-xl mb-1">{mode === "login" ? "Iniciar Sesión" : "Únete"}</h2>
            <p className="text-xs text-ink/60 dark:text-chalk/60 mb-5">
              {mode === "login" ? "Accede a tus pedidos e información." : "Obtén acceso anticipado y sigue tus pedidos."}
            </p>

            {error && (
              <div className="bg-ember/10 border border-ember/30 p-2 text-center mb-4">
                <p className="font-mono text-[10px] text-ember uppercase tracking-widest">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <label className="block">
                  <span className="sku-tag block mb-1">Nombre completo</span>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-10 text-sm outline-none focus:border-ember"
                  />
                </label>
              )}
              <label className="block">
                <span className="sku-tag block mb-1">Correo electrónico</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-10 text-sm outline-none focus:border-ember"
                />
              </label>
              {mode === "register" && (
                <label className="block">
                  <span className="sku-tag block mb-1">Edad</span>
                  <input
                    type="number"
                    required
                    min="13"
                    max="100"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    className="w-full border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-10 text-sm outline-none focus:border-ember"
                  />
                </label>
              )}
              <label className="block">
                <span className="sku-tag block mb-1">Contraseña</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-10 text-sm outline-none focus:border-ember"
                />
              </label>
              
              <button
                type="submit"
                className="w-full bg-ember text-chalk h-10 font-mono text-[10px] uppercase tracking-widest hover:bg-ember-dim transition-colors mt-2"
              >
                {mode === "login" ? "Entrar" : "Registrarme"}
              </button>
            </form>
            
            <div className="mt-4 pt-4 border-t border-ink/10 dark:border-chalk/10 text-center">
              <button 
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-[11px] text-ink/60 dark:text-chalk/60 hover:text-ember underline transition-colors"
              >
                {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
