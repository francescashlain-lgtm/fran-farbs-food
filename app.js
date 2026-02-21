// Firebase imports
import {
  signInWithGoogle,
  signOutUser,
  getCurrentUser,
  setAuthStateCallback,
  saveToCloud,
  loadFromCloud
} from './firebase-config.js';

// Seasonal produce data
const seasonalProduce = {
  january: ['beetroot', 'broccoli rabe', 'cabbage', 'carrots', 'celery root', 'chestnuts', 'collard greens', 'crabapples', 'endive', 'escarole', 'horseradish', 'kohlrabi', 'leeks', 'parsnips', 'potatoes', 'rosemary', 'rutabaga', 'salsify', 'sumac', 'sunchokes', 'turnips', 'winter squash'],
  february: ['beetroot', 'bok choy', 'broccoli', 'cabbage', 'celeriac', 'collard greens', 'grapefruit', 'horseradish', 'lemons', 'mushrooms', 'onions', 'oranges', 'parsnips', 'potatoes', 'rosemary', 'rutabaga', 'sage', 'sunchokes', 'swiss chard', 'tangerines', 'turnips', 'winter squash'],
  march: ['artichokes', 'asparagus', 'bok choy', 'broccoli', 'cabbage', 'chicories', 'chives', 'fava beans', 'fiddleheads', 'green peas', 'leeks', 'mushrooms', 'nettles', 'parsley', 'parsnips', 'potatoes', 'radish', 'ramps', 'scallions', 'spinach', 'swiss chard', 'watercress'],
  april: ['artichokes', 'arugula', 'asparagus', 'carrots', 'celery', 'chicories', 'chives', 'dandelion greens', 'fava beans', 'fiddleheads', 'leeks', 'mushrooms', 'new potatoes', 'parsnips', 'pea shoots', 'purslane', 'radishes', 'ramps', 'rapini', 'rhubarb', 'shallots', 'watercress'],
  may: ['artichokes', 'arugula', 'asparagus', 'beet greens', 'chives', 'elderflower', 'fava beans', 'fiddleheads', 'garlic scapes', 'green peas', 'lettuce', 'mushrooms', 'new potatoes', 'parsley', 'pea shoots', 'radishes', 'rhubarb', 'scallions', 'sorrel', 'swiss chard', 'turnip greens', 'watercress'],
  june: ['asparagus', 'beet greens', 'broccoli', 'cherries', 'chives', 'collard greens', 'garlic scapes', 'green peas', 'gooseberries', 'kohlrabi', 'lettuce', 'mulberries', 'mushrooms', 'new potatoes', 'radishes', 'rhubarb', 'scallions', 'squash blossoms', 'strawberries', 'summer squash', 'swiss chard', 'turnip greens'],
  july: ['apricots', 'blueberries', 'carrots', 'cherries', 'cucumber', 'currants', 'eggplant', 'fava beans', 'fresh herbs', 'gooseberries', 'green beans', 'melon', 'peaches', 'peppers', 'plums', 'purslane', 'raspberries', 'summer squash', 'sweet corn', 'swiss chard', 'tart cherries', 'tomatoes'],
  august: ['apricots', 'blackberries', 'blueberries', 'cantaloupe', 'cucumbers', 'currants', 'eggplant', 'garlic', 'grapes', 'green beans', 'ground cherries', 'nectarines', 'peaches', 'pears', 'peppers', 'plums', 'raspberries', 'summer squash', 'sweet corn', 'tomatillos', 'tomatoes', 'winter squash'],
  september: ['apples', 'blackberries', 'broccoli', 'carrots', 'cauliflower', 'cucumbers', 'eggplant', 'elderberries', 'fresh figs', 'grapes', 'ground cherries', 'lima beans', 'melon', 'peaches', 'pears', 'peppers', 'plums', 'raspberries', 'summer squash', 'sweet corn', 'tomatoes', 'winter squash'],
  october: ['apples', 'beets', 'broccoli', 'brussels sprout', 'cabbage', 'cauliflower', 'chestnuts', 'collard greens', 'fresh figs', 'grapes', 'kale', 'leeks', 'melon', 'parsnips', 'pears', 'peppers', 'plums', 'quince', 'radicchio', 'sweet potatoes', 'swiss chard', 'winter squash'],
  november: ['apples', 'beets', 'brussels sprouts', 'cabbage', 'carrots', 'cauliflower', 'chicories', 'collard greens', 'fennel', 'hearty herbs', 'leeks', 'nopales', 'parsnips', 'pears', 'persimmons', 'pomegranate', 'quince', 'romanesco', 'sunchokes', 'swiss chard', 'turnips', 'winter squash'],
  december: ['apples', 'beetroot', 'broccoli', 'cabbage', 'carrots', 'cauliflower', 'celery root', 'fennel', 'hardy herbs', 'horseradish', 'juniper berries', 'leeks', 'mushrooms', 'nopales', 'parsnips', 'persimmon', 'potatoes', 'rutabaga', 'sunchokes', 'swiss chard', 'turnips', 'winter squash']
};

// Default categories
const defaultCategories = [
  'pasta', 'chicken', 'meat', 'beef', 'pork', 'lamb', 'seafood',
  'vegetarian', 'soup', 'salad', 'side', 'bread', 'sauce',
  'dessert', 'baking', 'breakfast', 'lunch', 'smoothie'
];

// Category display names (for nicer formatting)
const categoryDisplayNames = {
  'side': 'Side Dish'
};

// App State
let recipes = [];
let userPreferences = {
  liked: [],
  removed: [],
  notes: {},
  titleEdits: {},
  categoryEdits: {},
  authorEdits: {},
  customCategories: [],
  deletedCategories: []
};
let manageMode = false;
let weeklyPicks = {
  breakfast1: null,
  breakfast2: null,
  lunch1: null,
  lunch2: null,
  lunch3: null,
  pasta: null,
  chicken: null,
  meat: null,
  vegetarian: null
};
let keptRecipes = {
  breakfast1: false,
  breakfast2: false,
  lunch1: false,
  lunch2: false,
  lunch3: false,
  pasta: false,
  chicken: false,
  meat: false,
  vegetarian: false
};
let groceryList = [];
let miscItems = []; // Miscellaneous items not tied to recipes
let skippedRecipes = {
  breakfast1: [],
  breakfast2: [],
  lunch1: [],
  lunch2: [],
  lunch3: [],
  pasta: [],
  chicken: [],
  meat: [],
  vegetarian: []
};
let manuallyKeptRecipes = [];
let dayAssignments = {}; // Maps recipe ID to day number (0=Sunday, 6=Saturday)

// All meal types for iteration
const ALL_MEAL_TYPES = ['breakfast1', 'breakfast2', 'lunch1', 'lunch2', 'lunch3', 'pasta', 'chicken', 'meat', 'vegetarian']; // Recipes kept from the library

// Initialize the app
async function init() {
  loadUserPreferences();

  // Check for URL sync first - this overrides localStorage if present
  const hasUrlSync = checkURLSync();

  if (!hasUrlSync) {
    loadManuallyKeptRecipes();
    loadWeeklyState();
    loadMiscItems();
  }

  loadPrepListState();
  loadDayAssignments();
  await loadRecipes();

  // Resolve any pending sync picks now that recipes are loaded
  resolvePendingSyncPicks();

  setupEventListeners();
  updateSeasonalDisplay();
  renderCategoryFilter();
  restoreOrGenerateWeeklyPicks();
  renderManualPicks();
  renderLibrary();
  updateStartNewWeekButton();
}

// Load manually kept recipes from localStorage
function loadManuallyKeptRecipes() {
  const saved = localStorage.getItem('manuallyKeptRecipes');
  if (saved) {
    manuallyKeptRecipes = JSON.parse(saved);
  }
}

// Load weekly state from localStorage
function loadWeeklyState() {
  const savedKept = localStorage.getItem('keptRecipes');
  const savedPicks = localStorage.getItem('weeklyPicks');
  const savedSkipped = localStorage.getItem('skippedRecipes');

  if (savedKept) {
    // Merge with defaults to handle new keys
    keptRecipes = { ...keptRecipes, ...JSON.parse(savedKept) };
  }
  if (savedPicks) {
    weeklyPicks = { ...weeklyPicks, ...JSON.parse(savedPicks) };
  }
  if (savedSkipped) {
    skippedRecipes = { ...skippedRecipes, ...JSON.parse(savedSkipped) };
  }
}

// Save weekly state to localStorage and cloud
function saveWeeklyState() {
  localStorage.setItem('keptRecipes', JSON.stringify(keptRecipes));
  localStorage.setItem('weeklyPicks', JSON.stringify(weeklyPicks));
  localStorage.setItem('skippedRecipes', JSON.stringify(skippedRecipes));
  if (typeof syncToCloud === 'function') syncToCloud();
}

// ==================== URL SHARING ====================

// Generate a shareable URL with current selections
function generateShareableURL() {
  const state = {
    // Store just the recipe IDs for kept weekly picks
    weeklyPicks: {},
    keptRecipes: keptRecipes,
    manuallyKept: manuallyKeptRecipes,
    groceryList: groceryList,
    miscItems: miscItems,
    // Include user preferences (liked, notes, edits)
    liked: userPreferences.liked,
    notes: userPreferences.notes,
    titleEdits: userPreferences.titleEdits,
    categoryEdits: userPreferences.categoryEdits,
    authorEdits: userPreferences.authorEdits
  };

  // Only include kept recipes
  ALL_MEAL_TYPES.forEach(type => {
    if (weeklyPicks[type] && keptRecipes[type]) {
      state.weeklyPicks[type] = weeklyPicks[type].id;
    }
  });

  const encoded = btoa(JSON.stringify(state));
  const url = window.location.origin + window.location.pathname + '?sync=' + encoded;
  return url;
}

// Copy shareable URL to clipboard
function copyShareableURL() {
  const url = generateShareableURL();
  navigator.clipboard.writeText(url).then(() => {
    alert('Sync link copied! Open this link on your other device to sync your weekly selections.');
  }).catch(() => {
    // Fallback for browsers that don't support clipboard API
    prompt('Copy this link to sync on another device:', url);
  });
}

// Check for and restore from URL parameters
function checkURLSync() {
  const params = new URLSearchParams(window.location.search);
  const syncData = params.get('sync');

  if (syncData) {
    try {
      const state = JSON.parse(atob(syncData));

      // Restore kept recipes flags
      if (state.keptRecipes) {
        keptRecipes = state.keptRecipes;
      }

      // Restore weekly picks (will be matched to full recipes after recipes load)
      if (state.weeklyPicks) {
        // Store IDs temporarily, will be resolved after recipes load
        window._pendingSyncPicks = state.weeklyPicks;
      }

      // Restore manually kept recipes
      if (state.manuallyKept) {
        manuallyKeptRecipes = state.manuallyKept;
        localStorage.setItem('manuallyKeptRecipes', JSON.stringify(manuallyKeptRecipes));
      }

      // Restore grocery list
      if (state.groceryList) {
        groceryList = state.groceryList;
        localStorage.setItem('groceryList', JSON.stringify(groceryList));
      }

      // Restore misc items
      if (state.miscItems) {
        miscItems = state.miscItems;
        localStorage.setItem('miscItems', JSON.stringify(miscItems));
      }

      // Restore user preferences (liked, notes, edits)
      if (state.liked) {
        userPreferences.liked = state.liked;
      }
      if (state.notes) {
        userPreferences.notes = state.notes;
      }
      if (state.titleEdits) {
        userPreferences.titleEdits = state.titleEdits;
      }
      if (state.categoryEdits) {
        userPreferences.categoryEdits = state.categoryEdits;
      }
      if (state.authorEdits) {
        userPreferences.authorEdits = state.authorEdits;
      }
      saveUserPreferences();

      // Save to localStorage so it persists
      saveWeeklyState();

      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);

      return true;
    } catch (e) {
      console.error('Failed to parse sync data:', e);
    }
  }
  return false;
}

