import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cx } from './cx'
import { gridTemplate } from './gridTemplate'

export type GridAlign = 'start' | 'center' | 'end'
export type SortDirection = 'asc' | 'desc'

export type GridHeaderColumn = {
  id: string
  label: string
  width: string
  align?: GridAlign
  sortable?: boolean
  sortDirection?: SortDirection | null
  onSort?: () => void
}

type GridHeaderProps = {
  columns: GridHeaderColumn[]
  className?: string
}

const alignClass: Record<GridAlign, string> = {
  start: 'justify-start text-left',
  center: 'justify-center text-center',
  end: 'justify-end text-right',
}

export function GridHeader({ columns, className }: GridHeaderProps) {
  return (
    <div
      role="row"
      className={cx('grid border-b border-grid-divider bg-grid-header', className)}
      style={{ gridTemplateColumns: gridTemplate(columns) }}
    >
      {columns.map((column) => {
        const align = alignClass[column.align ?? 'start']
        const ariaSort = column.sortable
          ? column.sortDirection === 'asc'
            ? 'ascending'
            : column.sortDirection === 'desc'
              ? 'descending'
              : 'none'
          : undefined

        return (
          <div
            key={column.id}
            role="columnheader"
            aria-sort={ariaSort}
            className={cx('flex items-center px-4 py-3', align)}
          >
            {column.sortable ? (
              <button
                type="button"
                onClick={column.onSort}
                disabled={!column.onSort}
                className={cx(
                  'inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground',
                  'rounded-md hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-halo',
                  'disabled:cursor-default disabled:hover:text-muted-foreground',
                )}
              >
                {column.label}
                <SortIndicator direction={column.sortDirection} />
              </button>
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">{column.label}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SortIndicator({ direction }: { direction?: SortDirection | null }) {
  if (direction === 'asc') return <ArrowUp className="h-3.5 w-3.5 text-primary" aria-hidden />
  if (direction === 'desc') return <ArrowDown className="h-3.5 w-3.5 text-primary" aria-hidden />
  return <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
}
