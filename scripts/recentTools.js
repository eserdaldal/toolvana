
// recentTools.js - Main module for recent tools functionality
import { saveRecentTool, getRecentTools, renderRecentTools } from './logic/recentTools.js';

// Export functions for external use
export { saveRecentTool, getRecentTools, renderRecentTools };

// Initialize recent tools display on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Recent tools system initialized");
  renderRecentTools();
  console.log("✅ Recent tools loaded");
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Recent tools system initialized");
    renderRecentTools();
    console.log("✅ Recent tools loaded");
  });
} else {
  console.log("✅ Recent tools system initialized");
  renderRecentTools();
  console.log("✅ Recent tools loaded");
}
