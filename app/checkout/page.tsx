'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  size: string
  quantity: number
}

interface OrderData {
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

export default function Checkout() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryInstructions: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    loadCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const items = JSON.parse(savedCart)
      setCartItems(items)
      if (items.length === 0) {
        router.push('/cart')
      }
    } else {
      router.push('/cart')
    }
    setLoading(false)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getShippingCost = () => {
    return getTotalPrice() >= 3000 ? 0 : 200
  }

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost()
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const placeOrder = async () => {
    if (!validateForm()) {
      return
    }

    setPlacing(true)

    const orderData: OrderData = {
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_address: formData.address,
      delivery_instructions: formData.deliveryInstructions,
      payment_method: 'Cash on Delivery',
      total_amount: getFinalTotal(),
      items: cartItems,
      order_date: new Date().toISOString(),
      status: 'pending'
    }

    try {
      // Try to save to database
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        // Fallback: save to localStorage for demo
        const orderId = Date.now().toString()
        const orderWithId = { ...orderData, id: orderId }
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        existingOrders.push(orderWithId)
        localStorage.setItem('orders', JSON.stringify(existingOrders))
        
        // Clear cart and redirect
        localStorage.removeItem('cart')
        router.push(`/order-confirmation?id=${orderId}`)
      } else {
        // Success - clear cart and redirect
        localStorage.removeItem('cart')
        router.push(`/order-confirmation?id=${data.id}`)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      // Fallback: save to localStorage
      const orderId = Date.now().toString()
      const orderWithId = { ...orderData, id: orderId }
      
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      existingOrders.push(orderWithId)
      localStorage.setItem('orders', JSON.stringify(existingOrders))
      
      // Clear cart and redirect
      localStorage.removeItem('cart')
      router.push(`/order-confirmation?id=${orderId}`)
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p>Loading checkout...</p>
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
          <h1 className={styles.title}>Checkout</h1>
          <button onClick={() => router.push('/cart')} className={styles.backBtn}>
            ← Back to Cart
          </button>
        </div>

        <div className={styles.checkoutContent}>
          <div className={styles.checkoutForm}>
            <h2 className={styles.sectionTitle}>Delivery Information</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Delivery Address *
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`${styles.textarea} ${errors.address ? styles.inputError : ''}`}
                placeholder="Enter your complete delivery address"
                rows={3}
              />
              {errors.address && <span className={styles.error}>{errors.address}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deliveryInstructions" className={styles.label}>
                Delivery Instructions (Optional)
              </label>
              <textarea
                id="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                className={styles.textarea}
                placeholder="Any special instructions for delivery (e.g., gate code, preferred time)"
                rows={2}
              />
            </div>

            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <div className={styles.paymentMethod}>
              <div className={styles.paymentOption}>
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  checked={true}
                  readOnly
                  className={styles.radio}
                />
                <label htmlFor="cod" className={styles.paymentLabel}>
                  <span className={styles.paymentIcon}>💰</span>
                  <span>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when you receive your order</small>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryItems}>
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className={styles.summaryItem}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <p className={styles.itemInfo}>Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <div className={styles.itemPrice}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryCalculations}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>Rs. {getTotalPrice().toLocaleString()}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{getShippingCost() === 0 ? 'Free' : `Rs. ${getShippingCost()}`}</span>
              </div>
              
              <div className={styles.summaryDivider}></div>
              
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>Rs. {getFinalTotal().toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={placing}
              className={styles.placeOrderBtn}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>

            <div className={styles.orderInfo}>
              <p>📦 Free delivery on orders over Rs. 3,000</p>
              <p>🚚 Delivery within 3-5 business days</p>
              <p>💰 Cash on Delivery</p>
              <p>🔄 Easy returns within 7 days</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}