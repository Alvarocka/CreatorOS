import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export function Select({ className, options, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_24px_rgba(2,6,23,0.22)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
