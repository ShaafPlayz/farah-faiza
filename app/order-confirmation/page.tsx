'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function OrderConfirmation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }
    
    fetchOrder()
  }, [orderId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrder = async () => {
    try {
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) {
        console.error('Database error:', error)
        // Fallback to localStorage
        const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        const localOrder = localOrders.find((o: Order) => o.id === orderId)
        
        if (localOrder) {
          setOrder(localOrder)
        } else {
          // Generate a mock order for demo purposes
          setOrder(createMockOrder())
        }
      } else {
        setOrder(data)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      
      // Fallback to localStorage
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const localOrder = localOrders.find((o: Order) => o.id === orderId)
      
      if (localOrder) {
        setOrder(localOrder)
      } else {
        // Generate a mock order for demo purposes
        setOrder(createMockOrder())
      }
    } finally {
      setLoading(false)
    }
  }

  const createMockOrder = (): Order => ({
    id: orderId || 'demo-order',
    customer_name: 'Demo Customer',
    customer_phone: '+92 300 1234567',
    customer_address: 'Demo Address, Demo City',
    delivery_instructions: 'Please ring the bell',
    payment_method: 'Cash on Delivery',
    total_amount: 5190,
    items: [
      {
        id: 1,
        name: "Floral Print Dress",
        price: 4990,
        image_url: "/images/product-1.jpeg",
        size: "M",
        quantity: 1
      }
    ],
    order_date: new Date().toISOString(),
    status: 'pending'
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order?.order_date || new Date())
    const deliveryDate = new Date(orderDate)
    deliveryDate.setDate(deliveryDate.getDate() + 5) // Add 5 days
    
    return deliveryDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.loadingContent}>
            <div className={styles.spinner}></div>
            <p>Loading order details...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!order) {
    return (
      <main className={styles.main}>
        <Header />
        <div className={styles.notFound}>
          <h1>Order Not Found</h1>
          <p>We couldn&apos;t find the order you&apos;re looking for.</p>
          <button onClick={() => router.push('/')} className={styles.homeBtn}>
            Go Home
          </button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.successHeader}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Confirmed!</h1>
          <p className={styles.successMessage}>
            Thank you for your order. We&apos;ve received your order and will start processing it soon.
          </p>
        </div>

        <div className={styles.orderDetails}>
          <div className={styles.orderInfo}>
            <h2 className={styles.sectionTitle}>Order Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Order ID</span>
                <span className={styles.infoValue}>{order.id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Order Date</span>
                <span className={styles.infoValue}>{formatDate(order.order_date)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Status</span>
                <span className={`${styles.infoValue} ${styles.statusPending}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Payment Method</span>
                <span className={styles.infoValue}>{order.payment_method}</span>
              </div>
            </div>

            <h3 className={styles.subTitle}>Delivery Information</h3>
            <div className={styles.deliveryInfo}>
              <p><strong>Name:</strong> {order.customer_name}</p>
              <p><strong>Phone:</strong> {order.customer_phone}</p>
              <p><strong>Address:</strong> {order.customer_address}</p>
              {order.delivery_instructions && (
                <p><strong>Instructions:</strong> {order.delivery_instructions}</p>
              )}
              <p><strong>Estimated Delivery:</strong> {getEstimatedDelivery()}</p>
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            
            <div className={styles.orderItems}>
              {order.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className={styles.orderItem}>
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
                    <p className={styles.itemPrice}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totalSection}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>Rs. {order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>Rs. 200</span>
              </div>
              <div className={styles.totalDivider}></div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>Rs. {order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.nextSteps}>
          <h2 className={styles.sectionTitle}>What&apos;s Next?</h2>
          <div className={styles.stepsList}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Order Processing</h4>
                <p>We&apos;re preparing your order for shipment. You&apos;ll receive a confirmation call within 24 hours.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Shipping</h4>
                <p>Your order will be dispatched within 1-2 business days via our delivery partner.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Delivery</h4>
                <p>Expect delivery within 3-5 business days. Pay cash when you receive your order.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => router.push('/shop')} className={styles.continueShoppingBtn}>
            Continue Shopping
          </button>
          <button onClick={() => router.push('/')} className={styles.homeBtn}>
            Go to Homepage
          </button>
        </div>
      </div>

      <Footer />
    </main>
  )
}