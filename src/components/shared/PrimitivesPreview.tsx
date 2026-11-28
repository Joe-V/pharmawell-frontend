import { useState } from 'react'
import { Package, Pencil } from 'lucide-react'
import { Button } from '../ui/Button'
import { DataGrid, type GridColumn } from './DataGrid'
import { Pagination } from './Pagination'
import { PrescriptionBadge } from './PrescriptionBadge'
import { Sheet } from './Sheet'
import { StockBadge } from './StockBadge'

type PreviewRow = {
  id: string
  name: string
  ingredient: string
  quantity: number
  threshold: number
  requiresPrescription: boolean
}

const rows: PreviewRow[] = [
  { id: '1', name: 'Panadol Extra', ingredient: 'Paracetamol', quantity: 50, threshold: 20, requiresPrescription: false },
  { id: '2', name: 'Augmentin 1g', ingredient: 'Amoxicillin', quantity: 12, threshold: 50, requiresPrescription: true },
  { id: '3', name: 'Brufen 400mg', ingredient: 'Ibuprofen', quantity: 0, threshold: 50, requiresPrescription: false },
]

const columns: GridColumn<PreviewRow>[] = [
  {
    id: 'name',
    label: 'Product',
    width: 'minmax(12rem, 1.4fr)',
    sortable: true,
    sortDirection: 'asc',
    render: (row) => (
      <div>
        <p className="font-semibold">{row.name}</p>
        <p className="text-xs text-muted-foreground">{row.ingredient}</p>
      </div>
    ),
  },
  {
    id: 'stock',
    label: 'Stock',
    width: 'minmax(9rem, 1fr)',
    render: (row) => <StockBadge quantity={row.quantity} threshold={row.threshold} showCount />,
  },
  {
    id: 'rx',
    label: 'Prescription',
    width: 'minmax(8rem, 0.8fr)',
    render: (row) => <PrescriptionBadge requiresPrescription={row.requiresPrescription} />,
  },
  {
    id: 'categoryRx',
    label: 'Requires Prescription',
    width: 'minmax(8rem, 0.7fr)',
    align: 'center',
    render: (row) => (
      <PrescriptionBadge requiresPrescription={row.requiresPrescription} variant="category" />
    ),
  },
]

export function PrimitivesPreview() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Shared primitives</h1>
            <p className="text-sm text-muted-foreground">Data grid, pagination, sheet, and badges.</p>
          </div>
          <Button leftIcon={<Package className="h-4 w-4" />} onClick={() => setSheetOpen(true)}>
            Open sheet
          </Button>
        </div>

        <DataGrid columns={columns} data={rows} getRowKey={(row) => row.id} caption="Preview products" />
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={48}
          itemLabel="products"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Add Product"
        subtitle="Create a new product in your catalog."
        icon={<Pencil className="h-4 w-4" />}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setSheetOpen(false)}>Save Product</Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Scrollable body with a sticky footer. Press Escape or click the backdrop to close.
        </p>
      </Sheet>
    </main>
  )
}
