import Link from "next/link";
import { notFound } from "next/navigation";

import { ItemActions } from "@/components/items/item-actions";
import { ItemNotePanel } from "@/components/items/item-note-panel";
import { OpenInPlayerButton } from "@/components/items/open-in-player-button";
import { ItemForm } from "@/components/forms/item-form";
import { PageHeader } from "@/components/shared/page-header";
import { EmbeddedVideoPlayer } from "@/components/shared/embedded-video-player";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { statusLabelMap, typeLabelMap, visibilityLabelMap } from "@/lib/constants/creatoros";
import { getItemById, getWorkspaceOptions } from "@/lib/data/creatoros";
import { getEmbeddableVideo } from "@/lib/utils/embed";

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const [item, options] = await Promise.all([getItemById(params.id), getWorkspaceOptions()]);

  if (!item) {
    notFound();
  }

  const embeddableVideo = item.resolved_file_url ? getEmbeddableVideo(item.resolved_file_url) : null;
  const isPlayable = item.type === "audio";

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            {item.share ? (
              <Link className="rounded-full border border-input bg-white/80 px-4 py-2 text-sm" href={`/share/item/${item.share.slug}`}>
                Ver público
              </Link>
            ) : null}
            {isPlayable ? (
              <OpenInPlayerButton
                description={item.description}
                id={item.id}
                src={item.resolved_file_url}
                title={item.title}
              />
            ) : null}
            <ItemActions itemId={item.id} />
          </>
        }
        eyebrow="Detalle de pieza"
        description="Aquí una pieza deja de ser un archivo muerto y se convierte en superficie de trabajo: metadata, texto editable, notas y reproducción contextual."
        title={item.title}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="sand">{typeLabelMap[item.type]}</Badge>
        <Badge variant="warm">{statusLabelMap[item.status]}</Badge>
        <Badge variant={item.visibility === "public" ? "accent" : "default"}>
          {visibilityLabelMap[item.visibility]}
        </Badge>
        {item.project ? <Badge variant="success">{item.project.title}</Badge> : null}
      </div>

      {item.resolved_file_url ? (
        embeddableVideo ? (
          <EmbeddedVideoPlayer title={item.title} url={item.resolved_file_url} />
        ) : (
          <Card>
            <CardContent className="px-5 py-5">
              {item.type === "image" ? (
                <img alt={item.title} className="max-h-[420px] rounded-[24px] object-cover" src={item.resolved_file_url} />
              ) : item.type === "audio" ? (
                <audio className="w-full" controls src={item.resolved_file_url} />
              ) : (
                <Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={item.resolved_file_url}>
                  Abrir archivo principal
                </Link>
              )}
            </CardContent>
          </Card>
        )
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ItemForm item={item} projects={options.projects} />
        <ItemNotePanel itemId={item.id} notes={item.notes || []} />
      </div>
    </div>
  );
}
