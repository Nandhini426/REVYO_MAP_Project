// ============================================================
//  MOCK DATA — Single source of truth for the entire app
// ============================================================

export const PRODUCTS = [
  { id: 1, name: 'Organic Tomatoes', qty: 120, unit: 'kg', price: 40, condition: 'fresh', vendor: 'GreenFarm', category: 'Vegetables', image: '🍅', expiry: '2026-04-20', addedAt: Date.now() - 86400000 * 2 },
  { id: 2, name: 'Ripe Bananas', qty: 80, unit: 'kg', price: 25, condition: 'semi', vendor: 'FruitHub', category: 'Fruits', image: '🍌', expiry: '2026-04-12', discount: 35, addedAt: Date.now() - 86400000 * 3 },
  { id: 3, name: 'Wilted Spinach', qty: 20, unit: 'kg', price: 0, condition: 'spoiled', vendor: 'VeggieWorld', category: 'Leafy Greens', image: '🥬', expiry: '2026-04-08', addedAt: Date.now() - 86400000 * 5 },
  { id: 4, name: 'Fresh Carrots', qty: 60, unit: 'kg', price: 35, condition: 'fresh', vendor: 'GreenFarm', category: 'Vegetables', image: '🥕', expiry: '2026-04-25', addedAt: Date.now() - 86400000 * 1 },
  { id: 5, name: 'Overripe Mangoes', qty: 45, unit: 'kg', price: 20, condition: 'semi', vendor: 'FruitHub', category: 'Fruits', image: '🥭', expiry: '2026-04-11', discount: 50, addedAt: Date.now() - 86400000 * 4 },
  { id: 6, name: 'Bruised Apples', qty: 30, unit: 'kg', price: 0, condition: 'spoiled', vendor: 'FruitHub', category: 'Fruits', image: '🍎', expiry: '2026-04-07', addedAt: Date.now() - 86400000 * 6 },
  { id: 7, name: 'Capsicum Mix', qty: 35, unit: 'kg', price: 55, condition: 'fresh', vendor: 'VeggieWorld', category: 'Vegetables', image: '🫑', expiry: '2026-04-22', addedAt: Date.now() - 86400000 * 1 },
  { id: 8, name: 'Spotted Pears', qty: 25, unit: 'kg', price: 15, condition: 'semi', vendor: 'GreenFarm', category: 'Fruits', image: '🍐', expiry: '2026-04-13', discount: 40, addedAt: Date.now() - 86400000 * 3 },
  { id: 9, name: 'Brown Lettuce', qty: 15, unit: 'kg', price: 0, condition: 'spoiled', vendor: 'VeggieWorld', category: 'Leafy Greens', image: '🥗', expiry: '2026-04-06', addedAt: Date.now() - 86400000 * 7 },
  { id: 10, name: 'Dragon Fruit', qty: 18, unit: 'kg', price: 120, condition: 'fresh', vendor: 'FruitHub', category: 'Exotic', image: '🐉', expiry: '2026-04-28', addedAt: Date.now() - 86400000 * 0.5 },
]

export const USERS_LIST = [
  { id: 1, name: 'Ravi Kumar', role: 'Vendor', status: 'Active', joined: '2026-01-15', email: 'ravi@greenfarm.in' },
  { id: 2, name: 'Priya Singh', role: 'Customer', status: 'Active', joined: '2026-02-20', email: 'priya@mail.com' },
  { id: 3, name: 'GreenHope NGO', role: 'NGO', status: 'Active', joined: '2026-03-01', email: 'info@greenhope.org' },
  { id: 4, name: 'Amit Patel', role: 'Vendor', status: 'Suspended', joined: '2026-01-28', email: 'amit@fruithub.in' },
  { id: 5, name: 'Deepa Nair', role: 'Customer', status: 'Active', joined: '2026-03-15', email: 'deepa@mail.com' },
  { id: 6, name: 'FoodForAll Trust', role: 'NGO', status: 'Active', joined: '2026-02-10', email: 'help@foodforall.org' },
  { id: 7, name: 'Vikram Joshi', role: 'Vendor', status: 'Active', joined: '2026-03-20', email: 'vikram@veggieworld.in' },
]

export const PICKUPS = [
  { id: 1, vendor: 'GreenFarm', items: 'Tomatoes, Carrots', qty: '25 kg', date: '2026-04-10', status: 'Scheduled', ngo: 'GreenHope NGO' },
  { id: 2, vendor: 'FruitHub', items: 'Bananas, Apples', qty: '40 kg', date: '2026-04-09', status: 'Completed', ngo: 'FoodForAll Trust' },
  { id: 3, vendor: 'VeggieWorld', items: 'Spinach, Cabbage', qty: '15 kg', date: '2026-04-11', status: 'Pending', ngo: 'GreenHope NGO' },
]

export const MONTHLY_STATS = [
  { month: 'Jan', waste: 120, rescued: 80, donated: 45, co2Saved: 0.28 },
  { month: 'Feb', waste: 105, rescued: 90, donated: 60, co2Saved: 0.35 },
  { month: 'Mar', waste: 95, rescued: 110, donated: 75, co2Saved: 0.42 },
  { month: 'Apr', waste: 80, rescued: 130, donated: 90, co2Saved: 0.52 },
  { month: 'May', waste: 70, rescued: 145, donated: 105, co2Saved: 0.58 },
  { month: 'Jun', waste: 55, rescued: 160, donated: 120, co2Saved: 0.65 },
]

export const IMPACT_METRICS = {
  totalFoodSaved: 715,           // kg
  co2Reduced: 2.8,               // tonnes
  mealsProvided: 2860,           // meals
  wastePrevented: 68,            // percentage
  vendorsOnboarded: 42,
  ngosPartnered: 16,
  activeDonations: 23,
  customersServed: 98,
}

export const CATEGORY_DISTRIBUTION = [
  { name: 'Vegetables', value: 35, fill: '#10b981' },
  { name: 'Fruits', value: 30, fill: '#f59e0b' },
  { name: 'Leafy Greens', value: 15, fill: '#06b6d4' },
  { name: 'Exotic', value: 10, fill: '#8b5cf6' },
  { name: 'Others', value: 10, fill: '#6b7280' },
]

export const CONDITION_DISTRIBUTION = [
  { name: 'Fresh', value: 55, fill: '#10b981' },
  { name: 'Semi-Fresh', value: 30, fill: '#f59e0b' },
  { name: 'Spoiled', value: 15, fill: '#ef4444' },
]
