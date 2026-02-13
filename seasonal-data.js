// Seasonal produce data by month
const seasonalProduce = {
  january: [
    'beetroot', 'broccoli rabe', 'cabbage', 'carrots', 'celery root', 'chestnuts',
    'collard greens', 'crabapples', 'endive', 'escarole', 'horseradish', 'kohlrabi',
    'leeks', 'parsnips', 'potatoes', 'rosemary', 'rutabaga', 'salsify', 'sumac',
    'sunchokes', 'turnips', 'winter squash'
  ],
  february: [
    'beetroot', 'bok choy', 'broccoli', 'cabbage', 'celeriac', 'collard greens',
    'grapefruit', 'horseradish', 'lemons', 'mushrooms', 'onions', 'oranges',
    'parsnips', 'potatoes', 'rosemary', 'rutabaga', 'sage', 'sunchokes',
    'swiss chard', 'tangerines', 'turnips', 'winter squash'
  ],
  march: [
    'artichokes', 'asparagus', 'bok choy', 'broccoli', 'cabbage', 'chicories',
    'chives', 'fava beans', 'fiddleheads', 'green peas', 'leeks', 'mushrooms',
    'nettles', 'parsley', 'parsnips', 'potatoes', 'radish', 'ramps', 'scallions',
    'spinach', 'swiss chard', 'watercress'
  ],
  april: [
    'artichokes', 'arugula', 'asparagus', 'carrots', 'celery', 'chicories',
    'chives', 'dandelion greens', 'fava beans', 'fiddleheads', 'leeks', 'mushrooms',
    'new potatoes', 'parsnips', 'pea shoots', 'purslane', 'radishes', 'ramps',
    'rapini', 'rhubarb', 'shallots', 'watercress'
  ],
  may: [
    'artichokes', 'arugula', 'asparagus', 'beet greens', 'chives', 'elderflower',
    'fava beans', 'fiddleheads', 'garlic scapes', 'green peas', 'lettuce', 'mushrooms',
    'new potatoes', 'parsley', 'pea shoots', 'radishes', 'rhubarb', 'scallions',
    'sorrel', 'swiss chard', 'turnip greens', 'watercress'
  ],
  june: [
    'asparagus', 'beet greens', 'broccoli', 'cherries', 'chives', 'collard greens',
    'garlic scapes', 'green peas', 'gooseberries', 'kohlrabi', 'lettuce', 'mulberries',
    'mushrooms', 'new potatoes', 'radishes', 'rhubarb', 'scallions', 'squash blossoms',
    'strawberries', 'summer squash', 'swiss chard', 'turnip greens'
  ],
  july: [
    'apricots', 'blueberries', 'carrots', 'cherries', 'cucumber', 'currants',
    'eggplant', 'fava beans', 'fresh herbs', 'gooseberries', 'green beans', 'melon',
    'peaches', 'peppers', 'plums', 'purslane', 'raspberries', 'summer squash',
    'sweet corn', 'swiss chard', 'tart cherries', 'tomatoes'
  ],
  august: [
    'apricots', 'blackberries', 'blueberries', 'cantaloupe', 'cucumbers', 'currants',
    'eggplant', 'garlic', 'grapes', 'green beans', 'ground cherries', 'nectarines',
    'peaches', 'pears', 'peppers', 'plums', 'raspberries', 'summer squash',
    'sweet corn', 'tomatillos', 'tomatoes', 'winter squash'
  ],
  september: [
    'apples', 'blackberries', 'broccoli', 'carrots', 'cauliflower', 'cucumbers',
    'eggplant', 'elderberries', 'fresh figs', 'grapes', 'ground cherries', 'lima beans',
    'melon', 'peaches', 'pears', 'peppers', 'plums', 'raspberries', 'summer squash',
    'sweet corn', 'tomatoes', 'winter squash'
  ],
  october: [
    'apples', 'beets', 'broccoli', 'brussels sprout', 'cabbage', 'cauliflower',
    'chestnuts', 'collard greens', 'fresh figs', 'grapes', 'kale', 'leeks', 'melon',
    'parsnips', 'pears', 'peppers', 'plums', 'quince', 'radicchio', 'sweet potatoes',
    'swiss chard', 'winter squash'
  ],
  november: [
    'apples', 'beets', 'brussels sprouts', 'cabbage', 'carrots', 'cauliflower',
    'chicories', 'collard greens', 'fennel', 'hearty herbs', 'leeks', 'nopales',
    'parsnips', 'pears', 'persimmons', 'pomegranate', 'quince', 'romanesco',
    'sunchokes', 'swiss chard', 'turnips', 'winter squash'
  ],
  december: [
    'apples', 'beetroot', 'broccoli', 'cabbage', 'carrots', 'cauliflower',
    'celery root', 'fennel', 'hardy herbs', 'horseradish', 'juniper berries', 'leeks',
    'mushrooms', 'nopales', 'parsnips', 'persimmon', 'potatoes', 'rutabaga',
    'sunchokes', 'swiss chard', 'turnips', 'winter squash'
  ]
};

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

// Check if a recipe uses seasonal ingredients
function getSeasonalScore(recipe, seasonalIngredients) {
  if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return 0;

  let score = 0;
  const ingredientText = recipe.ingredients.join(' ').toLowerCase();

  seasonalIngredients.forEach(produce => {
    if (ingredientText.includes(produce.toLowerCase())) {
      score += 1;
    }
  });

  return score;
}

// Check if recipe uses expiring ingredients
function usesExpiringIngredients(recipe, expiringIngredients) {
  if (!recipe.ingredients || !expiringIngredients || expiringIngredients.length === 0) return false;

  const ingredientText = recipe.ingredients.join(' ').toLowerCase();

  return expiringIngredients.some(item =>
    ingredientText.includes(item.toLowerCase())
  );
}

export { seasonalProduce, getCurrentSeasonalProduce, getSeasonalScore, usesExpiringIngredients };
