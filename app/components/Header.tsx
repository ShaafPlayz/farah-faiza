'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  size: string
  quantity: number
}

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    updateCartCount()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount()
    }

    // Custom event listener for cart updates
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    // Periodic check for cart updates (in case localStorage is modified elsewhere)
    const interval = setInterval(updateCartCount, 1000)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      clearInterval(interval)
    }
  }, [])

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const count = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0)
      setCartItemCount(count)
    } catch (error) {
      console.error('Error reading cart:', error)
      setCartItemCount(0)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <Link href="/">
            <Image 
              src="/zarablogo.png" 
              alt="ZC" 
              width={70} 
              height={70} 
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <nav className={styles.nav}>
            <ul className={`nav-links ${styles.navLinks}`}>
              <li>
                <Link 
                  href="/" 
                  className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop" 
                  className={`${styles.navLink} ${pathname === '/shop' ? styles.navLinkActive : ''}`}
                >
                  SHOP
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className={`nav-icons ${styles.navIcons}`}>
            <Link href="/admin" aria-label="Account">
              <i className={`fas fa-user ${styles.navIcon}`}></i>
            </Link>
            <Link href="#" aria-label="Search">
              <i className={`fas fa-search ${styles.navIcon}`}></i>
            </Link>
            <Link href="/cart" aria-label="Shopping Bag" className={styles.cartLink}>
              <i className={`fas fa-shopping-bag ${styles.navIcon}`}></i>
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className={styles.mobileMenuButton}
          aria-label="Toggle mobile menu"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              <li>
                <Link 
                  href="/" 
                  className={`${styles.mobileNavLink} ${pathname === '/' ? styles.mobileNavLinkActive : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  href="/shop" 
                  className={`${styles.mobileNavLink} ${pathname === '/shop' ? styles.mobileNavLinkActive : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SHOP
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin" 
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-user" style={{marginRight: '12px'}}></i>ACCOUNT
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-search" style={{marginRight: '12px'}}></i>SEARCH
                </Link>
              </li>
              <li>
                <Link 
                  href="/cart" 
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-shopping-bag" style={{marginRight: '12px'}}></i>
                  BAG {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
      
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.mobileMenuOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  )
}