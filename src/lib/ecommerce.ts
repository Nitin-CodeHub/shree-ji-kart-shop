import { supabase } from '@/integrations/supabase/client'
import type { Database, Json } from '@/integrations/supabase/types'

export type CatalogProduct = Database['public']['Tables']['products']['Row'] & {
  image_url?: string | null
  category?: string | null
  unit?: string | null
  stock_quantity?: number | null
}

export type CheckoutAddress = {
  name: string
  phone: string
  address: string
  pincode: string
}

export type CheckoutLine = {
  productId: string | number
  quantity: number
}

/** Data-access boundary. Queries are intentionally isolated so UI components can switch to the expanded schema without rewrites. */
export const ecommerceRepository = {
  async listProducts(category?: string) {
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (category && category !== 'All') query = query.ilike('description', `%${category}%`)
    const { data, error } = await query
    return { data: (data ?? []) as CatalogProduct[], error }
  },

  async getProduct(id: number) {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    return { data: data as CatalogProduct | null, error }
  },

  async listOrders(userId: string) {
    return supabase.from('orders').select('id,total_amount,items,status,created_at,customer_name,customer_phone,customer_address,customer_pincode').eq('user_id', userId).order('created_at', { ascending: false })
  },

  async createOrder(userId: string, address: CheckoutAddress, lines: CheckoutLine[], total: number) {
    const items: Json = lines.map((line) => ({ product_id: String(line.productId), quantity: line.quantity }))
    return supabase.from('orders').insert({
      user_id: userId,
      customer_name: address.name,
      customer_phone: address.phone,
      customer_address: address.address,
      customer_pincode: address.pincode,
      items,
      total_amount: total,
      status: 'pending',
    }).select('id').single()
  },

  async updateOrderStatus(orderId: string, status: 'pending' | 'confirmed' | 'delivered' | 'cancelled') {
    return supabase.from('orders').update({ status }).eq('id', orderId)
  },
}

export const checkoutRules = {
  maxQuantityPerLine: 99,
  isValidQuantity: (quantity: number) => Number.isInteger(quantity) && quantity > 0 && quantity <= 99,
  isValidTotal: (total: number) => Number.isFinite(total) && total >= 0,
}
