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
  'pasta', 'chicken', 'beef', 'pork', 'lamb', 'seafood',
  'vegetarian', 'soup', 'salad', 'side', 'bread', 'sauce',
  'dessert', 'breakfast'
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
  pasta: null,
  chicken: null,
  meat: null,
  vegetarian: null
};
let keptRecipes = {
  pasta: false,
  chicken: false,
  meat: false,
  vegetarian: false
};
let groceryList = [];
let skippedRecipes = {
  pasta: [],
  chicken: [],
  meat: [],
  vegetarian: []
};

// Initialize the app
async function init() {
  loadUserPreferences();
  await loadRecipes();
  setupEventListeners();
  updateSeasonalDisplay();
  renderCategoryFilter();
  generateWeeklyPicks();
  renderLibrary();
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

// Save user preferences to localStorage
function saveUserPreferences() {
  localStorage.setItem('recipePreferences', JSON.stringify(userPreferences));
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
    pasta: ['pasta'],
    chicken: ['chicken'],
    meat: ['beef', 'pork', 'lamb', 'turkey'],
    vegetarian: ['vegetarian']
  };

  const targetCategories = categoryMap[type];
  return recipes.filter(r => {
    const recipeCategories = getRecipeCategories(r);
    return recipeCategories.some(cat => targetCategories.includes(cat)) &&
      !userPreferences.removed.includes(r.id) &&
      !skippedRecipes[type].includes(r.id);
  });
}

// Generate weekly picks
function generateWeeklyPicks() {
  const { produce } = getCurrentSeasonalProduce();
  const expiringInput = document.getElementById('expiring-input');
  const expiringIngredients = expiringInput.value ? expiringInput.value.split(',').map(s => s.trim()) : [];

  ['pasta', 'chicken', 'meat', 'vegetarian'].forEach(type => {
    if (!keptRecipes[type]) {
      const available = getRecipesByType(type);

      if (available.length === 0) {
        weeklyPicks[type] = null;
        renderRecipeCard(type, null);
        return;
      }

      // Sort by seasonal score
      available.sort((a, b) => {
        return getSeasonalScore(b, produce, expiringIngredients) - getSeasonalScore(a, produce, expiringIngredients);
      });

      // Pick the best match
      weeklyPicks[type] = available[0];
      renderRecipeCard(type, available[0]);
    }
  });

  updateGenerateGroceryButton();
}

// Render a recipe card
function renderRecipeCard(type, recipe) {
  const card = document.getElementById(`${type}-pick`);
  const loading = card.querySelector('.card-loading');
  const content = card.querySelector('.card-content');

  if (!recipe) {
    loading.textContent = `No ${type} recipes available`;
    loading.style.display = 'block';
    content.style.display = 'none';
    return;
  }

  const { produce } = getCurrentSeasonalProduce();
  const seasonalIngredients = getSeasonalIngredientsInRecipe(recipe, produce);

  content.querySelector('.card-title').textContent = recipe.name;

  // Render seasonal ingredient tags
  const tagsContainer = content.querySelector('.card-seasonal-tags');
  if (seasonalIngredients.length > 0) {
    tagsContainer.innerHTML = seasonalIngredients.map(ingredient =>
      `<span class="seasonal-tag">${ingredient}</span>`
    ).join('');
    tagsContainer.style.display = 'flex';
  } else {
    tagsContainer.innerHTML = '';
    tagsContainer.style.display = 'none';
  }

  const ingredientPreview = recipe.ingredients.slice(0, 4).join(', ') + '...';
  content.querySelector('.card-ingredients').textContent = ingredientPreview;

  loading.style.display = 'none';
  content.style.display = 'block';

  // Update card state
  if (keptRecipes[type]) {
    card.classList.add('kept');
    content.querySelector('.btn-keep').textContent = 'Kept!';
    content.querySelector('.btn-keep').disabled = true;
    content.querySelector('.btn-skip').style.display = 'none';
  } else {
    card.classList.remove('kept');
    content.querySelector('.btn-keep').textContent = 'Keep';
    content.querySelector('.btn-keep').disabled = false;
    content.querySelector('.btn-skip').style.display = 'inline-block';
  }
}

// Handle keep action
function handleKeep(type) {
  keptRecipes[type] = true;
  renderRecipeCard(type, weeklyPicks[type]);
  updateGenerateGroceryButton();
}

