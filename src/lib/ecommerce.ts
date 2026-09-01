import { supabase } from '@/integrations/supabase/client'
import type { Json } from '@/integrations/supabase/types'

// The generated Supabase types predate the activated ecommerce schema. Keep this
// boundary typed until the project's type generator is run against the live schema.
const db = supabase as any

export type CatalogProduct = {
  id: string
  name: string
  description: string | null
  price: number
  compare_at_price: number | null
  image_url: string | null
  category_id: string | null
  unit: string
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
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
    let query = db.from('product_catalog').select('*, category:product_categories!category_id(name, slug)').eq('is_active', true).order('created_at', { ascending: false })
    if (category && category !== 'All') query = query.eq('product_categories.name', category)
    const { data, error } = await query
    const products = (data ?? []).map((product: any) => ({
      ...product,
      category: product.category?.name ?? null,
    }))
    return { data: products as CatalogProduct[], error }
  },

  async getProduct(id: string) {
    const { data, error } = await db.from('product_catalog').select('*').eq('id', id).eq('is_active', true).single()
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
