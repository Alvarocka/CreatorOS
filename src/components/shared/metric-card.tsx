import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function MetricCard({
  label,
  value,
  description,
  tone = "blue"
}: {
  label: string;
  value: string | number;
  description: string;
  tone?: "blue" | "pink" | "orange" | "green";
}) {
  const toneStyles = {
    blue: "from-[#1b63ff] via-[#2450e9] to-[#0f2f9e]",
    pink: "from-[#b628ff] via-[#ff2f9a] to-[#7d2fff]",
    orange: "from-[#ffb000] via-[#ff7a00] to-[#ff5d00]",
    green: "from-[#56d44a] via-[#1fb964] to-[#0e8d44]"
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-white/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))]",
        "before:absolute before:-right-4 before:top-4 before:h-20 before:w-20 before:rounded-full before:bg-white/8 before:blur-xl",
        "after:absolute after:bottom-3 after:right-8 after:h-4 after:w-4 after:rotate-45 after:rounded-sm after:bg-white/20"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-[0.95]",
          toneStyles[tone]
        )}
      />
      <div className="absolute right-5 top-5 grid grid-cols-2 gap-2 opacity-70">
        <span className="h-3 w-3 rotate-45 rounded-sm bg-white/60" />
        <span className="h-2.5 w-2.5 rotate-45 rounded-sm bg-white/35" />
        <span className="h-2.5 w-2.5 rotate-45 rounded-sm bg-white/45" />
        <span className="h-3 w-3 rotate-45 rounded-sm bg-white/25" />
      </div>
      <CardContent className="relative space-y-3 px-5 py-5 text-white">
        <p className="text-sm font-black uppercase tracking-[0.06em] text-white/92">{label}</p>
        <div className="space-y-1">
          <p className="text-5xl font-black leading-none tracking-[-0.04em]">{value}</p>
          <p className="text-base text-white/88">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
