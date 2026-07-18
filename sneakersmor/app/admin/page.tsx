"use client";

import { useState, useEffect } from "react";
import { productos as productosIniciales } from "@/lib/data";
import { Product } from "@/lib/types";
import { formatoMXN } from "@/lib/format";
import { LayoutDashboard, Package, ShoppingCart, Users, Plus, Pencil, Trash2, X } from "lucide-react";

const pedidosMuestra = [
  { id: "SM-1042", cliente: "Karla Ramírez", total: 2799, estado: "Enviado", fecha: "2026-07-15" },
  { id: "SM-1041", cliente: "Iván Morales", total: 5398, estado: "Procesando", fecha: "2026-07-15" },
  { id: "SM-1040", cliente: "Dana Pérez", total: 1999, estado: "Entregado", fecha: "2026-07-14" },
  { id: "SM-1039", cliente: "Sergio López", total: 2399, estado: "Entregado", fecha: "2026-07-13" },
];

const usuariosMuestra = [
  { nombre: "Karla Ramírez", email: "karla@example.com", pedidos: 3, tipo: "Menudeo" },
  { nombre: "Iván Morales", email: "ivan@example.com", pedidos: 12, tipo: "Mayoreo" },
  { nombre: "Dana Pérez", email: "dana@example.com", pedidos: 1, tipo: "Menudeo" },
];

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "productos", label: "Productos", icon: Package },
  { id: "pedidos", label: "Pedidos", icon: ShoppingCart },
  { id: "usuarios", label: "Usuarios", icon: Users },
] as const;

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("dashboard");
  const [productos, setProductos] = useState<Product[]>(productosIniciales);
  const [usuarios, setUsuarios] = useState(usuariosMuestra);
  const [editando, setEditando] = useState<Product | null>(null);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("registeredUsers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUsuarios([...parsed, ...usuariosMuestra]);
      } catch (e) {}
    }
  }, []);

  const totalVentas = pedidosMuestra.reduce((acc, p) => acc + p.total, 0);
  const totalInventario = productos.reduce((acc, p) => acc + p.tallas.reduce((s, t) => s + t.stock, 0), 0);

  const guardarProducto = (producto: Product) => {
    setProductos((prev) => {
      const existe = prev.some((p) => p.id === producto.id);
      return existe ? prev.map((p) => (p.id === producto.id ? producto : p)) : [...prev, producto];
    });
    setEditando(null);
    setCreando(false);
  };

  const eliminarProducto = (id: string) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="mb-8">
        <p className="sku-tag mb-1">Panel administrador</p>
        <h1 className="font-display text-3xl">SneakersMor.MX</h1>
        <p className="text-xs text-ink/50 dark:text-chalk/50 mt-1">
          Los cambios aquí son locales a esta sesión (datos de muestra). Conecta la base de datos real para persistirlos — ver README.
        </p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 h-10 font-mono text-xs uppercase tracking-widest border shrink-0 ${
              tab === t.id ? "bg-ink text-chalk dark:bg-chalk dark:text-ink border-ink dark:border-chalk" : "border-ink/15 dark:border-chalk/15"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="grid sm:grid-cols-3 gap-4">
          <Metrica etiqueta="Ventas (muestra)" valor={formatoMXN(totalVentas)} />
          <Metrica etiqueta="Productos activos" valor={String(productos.length)} />
          <Metrica etiqueta="Piezas en inventario" valor={String(totalInventario)} />
        </div>
      )}

      {tab === "productos" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setCreando(true)}
              className="flex items-center gap-2 bg-ember text-chalk px-4 h-10 font-mono text-xs uppercase tracking-widest"
            >
              <Plus size={14} /> Nuevo producto
            </button>
          </div>
          <div className="overflow-x-auto box-label pl-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 dark:border-chalk/10 text-left font-mono text-[10px] uppercase tracking-widest text-ink/50 dark:text-chalk/50">
                  <th className="p-3">SKU</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Marca</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Stock total</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} className="border-b border-ink/5 dark:border-chalk/5">
                    <td className="p-3 font-mono text-xs">{p.sku}</td>
                    <td className="p-3">{p.nombre}</td>
                    <td className="p-3">{p.marca}</td>
                    <td className="p-3 font-mono">{formatoMXN(p.precio)}</td>
                    <td className="p-3 font-mono">{p.tallas.reduce((s, t) => s + t.stock, 0)}</td>
                    <td className="p-3">
                      <div className="flex gap-3">
                        <button onClick={() => setEditando(p)} aria-label="Editar" className="hover:text-ember">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => eliminarProducto(p.id)} aria-label="Eliminar" className="hover:text-ember">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "pedidos" && (
        <div className="overflow-x-auto box-label pl-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 dark:border-chalk/10 text-left font-mono text-[10px] uppercase tracking-widest text-ink/50 dark:text-chalk/50">
                <th className="p-3">Pedido</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Total</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidosMuestra.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 dark:border-chalk/5">
                  <td className="p-3 font-mono text-xs">{p.id}</td>
                  <td className="p-3">{p.cliente}</td>
                  <td className="p-3 font-mono text-xs">{p.fecha}</td>
                  <td className="p-3 font-mono">{formatoMXN(p.total)}</td>
                  <td className="p-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 bg-jungle/10 text-jungle-bright">
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "usuarios" && (
        <div className="overflow-x-auto box-label pl-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 dark:border-chalk/10 text-left font-mono text-[10px] uppercase tracking-widest text-ink/50 dark:text-chalk/50">
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Pedidos</th>
                <th className="p-3">Tipo de cliente</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.email} className="border-b border-ink/5 dark:border-chalk/5">
                  <td className="p-3">
                    {u.nombre}
                  </td>
                  <td className="p-3 font-mono text-xs">{u.email}</td>
                  <td className="p-3 font-mono">{u.pedidos}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-[10px] uppercase font-mono tracking-widest ${u.tipo === 'Nuevo Registro' ? 'bg-ember/10 text-ember' : 'bg-ink/5 dark:bg-chalk/5'}`}>
                      {u.tipo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editando || creando) && (
        <ProductoForm
          producto={editando}
          onCerrar={() => {
            setEditando(null);
            setCreando(false);
          }}
          onGuardar={guardarProducto}
        />
      )}
    </div>
  );
}

function Metrica({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="box-label pl-5 p-5">
      <p className="sku-tag mb-2">{etiqueta}</p>
      <p className="font-display text-2xl">{valor}</p>
    </div>
  );
}

function ProductoForm({
  producto,
  onCerrar,
  onGuardar,
}: {
  producto: Product | null;
  onCerrar: () => void;
  onGuardar: (p: Product) => void;
}) {
  const [form, setForm] = useState<Product>(
    producto ?? {
      id: crypto.randomUUID(),
      sku: "",
      slug: "",
      nombre: "",
      marca: "",
      coleccion: "",
      genero: "Unisex",
      categoria: "",
      precio: 0,
      colores: [],
      colorPrincipal: "",
      imagenes: ["https://picsum.photos/seed/nuevo/800/800"],
      descripcion: "",
      materiales: "",
      tipoSuela: "",
      peso: "",
      incluyeCaja: true,
      garantiaDias: 90,
      envioDiasHabiles: "3 a 5 días hábiles",
      fabricacion: "",
      cuidados: "",
      tallas: [{ talla: "26", stock: 5 }],
    }
  );

  return (
    <div className="fixed inset-0 z-[60] bg-ink/50 flex items-center justify-center p-4" onClick={onCerrar}>
      <div
        className="bg-stone dark:bg-asphalt w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-lg">{producto ? "Editar producto" : "Nuevo producto"}</h2>
          <button onClick={onCerrar} aria-label="Cerrar"><X size={20} /></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onGuardar(form);
          }}
          className="space-y-4"
        >
          <CampoAdmin label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v, slug: v.toLowerCase().replace(/\s+/g, "-") })} />
          <CampoAdmin label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
          <CampoAdmin label="Marca" value={form.marca} onChange={(v) => setForm({ ...form, marca: v })} />
          <CampoAdmin label="Categoría" value={form.categoria} onChange={(v) => setForm({ ...form, categoria: v })} />
          <CampoAdmin label="Precio (MXN)" type="number" value={String(form.precio)} onChange={(v) => setForm({ ...form, precio: Number(v) })} />
          <CampoAdmin label="Color principal" value={form.colorPrincipal} onChange={(v) => setForm({ ...form, colorPrincipal: v, colores: [v] })} />
          <label className="block">
            <span className="sku-tag block mb-1">Descripción</span>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              rows={3}
              className="w-full border border-ink/15 dark:border-chalk/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-ember"
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-ember text-chalk py-3 font-mono text-xs uppercase tracking-widest">
              Guardar
            </button>
            <button type="button" onClick={onCerrar} className="flex-1 border border-ink/15 dark:border-chalk/15 py-3 font-mono text-xs uppercase tracking-widest">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CampoAdmin({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="sku-tag block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-ink/15 dark:border-chalk/15 bg-transparent px-3 h-10 text-sm outline-none focus:border-ember"
      />
    </label>
  );
}
