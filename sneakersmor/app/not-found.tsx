import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <p className="sku-tag mb-3">Error 404</p>
      <h1 className="font-display text-3xl mb-3">Este par no está en el estante</h1>
      <p className="text-sm text-ink/60 dark:text-chalk/60 mb-8">
        El producto o la página que buscas ya no existe o cambió de dirección.
      </p>
      <Link href="/tienda" className="inline-block bg-ink dark:bg-chalk text-chalk dark:text-ink px-6 py-3 font-mono text-xs uppercase tracking-widest">
        Ver catálogo
      </Link>
    </div>
  );
}
