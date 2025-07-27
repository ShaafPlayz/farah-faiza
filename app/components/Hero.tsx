'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
    <section className="hero relative h-[80vh] overflow-hidden">
      <div className="hero-slides h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="hero-image h-full w-full relative">
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link href="/shop" className="btn btn-primary">
                  {slide.buttonText}
                </Link>
              </div>
              {slide.image && (
                <Image
                  src={slide.image}
                  alt="Hero image"
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black/50 text-white border-none w-12 h-12 rounded-full flex items-center justify-center text-lg cursor-pointer z-30 transition-all duration-300 hover:bg-secondary"
        aria-label="Previous slide"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black/50 text-white border-none w-12 h-12 rounded-full flex items-center justify-center text-lg cursor-pointer z-30 transition-all duration-300 hover:bg-secondary"
        aria-label="Next slide"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </section>
  )
}