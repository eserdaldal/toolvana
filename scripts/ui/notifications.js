
/* Notifications UI - Toast notification system
 * Shows success, error, and info messages to users
 */

export function initNotifications() {
  addNotificationStyles();
  console.log('Notifications system initialized');
}

// Auto-dismiss timer helper
function scheduleAutoDismiss(notification) {
  setTimeout(() => {
    removeNotification(notification);
  }, 3000);
}

export function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  const notification = createNotificationElement(message, type);
  displayNotification(notification);
  scheduleAutoDismiss(notification);
  announceToScreenReader(message);
  
  // Helper function to display notification with animation
  function displayNotification(notification) {
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
  }
}

function createNotificationElement(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.className = 'notification-close';
  closeButton.setAttribute('aria-label', 'Bildirimi kapat');
  closeButton.addEventListener('click', () => removeNotification(notification));
  
  notification.appendChild(closeButton);
  
  return notification;
}

function removeNotification(notification) {
  notification.style.opacity = '0';
  notification.style.transform = 'translateX(100%)';
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

function addNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 40px 12px 20px;
      border-radius: 6px;
      z-index: var(--z-modal);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease-out;
      font-family: var(--font-family);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      box-shadow: var(--shadow-medium);
      max-width: 300px;
      word-wrap: break-word;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .notification-success {
      background: var(--success-color);
      color: white;
    }
    
    .notification-error {
      background: var(--error-color);
      color: white;
    }
    
    .notification-warning {
      background: var(--warning-color);
      color: white;
    }
    
    .notification-info {
      background: var(--accent-color);
      color: white;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: inherit;
      font-size: 18px;
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    @media (max-width: 480px) {
      .notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `;
  document.head.appendChild(style);
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Export for global use
window.showNotification = showNotification;
