import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { itemTypes, librarySortOptions, statusLabelMap, visibilityLabelMap, workflowStatuses } from "@/lib/constants/creatoros";
import type { LibraryFilters, Project, Tag } from "@/lib/types/app";
import { buildQueryString } from "@/lib/utils/query";

export function LibraryFilters({
  currentSearchParams,
  filters,
  projects,
  tags
}: {
  currentSearchParams: Record<string, string | string[] | undefined>;
  filters: LibraryFilters;
  projects: Project[];
  tags: Tag[];
}) {
  return (
    <Card>
      <CardContent className="space-y-4 px-5 py-5">
        <form action="/library" className="grid gap-4 lg:grid-cols-[1.5fr_repeat(6,minmax(0,1fr))]">
          <Input defaultValue={filters.query || ""} name="query" placeholder="Buscar por título, texto, tags o proyecto" />
          <Select
            defaultValue={filters.type || "all"}
            name="type"
            options={[
              { label: "Todos los tipos", value: "all" },
              ...itemTypes.map((type) => ({ label: type, value: type }))
            ]}
          />
          <Select
            defaultValue={filters.status || "all"}
            name="status"
            options={[
              { label: "Todos los estados", value: "all" },
              ...workflowStatuses.map((status) => ({ label: statusLabelMap[status], value: status }))
            ]}
          />
          <Select
            defaultValue={filters.visibility || "all"}
            name="visibility"
            options={[
              { label: "Toda visibilidad", value: "all" },
              { label: visibilityLabelMap.private, value: "private" },
              { label: visibilityLabelMap.public, value: "public" }
            ]}
          />
          <Select
            defaultValue={filters.favorite || "all"}
            name="favorite"
            options={[
              { label: "Todos", value: "all" },
              { label: "Solo favoritos", value: "favorites" }
            ]}
          />
          <Select
            defaultValue={filters.projectId || "all"}
            name="projectId"
            options={[
              { label: "Todos los proyectos", value: "all" },
              ...projects.map((project) => ({ label: project.title, value: project.id }))
            ]}
          />
          <Select
            defaultValue={filters.tagId || "all"}
            name="tagId"
            options={[
              { label: "Todos los tags", value: "all" },
              ...tags.map((tag) => ({ label: `#${tag.name}`, value: tag.id }))
            ]}
          />
          <div className="flex gap-3 lg:col-span-7">
            <Select
              defaultValue={filters.sort || "updated_desc"}
              name="sort"
              options={librarySortOptions.map((option) => ({
                label: option.label,
                value: option.value
              }))}
            />
            <Button type="submit" variant="secondary">
              Aplicar filtros
            </Button>
          </div>
        </form>
        <div className="flex flex-wrap gap-3">
          <Link
            className={`rounded-full px-4 py-2 text-sm ${filters.view !== "list" ? "bg-studio-ink text-white" : "border border-input bg-white/80"}`}
            href={`/library${buildQueryString(currentSearchParams, { view: "grid" })}`}
          >
            Vista grid
          </Link>
          <Link
            className={`rounded-full px-4 py-2 text-sm ${filters.view === "list" ? "bg-studio-ink text-white" : "border border-input bg-white/80"}`}
            href={`/library${buildQueryString(currentSearchParams, { view: "list" })}`}
          >
            Vista lista
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
