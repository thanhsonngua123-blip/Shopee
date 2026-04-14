import { purchaseStatus } from './purchase'
import { PurchaseListStatus } from '@/types/purchase.type'

export const queryKeys = {
  profile: ['profile'] as const,
  categories: ['categories'] as const,
  products: (params?: Record<string, string | undefined>) => ['products', params ?? {}] as const,
  product: (id: string) => ['product', id] as const,
  purchases: (status: PurchaseListStatus) => ['purchases', { status }] as const,
  purchasesInCart: () => ['purchases', { status: purchaseStatus.inCart }] as const
}
