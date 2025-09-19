import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap hover:brightness-95 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 border aria-invalid:ring-destructive/20 aria-invalid:border-destructive focus-ring transition-all duration-150",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary-hover text-primary-foreground border-button-border disabled:bg-primary-disabled disabled:text-primary-foreground disabled:border-primary-disabled active:brightness-90",
        destructive:
          "text-destructive-foreground bg-destructive border-destructive-border disabled:opacity-50 disabled:pointer-events-none active:brightness-90",
        outline:
        "bg-transparent text-secondary-foreground border-secondary-border hover:bg-secondary-disabled disabled:bg-secondary-disabled disabled:text-secondary-disabled-text disabled:border-secondary-disabled active:bg-gray-a3",
        ghost:
          "bg-transparent border-transparent text-secondary-foreground hover:bg-ghost-hover hover:brightness-100 data-[state=open]:bg-ghost-hover active:bg-gray-a3",
        link: "text-primary underline-offset-4 hover:underline active:brightness-90",
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
