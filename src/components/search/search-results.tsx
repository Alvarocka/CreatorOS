import { LibraryGrid } from "@/components/library/library-grid";
import { Card, CardContent } from "@/components/ui/card";
import type { AppLocale } from "@/lib/i18n";
import type { CreativeItemWithRelations } from "@/lib/types/app";

export function SearchResults({
  items,
  query,
  locale = "es"
}: {
  items: CreativeItemWithRelations[];
  query: string;
  locale?: AppLocale;
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="px-5 py-5">
          <p className="text-sm leading-6 text-muted-foreground">
            {query
              ? locale === "en"
                ? `${items.length} result(s) for "${query}".`
                : `${items.length} resultado(s) para "${query}".`
              : locale === "en"
                ? "Search by title, description, text, tags, project, type, status or visibility."
                : "Busca por titulo, descripcion, texto, tags, proyecto, tipo, estado o visibilidad."}
          </p>
        </CardContent>
      </Card>
      <LibraryGrid items={items} locale={locale} view="list" />
    </div>
  );
}
