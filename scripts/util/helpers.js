
/* Helper Utilities - Common utility functions
 * Date formatting, validation, DOM manipulation helpers
 */

/**
 * Format date in Turkish locale
 * @param {Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  const formatOptions = { ...defaultOptions, ...options };
  return date.toLocaleDateString('tr-TR', formatOptions);
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to URL-friendly slug
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
export function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get element by ID safely
 * @param {string} id - Element ID
 * @returns {Element|null} Element or null
 */
export function getElement(id) {
  return document.getElementById(id);
}

/**
 * Get elements by class name safely
 * @param {string} className - Class name
 * @returns {NodeList} Elements
 */
export function getElements(className) {
  return document.querySelectorAll(`.${className}`);
}

/**
 * Add screen reader only announcement
 * @param {string} message - Message to announce
 */
export function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} Is in viewport
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Add CSS class safely
 * @param {Element} element - Target element
 * @param {string} className - Class to add
 */
export function addClass(element, className) {
  if (element && className) {
    element.classList.add(className);
  }
}

/**
 * Remove CSS class safely
 * @param {Element} element - Target element
 * @param {string} className - Class to remove
 */
export function removeClass(element, className) {
  if (element && className) {
    element.classList.remove(className);
  }
}

/**
 * Toggle CSS class safely
 * @param {Element} element - Target element
 * @param {string} className - Class to toggle
 * @param {boolean} force - Force add/remove
 */
export function toggleClass(element, className, force) {
  if (element && className) {
    return element.classList.toggle(className, force);
  }
  return false;
}

/**
 * Create element with attributes
 * @param {string} tagName - Tag name
 * @param {Object} attributes - Element attributes
 * @param {string} textContent - Text content
 * @returns {Element} Created element
 */
export function createElement(tagName, attributes = {}, textContent = '') {
  const element = document.createElement(tagName);
  
  Object.keys(attributes).forEach(key => {
    if (key === 'className') {
      element.className = attributes[key];
    } else if (key === 'innerHTML') {
      element.innerHTML = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  
  if (textContent) {
    element.textContent = textContent;
  }
  
  return element;
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
      return null;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage for key "${key}":`, error);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing from localStorage for key "${key}":`, error);
      return false;
    }
  }
};

// Export all utilities
export default {
  formatDate,
  isValidEmail,
  generateId,
  capitalize,
  slugify,
  getElement,
  getElements,
  announceToScreenReader,
  isInViewport,
  addClass,
  removeClass,
  toggleClass,
  createElement,
  storage
};
