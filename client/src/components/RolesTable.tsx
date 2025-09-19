import { useCallback, useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { PlusIcon } from "./PlusIcon"
import { ErrorState } from "./ErrorState"
import { LoadingState } from "./LoadingState"
import { SearchBar } from "./SearchBar"
import { EditRoleForm } from "./EditRoleForm"
import { TablePagination } from "./TablePagination"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Role, PagedData } from "@/types"

interface RolesTableProps {
  roles: PagedData<Role>
  loading: boolean
  error: string | null
  query: string
  page: number
  onQueryChange: (query: string) => void
  onPageChange: (page: number) => void
  onRoleUpdate?: () => void
}

export function RolesTable({
  roles,
  loading,
  error,
  query,
  page,
  onQueryChange,
  onPageChange,
  onRoleUpdate,
}: RolesTableProps) {
  const rows = roles.data
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)



  const handleEditRole = useCallback((role: Role) => {
    setRoleToEdit(role)
    setEditModalOpen(true)
  }, [])

  const handleCloseEdit = useCallback(() => {
    setEditModalOpen(false)
    setRoleToEdit(null)
  }, [])


  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-2">
        <SearchBar
          query={query}
          placeholder="Search roles..."
          loading={loading}
          onQueryChange={onQueryChange}
          onPageChange={onPageChange}
        />
        <Button size="default" className="w-[110px] h-8" disabled={loading}>
          <PlusIcon/> Add role
        </Button>
      </div>

      <div className={`rounded-lg border-table-inner ${(loading || error) ? 'h-[528px]' : ''}`}>
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="w-[240px]">Name</TableHead>
              <TableHead className="w-[350px]">Description</TableHead>
              <TableHead className="w-[200px]">Created</TableHead>
              <TableHead className="w-[36px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                    <ErrorState message="Unable to load roles. Please try again." />
                  </div>
                </TableCell>
              </TableRow>
            ) : loading ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                    <LoadingState message="Loading roles..." />
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="p-0">
                  <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                    <div className="text-sm text-muted-foreground">No roles found</div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="w-[240px]">
                    <div className="flex items-center gap-2">
                      {role.name}
                      {role.isDefault && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-1.5 py-0 text-[10px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Default
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[350px] max-w-[350px]">
                     <div className="text-sm leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis" title={role.description}>
                       {role.description}
                     </div>
                  </TableCell>
                  <TableCell className="w-[200px]">{new Date(role.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
                  <TableCell className="w-[36px] align-right pl-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Actions">
                          <MoreHorizontalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditRole(role)}>Edit role</DropdownMenuItem>
                        <DropdownMenuItem>Delete role</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter className="bg-table-fill">
            <TableRow>
              <TableCell colSpan={4} className="py-1.5 px-3 w-full">
                <TablePagination
                  data={roles}
                  currentPage={page}
                  error={error}
                  onPageChange={onPageChange}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <EditRoleForm
        role={roleToEdit}
        open={editModalOpen}
        onOpenChange={handleCloseEdit}
        onRoleUpdate={onRoleUpdate}
      />
    </>
  )
}
