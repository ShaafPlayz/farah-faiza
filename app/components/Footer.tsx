import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-20 px-[5%]">
      <div className="footer-container">
        <div className="footer-column">
          <h3>About ZARAB Collections</h3>
          <p>ZARAB Collections is a premium ready-to-wear women&apos;s clothing brand offering elegant, contemporary designs for the modern woman.</p>
        </div>
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Customer Service</h3>
          <ul>
            <li><Link href="#">FAQ</Link></li>
            <li><Link href="#">Shipping & Returns</Link></li>
            <li><Link href="#">Size Guide</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Contact Us</h3>
          <p>Email: #</p>
          <p>Phone: #</p>
          <div className="social-icons flex gap-4 mt-5">
            <Link href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </Link>
            <Link href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link href="#" aria-label="Pinterest">
              <i className="fab fa-pinterest-p"></i>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-white/10 text-sm text-gray">
        <p>&copy; 2023 ZARAB Collections. All Rights Reserved.</p>
      </div>
    </footer>
  )
}