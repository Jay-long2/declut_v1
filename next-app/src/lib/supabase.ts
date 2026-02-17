import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Optional: Define database types for better autocomplete
export type Database = {
  public: {
    tables: {
      orders: {
        Row: {
          id: string
          order_id: string
          buyer_id: string | null
          customer_email: string
          customer_name: string
          shipping_address: any
          items: any
          subtotal: number
          shipping_fee: number
          tax: number
          total: number
          payment_method: string | null
          payment_status: string
          status: string
          transaction_ref: string | null
          environmental_impact: any
          created_at: string
        }
        Insert: any
        Update: any
      }
      order_items: any
      addresses: any
    }
  }
}