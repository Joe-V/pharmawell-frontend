export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.products.all, 'list', params ?? {}] as const,
    detail: (productId: string | number) =>
      [...queryKeys.products.all, 'detail', String(productId)] as const,
  },
  orders: {
    all: ['orders'] as const,
    myList: (params?: Record<string, unknown>) =>
      [...queryKeys.orders.all, 'my', params ?? {}] as const,
    detail: (orderId: string | number) =>
      [...queryKeys.orders.all, 'detail', String(orderId)] as const,
  },
  admin: {
    all: ['admin'] as const,
    summary: () => [...queryKeys.admin.all, 'summary'] as const,
    orders: (params?: Record<string, unknown>) =>
      [...queryKeys.admin.all, 'orders', params ?? {}] as const,
  },
}