// Handle skip action
function handleSkip(type) {
  if (weeklyPicks[type]) {
    skippedRecipes[type].push(weeklyPicks[type].id);
  }

  // Check if we've skipped all available recipes - if so, reset to cycle through again
  const categoryMap = {
    pasta: ['pasta'],
    chicken: ['chicken'],
    meat: ['beef', 'pork', 'lamb', 'turkey'],
    vegetarian: ['vegetarian']
  };
  const targetCategories = categoryMap[type];
  const allInCategory = recipes.filter(r => {
    const recipeCategories = getRecipeCategories(r);
    return recipeCategories.some(cat => targetCategories.includes(cat)) &&
      !userPreferences.removed.includes(r.id);
  });

  // If we've skipped all recipes in this category, reset the skipped list
  if (skippedRecipes[type].length >= allInCategory.length) {
    skippedRecipes[type] = [];
  }

  generateWeeklyPicks();
}

// Update the generate grocery button visibility
function updateGenerateGroceryButton() {
  // Show button when at least 1 recipe is kept
  const keptCount = Object.values(keptRecipes).filter(Boolean).length;
  const btn = document.getElementById('generate-grocery');
  btn.style.display = keptCount >= 1 ? 'inline-flex' : 'none';
}

// Recipe colors for grocery list - mapped by category type
const recipeColorsByType = {
  pasta: '#d4a574',      // warm tan
  chicken: '#c17c5e',    // terracotta
  meat: '#2d3232',       // dark
  vegetarian: '#4d5532'  // olive
};

// Generate grocery list
function generateGroceryList() {
  groceryList = [];
  const keptRecipesList = [];

  ['pasta', 'chicken', 'meat', 'vegetarian'].forEach(type => {
    if (weeklyPicks[type] && keptRecipes[type]) {
      const recipe = weeklyPicks[type];
      const color = recipeColorsByType[type];
      keptRecipesList.push({ name: recipe.name, color: color });
      recipe.ingredients.forEach(ingredient => {
        // Skip kosher salt - always have it on hand
        if (ingredient.toLowerCase().includes('kosher salt')) {
          return;
        }
        groceryList.push({
          item: ingredient,
          recipe: recipe.name,
          recipeColor: color,
          checked: false
        });
      });
    }
  });

  // Save to localStorage
  localStorage.setItem('groceryList', JSON.stringify(groceryList));
  localStorage.setItem('groceryRecipes', JSON.stringify(keptRecipesList));

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
        ${items.map((item, idx) => `
          <div class="grocery-item ${item.checked ? 'checked' : ''}" data-idx="${groceryList.indexOf(item)}">
            <span class="ingredient-color-dot" style="background-color: ${item.recipeColor || '#4d5532'}"></span>
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleGroceryItem(${groceryList.indexOf(item)})">
            <label>${item.item}</label>
          </div>
        `).join('')}
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
    const lower = item.item.toLowerCase();

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

// Copy grocery list to clipboard
function copyGroceryList() {
  const text = groceryList.map(item => `${item.checked ? '[x]' : '[ ]'} ${item.item}`).join('\n');
  navigator.clipboard.writeText(text).then(() => {
    alert('Grocery list copied to clipboard!');
  });
}

// Clear grocery list
function clearGroceryList() {
  if (confirm('Are you sure you want to clear the grocery list?')) {
    localStorage.removeItem('groceryList');
    localStorage.removeItem('groceryRecipes');
    groceryList = [];
    renderGroceryList();
  }
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
  });

  // Expiring ingredients
  document.getElementById('apply-expiring').addEventListener('click', () => {
    // Reset skipped recipes when applying new expiring ingredients
    skippedRecipes = { pasta: [], chicken: [], meat: [], vegetarian: [] };
    keptRecipes = { pasta: false, chicken: false, meat: false, vegetarian: false };
    generateWeeklyPicks();
  });

  // Generate grocery list
  document.getElementById('generate-grocery').addEventListener('click', generateGroceryList);

  // Library filters
  document.getElementById('category-filter').addEventListener('change', renderLibrary);
  document.getElementById('status-filter').addEventListener('change', renderLibrary);
  document.getElementById('search-recipes').addEventListener('input', renderLibrary);

  // Grocery actions
  document.getElementById('copy-list').addEventListener('click', copyGroceryList);
  document.getElementById('clear-list').addEventListener('click', clearGroceryList);

  // Modal
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('recipe-modal').addEventListener('click', (e) => {
    if (e.target.id === 'recipe-modal') closeModal();
  });
  document.getElementById('modal-like').addEventListener('click', toggleLike);
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
window.openRecipeModal = openRecipeModal;
window.deleteCategory = deleteCategory;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
