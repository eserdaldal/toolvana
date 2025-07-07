
/**
 * RecentToolsManager.js - Manages recently used tools
 * Handles saving, retrieving, and rendering recently used tool identifiers
 */

const RecentToolsManager = {
  // Configuration constants
  STORAGE_KEY: 'toolvana_recent',
  MAX_RECENT_TOOLS: 5,

  /**
   * Save a tool ID to recent tools list
   * @param {string} toolId - The tool identifier to save
   */
  save(toolId) {
    // Validate input
    if (!this._isValidToolId(toolId)) {
      return;
    }

    try {
      // Get current recent tools
      let recentTools = this.get();

      // Remove duplicate if exists (case-insensitive)
      recentTools = recentTools.filter(id => 
        id.toLowerCase() !== toolId.toLowerCase()
      );

      // Add to beginning (most recent first)
      recentTools.unshift(toolId);

      // Keep only max number of tools
      if (recentTools.length > this.MAX_RECENT_TOOLS) {
        recentTools = recentTools.slice(0, this.MAX_RECENT_TOOLS);
      }

      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentTools));
    } catch (error) {
      console.warn('Error saving recent tool:', error);
    }
  },

  /**
   * Get array of recent tool IDs
   * @returns {string[]} Array of tool IDs, most recent first
   */
  get() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      
      // Ensure we return an array and filter out invalid entries
      if (!Array.isArray(parsed)) {
        return [];
      }

      // Filter and validate entries
      return parsed
        .filter(id => this._isValidToolId(id))
        .slice(0, this.MAX_RECENT_TOOLS);
    } catch (error) {
      console.warn('Error loading recent tools:', error);
      return [];
    }
  },

  /**
   * Render recent tools list to DOM
   * @param {string} selector - CSS selector for container element
   */
  render(selector) {
    const container = document.querySelector(selector);
    if (!container) {
      console.warn('Container not found for selector:', selector);
      return;
    }

    const recentTools = this.get();
    container.innerHTML = '';

    if (recentTools.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.textContent = 'Henüz araç kullanılmadı';
      container.appendChild(emptyItem);
      return;
    }

    // Create list items for each recent tool
    recentTools.forEach(toolId => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      
      link.href = `/tools/${toolId}.html`;
      link.textContent = this._getToolDisplayName(toolId);
      link.className = 'widget-link';
      
      listItem.appendChild(link);
      container.appendChild(listItem);
    });
  },

  /**
   * Validate tool ID input
   * @param {*} toolId - Value to validate
   * @returns {boolean} True if valid tool ID
   * @private
   */
  _isValidToolId(toolId) {
    return typeof toolId === 'string' && toolId.trim().length > 0;
  },

  /**
   * Get display name for tool ID
   * @param {string} toolId - Tool identifier
   * @returns {string} Human-readable tool name
   * @private
   */
  _getToolDisplayName(toolId) {
    const displayNames = {
      'kelime-sayaci': 'Kelime Sayacı',
      'pdf-donusturucu': 'PDF Dönüştürücü',
      'kalori-hesaplayici': 'Kalori Hesaplayıcı',
      'thumbnail-olusturucu': 'YouTube Thumbnail Oluşturucu'
    };
    
    return displayNames[toolId] || toolId;
  }
};

// Export for module use
export { RecentToolsManager };
