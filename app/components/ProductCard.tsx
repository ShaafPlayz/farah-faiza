import Image from 'next/image'
import type { Product } from '@/lib/supabase'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use image_data if available, otherwise fall back to image_url
  const imageSrc = product.image_data || product.image_url

  return (
    <div className="product-card">
      <div className="product-image">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="product-overlay">
          <a href="#" className="quick-view" aria-label="Quick view">
            <i className="fas fa-eye"></i>
          </a>
          <a href="#" className="add-to-cart" aria-label="Add to cart">
            <i className="fas fa-shopping-cart"></i>
          </a>
        </div>
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">Rs. {product.price.toLocaleString()}</p>
      </div>
    </div>
  )
}