import { useCallback, useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { SearchIcon } from "./SearchIcon"
import { PlusIcon } from "./PlusIcon"
import { ErrorState } from "./ErrorState"
import { LoadingState } from "./LoadingState"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { User, Role, PagedData } from "@/types"
import { formatJoined } from "@/utils/formatters"

interface UsersTableProps {
  users: PagedData<User>
  rolesMap: Record<string, Role>
  loading: boolean
  error: string | null
  query: string
  page: number
  onQueryChange: (query: string) => void
  onPageChange: (page: number) => void
  onDeleteUser: (userId: string) => Promise<void>
}

export function UsersTable({
  users,
  rolesMap,
  loading,
  error,
  query,
  page,
  onQueryChange,
  onPageChange,
  onDeleteUser
}: UsersTableProps) {
  const rows = users.data
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (userToDelete && !isDeleting) {
      setIsDeleting(true)
      try {
        await onDeleteUser(userToDelete.id)
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      } finally {
        setIsDeleting(false)
      }
    }
  }, [onDeleteUser, userToDelete, isDeleting])

  const handleDeleteCancel = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }, [isDeleting])

  const generatePageNumbers = useCallback(() => {
    const totalPages = users.pages
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
      const startPage = Math.max(1, page - 2)
      const endPage = Math.min(totalPages, page + 2)
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }, [users.pages, page])

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="relative w-full">
          <SearchIcon className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search by name..."
            className="pl-7 pr-1"
            value={query}
            onChange={(e) => {
              onPageChange(1)
              onQueryChange(e.target.value)
            }}
          />
        </div>
        <Button size="default" className="w-[110px] h-8" disabled={loading}>
          <PlusIcon/> Add user
        </Button>
      </div>

      <div className={`rounded-lg border-table-inner ${(loading || error) ? 'h-[528px]' : ''}`}>
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="w-[301px]">User</TableHead>
              <TableHead className="w-[277px]">Role</TableHead>
              <TableHead className="w-[236px]">Joined</TableHead>
              <TableHead className="w-[36px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                    <ErrorState message="Unable to load users. Please try again." />
                  </div>
                </TableCell>
              </TableRow>
            ) : loading ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                    <LoadingState message="Loading users..." />
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                    <div className="text-sm text-muted-foreground">No users found</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="w-[301px]">
                    <div className="flex items-center gap-2">
                      <img
                        src={u.photo || `https://i.pravatar.cc/40?u=${u.id}`}
                        alt="avatar"
                        className="size-6 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span>{u.first} {u.last}</span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[277px]">{rolesMap[u.roleId]?.name ?? ""}</TableCell>
                  <TableCell className="w-[236px]">{formatJoined(u.createdAt)}</TableCell>
                  <TableCell className="w-[36px] align-right pl-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Actions">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(u)}>Delete user</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter className="bg-table-fill">
            <TableRow>
              <TableCell colSpan={4} className="py-2.5 px-3 w-full">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        disabled={!users.prev || !!error}
                        onClick={(e) => {
                          e.preventDefault()
                          if (users.prev && !error) onPageChange(users.prev)
                        }}
                      />
                    </PaginationItem>
                    
                    {generatePageNumbers().map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={pageNum === page}
                          disabled={pageNum === page || !!error}
                          onClick={(e) => {
                            e.preventDefault()
                            if (!error && pageNum !== page) onPageChange(pageNum)
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        disabled={!users.next || !!error}
                        onClick={(e) => {
                          e.preventDefault()
                          if (users.next && !error) onPageChange(users.next)
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              Are you sure? The user <span className="dialog-user-name">{userToDelete?.first} {userToDelete?.last}</span> will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} loading={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
