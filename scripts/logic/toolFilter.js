
/* Tool Filter Logic - Search and filter functionality for tools
 * Handles tool search, filtering, and highlighting
 */

export function initToolFilter() {
  createSearchBar();
  setupSearchLogic();
  console.log('Tool filter system initialized');
}

// DOM query helpers
function findToolsSection() {
  return document.querySelector('#araclar');
}

function findToolsGrid() {
  const toolsSection = findToolsSection();
  return toolsSection ? toolsSection.querySelector('.tools-grid') : null;
}

function getToolsElements() {
  const toolsSection = findToolsSection();
  const toolsGrid = findToolsGrid();
  return { toolsSection, toolsGrid };
}

function findSearchInput() {
  return document.querySelector('#tools-search');
}

function findResultsCount() {
  return document.querySelector('.search-results-count');
}

function getSearchElements() {
  const searchInput = findSearchInput();
  const resultsCount = findResultsCount();
  return { searchInput, resultsCount };
}

// Search container creation helpers
function createSearchInputHTML() {
  return `
    <input 
      type="text" 
      class="search-input" 
      placeholder="Araç ara... (örn: metin, görsel)" 
      aria-label="Araçlarda ara"
      id="tools-search"
    >`;
}

function createResultsCountHTML() {
  return `<div class="search-results-count" aria-live="polite"></div>`;
}

function createSearchContainerHTML() {
  return createSearchInputHTML() + createResultsCountHTML();
}

function createSearchContainer() {
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = createSearchContainerHTML();
  return searchContainer;
}

function insertSearchContainer(toolsGrid) {
  const searchContainer = createSearchContainer();
  toolsGrid.parentNode.insertBefore(searchContainer, toolsGrid);
}

// Search bar setup helpers
function addSearchStyles() {
  const style = document.createElement('style');
  style.textContent = getSearchStylesCSS();
  document.head.appendChild(style);
}

function getSearchStylesCSS() {
  return `
    .search-container {
      margin: 2rem auto 3rem;
      max-width: 500px;
      text-align: center;
      background-color: var(--card-background);
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-light);
    }
    
    .search-input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      transition: border-color var(--transition-normal);
      font-family: var(--font-family);
    }
    
    .search-input:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    
    .search-results-count {
      margin-top: 0.5rem;
      font-size: var(--font-size-sm);
      color: var(--text-light);
      min-height: 20px;
    }
    
    .tool-card.hidden {
      display: none;
    }
    
    .search-highlight {
      background-color: #ffeb3b;
      color: #000;
      font-weight: var(--font-weight-semibold);
      padding: 1px 2px;
      border-radius: 2px;
    }
  `;
}

function createSearchBar() {
  const { toolsSection, toolsGrid } = getToolsElements();
  if (!toolsSection || !toolsGrid) return;
  
  addSearchStyles();
  insertSearchContainer(toolsGrid);
}

// Search logic setup helpers
function createDebouncedSearch(resultsCount) {
  return debounce((searchTerm) => {
    filterTools(searchTerm, resultsCount);
  }, 300);
}

function handleSearchInput(searchInput, performSearch) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    performSearch(searchTerm);
  });
}

function clearSearchOnEscape(searchInput, resultsCount) {
  searchInput.value = '';
  filterTools('', resultsCount);
  searchInput.blur();
}

function handleEscapeKey(searchInput, resultsCount) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearSearchOnEscape(searchInput, resultsCount);
    }
  });
}

function setupSearchLogic() {
  const { searchInput, resultsCount } = getSearchElements();
  
  if (!searchInput || !resultsCount) return;
  
  const performSearch = createDebouncedSearch(resultsCount);
  
  handleSearchInput(searchInput, performSearch);
  handleEscapeKey(searchInput, resultsCount);
}

// Tool card element helpers
function getToolTitle(card) {
  return card.querySelector('h3');
}

function getToolDescription(card) {
  return card.querySelector('p');
}

function getToolCardElements(card) {
  const title = getToolTitle(card);
  const description = getToolDescription(card);
  return { title, description };
}

