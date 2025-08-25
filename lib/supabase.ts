import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Default placeholder values for build time
const DEFAULT_SUPABASE_URL = 'https://placeholder.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'placeholder-key'

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.SUPABASE_URL || 
                     process.env.NEXT_PUBLIC_SUPABASE_URL || 
                     DEFAULT_SUPABASE_URL
                     
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 
                         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                         DEFAULT_SUPABASE_ANON_KEY
  
  return { supabaseUrl, supabaseAnonKey }
}

// Mock client for development when real credentials are not available
const createMockClient = (): SupabaseClient => {
  return {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: null } }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ 
        data: null, 
        error: { message: 'Please configure your Supabase credentials to enable authentication' } 
      }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: (data: any) => Promise.resolve({ 
        data: null, 
        error: { message: 'Database not configured. Please set up your Supabase credentials.' } 
      }),
      update: (data: any) => ({
        eq: () => Promise.resolve({ 
          data: null, 
          error: { message: 'Database not configured. Please set up your Supabase credentials.' } 
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ 
          data: null, 
          error: { message: 'Database not configured. Please set up your Supabase credentials.' } 
        })
      })
    })
  } as any
}

const createSupabaseClient = (): SupabaseClient => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
  
  // Check if we're using placeholder values
  if (supabaseUrl === DEFAULT_SUPABASE_URL || supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Missing Supabase environment variables in production. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
      )
    }
    
    // In development, use mock client
    console.warn('Supabase: Using offline mode. Configure SUPABASE_URL and SUPABASE_ANON_KEY for full functionality.')
    return createMockClient()
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

let supabaseInstance: SupabaseClient | null = null

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient()
  }
  return supabaseInstance
}

// Create a proxy that defers initialization until first use
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop, receiver) {
    const client = getSupabase()
    const value = client[prop as keyof SupabaseClient]
    return typeof value === 'function' ? value.bind(client) : value
  }
})

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

export type CartItem = {
  id: number
  name: string
  price: number
  image_url: string
  size: string
  quantity: number
}

export type Order = {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  delivery_instructions?: string
  payment_method: string
  total_amount: number
  items: CartItem[]
  order_date: string
  status: string
  created_at?: string
  updated_at?: string
}

export type Seller = {
  id: string
  email: string
  name: string
  created_at: string
}