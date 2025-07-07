/* Throttle Utility - Performance optimization for high-frequency events
 * Limits function execution frequency for scroll, resize events
 */

/**
 * Throttle function execution to improve performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
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

/**
 * Debounce function execution to delay until after calls have stopped
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Request animation frame throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
export function rafThrottle(func) {
  let requestId = null;
  return function(...args) {
    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        func.apply(this, args);
        requestId = null;
      });
    }
  };
}

// Export all utilities
export default {
  throttle,
  debounce,
  rafThrottle
};