// Resolve pending sync picks after recipes are loaded
function resolvePendingSyncPicks() {
  if (window._pendingSyncPicks) {
    ALL_MEAL_TYPES.forEach(type => {
      if (window._pendingSyncPicks[type]) {
        const recipe = recipes.find(r => r.id === window._pendingSyncPicks[type]);
        if (recipe) {
          weeklyPicks[type] = recipe;
        }
      }
    });
    delete window._pendingSyncPicks;
    saveWeeklyState();
  }
}

// Restore weekly picks from localStorage or generate new ones
// All meal types
function restoreOrGenerateWeeklyPicks() {
  const hasSavedPicks = Object.values(weeklyPicks).some(p => p !== null);

  if (hasSavedPicks) {
    // Restore saved picks - need to find full recipe objects
    ALL_MEAL_TYPES.forEach(type => {
      if (weeklyPicks[type]) {
        const recipe = recipes.find(r => r.id === weeklyPicks[type].id);
        if (recipe) {
          weeklyPicks[type] = recipe;
          renderRecipeCard(type, recipe);
        } else {
          weeklyPicks[type] = null;
          keptRecipes[type] = false;
          renderRecipeCard(type, null);
        }
      } else {
        renderRecipeCard(type, null);
      }
    });
    updateGenerateGroceryButton();
  } else {
    generateWeeklyPicks();
  }
}

// Start a new week - clear all selections
function startNewWeek() {
  if (!confirm('Start a new week? This will clear all your current selections and grocery list.')) {
    return;
  }

  // Reset all state
  weeklyPicks = { breakfast1: null, breakfast2: null, lunch1: null, lunch2: null, lunch3: null, pasta: null, chicken: null, meat: null, vegetarian: null };
  keptRecipes = { breakfast1: false, breakfast2: false, lunch1: false, lunch2: false, lunch3: false, pasta: false, chicken: false, meat: false, vegetarian: false };
  skippedRecipes = { breakfast1: [], breakfast2: [], lunch1: [], lunch2: [], lunch3: [], pasta: [], chicken: [], meat: [], vegetarian: [] };
  manuallyKeptRecipes = [];
  groceryList = [];
  prepListState = { checked: [], removed: [] };

  // Clear localStorage
  localStorage.removeItem('keptRecipes');
  localStorage.removeItem('weeklyPicks');
  localStorage.removeItem('skippedRecipes');
  localStorage.removeItem('manuallyKeptRecipes');
  localStorage.removeItem('groceryList');
  localStorage.removeItem('groceryRecipes');
  localStorage.removeItem('prepListState');
  localStorage.removeItem('dayAssignments');
  dayAssignments = {};

  // Re-generate picks and update UI
  generateWeeklyPicks();
  renderManualPicks();
  updateStartNewWeekButton();
}

// Update the Start New Week button visibility
function updateStartNewWeekButton() {
  const hasSelections = Object.values(keptRecipes).some(Boolean) || manuallyKeptRecipes.length > 0;
  const btn = document.getElementById('start-new-week');
  if (btn) {
    btn.style.display = hasSelections ? 'inline-flex' : 'none';
  }
}

// Load recipes from JSON file
async function loadRecipes() {
  try {
    const response = await fetch('recipes.json');
    recipes = await response.json();
    // Filter out removed recipes
    recipes = recipes.filter(r => !userPreferences.removed.includes(r.id));
  } catch (error) {
    console.error('Error loading recipes:', error);
    recipes = [];
  }
}

// Load user preferences from localStorage
function loadUserPreferences() {
  const saved = localStorage.getItem('recipePreferences');
  if (saved) {
    userPreferences = JSON.parse(saved);
  }
}

// Save user preferences to localStorage and cloud
function saveUserPreferences() {
  localStorage.setItem('recipePreferences', JSON.stringify(userPreferences));
  if (typeof syncToCloud === 'function') syncToCloud();
}

// Get current month's seasonal produce
function getCurrentSeasonalProduce() {
  const months = ['january', 'february', 'march', 'april', 'may', 'june',
                  'july', 'august', 'september', 'october', 'november', 'december'];
  const currentMonth = months[new Date().getMonth()];
  return {
    month: currentMonth,
    produce: seasonalProduce[currentMonth]
  };
}

// Calculate seasonal score for a recipe
function getSeasonalScore(recipe, seasonalIngredients, expiringIngredients = []) {
  if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return 0;

  let score = 0;
  const ingredientText = recipe.ingredients.join(' ').toLowerCase();

  seasonalIngredients.forEach(produce => {
    if (ingredientText.includes(produce.toLowerCase())) {
      score += 2;
    }
  });

  expiringIngredients.forEach(item => {
    if (ingredientText.includes(item.toLowerCase().trim())) {
      score += 5; // Higher priority for expiring ingredients
    }
  });

  return score;
}

// Get list of seasonal ingredients in a recipe
function getSeasonalIngredientsInRecipe(recipe, seasonalIngredients) {
  if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return [];

  const found = [];
  const ingredientText = recipe.ingredients.join(' ').toLowerCase();

  seasonalIngredients.forEach(produce => {
    if (ingredientText.includes(produce.toLowerCase())) {
      found.push(produce);
    }
  });

  return found;
}

// Update seasonal display
function updateSeasonalDisplay() {
  const { month, produce } = getCurrentSeasonalProduce();
  document.getElementById('current-month').textContent = month.charAt(0).toUpperCase() + month.slice(1);

  const listEl = document.getElementById('seasonal-highlights');
  listEl.innerHTML = produce.map(item => `<li>${item}</li>`).join('');
}

// Get recipes by category type
function getRecipesByType(type) {
  const categoryMap = {
    breakfast1: ['breakfast', 'smoothie'],
    breakfast2: ['breakfast', 'smoothie'],
    lunch1: ['lunch', 'salad', 'soup', 'sandwich'],
    lunch2: ['lunch', 'salad', 'soup', 'sandwich'],
    lunch3: ['lunch', 'salad', 'soup', 'sandwich'],
    pasta: ['pasta'],
    chicken: ['chicken'],
    meat: ['meat', 'beef', 'pork', 'lamb', 'turkey'],
    vegetarian: ['vegetarian']
  };

  const targetCategories = categoryMap[type];
  if (!targetCategories) return [];

  return recipes.filter(r => {
    const recipeCategories = getRecipeCategories(r);
    const skippedForType = skippedRecipes[type] || [];
    return recipeCategories.some(cat => targetCategories.includes(cat.toLowerCase())) &&
      !userPreferences.removed.includes(r.id) &&
      !skippedForType.includes(r.id);
  });
}

// Generate weekly picks
function generateWeeklyPicks() {
  const { produce } = getCurrentSeasonalProduce();
  const expiringInput = document.getElementById('expiring-input');
  const expiringIngredients = expiringInput.value ? expiringInput.value.split(',').map(s => s.trim()) : [];

  // Track used recipes to avoid duplicates (especially for lunch1/lunch2)
  const usedRecipeIds = [];

  // Dinner types get seasonal sorting
  const dinnerTypes = ['pasta', 'chicken', 'meat', 'vegetarian'];

  ALL_MEAL_TYPES.forEach(type => {
    if (!keptRecipes[type]) {
      let available = getRecipesByType(type);

      // Filter out already used recipes (for lunch slots sharing same category)
      available = available.filter(r => !usedRecipeIds.includes(r.id));

      if (available.length === 0) {
        weeklyPicks[type] = null;
        renderRecipeCard(type, null);
        return;
      }

      // Only apply seasonal sorting for dinner types
      if (dinnerTypes.includes(type)) {
        available.sort((a, b) => {
          return getSeasonalScore(b, produce, expiringIngredients) - getSeasonalScore(a, produce, expiringIngredients);
        });
      } else {
        // For breakfast/lunch, shuffle randomly
        available.sort(() => Math.random() - 0.5);
      }

      // Pick the best match (or random for breakfast/lunch)
      weeklyPicks[type] = available[0];
      usedRecipeIds.push(available[0].id);
      renderRecipeCard(type, available[0]);
    } else if (weeklyPicks[type]) {
      // Track kept recipes too
      usedRecipeIds.push(weeklyPicks[type].id);
    }
  });

  saveWeeklyState();
  updateGenerateGroceryButton();
}

// Render a recipe card
function renderRecipeCard(type, recipe) {
  const card = document.getElementById(`${type}-pick`);
  if (!card) {
    console.error(`Card not found for type: ${type}`);
    return;
  }
  const loading = card.querySelector('.card-loading');
  const content = card.querySelector('.card-content');

  if (!recipe) {
    // Friendlier message without the type key
    const friendlyNames = {
      breakfast1: 'breakfast', breakfast2: 'breakfast',
      lunch1: 'lunch', lunch2: 'lunch', lunch3: 'lunch',
      pasta: 'pasta', chicken: 'chicken', meat: 'meat', vegetarian: 'vegetarian'
    };
    loading.textContent = `No ${friendlyNames[type] || type} recipes available`;
    loading.style.display = 'block';
    content.style.display = 'none';
    return;
  }

  const { produce } = getCurrentSeasonalProduce();
  const seasonalIngredients = getSeasonalIngredientsInRecipe(recipe, produce);

  content.querySelector('.card-title').textContent = recipe.name;

  // Render seasonal ingredient tags
  const tagsContainer = content.querySelector('.card-seasonal-tags');
  if (tagsContainer) {
    if (seasonalIngredients.length > 0) {
      tagsContainer.innerHTML = seasonalIngredients.map(ingredient =>
        `<span class="seasonal-tag">${ingredient}</span>`
      ).join('');
      tagsContainer.style.display = 'flex';
    } else {
      tagsContainer.innerHTML = '';
      tagsContainer.style.display = 'none';
    }
  }

  loading.style.display = 'none';
  content.style.display = 'block';

  // Update card state
  if (keptRecipes[type]) {
    card.classList.add('kept');
    content.querySelector('.btn-keep').textContent = 'Kept ✓';
    content.querySelector('.btn-keep').disabled = false;
    content.querySelector('.btn-keep').classList.add('btn-kept');
    content.querySelector('.btn-skip').textContent = 'Switch';
    content.querySelector('.btn-skip').style.display = 'inline-block';
  } else {
    card.classList.remove('kept');
    content.querySelector('.btn-keep').textContent = 'Keep';
    content.querySelector('.btn-keep').disabled = false;
    content.querySelector('.btn-keep').classList.remove('btn-kept');
    content.querySelector('.btn-skip').textContent = 'Skip';
    content.querySelector('.btn-skip').style.display = 'inline-block';
  }
}

// Handle keep action (toggle)
function handleKeep(type) {
  if (keptRecipes[type]) {
    // Unkeep - allow switching
    keptRecipes[type] = false;
  } else {
    keptRecipes[type] = true;
  }
  saveWeeklyState();
  renderRecipeCard(type, weeklyPicks[type]);
  updateGenerateGroceryButton();
  updateStartNewWeekButton();
}

