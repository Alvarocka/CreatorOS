import { FolderPlus } from "lucide-react";

import { ProjectForm } from "@/components/forms/project-form";
import { ProjectCard } from "@/components/projects/project-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getProjectsPageData } from "@/lib/data/creatoros";
import { getDictionary } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n/server";

export default async function ProjectsPage() {
  const data = await getProjectsPageData();
  const locale = getCurrentLocale();
  const dictionary = getDictionary(locale);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={dictionary.projects.eyebrow}
        description={dictionary.projects.description}
        title={dictionary.projects.title}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ProjectForm />
        <div className="space-y-4">
          <div className="rounded-[28px] border border-dashed border-white/12 bg-white/[0.04] px-5 py-5">
            <div className="mb-3 inline-flex rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-white">
              <FolderPlus className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-white">{dictionary.projects.highlightTitle}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {dictionary.projects.highlightBody}
            </p>
          </div>
          {data.projects.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.projects.map((project) => (
                <ProjectCard key={project.id} locale={locale} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              description={dictionary.projects.emptyDescription}
              title={dictionary.projects.emptyTitle}
              variant="sparkles"
            />
          )}
        </div>
      </div>
    </div>
  );
}
