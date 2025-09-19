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
  onQueryChange,
  onPageChange,
  onDeleteUser
}: UsersTableProps) {
  const rows = users.data
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleDeleteClick = useCallback((user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (userToDelete) {
      await onDeleteUser(userToDelete.id)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }, [onDeleteUser, userToDelete])

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }, [])

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
                    <PaginationPrevious
                      href="#"
                      disabled={!users.prev || !!error || loading}
                      onClick={(e) => {
                        e.preventDefault()
                        if (users.prev && !error && !loading) onPageChange(users.prev)
                      }}

                    />
                    <PaginationNext
                      href="#"
                      disabled={!users.next || !!error || loading}
                      onClick={(e) => {
                        e.preventDefault()
                        if (users.next && !error && !loading) onPageChange(users.next)
                      }}
                    />
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
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete user
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
