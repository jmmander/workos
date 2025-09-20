import * as React from 'react'
import {
  MoreHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-end', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  disabled,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size,
        }),
        'focus-ring',
        disabled &&
          'bg-secondary-disabled text-secondary-disabled-text border-transparent pointer-events-none',
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <a
      aria-label="Go to previous page"
      aria-disabled={disabled}
      data-slot="pagination-previous"
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size: 'icon',
        }),
        'focus-ring',
        disabled && 'text-secondary-disabled-text pointer-events-none',
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
    </a>
  )
}

function PaginationNext({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <a
      aria-label="Go to next page"
      aria-disabled={disabled}
      data-slot="pagination-next"
      className={cn(
        buttonVariants({
          variant: 'ghost',
          size: 'icon',
        }),
        'focus-ring',
        disabled && 'text-secondary-disabled-text pointer-events-none',
        className
      )}
      {...props}
    >
      <ChevronRightIcon className="size-4" />
    </a>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
