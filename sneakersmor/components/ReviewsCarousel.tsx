"use client";

import { Star } from "lucide-react";
import Image from "next/image";

const opiniones = [
  {
    "nombre": "Karla R.",
    "texto": "Llegaron antes de lo esperado y la caja venía perfecta. La talla quedó exacta con la guía.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=1"
  },
  {
    "nombre": "Iván M.",
    "texto": "Compré para revender y el paquete de mayoreo se pagó solo en la primera semana.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=5"
  },
  {
    "nombre": "Dana P.",
    "texto": "Buena calidad de materiales, se nota que no es lo mismo que otras tiendas del mismo precio.",
    "estrellas": 4,
    "avatar": "https://i.pravatar.cc/150?img=12",
    "foto": "https://cdn.shopify.com/s/files/1/0555/1787/2176/files/DUNKLOWBLANCOCIELOGRIS_1_6dc76d71-edd6-425e-a812-d912bad8aa6c.jpg?v=1748365347"
  },
  {
    "nombre": "Sergio L.",
    "texto": "El proceso de cambio de talla fue rápido y sin complicaciones.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=15"
  },
  {
    "nombre": "Miguel T.",
    "texto": "Están increíbles, los materiales se sienten súper premium. Definitivamente volveré a comprar aquí.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=20",
    "foto": "https://cdn.shopify.com/s/files/1/0555/1787/2176/products/CANVAS_00001_07382ee5-5852-4f49-87bc-a78f06eb5318.jpg?v=1705004032"
  },
  {
    "nombre": "Ana Sofía",
    "texto": "Dude un poco por la talla pero me quedaron excelentes. El color es idéntico a las fotos.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=26",
    "foto": "https://cdn.shopify.com/s/files/1/0555/1787/2176/files/GAZELLEBEIGEGAMUZA.jpg?v=1733355755"
  },
  {
    "nombre": "Luis F.",
    "texto": "El envío fue rapidísimo. Todo llegó en excelentes condiciones y bien empacado.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=32"
  },
  {
    "nombre": "Valeria C.",
    "texto": "Me encantaron! Son súper cómodos y combinan con todo. Los recomiendo al 100%.",
    "estrellas": 4,
    "avatar": "https://i.pravatar.cc/150?img=38",
    "foto": "https://cdn.shopify.com/s/files/1/0555/1787/2176/files/RETRO1CIELOBLANCONEGRO_2_af2fa7d4-aba4-4047-b3c1-2c91c2311b9d.jpg?v=1776791890"
  },
  {
    "nombre": "Roberto G.",
    "texto": "Compré dos pares y la verdad superaron mis expectativas. Muy buena atención al cliente por DM.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=41"
  },
  {
    "nombre": "Daniela H.",
    "texto": "Los tenis están preciosos, pero la caja venía un poco maltratada por la paquetería. Fuera de eso, todo perfecto.",
    "estrellas": 4,
    "avatar": "https://i.pravatar.cc/150?img=44",
    "foto": "https://cdn.shopify.com/s/files/1/0555/1787/2176/files/RETRO1BLANCOPLATA.jpg?v=1759161048"
  },
  {
    "nombre": "Jorge V.",
    "texto": "La textura de la piel se siente muy bien. Excelente calidad-precio.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=47",
    "foto": "https://cdn.shopify.com/s/files/1/0555/1787/2176/files/RETRO4BLANCOGRISNEGRO_2f8cd84e-b4ad-433f-ac71-bdedcf0712a9.jpg?v=1719518984"
  },
  {
    "nombre": "Andrea M.",
    "texto": "Es mi tercera compra y siempre cumplen. Los pares siempre llegan con sus agujetas extra.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=50"
  },
  {
    "nombre": "Carlos E.",
    "texto": "Me sorprendió lo rápido que procesaron mi pedido. Ya los estrené el fin de semana.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=56",
    "foto": "https://cdn.shopify.com/s/files/1/0555/1787/2176/files/SAMBALEOPARDO_e2a75d18-2a7a-4a5e-92c6-49ac8bd28920.jpg?v=1773340832"
  },
  {
    "nombre": "Paola S.",
    "texto": "Estaba buscando este modelo por todos lados y aquí lo encontré a súper buen precio.",
    "estrellas": 5,
    "avatar": "https://i.pravatar.cc/150?img=60"
  },
  {
    "nombre": "Fernando P.",
    "texto": "Pedí medio número más por precaución y me quedaron al puro centavo.",
    "estrellas": 4,
    "avatar": "https://i.pravatar.cc/150?img=65",
    "foto": "https://cdn.shopify.com/s/files/1/0555/1787/2176/files/SMBOGBLANCOPLATA_1.jpg?v=1783624356"
  }
];

export default function ReviewsCarousel() {
  return (
    <section className="py-14 border-t border-ink/10 dark:border-chalk/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p className="sku-tag mb-2">Opiniones</p>
        <h2 className="font-display text-2xl md:text-3xl mb-6">Lo que dice quien ya compró</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 md:px-6 pb-4 snap-x snap-mandatory no-scrollbar">
        {opiniones.map((o, i) => (
          <div
            key={i}
            className="box-label pl-5 p-5 w-64 shrink-0 snap-start flex flex-col justify-between bg-white dark:bg-[#111]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {o.avatar ? (
                    <img src={o.avatar} alt={o.nombre} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-ink/10 dark:bg-chalk/10 flex items-center justify-center font-mono text-xs text-ink/50 dark:text-chalk/50 shrink-0">
                      {o.nombre.charAt(0)}
                    </div>
                  )}
                  <p className="font-mono text-xs font-semibold">{o.nombre}</p>
                </div>
                <div className="flex gap-0.5 text-ember shrink-0">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={12} fill={j < o.estrellas ? "currentColor" : "none"} strokeWidth={j < o.estrellas ? 0 : 1} stroke="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-ink/80 dark:text-chalk/80 leading-relaxed text-pretty">{o.texto}</p>
            </div>
            {o.foto && (
              <div className="mt-4 w-full h-24 rounded-sm overflow-hidden shrink-0 relative bg-ink/5 dark:bg-chalk/5">
                <img src={o.foto} alt="Foto del producto" className="absolute inset-0 w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
