
/* Mobile Menu UI - Mobile navigation menu functionality
 * Handles hamburger menu toggle, animations, and accessibility
 */

export function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!mobileToggle || !navLinks) {
    console.warn('Mobile menu elements not found');
    return;
  }
  
  // Setup initial ARIA attributes
  mobileToggle.setAttribute('aria-label', 'Mobil menüyü aç/kapat');
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-controls', 'mobile-nav');
  navLinks.setAttribute('id', 'mobile-nav');
  navLinks.setAttribute('aria-hidden', 'true');
  
  // Setup toggle functionality
  setupToggleFunction();
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('Mobile menu initialized');
  
  // Helper function to setup toggle functionality
  function setupToggleFunction() {
    // Toggle menu function
    function toggleMenu(isOpen) {
      if (isOpen === undefined) {
        isOpen = !navLinks.classList.contains('active');
      }
      
      navLinks.classList.toggle('active', isOpen);
      setAriaAttributes(isOpen);
      animateHamburgerIcon(isOpen);
      
      console.log('Mobile menu toggled:', isOpen);
    }
    
    // Make toggleMenu available to event listeners
    window.toggleMobileMenu = toggleMenu;
  }
  
  // Helper function to setup all event listeners
  function setupEventListeners() {
    // Main toggle click
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      window.toggleMobileMenu();
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        window.toggleMobileMenu(false);
        mobileToggle.focus();
      }
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => window.toggleMobileMenu(false));
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        if (navLinks.classList.contains('active')) {
          window.toggleMobileMenu(false);
        }
      }
    });
  }
}
