import Link from "next/link";

import { ItemCard } from "@/components/items/item-card";
import { ProjectCard } from "@/components/projects/project-card";
import { PageHeader } from "@/components/shared/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardData } from "@/lib/data/creatoros";
import { getDictionary, getGreeting } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/utils/cn";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const locale = getCurrentLocale();
  const dictionary = getDictionary(locale);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={dictionary.dashboard.eyebrow}
        description={dictionary.dashboard.description}
        title={getGreeting(locale, data.profile?.display_name)}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          description={dictionary.dashboard.metrics.recent.description}
          label={dictionary.dashboard.metrics.recent.label}
          tone="blue"
          value={data.recentItems.length}
        />
        <MetricCard
          description={dictionary.dashboard.metrics.favorites.description}
          label={dictionary.dashboard.metrics.favorites.label}
          tone="pink"
          value={data.favoriteItems.length}
        />
        <MetricCard
          description={dictionary.dashboard.metrics.uncategorized.description}
          label={dictionary.dashboard.metrics.uncategorized.label}
          tone="orange"
          value={data.uncategorizedItems.length}
        />
        <MetricCard
          description={dictionary.dashboard.metrics.activeProjects.description}
          label={dictionary.dashboard.metrics.activeProjects.label}
          tone="green"
          value={data.activeProjects.length}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Link className={cn(buttonVariants({ size: "lg", variant: "info" }), "min-w-[240px]")} href="/projects">
          {dictionary.dashboard.viewProjects}
        </Link>
        <Link className={cn(buttonVariants({ size: "lg" }), "min-w-[240px]")} href="/items/new?type=text">
          {dictionary.dashboard.captureIdea}
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <SectionCard
          description={dictionary.dashboard.recentDescription}
          title={dictionary.dashboard.recentTitle}
        >
          {data.recentItems.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.recentItems.map((item) => (
                <ItemCard item={item} key={item.id} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref="/items/new?type=text"
              actionLabel={dictionary.dashboard.emptyRecentAction}
              actionVariant="warning"
              description={dictionary.dashboard.emptyRecentDescription}
              title={dictionary.dashboard.emptyRecentTitle}
              variant="ghost"
            />
          )}
        </SectionCard>

        <SectionCard
          description={dictionary.dashboard.readyDescription}
          title={dictionary.dashboard.readyTitle}
        >
          {data.readyItems.length ? (
            <div className="space-y-3">
              {data.readyItems.map((item) => (
                <ItemCard item={item} key={item.id} locale={locale} mode="list" />
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref="/library?status=ready"
              actionLabel={dictionary.dashboard.emptyReadyAction}
              actionVariant="success"
              description={dictionary.dashboard.emptyReadyDescription}
              title={dictionary.dashboard.emptyReadyTitle}
              variant="rocket"
            />
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard description={dictionary.dashboard.favoritesDescription} title={dictionary.dashboard.favoritesTitle}>
          {data.favoriteItems.length ? (
            <div className="space-y-3">
              {data.favoriteItems.map((item) => (
                <ItemCard item={item} key={item.id} locale={locale} mode="list" />
              ))}
            </div>
          ) : (
            <EmptyState
              description={dictionary.dashboard.emptyFavoritesDescription}
              title={dictionary.dashboard.emptyFavoritesTitle}
              variant="sparkles"
            />
          )}
        </SectionCard>

        <SectionCard description={dictionary.dashboard.projectsDescription} title={dictionary.dashboard.projectsTitle}>
          {data.activeProjects.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.activeProjects.map((project) => (
                <ProjectCard key={project.id} locale={locale} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              actionHref="/projects"
              actionLabel={dictionary.dashboard.emptyProjectsAction}
              actionVariant="info"
              description={dictionary.dashboard.emptyProjectsDescription}
              title={dictionary.dashboard.emptyProjectsTitle}
              variant="sparkles"
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
