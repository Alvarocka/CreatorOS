import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {eyebrow ? <Badge variant="sand">{eyebrow}</Badge> : null}
        <div className="space-y-2">
          <h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
