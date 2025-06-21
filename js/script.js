/*
===============================
Zarab Collections - Main Script
===============================
*/

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }
    
    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval = setInterval(nextSlide, 5000);
        
        function showSlide(n) {
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Hide all active dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show the selected slide and dot
            slides[n].classList.add('active');
            if (dots.length > 0) {
                dots[n].classList.add('active');
            }
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        // Event listeners for next and previous buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                clearInterval(slideInterval);
                prevSlide();
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                clearInterval(slideInterval);
                nextSlide();
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                clearInterval(slideInterval);
                currentSlide = index;
                showSlide(currentSlide);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }
    
    // Hero Slideshow
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    let currentHeroSlide = 0;

    function showHeroSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
        heroSlides[currentHeroSlide].classList.add('active');
    }

    if (heroPrev && heroNext) {
        heroPrev.addEventListener('click', () => {
            showHeroSlide(currentHeroSlide - 1);
        });

        heroNext.addEventListener('click', () => {
            showHeroSlide(currentHeroSlide + 1);
        });

        // Auto-play hero slideshow
        setInterval(() => {
            showHeroSlide(currentHeroSlide + 1);
        }, 5000);
    }

    // Announcement Bar Slideshow
    const announcements = document.querySelectorAll('.announcement');
    const prevAnnouncement = document.querySelector('.prev-announcement');
    const nextAnnouncement = document.querySelector('.next-announcement');
    let currentAnnouncement = 0;

    function showAnnouncement(index) {
        announcements.forEach(announcement => announcement.classList.remove('active'));
        currentAnnouncement = (index + announcements.length) % announcements.length;
        announcements[currentAnnouncement].classList.add('active');
    }

    if (prevAnnouncement && nextAnnouncement) {
        prevAnnouncement.addEventListener('click', () => {
            showAnnouncement(currentAnnouncement - 1);
        });

        nextAnnouncement.addEventListener('click', () => {
            showAnnouncement(currentAnnouncement + 1);
        });

        // Auto-rotate announcements
        setInterval(() => {
            showAnnouncement(currentAnnouncement + 1);
        }, 4000);
    }

    // Shop page grid view toggle
    const gridOptions = document.querySelectorAll('.grid-option');
    const productsContainer = document.querySelector('.products-container');
    
    if (gridOptions.length > 0 && productsContainer) {
        gridOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                gridOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Toggle grid/list view
                if (this.querySelector('.fa-list')) {
                    productsContainer.classList.add('list-view');
                } else {
                    productsContainer.classList.remove('list-view');
                }
            });
        });
    }
    
    // Add to wishlist functionality
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const heart = this.querySelector('i');
            
            if (heart.classList.contains('far')) {
                heart.classList.remove('far');
                heart.classList.add('fas');
                this.setAttribute('aria-label', 'Remove from Wishlist');
                
                // Show a notification
                showNotification('Product added to wishlist!', 'success');
            } else {
                heart.classList.remove('fas');
                heart.classList.add('far');
                this.setAttribute('aria-label', 'Add to Wishlist');
                
                // Show a notification
                showNotification('Product removed from wishlist!', 'info');
            }
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info
            const product = this.closest('.product');
            const productName = product.querySelector('h3').textContent;
            
            // Show a notification
            showNotification(`${productName} added to cart!`, 'success');
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                // Here you would typically send this to a server
                // For demo purposes, we'll just show a success message
                emailInput.value = '';
                showNotification('Thank you for subscribing to our newsletter!', 'success');
            }
        });
    }
    
    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info
            const product = this.closest('.product');
            const productName = product.querySelector('h3').textContent;
            
            alert(`Quick view for ${productName} would open here.`);
        });
    });
    
    // Product Quick View and Add to Cart Functionality
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            alert(`Quick view for ${productName}`);
            // In a real implementation, this would open a modal with product details
        });
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            alert(`${productName} (${productPrice}) added to cart!`);
            // In a real implementation, this would add the product to a cart object and update the UI
        });
    });
    
    // Helper function to show notifications
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add notification to the DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove from DOM after fade out
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: white;
            color: #333;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
            max-width: 300px;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification.success {
            border-left: 4px solid #4caf50;
        }
        
        .notification.error {
            border-left: 4px solid #f44336;
        }
        
        .notification.info {
            border-left: 4px solid #2196f3;
        }
    `;
    document.head.appendChild(style);
    
    // Shop Page Filter and Sort Functionality
    const sortBySelect = document.getElementById('sort-by');
    
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log(`Sorting products by: ${sortValue}`);
            // In a real implementation, this would sort the products
        });
    }

    // Size option selection in shop page
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const size = this.textContent;
            console.log(`Selected size: ${size}`);
            // In a real implementation, this would filter products by size
        });
    });
});
