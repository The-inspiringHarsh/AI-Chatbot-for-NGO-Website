import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-foundation-teal/60 disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "bg-foundation-teal text-ink shadow-glow hover:bg-cyan-300",
          variant === "secondary" &&
            "border border-white/12 bg-white/10 text-white hover:bg-white/15",
          variant === "ghost" && "text-slate-200 hover:bg-white/10",
          variant === "danger" && "bg-red-500/16 text-red-100 hover:bg-red-500/24",
          size === "sm" && "h-9 px-3 text-sm",
          size === "md" && "h-11 px-4 text-sm",
          size === "icon" && "h-10 w-10",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
