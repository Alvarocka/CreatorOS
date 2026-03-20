import { CheckCircle2, FolderKanban, Search, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const previews = [
  {
    title: "Dashboard con foco",
    bullets: ["Piezas recientes", "Favoritos", "Sin clasificar", "Listo para publicar"],
    icon: Star
  },
  {
    title: "Biblioteca filtrable",
    bullets: ["Grid/List", "Orden temporal", "Tags, estado y tipo", "Favoritos y visibilidad"],
    icon: Search
  },
  {
    title: "Proyectos que agrupan",
    bullets: ["Campañas", "Álbumes", "Libros", "Series de contenido"],
    icon: FolderKanban
  }
];

export function ProductPreview() {
  return (
    <section className="container-shell py-16 md:py-24">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Preview del producto</p>
          <h2 className="section-title">Un estudio digital personal que no se siente corporativo ni rígido.</h2>
          <p className="section-copy">
            La interfaz prioriza claridad, lectura, captura rápida y una sensación de biblioteca elegante.
            Todo está pensado para volver a materiales antiguos y transformarlos otra vez.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {previews.map((preview) => {
            const Icon = preview.icon;
            return (
              <Card className="bg-studio-ink text-white" key={preview.title}>
                <CardContent className="space-y-5 px-5 py-6">
                  <div className="w-fit rounded-2xl bg-white/10 p-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{preview.title}</h3>
                    <div className="space-y-2">
                      {preview.bullets.map((bullet) => (
                        <div className="flex items-center gap-2 text-sm text-white/75" key={bullet}>
                          <CheckCircle2 className="h-4 w-4 text-studio-gold" />
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
