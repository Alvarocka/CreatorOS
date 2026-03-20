import Link from "next/link";

import { LibraryFilters } from "@/components/library/library-filters";
import { LibraryGrid } from "@/components/library/library-grid";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { getLibraryData } from "@/lib/data/creatoros";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n/server";
import { parseLibraryFilters } from "@/lib/utils/filters";
import { cn } from "@/lib/utils/cn";

export default async function LibraryPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseLibraryFilters(searchParams);
  const data = await getLibraryData(filters);
  const locale = getCurrentLocale();
  const dictionary = getDictionary(locale);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={cn(buttonVariants())} href="/items/new?type=text">
            {dictionary.common.newPiece}
          </Link>
        }
        eyebrow={dictionary.library.eyebrow}
        description={dictionary.library.description}
        title={dictionary.library.title}
      />
      <LibraryFilters currentSearchParams={searchParams} filters={filters} projects={data.projects} tags={data.tags} />
      <LibraryGrid items={data.items} locale={locale} view={filters.view || "grid"} />
    </div>
  );
}