// Handle skip action
function handleSkip(type) {
  // Unkeep the recipe if it was kept (switching)
  if (keptRecipes[type]) {
    keptRecipes[type] = false;
  }

  if (weeklyPicks[type]) {
    if (!skippedRecipes[type]) skippedRecipes[type] = [];
    skippedRecipes[type].push(weeklyPicks[type].id);
  }

  // Check if we've skipped all available recipes - if so, reset to cycle through again
  const categoryMap = {
    breakfast1: ['breakfast', 'smoothie'],
    breakfast2: ['breakfast', 'smoothie'],
    lunch1: ['lunch', 'salad', 'soup', 'sandwich'],
    lunch2: ['lunch', 'salad', 'soup', 'sandwich'],
    lunch3: ['lunch', 'salad', 'soup', 'sandwich'],
    pasta: ['pasta'],
    chicken: ['chicken'],
    meat: ['meat', 'beef', 'pork', 'lamb', 'turkey'],
    vegetarian: ['vegetarian']
  };
  const targetCategories = categoryMap[type];
  if (!targetCategories) return;

  const allInCategory = recipes.filter(r => {
    const recipeCategories = getRecipeCategories(r);
    return recipeCategories.some(cat => targetCategories.includes(cat)) &&
      !userPreferences.removed.includes(r.id);
  });

  // If we've skipped all recipes in this category, reset the skipped list
  const skippedForType = skippedRecipes[type] || [];
  if (skippedForType.length >= allInCategory.length) {
    skippedRecipes[type] = [];
  }

  generateWeeklyPicks();
  saveWeeklyState();
  updateStartNewWeekButton();
}

// Update the generate grocery button visibility
function updateGenerateGroceryButton() {
  // Show button when at least 1 recipe is kept (from cards or manually)
  const keptCount = Object.values(keptRecipes).filter(Boolean).length + manuallyKeptRecipes.length;
  const btn = document.getElementById('generate-grocery');
  btn.style.display = keptCount >= 1 ? 'inline-flex' : 'none';
}

// Toggle keeping a recipe for the week (from library)
function toggleKeepForWeek(id) {
  const idx = manuallyKeptRecipes.indexOf(id);
  if (idx > -1) {
    manuallyKeptRecipes.splice(idx, 1);
  } else {
    manuallyKeptRecipes.push(id);
  }
  localStorage.setItem('manuallyKeptRecipes', JSON.stringify(manuallyKeptRecipes));
  if (typeof syncToCloud === 'function') syncToCloud();
  renderManualPicks();
  updateGenerateGroceryButton();
  updateStartNewWeekButton();
}

// Render manually kept recipes section
function renderManualPicks() {
  const container = document.getElementById('manual-picks');
  const list = document.getElementById('manual-picks-list');

  if (manuallyKeptRecipes.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  list.innerHTML = manuallyKeptRecipes.map(id => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return '';
    return `
      <div class="manual-pick-item">
        <span class="manual-pick-name">${getRecipeTitle(recipe)}</span>
        <button class="manual-pick-remove" onclick="removeManualPick('${id}')" title="Remove">&times;</button>
      </div>
    `;
  }).join('');
}

// Remove a manually kept recipe
function removeManualPick(id) {
  const idx = manuallyKeptRecipes.indexOf(id);
  if (idx > -1) {
    manuallyKeptRecipes.splice(idx, 1);
    localStorage.setItem('manuallyKeptRecipes', JSON.stringify(manuallyKeptRecipes));
    if (typeof syncToCloud === 'function') syncToCloud();
    renderManualPicks();
    updateGenerateGroceryButton();
  }
}

// Handle keep for week button click in modal
function handleKeepForWeek() {
  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;
  toggleKeepForWeek(id);
  openRecipeModal(id); // Refresh modal to update button state
}

// Open recipe modal from weekly picks
function openWeeklyRecipeModal(type) {
  const recipe = weeklyPicks[type];
  if (recipe) {
    openRecipeModal(recipe.id);
  }
}

// Recipe colors for grocery list - mapped by category type
const recipeColorsByType = {
  breakfast1: '#a8d0ff', // Light blue
  breakfast2: '#a8d0ff', // Light blue
  lunch1: '#9CAF88',     // Sage green
  lunch2: '#9CAF88',     // Sage green
  lunch3: '#9CAF88',     // Sage green
  pasta: '#70271F',      // Coffee (deep red-brown)
  chicken: '#F24E07',    // Mango (orange)
  meat: '#70271F',       // Coffee
  vegetarian: '#26422B'  // Cambodia (dark green)
};

// Parse an ingredient string to extract quantity for combining
function parseIngredient(ingredientStr) {
  const str = ingredientStr.trim();

  // Match leading quantity (numbers, fractions, ranges)
  const fractionMap = { '½': 0.5, '⅓': 0.33, '⅔': 0.67, '¼': 0.25, '¾': 0.75, '⅛': 0.125 };

  // Pattern to match quantities at the start
  const qtyPattern = /^([\d]+(?:\s*[-–]\s*[\d]+)?(?:\s*\/\s*[\d]+)?(?:\s+[\d]+\/[\d]+)?|[½⅓⅔¼¾⅛])\s*/;
  const match = str.match(qtyPattern);

  let quantity = null;
  let rest = str;

  if (match) {
    const qtyStr = match[1];
    rest = str.slice(match[0].length);

    // Parse the quantity
    if (fractionMap[qtyStr]) {
      quantity = fractionMap[qtyStr];
    } else if (qtyStr.includes('/')) {
      const parts = qtyStr.split(/\s+/);
      quantity = 0;
      parts.forEach(p => {
        if (p.includes('/')) {
          const [num, den] = p.split('/').map(Number);
          quantity += num / den;
        } else {
          quantity += Number(p);
        }
      });
    } else if (qtyStr.includes('-') || qtyStr.includes('–')) {
      const nums = qtyStr.split(/[-–]/).map(n => Number(n.trim()));
      quantity = Math.max(...nums);
    } else {
      quantity = Number(qtyStr);
    }
  }

  // Keep the full remaining text as the name (preserves "pound ground beef", etc.)
  const name = rest.trim();

  return { quantity, name, original: ingredientStr };
}

// Get a normalized key for matching similar ingredients
// Only combine ingredients that are nearly identical
function getIngredientKey(ingredientStr) {
  // Normalize for matching - but keep important descriptors
  let key = ingredientStr.toLowerCase()
    .replace(/\s*\([^)]*\)/g, '') // Remove parenthetical notes
    .replace(/,.*$/, '') // Remove text after comma
    .replace(/freshly\s+/g, '')
    .replace(/fresh\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove trailing 's' for simple plurals only for very short ingredient names
  // This helps match "lemon" with "lemons" but not "ground beef" with "ground beefs"
  if (key.split(' ').length === 1 && key.endsWith('s') && key.length > 3) {
    key = key.slice(0, -1);
  }

  return key;
}

// Combine similar ingredients
function combineIngredients(rawList) {
  const combined = new Map();

  rawList.forEach(item => {
    const parsed = parseIngredient(item.item);
    const key = getIngredientKey(parsed.name);

    if (combined.has(key)) {
      const existing = combined.get(key);
      // Add quantity if both have quantities
      if (parsed.quantity && existing.quantity) {
        existing.quantity += parsed.quantity;
      } else if (parsed.quantity) {
        existing.quantity = parsed.quantity;
      }
      // Add recipe color if not already present
      if (!existing.recipeColors.includes(item.recipeColor)) {
        existing.recipeColors.push(item.recipeColor);
      }
      existing.recipes.push(item.recipe);
      existing.originalItems.push(item.item);
    } else {
      combined.set(key, {
        key: key,
        name: parsed.name, // Keep the descriptive name like "pound ground beef"
        quantity: parsed.quantity,
        recipeColors: [item.recipeColor],
        recipes: [item.recipe],
        originalItems: [item.item],
        checked: false
      });
    }
  });

  return Array.from(combined.values());
}

// Format combined ingredient for display
function formatCombinedIngredient(item) {
  // If there's only one original item, just show it as-is
  if (item.originalItems && item.originalItems.length === 1) {
    return item.originalItems[0];
  }

  // For combined items, show quantity + name
  if (item.quantity && item.quantity > 0) {
    let qtyStr;
    if (Number.isInteger(item.quantity)) {
      qtyStr = item.quantity.toString();
    } else {
      qtyStr = item.quantity.toFixed(1).replace(/\.0$/, '');
    }
    return `${qtyStr} ${item.name}`;
  }

  // Fallback to showing the first original item
  return item.originalItems ? item.originalItems[0] : item.name;
}

// Generate grocery list
function generateGroceryList() {
  const rawIngredients = [];
  const keptRecipesList = [];

  ALL_MEAL_TYPES.forEach(type => {
    if (weeklyPicks[type] && keptRecipes[type]) {
      const recipe = weeklyPicks[type];
      const color = recipeColorsByType[type];
      keptRecipesList.push({ name: recipe.name, color: color });
      recipe.ingredients.forEach(ingredient => {
        // Skip pantry staples - always have them on hand
        const lower = ingredient.toLowerCase().trim();
        if (lower.includes('kosher salt') || lower.includes('olive oil') || lower.includes('black pepper')) {
          return;
        }
        // Skip section titles (e.g., "for cabbage salad:", "for burgers:")
        if (lower.startsWith('for ') && lower.endsWith(':')) {
          return;
        }
        // Skip lines that are just titles (end with colon)
        if (lower.endsWith(':') && lower.split(' ').length <= 4) {
          return;
        }
        rawIngredients.push({
          item: ingredient,
          recipe: recipe.name,
          recipeColor: color
        });
      });
    }
  });

  // Add manually kept recipes from library
  const manualColor = '#7a6c5d'; // warm gray for manual picks
  manuallyKeptRecipes.forEach(id => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      keptRecipesList.push({ name: getRecipeTitle(recipe), color: manualColor });
      recipe.ingredients.forEach(ingredient => {
        // Skip pantry staples - always have them on hand
        const lower = ingredient.toLowerCase().trim();
        if (lower.includes('kosher salt') || lower.includes('olive oil') || lower.includes('black pepper')) {
          return;
        }
        // Skip section titles (e.g., "for cabbage salad:", "for burgers:")
        if (lower.startsWith('for ') && lower.endsWith(':')) {
          return;
        }
        // Skip lines that are just titles (end with colon)
        if (lower.endsWith(':') && lower.split(' ').length <= 4) {
          return;
        }
        rawIngredients.push({
          item: ingredient,
          recipe: getRecipeTitle(recipe),
          recipeColor: manualColor
        });
      });
    }
  });

  // Combine similar ingredients
  groceryList = combineIngredients(rawIngredients);

  // Save to localStorage and cloud
  localStorage.setItem('groceryList', JSON.stringify(groceryList));
  localStorage.setItem('groceryRecipes', JSON.stringify(keptRecipesList));
  if (typeof syncToCloud === 'function') syncToCloud();

  // Switch to grocery tab
  switchTab('grocery');
  renderGroceryList();
}

