import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { getEmbeddableVideo, isSoraShareUrl } from "@/lib/utils/embed";

export function EmbeddedVideoPlayer({
  title,
  url
}: {
  title: string;
  url: string;
}) {
  const embed = getEmbeddableVideo(url);

  if (!embed) {
    return (
      <Card>
        <CardContent className="space-y-3 px-5 py-5">
          <p className="text-sm leading-6 text-muted-foreground">
            Este video externo no tiene un modo de embed conocido, pero puedes abrirlo directamente.
          </p>
          <Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={url}>
            Abrir enlace de video
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 px-5 py-5">
        <div className="overflow-hidden rounded-[28px] border border-input bg-studio-ink">
          <div className="aspect-video">
            {embed.type === "video" ? (
              <video className="h-full w-full object-contain" controls src={embed.src} />
            ) : (
              <iframe
                allow="autoplay; fullscreen; picture-in-picture"
                className="h-full w-full"
                referrerPolicy="strict-origin-when-cross-origin"
                src={embed.src}
                title={title}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {isSoraShareUrl(url) ? (
            <p>
              Enlace detectado como video compartido de Sora. Se intenta renderizar como publicación embebida
              dentro de CreatorOS.
            </p>
          ) : (
            <p>Video externo embebido dentro de la pieza para mantener el contexto creativo en la misma vista.</p>
          )}
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href={url}>
            Abrir enlace original
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
