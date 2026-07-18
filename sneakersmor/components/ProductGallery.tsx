"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ imagenes, nombre }: { imagenes: string[]; nombre: string }) {
  const [activa, setActiva] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origen, setOrigen] = useState({ x: 50, y: 50 });
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const moverZoom = (e: React.MouseEvent) => {
    const rect = contenedorRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigen({ x, y });
  };

  const siguiente = () => setActiva((a) => (a + 1) % imagenes.length);
  const anterior = () => setActiva((a) => (a - 1 + imagenes.length) % imagenes.length);

  // Swipe táctil simple
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) anterior();
    if (delta < -50) siguiente();
  };

  return (
    <div>
      <div
        ref={contenedorRef}
        className="relative aspect-square overflow-hidden box-label pl-0 cursor-zoom-in select-none"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={moverZoom}
        onWheel={(e) => {
          // zoom con scroll: solo previene el scroll de página cuando hay zoom activo
          if (zoom) e.preventDefault();
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activa}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={imagenes[activa]}
              alt={`${nombre} - foto ${activa + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-200 ease-out"
              style={{
                transform: zoom ? "scale(1.8)" : "scale(1)",
                transformOrigin: `${origen.x}% ${origen.y}%`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => setPantallaCompleta(true)}
          aria-label="Ver en pantalla completa"
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-stone/90 dark:bg-asphalt/90 backdrop-blur"
        >
          <Expand size={16} />
        </button>

        {imagenes.length > 1 && (
          <>
            <button
              onClick={anterior}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-stone/90 dark:bg-asphalt/90 backdrop-blur"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={siguiente}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-stone/90 dark:bg-asphalt/90 backdrop-blur"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto">
        {imagenes.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiva(i)}
            className={`relative w-16 h-16 shrink-0 overflow-hidden border-2 transition-colors ${
              activa === i ? "border-ember" : "border-transparent"
            }`}
          >
            <Image src={img} alt={`Miniatura ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {pantallaCompleta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center"
            onClick={() => setPantallaCompleta(false)}
          >
            <button
              className="absolute top-6 right-6 text-chalk"
              onClick={() => setPantallaCompleta(false)}
              aria-label="Cerrar pantalla completa"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-4xl aspect-square mx-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={imagenes[activa]} alt={nombre} fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
