'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from './page.module.css'

interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  size: string
  quantity: number
}

export default function Cart() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setLoading(false)
  }

  const updateQuantity = (id: number, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id, size)
      return
    }

    const updatedCart = cartItems.map(item => 
      item.id === id && item.size === size 
        ? { ...item, quantity: newQuantity }
        : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (id: number, size: string) => {
    const updatedCart = cartItems.filter(item => 
      !(item.id === id && item.size === size)
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p>Loading cart...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <button onClick={() => router.push('/shop')} className={styles.continueShoppingBtn}>
            ← Continue Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartContent}>
              <div className={styles.emptyCartIcon}>🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some products to get started</p>
              <button 
                onClick={() => router.push('/shop')} 
                className={styles.shopNowBtn}
              >
                Shop Now
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              <div className={styles.cartHeader}>
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}`} className={styles.cartItem}>
                  <div className={styles.productInfo}>
                    <div className={styles.productImage}>
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className={styles.image}
                      />
                    </div>
                    <div className={styles.productDetails}>
                      <h3 className={styles.productName}>{item.name}</h3>
                      <p className={styles.productSize}>Size: {item.size}</p>
                    </div>
                  </div>

                  <div className={styles.productPrice}>
                    Rs. {item.price.toLocaleString()}
                  </div>

                  <div className={styles.quantitySection}>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className={styles.quantityBtn}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className={styles.quantityBtn}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.totalPrice}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className={styles.removeBtn}
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.summaryRow}>
                <span>Items ({getTotalItems()})</span>
                <span>Rs. {getTotalPrice().toLocaleString()}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{getTotalPrice() >= 3000 ? 'Free' : 'Rs. 200'}</span>
              </div>
              
              <div className={styles.summaryDivider}></div>
              
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>Rs. {(getTotalPrice() + (getTotalPrice() >= 3000 ? 0 : 200)).toLocaleString()}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className={styles.checkoutBtn}
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                className={styles.clearCartBtn}
              >
                Clear Cart
              </button>

              <div className={styles.deliveryInfo}>
                <p>📦 Free delivery on orders over Rs. 3,000</p>
                <p>🚚 Delivery within 3-5 business days</p>
                <p>💰 Cash on Delivery available</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}