import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      <Header />
      <main className={styles.main}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Hero Image - Full Width */}
        <div className={styles.heroBackground}>
          <div className={styles.heroBackgroundInner}>
            <div className={styles.heroIcon}>
              <div className={styles.heroArrow}>🢓</div>
            </div>
          </div>
        </div>
        
        {/* Content Overlay */}
        <div className={styles.heroContentOverlay}>
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              
              {/* Left Content */}
              <div className={styles.heroContent}>
                <div className={styles.heroContentInner}>
                  <h1 className={styles.heroWelcome}>
                    welcome to
                  </h1>
                  <h1 className={styles.heroTitle}>
                    zarab collections
                  </h1>
                  <Link 
                    href="/shop" 
                    className={styles.shopButton}
                  >
                    SHOP NOW
                  </Link>
                </div>
              </div>

              {/* Right Content - Shop Now Button */}
            
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className={styles.bestsellers}>
        <div className={styles.bestsellerContainer}>
          <div className={styles.bestsellerHeader}>
            <h2 className={styles.bestsellerTitle}>
              COLLECTIONS
            </h2>
          </div>
          
          {/* Product Grid */}
          <div className={styles.productGrid}>
            {[
              { name: "Elegant Gold Dress", color: "from-yellow-300 to-amber-400" },
              { name: "Classic Red Ensemble", color: "from-red-200 to-red-300" },
              { name: "Sophisticated Black", color: "from-gray-800 to-black" }
            ].map((item, index) => (
              <div key={index} className={styles.productCard}>
                <div className={styles.productCardInner}>
                  <div className={styles.productImage}>
                    <div className={`${styles.productImageInner} bg-gradient-to-br ${item.color}`}>
                      <div className={styles.productIconContainer}>
                        <div className={styles.productIcon}>▼</div>
                        <p className={styles.productName}>{item.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Statement Footer */}
      {/* <section className={styles.brandStatement}>
        <div className={styles.brandContainer}>
          <h3 className={styles.brandTitle}>
            A Pakistani Clothing Brand
          </h3>
        </div>
      </section> */}
      
      <Footer />
      </main>
    </>
  )
}
