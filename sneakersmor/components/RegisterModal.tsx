"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [registrado, setRegistrado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && email && edad) {
      const newUser = { nombre, email, edad, pedidos: 0, tipo: "Nuevo Registro" };
      const existing = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      localStorage.setItem("registeredUsers", JSON.stringify([newUser, ...existing]));
      setRegistrado(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        setRegistrado(false);
        setNombre("");
        setEmail("");
        setEdad("");
        onClose();
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay invisible para cerrar al hacer clic afuera */}
          <div className="fixed inset-0 z-40" onClick={onClose} />
          
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

            <h2 className="font-display text-xl mb-1">Únete</h2>
            <p className="text-xs text-ink/60 dark:text-chalk/60 mb-5">
              Obtén acceso anticipado y ofertas exclusivas.
            </p>

            {registrado ? (
              <div className="bg-ember/10 border border-ember/30 p-4 text-center">
                <p className="font-mono text-xs text-ember">¡Registro exitoso!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <button
                  type="submit"
                  className="w-full bg-ember text-chalk h-10 font-mono text-[10px] uppercase tracking-widest hover:bg-ember-dim transition-colors mt-2"
                >
                  Registrarme
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
