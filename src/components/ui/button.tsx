import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-white/10 bg-[linear-gradient(135deg,#ff7a00_0%,#ff2c96_55%,#b12bff_100%)] text-primary-foreground shadow-neon hover:-translate-y-0.5 hover:brightness-110",
        info:
          "border border-white/10 bg-[linear-gradient(135deg,#1d4ed8_0%,#2563eb_48%,#153b9f_100%)] text-white shadow-[0_16px_34px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 hover:brightness-110",
        success:
          "border border-white/10 bg-[linear-gradient(135deg,#1f9d48_0%,#25c05a_55%,#0b7b38_100%)] text-white shadow-[0_16px_34px_rgba(34,197,94,0.28)] hover:-translate-y-0.5 hover:brightness-110",
        warning:
          "border border-white/10 bg-[linear-gradient(135deg,#ffb000_0%,#ff8a00_55%,#ff6b00_100%)] text-[#1d1207] shadow-[0_16px_34px_rgba(255,166,0,0.26)] hover:-translate-y-0.5 hover:brightness-105",
        secondary:
          "border border-white/10 bg-secondary text-secondary-foreground shadow-[0_14px_28px_rgba(2,6,23,0.28)] hover:-translate-y-0.5 hover:bg-secondary/90",
        ghost: "bg-transparent text-foreground hover:bg-white/6",
        outline:
          "border border-white/12 bg-white/[0.03] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_32px_rgba(2,6,23,0.32)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]",
        subtle: "border border-white/8 bg-white/[0.05] text-muted-foreground hover:bg-white/[0.09] hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
