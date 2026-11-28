import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { cx } from './cx'

type PageToken = number | 'start-ellipsis' | 'end-ellipsis'

export type PaginationProps = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  itemLabel?: string
}

const DEFAULT_PAGE_SIZES = [10, 25, 50]

export function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  itemLabel = 'items',
}: PaginationProps) {
  const safePageSize = pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZES[0]
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / safePageSize)
  const currentPage = totalPages === 0 ? 0 : Math.min(Math.max(page, 1), totalPages)
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * safePageSize + 1
  const rangeEnd = totalCount === 0 ? 0 : Math.min(currentPage * safePageSize, totalCount)
  const pages = totalPages > 0 ? getPageTokens(currentPage, totalPages) : []

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {rangeStart.toLocaleString('en-US')}–{rangeEnd.toLocaleString('en-US')} of{' '}
        {totalCount.toLocaleString('en-US')}
        {itemLabel ? ` ${itemLabel}` : ''}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>

          {pages.map((token) =>
            typeof token === 'number' ? (
              <button
                key={token}
                type="button"
                aria-label={`Page ${token}`}
                aria-current={token === currentPage ? 'page' : undefined}
                onClick={() => onPageChange(token)}
                className={cx(
                  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus-halo',
                  token === currentPage
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {token}
              </button>
            ) : (
              <span key={token} aria-hidden className="px-1 text-sm text-subtle-foreground">
                …
              </span>
            ),
          )}

          <Button
            variant="secondary"
            size="sm"
            aria-label="Next page"
            disabled={totalPages === 0 || currentPage >= totalPages}
            rightIcon={<ChevronRight className="h-4 w-4" />}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </nav>

        {onPageSizeChange ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
            <div className="w-20">
              <Select
                aria-label="Rows per page"
                value={String(safePageSize)}
                options={pageSizeOptions.map((size) => ({
                  label: String(size),
                  value: String(size),
                }))}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function getPageTokens(current: number, total: number): PageToken[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'end-ellipsis', total]
  }

  if (current >= total - 3) {
    return [1, 'start-ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, 'start-ellipsis', current - 1, current, current + 1, 'end-ellipsis', total]
}
