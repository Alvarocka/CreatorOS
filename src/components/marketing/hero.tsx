import Link from "next/link";
import { ArrowRight, AudioLines, BookOpenText, Link2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const quickTypes = [
  { icon: AudioLines, label: "Audio" },
  { icon: BookOpenText, label: "Texto" },
  { icon: Link2, label: "Links" },
  { icon: Sparkles, label: "Notas" }
];

export function Hero() {
  return (
    <section className="container-shell pb-16 pt-6 md:pb-24 md:pt-10">
      <div className="relative overflow-hidden rounded-[40px] border border-white/70 bg-hero-glow p-6 shadow-soft md:p-10 lg:p-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="sand">La creatividad no debería perderse por dispersión</Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.95] md:text-7xl">
                El sistema donde tus ideas dejan de vivir partidas en mil lugares.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                CreatorOS reúne notas, audios, imágenes, links, borradores, archivos y proyectos en una
                biblioteca creativa que sí puedes encontrar, editar, relacionar y publicar.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className={cn(buttonVariants({ size: "lg" }), "gap-2")} href="/signup">
                Crear mi archivo creativo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className={cn(buttonVariants({ size: "lg", variant: "outline" }))} href="/login">
                Entrar a CreatorOS
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    className="flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-muted-foreground"
                    key={type.label}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {type.label}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <div className="paper-grid rounded-[32px] border border-white/80 bg-white/75 p-4 shadow-card backdrop-blur-xl md:p-5">
              <div className="rounded-[28px] bg-studio-ink p-5 text-white">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                  <span>CreatorOS Preview</span>
                  <span>mobile-first</span>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="rounded-[26px] bg-white/8 p-4">
                    <p className="text-sm text-white/70">Audio / letra / nota mental</p>
                    <h3 className="mt-2 text-2xl font-semibold">Canción demo del domingo</h3>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      Reproduce el audio abajo, edita la letra aquí y deja observaciones con timestamp sin
                      salir de la pieza.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs">idea</span>
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs">publicable</span>
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs">letra</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] bg-white/8 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/50">Proyectos activos</p>
                      <p className="mt-3 text-3xl font-semibold">04</p>
                    </div>
                    <div className="rounded-[22px] bg-white/8 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/50">Listo para publicar</p>
                      <p className="mt-3 text-3xl font-semibold">12</p>
                    </div>
                  </div>
                  <div className="rounded-[22px] bg-white/8 p-4">
                    <p className="text-sm font-medium">Captura rápida</p>
                    <div className="mt-3 flex items-center justify-between rounded-full bg-white/10 px-4 py-3 text-sm text-white/60">
                      <span>Texto, audio, link o archivo en 1-2 clics</span>
                      <span className="rounded-full bg-primary px-3 py-1 text-xs text-white">Nuevo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
