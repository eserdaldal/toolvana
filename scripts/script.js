
// Toolvana JavaScript - Enhanced Version with New Features
console.log("Toolvana loaded!");

// Performance optimization: Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Debounce function for search input
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Time-based greeting in Turkish
function getTimeBasedGreeting() {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 6 && hour < 12) {
    return "Günaydın";
  } else if (hour >= 12 && hour < 18) {
    return "İyi günler";
  } else if (hour >= 18 && hour < 22) {
    return "İyi akşamlar";
  } else {
    return "İyi geceler";
  }
}

// Display greeting
function displayGreeting() {
  const greeting = getTimeBasedGreeting();
  console.log(`${greeting}! Toolvana'ya hoş geldiniz.`);
}

// Tool tracking functionality migrated to RecentToolsManager module

// Dark/Light Theme Management
const ThemeManager = {
  STORAGE_KEY: 'toolvana_theme_preference',
  DARK_CLASS: 'dark-mode',
  
  // Initialize theme system
  init: function() {
    this.createThemeToggle();
    this.loadThemePreference();
    this.setupThemeStyles();
  },
  
  // Create theme toggle button
  createThemeToggle: function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Tema değiştir');
    themeToggle.setAttribute('title', 'Koyu/Açık tema arasında geçiş yap');
    themeToggle.innerHTML = `
      <span class="theme-icon light-icon">☀️</span>
      <span class="theme-icon dark-icon">🌙</span>
    `;
    
    // Insert before mobile menu toggle or at the end
    const mobileToggle = navbar.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
      navbar.insertBefore(themeToggle, mobileToggle);
    } else {
      navbar.appendChild(themeToggle);
    }
    
    themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });
    
    // Keyboard support
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  },
  
  // Setup theme-related CSS
  setupThemeStyles: function() {
    const style = document.createElement('style');
    style.textContent = `
      .theme-toggle {
        background: none;
        border: 2px solid #e9ecef;
        border-radius: 20px;
        width: 50px;
        height: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.3s ease;
        margin-left: 1rem;
        overflow: hidden;
      }
      
      .theme-toggle:hover {
        border-color: #C0392B;
        transform: scale(1.05);
      }
      
      .theme-toggle:focus {
        outline: 2px solid #C0392B;
        outline-offset: 2px;
      }
      
      .theme-icon {
        position: absolute;
        font-size: 14px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .light-icon {
        opacity: 1;
        transform: translateY(0);
      }
      
      .dark-icon {
        opacity: 0;
        transform: translateY(20px);
      }
      
      .dark-mode .light-icon {
        opacity: 0;
        transform: translateY(-20px);
      }
      
      .dark-mode .dark-icon {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Dark mode styles */
      .dark-mode {
        color: #e9ecef;
        background-color: #1a1a1a;
      }
      
      .dark-mode .header {
        background-color: #2c2c2c;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      }
      
      .dark-mode .nav-links a {
        color: #e9ecef;
      }
      
      .dark-mode .nav-links a:hover,
      .dark-mode .nav-links a.active {
        color: #ff6b6b;
      }
      
      .dark-mode .hero-section {
        background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
      }
      
      .dark-mode .hero-title {
        color: #e9ecef;
      }
      
      .dark-mode .hero-description {
        color: #c9c9c9;
      }
      
      .dark-mode .sidebar {
        background-color: #2c2c2c;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
      }
      
      .dark-mode .widget-title {
        color: #ff6b6b;
        border-bottom-color: #ff6b6b;
      }
      
      .dark-mode .widget-link {
        color: #c9c9c9;
      }
      
      .dark-mode .widget-link:hover {
        color: #ff6b6b;
      }
      
      .dark-mode .tools-section {
        background-color: #2c2c2c;
      }
      
      .dark-mode .tool-card {
        background-color: #3c3c3c;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      }
      
      .dark-mode .tool-card h3 {
        color: #e9ecef;
      }
      
      .dark-mode .tool-card p {
        color: #c9c9c9;
      }
      
      .dark-mode .contact-form {
        background-color: #2c2c2c;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      }
      
      .dark-mode .form-group input,
      .dark-mode .form-group textarea {
        background-color: #3c3c3c;
        border-color: #555;
        color: #e9ecef;
      }
      
      .dark-mode .form-group input:focus,
      .dark-mode .form-group textarea:focus {
        border-color: #ff6b6b;
      }
      
      .dark-mode .newsletter-input {
        background-color: #3c3c3c;
        border-color: #555;
        color: #e9ecef;
      }
      
      .dark-mode .newsletter-input:focus {
        border-color: #ff6b6b;
      }
      
      .dark-mode .theme-toggle {
        border-color: #555;
      }
      
      .dark-mode .theme-toggle:hover {
        border-color: #ff6b6b;
      }
      
      .dark-mode .search-container {
        background-color: #2c2c2c;
      }
      
      .dark-mode .search-input {
        background-color: #3c3c3c;
        border-color: #555;
        color: #e9ecef;
      }
      
      .dark-mode .search-input:focus {
        border-color: #ff6b6b;
      }
      
      .dark-mode .search-input::placeholder {
        color: #999;
      }
      
      @media (max-width: 768px) {
        .theme-toggle {
          margin-left: 0.5rem;
          width: 40px;
          height: 25px;
        }
        
        .theme-icon {
          font-size: 12px;
        }
      }
    `;
    document.head.appendChild(style);
  },
  
  // Toggle between light and dark themes
  toggleTheme: function() {
    const body = document.body;
    const isDark = body.classList.contains(this.DARK_CLASS);
    
    if (isDark) {
      body.classList.remove(this.DARK_CLASS);
      this.saveThemePreference('light');
      Toolvana.announceToScreenReader('Açık tema aktif edildi');
    } else {
      body.classList.add(this.DARK_CLASS);
      this.saveThemePreference('dark');
      Toolvana.announceToScreenReader('Koyu tema aktif edildi');
    }
  },
  
  // Save theme preference to localStorage
  saveThemePreference: function(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  },
  
  // Load theme preference from localStorage
  loadThemePreference: function() {
    try {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      
      // If no preference saved, detect system preference
      if (!savedTheme) {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.body.classList.add(this.DARK_CLASS);
        }
        return;
      }
      
      if (savedTheme === 'dark') {
        document.body.classList.add(this.DARK_CLASS);
      }
    } catch (error) {
      console.warn('Error loading theme preference:', error);
    }
  }
};