// Render grocery list
function renderGroceryList() {
  const savedList = localStorage.getItem('groceryList');
  const savedRecipes = localStorage.getItem('groceryRecipes');

  if (!savedList) {
    document.getElementById('grocery-categories').innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <h3>No grocery list yet</h3>
        <p>Keep all 3 weekly recipes and generate your list</p>
      </div>
    `;
    return;
  }

  groceryList = JSON.parse(savedList);
  const recipesData = savedRecipes ? JSON.parse(savedRecipes) : [];

  // Render recipe tags with colors
  const recipeListEl = document.getElementById('grocery-recipe-list');
  recipeListEl.innerHTML = recipesData.map(r => {
    // Handle both old format (string) and new format (object with color)
    const name = typeof r === 'string' ? r : r.name;
    const color = typeof r === 'object' && r.color ? r.color : '#4d5532';
    return `<span class="grocery-recipe-tag" style="background-color: ${color}">${name}</span>`;
  }).join('');

  // Categorize ingredients
  const categories = categorizeIngredients(groceryList);

  // Render categories
  const categoriesEl = document.getElementById('grocery-categories');
  categoriesEl.innerHTML = Object.entries(categories).map(([category, items]) => `
    <div class="grocery-category">
      <div class="grocery-category-header">${category}</div>
      <div class="grocery-category-items">
        ${items.map((item, idx) => {
          const itemIdx = groceryList.indexOf(item);
          const displayText = formatCombinedIngredient(item);
          // Generate color dots for each recipe
          const colorDots = (item.recipeColors || [item.recipeColor || '#4d5532'])
            .map(color => `<span class="ingredient-color-dot" style="background-color: ${color}"></span>`)
            .join('');
          return `
          <div class="grocery-item ${item.checked ? 'checked' : ''}" data-idx="${itemIdx}">
            <div class="ingredient-color-dots">${colorDots}</div>
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleGroceryItem(${itemIdx})">
            <label title="${(item.originalItems || [item.item]).join(' + ')}">${displayText}</label>
            <button class="grocery-remove" onclick="removeGroceryItem(${itemIdx})" title="Remove item">&times;</button>
          </div>
        `}).join('')}
      </div>
    </div>
  `).join('');
}

// Categorize ingredients
function categorizeIngredients(items) {
  const categories = {
    'Produce': [],
    'Meat & Seafood': [],
    'Dairy & Eggs': [],
    'Pantry': [],
    'Spices & Seasonings': [],
    'Other': []
  };

  const produceKeywords = ['tomato', 'onion', 'garlic', 'pepper', 'carrot', 'celery', 'potato', 'squash', 'zucchini', 'eggplant', 'mushroom', 'lettuce', 'spinach', 'kale', 'broccoli', 'cauliflower', 'cabbage', 'lemon', 'lime', 'orange', 'apple', 'herb', 'basil', 'parsley', 'cilantro', 'mint', 'thyme', 'rosemary', 'sage', 'ginger', 'shallot', 'scallion', 'leek', 'fennel', 'avocado', 'cucumber'];
  const meatKeywords = ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'sausage', 'pancetta', 'bacon', 'salmon', 'fish', 'shrimp', 'prawn'];
  const dairyKeywords = ['butter', 'cream', 'milk', 'cheese', 'parmesan', 'mozzarella', 'ricotta', 'pecorino', 'yogurt', 'egg', 'sour cream', 'burrata'];
  const spiceKeywords = ['salt', 'pepper', 'cumin', 'paprika', 'cinnamon', 'oregano', 'thyme', 'chili', 'cayenne', 'coriander', 'turmeric', 'seasoning'];

  items.forEach(item => {
    // Support both old format (item.item) and new combined format (item.name)
    const lower = (item.name || item.item || '').toLowerCase();

    if (produceKeywords.some(k => lower.includes(k))) {
      categories['Produce'].push(item);
    } else if (meatKeywords.some(k => lower.includes(k))) {
      categories['Meat & Seafood'].push(item);
    } else if (dairyKeywords.some(k => lower.includes(k))) {
      categories['Dairy & Eggs'].push(item);
    } else if (spiceKeywords.some(k => lower.includes(k))) {
      categories['Spices & Seasonings'].push(item);
    } else if (lower.includes('olive oil') || lower.includes('broth') || lower.includes('stock') || lower.includes('pasta') || lower.includes('rice') || lower.includes('flour') || lower.includes('sugar') || lower.includes('vinegar') || lower.includes('soy sauce') || lower.includes('tomato paste')) {
      categories['Pantry'].push(item);
    } else {
      categories['Other'].push(item);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
}

// Toggle grocery item
function toggleGroceryItem(idx) {
  groceryList[idx].checked = !groceryList[idx].checked;
  localStorage.setItem('groceryList', JSON.stringify(groceryList));
  renderGroceryList();
}

// Remove grocery item
function removeGroceryItem(idx) {
  groceryList.splice(idx, 1);
  localStorage.setItem('groceryList', JSON.stringify(groceryList));
  renderGroceryList();
}

// Copy grocery list to clipboard
function copyGroceryList() {
  let text = groceryList.map(item => {
    const displayText = formatCombinedIngredient(item);
    return `${item.checked ? '[x]' : '[ ]'} ${displayText}`;
  }).join('\n');

  // Add misc items
  if (miscItems.length > 0) {
    text += '\n\n-- Other Items --\n';
    text += miscItems.map(item => `${item.checked ? '[x]' : '[ ]'} ${item.name}`).join('\n');
  }

  navigator.clipboard.writeText(text).then(() => {
    alert('Grocery list copied to clipboard!');
  });
}

// Clear grocery list
function clearGroceryList() {
  if (confirm('Are you sure you want to clear the grocery list?')) {
    localStorage.removeItem('groceryList');
    localStorage.removeItem('groceryRecipes');
    localStorage.removeItem('miscItems');
    groceryList = [];
    miscItems = [];
    renderGroceryList();
    renderMiscItems();
  }
}

// ==================== MISCELLANEOUS ITEMS ====================

// Load misc items from localStorage
function loadMiscItems() {
  const saved = localStorage.getItem('miscItems');
  if (saved) {
    miscItems = JSON.parse(saved);
  }
}

// Save misc items to localStorage and cloud
function saveMiscItems() {
  localStorage.setItem('miscItems', JSON.stringify(miscItems));
  if (typeof syncToCloud === 'function') syncToCloud();
}

// Add a miscellaneous item
function addMiscItem(name) {
  if (!name || !name.trim()) return;

  miscItems.push({
    id: Date.now().toString(),
    name: name.trim(),
    checked: false
  });
  saveMiscItems();
  renderMiscItems();
}

// Toggle misc item checked state
function toggleMiscItem(id) {
  const item = miscItems.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    saveMiscItems();
    renderMiscItems();
  }
}

// Remove a misc item
function removeMiscItem(id) {
  miscItems = miscItems.filter(i => i.id !== id);
  saveMiscItems();
  renderMiscItems();
}

// Render miscellaneous items
function renderMiscItems() {
  const container = document.getElementById('misc-items-list');
  if (!container) return;

  if (miscItems.length === 0) {
    container.innerHTML = '<p class="misc-empty">No other items added yet</p>';
    return;
  }

  container.innerHTML = miscItems.map(item => `
    <div class="misc-item ${item.checked ? 'checked' : ''}">
      <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleMiscItem('${item.id}')">
      <label>${item.name}</label>
      <button class="misc-remove" onclick="removeMiscItem('${item.id}')" title="Remove item">&times;</button>
    </div>
  `).join('');
}

// ==================== PREP LIST ====================

// Prep list state
let prepListState = {
  checked: [],  // Array of task keys that are checked
  removed: []   // Array of task keys that are removed
};

// Load prep list state from localStorage
function loadPrepListState() {
  const saved = localStorage.getItem('prepListState');
  if (saved) {
    prepListState = JSON.parse(saved);
  }
}

// Save prep list state to localStorage and cloud
function savePrepListState() {
  localStorage.setItem('prepListState', JSON.stringify(prepListState));
  if (typeof syncToCloud === 'function') syncToCloud();
}

// Toggle prep task checked state
function togglePrepTask(key) {
  const idx = prepListState.checked.indexOf(key);
  if (idx > -1) {
    prepListState.checked.splice(idx, 1);
  } else {
    prepListState.checked.push(key);
  }
  savePrepListState();
  renderPrepList();
}

// Remove a prep task
function removePrepTask(key) {
  prepListState.removed.push(key);
  savePrepListState();
  renderPrepList();
}

// Prep task patterns to look for in instructions and ingredients
const prepPatterns = [
  { pattern: /chop(?:ped|ping)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Chop', category: 'Cutting' },
  { pattern: /dice(?:d)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Dice', category: 'Cutting' },
  { pattern: /mince(?:d)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Mince', category: 'Cutting' },
  { pattern: /slice(?:d|s)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Slice', category: 'Cutting' },
  { pattern: /julienne(?:d)?\s+(?:the\s+)?(?!peeler)(.+?)(?:\.|,|;|$)/gi, action: 'Julienne', category: 'Cutting' },
  { pattern: /grate(?:d|s)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Grate', category: 'Cutting' },
  { pattern: /shred(?:ded)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Shred', category: 'Cutting' },
  { pattern: /crush(?:ed)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Crush', category: 'Cutting' },
  { pattern: /zest(?:ed)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Zest', category: 'Cutting' },
  { pattern: /marinate\s+(?:the\s+)?(.+?)(?:\s+for|\s+in|\.|,|;|$)/gi, action: 'Marinate', category: 'Marinating' },
  { pattern: /marinade\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Marinate', category: 'Marinating' },
  { pattern: /(?:make|prepare|mix|whisk)\s+(?:the\s+)?(?:a\s+)?(.+?sauce|.+?dressing|.+?marinade|.+?vinaigrette)(?:\.|,|;|$)/gi, action: 'Make', category: 'Sauces & Dressings' },
  { pattern: /whisk\s+(?:the\s+)?(?:together\s+)?(.+?ingredients|.+?sauce|.+?dressing)(?:\.|,|;|$)/gi, action: 'Whisk', category: 'Sauces & Dressings' },
  { pattern: /toast(?:ed)?\s+(?:the\s+)?(.+?)(?:\.|,|;|until|$)/gi, action: 'Toast', category: 'Toasting' },
  { pattern: /soak(?:ed|ing)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Soak', category: 'Soaking' },
  { pattern: /wash(?:ed)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Wash', category: 'Washing' },
  { pattern: /peel(?:ed)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Peel', category: 'Cutting' },
  { pattern: /trim(?:med)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Trim', category: 'Cutting' },
  { pattern: /(?:de-?seed|seed|remove\s+seeds?\s+from)\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Deseed', category: 'Cutting' },
  { pattern: /cube(?:d)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Cube', category: 'Cutting' },
  { pattern: /halve(?:d|s)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Halve', category: 'Cutting' },
  { pattern: /quarter(?:ed|s)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Quarter', category: 'Cutting' },
  { pattern: /cut\s+(?:the\s+)?(.+?)\s+into\s+(?:pieces|chunks|cubes|strips|wedges|slices)/gi, action: 'Cut', category: 'Cutting' },
  { pattern: /blend(?:ed)?\s+(?:the\s+)?(.+?)(?:\s+until|\.|,|;|$)/gi, action: 'Blend', category: 'Mixing' },
  { pattern: /pur[eé]e(?:d)?\s+(?:the\s+)?(.+?)(?:\.|,|;|$)/gi, action: 'Puree', category: 'Mixing' },
  { pattern: /pulse\s+(?:the\s+)?(.+?)\s+(?:in|until)/gi, action: 'Pulse', category: 'Mixing' },
];

// Extract prep tasks from a recipe
function extractPrepTasks(recipe, recipeName, recipeColor) {
  const tasks = [];
  const instructions = recipe.instructions || '';
  const ingredients = recipe.ingredients || [];

  // Check instructions for prep tasks
  prepPatterns.forEach(({ pattern, action, category }) => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(instructions)) !== null) {
      let item = match[1].trim();
      // Clean up the item - remove leading articles
      item = item.replace(/^(and|the|a|an)\s+/i, '').trim();
      // Remove trailing phrases that aren't part of the ingredient
      item = item.replace(/\s+(and|then|until|before|after|into|in|on|over|with|to|for|from)(\s+.*)?$/i, '').trim();
      if (item.length > 2 && item.length < 50) {
        // Create itemBase by removing quantities for deduplication
        const itemBase = item
          .replace(/^[\d\s\/½⅓⅔¼¾⅛-]+/, '')
          .replace(/^(cups?|tablespoons?|tbsp|teaspoons?|tsp|ounces?|oz|pounds?|lbs?|lb|cloves?|heads?|bunche?s?|cans?|large|medium|small|inch|cm)\s+(?:of\s+)?/gi, '')
          .trim();
        tasks.push({
          action,
          item,
          itemBase: itemBase || item,
          category,
          recipe: recipeName,
          recipeColor
        });
      }
    }
  });

  // Check ingredients for prep instructions (e.g., "1 onion, diced")
  ingredients.forEach(ing => {
    const lower = ing.toLowerCase();
    const prepWords = [
      { word: 'chopped', action: 'Chop' },
      { word: 'finely chopped', action: 'Finely chop' },
      { word: 'roughly chopped', action: 'Roughly chop' },
      { word: 'coarsely chopped', action: 'Coarsely chop' },
      { word: 'diced', action: 'Dice' },
      { word: 'minced', action: 'Mince' },
      { word: 'sliced', action: 'Slice' },
      { word: 'thinly sliced', action: 'Thinly slice' },
      { word: 'grated', action: 'Grate' },
      { word: 'finely grated', action: 'Finely grate' },
      { word: 'shredded', action: 'Shred' },
      { word: 'julienned', action: 'Julienne' },
      { word: 'crushed', action: 'Crush' },
      { word: 'zested', action: 'Zest' },
      { word: 'peeled', action: 'Peel' },
      { word: 'trimmed', action: 'Trim' },
      { word: 'cubed', action: 'Cube' },
      { word: 'halved', action: 'Halve' },
      { word: 'quartered', action: 'Quarter' },
      { word: 'torn', action: 'Tear' },
      { word: 'cut into', action: 'Cut' },
      { word: 'broken into', action: 'Break' },
      { word: 'separated', action: 'Separate' },
      { word: 'deveined', action: 'Devein' },
      { word: 'deboned', action: 'Debone' },
      { word: 'seeded', action: 'Seed' },
      { word: 'cored', action: 'Core' },
      { word: 'ribbons', action: 'Cut into ribbons' },
      { word: 'toasted', action: 'Toast' },
      { word: 'roasted', action: 'Roast' },
      { word: 'blanched', action: 'Blanch' },
    ];

    // Sort prep words by length (longest first) to match "finely chopped" before "chopped"
    const sortedPrepWords = [...prepWords].sort((a, b) => b.word.length - a.word.length);

    // Use for loop so we can break after first match
    for (const { word, action } of sortedPrepWords) {
      if (lower.includes(word)) {
        // Extract quantity from start of ingredient
        const qtyMatch = ing.match(/^([\d\s\/½⅓⅔¼¾⅛-]+)/);
        const quantity = qtyMatch ? qtyMatch[1].trim() : '';

        // Try to extract the ingredient name intelligently
        // First, try to get text before the prep word if it's after a comma
        let item = '';
        const commaIdx = ing.indexOf(',');
        if (commaIdx > -1 && lower.indexOf(word) > commaIdx) {
          // Prep word is after comma, get text before comma
          item = ing.substring(0, commaIdx).trim();
        } else {
          // Prep word might be in the middle of description
          // Try to extract what comes after common patterns
          item = ing.split(',')[0].trim();
        }

        // Remove quantity from item for display
        let itemWithoutQty = item.replace(/^[\d\s\/½⅓⅔¼¾⅛-]+/, '').trim();

        // Remove units and size descriptors
        itemWithoutQty = itemWithoutQty.replace(/^(cups?|tablespoons?|tbsp|teaspoons?|tsp|ounces?|oz|pounds?|lbs?|lb|cloves?|heads?|bunche?s?|cans?|large|medium|small|inch|cm)\s+(?:of\s+)?/gi, '').trim();

        // Remove additional size descriptors that might remain
        itemWithoutQty = itemWithoutQty.replace(/^\d+[\s-]*(inch|cm)\s*/gi, '').trim();

        if (itemWithoutQty.length > 2) {
          // Include quantity in the item display
          const displayItem = quantity ? `${quantity} ${itemWithoutQty}` : itemWithoutQty;
          // Determine category based on action
          let category = 'Cutting';
          if (action === 'Toast') category = 'Toasting';
          else if (action === 'Roast') category = 'Roasting';
          else if (action === 'Blanch') category = 'Blanching';
          else if (action === 'Tear' || action === 'Break' || action === 'Separate') category = 'Cutting';

          tasks.push({
            action,
            item: displayItem,
            itemBase: itemWithoutQty, // For combining similar items
            quantity,
            category,
            recipe: recipeName,
            recipeColor
          });
          // Only match the first (most specific) prep word, then stop
          break;
        }
      }
    }
  });

  // Deduplicate tasks within the same recipe
  // (e.g., "zest lemon" might appear in both ingredients and instructions)
  const seen = new Set();
  const deduplicatedTasks = tasks.filter(task => {
    // Normalize the action and item for comparison
    const normalizedAction = task.action.toLowerCase();
    // Extract just the core ingredient (remove quantities, articles, etc.)
    const normalizedItem = (task.itemBase || task.item)
      .toLowerCase()
      .replace(/^\d+[\s\/½⅓⅔¼¾⅛-]*/, '') // Remove quantities
      .replace(/^(the|a|an)\s+/i, '') // Remove articles
      .replace(/s$/, '') // Remove trailing 's'
      .trim();

    const key = `${normalizedAction}-${normalizedItem}`;

    if (seen.has(key)) {
      return false; // Skip duplicate
    }
    seen.add(key);
    return true;
  });

  return deduplicatedTasks;
}

// Combine similar prep tasks across recipes
function combinePrepTasks(allTasks) {
  const combined = new Map();

  allTasks.forEach(task => {
    // Create a key for grouping similar tasks (use itemBase if available for better matching)
    const itemForKey = (task.itemBase || task.item).toLowerCase().replace(/s$/, '').replace(/\d+/g, '').trim();
    const key = `${task.action.toLowerCase()}-${itemForKey}`;

    if (combined.has(key)) {
      const existing = combined.get(key);
      if (!existing.recipes.includes(task.recipe)) {
        existing.recipes.push(task.recipe);
        existing.recipeColors.push(task.recipeColor);
        // Add quantity info
        if (task.quantity) {
          existing.quantities.push({ qty: task.quantity, recipe: task.recipe });
        }
      }
    } else {
      combined.set(key, {
        action: task.action,
        item: task.itemBase || task.item, // Use base item for display
        category: task.category,
        recipes: [task.recipe],
        recipeColors: [task.recipeColor],
        quantities: task.quantity ? [{ qty: task.quantity, recipe: task.recipe }] : [],
        checked: false
      });
    }
  });

  return Array.from(combined.values());
}

// ==================== WEEK PLANNER ====================

// Dinner types for the planner
const DINNER_TYPES = ['pasta', 'chicken', 'meat', 'vegetarian'];

// Load day assignments from localStorage
function loadDayAssignments() {
  const saved = localStorage.getItem('dayAssignments');
  if (saved) {
    dayAssignments = JSON.parse(saved);
  }
}

// Save day assignments to localStorage and cloud
function saveDayAssignments() {
  localStorage.setItem('dayAssignments', JSON.stringify(dayAssignments));
  if (typeof syncToCloud === 'function') syncToCloud();
}

// Get kept dinners for the week planner
function getKeptDinnersForPlanner() {
  const dinners = [];
  DINNER_TYPES.forEach(type => {
    if (weeklyPicks[type] && keptRecipes[type]) {
      dinners.push({
        id: weeklyPicks[type].id,
        name: weeklyPicks[type].name,
        type: type,
        color: recipeColorsByType[type],
        recipe: weeklyPicks[type]
      });
    }
  });

  // Also include manually kept recipes that are dinners
  manuallyKeptRecipes.forEach(id => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      const categories = getRecipeCategories(recipe);
      // Check if it's a dinner-type recipe
      const isDinner = categories.some(cat =>
        ['pasta', 'chicken', 'meat', 'beef', 'pork', 'lamb', 'turkey', 'vegetarian', 'seafood'].includes(cat.toLowerCase())
      );
      if (isDinner) {
        dinners.push({
          id: recipe.id,
          name: recipe.name,
          type: 'manual',
          color: '#7a6c5d',
          recipe: recipe
        });
      }
    }
  });

  return dinners;
}

// Render the week planner
function renderWeekPlanner() {
  const dinners = getKeptDinnersForPlanner();
  const dinnerPool = document.getElementById('dinner-pool');
  const daySlots = document.querySelectorAll('.day-slot');

  if (!dinnerPool) return;

  // Clear all slots
  dinnerPool.innerHTML = '';
  daySlots.forEach(slot => slot.innerHTML = '');

  if (dinners.length === 0) {
    dinnerPool.innerHTML = '<span style="color: var(--color-ink-muted); font-size: 0.85rem; font-style: italic;">Keep some dinners to start planning</span>';
    return;
  }

  // Sort dinners into assigned and unassigned
  const assignedToDay = {};
  const unassigned = [];

  dinners.forEach(dinner => {
    const day = dayAssignments[dinner.id];
    if (day !== undefined && day !== null) {
      if (!assignedToDay[day]) assignedToDay[day] = [];
      assignedToDay[day].push(dinner);
    } else {
      unassigned.push(dinner);
    }
  });

  // Render unassigned dinners in the pool
  if (unassigned.length === 0) {
    dinnerPool.classList.add('empty');
  } else {
    dinnerPool.classList.remove('empty');
    unassigned.forEach(dinner => {
      dinnerPool.appendChild(createDinnerCard(dinner, false));
    });
  }

  // Render assigned dinners in day slots
  daySlots.forEach(slot => {
    const day = parseInt(slot.dataset.day);
    const dinnersForDay = assignedToDay[day] || [];
    dinnersForDay.forEach(dinner => {
      slot.appendChild(createDinnerCard(dinner, true));
    });
  });

  // Setup drag and drop
  setupWeekPlannerDragDrop();
}

// Create a dinner card element
function createDinnerCard(dinner, inSlot) {
  const card = document.createElement('div');
  card.className = 'dinner-card';
  card.draggable = true;
  card.dataset.id = dinner.id;
  card.dataset.type = dinner.type;

  card.innerHTML = `
    <span class="category-dot" style="background-color: ${dinner.color}"></span>
    <span class="dinner-name">${dinner.name}</span>
    ${inSlot ? '<button class="remove-from-day" title="Remove from day">&times;</button>' : ''}
  `;

  // Click to view recipe
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('remove-from-day')) {
      openRecipeModal(dinner.id);
    }
  });

  // Remove button handler
  if (inSlot) {
    const removeBtn = card.querySelector('.remove-from-day');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeRecipeFromDay(dinner.id);
    });
  }

  return card;
}

// Setup drag and drop for the week planner
function setupWeekPlannerDragDrop() {
  const cards = document.querySelectorAll('.dinner-card');
  const daySlots = document.querySelectorAll('.day-slot');
  const dinnerPool = document.getElementById('dinner-pool');

  cards.forEach(card => {
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', card.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    });
  });

  // Day slots as drop targets
  daySlots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      slot.parentElement.classList.add('drag-over');
    });

    slot.addEventListener('dragleave', (e) => {
      if (!slot.contains(e.relatedTarget)) {
        slot.parentElement.classList.remove('drag-over');
      }
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.parentElement.classList.remove('drag-over');
      const recipeId = e.dataTransfer.getData('text/plain');
      const day = parseInt(slot.dataset.day);
      assignRecipeToDay(recipeId, day);
    });
  });

  // Dinner pool as drop target (to unassign)
  if (dinnerPool) {
    dinnerPool.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dinnerPool.classList.add('drag-over');
    });

    dinnerPool.addEventListener('dragleave', () => {
      dinnerPool.classList.remove('drag-over');
    });

    dinnerPool.addEventListener('drop', (e) => {
      e.preventDefault();
      dinnerPool.classList.remove('drag-over');
      const recipeId = e.dataTransfer.getData('text/plain');
      removeRecipeFromDay(recipeId);
    });
  }
}

// Assign a recipe to a day
function assignRecipeToDay(recipeId, day) {
  dayAssignments[recipeId] = day;
  saveDayAssignments();
  renderWeekPlanner();
  renderPrepList();
}

// Remove a recipe from its assigned day
function removeRecipeFromDay(recipeId) {
  delete dayAssignments[recipeId];
  saveDayAssignments();
  renderWeekPlanner();
  renderPrepList();
}

// Get all kept recipes for prep list
function getKeptRecipesForPrep() {
  const keptList = [];

  ALL_MEAL_TYPES.forEach(type => {
    if (weeklyPicks[type] && keptRecipes[type]) {
      const recipe = weeklyPicks[type];
      keptList.push({
        recipe,
        name: recipe.name,
        color: recipeColorsByType[type]
      });
    }
  });

  // Add manually kept recipes
  const manualColor = '#7a6c5d';
  manuallyKeptRecipes.forEach(id => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      keptList.push({
        recipe,
        name: getRecipeTitle(recipe),
        color: manualColor
      });
    }
  });

  return keptList;
}

// Render prep list
function renderPrepList() {
  const keptDinners = getKeptDinnersForPlanner();
  const categoriesEl = document.getElementById('prep-categories');

  if (keptDinners.length === 0) {
    categoriesEl.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <h3>No dinners selected</h3>
        <p>Keep some dinners from This Week's Menu to see your prep list</p>
      </div>
    `;
    return;
  }

  // Check if any dinners are scheduled
  const scheduledDinners = keptDinners.filter(d => dayAssignments[d.id] !== undefined);

  if (scheduledDinners.length === 0) {
    categoriesEl.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <h3>Schedule your dinners</h3>
        <p>Drag dinners to days of the week above to see your prep list organized by cooking day</p>
      </div>
    `;
    return;
  }

  // Day names
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Task duration estimates - determines if prep should be done day-before
  // Quick tasks (< 5 min) = do day-of, Time-consuming (> 5 min) = prep day-before
  const quickActions = ['zest', 'mince', 'grate', 'measure', 'season', 'crack', 'squeeze', 'garnish', 'sprinkle'];
  const isQuickTask = (action) => quickActions.some(q => action.toLowerCase().includes(q));

  // Storage tips for prepped ingredients
  const storageTips = {
    // By ingredient
    'potato': 'Store peeled potatoes submerged in cold water in the fridge to prevent browning',
    'potatoes': 'Store peeled potatoes submerged in cold water in the fridge to prevent browning',
    'onion': 'Store in an airtight container in the fridge',
    'garlic': 'Store minced garlic in a small container, covered with a thin layer of olive oil',
    'carrot': 'Store in an airtight container with a damp paper towel',
    'celery': 'Store in water or wrapped in damp paper towels',
    'apple': 'Toss with lemon juice to prevent browning, store in airtight container',
    'avocado': 'Press plastic wrap directly on surface and refrigerate; use within a day',
    'lettuce': 'Wash and dry thoroughly, store in container lined with paper towels',
    'herbs': 'Wrap in damp paper towel, store in airtight container or plastic bag',
    'cilantro': 'Store stems in a jar of water, cover loosely with plastic bag',
    'parsley': 'Store stems in a jar of water, cover loosely with plastic bag',
    'basil': 'Store at room temperature in a jar of water; do not refrigerate',
    'ginger': 'Store peeled/sliced ginger in a jar, covered with dry sherry or vodka',
    'lemon': 'Store zest in freezer; store juice in airtight container in fridge',
    'lime': 'Store zest in freezer; store juice in airtight container in fridge',
    'mushroom': 'Store sliced mushrooms in a paper bag in the fridge',
    'pepper': 'Store cut peppers in an airtight container in the fridge',
    'tomato': 'Store cut tomatoes covered at room temperature; use within a day',
    'broccoli': 'Store cut florets in an airtight container in the fridge',
    'cauliflower': 'Store cut florets in an airtight container in the fridge',
    'zucchini': 'Store sliced in an airtight container with paper towel to absorb moisture',
    'squash': 'Store cut squash wrapped tightly in plastic wrap in the fridge',
    'eggplant': 'Store cut eggplant in salted water to prevent browning, drain before using',
    'cabbage': 'Store shredded cabbage in an airtight container in the fridge',
    'kale': 'Store washed and dried in a container lined with paper towels',
    'spinach': 'Store washed and dried in a container lined with paper towels',
    // By action (fallbacks)
    'Peel': 'Store peeled vegetables in cold water or airtight container in fridge',
    'Chop': 'Store in an airtight container in the fridge',
    'Dice': 'Store in an airtight container in the fridge',
    'Slice': 'Store in an airtight container in the fridge',
    'Julienne': 'Store in an airtight container with a damp paper towel',
    'Cube': 'Store in an airtight container in the fridge',
    'Shred': 'Store in an airtight container in the fridge',
    'Marinate': 'Keep marinating in the fridge; bring to room temp 30 min before cooking',
    'Toast': 'Store toasted items in an airtight container at room temperature',
  };

  // Get storage tip for a task
  const getStorageTip = (task) => {
    const itemLower = task.item.toLowerCase();
    // Check for ingredient-specific tips first
    for (const [key, tip] of Object.entries(storageTips)) {
      if (key.length > 3 && itemLower.includes(key)) {
        return tip;
      }
    }
    // Fall back to action-based tip
    return storageTips[task.action] || 'Store in an airtight container in the fridge';
  };

  // Extract all tasks with cooking day info
  // Skip Sunday (day 0) dinners - cooking starts on Sunday so no prep needed
  let allTasks = [];
  scheduledDinners.forEach(dinner => {
    const cookingDay = dayAssignments[dinner.id];
    // Sunday dinners don't need prep - they'll be made that night
    if (cookingDay === 0) return;
    const tasks = extractPrepTasks(dinner.recipe, dinner.name, dinner.color);
    tasks.forEach(task => {
      // Determine prep day: quick tasks = same day, others = day before
      const prepDay = isQuickTask(task.action) ? cookingDay : (cookingDay === 0 ? 6 : cookingDay - 1);
      allTasks.push({
        ...task,
        cookingDay,
        prepDay,
        forDinner: dinner.name,
        dinnerColor: dinner.color,
        isQuick: isQuickTask(task.action)
      });
    });
  });

  // Group tasks by prep day
  const tasksByPrepDay = {};
  allTasks.forEach(task => {
    const key = `${task.action.toLowerCase()}-${task.item.toLowerCase().replace(/\s+/g, '-')}-prep${task.prepDay}`;
    task.key = key;

    if (prepListState.removed.includes(key)) return;

    if (!tasksByPrepDay[task.prepDay]) {
      tasksByPrepDay[task.prepDay] = [];
    }
    tasksByPrepDay[task.prepDay].push(task);
  });

  // Combine similar tasks within each prep day
  Object.keys(tasksByPrepDay).forEach(day => {
    tasksByPrepDay[day] = combinePrepTasks(tasksByPrepDay[day]).map(task => ({
      ...task,
      key: `${task.action.toLowerCase()}-${task.item.toLowerCase().replace(/\s+/g, '-')}-prep${day}`
    })).filter(task => !prepListState.removed.includes(task.key));
  });

  // Remove empty days
  Object.keys(tasksByPrepDay).forEach(day => {
    if (tasksByPrepDay[day].length === 0) delete tasksByPrepDay[day];
  });

  if (Object.keys(tasksByPrepDay).length === 0) {
    categoriesEl.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
        <h3>No prep tasks found</h3>
        <p>These recipes don't have identifiable prep steps, or everything is done during cooking</p>
      </div>
    `;
    return;
  }

  // Sort prep days and render
  const sortedDays = Object.keys(tasksByPrepDay).map(Number).sort((a, b) => a - b);

  categoriesEl.innerHTML = sortedDays.map(prepDay => {
    const tasks = tasksByPrepDay[prepDay];

    // Get unique dinners being prepped for on this day
    const dinnersForDay = [...new Set(tasks.flatMap(t => t.recipes))];
    const dinnerTags = tasks
      .flatMap(t => t.recipeColors.map((color, i) => ({ name: t.recipes[i], color })))
      .filter((d, i, arr) => arr.findIndex(x => x.name === d.name) === i)
      .map(d => `<span class="prep-dinner-tag" style="background-color: ${d.color}">${d.name}</span>`)
      .join('');

    // Sort tasks - unchecked before checked, then by time-consuming first
    tasks.sort((a, b) => {
      const aChecked = prepListState.checked.includes(a.key) ? 1 : 0;
      const bChecked = prepListState.checked.includes(b.key) ? 1 : 0;
      if (aChecked !== bChecked) return aChecked - bChecked;
      // Time-consuming tasks first
      const aQuick = quickActions.some(q => a.action.toLowerCase().includes(q)) ? 1 : 0;
      const bQuick = quickActions.some(q => b.action.toLowerCase().includes(q)) ? 1 : 0;
      return aQuick - bQuick;
    });

    return `
    <div class="prep-day">
      <div class="prep-day-header">
        <span class="prep-day-name">${dayNames[prepDay]}</span>
        <span class="prep-day-label">Prep Day</span>
      </div>
      <div class="prep-day-subheader">
        Prepping for: ${dinnerTags}
      </div>
      <div class="prep-day-tasks">
        ${tasks.map((task) => {
          const colorDots = task.recipeColors
            .map(color => `<span class="ingredient-color-dot" style="background-color: ${color}"></span>`)
            .join('');
          const isChecked = prepListState.checked.includes(task.key);
          const checkedClass = isChecked ? 'checked' : '';
          const isQuick = quickActions.some(q => task.action.toLowerCase().includes(q));
          const timeLabel = isQuick ? 'quick' : '';
          // Format quantities
          let quantityDisplay = '';
          if (task.quantities && task.quantities.length > 0) {
            if (task.quantities.length === 1) {
              quantityDisplay = task.quantities[0].qty;
            } else {
              quantityDisplay = task.quantities.map(q => q.qty).join(' + ');
            }
          }
          const itemDisplay = quantityDisplay ? `${quantityDisplay} ${task.item}` : task.item;
          // Show storage tip for day-before prep (non-quick tasks)
          const storageTip = !isQuick ? getStorageTip(task) : '';
          const storageTipHtml = storageTip ? `<div class="storage-tip"><span class="storage-tip-icon">💡</span>${storageTip}</div>` : '';
          return `
          <div class="prep-item ${checkedClass}" title="For: ${task.recipes.join(', ')}">
            <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePrepTask('${task.key}')">
            <div class="ingredient-color-dots">${colorDots}</div>
            <div class="prep-task-content">
              <div class="prep-task-text">
                <span class="prep-action">${task.action}</span>
                <span class="prep-ingredient">${itemDisplay}</span>
              </div>
              ${storageTipHtml}
            </div>
            <button class="prep-remove" onclick="removePrepTask('${task.key}')" title="Remove task">&times;</button>
          </div>
        `}).join('')}
      </div>
    </div>
  `}).join('');
}

