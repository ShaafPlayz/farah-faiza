import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/supabase'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Pick the first non-empty string from image arrays
  const imageSrc = ([...(product.image_data_array ?? []), ...(product.image_urls ?? [])]
    .find((s) => {
      const v = typeof s === 'string' ? s.trim() : ''
      return v.length > 0 && /^(data:image\/|https?:\/\/|\/)/.test(v)
    })) || '/zarablogo.png'

  return (
    <div className={`product-card ${styles.productCard}`}>
      <Link href={`/product/${product.id}`} className={styles.productLink}>
        <div className={`product-image ${styles.productImage}`}>
          <Image
            src={imageSrc}
            alt={product.name}
            fill
          />
          {/* <div className={`product-overlay ${styles.productOverlay}`}> */}
            {/* <span className={styles.quickView} aria-label="View details"> */}
              {/* <i className="fas fa-eye"></i> */}
            {/* </span> */}
          {/* </div> */}
        </div>
        <div className={`product-info ${styles.productInfo}`}>
          <h3>{product.name}</h3>
          <p className={`product-price ${styles.productPrice}`}>Rs. {product.price.toLocaleString()}</p>
        </div>
      </Link>
    </div>
  )
}
