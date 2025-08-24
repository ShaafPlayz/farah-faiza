'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
              alt="Zarab Collections" 
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
            <Link href="#" aria-label="Shopping Bag">
              <i className={`fas fa-shopping-bag ${styles.navIcon}`}></i>
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
                  href="#" 
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-shopping-bag" style={{marginRight: '12px'}}></i>BAG
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