// Search/Filter functionality for tools
const ToolsFilter = {
  // Initialize search functionality
  init: function() {
    this.createSearchBar();
    this.setupSearchLogic();
  },
  
  // Create search input above tools grid
  createSearchBar: function() {
    const toolsSection = document.querySelector('#araclar');
    if (!toolsSection) return;
    
    const toolsGrid = toolsSection.querySelector('.tools-grid');
    if (!toolsGrid) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <input 
        type="text" 
        class="search-input" 
        placeholder="Araç ara... (örn: metin, görsel)" 
        aria-label="Araçlarda ara"
        id="tools-search"
      >
      <div class="search-results-count" aria-live="polite"></div>
    `;
    
    // Add styles for search container
    const style = document.createElement('style');
    style.textContent = `
      .search-container {
        margin: 2rem auto 3rem;
        max-width: 500px;
        text-align: center;
        background-color: #fff;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
      }
      
      .search-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        font-family: inherit;
      }
      
      .search-input:focus {
        outline: none;
        border-color: #C0392B;
      }
      
      .search-input::placeholder {
        color: #999;
      }
      
      .search-results-count {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #666;
        min-height: 20px;
      }
      
      .tool-card.hidden {
        display: none;
      }
      
      .search-highlight {
        background-color: #ffeb3b;
        color: #000;
        font-weight: 600;
        padding: 1px 2px;
        border-radius: 2px;
      }
      
      @media (max-width: 768px) {
        .search-container {
          margin: 1.5rem auto 2rem;
          padding: 1rem;
        }
      }
    `;
    document.head.appendChild(style);
    
    toolsGrid.parentNode.insertBefore(searchContainer, toolsGrid);
  },
  
  // Setup search logic with debouncing
  setupSearchLogic: function() {
    const searchInput = document.querySelector('#tools-search');
    const resultsCount = document.querySelector('.search-results-count');
    
    if (!searchInput || !resultsCount) return;
    
    const performSearch = debounce((searchTerm) => {
      this.filterTools(searchTerm, resultsCount);
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.trim();
      performSearch(searchTerm);
    });
    
    // Clear search on ESC
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        this.filterTools('', resultsCount);
        searchInput.blur();
      }
    });
  },
  
  // Filter tools based on search term
  filterTools: function(searchTerm, resultsCount) {
    const toolCards = document.querySelectorAll('.tool-card');
    let visibleCount = 0;
    
    toolCards.forEach(card => {
      const title = card.querySelector('h3');
      const description = card.querySelector('p');
      
      if (!title || !description) return;
      
      // Remove previous highlights
      this.removeHighlights(card);
      
      if (!searchTerm) {
        card.classList.remove('hidden');
        visibleCount++;
        return;
      }
      
      const titleText = title.textContent.toLowerCase();
      const descText = description.textContent.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const titleMatch = titleText.includes(searchLower);
      const descMatch = descText.includes(searchLower);
      
      if (titleMatch || descMatch) {
        card.classList.remove('hidden');
        visibleCount++;
        
        // Add highlights
        if (titleMatch) {
          this.highlightText(title, searchTerm);
        }
        if (descMatch) {
          this.highlightText(description, searchTerm);
        }
      } else {
        card.classList.add('hidden');
      }
    });
    
    // Update results count
    if (searchTerm) {
      resultsCount.textContent = `${visibleCount} araç bulundu`;
      if (visibleCount === 0) {
        resultsCount.textContent = 'Hiç araç bulunamadı';
      }
    } else {
      resultsCount.textContent = '';
    }
  },
  
  // Highlight search term in text
  highlightText: function(element, searchTerm) {
    const originalText = element.textContent;
    const regex = new RegExp(`(${this.escapeRegex(searchTerm)})`, 'gi');
    const highlightedHTML = originalText.replace(regex, '<span class="search-highlight">$1</span>');
    element.innerHTML = highlightedHTML;
  },
  
  // Remove highlights from element
  removeHighlights: function(card) {
    const highlighted = card.querySelectorAll('.search-highlight');
    highlighted.forEach(span => {
      const parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
  },
  
  // Escape special regex characters
  escapeRegex: function(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
};

// Mobile menu functionality with accessibility improvements
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    // Add ARIA attributes for accessibility
    mobileToggle.setAttribute('aria-label', 'Mobil menüyü aç/kapat');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', 'mobile-nav');
    navLinks.setAttribute('id', 'mobile-nav');
    navLinks.setAttribute('aria-hidden', 'true');
    
    // Toggle menu function
    function toggleMenu(isOpen) {
      if (isOpen === undefined) {
        isOpen = !navLinks.classList.contains('active');
      }
      
      navLinks.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
      navLinks.setAttribute('aria-hidden', (!isOpen).toString());
      
      // Animate hamburger icon
      const spans = mobileToggle.querySelectorAll('span');
      spans.forEach((span, index) => {
        if (isOpen) {
          if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (index === 1) span.style.opacity = '0';
          if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
          span.style.transform = '';
          span.style.opacity = '';
        }
      });
      
      console.log('Mobile menu toggled:', isOpen);
    }
    
    // Click event for mobile toggle
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    
    // ESC key functionality to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMenu(false);
        mobileToggle.focus(); // Return focus to toggle button
      }
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        if (navLinks.classList.contains('active')) {
          toggleMenu(false);
        }
      }
    });
  }
}

// Smooth scrolling for navigation links with accessibility
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Set focus to target section for accessibility
        targetSection.setAttribute('tabindex', '-1');
        targetSection.focus();
        setTimeout(() => {
          targetSection.removeAttribute('tabindex');
        }, 1000);
      }
    });
  });
}

// CTA button functionality
function initCTAButton() {
  const ctaButton = document.querySelector('.cta-button');
  
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      const toolsSection = document.querySelector('#araclar');
      if (toolsSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = toolsSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Set focus for accessibility
        toolsSection.setAttribute('tabindex', '-1');
        toolsSection.focus();
        setTimeout(() => {
          toolsSection.removeAttribute('tabindex');
        }, 1000);
      }
    });
  }
}

// Active navigation highlighting with throttled scroll
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  const updateActiveNav = throttle(() => {
    const scrollPosition = window.scrollY + 150;
    let activeSection = null;
    
    // Find the currently active section
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSection = sectionId;
      }
    });
    
    // Update navigation links
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isActive = href === `#${activeSection}`;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }, 100);
  
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Initial call
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  
  // Check if IntersectionObserver is supported
  if (!window.IntersectionObserver) {
    console.log('IntersectionObserver not supported, skipping animations');
    return;
  }
  
  // Add initial styles for fade-in effect
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
  });
  
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        
        // Add a slight delay for tool cards within the tools section
        if (section.id === 'araclar') {
          const toolCards = section.querySelectorAll('.tool-card');
          toolCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
        
        observer.unobserve(section);
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Fallback: Show sections after 2 seconds if they're still hidden
  setTimeout(() => {
    sections.forEach(section => {
      if (section.style.opacity === '0') {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }
    });
  }, 2000);
}

