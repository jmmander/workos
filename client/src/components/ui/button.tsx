import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",
        destructive:
          "text-destructive-soft-foreground bg-destructive-soft border-destructive-soft-border",
        outline:
        "bg-secondary text-secondary-foreground border-secondary-border shadow-xs hover:bg-secondary disabled:bg-secondary-disabled disabled:text-secondary-disabled-text",
        ghost:
          "bg-transparent hover:bg-ghost-hover",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-3 py-2 rounded-[4px]",
        sm: "px-2 py-1 rounded-[3px]",
        icon: "size-6 rounded-full p-0 text-[#0007139F]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
