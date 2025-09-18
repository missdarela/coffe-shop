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
    
    this.mobileMenuBtn.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking on overlay
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', () => this.closeMenu());
    }
    
    // Close menu when clicking on links
    const mobileLinks = this.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
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

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileNavigation();
  
  // Add animation classes to elements
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
  
  // Observe all fade-in elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    observer.observe(el);
  });
  
  // Staggered animation for menu items
  const menuItems = document.querySelectorAll('#menu .grid > div');
  menuItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
  });
});

// Add smooth scrolling for better UX
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

// carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function updateSlide() {
  // Remove active class from all slides and indicators
  slides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));
  
  // Add active class to current slide and indicator
  slides[currentSlide].classList.add('active');
  indicators[currentSlide].classList.add('active');
}

function changeSlide(direction) {
  currentSlide += direction;
  
  if (currentSlide >= totalSlides) {
    currentSlide = 0;
  } else if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  }
  
  updateSlide();
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex;
  updateSlide();
}

// Auto-advance slides every 6 seconds
setInterval(() => {
  changeSlide(1);
}, 6000);

// Add parallax effect on mouse move
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

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    changeSlide(-1);
  } else if (e.key === 'ArrowRight') {
    changeSlide(1);
  }
});

// Add touch/swipe support for mobile
let startX = 0;
let startY = 0;

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const diffX = startX - endX;
  const diffY = startY - endY;

  // Only trigger swipe if horizontal movement is greater than vertical
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) {
      changeSlide(1); // Swipe left - next slide
    } else {
      changeSlide(-1); // Swipe right - previous slide
    }
  }
});