// Form enhancements with accessibility
function initFormEnhancements() {
  const contactForm = document.querySelector('.contact-form');
  const newsletterForm = document.querySelector('.newsletter-form');
  
  // Contact form
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic form validation
      const nameInput = contactForm.querySelector('#name');
      const emailInput = contactForm.querySelector('#email');
      const messageInput = contactForm.querySelector('#message');
      
      if (!nameInput.value.trim()) {
        Toolvana.showNotification('Lütfen adınızı giriniz.', 'error');
        nameInput.focus();
        return;
      }
      
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        Toolvana.showNotification('Geçerli bir e-posta adresi giriniz.', 'error');
        emailInput.focus();
        return;
      }
      
      if (!messageInput.value.trim()) {
        Toolvana.showNotification('Lütfen mesajınızı giriniz.', 'error');
        messageInput.focus();
        return;
      }
      
      Toolvana.showNotification('Form gönderildi! (Demo)', 'success');
      
      // Reset form after submission
      setTimeout(() => {
        contactForm.reset();
      }, 1000);
    });
    
    // Add ARIA live region for form validation
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    contactForm.appendChild(liveRegion);
  }
  
  // Newsletter form
  if (newsletterForm) {
    const newsletterButton = newsletterForm.querySelector('.newsletter-button');
    const newsletterInput = newsletterForm.querySelector('.newsletter-input');
    
    if (newsletterButton && newsletterInput) {
      const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        const email = newsletterInput.value.trim();
        
        if (email && isValidEmail(email)) {
          Toolvana.showNotification('E-bülten aboneliği başarılı! (Demo)', 'success');
          newsletterInput.value = '';
        } else {
          Toolvana.showNotification('Geçerli bir e-posta adresi giriniz.', 'error');
          newsletterInput.focus();
        }
      };
      
      newsletterButton.addEventListener('click', handleNewsletterSubmit);
      
      // Enter key support for newsletter
      newsletterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleNewsletterSubmit(e);
        }
      });
    }
  }
  
  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Setup tool link tracking
