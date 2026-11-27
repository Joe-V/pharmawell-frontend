import { QueryClient } from '@tanstack/react-query'
import { ApiException } from '../types/api'

const NO_RETRY_STATUSES = new Set([400, 401, 403, 404, 409, 429])

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiException && NO_RETRY_STATUSES.has(error.statusCode)) {
          return false
        }
        return failureCount < 1
      },
    },
    mutations: {
      retry: false,
    },
  },
})