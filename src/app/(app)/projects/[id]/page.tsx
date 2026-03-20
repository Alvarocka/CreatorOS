import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/forms/project-form";
import { ItemCard } from "@/components/items/item-card";
import { ProjectActions } from "@/components/projects/project-actions";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { statusLabelMap, typeLabelMap } from "@/lib/constants/creatoros";
import { getProjectById } from "@/lib/data/creatoros";

export default async function ProjectDetailPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const statusFilter = typeof searchParams.status === "string" ? searchParams.status : "all";
  const typeFilter = typeof searchParams.type === "string" ? searchParams.type : "all";

  const filteredItems =
    project.items?.filter((item) => {
      const statusMatches = statusFilter === "all" ? true : item.status === statusFilter;
      const typeMatches = typeFilter === "all" ? true : item.type === typeFilter;
      return statusMatches && typeMatches;
    }) || [];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            {project.share ? (
              <Link className="rounded-full border border-input bg-white/80 px-4 py-2 text-sm" href={`/share/project/${project.share.slug}`}>
                Ver público
              </Link>
            ) : null}
            <ProjectActions projectId={project.id} />
          </>
        }
        eyebrow="Proyecto"
        description={project.description || "Organiza y revisa todas las piezas que pertenecen a este proyecto."}
        title={project.title}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ProjectForm project={project} />
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 px-5 py-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant="warm">{statusLabelMap[project.status]}</Badge>
                <Badge variant={project.visibility === "public" ? "accent" : "default"}>
                  {project.visibility}
                </Badge>
              </div>
              <form className="grid gap-4 md:grid-cols-2">
                <select
                  className="h-11 rounded-2xl border border-input bg-white/80 px-4 text-sm"
                  defaultValue={statusFilter}
                  name="status"
                >
                  <option value="all">Todos los estados</option>
                  {Object.entries(statusLabelMap).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select className="h-11 rounded-2xl border border-input bg-white/80 px-4 text-sm" defaultValue={typeFilter} name="type">
                  <option value="all">Todos los tipos</option>
                  {Object.entries(typeLabelMap).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Button className="md:col-span-2" type="submit" variant="secondary">
                  Aplicar filtros
                </Button>
              </form>
            </CardContent>
          </Card>

          {filteredItems.length ? (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <ItemCard item={item} key={item.id} mode="list" />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="px-5 py-8 text-center">
                <p className="text-lg font-semibold">No hay piezas con esos filtros</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ajusta el estado o tipo, o vuelve a la biblioteca para mover piezas a este proyecto.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
