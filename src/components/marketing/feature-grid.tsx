import { Globe, Layers3, ScanSearch, WandSparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Layers3,
    title: "Archivo creativo vivo",
    description:
      "Guarda texto, audio, imagen, video, archivos, links y notas en el mismo sistema sin perder contexto."
  },
  {
    icon: ScanSearch,
    title: "Búsqueda que encuentra",
    description:
      "Filtra por proyecto, tags, estado, visibilidad, favoritos, tipo y texto para rescatar ideas viejas en segundos."
  },
  {
    icon: WandSparkles,
    title: "Espacio real de re-trabajo",
    description:
      "Reabre piezas, reescribe, deja notas mentales o de referencia y continúa el proceso creativo sin fricción."
  },
  {
    icon: Globe,
    title: "Vitrina pública opcional",
    description:
      "Haz públicas solo las piezas o proyectos que quieras y construye un perfil simple para compartir tu trabajo."
  }
];

export function FeatureGrid() {
  return (
    <section className="container-shell py-16 md:py-24">
      <div className="mb-10 space-y-4">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Por qué CreatorOS</p>
        <h2 className="section-title max-w-3xl">
          Pensado para personas que crean mucho, guardan en todas partes y luego no recuerdan dónde quedó
          cada cosa.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card className="h-full" key={feature.title}>
              <CardHeader className="space-y-4">
                <div className="w-fit rounded-2xl bg-secondary p-3 text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
