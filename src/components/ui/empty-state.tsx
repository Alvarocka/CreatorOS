import Link from "next/link";
import { Ghost, Rocket, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  variant = "sparkles",
  actionVariant = "outline"
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  variant?: "sparkles" | "ghost" | "rocket";
  actionVariant?: "default" | "outline" | "info" | "success" | "warning";
}) {
  const iconMap = {
    sparkles: Sparkles,
    ghost: Ghost,
    rocket: Rocket
  };
  const Icon = iconMap[variant];
  const illustrationStyles = {
    sparkles:
      "from-[#3b82f6] via-[#8b5cf6] to-[#ff2c96] shadow-[0_24px_44px_rgba(99,102,241,0.3)]",
    ghost:
      "from-[#8573ff] via-[#cabdff] to-[#ffcc4d] shadow-[0_24px_44px_rgba(167,139,250,0.28)]",
    rocket:
      "from-[#ff3d94] via-[#7c6cff] to-[#1d4ed8] shadow-[0_24px_44px_rgba(99,102,241,0.3)]"
  };

  return (
    <Card className="border-white/6 bg-white/[0.02]">
      <CardContent className="flex flex-col items-center gap-5 px-6 py-12 text-center">
        <div
          className={cn(
            "relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br text-white",
            illustrationStyles[variant]
          )}
        >
          <div className="absolute -left-3 top-2 h-4 w-4 rotate-12 rounded-full bg-yellow-300/80 blur-[1px]" />
          <div className="absolute -right-1 bottom-3 h-3 w-3 rounded-full bg-fuchsia-300/80 blur-[1px]" />
          <div className="absolute bottom-0 left-1/2 h-4 w-20 -translate-x-1/2 rounded-full bg-indigo-950/45 blur-md" />
          <Icon className="relative h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-[-0.03em] text-white">{title}</h3>
          <p className="mx-auto max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {actionHref && actionLabel ? (
          <Link className={cn(buttonVariants({ variant: actionVariant }))} href={actionHref}>
            {actionLabel}
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
