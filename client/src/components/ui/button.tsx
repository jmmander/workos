import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:brightness-95 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-[var(--color-primary-hover)] text-primary-foreground border-default-button disabled:bg-[var(--color-primary-disabled)] disabled:text-primary-foreground disabled:border-[var(--color-primary-disabled)]",
        destructive:
          "text-destructive-soft-foreground bg-destructive-soft border-destructive-soft-border disabled:opacity-50 disabled:pointer-events-none",
        outline:
        "bg-transparent text-secondary-foreground border-secondary-border hover:bg-secondary-disabled disabled:bg-secondary-disabled disabled:text-secondary-disabled-text disabled:border-secondary-disabled",
        ghost:
          "bg-transparent border-transparent text-secondary-foreground hover:bg-ghost-hover hover:brightness-100 data-[state=open]:bg-ghost-hover",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        compact: "h-6 px-2 rounded-[3px] text-xs leading-4 font-medium text-center",
        default: "px-3 py-2 rounded font-medium text-sm leading-5 text-center h-8",
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
  loading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled || loading

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Button, buttonVariants }
