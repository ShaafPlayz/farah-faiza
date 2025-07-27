import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  image_data?: string // Base64 encoded image data
  category: string
  collection?: string
  sizes: string[]
  created_at: string
  updated_at: string
}

export type Seller = {
  id: string
  email: string
  name: string
  created_at: string
}