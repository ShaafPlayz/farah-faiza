'use client'

import Image from 'next/image'
import type { Product } from '@/lib/supabase'
import styles from './ProductList.module.css'

interface ProductListProps {
  products: Product[]
  loading: boolean
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export default function ProductList({ products, loading, onEdit, onDelete }: ProductListProps) {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Products</h1>
          {/* <p className={styles.description}>
            A list of all products in your store including their name, category, price, and status.
          </p> */}
        </div>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No products found. Add your first product to get started.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <div className={styles.tableInner}>
              <div className={styles.tableShadow}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr>
                      <th scope="col" className={styles.tableHeaderCell}>
                        Product
                      </th>
                      <th scope="col" className={styles.tableHeaderCell}>
                        Category
                      </th>
                      <th scope="col" className={styles.tableHeaderCell}>
                        Price
                      </th>
                      <th scope="col" className={styles.tableHeaderCell}>
                        Collection
                      </th>
                      <th scope="col" className={styles.hiddenHeader}>
                        <span>Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {products.map((product) => (
                      <tr key={product.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          <div className={styles.productInfo}>
                            <div className={styles.productImage}>
                              <Image
                                className={styles.productImageImg}
                                src={
                                  ([...(product.image_data_array ?? []), ...(product.image_urls ?? [])]
                                    .find((s) => {
                                      const v = typeof s === 'string' ? s.trim() : ''
                                      return v.length > 0 && /^(data:image\/|https?:\/\/|\/)/.test(v)
                                    }) || '/zarablogo.png')
                                }
                                alt={product.name}
                                fill
                              />
                            </div>
                            <div className={styles.productDetails}>
                              <div className={styles.productName}>
                                {product.name}
                              </div>
                              <div className={styles.productDescription}>
                                {product.description.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.categoryText}>{product.category}</div>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.priceText}>Rs. {product.price.toLocaleString()}</div>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.collectionText}>
                            {product.collection || 'N/A'}
                          </div>
                        </td>
                        <td className={styles.actionsCell}>
                          <button
                            onClick={() => onEdit(product)}
                            className={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(product.id)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
