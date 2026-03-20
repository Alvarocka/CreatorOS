import { EmptyState } from "@/components/ui/empty-state";
import type { AppLocale } from "@/lib/i18n";
import { emptyStates } from "@/lib/constants/creatoros";
import type { CreativeItemWithRelations } from "@/lib/types/app";
import { ItemCard } from "@/components/items/item-card";

export function LibraryGrid({
  items,
  view,
  locale = "es"
}: {
  items: CreativeItemWithRelations[];
  view: "grid" | "list";
  locale?: AppLocale;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        actionHref="/items/new?type=text"
        actionLabel={locale === "en" ? "Create first piece" : "Crear primera pieza"}
        description={
          locale === "en"
            ? "Start by capturing an idea, a link, an audio note or a file. Everything lives here and evolves from here."
            : emptyStates.library.description
        }
        title={
          locale === "en"
            ? "Your library is still waiting for its first piece"
            : emptyStates.library.title
        }
        variant="ghost"
        actionVariant="warning"
      />
    );
  }

  if (view === "list") {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <ItemCard item={item} key={item.id} locale={locale} mode="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ItemCard item={item} key={item.id} locale={locale} />
      ))}
    </div>
  );
}
