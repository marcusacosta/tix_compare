/**
 * Money utility functions for safe handling of currency conversions
 */

/**
 * Convert dollars to cents (multiply by 100)
 * @param {number} dollars - Amount in dollars
 * @returns {number} Amount in cents
 */
const dollarsToCents = (dollars) => {
    if (typeof dollars !== 'number' || isNaN(dollars)) {
        throw new Error('Invalid dollar amount');
    }
    return Math.round(dollars * 100);
};

/**
 * Convert cents to dollars (divide by 100)
 * @param {number} cents - Amount in cents
 * @returns {number} Amount in dollars
 */
const centsToDollars = (cents) => {
    if (typeof cents !== 'number' || isNaN(cents)) {
        throw new Error('Invalid cent amount');
    }
    return Math.round(cents) / 100;
};

/**
 * Safe rounding to 2 decimal places for currency
 * @param {number} amount - Amount to round
 * @returns {number} Rounded amount
 */
const safeRound = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        throw new Error('Invalid amount for rounding');
    }
    return Math.round(amount * 100) / 100;
};

/**
 * Format currency for display
 * @param {number} cents - Amount in cents
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
const formatCurrency = (cents, currency = 'USD') => {
    if (typeof cents !== 'number' || isNaN(cents)) {
        throw new Error('Invalid cent amount for formatting');
    }
    
    const dollars = centsToDollars(cents);
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(dollars);
};

/**
 * Calculate percentage change between two values
 * @param {number} oldValue - Previous value
 * @param {number} newValue - Current value
 * @returns {number} Percentage change (positive for increase, negative for decrease)
 */
const calculatePercentageChange = (oldValue, newValue) => {
    if (typeof oldValue !== 'number' || typeof newValue !== 'number' || 
        isNaN(oldValue) || isNaN(newValue)) {
        throw new Error('Invalid values for percentage calculation');
    }
    
    if (oldValue === 0) {
        return newValue > 0 ? 100 : 0;
    }
    
    return safeRound(((newValue - oldValue) / oldValue) * 100);
};

module.exports = {
    dollarsToCents,
    centsToDollars,
    safeRound,
    formatCurrency,
    calculatePercentageChange
};
