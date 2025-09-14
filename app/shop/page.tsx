'use client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { supabase, type Product } from '@/lib/supabase'
import styles from './page.module.css'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedSize, setSelectedSize] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const categories = useMemo(() => [
    { key: 'all', label: 'All' },
    { key: 'dresses', label: 'Dresses' },
    { key: 'tops', label: 'Tops' },
    { key: 'bottoms', label: 'Bottoms' }
  ], [])
  // const prodSizes = useMemo(() => [
  //   { key: 'all', label: 'All' },
  //   { key: 'XS', label: ''}
  // ])

  useEffect(() => {
    fetchProducts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        // Fallback to sample data if database is not ready
        setProducts([])
      } else {
        setProducts(data || [])
        // setProducts(getSampleProducts()) // Sample Testing Data
      }
    } catch (error) {
      console.error('Error:', error)
      setProducts(getSampleProducts())
    } finally {
      setLoading(false)
    }
  }

  function getSampleProducts(): Product[] {
    const defaultImages = ["/zarablogo.png"]
    return [
      {
        id: 1,
        name: "Floral Print Dress",
        description: "Beautiful floral print dress for any occasion",
        price: 4990,
        image_urls: defaultImages,
        image_data_array: [],
        category: "Dresses",
        collection: "Summer Collection",
        sizes: ["XS", "S", "M", "L", "XL"],
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      },
      {
        id: 2,
        name: "Silk Blouse",
        description: "Elegant silk blouse for professional wear",
        price: 3490,
        image_urls: defaultImages,
        image_data_array: [],
        category: "Tops",
        collection: "Professional",
        sizes: ["XS", "S", "M", "L"],
        created_at: "2023-01-02T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z"
      },
      {
        id: 3,
        name: "Tailored Pants",
        description: "Perfect fit tailored pants",
        price: 3990,
        image_urls: defaultImages,
        image_data_array: [],
        category: "Bottoms",
        collection: "Professional",
        sizes: ["XS", "S", "XL"],
        created_at: "2023-01-03T00:00:00Z",
        updated_at: "2023-01-03T00:00:00Z"
      },
      {
        id: 4,
        name: "Embroidered Top",
        description: "Handcrafted embroidered top",
        price: 2990,
        image_urls: defaultImages,
        image_data_array: [],
        category: "Tops",
        collection: "Traditional",
        sizes: ["XS"],
        created_at: "2023-01-04T00:00:00Z",
        updated_at: "2023-01-04T00:00:00Z"
      }
    ]
  }

  const filteredProducts = products.filter(product => {
    const categoryStr = (product?.category || '').toString().toLowerCase()
    const matchedCategory = filter === 'all' || categoryStr === filter.toLowerCase()

    const sizesArr = Array.isArray(product?.sizes) ? product.sizes : []
    const matchedSizes = selectedSize === 'all' || sizesArr.includes(selectedSize)

    return matchedSizes && matchedCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'popular':
        return b.id - a.id
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  if (loading) {
    return (
      <main className={styles.main}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <Header />

      {/* Vibrant hero */}
      <section className={styles.hero}> 
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Shop The Collection</h1>
          <p className={styles.heroTagline}>Fresh drops, handcrafted details & seasonal colors.</p>
          <div className={styles.chipRow} aria-label="Quick category filters">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`${styles.chip} ${filter === cat.key ? styles.chipActive : ''}`}
              >{cat.label}</button>
            ))}
          </div>
          <div className={styles.chipRow} aria-label="Quick Size filters" style={{ marginTop: '1rem' }}>
            {['XS','S','M','L','XL', 'all'].map(size => (
                <button 
                key={size} 
                onClick={() => setSelectedSize(size)}
                className={`${styles.chip} ${selectedSize === size ? styles.chipActive : ''}`} 
                aria-label={`Filter size ${size}`}>{size}</button>
              ))}
          </div>
        </div>
        <div className={styles.heroBackdrop} aria-hidden="true" />
      </section>

      {/* Main content */}
      <div className={styles.shell}>
        {/* Mobile filter toggle */}
        {/* <div className={styles.mobileFilterToggle}>
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={styles.filterToggleBtn}
            aria-expanded={filtersOpen}
          >
            <span>Filters</span>
            <svg 
              className={`${styles.filterIcon} ${filtersOpen ? styles.filterIconOpen : ''}`}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
            >
              <path d="M3 7H21L19 9H5L3 7Z" fill="currentColor"/>
              <path d="M6 12H18L16 14H8L6 12Z" fill="currentColor"/>
              <path d="M9 17H15L13 19H11L9 17Z" fill="currentColor"/>
            </svg>
          </button>
        </div> */}

        <aside className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`} aria-label="Filters" >
          {/* <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Categories</h3>
            <ul className={styles.verticalList}>
              {categories.map(cat => (
                <li key={cat.key}>
                  <button
                    onClick={() => setFilter(cat.key)}
                    className={`${styles.filterButton} ${filter === cat.key ? styles.filterButtonActive : ''}`}
                  >{cat.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Size</h3>
            <div className={styles.sizeGrid}>
              {['XS','S','M','L','XL', 'all'].map(size => (
                <button key={size} className={styles.sizeBtn} onClick={() => setSelectedSize(size)} aria-label={`Filter size ${size}`}>{size}</button>
              ))}
            </div>
          </div> */}
        </aside>

        <section className={styles.productsArea}>
          <div className={styles.toolbar}>
            <div className={styles.productCount}>Showing {sortedProducts.length} product{sortedProducts.length!==1 && 's'}</div>
            <div className={styles.sortContainer}>
              <label htmlFor="sort-by" className={styles.sortLabel}>Sort</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e)=>setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
          </div>
          <div className={`${styles.productsGrid}`}>
            {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {sortedProducts.length === 0 && (
            <div className={styles.noProducts}>
              <p className={styles.noProductsText}>No products found.</p>
            </div>
          )}
          <nav className={styles.pagination} aria-label="Pagination">
            <button className={`${styles.pageLink} ${styles.pageLinkActive}`}>1</button>
          </nav>
        </section>
      </div>

      <Footer />
    </main>
  )
}
