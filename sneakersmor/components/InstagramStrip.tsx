import { Instagram } from "lucide-react";
import { productos } from "@/lib/data";

export default function InstagramStrip() {
  const images = productos.slice(0, 6).map(p => p.imagenes[0]);
  return (
    <section className="py-14 border-t border-ink/10 dark:border-chalk/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Instagram size={18} />
          <h2 className="font-display text-2xl">@sneakersmor.mx</h2>
        </div>
        <a href="https://www.instagram.com/sneakersmor.mx/" target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-widest hover:text-ember">
          Síguenos →
        </a>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-2 px-1 md:px-6">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square bg-cover bg-center hover:opacity-80 transition-opacity"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </section>
  );
}
