'use client'

import { useState, useEffect } from 'react'
import { supabase, type Product } from '@/lib/supabase'
import ImageUpload from './ImageUpload'
import styles from './ProductForm.module.css'

interface ProductFormProps {
  product?: Product | null
  onSave: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    image_data: '',
    category: '',
    collection: '',
    sizes: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image_url: product.image_url,
        image_data: product.image_data || '',
        category: product.category,
        collection: product.collection || '',
        sizes: product.sizes
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
        image_data: '',
        category: '',
        collection: '',
        sizes: []
      })
    }
  }, [product])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (!formData.image_data && !formData.image_url) {
        setError('Please upload a product image')
        setLoading(false)
        return
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_data || formData.image_url, // Use image_data if available, fallback to image_url
        image_data: formData.image_data,
        category: formData.category,
        collection: formData.collection || null,
        sizes: formData.sizes
      }

      let result
      if (product) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
      } else {
        result = await supabase
          .from('products')
          .insert(productData)
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        onSave()
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  function handleSizeToggle(size: string) {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  function handleImageChange(imageData: string) {
    setFormData(prev => ({ ...prev, image_data: imageData }))
    // Clear any previous errors when image is successfully uploaded
    if (imageData && error.includes('image')) {
      setError('')
    }
  }

  function handleImageError(errorMessage: string) {
    setError(errorMessage)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <h3 className={styles.title}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>
                Product Name
              </label>
              <input
                type="text"
                id="name"
                required
                className={styles.input}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                required
                rows={3}
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="price" className={styles.label}>
                Price (Rs.)
              </label>
              <input
                type="number"
                id="price"
                required
                min="0"
                step="0.01"
                className={styles.input}
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <ImageUpload
              currentImageData={formData.image_data}
              onImageChange={handleImageChange}
              onError={handleImageError}
            />

            <div className={styles.fieldGroup}>
              <label htmlFor="category" className={styles.label}>
                Category
              </label>
              <select
                id="category"
                required
                className={styles.select}
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select Category</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="collection" className={styles.label}>
                Collection (Optional)
              </label>
              <input
                type="text"
                id="collection"
                className={styles.input}
                value={formData.collection}
                onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Available Sizes
              </label>
              <div className={styles.sizeContainer}>
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`${styles.sizeButton} ${
                      formData.sizes.includes(size) ? styles.selected : ''
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={onCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}