// Render recipe library
function renderLibrary() {
  const grid = document.getElementById('library-grid');
  const categoryFilter = document.getElementById('category-filter').value;
  const statusFilter = document.getElementById('status-filter').value;
  const searchQuery = document.getElementById('search-recipes').value.toLowerCase();

  let filtered = recipes.filter(r => !userPreferences.removed.includes(r.id));

  // Apply category filter (check edited categories too)
  if (categoryFilter !== 'all') {
    filtered = filtered.filter(r => getRecipeCategories(r).includes(categoryFilter));
  }

  // Apply status filter
  if (statusFilter === 'liked') {
    filtered = filtered.filter(r => userPreferences.liked.includes(r.id));
  } else if (statusFilter === 'unmarked') {
    filtered = filtered.filter(r => !userPreferences.liked.includes(r.id));
  }

  // Apply search (check title, ingredients, and author)
  if (searchQuery) {
    filtered = filtered.filter(r =>
      getRecipeTitle(r).toLowerCase().includes(searchQuery) ||
      r.ingredients.some(i => i.toLowerCase().includes(searchQuery)) ||
      getRecipeAuthor(r).toLowerCase().includes(searchQuery)
    );
  }

  // Update stats
  document.getElementById('recipe-count').textContent = `${filtered.length} recipes`;
  document.getElementById('liked-count').textContent = `${userPreferences.liked.length} liked`;

  // Render cards
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3>No recipes found</h3>
        <p>Try adjusting your filters</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(recipe => {
    const author = getRecipeAuthor(recipe);
    const categories = getRecipeCategories(recipe);
    return `
    <div class="library-card ${userPreferences.liked.includes(recipe.id) ? 'liked' : ''}" onclick="openRecipeModal('${recipe.id}')">
      <div class="library-card-categories">${categories.map(cat => `<span class="library-card-category">${cat}</span>`).join('')}</div>
      <h4 class="library-card-title">${getRecipeTitle(recipe)}</h4>
      ${author ? `<div class="library-card-author">${author}</div>` : ''}
    </div>
  `;
  }).join('');
}

