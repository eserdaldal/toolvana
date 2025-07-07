
/* Theme Toggle UI - Dark/light theme switching functionality
 * Manages theme state, persistence, and UI updates
 */

const STORAGE_KEY = 'toolvana_theme_preference';
const DARK_CLASS = 'dark-mode';

export function initThemeToggle() {
  initializeThemeToggle();
  loadThemePreference();
  setupThemeStyles();
  console.log('Theme toggle initialized');
  
  // Helper function to initialize theme toggle
  function initializeThemeToggle() {
    createThemeToggle();
  }
}

// DOM creation helper
function createToggleButton() {
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Tema değiştir');
  themeToggle.setAttribute('title', 'Koyu/Açık tema arasında geçiş yap');
  themeToggle.innerHTML = `
    <span class="theme-icon light-icon">☀️</span>
    <span class="theme-icon dark-icon">🌙</span>
  `;
  return themeToggle;
}

// DOM insertion helper
function insertToggleToNavbar(themeToggle, navbar) {
  const mobileToggle = navbar.querySelector('.mobile-menu-toggle');
  if (mobileToggle) {
    navbar.insertBefore(themeToggle, mobileToggle);
  } else {
    navbar.appendChild(themeToggle);
  }
}

// Event listeners helper
function bindToggleEvents(themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

function createThemeToggle() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const themeToggle = createToggleButton();
  insertToggleToNavbar(themeToggle, navbar);
  bindToggleEvents(themeToggle);
}

function setupThemeStyles() {
  // Theme styles are handled in themes.css
  // This function can add dynamic styles if needed
}

function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains(DARK_CLASS);
  
  if (isDark) {
    body.classList.remove(DARK_CLASS);
    saveThemePreference('light');
    announceThemeChange('Açık tema aktif edildi');
  } else {
    body.classList.add(DARK_CLASS);
    saveThemePreference('dark');
    announceThemeChange('Koyu tema aktif edildi');
  }
}

function saveThemePreference(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Error saving theme preference:', error);
  }
}

function loadThemePreference() {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    
    if (!savedTheme) {
      // Detect system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add(DARK_CLASS);
      }
      return;
    }
    
    if (savedTheme === 'dark') {
      document.body.classList.add(DARK_CLASS);
    }
  } catch (error) {
    console.warn('Error loading theme preference:', error);
  }
}

function announceThemeChange(message) {
  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
