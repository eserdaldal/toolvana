
/* Smooth Scroll UI - Smooth scrolling navigation functionality
 * Handles anchor link clicks and scroll animations
 */

export function initSmoothScroll() {
  setupNavigationLinks();
  setupCTAButton();
  initActiveNavigation();
  
  console.log('Smooth scroll initialized');
  
  // Helper function to setup navigation links
  function setupNavigationLinks() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });
  }
  
  // Helper function to setup CTA button
  function setupCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', handleCTAClick);
    }
  }
}

// Shared scroll target logic
function scrollToTarget(targetSelector) {
  const targetSection = document.querySelector(targetSelector);
  if (targetSection) {
    scrollToSection(targetSection);
  }
}

function handleNavClick(e) {
  e.preventDefault();
  const targetId = e.target.getAttribute('href');
  scrollToTarget(targetId);
}

function handleCTAClick() {
  scrollToTarget('#araclar');
}

function scrollToSection(targetSection) {
  const headerHeight = document.querySelector('.header').offsetHeight;
  const targetPosition = targetSection.offsetTop - headerHeight - 20;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  
  // Set focus for accessibility
  targetSection.setAttribute('tabindex', '-1');
  targetSection.focus();
  setTimeout(() => {
    targetSection.removeAttribute('tabindex');
  }, 1000);
}

function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  const updateActiveNav = throttle(() => {
    const scrollPosition = window.scrollY + 150;
    let activeSection = null;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSection = sectionId;
      }
    });
    
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

// Import throttle function
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
