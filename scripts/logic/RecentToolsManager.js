
/**
 * RecentToolsManager.js - Manages recently used tools with enhanced metadata
 * Handles saving, retrieving, and rendering recently used tool objects
 */

const RecentToolsManager = {
  // Configuration constants
  STORAGE_KEY: 'toolvana_recent',
  MAX_RECENT_TOOLS: 5,

  // Predefined tool mapping
  TOOL_MAP: {
    "kalori-hesaplayici": { name: "Kalori Hesaplayıcı", url: "/tools/kalori-hesaplayici.html" },
    "thumbnail-olusturucu": { name: "YouTube Thumbnail Oluşturucu", url: "/tools/thumbnail-olusturucu.html" },
    "pdf-donusturucu": { name: "PDF Dönüştürücü", url: "/tools/pdf-donusturucu.html" },
    "kelime-sayaci": { name: "Kelime Sayacı", url: "/tools/kelime-sayaci.html" }
  },

  /**
   * Save a tool to recent tools list
   * @param {string} toolId - The tool identifier to save
   */
  save(toolId) {
    // Validate input
    if (!this._isValidToolId(toolId)) {
      console.warn('Invalid toolId:', toolId);
      return;
    }

    // Get tool metadata from TOOL_MAP
    const toolData = this.TOOL_MAP[toolId];
    if (!toolData) {
      console.warn('Tool not found in TOOL_MAP:', toolId);
      return;
    }

    try {
      // Get current recent tools
      let recentTools = this.get();

      // Remove duplicate if exists (based on id)
      recentTools = recentTools.filter(tool => tool.id !== toolId);

      // Create new tool object
      const newTool = {
        id: toolId,
        name: toolData.name,
        url: toolData.url,
        timestamp: Date.now()
      };

      // Add to beginning (most recent first)
      recentTools.unshift(newTool);

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
   * Get array of recent tool objects
   * @returns {Array} Array of tool objects, most recent first
   */
  get() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      
      // Ensure we return an array and validate entries
      if (!Array.isArray(parsed)) {
        return [];
      }

      // Filter and validate entries
      return parsed
        .filter(tool => this._isValidToolObject(tool))
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
    recentTools.forEach(tool => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      
      link.href = tool.url;
      link.textContent = tool.name;
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
   * Validate tool object structure
   * @param {*} tool - Tool object to validate
   * @returns {boolean} True if valid tool object
   * @private
   */
  _isValidToolObject(tool) {
    return tool && 
           typeof tool === 'object' &&
           typeof tool.id === 'string' &&
           typeof tool.name === 'string' &&
           typeof tool.url === 'string' &&
           typeof tool.timestamp === 'number' &&
           tool.id.trim().length > 0 &&
           tool.name.trim().length > 0 &&
           tool.url.trim().length > 0;
  }
};

// Export for module use
export { RecentToolsManager };

// Also make available globally for compatibility
window.RecentToolsManager = RecentToolsManager;
