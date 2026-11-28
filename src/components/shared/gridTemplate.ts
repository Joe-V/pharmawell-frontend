export function gridTemplate(columns: Array<{ width: string }>): string {
  return columns.map((column) => column.width).join(' ')
}
