"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

const DEFAULT_PAGE_SIZE = 10

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  /** Total number of pages (enables server-side pagination) */
  pageCount?: number
  /** Current page index (0-based, for server-side pagination) */
  page?: number
  /** Callback when page changes (0-based index) */
  onPageChange?: (page: number) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  sorting: externalSorting,
  onSortingChange,
  pageCount: externalPageCount,
  page: externalPage,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const isServerSide = externalPageCount !== undefined

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(!isServerSide && {
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(isServerSide && {
      manualPagination: true,
      pageCount: externalPageCount,
      onPaginationChange: (updater) => {
        if (onPageChange) {
          const current: PaginationState = {
            pageIndex: externalPage ?? 0,
            pageSize: DEFAULT_PAGE_SIZE,
          }
          const next =
            typeof updater === "function" ? updater(current) : updater
          onPageChange(next.pageIndex)
        }
      },
    }),
    ...(externalSorting !== undefined && {
      onSortingChange: (updater) => {
        if (onSortingChange) {
          const next =
            typeof updater === "function" ? updater(externalSorting) : updater
          onSortingChange(next)
        }
      },
    }),
    state: {
      ...(externalSorting !== undefined && { sorting: externalSorting }),
      ...(isServerSide && {
        pagination: {
          pageIndex: externalPage ?? 0,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      }),
    },
    initialState: {
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
    },
  })

  return (
    <div data-testid="data-table" className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
