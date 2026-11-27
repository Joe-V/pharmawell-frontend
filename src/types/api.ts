export type ApiErrorResponse = {
  message?: string
  errors?: Record<string, string[]>
  title?: string
  detail?: string
  status?: number
}

export type MessageResponse = {
  message: string
}

export type PaginatedData<T> = {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export class ApiException extends Error {
  statusCode: number
  fieldErrors?: Record<string, string[]>

  constructor(
    message: string,
    statusCode = 500,
    fieldErrors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiException'
    this.statusCode = statusCode
    this.fieldErrors = fieldErrors
  }
}