// Open recipe modal
function openRecipeModal(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  // Get edited values or use original
  const displayTitle = userPreferences.titleEdits[id] || recipe.name;
  const displayCategories = getRecipeCategories(recipe);
  const displayAuthor = userPreferences.authorEdits[id] || recipe.author || '';

  // Populate author dropdown with existing authors
  populateAuthorDatalist();

  document.getElementById('modal-title').value = displayTitle;

  // Render category checkboxes with current selections
  renderCategoryCheckboxes(displayCategories);

  document.getElementById('modal-author').value = displayAuthor;

  document.getElementById('modal-ingredients').innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
  document.getElementById('modal-instructions').innerHTML = recipe.instructions.split('\n').map(p => `<p>${p}</p>`).join('');

  const notes = userPreferences.notes[id] || '';
  document.getElementById('modal-notes').value = notes;

  const likeBtn = document.getElementById('modal-like');
  const isLiked = userPreferences.liked.includes(id);
  likeBtn.classList.toggle('liked', isLiked);
  likeBtn.querySelector('span').textContent = isLiked ? 'Liked!' : 'Mark as Liked';

  // Update keep for week button state
  const keepWeekBtn = document.getElementById('modal-keep-week');
  const isKeptForWeek = manuallyKeptRecipes.includes(id);
  keepWeekBtn.classList.toggle('kept', isKeptForWeek);
  keepWeekBtn.querySelector('span').textContent = isKeptForWeek ? 'Kept for This Week!' : 'Keep for This Week';

  // Set data attribute for current recipe
  document.getElementById('recipe-modal').dataset.recipeId = id;

  // Show modal
  document.getElementById('recipe-modal').classList.add('active');
}

