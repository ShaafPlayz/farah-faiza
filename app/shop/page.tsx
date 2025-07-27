'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { supabase, type Product } from '@/lib/supabase'

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

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
        setProducts(getSampleProducts())
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      setProducts(getSampleProducts())
    } finally {
      setLoading(false)
    }
  }

  function getSampleProducts(): Product[] {
    return [
      {
        id: 1,
        name: "Floral Print Dress",
        description: "Beautiful floral print dress for any occasion",
        price: 4990,
        image_url: "/images/product-1.jpeg",
        image_data: "",
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
        image_url: "/images/product-1.jpeg",
        image_data: "",
        category: "Tops",
        collection: "Professional",
        sizes: ["XS", "S", "M", "L", "XL"],
        created_at: "2023-01-02T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z"
      },
      {
        id: 3,
        name: "Tailored Pants",
        description: "Perfect fit tailored pants",
        price: 3990,
        image_url: "/images/product-1.jpeg",
        image_data: "",
        category: "Bottoms",
        collection: "Professional",
        sizes: ["XS", "S", "M", "L", "XL"],
        created_at: "2023-01-03T00:00:00Z",
        updated_at: "2023-01-03T00:00:00Z"
      },
      {
        id: 4,
        name: "Embroidered Top",
        description: "Handcrafted embroidered top",
        price: 2990,
        image_url: "/images/product-1.jpeg",
        image_data: "",
        category: "Tops",
        collection: "Traditional",
        sizes: ["XS", "S", "M", "L", "XL"],
        created_at: "2023-01-04T00:00:00Z",
        updated_at: "2023-01-04T00:00:00Z"
      }
    ]
  }

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    return product.category.toLowerCase() === filter.toLowerCase()
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
      <main>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Header />
      
      {/* Shop Banner */}
      <section className="shop-banner" style={{backgroundImage: 'url(/images/shop-banner.jpg)'}}>
        <div className="shop-banner-content">
          <h1>OUR COLLECTION</h1>
          <p>Elegance for every occasion</p>
        </div>
      </section>
      
      {/* Shop Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-12 px-[5%]">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 p-5 bg-light">
          <div className="filter-section">
            <h3>Categories</h3>
            <ul className="filter-list">
              <li>
                <button 
                  onClick={() => setFilter('all')}
                  className={`text-left w-full hover:text-secondary ${filter === 'all' ? 'text-secondary' : ''}`}
                >
                  All Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilter('dresses')}
                  className={`text-left w-full hover:text-secondary ${filter === 'dresses' ? 'text-secondary' : ''}`}
                >
                  Dresses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilter('tops')}
                  className={`text-left w-full hover:text-secondary ${filter === 'tops' ? 'text-secondary' : ''}`}
                >
                  Tops
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setFilter('bottoms')}
                  className={`text-left w-full hover:text-secondary ${filter === 'bottoms' ? 'text-secondary' : ''}`}
                >
                  Bottoms
                </button>
              </li>
            </ul>
          </div>
          
          <div className="filter-section">
            <h3>Size</h3>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <a key={size} href="#" className="size-option">
                  {size}
                </a>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Products Grid */}
        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <div className="text-sm text-gray">
              Showing 1-{sortedProducts.length} of {sortedProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-by" className="text-sm">Sort by:</label>
              <select 
                id="sort-by" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-light-gray"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
          </div>
          
          <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray text-lg">No products found.</p>
            </div>
          )}
          
          {/* Pagination */}
          <div className="pagination">
            <a href="#" className="page-link active">1</a>
          </div>
        </main>
      </div>
      
      <Footer />
    </main>
  )
}