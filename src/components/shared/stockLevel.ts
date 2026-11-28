export type StockLevel = 'in-stock' | 'low-stock' | 'out-of-stock'

export function getStockLevel(quantity: number, threshold: number): StockLevel {
  if (quantity <= 0) return 'out-of-stock'
  if (quantity <= threshold) return 'low-stock'
  return 'in-stock'
}
