/**
 * String-based arithmetic utilities for large integer operations
 * Supports addition, subtraction, and power-of-10 multiplication
 */

/**
 * Add two numbers represented as strings
 */
export function addStrings(num1: string, num2: string): string {
  let result = '';
  let carry = 0;
  let i = num1.length - 1;
  let j = num2.length - 1;

  while (i >= 0 || j >= 0 || carry > 0) {
    const digit1 = i >= 0 ? parseInt(num1[i]) : 0;
    const digit2 = j >= 0 ? parseInt(num2[j]) : 0;
    const sum = digit1 + digit2 + carry;
    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);
    i--;
    j--;
  }

  return result;
}

/**
 * Subtract num2 from num1 (assumes num1 >= num2)
 */
export function subtractStrings(num1: string, num2: string): string {
  let result = '';
  let borrow = 0;
  let i = num1.length - 1;

  // Pad num2 with zeros if needed
  const paddedNum2 = num2.padStart(num1.length, '0');

  while (i >= 0) {
    let digit1 = parseInt(num1[i]) - borrow;
    const digit2 = parseInt(paddedNum2[i]);

    if (digit1 < digit2) {
      digit1 += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }

    result = (digit1 - digit2) + result;
    i--;
  }

  // Remove leading zeros
  result = result.replace(/^0+/, '') || '0';
  return result;
}

/**
 * Multiply a number string by 10^power (append zeros)
 */
export function multiplyByPowerOf10(num: string, power: number): string {
  if (num === '0') return '0';
  return num + '0'.repeat(power);
}

/**
 * Clean and normalize a number string (remove non-digits and leading zeros)
 */
export function normalizeNumberString(num: string): string {
  return num.replace(/[^0-9]/g, '').replace(/^0+/, '') || '0';
}
