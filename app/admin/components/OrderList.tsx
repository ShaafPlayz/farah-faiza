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
  onStatusChange: (id: string, newStatus: string) => void
}

export default function OrderList({ loading, orders, onDelete, onStatusChange }: OrderListProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

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
      case 'pending': return '#D4AF37'
      case 'confirmed': return '#4ecdc4'
      case 'shipped': return '#45b7d1'
      case 'delivered': return '#96ceb4'
      case 'cancelled': return '#B8860B'
      default: return '#666'
    }
  }

  const toggleExpanded = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    onStatusChange(orderId, newStatus)
  }

  const handleDeleteClick = (orderId: string) => {
    setShowDeleteModal(orderId)
  }

  const confirmDelete = (orderId: string) => {
    onDelete(orderId)
    setShowDeleteModal(null)
  }

  const cancelDelete = () => {
    setShowDeleteModal(null)
  }

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone.includes(searchQuery)
    
    return matchesStatus && matchesSearch
  })

  // Calculate revenue for filtered orders
  const filteredRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)

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
        <h2>Order Management</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{filteredOrders.length}</span>
            <span className={styles.statLabel}>Filtered Orders</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              Rs. {filteredRevenue.toLocaleString()}
            </span>
            <span className={styles.statLabel}>Filtered Revenue</span>
          </div>
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

      {/* Filters and Search */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by customer name, order ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterBox}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className={styles.orderList}>
        {filteredOrders.map((order) => (
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
                  <div className={styles.statusControls}>
                    <label htmlFor={`status-${order.id}`}>Update Status:</label>
                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => handleDeleteClick(order.id)}
                      className={styles.deleteButton}
                      title="Delete Order"
                    >
                      Delete Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Confirm Delete</h3>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete this order? This action cannot be undone.</p>
              <p><strong>Order ID:</strong> #{showDeleteModal.slice(-6)}</p>
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={() => confirmDelete(showDeleteModal)}
                className={styles.confirmDeleteButton}
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
