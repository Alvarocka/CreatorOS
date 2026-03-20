import { notFound } from "next/navigation";

import { ItemCard } from "@/components/items/item-card";
import { ProjectCard } from "@/components/projects/project-card";
import { PublicProfileHeader } from "@/components/profile/public-profile-header";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublicProfileByUsername } from "@/lib/data/creatoros";

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const data = await getPublicProfileByUsername(params.username);

  if (!data) {
    notFound();
  }

  return (
    <main className="container-shell space-y-8 py-8 md:py-12">
      <PublicProfileHeader profile={data.profile} />

      <SectionCard description="Proyectos visibles para compartir o explorar." title="Proyectos públicos">
        {data.projects.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.projects.map((project) => (
              <ProjectCard
                href={project.share ? `/share/project/${project.share.slug}` : `/u/${params.username}`}
                key={project.id}
                project={project}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Todavía no hay proyectos públicos en este perfil."
            title="Sin proyectos públicos"
          />
        )}
      </SectionCard>

      <SectionCard description="Piezas individuales marcadas como públicas." title="Piezas públicas">
        {data.items.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((item) => (
              <ItemCard
                href={item.share ? `/share/item/${item.share.slug}` : `/u/${params.username}`}
                item={item}
                key={item.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState description="Todavía no hay piezas públicas en este perfil." title="Sin piezas públicas" />
        )}
      </SectionCard>
    </main>
  );
}
