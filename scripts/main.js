/* Main JavaScript - Application entry point and initialization
 * Coordinates all modules and handles overall app lifecycle
 */

// Import all modules
import { initMobileMenu } from './ui/mobileMenu.js';
import { initThemeToggle } from './ui/themeToggle.js';
import { initSmoothScroll } from './ui/smoothScroll.js';
import { initNotifications } from './ui/notifications.js';
import { initGreeting } from './logic/greeting.js';
import { RecentToolsManager } from './logic/RecentToolsManager.js';
import { initToolFilter } from './logic/toolFilter.js';
import { RecentToolsManager } from './logic/RecentToolsManager.js';

// Application state
const App = {
  initialized: false,
  modules: [],

  // Initialize the application
  async init() {
    if (this.initialized) {
      console.warn('Application already initialized');
      return;
    }

    try {
      console.log('Initializing Toolvana application...');

      // Initialize greeting first
      initGreeting();

      // Initialize UI modules
      await Promise.all([
        initMobileMenu(),
        initThemeToggle(),
        initSmoothScroll(),
        initNotifications()
      ]);

      // Initialize logic modules
      await Promise.all([
        Promise.resolve(RecentToolsManager.render('#recent-tools-list')),
        initToolFilter()
      ]);

      // Mark as initialized
      this.initialized = true;
      console.log('Toolvana application initialized successfully!');

      // Dispatch custom event for other scripts
      document.dispatchEvent(new CustomEvent('toolvanaloaded', {
        detail: { timestamp: Date.now() }
      }));

    } catch (error) {
      console.error('Error initializing Toolvana application:', error);
    }
  },

  // Register a module
  registerModule(name, module) {
    this.modules.push({ name, module });
    console.log(`Module registered: ${name}`);
  },

  // Get application info
  getInfo() {
    return {
      name: 'Toolvana',
      version: '1.0.0',
      initialized: this.initialized,
      modules: this.modules.map(m => m.name)
    };
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  // Initialize RecentToolsManager
  console.log('🔧 Initializing RecentToolsManager...');
  RecentToolsManager.render('#recent-tools-list');

  // Test saving a tool ID for demonstration
  console.log('💾 Testing RecentToolsManager.save()...');
  RecentToolsManager.save('kelime-sayaci');

  // Log current state for verification
  console.log('📋 Current recent tools:', RecentToolsManager.get());
  console.log('🗂️ LocalStorage key "toolvana_recent":', localStorage.getItem('toolvana_recent'));

  // Re-render to show the saved tool
  RecentToolsManager.render('#recent-tools-list');
  console.log('✅ RecentToolsManager integration complete');
});

// Recent Tools Management
const RecentToolsManager = {
  STORAGE_KEY: 'toolvana_recent_tools',
  MAX_RECENT_TOOLS: 5,

  // Save a recently clicked tool
  saveRecentTool: function(toolData) {
    try {
      let recentTools = this.getRecentTools();

      // Remove if already exists to avoid duplicates
      recentTools = recentTools.filter(tool => tool.id !== toolData.id);

      // Add to beginning of array
      recentTools.unshift(toolData);

      // Keep only max number of tools
      if (recentTools.length > this.MAX_RECENT_TOOLS) {
        recentTools = recentTools.slice(0, this.MAX_RECENT_TOOLS);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentTools));
      this.displayRecentTools();
    } catch (error) {
      console.warn('Error saving recent tool:', error);
    }
  },

  // Get recent tools from localStorage
  getRecentTools: function() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error loading recent tools:', error);
      return [];
    }
  },

  // Display recent tools in the UI
  displayRecentTools: function() {
    const recentSection = document.getElementById('recent-tools');
    if (!recentSection) return;

    const recentTools = this.getRecentTools();

    if (recentTools.length === 0) {
      recentSection.innerHTML = '<p class="no-recent-tools">Henüz kullanılmış araç yok</p>';
      return;
    }

    const toolsHTML = recentTools.map(tool => `
      <div class="recent-tool-item" data-tool-id="${tool.id}">
        <a href="${tool.link}" class="recent-tool-link">
          <span class="recent-tool-icon">${tool.icon || '🔧'}</span>
          <span class="recent-tool-name">${tool.name}</span>
        </a>
      </div>
    `).join('');

    recentSection.innerHTML = toolsHTML;
  },

  // Initialize recent tools tracking
  init: function() {
    this.displayRecentTools();
    this.attachToolClickListeners();
  },

  // Attach click listeners to tool cards
  attachToolClickListeners: function() {
    // Use event delegation to handle dynamically added tools
    document.addEventListener('click', (e) => {
      const toolCard = e.target.closest('.tool-card');
      if (!toolCard) return;

      // Extract tool data from the card
      const toolData = this.extractToolData(toolCard);
      if (toolData) {
        this.saveRecentTool(toolData);
      }
    });
  },

  // Extract tool data from a tool card element
  extractToolData: function(toolCard) {
    try {
      const titleElement = toolCard.querySelector('h3');
      const linkElement = toolCard.querySelector('a');

      if (!titleElement || !linkElement) return null;

      return {
        id: linkElement.href || titleElement.textContent.toLowerCase().replace(/\s+/g, '-'),
        name: titleElement.textContent.trim(),
        link: linkElement.href,
        icon: this.getToolIcon(titleElement.textContent),
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('Error extracting tool data:', error);
      return null;
    }
  },

  // Get appropriate icon for tool type
  getToolIcon: function(toolName) {
    const iconMap = {
      'hesap makinesi': '🧮',
      'calculator': '🧮',
      'converter': '🔄',
      'dönüştürücü': '🔄',
      'generator': '⚡',
      'üretici': '⚡',
      'validator': '✅',
      'doğrulayıcı': '✅'
    };

    const lowerName = toolName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    return '🔧';
  }
};