// Text matching helpers
function normalizeText(text) {
  return text.toLowerCase();
}

function checkTitleMatch(title, searchTerm) {
  const titleText = normalizeText(title.textContent);
  const searchLower = normalizeText(searchTerm);
  return titleText.includes(searchLower);
}

function checkDescriptionMatch(description, searchTerm) {
  const descText = normalizeText(description.textContent);
  const searchLower = normalizeText(searchTerm);
  return descText.includes(searchLower);
}

function checkTextMatches(title, description, searchTerm) {
  const titleMatch = checkTitleMatch(title, searchTerm);
  const descMatch = checkDescriptionMatch(description, searchTerm);
  return { titleMatch, descMatch };
}

// Card visibility helpers
function showCard(card) {
  card.classList.remove('hidden');
}

function hideCard(card) {
  card.classList.add('hidden');
}

function applyCardVisibility(card, isVisible) {
  if (isVisible) {
    showCard(card);
  } else {
    hideCard(card);
  }
}

// Text highlighting helpers
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createHighlightRegex(searchTerm) {
  return new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
}

function applyHighlightToElement(element, searchTerm) {
  const originalText = element.textContent;
  const regex = createHighlightRegex(searchTerm);
  const highlightedHTML = originalText.replace(regex, '<span class="search-highlight">$1</span>');
  element.innerHTML = highlightedHTML;
}

function highlightText(element, searchTerm) {
  applyHighlightToElement(element, searchTerm);
}

function removeHighlightsFromCard(card) {
  const highlighted = card.querySelectorAll('.search-highlight');
  highlighted.forEach(span => {
    const parent = span.parentNode;
    parent.replaceChild(document.createTextNode(span.textContent), span);
    parent.normalize();
  });
}

function removeHighlights(card) {
  removeHighlightsFromCard(card);
}

function applyHighlights(title, description, titleMatch, descMatch, searchTerm) {
  if (titleMatch) {
    highlightText(title, searchTerm);
  }
  if (descMatch) {
    highlightText(description, searchTerm);
  }
}

// Results count helpers
function getNoResultsMessage() {
  return 'Hiç araç bulunamadı';
}

function getResultsFoundMessage(count) {
  return `${count} araç bulundu`;
}

function formatResultsMessage(searchTerm, visibleCount) {
  if (searchTerm) {
    return visibleCount === 0 ? 
      getNoResultsMessage() : 
      getResultsFoundMessage(visibleCount);
  }
  return '';
}

function updateResultsCount(searchTerm, visibleCount, resultsCount) {
  const message = formatResultsMessage(searchTerm, visibleCount);
  resultsCount.textContent = message;
}

// Main filter function helpers
function getAllToolCards() {
  return document.querySelectorAll('.tool-card');
}

function processEmptySearch(card) {
  applyCardVisibility(card, true);
  return 1; // Count as visible
}

function processSearchMatch(card, title, description, searchTerm) {
  const { titleMatch, descMatch } = checkTextMatches(title, description, searchTerm);
  const isVisible = titleMatch || descMatch;
  
  applyCardVisibility(card, isVisible);
  
  if (isVisible) {
    applyHighlights(title, description, titleMatch, descMatch, searchTerm);
    return 1; // Count as visible
  }
  
  return 0; // Not visible
}

function processToolCard(card, searchTerm) {
  const { title, description } = getToolCardElements(card);
  
  if (!title || !description) return 0;
  
  // Remove previous highlights
  removeHighlights(card);
  
  if (!searchTerm) {
    return processEmptySearch(card);
  }
  
  return processSearchMatch(card, title, description, searchTerm);
}

function filterTools(searchTerm, resultsCount) {
  const toolCards = getAllToolCards();
  let visibleCount = 0;
  
  toolCards.forEach(card => {
    visibleCount += processToolCard(card, searchTerm);
  });
  
  updateResultsCount(searchTerm, visibleCount, resultsCount);
}

// Debounce utility
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
