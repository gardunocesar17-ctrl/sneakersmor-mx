"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 dark:border-chalk/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-14 pb-16 md:pt-24 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sku-tag mb-4"
          >
            SNEAKERS · DROPS · STREETWEAR
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.98] tracking-tight"
          >
            El hype
            <br />
            que buscas, <span className="text-ember">al mejor precio.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-base md:text-lg text-ink/70 dark:text-chalk/70 max-w-md"
          >
            Modelos exclusivos y las marcas más buscadas. Todo el catálogo en existencia listo para envío inmediato a todo México.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/tienda" className="bg-ink dark:bg-chalk text-chalk dark:text-ink px-6 py-3 font-mono text-xs uppercase tracking-widest">
              Explorar catálogo
            </Link>
            <Link href="/tienda?filtro=mayoreo" className="border border-ink/20 dark:border-chalk/20 px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-ember">
              Precios de mayoreo
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square box-label pl-6 overflow-hidden rounded-md"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/hero-sneaker.png)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt/80 to-transparent"></div>
          <div className="absolute bottom-4 right-4 bg-stone/90 dark:bg-asphalt/90 backdrop-blur px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink dark:text-chalk">
            Exclusive Drops
          </div>
        </motion.div>
      </div>
    </section>
  );
}
