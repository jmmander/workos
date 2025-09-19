import { useCallback, useState } from "react"
import { MoreHorizontalIcon, CheckCircleIcon } from "lucide-react"
import { PlusIcon } from "./PlusIcon"
import { ErrorState } from "./ErrorState"
import { LoadingState } from "./LoadingState"
import { SearchBar } from "./SearchBar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)
  const [editingName, setEditingName] = useState<string>("")
  const [editingDescription, setEditingDescription] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const toggleRowExpanded = useCallback((roleId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(roleId)) {
        newSet.delete(roleId)
      } else {
        newSet.add(roleId)
      }
      return newSet
    })
  }, [])

  const truncateDescription = useCallback((description: string, roleId: string) => {
    const isExpanded = expandedRows.has(roleId)
    const maxLength = 100

    if (description.length <= maxLength) {
      return description
    }

    if (isExpanded) {
      return (
        <span>
          {description}{' '}
          <button 
            onClick={() => toggleRowExpanded(roleId)}
            className="text-blue-600 hover:text-blue-800 text-xs underline"
          >
            Show less
          </button>
        </span>
      )
    }

    return (
      <span>
        {description.slice(0, maxLength)}...{' '}
        <button 
          onClick={() => toggleRowExpanded(roleId)}
          className="text-blue-600 hover:text-blue-800 text-xs underline"
        >
          Show more
        </button>
      </span>
    )
  }, [expandedRows, toggleRowExpanded])

  const handleEditRole = useCallback((role: Role) => {
    setRoleToEdit(role)
    setEditingName(role.name)
    setEditingDescription(role.description)
    setEditModalOpen(true)
  }, [])

  const handleSaveRole = useCallback(async () => {
    if (!roleToEdit || !editingName.trim() || isSaving) {
      return
    }
    
    setIsSaving(true)
    try {
      const response = await fetch(`http://localhost:3002/roles/${roleToEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingName.trim(),
          description: editingDescription.trim(),
          isDefault: roleToEdit.isDefault // Keep existing isDefault value
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Update failed: ${response.status}`)
      }

      // Success - close modal and refresh data
      setEditModalOpen(false)
      setRoleToEdit(null)
      setEditingName("")
      setEditingDescription("")
      
      // Trigger data refresh if callback provided
      if (onRoleUpdate) {
        onRoleUpdate()
      }
    } catch (error: any) {
      console.error("Failed to update role:", error)
      // TODO: Show error toast/message to user
      alert(error.message || "Failed to update role")
    } finally {
      setIsSaving(false)
    }
  }, [roleToEdit, editingName, editingDescription, isSaving, onRoleUpdate])

  const handleCancelEdit = useCallback(() => {
    setEditModalOpen(false)
    setRoleToEdit(null)
    setEditingName("")
    setEditingDescription("")
  }, [])

  const generatePageNumbers = useCallback(() => {
    const totalPages = roles.pages
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
  }, [roles.pages, page])

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
                  <TableCell className="w-[350px] max-w-[350px] align-top">
                    <div className="text-xs leading-relaxed whitespace-normal break-words">
                      {truncateDescription(role.description, role.id)}
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
              <TableCell colSpan={4} className="py-2.5 px-3 w-full">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        disabled={!roles.prev || !!error}
                        onClick={(e) => {
                          e.preventDefault()
                          if (roles.prev && !error) onPageChange(roles.prev)
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
                        disabled={!roles.next || !!error}
                        onClick={(e) => {
                          e.preventDefault()
                          if (roles.next && !error) onPageChange(roles.next)
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

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edit role</DialogTitle>
            <DialogDescription>
              Update the role name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="role-name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="role-name"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div>
              <label htmlFor="role-description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="role-description"
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
                placeholder="Enter role description"
                className="w-full min-h-[100px] px-3 py-2 border border-gray-a3 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole} loading={isSaving} disabled={!editingName.trim()}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
