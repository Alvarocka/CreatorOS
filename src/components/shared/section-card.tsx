import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionCard({
  title,
  description,
  children,
  action
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(22,26,43,0.95),rgba(11,14,26,0.95))]">
      <CardHeader className="flex-row items-start justify-between gap-4 border-b border-white/8 pb-5">
        <div className="space-y-2">
          <CardTitle className="text-[2rem] leading-none md:text-[2.2rem]">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