// Theme Management Preparation (UI implementation in separate module)
const ThemeManager = {
  STORAGE_KEY: 'toolvana_theme_preference',
  DARK_CLASS: 'dark-mode',
  currentTheme: 'light',

  // Initialize theme system
  init: function() {
    this.loadThemePreference();
    this.setupThemeChangeListener();
  },

  // Load saved theme preference
  loadThemePreference: function() {
    try {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);

      if (!savedTheme) {
        // Detect system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = prefersDark ? 'dark' : 'light';
      } else {
        this.currentTheme = savedTheme;
      }

      this.applyTheme(this.currentTheme);
    } catch (error) {
      console.warn('Error loading theme preference:', error);
    }
  },

  // Apply theme to document
  applyTheme: function(theme) {
    const body = document.body;

    if (theme === 'dark') {
      body.classList.add(this.DARK_CLASS);
    } else {
      body.classList.remove(this.DARK_CLASS);
    }

    this.currentTheme = theme;
  },

  // Save theme preference
  saveThemePreference: function(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  },

  // Toggle between themes (to be called by UI toggle)
  toggleTheme: function() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.saveThemePreference(newTheme);

    // Dispatch custom event for other components
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: newTheme }
    }));

    return newTheme;
  },

  // Get current theme
  getCurrentTheme: function() {
    return this.currentTheme;
  },

  // Listen for system theme changes
  setupThemeChangeListener: function() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // Only apply system preference if user hasn't set a preference
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        if (!savedTheme) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }
};

// Add new methods to main App object
Object.assign(App, {
  // Load recent tools on initialization
  loadRecentTools: function() {
    RecentToolsManager.init();
    console.log('Recent tools loaded');
  },

  // Get recent tools (public API)
  getRecentTools: function() {
    return RecentToolsManager.getRecentTools();
  },

  // Clear recent tools (public API)
  clearRecentTools: function() {
    try {
      localStorage.removeItem(RecentToolsManager.STORAGE_KEY);
      RecentToolsManager.displayRecentTools();
      console.log('Recent tools cleared');
    } catch (error) {
      console.warn('Error clearing recent tools:', error);
    }
  },

  // Theme management methods
  toggleTheme: function() {
    return ThemeManager.toggleTheme();
  },

  getCurrentTheme: function() {
    return ThemeManager.getCurrentTheme();
  }
});

// Update initialization to include new features
const originalInit = App.init;
App.init = async function() {
  if (this.initialized) {
    console.warn('Application already initialized');
    return;
  }

  try {
    console.log('Initializing Toolvana application...');

    // Initialize theme first
    ThemeManager.init();

    // Initialize greeting first
    initGreeting();

    // Initialize UI modules
    await Promise.all([
      initMobileMenu(),
      initThemeToggle(),
      initSmoothScroll(),
      initNotifications()
    ]);

    // Initialize logic modules
    await Promise.all([
      Promise.resolve(RecentToolsManager.render('#recent-tools-list')),
      initToolFilter()
    ]);

    // Initialize new features
    this.loadRecentTools();

    // Mark as initialized
    this.initialized = true;
    console.log('Toolvana application initialized successfully!');

    // Dispatch custom event for other scripts
    document.dispatchEvent(new CustomEvent('toolvanaloaded', {
      detail: { timestamp: Date.now() }
    }));

  } catch (error) {
    console.error('Error initializing Toolvana application:', error);
  }
};

// Export for global access
window.Toolvana = App;

export default App;