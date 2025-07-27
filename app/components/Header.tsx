'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header className="flex justify-between items-center py-4 px-[5%] bg-white relative z-50">
      <nav className="flex">
        <ul className="nav-links flex gap-8">
          <li>
            <Link 
              href="/" 
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link 
              href="/shop" 
              className={`nav-link ${pathname === '/shop' ? 'active' : ''}`}
            >
              SHOP
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="logo">
        <Link href="/">
          <h1 className="text-2xl font-primary font-medium">Zarab Collections</h1>
        </Link>
      </div>
      
      <div className="nav-icons flex gap-5">
        <Link href="/admin" aria-label="Account">
          <i className="fas fa-user text-lg hover:text-secondary transition-colors"></i>
        </Link>
        <Link href="#" aria-label="Search">
          <i className="fas fa-search text-lg hover:text-secondary transition-colors"></i>
        </Link>
        <Link href="#" aria-label="Shopping Bag">
          <i className="fas fa-shopping-bag text-lg hover:text-secondary transition-colors"></i>
        </Link>
      </div>
    </header>
  )
}