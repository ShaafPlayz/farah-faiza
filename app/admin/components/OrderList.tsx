'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import styles from './OrderList.module.css'

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

interface OrderListProps {
  loading: boolean
  orders: Order[]
  onDelete: (id: string) => void
}

export default function OrderList({ loading, orders, onDelete }: OrderListProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ff6b6b'
      case 'confirmed': return '#4ecdc4'
      case 'shipped': return '#45b7d1'
      case 'delivered': return '#96ceb4'
      case 'cancelled': return '#fd79a8'
      default: return '#666'
    }
  }

  const toggleExpanded = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📦</div>
        <h3>No Orders Yet</h3>
        <p>Orders will appear here once customers start placing them.</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Recent Orders</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{orders.length}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              Rs. {orders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()}
            </span>
            <span className={styles.statLabel}>Total Revenue</span>
          </div>
        </div>
      </div>

      <div className={styles.orderList}>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader} onClick={() => toggleExpanded(order.id)}>
              <div className={styles.orderInfo}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderId}>#{order.id.slice(-6)}</span>
                  <span 
                    className={styles.orderStatus}
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className={styles.customerInfo}>
                  <span className={styles.customerName}>{order.customer_name}</span>
                  <span className={styles.orderDate}>{formatDate(order.order_date)}</span>
                </div>
              </div>
              <div className={styles.orderValue}>
                <span className={styles.orderTotal}>Rs. {order.total_amount.toLocaleString()}</span>
                <span className={styles.expandIcon}>
                  {expandedOrder === order.id ? '−' : '+'}
                </span>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className={styles.orderDetails}>
                <div className={styles.customerDetails}>
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {order.customer_name}</p>
                  <p><strong>Phone:</strong> {order.customer_phone}</p>
                  <p><strong>Address:</strong> {order.customer_address}</p>
                  {order.delivery_instructions && (
                    <p><strong>Delivery Instructions:</strong> {order.delivery_instructions}</p>
                  )}
                  <p><strong>Payment Method:</strong> {order.payment_method}</p>
                </div>

                <div className={styles.orderItems}>
                  <h4>Order Items</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className={styles.orderItem}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className={styles.image}
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemInfo}>Size: {item.size} | Qty: {item.quantity}</span>
                      </div>
                      <div className={styles.itemPrice}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderActions}>
                  <button
                    onClick={() => onDelete(order.id)}
                    className={styles.deleteButton}
                    title="Delete Order"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}