import Link from "next/link";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export function QuickCaptureFab({ label }: { label: string }) {
  return (
    <Link
      className={cn(
        "fixed bottom-24 right-4 z-40 flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border border-white/10 bg-[linear-gradient(135deg,#ff7a00_0%,#ff2c96_52%,#2563ff_100%)] text-center text-white shadow-[0_28px_50px_rgba(46,16,101,0.48)] transition-all hover:-translate-y-1 hover:brightness-110",
        "lg:bottom-8 lg:right-8 lg:h-40 lg:w-40 lg:gap-2"
      )}
      href="/items/new?type=text"
    >
      <span className="absolute inset-[8px] rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.16),transparent_20%)]" />
      <Plus className="relative h-7 w-7 lg:h-9 lg:w-9" />
      <span className="relative text-xs font-black leading-tight lg:text-2xl">{label}</span>
    </Link>
  );
}
