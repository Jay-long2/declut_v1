import { createClient } from "@supabase/supabase-js"

// Optional: Define database types for better autocomplete
export type Database = {
  public: {
    Tables: {  // ✅ Capital T
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

      order_items: {
        Row: any
        Insert: any
        Update: any
      }

      addresses: {
        Row: any
        Insert: any
        Update: any
      }
      products: {
        Row: any
        Insert: any
        Update: any
      }

      product_images: {
        Row: any
        Insert: any
        Update: any
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  )
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
