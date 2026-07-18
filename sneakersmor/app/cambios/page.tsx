import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Cambios | SneakersMor.MX",
  description: "Política de cambios.",
};

export default function CambiosPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 md:p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-ember/10 via-stone to-stone dark:from-ember/20 dark:via-asphalt dark:to-asphalt -z-10" />
      
      <div className="max-w-2xl w-full box-label pl-6 p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ember to-transparent opacity-50" />
        
        <div className="w-16 h-16 mx-auto bg-ember/10 flex items-center justify-center rounded-full mb-6">
          <Mail size={28} className="text-ember" />
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl mb-4">
          Cambios
        </h1>
        
        <p className="text-lg text-ink/70 dark:text-chalk/70 mb-8 max-w-lg mx-auto">
          Para cualquier cambio de talla o problema con tu pedido, por favor comunícate directamente con nosotros a través de correo electrónico.
        </p>

        <div className="bg-stone-soft dark:bg-asphalt-raised border border-ink/10 dark:border-chalk/10 py-4 px-6 inline-flex flex-col items-center gap-2 mb-10 group hover:border-ember transition-colors">
          <span className="font-mono text-xs uppercase tracking-widest text-ink/40 dark:text-chalk/40">
            Escríbenos a
          </span>
          <a href="mailto:sneakersmor.mx@gmail.com" className="font-display text-xl md:text-2xl hover:text-ember transition-colors">
            sneakersmor.mx@gmail.com
          </a>
        </div>

        <div>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink/60 dark:text-chalk/60 hover:text-ember transition-colors"
          >
            <ArrowLeft size={14} /> Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
