'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, type Product } from '@/lib/supabase'
import ProductForm from './ProductForm'
import ProductList from './ProductList'
import OrderList from './OrderList'
import styles from './Dashboard.module.css'

interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  size: string
  quantity: number
}

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  delivery_instructions: string
  payment_method: string
  total_amount: number
  items: CartItem[]
  order_date: string
  status: string
}

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        // Fallback to localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        setOrders(localOrders)
      } else {
        setOrders(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      setOrders(localOrders)
    } finally {
      setOrdersLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  function handleProductSaved() {
    fetchProducts()
    setEditingProduct(null)
  }

  function handleEditProduct(product: Product) {
    setEditingProduct(product)
    setActiveTab('add')
  }

  async function handleDeleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product')
      } else {
        fetchProducts()
      }
    }
  }

  async function handleDeleteOrder(id: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting order from database:', error)
        // Fallback: remove from localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        const updatedOrders = localOrders.filter((order: Order) => order.id !== id)
        localStorage.setItem('orders', JSON.stringify(updatedOrders))
        setOrders(updatedOrders)
      } else {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback: remove from localStorage
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updatedOrders = localOrders.filter((order: Order) => order.id !== id)
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      setOrders(updatedOrders)
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        console.error('Error updating order status:', error)
        // Fallback: update localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        const updatedOrders = localOrders.map((order: Order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
        localStorage.setItem('orders', JSON.stringify(updatedOrders))
        setOrders(updatedOrders)
      } else {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error:', error)
      // Fallback: update localStorage
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const updatedOrders = localOrders.map((order: Order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      setOrders(updatedOrders)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <h1>Zarab Collections</h1>
              <p>Admin Dashboard</p>
            </div>
            <div className={styles.userSection}>
              <span>Welcome, {user.email}</span>
              <Link href="/" className={styles.homeButton}>
                ← Back to Homepage
              </Link>
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navigationContainer}>
          <div className={styles.navigationTabs}>
            <button
              onClick={() => {
                setActiveTab('products')
                setEditingProduct(null)
              }}
              className={`${styles.tabButton} ${
                activeTab === 'products' ? styles.active : styles.inactive
              }`}
            >
              Products
            </button>
            <button
              onClick={() => {
                setActiveTab('orders')
                setEditingProduct(null)
              }}
              className={`${styles.tabButton} ${
                activeTab === 'orders' ? styles.active : styles.inactive
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`${styles.tabButton} ${
                activeTab === 'add' ? styles.active : styles.inactive
              }`}
            >
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          {activeTab === 'products' && (
            <ProductList
              products={products}
              loading={loading}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
          {activeTab === 'orders' && (
            <OrderList
              orders={orders}
              loading={ordersLoading}
              onDelete={handleDeleteOrder}
              onStatusChange={handleStatusChange}
            />
          )}
          {activeTab === 'add' && (
            <ProductForm
              product={editingProduct}
              onSave={handleProductSaved}
              onCancel={() => {
                setEditingProduct(null)
                setActiveTab('products')
              }}
            />
          )}
        </div>
      </main>
    </div>
  )
}