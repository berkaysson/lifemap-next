import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Tooltip from "@mui/material/Tooltip";

const badgeVariants = cva(
  "inline-flex items-center rounded-full max-w-[240px] truncate border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-back hover:brightness-110",
        secondary:
          "border-transparent bg-secondary text-fore hover:brightness-110",
        destructive:
          "border-transparent bg-error text-fore hover:brightness-110",
        outline: "text-fore",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  tooltipText?: string;
}

function Badge({ className, variant, tooltipText, ...props }: BadgeProps) {
  const badgeContent = (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );

  return tooltipText ? (
    <Tooltip title={tooltipText} placement="bottom" arrow>
      {badgeContent}
    </Tooltip>
  ) : (
    badgeContent
  );
}

export { Badge, badgeVariants };
