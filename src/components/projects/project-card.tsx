import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AppLocale } from "@/lib/i18n";
import { getStatusLabel, getVisibilityLabel } from "@/lib/i18n";
import type { ProjectWithItems } from "@/lib/types/app";
import { formatRelativeDate } from "@/lib/utils/format";

export function ProjectCard({
  project,
  href,
  locale = "es"
}: {
  project: ProjectWithItems;
  href?: string;
  locale?: AppLocale;
}) {
  return (
    <Link href={href || `/projects/${project.id}`}>
      <Card className="h-full border-white/8 transition-transform hover:-translate-y-1 hover:border-white/16">
        <CardContent className="space-y-4 px-5 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant={project.visibility === "public" ? "accent" : "default"}>
                  {getVisibilityLabel(locale, project.visibility)}
                </Badge>
                <Badge variant={project.status === "ready" || project.status === "published" ? "success" : "warm"}>
                  {getStatusLabel(locale, project.status)}
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.03em] text-white">{project.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {project.description ||
                    (locale === "en"
                      ? "Group pieces, ideas and materials from the same creative process."
                      : "Agrupa piezas, ideas y materiales de un mismo proceso creativo.")}
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatRelativeDate(project.updated_at, locale)}</span>
            {project.share ? (
              <span className="inline-flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5" />
                {locale === "en" ? "Shareable" : "Compartible"}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
