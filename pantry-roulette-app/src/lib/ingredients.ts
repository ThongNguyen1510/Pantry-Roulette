// ─── Ingredient Data for the 4-Reel Slot Machine ───────────────────────────
// Each reel category has a curated pool of ingredients. The slot machine
// randomly selects from items the user hasn't toggled off in their pantry.

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
}

export interface ReelCategory {
  id: string;
  label: string;
  color: string; // HSL accent color for the reel
  icon: string;  // Lucide icon name
  items: Ingredient[];
}

export const REEL_CATEGORIES: ReelCategory[] = [
  {
    id: "protein",
    label: "Base / Protein",
    color: "hsl(15, 85%, 60%)",
    icon: "drumstick",
    items: [
      { id: "chicken", name: "Chicken", emoji: "🍗" },
      { id: "tofu", name: "Tofu", emoji: "🧊" },
      { id: "pasta", name: "Pasta", emoji: "🍝" },
      { id: "rice", name: "Rice", emoji: "🍚" },
      { id: "shrimp", name: "Shrimp", emoji: "🦐" },
      { id: "chickpeas", name: "Chickpeas", emoji: "🫘" },
      { id: "ground-beef", name: "Ground Beef", emoji: "🥩" },
      { id: "eggs", name: "Eggs", emoji: "🥚" },
      { id: "salmon", name: "Salmon", emoji: "🐟" },
      { id: "lentils", name: "Lentils", emoji: "🫘" },
      { id: "sausage", name: "Sausage", emoji: "🌭" },
      { id: "tempeh", name: "Tempeh", emoji: "🫛" },
      { id: "noodles", name: "Noodles", emoji: "🍜" },
      { id: "bread", name: "Bread", emoji: "🍞" },
      { id: "black-beans", name: "Black Beans", emoji: "🫘" },
    ],
  },
  {
    id: "produce",
    label: "Produce / Veggie",
    color: "hsl(140, 70%, 45%)",
    icon: "leaf",
    items: [
      { id: "spinach", name: "Spinach", emoji: "🥬" },
      { id: "bell-peppers", name: "Bell Peppers", emoji: "🫑" },
      { id: "tomatoes", name: "Tomatoes", emoji: "🍅" },
      { id: "broccoli", name: "Broccoli", emoji: "🥦" },
      { id: "mushrooms", name: "Mushrooms", emoji: "🍄" },
      { id: "onions", name: "Onions", emoji: "🧅" },
      { id: "zucchini", name: "Zucchini", emoji: "🥒" },
      { id: "carrots", name: "Carrots", emoji: "🥕" },
      { id: "sweet-potato", name: "Sweet Potato", emoji: "🍠" },
      { id: "corn", name: "Corn", emoji: "🌽" },
      { id: "cabbage", name: "Cabbage", emoji: "🥬" },
      { id: "avocado", name: "Avocado", emoji: "🥑" },
      { id: "green-beans", name: "Green Beans", emoji: "🫛" },
      { id: "cauliflower", name: "Cauliflower", emoji: "🥦" },
      { id: "garlic", name: "Garlic", emoji: "🧄" },
    ],
  },
  {
    id: "flavor",
    label: "Flavor / Sauce",
    color: "hsl(35, 90%, 55%)",
    icon: "flame",
    items: [
      { id: "soy-sauce", name: "Soy Sauce", emoji: "🥢" },
      { id: "curry-paste", name: "Curry Paste", emoji: "🍛" },
      { id: "tomato-sauce", name: "Tomato Sauce", emoji: "🍅" },
      { id: "pesto", name: "Pesto", emoji: "🌿" },
      { id: "lemon-herb", name: "Lemon & Herb", emoji: "🍋" },
      { id: "garlic-butter", name: "Garlic Butter", emoji: "🧈" },
      { id: "teriyaki", name: "Teriyaki", emoji: "🥡" },
      { id: "chili-lime", name: "Chili Lime", emoji: "🌶️" },
      { id: "bbq-sauce", name: "BBQ Sauce", emoji: "🔥" },
      { id: "coconut-milk", name: "Coconut Milk", emoji: "🥥" },
      { id: "salsa", name: "Salsa", emoji: "💃" },
      { id: "miso", name: "Miso", emoji: "🍲" },
      { id: "honey-mustard", name: "Honey Mustard", emoji: "🍯" },
      { id: "sriracha", name: "Sriracha", emoji: "🌶️" },
      { id: "olive-oil-herbs", name: "Olive Oil & Herbs", emoji: "🫒" },
    ],
  },
  {
    id: "style",
    label: "Cooking Style",
    color: "hsl(260, 70%, 60%)",
    icon: "chef-hat",
    items: [
      { id: "pan-sear", name: "Pan-Sear", emoji: "🍳" },
      { id: "sheet-pan", name: "Sheet-Pan Roast", emoji: "🫕" },
      { id: "stir-fry", name: "Stir-Fry", emoji: "🥘" },
      { id: "one-pot", name: "One-Pot", emoji: "🍲" },
      { id: "bowl", name: "Bowl", emoji: "🥗" },
      { id: "wrap", name: "Wrap / Roll", emoji: "🌯" },
      { id: "soup", name: "Soup", emoji: "🥣" },
      { id: "salad", name: "Tossed Salad", emoji: "🥗" },
      { id: "skillet", name: "Skillet Bake", emoji: "🍳" },
      { id: "grill", name: "Grill / Char", emoji: "🔥" },
      { id: "steam", name: "Steam", emoji: "♨️" },
      { id: "no-cook", name: "No-Cook", emoji: "❄️" },
    ],
  },
];

// Utility to get a flat list of all ingredient IDs
export function getAllIngredientIds(): string[] {
  return REEL_CATEGORIES.flatMap((cat) => cat.items.map((item) => item.id));
}

// Default: everything is available
export function getDefaultPantry(): Record<string, boolean> {
  const pantry: Record<string, boolean> = {};
  for (const cat of REEL_CATEGORIES) {
    for (const item of cat.items) {
      pantry[item.id] = true;
    }
  }
  return pantry;
}
