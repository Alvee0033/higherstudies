import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.45)] active:scale-[0.98]",
        brand:
          "bg-[#5D3FD3] text-white hover:bg-[#4E34B5] shadow-2xs active:scale-[0.98]",
        "brand-outline":
          "border border-[#5D3FD3] text-[#5D3FD3] hover:bg-[#5D3FD3] hover:text-white transition-colors active:scale-[0.98]",
        "indigo-outline":
          "border border-indigo-200 bg-white hover:bg-indigo-50 text-[#4F46E5] shadow-2xs active:scale-[0.98]",
        secondary:
          "bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] active:scale-[0.98]",
        outline:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-[0.98]",
        ghost:
          "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
        white:
          "bg-white text-slate-800 hover:bg-slate-50 shadow-md",
      },
      size: {
        xs: "h-7 px-2.5 text-[11px]",
        sm: "h-8 px-3.5 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
      },
      rounded: {
        full: "rounded-full",
        xl: "rounded-xl",
        lg: "rounded-lg",
        md: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "full",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
