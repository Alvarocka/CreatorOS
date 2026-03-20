import { cn } from "@/lib/utils/cn";
import { initialsFromName } from "@/lib/utils/format";

export function Avatar({
  name,
  src,
  className
}: {
  name?: string | null;
  src?: string | null;
  className?: string;
}) {
  if (src) {
    return (
      <img
        alt={name || "Avatar"}
        className={cn("h-10 w-10 rounded-full border border-white/10 object-cover shadow-[0_8px_18px_rgba(2,6,23,0.3)]", className)}
        src={src}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(135deg,#ff7a00_0%,#ff2c96_58%,#7c3aed_100%)] text-xs font-black uppercase text-white shadow-[0_12px_24px_rgba(255,46,156,0.28)]",
        className
      )}
    >
      {initialsFromName(name)}
    </div>
  );
}
