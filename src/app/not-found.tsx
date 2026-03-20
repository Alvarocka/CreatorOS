import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-screen flex-col items-center justify-center gap-6 py-12 text-center">
      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">404</p>
      <h1 className="text-4xl font-semibold">Esta pieza no está aquí</h1>
      <p className="max-w-xl text-sm leading-7 text-muted-foreground">
        Puede que el contenido haya cambiado de visibilidad, ya no exista o la URL no sea correcta.
      </p>
      <Link className={cn(buttonVariants())} href="/">
        Volver a CreatorOS
      </Link>
    </main>
  );
}
