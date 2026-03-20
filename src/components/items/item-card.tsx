import Link from "next/link";
import {
  File,
  FileAudio2,
  FileImage,
  FileText,
  FileVideo,
  Link2,
  NotebookPen,
  Star
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AppLocale } from "@/lib/i18n";
import { getStatusLabel, getTypeLabel, getVisibilityLabel } from "@/lib/i18n";
import type { CreativeItemWithRelations } from "@/lib/types/app";
import { formatRelativeDate } from "@/lib/utils/format";

const iconMap = {
  audio: FileAudio2,
  file: File,
  image: FileImage,
  link: Link2,
  note: NotebookPen,
  text: FileText,
  video: FileVideo
};

export function ItemCard({
  item,
  mode = "grid",
  href,
  locale = "es"
}: {
  item: CreativeItemWithRelations;
  mode?: "grid" | "list";
  href?: string;
  locale?: AppLocale;
}) {
  const Icon = iconMap[item.type];

  return (
    <Link href={href || `/items/${item.id}`}>
      <Card
        className={
          mode === "list"
            ? "border-white/8 transition-transform hover:-translate-y-0.5 hover:border-white/16"
            : "h-full border-white/8 transition-transform hover:-translate-y-1 hover:border-white/16"
        }
      >
        <CardContent className={mode === "list" ? "flex items-center gap-4 px-5 py-5" : "space-y-4 px-5 py-5"}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.06] text-white">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sand">{getTypeLabel(locale, item.type)}</Badge>
              <Badge variant={item.visibility === "public" ? "accent" : "default"}>
                {getVisibilityLabel(locale, item.visibility)}
              </Badge>
              <Badge variant={item.status === "ready" || item.status === "published" ? "success" : "warm"}>
                {getStatusLabel(locale, item.status)}
              </Badge>
              {item.is_favorite ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {locale === "en" ? "Favorite" : "Favorito"}
                </span>
              ) : null}
            </div>
            <div className="space-y-1">
              <h3 className="line-clamp-2 text-lg font-bold tracking-[-0.03em] text-white">{item.title}</h3>
              <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                {item.description ||
                  item.content_text ||
                  (locale === "en" ? "No description yet." : "Sin descripcion todavia.")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{formatRelativeDate(item.updated_at, locale)}</span>
              {item.project ? (
                <span>{locale === "en" ? `Project: ${item.project.title}` : `Proyecto: ${item.project.title}`}</span>
              ) : (
                <span>{locale === "en" ? "No project" : "Sin proyecto"}</span>
              )}
            </div>
            {item.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((tag) => (
                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/65" key={tag.id}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
