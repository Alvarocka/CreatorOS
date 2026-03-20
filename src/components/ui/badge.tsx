import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/[0.05] text-white/78",
        accent: "border-cyan-400/20 bg-cyan-400/12 text-cyan-200",
        warm: "border-orange-400/20 bg-orange-400/12 text-orange-200",
        sand: "border-yellow-300/18 bg-yellow-300/12 text-yellow-100",
        success: "border-emerald-400/20 bg-emerald-400/12 text-emerald-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
