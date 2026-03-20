import type { LibraryFilters } from "@/lib/types/app";

export function parseLibraryFilters(searchParams: Record<string, string | string[] | undefined>): LibraryFilters {
  const pick = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    favorite: (pick("favorite") as LibraryFilters["favorite"]) || "all",
    projectId: pick("projectId") || "all",
    query: pick("query") || "",
    sort: (pick("sort") as LibraryFilters["sort"]) || "updated_desc",
    status: (pick("status") as LibraryFilters["status"]) || "all",
    tagId: pick("tagId") || "all",
    type: (pick("type") as LibraryFilters["type"]) || "all",
    view: (pick("view") as LibraryFilters["view"]) || "grid",
    visibility: (pick("visibility") as LibraryFilters["visibility"]) || "all"
  };
}
