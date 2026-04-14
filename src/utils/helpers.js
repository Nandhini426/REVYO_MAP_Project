// ============================================================
//  Utility / helper functions
// ============================================================

/**
 * Returns a human-readable label + CSS class for a product condition.
 */
export function conditionMeta(condition) {
  switch (condition) {
    case 'fresh':
      return { label: 'Fresh', cssClass: 'condition-fresh', color: '#10b981' }
    case 'semi':
      return { label: 'Semi-Fresh', cssClass: 'condition-semi', color: '#f59e0b' }
    case 'spoiled':
      return { label: 'Spoiled', cssClass: 'condition-spoiled', color: '#ef4444' }
    default:
      return { label: condition, cssClass: '', color: '#6b7280' }
  }
}

/**
 * Approximate CO₂ savings multiplier – 
 * 1 kg food saved ≈ 2.5 kg CO₂ equivalent.
 */
export const CO2_PER_KG = 2.5

/**
 * Format a number with commas.
 */
export function formatNumber(n) {
  return new Intl.NumberFormat('en-IN').format(n)
}

/**
 * Check if a product is nearing expiry (within 3 days).
 */
export function isNearingExpiry(expiryStr) {
  const expiry = new Date(expiryStr)
  const now = new Date()
  const diff = (expiry - now) / (1000 * 60 * 60 * 24)
  return diff >= 0 && diff <= 3
}

/**
 * Check if a product is expired.
 */
export function isExpired(expiryStr) {
  return new Date(expiryStr) < new Date()
}

/**
 * Get the role-accent colour
 */
export function roleAccent(role) {
  const map = {
    admin: '#8b5cf6',
    vendor: '#10b981',
    customer: '#06b6d4',
    ngo: '#f59e0b',
  }
  return map[role] || '#6b7280'
}
