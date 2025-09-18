import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-default-button",
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
        sm: "w-[110px] h-8 px-3 py-2 rounded font-medium text-sm leading-5 text-center",
        icon: "size-6 rounded-full p-0 text-icon-button border-0",
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
