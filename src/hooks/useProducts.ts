import { useQuery } from '@tanstack/react-query'
import { ecommerceRepository } from '@/lib/ecommerce'

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ['products', category ?? 'All'],
    queryFn: async () => {
      const result = await ecommerceRepository.listProducts(category)
      if (result.error) throw result.error
      return result.data
    },
    // The existing storefront keeps its curated fallback catalog until Supabase is connected.
    enabled: Boolean(import.meta.env.VITE_SUPABASE_URL),
    staleTime: 60_000,
  })
}
