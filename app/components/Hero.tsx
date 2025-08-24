'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Hero.module.css'

const slides = [
  {
    id: 1,
    title: "ELEGANCE REDEFINED",
    subtitle: "DISCOVER OUR NEW SEASON COLLECTION",
    buttonText: "SHOP NOW",
    image: "/images/product-1.jpeg"
  },
  {
    id: 2,
    title: "TIMELESS SOPHISTICATION",
    subtitle: "ELEVATE YOUR WARDROBE WITH OUR LATEST DESIGNS",
    buttonText: "EXPLORE",
    image: "/images/product-1.jpeg"
  },
  {
    id: 3,
    title: "MODERN FEMININITY",
    subtitle: "CRAFTED FOR THE CONTEMPORARY WOMAN",
    buttonText: "VIEW COLLECTION",
    image: "/images/product-1.jpeg"
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className={`hero ${styles.hero}`}>
      <div className={`hero-slides ${styles.heroSlides}`}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${styles.heroSlide} ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`hero-image ${styles.heroImage}`}>
              <div className="hero-content">
                <div className="hero-text">
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                </div>
                <Link href="/shop" className="btn btn-primary hero-button">
                  {slide.buttonText}
                </Link>
              </div>
              {slide.image && (
                <Image
                  src={slide.image}
                  alt="Hero image"
                  fill
                  priority={index === 0}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={prevSlide}
        className={`${styles.navButton} ${styles.prevButton}`}
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <button
        onClick={nextSlide}
        className={`${styles.navButton} ${styles.nextButton}`}
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </section>
  )
}