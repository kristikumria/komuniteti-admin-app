/**
 * Format currency values to a standardized format
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a locale-specific format
 * @param dateString - The date string to format
 * @param format - The format to use (default: 'medium')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  format: 'short' | 'medium' | 'long' = 'medium'
): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format a date and time string to a locale-specific format
 * @param dateTimeString - The date and time string to format
 * @param includeTime - Whether to include the time (default: true)
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  dateTimeString: string,
  includeTime = true
): string => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };
  
  return date.toLocaleDateString('en-US', options);
}; 