// Close modal
function closeModal() {
  document.getElementById('recipe-modal').classList.remove('active');
}

// Toggle like
function toggleLike() {
  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;

  const idx = userPreferences.liked.indexOf(id);
  if (idx > -1) {
    userPreferences.liked.splice(idx, 1);
  } else {
    userPreferences.liked.push(id);
  }

  saveUserPreferences();
  openRecipeModal(id); // Refresh modal
  renderLibrary();
}

// Save notes
function saveNotes() {
  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;
  const notes = document.getElementById('modal-notes').value;

  userPreferences.notes[id] = notes;
  saveUserPreferences();

  alert('Notes saved!');
}

// Save title edit
function saveTitleEdit() {
  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;
  const newTitle = document.getElementById('modal-title').value.trim();

  if (newTitle) {
    userPreferences.titleEdits[id] = newTitle;
    saveUserPreferences();
    renderLibrary();
  }
}

// Save category edit
function saveCategoryEdit() {
  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;
  const checkboxes = document.querySelectorAll('#modal-categories input[type="checkbox"]:checked');
  const newCategories = Array.from(checkboxes).map(cb => cb.value);

  if (newCategories.length > 0) {
    userPreferences.categoryEdits[id] = newCategories;
  } else {
    // If nothing selected, keep at least the original category
    delete userPreferences.categoryEdits[id];
  }
  saveUserPreferences();
  renderLibrary();
}

// Save author edit
function saveAuthorEdit() {
  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;
  const newAuthor = document.getElementById('modal-author').value.trim();

  if (newAuthor) {
    userPreferences.authorEdits[id] = newAuthor;
  } else {
    delete userPreferences.authorEdits[id];
  }
  saveUserPreferences();
  renderLibrary();
}

// Get display title for a recipe (edited or original)
function getRecipeTitle(recipe) {
  return userPreferences.titleEdits[recipe.id] || recipe.name;
}

// Get display categories for a recipe (edited or original) - always returns array
function getRecipeCategories(recipe) {
  const edited = userPreferences.categoryEdits[recipe.id];
  if (edited) {
    return Array.isArray(edited) ? edited : [edited];
  }
  const original = recipe.category;
  return Array.isArray(original) ? original : [original];
}

// Backward compatible - returns first category or comma-separated string for display
function getRecipeCategory(recipe) {
  const cats = getRecipeCategories(recipe);
  return cats.join(', ');
}

// Get display author for a recipe (check edits first, then recipe data)
function getRecipeAuthor(recipe) {
  return userPreferences.authorEdits[recipe.id] || recipe.author || '';
}

// Get all unique authors from preferences
function getAllAuthors() {
  const authors = Object.values(userPreferences.authorEdits).filter(a => a && a.trim());
  return [...new Set(authors)].sort();
}

// Get all available categories (default + custom, minus deleted)
function getAllCategories() {
  const deleted = userPreferences.deletedCategories || [];
  const custom = userPreferences.customCategories || [];
  const all = [...defaultCategories.filter(c => !deleted.includes(c)), ...custom];
  return [...new Set(all)].sort();
}

// Get display name for a category
function getCategoryDisplayName(cat) {
  return categoryDisplayNames[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

// Render category checkboxes in modal
function renderCategoryCheckboxes(selectedCategories = []) {
  const container = document.getElementById('modal-categories');
  const categories = getAllCategories();

  container.innerHTML = categories.map(cat => {
    const checked = selectedCategories.includes(cat) ? 'checked' : '';
    const displayName = getCategoryDisplayName(cat);
    if (manageMode) {
      return `
        <label class="category-checkbox manage-mode" data-category="${cat}">
          <input type="checkbox" value="${cat}" ${checked}>
          <span class="category-name" contenteditable="true">${displayName}</span>
          <button type="button" class="category-delete" onclick="deleteCategory('${cat}')" title="Delete category">&times;</button>
        </label>
      `;
    } else {
      return `
        <label class="category-checkbox">
          <input type="checkbox" value="${cat}" ${checked}>
          <span>${displayName}</span>
        </label>
      `;
    }
  }).join('');

  // Re-attach event listeners for checkboxes
  container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', saveCategoryEdit);
  });

  // Attach event listeners for category name editing in manage mode
  if (manageMode) {
    container.querySelectorAll('.category-name').forEach(span => {
      span.addEventListener('blur', handleCategoryRename);
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          span.blur();
        }
      });
    });
  }
}

// Render category filter dropdown in library
function renderCategoryFilter() {
  const select = document.getElementById('category-filter');
  const currentValue = select.value;
  const categories = getAllCategories();

  select.innerHTML = '<option value="all">All Categories</option>' +
    categories.map(cat => `<option value="${cat}">${getCategoryDisplayName(cat)}</option>`).join('');

  // Restore selection if still valid
  if (categories.includes(currentValue) || currentValue === 'all') {
    select.value = currentValue;
  }
}

// Add a new category
function addCategory(name) {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return false;

  const existing = getAllCategories();
  if (existing.includes(normalized)) {
    alert('This category already exists.');
    return false;
  }

  if (!userPreferences.customCategories) {
    userPreferences.customCategories = [];
  }
  userPreferences.customCategories.push(normalized);

  // If it was previously deleted, remove from deleted list
  if (userPreferences.deletedCategories) {
    userPreferences.deletedCategories = userPreferences.deletedCategories.filter(c => c !== normalized);
  }

  saveUserPreferences();
  return true;
}

// Delete a category
function deleteCategory(cat) {
  if (!confirm(`Delete the "${getCategoryDisplayName(cat)}" category? Recipes will keep their other categories.`)) {
    return;
  }

  // Remove from custom categories if it's there
  if (userPreferences.customCategories) {
    userPreferences.customCategories = userPreferences.customCategories.filter(c => c !== cat);
  }

  // Add to deleted list if it's a default category
  if (defaultCategories.includes(cat)) {
    if (!userPreferences.deletedCategories) {
      userPreferences.deletedCategories = [];
    }
    userPreferences.deletedCategories.push(cat);
  }

  // Remove this category from all recipe edits
  Object.keys(userPreferences.categoryEdits).forEach(id => {
    const cats = userPreferences.categoryEdits[id];
    if (Array.isArray(cats)) {
      userPreferences.categoryEdits[id] = cats.filter(c => c !== cat);
      if (userPreferences.categoryEdits[id].length === 0) {
        delete userPreferences.categoryEdits[id];
      }
    } else if (cats === cat) {
      delete userPreferences.categoryEdits[id];
    }
  });

  saveUserPreferences();

  // Re-render
  const modal = document.getElementById('recipe-modal');
  if (modal.classList.contains('active')) {
    const id = modal.dataset.recipeId;
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
      renderCategoryCheckboxes(getRecipeCategories(recipe));
    }
  }
  renderCategoryFilter();
  renderLibrary();
}

// Handle category rename
function handleCategoryRename(e) {
  const span = e.target;
  const label = span.closest('.category-checkbox');
  const oldCat = label.dataset.category;
  const newName = span.textContent.trim().toLowerCase();

  if (newName === oldCat || newName === getCategoryDisplayName(oldCat).toLowerCase()) {
    return; // No change
  }

  if (!newName) {
    span.textContent = getCategoryDisplayName(oldCat);
    return;
  }

  const existing = getAllCategories();
  if (existing.includes(newName) && newName !== oldCat) {
    alert('A category with this name already exists.');
    span.textContent = getCategoryDisplayName(oldCat);
    return;
  }

  // Rename: add new, update recipes, delete old
  addCategory(newName);

  // Update all recipes that use the old category
  Object.keys(userPreferences.categoryEdits).forEach(id => {
    const cats = userPreferences.categoryEdits[id];
    if (Array.isArray(cats) && cats.includes(oldCat)) {
      userPreferences.categoryEdits[id] = cats.map(c => c === oldCat ? newName : c);
    } else if (cats === oldCat) {
      userPreferences.categoryEdits[id] = newName;
    }
  });

  // Also update recipes in the original data reference
  recipes.forEach(r => {
    if (Array.isArray(r.category) && r.category.includes(oldCat)) {
      // Need to create an edit entry if not exists
      if (!userPreferences.categoryEdits[r.id]) {
        userPreferences.categoryEdits[r.id] = r.category.map(c => c === oldCat ? newName : c);
      }
    } else if (r.category === oldCat) {
      if (!userPreferences.categoryEdits[r.id]) {
        userPreferences.categoryEdits[r.id] = [newName];
      }
    }
  });

  // Remove old category
  if (userPreferences.customCategories) {
    userPreferences.customCategories = userPreferences.customCategories.filter(c => c !== oldCat);
  }
  if (defaultCategories.includes(oldCat)) {
    if (!userPreferences.deletedCategories) {
      userPreferences.deletedCategories = [];
    }
    userPreferences.deletedCategories.push(oldCat);
  }

  saveUserPreferences();

  // Re-render
  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;
  const recipe = recipes.find(r => r.id === id);
  if (recipe) {
    renderCategoryCheckboxes(getRecipeCategories(recipe));
  }
  renderCategoryFilter();
  renderLibrary();
}

