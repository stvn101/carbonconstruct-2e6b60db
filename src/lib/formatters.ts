
/**
 * Utility functions for formatting data for display
 */

/**
 * Format a date in a human-readable format
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a number as a percentage
 * @param value Value to format as percentage
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with commas as thousands separators
 * @param value Value to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format a carbon value with units
 * @param value Carbon value in kg CO2e
 * @returns Formatted carbon string
 */
export function formatCarbon(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} tonnes CO₂e`;
  }
  return `${value.toFixed(2)} kg CO₂e`;
}

/**
 * Format a currency value
 * @param value Value to format
 * @param currency Currency code (default: 'USD')
 * @param decimals Number of decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD', decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}
