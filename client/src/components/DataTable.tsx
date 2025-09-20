import { MoreHorizontalIcon } from 'lucide-react'
import { ErrorState } from './ErrorState'
import { LoadingState } from './LoadingState'
import { TablePagination } from './TablePagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Role, User, PagedData } from '@/types'

type TableColumn = {
  key: string
  header: string
  width: string
  render: (item: User | Role, rolesMap?: Record<string, Role>) => React.ReactNode
}

type TableAction = {
  label: string
  handler: (item: User | Role) => void
}

interface DataTableProps {
  data: PagedData<User | Role>
  columns: TableColumn[]
  actions: TableAction[]
  loading: boolean
  error: string | null
  page: number
  onPageChange: (page: number) => void
  rolesMap?: Record<string, Role>
  emptyMessage?: string
  loadingMessage?: string
  errorMessage?: string
}

export function DataTable({
  data,
  columns,
  actions,
  loading,
  error,
  page,
  onPageChange,
  rolesMap,
  emptyMessage = 'No data found',
  loadingMessage = 'Loading...',
  errorMessage = 'Unable to load data. Please try again.',
}: DataTableProps) {
  const rows = data.data

  return (
    <div
      className={`rounded-lg border-table-inner ${loading || error ? 'h-[528px]' : ''}`}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-table-header-bg">
            {columns.map((column) => (
              <TableHead key={column.key} className={column.width}>
                {column.header}
              </TableHead>
            ))}
            <TableHead className="w-[36px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="p-0">
                <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                  <ErrorState message={errorMessage} />
                </div>
              </TableCell>
            </TableRow>
          ) : loading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="p-0">
                <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                  <LoadingState message={loadingMessage} />
                </div>
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="p-0">
                <div className="h-[calc(528px-2.75rem-2.75rem)] flex items-center justify-center">
                  <div className="text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item) => (
              <TableRow key={item.id} className="table-row-hover">
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.width}>
                    {column.render(item, rolesMap)}
                  </TableCell>
                ))}
                <TableCell className="w-[36px] align-right pl-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Actions">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action) => (
                        <DropdownMenuItem
                          key={action.label}
                          onClick={() => action.handler(item)}
                        >
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter className="bg-table-fill">
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="py-1.5 px-3 w-full"
            >
              <TablePagination
                data={data}
                currentPage={page}
                error={error}
                onPageChange={onPageChange}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
