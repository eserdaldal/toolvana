
// recentTools.js - Kullanıcının son kullandığı araçları yönetir

const STORAGE_KEY = "toolvana_recent";
const MAX_ITEMS = 5;

/**
 * Son kullanılan aracı localStorage'a kaydeder
 * @param {string} toolId
 */
export function saveRecentTool(toolId) {
  try {
    // Validate input
    if (!toolId || typeof toolId !== 'string' || toolId.trim() === '') {
      console.warn("Geçersiz toolId:", toolId);
      return;
    }

    // Clean the toolId
    const cleanToolId = toolId.trim();
    
    // Get existing tools
    let tools = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Ensure tools is always an array
    if (!Array.isArray(tools)) {
      tools = [];
    }

    // Remove duplicate if exists (case-insensitive comparison for safety)
    tools = tools.filter(id => 
      typeof id === 'string' && id.toLowerCase() !== cleanToolId.toLowerCase()
    );

    // Add to the beginning (most recent first)
    tools.unshift(cleanToolId);

    // Limit to MAX_ITEMS (5 items)
    if (tools.length > MAX_ITEMS) {
      tools = tools.slice(0, MAX_ITEMS);
    }

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    
    console.log(`✅ Araç kaydedildi: ${cleanToolId}`);
  } catch (e) {
    console.warn("Son kullanılan araç kaydedilemedi:", e);
  }
}

/**
 * Son kullanılan araçları getir
 * @returns {string[]} toolId listesi (en son kullanılan başta)
 */
export function getRecentTools() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const tools = JSON.parse(stored);
    
    // Ensure we return an array and filter out invalid entries
    if (!Array.isArray(tools)) {
      return [];
    }

    // Filter out any invalid entries and limit to MAX_ITEMS
    const validTools = tools
      .filter(id => typeof id === 'string' && id.trim() !== '')
      .slice(0, MAX_ITEMS);

    return validTools;
  } catch (e) {
    console.warn("Son kullanılan araçlar yüklenemedi:", e);
    return [];
  }
}

/**
 * Arayüze "Son Kullanılan Araçlar" listesini basar
 * HTML: <ul class="recent-tools-list"> ... </ul>
 */
export function renderRecentTools() {
  const container = document.querySelector("#recent-tools-list");
  if (!container) return;

  const tools = getRecentTools();
  container.innerHTML = "";

  if (tools.length === 0) {
    container.innerHTML = "<li>Henüz araç kullanılmadı</li>";
    return;
  }

  tools.forEach(id => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `/tools/${id}.html`;
    link.textContent = getToolName(id);
    link.className = "widget-link";
    li.appendChild(link);
    container.appendChild(li);
  });
}

// Basit ID → isim eşlemesi
function getToolName(id) {
  const map = {
    "kelime-sayaci": "Kelime Sayacı",
    "pdf-donusturucu": "PDF Dönüştürücü",
    "kalori-hesaplayici": "Kalori Hesaplayıcı",
    "thumbnail-olusturucu": "YouTube Thumbnail Oluşturucu"
  };
  return map[id] || id;
}
