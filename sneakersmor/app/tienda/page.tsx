"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { productos, coleccionesList } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

const tallasDisponibles = Array.from(
  new Set(productos.flatMap((p) => p.tallas.map((t) => t.talla)))
).sort();

export default function TiendaPage() {
  return (
    <Suspense fallback={null}>
      <TiendaContenido />
    </Suspense>
  );
}

function TiendaContenido() {
  const params = useSearchParams();
  const qInicial = params.get("q") ?? "";
  const coleccionInicial = params.get("coleccion") ?? "";
  const filtroInicial = params.get("filtro") ?? "";

  const [q, setQ] = useState(qInicial);
  const [modelosSel, setModelosSel] = useState<string[]>(coleccionInicial ? [coleccionInicial] : []);
  const [tallaSel, setTallaSel] = useState<string>("");
  const [precioMax, setPrecioMax] = useState(3500);
  const [orden, setOrden] = useState("relevancia");
  const [panelAbierto, setPanelAbierto] = useState(false);

  const [acModelo, setAcModelo] = useState(true);
  const [acTalla, setAcTalla] = useState(true);
  const [acPrecio, setAcPrecio] = useState(false);
  const [acDisponibilidad, setAcDisponibilidad] = useState(false);

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const countPorColeccion = useMemo(() => {
    const counts: Record<string, number> = {};
    productos.forEach(p => {
      counts[p.coleccion] = (counts[p.coleccion] || 0) + 1;
    });
    return counts;
  }, []);

  const countPorTalla = useMemo(() => {
    const counts: Record<string, number> = {};
    const baseList = modelosSel.length > 0 ? productos.filter(p => modelosSel.includes(p.coleccion)) : productos;
    baseList.forEach(p => {
      p.tallas.forEach(t => {
        if (t.stock > 0) {
          counts[t.talla] = (counts[t.talla] || 0) + 1;
        }
      });
    });
    return counts;
  }, [modelosSel]);

  const resultados = useMemo(() => {
    let lista = productos.filter((p) => {
      const coincideTexto =
        !q ||
        p.nombre.toLowerCase().includes(q.toLowerCase()) ||
        p.marca.toLowerCase().includes(q.toLowerCase()) ||
        p.sku.toLowerCase().includes(q.toLowerCase()) ||
        p.colorPrincipal.toLowerCase().includes(q.toLowerCase());

      const coincideColeccion = modelosSel.length === 0 || modelosSel.includes(p.coleccion);
      const coincideTalla = !tallaSel || p.tallas.some((t) => t.talla === tallaSel && t.stock > 0);
      const coincidePrecio = p.precio <= precioMax;

      const coincideFiltroRapido =
        filtroInicial === "nuevo" ? p.nuevoIngreso :
        filtroInicial === "oferta" ? p.enOferta :
        filtroInicial === "mas-vendido" ? p.masVendido :
        filtroInicial === "mayoreo" ? true :
        true;

      return (
        coincideTexto &&
        coincideColeccion &&
        coincideTalla &&
        coincidePrecio &&
        coincideFiltroRapido
      );
    });

    if (orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);
    if (orden === "nombre") lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));

    return lista;
  }, [q, modelosSel, tallaSel, precioMax, orden, filtroInicial]);

  const hayFiltrosActivos = modelosSel.length > 0 || tallaSel || precioMax < 3500;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-start gap-8 md:gap-16">
        <div className="shrink-0">
          <p className="sku-tag mb-1">Catálogo</p>
          <h1 className="font-display text-3xl md:text-4xl">
            {filtroInicial === "mayoreo" ? "Precios de mayoreo" : "Todos los modelos"}
          </h1>
          <p className="text-sm text-ink/60 dark:text-chalk/60 mt-1">{resultados.length} resultados</p>
        </div>

        <div className="w-full border-l-2 border-ink/20 dark:border-chalk/20 pl-6 py-2">
          <p className="font-mono text-xs uppercase tracking-widest text-ember mb-3 font-bold">Beneficios de mayoreo</p>
          <ul className="text-sm text-ink/70 dark:text-chalk/70 space-y-2 font-mono">
            <li><span className="text-ink dark:text-chalk font-bold">10% OFF</span> en 3 a 5 pares</li>
            <li><span className="text-ink dark:text-chalk font-bold">15% OFF</span> en 6 pares o más</li>
            <li><span className="text-ember font-bold">Envío gratis</span> desde 3 pares</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 md:hidden">
        <button
          onClick={() => setPanelAbierto(true)}
          className="flex items-center gap-2 border border-ink/15 dark:border-chalk/15 px-4 py-2 font-mono text-xs uppercase tracking-widest"
        >
          <SlidersHorizontal size={14} /> Filtros
        </button>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className={`
          ${panelAbierto ? "fixed inset-0 z-50 bg-stone dark:bg-asphalt p-6 overflow-y-auto" : "hidden"}
          md:block md:static md:bg-transparent md:p-0
        `}>
          {panelAbierto && (
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="font-display text-lg">Filtros</h2>
              <button onClick={() => setPanelAbierto(false)} aria-label="Cerrar filtros"><X size={20} /></button>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label className="sku-tag block mb-2">Buscar</label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Modelo, marca, SKU…"
                className="w-full border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-10 text-sm outline-none focus:border-ember"
              />
            </div>

            <div>
              <h3 className="font-display text-xl font-bold mb-4">Modelo</h3>
              <div className="border-t border-ink/10 dark:border-chalk/10 pt-4">
                <button 
                  onClick={() => setAcModelo(!acModelo)} 
                  className="flex items-center gap-2 text-ember font-medium w-full text-left"
                >
                  Modelos ({productos.length}) {acModelo ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                
                {acModelo && (
                  <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar pl-2">
                    {coleccionesList.map((m) => (
                      <button 
                        key={m} 
                        onClick={() => toggle(modelosSel, m, setModelosSel)}
                        className={`block text-sm text-left hover:text-ember transition-colors ${modelosSel.includes(m) ? "text-ember font-bold" : "text-ink/70 dark:text-chalk/70"}`}
                      >
                        {m} ({countPorColeccion[m] || 0})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-display text-xl font-bold mb-4">Filtros</h3>
              
              <div className="border-t border-ink/10 dark:border-chalk/10 py-4">
                <button 
                  onClick={() => setAcDisponibilidad(!acDisponibilidad)} 
                  className="flex justify-between items-center w-full text-left font-bold"
                >
                  Disponibilidad {acDisponibilidad ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {acDisponibilidad && (
                  <div className="mt-4 pl-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer text-ink/70 dark:text-chalk/70">
                      <input type="checkbox" checked readOnly className="accent-ember" />
                      En existencia ({resultados.length})
                    </label>
                  </div>
                )}
              </div>

              <div className="border-t border-ink/10 dark:border-chalk/10 py-4">
                <button 
                  onClick={() => setAcPrecio(!acPrecio)} 
                  className="flex justify-between items-center w-full text-left font-bold"
                >
                  Precio {acPrecio ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {acPrecio && (
                  <div className="mt-4 pl-2">
                    <p className="text-xs mb-2">Precio máximo: ${precioMax.toLocaleString("es-MX")}</p>
                    <input
                      type="range"
                      min={1000}
                      max={5000}
                      step={100}
                      value={precioMax}
                      onChange={(e) => setPrecioMax(Number(e.target.value))}
                      className="w-full accent-ember"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-b border-ink/10 dark:border-chalk/10 py-4">
                <button 
                  onClick={() => setAcTalla(!acTalla)} 
                  className="flex justify-between items-center w-full text-left font-bold"
                >
                  Talla {acTalla ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                {acTalla && (
                  <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar pl-2">
                    {tallasDisponibles.map((t) => (
                      <label key={t} className="flex items-center gap-3 text-sm cursor-pointer text-ink/70 dark:text-chalk/70 hover:text-ember">
                        <input
                          type="checkbox"
                          checked={tallaSel === t}
                          onChange={() => setTallaSel(tallaSel === t ? "" : t)}
                          className="accent-ember w-4 h-4"
                        />
                        {t} ({countPorTalla[t] || 0})
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {hayFiltrosActivos && (
              <button
                onClick={() => {
                  setModelosSel([]);
                  setTallaSel("");
                  setPrecioMax(3500);
                }}
                className="text-xs font-mono uppercase tracking-widest text-ember"
              >
                Limpiar filtros
              </button>
            )}

            {panelAbierto && (
              <button
                onClick={() => setPanelAbierto(false)}
                className="w-full bg-ember text-chalk py-3 font-mono text-xs uppercase tracking-widest md:hidden"
              >
                Ver {resultados.length} resultados
              </button>
            )}
          </div>
        </aside>

        <div>
          <div className="hidden md:flex justify-end mb-4">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-9 text-xs font-mono uppercase tracking-widest outline-none"
            >
              <option value="relevancia">Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
          </div>

          {resultados.length === 0 ? (
            <div className="box-label pl-6 p-10 text-center">
              <p className="font-display text-xl mb-2">Sin resultados</p>
              <p className="text-sm text-ink/60 dark:text-chalk/60">
                Prueba con otra búsqueda o quita algunos filtros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {resultados.map((p, i) => (
                <ProductCard key={p.id} producto={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
