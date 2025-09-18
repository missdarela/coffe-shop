// Mobile Navigation Class
class MobileNavigation {
  constructor() {
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.mobileOverlay = document.getElementById('mobileOverlay');
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.mobileMenuBtn || !this.mobileMenu) return;
    
    this.mobileMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleMenu();
    });
    
    // Close menu when clicking on overlay
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMenu();
      });
    }
    
    // Close menu when clicking on links
    const mobileLinks = this.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeMenu();
      });
    });

    // Close menu on window resize if screen becomes large
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.mobileMenu.classList.add('show');
    if (this.mobileOverlay) {
      this.mobileOverlay.classList.add('show');
    }
    this.isMenuOpen = true;
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
    
    // Change hamburger to X
    this.mobileMenuBtn.innerHTML = `
      <svg class="w-6 h-6 text-maroon-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;
  }

  closeMenu() {
    this.mobileMenu.classList.remove('show');
    if (this.mobileOverlay) {
      this.mobileOverlay.classList.remove('show');
    }
    this.isMenuOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Change X back to hamburger
    this.mobileMenuBtn.innerHTML = `
      <svg class="w-6 h-6 text-maroon-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    `;
  }
}

// Carousel Class
class HeroCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;
    
    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    this.setupEventListeners();
    this.updateSlide();
    this.startAutoPlay();
  }

  setupEventListeners() {
    // Navigation buttons
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.changeSlide(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.changeSlide(1);
      });
    }

    // Indicator buttons
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSlide(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.changeSlide(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.changeSlide(1);
      }
    });

    // Touch/swipe support
    this.setupTouchEvents();
    
    // Mouse parallax effect
    this.setupParallaxEffect();
  }

  setupTouchEvents() {
    let startX = 0;
    let startY = 0;

    const carousel = document.querySelector('.parallax-carousel');
    if (!carousel) return;

    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        e.preventDefault();
        if (diffX > 0) {
          this.changeSlide(1);
        } else {
          this.changeSlide(-1);
        }
      }
    }, { passive: false });
  }

  setupParallaxEffect() {
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const activeSlide = document.querySelector('.slide.active .slide-bg');
      if (activeSlide) {
        const moveX = (mouseX - 0.5) * 20;
        const moveY = (mouseY - 0.5) * 20;
        activeSlide.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      }
    });
  }

  updateSlide() {
    // Remove active class from all slides and indicators
    this.slides.forEach((slide) => {
      slide.classList.remove('active');
    });
    
    this.indicators.forEach((indicator) => {
      indicator.classList.remove('active');
      indicator.setAttribute('aria-selected', 'false');
    });
    
    // Add active class to current slide and indicator
    if (this.slides[this.currentSlide]) {
      this.slides[this.currentSlide].classList.add('active');
    }
    
    if (this.indicators[this.currentSlide]) {
      this.indicators[this.currentSlide].classList.add('active');
      this.indicators[this.currentSlide].setAttribute('aria-selected', 'true');
    }
  }

  changeSlide(direction) {
    this.currentSlide += direction;
    
    if (this.currentSlide >= this.totalSlides) {
      this.currentSlide = 0;
    } else if (this.currentSlide < 0) {
      this.currentSlide = this.totalSlides - 1;
    }
    
    this.updateSlide();
  }

  goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < this.totalSlides) {
      this.currentSlide = slideIndex;
      this.updateSlide();
    }
  }

  startAutoPlay() {
    this.stopAutoPlay(); // Clear any existing interval
    this.autoPlayInterval = setInterval(() => {
      this.changeSlide(1);
    }, 6000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Scroll Animation Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);

// Global functions for inline onclick handlers
function changeSlide(direction) {
  if (window.heroCarousel) {
    window.heroCarousel.changeSlide(direction);
  }
}

function goToSlide(slideIndex) {
  if (window.heroCarousel) {
    window.heroCarousel.goToSlide(slideIndex);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize mobile navigation
  new MobileNavigation();
  
  // Initialize carousel
  window.heroCarousel = new HeroCarousel();
  
  // Setup scroll animations
  const menuSection = document.querySelector('#menu h2');
  if (menuSection) menuSection.classList.add('fade-in');
  
  const menuGrid = document.querySelector('#menu .grid');
  if (menuGrid) observer.observe(menuGrid);
  
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
    aboutSection.classList.add('slide-in-left');
    observer.observe(aboutSection);
  }
  
  const contactInfo = document.querySelector('.contact-info');
  if (contactInfo) observer.observe(contactInfo);
  
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) observer.observe(mapContainer);
  
  // Observe all animation elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    observer.observe(el);
  });
  
  // Staggered animation for menu items
  const menuItems = document.querySelectorAll('#menu .grid > div');
  menuItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
  });

  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