// Toggle manage mode
function toggleManageMode() {
  manageMode = !manageMode;
  const btn = document.getElementById('manage-categories-btn');
  btn.classList.toggle('active', manageMode);

  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;
  const recipe = recipes.find(r => r.id === id);
  if (recipe) {
    renderCategoryCheckboxes(getRecipeCategories(recipe));
  }
}

// Populate the author datalist
function populateAuthorDatalist() {
  const datalist = document.getElementById('author-list');
  const authors = getAllAuthors();
  datalist.innerHTML = authors.map(author => `<option value="${author}">`).join('');
}

// Remove recipe
function removeRecipe() {
  const modal = document.getElementById('recipe-modal');
  const id = modal.dataset.recipeId;
  const recipe = recipes.find(r => r.id === id);

  if (confirm(`Remove "${recipe.name}" from your collection? This cannot be undone.`)) {
    userPreferences.removed.push(id);
    saveUserPreferences();
    closeModal();
    renderLibrary();
    generateWeeklyPicks();
  }
}

// Switch tab
function switchTab(tabName) {
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.toggle('active', tab.id === `${tabName}-tab`);
  });

  // Refresh content based on tab
  if (tabName === 'library') {
    renderLibrary();
  } else if (tabName === 'grocery') {
    renderGroceryList();
    renderMiscItems();
  } else if (tabName === 'prep') {
    renderWeekPlanner();
    renderPrepList();
  }
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Weekly picks actions
  document.querySelectorAll('.recipe-card').forEach(card => {
    const type = card.id.replace('-pick', '');

    card.querySelector('.btn-keep').addEventListener('click', (e) => {
      e.stopPropagation();
      handleKeep(type);
    });

    card.querySelector('.btn-skip').addEventListener('click', (e) => {
      e.stopPropagation();
      handleSkip(type);
    });

    card.querySelector('.btn-view-recipe').addEventListener('click', (e) => {
      e.stopPropagation();
      openWeeklyRecipeModal(type);
    });
  });

  // Expiring ingredients
  document.getElementById('apply-expiring').addEventListener('click', () => {
    // Reset skipped recipes when applying new expiring ingredients
    skippedRecipes = { breakfast1: [], breakfast2: [], lunch1: [], lunch2: [], lunch3: [], pasta: [], chicken: [], meat: [], vegetarian: [] };
    keptRecipes = { breakfast1: false, breakfast2: false, lunch1: false, lunch2: false, lunch3: false, pasta: false, chicken: false, meat: false, vegetarian: false };
    generateWeeklyPicks();
  });

  // Generate grocery list
  document.getElementById('generate-grocery').addEventListener('click', generateGroceryList);

  // Start new week
  document.getElementById('start-new-week').addEventListener('click', startNewWeek);

  // Library filters
  document.getElementById('category-filter').addEventListener('change', renderLibrary);
  document.getElementById('status-filter').addEventListener('change', renderLibrary);
  document.getElementById('search-recipes').addEventListener('input', renderLibrary);

  // Grocery actions
  document.getElementById('copy-list').addEventListener('click', copyGroceryList);
  document.getElementById('clear-list').addEventListener('click', clearGroceryList);

  // Misc items
  document.getElementById('add-misc-item').addEventListener('click', () => {
    const input = document.getElementById('misc-item-input');
    addMiscItem(input.value);
    input.value = '';
  });
  document.getElementById('misc-item-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addMiscItem(e.target.value);
      e.target.value = '';
    }
  });

  // Modal
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('recipe-modal').addEventListener('click', (e) => {
    if (e.target.id === 'recipe-modal') closeModal();
  });
  document.getElementById('modal-like').addEventListener('click', toggleLike);
  document.getElementById('modal-keep-week').addEventListener('click', handleKeepForWeek);
  document.getElementById('save-notes').addEventListener('click', saveNotes);
  document.getElementById('modal-remove').addEventListener('click', removeRecipe);

  // Title, category, and author editing
  document.getElementById('modal-title').addEventListener('blur', saveTitleEdit);
  document.getElementById('modal-title').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  });
  // Category management
  document.getElementById('new-category-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target;
      if (addCategory(input.value)) {
        input.value = '';
        const modal = document.getElementById('recipe-modal');
        const id = modal.dataset.recipeId;
        const recipe = recipes.find(r => r.id === id);
        if (recipe) {
          renderCategoryCheckboxes(getRecipeCategories(recipe));
        }
        renderCategoryFilter();
      }
    }
  });
  document.getElementById('manage-categories-btn').addEventListener('click', toggleManageMode);

  document.getElementById('modal-author').addEventListener('blur', saveAuthorEdit);
  document.getElementById('modal-author').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Make functions available globally
window.toggleGroceryItem = toggleGroceryItem;
window.removeGroceryItem = removeGroceryItem;
window.toggleMiscItem = toggleMiscItem;
window.removeMiscItem = removeMiscItem;
window.openRecipeModal = openRecipeModal;
window.deleteCategory = deleteCategory;
window.removeManualPick = removeManualPick;
window.togglePrepTask = togglePrepTask;
window.removePrepTask = removePrepTask;
window.openWeeklyRecipeModal = openWeeklyRecipeModal;

// ==================== FIREBASE AUTH & SYNC ====================

// Debounce timer for cloud sync
let syncTimeout = null;
let isSyncing = false;

// Gather all app data for cloud sync
function gatherAllData() {
  const weeklyPicksIds = {};
  ALL_MEAL_TYPES.forEach(type => {
    weeklyPicksIds[type] = weeklyPicks[type]?.id || null;
  });

  return {
    userPreferences,
    weeklyPicks: weeklyPicksIds,
    keptRecipes,
    skippedRecipes,
    manuallyKeptRecipes,
    groceryList,
    miscItems,
    prepListState,
    dayAssignments
  };
}

// Save all data to cloud (debounced)
function syncToCloud() {
  if (!getCurrentUser()) return;

  // Clear existing timeout
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  // Debounce - wait 1 second before syncing
  syncTimeout = setTimeout(async () => {
    isSyncing = true;
    updateSyncIndicator('syncing');

    const data = gatherAllData();
    const success = await saveToCloud(data);

    isSyncing = false;
    updateSyncIndicator(success ? 'synced' : 'error');
  }, 1000);
}

// Update sync indicator UI
function updateSyncIndicator(status) {
  const indicator = document.getElementById('sync-indicator');
  if (!indicator) return;

  indicator.className = `sync-indicator ${status}`;

  if (status === 'syncing') {
    indicator.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Syncing...
    `;
  } else if (status === 'synced') {
    indicator.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      Synced
    `;
    // Hide after 2 seconds
    setTimeout(() => {
      indicator.innerHTML = '';
    }, 2000);
  } else if (status === 'error') {
    indicator.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      Sync failed
    `;
  }
}

// Apply cloud data to local state
function applyCloudData(cloudData) {
  if (!cloudData) return;

  // Apply user preferences
  if (cloudData.userPreferences) {
    userPreferences = { ...userPreferences, ...cloudData.userPreferences };
    localStorage.setItem('recipePreferences', JSON.stringify(userPreferences));
  }

  // Apply kept recipes flags
  if (cloudData.keptRecipes) {
    keptRecipes = cloudData.keptRecipes;
    localStorage.setItem('keptRecipes', JSON.stringify(keptRecipes));
  }

  // Apply skipped recipes
  if (cloudData.skippedRecipes) {
    skippedRecipes = cloudData.skippedRecipes;
    localStorage.setItem('skippedRecipes', JSON.stringify(skippedRecipes));
  }

  // Apply manually kept recipes
  if (cloudData.manuallyKeptRecipes) {
    manuallyKeptRecipes = cloudData.manuallyKeptRecipes;
    localStorage.setItem('manuallyKeptRecipes', JSON.stringify(manuallyKeptRecipes));
  }

  // Apply grocery list
  if (cloudData.groceryList) {
    groceryList = cloudData.groceryList;
    localStorage.setItem('groceryList', JSON.stringify(groceryList));
  }

  // Apply misc items
  if (cloudData.miscItems) {
    miscItems = cloudData.miscItems;
    localStorage.setItem('miscItems', JSON.stringify(miscItems));
  }

  // Apply prep list state
  if (cloudData.prepListState) {
    prepListState = cloudData.prepListState;
    localStorage.setItem('prepListState', JSON.stringify(prepListState));
  }

  // Apply day assignments
  if (cloudData.dayAssignments) {
    dayAssignments = cloudData.dayAssignments;
    localStorage.setItem('dayAssignments', JSON.stringify(dayAssignments));
  }

  // Apply weekly picks (need to resolve IDs to full recipes)
  if (cloudData.weeklyPicks && recipes.length > 0) {
    ALL_MEAL_TYPES.forEach(type => {
      const recipeId = cloudData.weeklyPicks[type];
      if (recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
          weeklyPicks[type] = recipe;
        }
      }
    });
    localStorage.setItem('weeklyPicks', JSON.stringify(weeklyPicks));
  }

  // Refresh UI
  renderLibrary();
  restoreOrGenerateWeeklyPicks();
  renderManualPicks();
  updateStartNewWeekButton();
  updateGenerateGroceryButton();
}

// Allowed email addresses
const ALLOWED_EMAILS = ['francesca.shlain@gmail.com', 'eliotgoldfarb@gmail.com'];

// Handle auth state changes
function handleAuthStateChange(user) {
  const loginScreen = document.getElementById('login-screen');
  const appContent = document.getElementById('app-content');
  const signInBtn = document.getElementById('sign-in-btn');
  const userInfo = document.getElementById('user-info');
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');

  if (user) {
    // Check if user is authorized
    if (!ALLOWED_EMAILS.includes(user.email)) {
      alert('Sorry, this app is private. Access is limited to authorized users only.');
      signOutUser();
      return;
    }

    // User is signed in and authorized - show app
    loginScreen.classList.add('hidden');
    appContent.style.display = 'block';

    signInBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    userAvatar.src = user.photoURL || '';
    userName.textContent = user.displayName || user.email;

    // Add sync indicator if not exists
    if (!document.getElementById('sync-indicator')) {
      const indicator = document.createElement('span');
      indicator.id = 'sync-indicator';
      indicator.className = 'sync-indicator';
      userInfo.appendChild(indicator);
    }

    // Load data from cloud
    loadFromCloud().then(cloudData => {
      if (cloudData) {
        applyCloudData(cloudData);
      } else {
        // First time sign in - push local data to cloud
        syncToCloud();
      }
    });
  } else {
    // User is signed out - show login screen
    loginScreen.classList.remove('hidden');
    appContent.style.display = 'none';

    signInBtn.style.display = 'inline-flex';
    userInfo.style.display = 'none';

    // Remove sync indicator
    const indicator = document.getElementById('sync-indicator');
    if (indicator) indicator.remove();
  }
}

// Handle cloud data received (real-time updates)
window.onCloudDataReceived = function(cloudData) {
  // Only apply if not currently syncing (to avoid loops)
  if (!isSyncing && cloudData) {
    applyCloudData(cloudData);
  }
};

// Setup auth event listeners
function setupAuthListeners() {
  const loginBtn = document.getElementById('login-btn');
  const signInBtn = document.getElementById('sign-in-btn');
  const signOutBtn = document.getElementById('sign-out-btn');

  // Login screen button
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Sign in failed:', error);
        alert('Sign in failed. Please try again.');
      }
    });
  }

  // Header sign in button (backup)
  if (signInBtn) {
    signInBtn.addEventListener('click', async () => {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Sign in failed:', error);
        alert('Sign in failed. Please try again.');
      }
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      try {
        await signOutUser();
      } catch (error) {
        console.error('Sign out failed:', error);
      }
    });
  }

  // Set up auth state callback
  setAuthStateCallback(handleAuthStateChange);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  init();
  setupAuthListeners();
});
