import { MoreHorizontalIcon } from "lucide-react"
import { SearchIcon } from "./SearchIcon"
import { PlusIcon } from "./PlusIcon"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
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
}

export function UsersTable({
  users,
  rolesMap,
  loading,
  error,
  query,
  page,
  onQueryChange,
  onPageChange
}: UsersTableProps) {
  const rows = users.data
  const totalPages = users.pages

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="relative w-full max-w-lg">
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
        <Button size="sm">
          <PlusIcon/> Add user
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-0"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
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
                <TableCell>{rolesMap[u.roleId]?.name ?? ""}</TableCell>
                <TableCell>{formatJoined(u.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {rows.length === 0 && !loading && (
            <TableCaption>No users found</TableCaption>
          )}
        </Table>
      </div>

      <div className="mt-3">
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              href="#"
              className={users.prev ? undefined : "pointer-events-none opacity-50"}
              onClick={(e) => {
                e.preventDefault()
                if (users.prev) onPageChange(users.prev)
              }}
            />
            <span className="px-2 text-sm text-muted-foreground">
              Page {page} {totalPages ? `of ${totalPages}` : ""}
            </span>
            <PaginationNext
              href="#"
              className={users.next ? undefined : "pointer-events-none opacity-50"}
              onClick={(e) => {
                e.preventDefault()
                if (users.next) onPageChange(users.next)
              }}
            />
          </PaginationContent>
        </Pagination>
      </div>
      {loading && (
        <div className="mt-2 text-sm text-muted-foreground">Loading…</div>
      )}
      {error && (
        <div className="mt-2 text-sm text-destructive">{error}</div>
      )}
    </>
  )
}
