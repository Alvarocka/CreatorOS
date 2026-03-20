import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container-shell py-8 md:py-14">
      <div className="grid min-h-[calc(100vh-4rem)] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-studio-ink p-8 text-white shadow-soft">
          <Link className="mb-12 inline-flex items-center gap-3" href="/">
            <div className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-studio-ink">CO</div>
            <div>
              <p className="font-semibold">CreatorOS</p>
              <p className="text-xs text-white/60">archivo creativo vivo</p>
            </div>
          </Link>
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/60">Tu estudio digital</p>
            <h1 className="max-w-xl text-balance text-4xl font-semibold md:text-5xl">
              Captura, organiza, reescribe y publica desde un solo lugar.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/72 md:text-base">
              CreatorOS está diseñado para que tus ideas, referencias, letras, audios, archivos y proyectos
              no vuelvan a quedar perdidos entre apps, carpetas y mensajes viejos.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">{children}</section>
      </div>
    </main>
  );
}
