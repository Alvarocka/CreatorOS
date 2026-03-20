import Link from "next/link";
import { notFound } from "next/navigation";

import { EmbeddedVideoPlayer } from "@/components/shared/embedded-video-player";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { typeLabelMap } from "@/lib/constants/creatoros";
import { getPublicItemBySlug } from "@/lib/data/creatoros";
import { getEmbeddableVideo } from "@/lib/utils/embed";

export default async function PublicItemPage({ params }: { params: { slug: string } }) {
  const data = await getPublicItemBySlug(params.slug);

  if (!data) {
    notFound();
  }

  const author = (data.author || null) as { username?: string; display_name?: string | null } | null;
  const embeddableVideo = data.item.resolved_file_url ? getEmbeddableVideo(data.item.resolved_file_url) : null;

  return (
    <main className="container-shell space-y-6 py-8 md:py-12">
      <div className="space-y-3">
        <Badge variant="accent">Pieza pública</Badge>
        <h1 className="text-4xl font-semibold">{data.item.title}</h1>
        <p className="text-sm text-muted-foreground">
          Por{" "}
          {author?.username ? (
            <Link className="text-primary underline-offset-4 hover:underline" href={`/u/${author.username}`}>
              {author.display_name || author.username}
            </Link>
          ) : (
            <span>{author?.display_name || "Creator"}</span>
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{typeLabelMap[data.item.type]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {data.item.description ? <p className="text-sm leading-7 text-muted-foreground">{data.item.description}</p> : null}
          {data.item.resolved_file_url ? (
            embeddableVideo ? (
              <EmbeddedVideoPlayer title={data.item.title} url={data.item.resolved_file_url} />
            ) : data.item.type === "image" ? (
              <img alt={data.item.title} className="max-h-[520px] rounded-[28px] object-cover" src={data.item.resolved_file_url} />
            ) : data.item.type === "audio" ? (
              <audio className="w-full" controls src={data.item.resolved_file_url} />
            ) : (
              <Link className="text-primary underline-offset-4 hover:underline" href={data.item.resolved_file_url}>
                Abrir archivo compartido
              </Link>
            )
          ) : null}
          {data.item.content_text ? (
            <div className="rounded-[28px] bg-muted/50 p-5">
              <p className="whitespace-pre-wrap text-sm leading-7">{data.item.content_text}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
