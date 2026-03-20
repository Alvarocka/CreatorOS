import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function CtaBanner() {
  return (
    <section className="container-shell pb-20">
      <div className="overflow-hidden rounded-[40px] border border-white/70 bg-studio-ink px-6 py-10 text-white shadow-soft md:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/55">Empieza ahora</p>
            <h2 className="max-w-3xl text-balance text-4xl font-semibold md:text-5xl">
              Convierte tu caos creativo en un sistema que sí acompaña tu proceso.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/72 md:text-base">
              Crea tu espacio, captura lo que tengas a mano y publica solo lo que quieras mostrar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className={cn(buttonVariants({ size: "lg" }), "bg-white text-studio-ink hover:bg-white/90")} href="/signup">
              Crear cuenta
            </Link>
            <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white/20 bg-white/5 text-white hover:bg-white/10")} href="/login">
              Ver acceso
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
