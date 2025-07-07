
// recentTools-init.js - Initialize RecentToolsManager module
import { RecentToolsManager } from './logic/RecentToolsManager.js';

// Initialize recent tools display on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Recent tools system initialized");
  RecentToolsManager.render('#recent-tools-list');
  console.log("✅ Recent tools loaded");
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Recent tools system initialized");
    RecentToolsManager.render('#recent-tools-list');
    console.log("✅ Recent tools loaded");
  });
} else {
  console.log("✅ Recent tools system initialized");
  RecentToolsManager.render('#recent-tools-list');
  console.log("✅ Recent tools loaded");
}
