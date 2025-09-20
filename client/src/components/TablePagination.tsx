import { useCallback } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { PagedData, User, Role } from '@/types'

interface TablePaginationProps {
  data: PagedData<User | Role>
  currentPage: number
  error: string | null
  onPageChange: (page: number) => void
}

// Renders previous/next and a compact set of numbered pages (max 5 visible).
export function TablePagination({
  data,
  currentPage,
  error,
  onPageChange,
}: TablePaginationProps) {
  const generatePageNumbers = useCallback(() => {
    const totalPages = data.pages
    if (totalPages <= 1) return []

    const pages: number[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show current page with context
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, currentPage + 2)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }

    return pages
  }, [data.pages, currentPage])

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            disabled={!data.prev || !!error}
            onClick={(e) => {
              e.preventDefault()
              if (data.prev && !error) onPageChange(data.prev)
            }}
          />
        </PaginationItem>

        {generatePageNumbers().map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href="#"
              isActive={pageNum === currentPage}
              disabled={pageNum === currentPage || !!error}
              onClick={(e) => {
                e.preventDefault()
                if (!error && pageNum !== currentPage) onPageChange(pageNum)
              }}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            disabled={!data.next || !!error}
            onClick={(e) => {
              e.preventDefault()
              if (data.next && !error) onPageChange(data.next)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
