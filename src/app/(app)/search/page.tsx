import { Search } from "lucide-react";

import { SearchResults } from "@/components/search/search-results";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSearchData } from "@/lib/data/creatoros";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n/server";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = typeof searchParams.query === "string" ? searchParams.query : "";
  const data = await getSearchData(query);
  const locale = getCurrentLocale();
  const dictionary = getDictionary(locale);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={dictionary.search.eyebrow}
        description={dictionary.search.description}
        title={dictionary.search.title}
      />
      <Card>
        <CardContent className="px-5 py-5">
          <form action="/search" className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-11" defaultValue={query} name="query" placeholder={dictionary.search.placeholder} />
          </form>
        </CardContent>
      </Card>
      <SearchResults items={data.items} locale={locale} query={query} />
    </div>
  );
}
