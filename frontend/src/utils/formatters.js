export function formatCurrency(amount, options = {}) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: options.compact ? 'compact' : 'standard',
    maximumSignificantDigits: options.compact ? 3 : undefined,
    maximumFractionDigits: options.cents ? 2 : 0,
    minimumFractionDigits: options.cents ? 2 : 0,
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}
