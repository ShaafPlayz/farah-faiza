'use client'

import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import Image from 'next/image'
import styles from './page.module.css'
import { useState, useEffect, useMemo } from 'react'
import ProductCard from './components/ProductCard'

import { supabase, type Product } from '@/lib/supabase'


export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
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
    }
  }
  const filteredProducts = products.filter(product => {
    return 'all'
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  )
  
  return (
    <>
      <Header />
      <main className={styles.main}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Hero Image - Full Width */}
        <div className={styles.heroBackground}>
          <div className={styles.heroBackgroundInner}>
            <div className={styles.heroIcon}>
              <div className={styles.heroArrow}>🢓</div>
            </div>
          </div>
        </div>
        
        {/* Content Overlay */}
        <div className={styles.heroContentOverlay}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              
              {/* Left Content */}
              <div className={styles.heroContent}>
                <div className={styles.heroContentInner}>
                  <h1 className={styles.heroWelcome}>
                    welcome to
                  </h1>
                  <h1 className={styles.heroTitle}>
                    zarab collections
                  </h1>
                  <Link 
                    href="/shop" 
                    className={styles.shopButton}
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>

              {/* Right Content - Shop Now Button */}
            
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className={styles.bestsellers}>
        <div className={styles.bestsellerContainer}>
          <div className={styles.bestsellerHeader}>
            <h2 className={styles.bestsellerTitle}>
              NEW ARRIVALS
            </h2>
          </div>
          
          {/* Product Grid */}
          {/* <div className={`${styles.productsGrid}`}>
            {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div> */}

          <div className={styles.productGrid}>
            {sortedProducts.map((p) => (
              <div key={p.id} className={styles.productCard}>  
              <Link href={`/product/${p.id}`} className={styles.productLink}>             
                  <div className={styles.productImage} key={p.id}>
                    <Image
                          src={p.image_data ?? "/zarablogo.png"}
                          alt='404 Not Found'
                          fill
                        />                                       
                  </div>
                <div className={`product-info ${styles.productInfo}`}>
                  <h3 >{p.name}</h3>
                  <p className={`product-price ${styles.productPrice}`}>Rs. {p.price.toLocaleString()}</p>
                </div>
                </Link>
              </div>
              
            ))}
          </div>
        </div>
      </section>

      {/* Brand Statement Footer */}
      {/* <section className={styles.brandStatement}>
        <div className={styles.brandContainer}>
          <h3 className={styles.brandTitle}>
            A Pakistani Clothing Brand
          </h3>
        </div>
      </section> */}
      
      <Footer />
      </main>
    </>
  )
}
