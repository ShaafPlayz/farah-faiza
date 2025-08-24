'use client'

import { useState, useEffect } from 'react'
import { supabase, type Product } from '@/lib/supabase'
import ProductForm from './ProductForm'
import ProductList from './ProductList'
import styles from './Dashboard.module.css'

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
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