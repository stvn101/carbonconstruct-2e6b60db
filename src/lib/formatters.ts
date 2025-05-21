
/**
 * Formatting utilities for consistent display across the application
 */

/**
 * Format a date for display
 * @param date The date to format
 * @param includeTime Whether to include time in the formatted date
 * @returns The formatted date string
 */
export function formatDate(date: Date | null | undefined, includeTime = false): string {
  if (!date) return 'N/A';
  
  try {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('en-AU', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a number as currency
 * @param value The value to format
 * @param currency The currency code
 * @returns The formatted currency string
 */
export function formatCurrency(value: number | null | undefined, currency = 'AUD'): string {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${value} ${currency}`;
  }
}

/**
 * Format a carbon footprint value
 * @param value The carbon footprint in kg CO2e
 * @returns The formatted carbon footprint
 */
export function formatCarbon(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    // For values > 1000 kg, convert to tonnes
    if (value >= 1000) {
      const tonnes = value / 1000;
      return `${tonnes.toFixed(2)}t CO₂e`;
    }
    
    // For values > 1, round to 2 decimal places
    if (value >= 1) {
      return `${value.toFixed(2)}kg CO₂e`;
    }
    
    // For small values, use more decimal places
    return `${value.toFixed(4)}kg CO₂e`;
  } catch (error) {
    console.error('Error formatting carbon:', error);
    return `${value} kg CO₂e`;
  }
}

/**
 * Format a percentage value
 * @param value The percentage value (0-100)
 * @param decimalPlaces The number of decimal places to include
 * @returns The formatted percentage string
 */
export function formatPercentage(value: number | null | undefined, decimalPlaces = 1): string {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    return `${value.toFixed(decimalPlaces)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}%`;
  }
}

/**
 * Format a distance value
 * @param value The distance in kilometers
 * @returns The formatted distance string
 */
export function formatDistance(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    // For values > 1000 km, format with comma separators
    if (value >= 1000) {
      return `${value.toLocaleString('en-AU')} km`;
    }
    
    // For smaller values, use decimal places if needed
    if (Number.isInteger(value)) {
      return `${value} km`;
    } else {
      return `${value.toFixed(1)} km`;
    }
  } catch (error) {
    console.error('Error formatting distance:', error);
    return `${value} km`;
  }
}

/**
 * Format a weight value
 * @param value The weight in kilograms
 * @returns The formatted weight string
 */
export function formatWeight(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    // For values > 1000 kg, convert to tonnes
    if (value >= 1000) {
      const tonnes = value / 1000;
      return `${tonnes.toFixed(1)}t`;
    }
    
    // For smaller values, round to appropriate precision
    return `${value.toFixed(value < 1 ? 2 : 0)}kg`;
  } catch (error) {
    console.error('Error formatting weight:', error);
    return `${value} kg`;
  }
}

/**
 * Format an energy value
 * @param value The energy value
 * @param unit The energy unit
 * @returns The formatted energy string
 */
export function formatEnergy(value: number | null | undefined, unit = 'kWh'): string {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    // For large values, use comma separators
    if (value >= 1000) {
      return `${value.toLocaleString('en-AU')} ${unit}`;
    }
    
    // For smaller values, use decimal places if needed
    if (Number.isInteger(value)) {
      return `${value} ${unit}`;
    } else {
      return `${value.toFixed(2)} ${unit}`;
    }
  } catch (error) {
    console.error('Error formatting energy:', error);
    return `${value} ${unit}`;
  }
}

/**
 * Format a number with fixed decimal places
 * @param value The number to format
 * @param decimalPlaces The number of decimal places
 * @returns The formatted number string
 */
export function formatNumber(value: number | null | undefined, decimalPlaces = 2): string {
  if (value === null || value === undefined) return 'N/A';
  
  try {
    return value.toFixed(decimalPlaces);
  } catch (error) {
    console.error('Error formatting number:', error);
    return `${value}`;
  }
}
