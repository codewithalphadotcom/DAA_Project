/**
 * Formatting utilities for displaying numbers and results
 */

/**
 * Format a number with specified decimal places
 */
export function formatNumber(num: number, decimals: number = 4): string {
  return num.toFixed(decimals);
}

/**
 * Format a large number string with thousands separators
 */
export function formatWithCommas(num: string): string {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncate a string to max length with ellipsis
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Format step description for display
 */
export function formatStepDescription(description: string): string {
  return `// ${description}`;
}
