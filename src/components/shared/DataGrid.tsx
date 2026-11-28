import type { ReactNode } from 'react'
import { cx } from './cx'
import { gridTemplate } from './gridTemplate'
import { GridHeader, type GridHeaderColumn } from './GridHeader'

export type GridColumn<T> = GridHeaderColumn & {
  render: (row: T, rowIndex: number) => ReactNode
}

export type DataGridProps<T> = {
  columns: GridColumn<T>[]
  data: T[]
  getRowKey: (row: T, index: number) => string | number
  isLoading?: boolean
  skeletonRows?: number
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: ReactNode
  minWidth?: string
  onRowClick?: (row: T) => void
  className?: string
  caption?: string
}

export function DataGrid<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  skeletonRows = 6,
  emptyTitle = 'Nothing to show',
  emptyDescription,
  emptyIcon,
  minWidth = '56rem',
  onRowClick,
  className,
  caption,
}: DataGridProps<T>) {
  const template = gridTemplate(columns)
  const showEmpty = !isLoading && data.length === 0

  return (
    <div className={cx('overflow-hidden rounded-2xl border border-border bg-card', className)}>
      <div className="overflow-x-auto">
        <div role="table" aria-busy={isLoading} aria-label={caption} style={{ minWidth }}>
          <GridHeader columns={columns} />

          {isLoading &&
            Array.from({ length: skeletonRows }, (_, rowIndex) => (
              <div
                key={`skeleton-${rowIndex}`}
                role="row"
                className="grid border-b border-grid-divider last:border-b-0"
                style={{ gridTemplateColumns: template }}
              >
                {columns.map((column, columnIndex) => (
                  <div key={column.id} role="cell" className="px-4 py-3.5">
                    <div
                      className={cx(
                        'h-4 animate-pulse rounded-md bg-muted',
                        columnIndex % 2 === 0 ? 'w-3/4' : 'w-1/2',
                      )}
                    />
                  </div>
                ))}
              </div>
            ))}

          {!isLoading &&
            data.map((row, rowIndex) => (
              <div
                key={getRowKey(row, rowIndex)}
                role="row"
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cx(
                  'grid border-b border-grid-divider last:border-b-0',
                  'transition-colors hover:bg-grid-row-hover',
                  onRowClick ? 'cursor-pointer' : '',
                )}
                style={{ gridTemplateColumns: template }}
              >
                {columns.map((column) => (
                  <div
                    key={column.id}
                    role="cell"
                    className={cx(
                      'flex min-w-0 items-center px-4 py-3.5 text-sm text-foreground',
                      column.align === 'center'
                        ? 'justify-center text-center'
                        : column.align === 'end'
                          ? 'justify-end text-right'
                          : 'justify-start text-left',
                    )}
                  >
                    {column.render(row, rowIndex)}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

      {showEmpty && (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          {emptyIcon ? <div className="text-muted-foreground">{emptyIcon}</div> : null}
          <p className="text-sm font-semibold text-foreground">{emptyTitle}</p>
          {emptyDescription ? (
            <p className="max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
          ) : null}
        </div>
      )}
    </div>
  )
}