function initToolTracking() {
  // Track clicks on widget links
  const widgetLinks = document.querySelectorAll('.widget-link');
  widgetLinks.forEach(link => {
    link.addEventListener('click', () => {
      const toolUrl = link.getAttribute('href') || '#';
      if (toolUrl !== '#') {
        const toolId = toolUrl.split('/').pop().replace('.html', '');
        if (window.RecentToolsManager) {
          window.RecentToolsManager.save(toolId);
        }
      }
    });
  });
}

// Add screen reader only class to CSS
function addScreenReaderClass() {
  const style = document.createElement('style');
  style.textContent = `
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    addScreenReaderClass();
    displayGreeting();
    
    // Initialize new features
    ThemeManager.init();
    ToolsFilter.init();
    initToolTracking();
    
    // START: Initialize Version Log Display Feature
    VersionLogManager.init();
    // END: Initialize Version Log Display Feature
    
    // Initialize existing features
    initMobileMenu();
    initSmoothScrolling();
    initCTAButton();
    initActiveNavigation();
    initScrollAnimations();
    initFormEnhancements();
    
    // Enhanced entrance animation
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.6s ease-in-out';
      document.body.style.opacity = '1';
    }, 100);
    
    console.log('Toolvana initialized successfully!');
  } catch (error) {
    console.error('Error initializing Toolvana:', error);
  }
});

// Enhanced Toolvana utility object
const Toolvana = {
  // Enhanced notification system
  showNotification: function(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create temporary visual notification (without external libraries)
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
      color: white;
      border-radius: 6px;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease-out;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
    
    // Also announce to screen readers
    this.announceToScreenReader(message);
  },
  
  // Utility function to format dates in Turkish
  formatDate: function(date) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    };
    return date.toLocaleDateString('tr-TR', options);
  },
  
  // Utility function for API calls (future use)
  apiCall: function(endpoint, options = {}) {
    console.log(`API call to: ${endpoint}`);
    // Future: Implement fetch-based API calling functionality
    return Promise.resolve({ message: 'Demo API response' });
  },
  
  // Accessibility helper
  announceToScreenReader: function(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
  
  // New utility methods for enhanced features
  ThemeManager: ThemeManager,
  ToolsFilter: ToolsFilter
};

// START: Version Log Display Feature
const VersionLogManager = {
  // Configuration
  PLACEHOLDER_DATE: '2025-07-06 14:30',
  LOG_FILE_PATH: 'logs/toolvana_checklist_latest.md',
  
  // Initialize version log display
  init: function() {
    this.displayLastUpdateTime();
    this.setupVersionLogLink();
  },
  
  // Display the last update timestamp
  displayLastUpdateTime: function() {
    const timeElement = document.getElementById('last-update-time');
    if (!timeElement) return;
    
    // Use placeholder for now - this can be automated later
    const lastUpdateTime = this.PLACEHOLDER_DATE;
    
    // Format the timestamp in Turkish locale
    try {
      const date = new Date(lastUpdateTime);
      const formattedDate = date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const formattedTime = date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      timeElement.textContent = `${formattedDate} ${formattedTime}`;
      timeElement.setAttribute('title', `Son güncelleme: ${formattedDate} ${formattedTime}`);
    } catch (error) {
      // Fallback to original format if date parsing fails
      timeElement.textContent = lastUpdateTime;
      console.warn('Date parsing failed, using fallback format:', error);
    }
  },
  
  // Setup version log link functionality
  setupVersionLogLink: function() {
    const versionLink = document.getElementById('view-version-log');
    if (!versionLink) return;
    
    versionLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.openVersionLog();
    });
    
    // Keyboard support
    versionLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openVersionLog();
      }
    });
  },
  
  // Open version log (future-proof for different viewing methods)
  openVersionLog: function() {
    // For now, show a notification about version logs
    // This can be enhanced to actually load and display the markdown file
    Toolvana.showNotification('Sürüm geçmişi özelliği hazırlanıyor. Logs klasörünü kontrol edin.', 'info');
    
    // Future enhancement: Could load the actual markdown file and display it in a modal
    // or redirect to a dedicated version log page
    console.log('Version log requested. File location:', this.LOG_FILE_PATH);
    
    // Announce to screen readers
    Toolvana.announceToScreenReader('Sürüm geçmişi bağlantısına tıklandı');
  },
  
  // Future method to actually fetch and parse version logs
  loadVersionLogs: async function() {
    try {
      // This method can be enhanced later to actually fetch the markdown files
      console.log('Future enhancement: Load version logs from', this.LOG_FILE_PATH);
      return { message: 'Version logs will be loaded here in future updates' };
    } catch (error) {
      console.error('Error loading version logs:', error);
      return null;
    }
  }
};

// Add VersionLogManager to the Toolvana utility object
Toolvana.VersionLogManager = VersionLogManager;
// END: Version Log Display Feature

// Export for global use
window.Toolvana = Toolvana;
