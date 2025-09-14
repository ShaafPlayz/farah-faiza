'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabase, type Product } from '@/lib/supabase'
import styles from './page.module.css'

interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  size: string
  quantity: number
}

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const productId = Number(params.id)
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchProduct() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        setProduct(getSampleProduct(productId))
      } else {
        setProduct(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setProduct(getSampleProduct(productId))
    } finally {
      setLoading(false)
    }
  }

  function getSampleProduct(id: number): Product {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Floral Print Dress",
        description: "Beautiful floral print dress perfect for any occasion. Made with high-quality fabric that ensures comfort and durability. Features a flattering silhouette that complements all body types.",
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
        description: "Elegant silk blouse for professional wear. Crafted from premium silk fabric with attention to detail. Perfect for office wear or formal occasions.",
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
        description: "Perfect fit tailored pants that offer both style and comfort. Made with stretch fabric for all-day comfort while maintaining a professional look.",
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
        description: "Handcrafted embroidered top featuring intricate traditional designs. Each piece is unique and showcases the beauty of traditional craftsmanship.",
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
    return sampleProducts.find(p => p.id === id) || sampleProducts[0]
  }

  const addToCart = () => {
    if (!product || !selectedSize) {
      alert('Please select a size')
      return
    }

    setAddingToCart(true)
    
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_data || product.image_url,
      size: selectedSize,
      quantity: quantity
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = existingCart.findIndex(
      (item: CartItem) => item.id === product.id && item.size === selectedSize
    )

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += quantity
    } else {
      existingCart.push(cartItem)
    }

    localStorage.setItem('cart', JSON.stringify(existingCart))
    
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'))
    
    setTimeout(() => {
      setAddingToCart(false)
      alert('Item added to cart!')
    }, 500)
  }

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

  if (!product) {
    return (
      <main className={styles.main}>
        <Header />
        <div className={styles.notFound}>
          <h1>Product Not Found</h1>
          <button onClick={() => router.back()} className={styles.backButton}>
            Go Back
          </button>
        </div>
        <Footer />
      </main>
    )
  }

  const images = [
    product.image_data || product.image_url,
    product.image_data || product.image_url,
    product.image_data || product.image_url
  ]

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.container}>

        
        {/* <div className={styles.breadcrumb}>
          <button onClick={() => router.back()} className={styles.breadcrumbLink}>
            ← Back to Shop
          </button>
        </div> */}

        <div className={styles.productDetail}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <Image
                src={images[selectedImageIndex]}
                alt={product.name}
                fill
                className={styles.image}
              />
            </div>

            {/* Thumbnails */}
            {/* <div className={styles.thumbnails}>
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.thumbnailActive : ''}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                  />
                </button>
              ))}
            </div> */}
          </div>

          <div className={styles.productInfo}>
            <div className={styles.productHeader}>
              
              <h1 className={styles.productTitle}>{product.name}</h1>
              <p className={styles.productPrice}>Rs. {product.price.toLocaleString()}</p>
              
            </div>

            <div className={styles.productMeta}>
              <p className={styles.category}>{product.category}</p>
              {product.collection && (
                <p className={styles.collection}>{product.collection}</p>
              )}
            </div>

            <div className={styles.productDescription}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className={styles.sizeSection}>
              <h3>Size</h3>
              <div className={styles.sizeOptions}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonActive : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.quantitySection}>
              <h3>Quantity</h3>
              <div className={styles.quantitySelector}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.quantityButton}
                >
                  -
                </button>
                <span className={styles.quantityDisplay}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={styles.quantityButton}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.stockInfo}>
              <p className={styles.stockStatus}>✓ In Stock</p>
            </div>

            <div className={styles.actions}>
              <button
                onClick={addToCart}
                disabled={!selectedSize || addingToCart}
                className={styles.addToCartButton}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={() => router.push('/cart')}
                className={styles.viewCartButton}
              >
                View Cart
              </button>
            </div>

            
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}