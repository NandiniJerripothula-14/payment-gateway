// VPA Validation: ^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$
function validateVPA(vpa) {
  const vpaRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return vpaRegex.test(vpa);
}

// Luhn Algorithm for card validation
function luhnCheck(cardNumber) {
  const cleaned = cardNumber.replace(/\s+|-/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Card Network Detection
function detectCardNetwork(cardNumber) {
  const cleaned = cardNumber.replace(/\s+|-/g, '');
  
  if (/^4/.test(cleaned)) {
    return 'visa';
  } else if (/^(51|52|53|54|55)/.test(cleaned)) {
    return 'mastercard';
  } else if (/^(34|37)/.test(cleaned)) {
    return 'amex';
  } else if (/^(60|65|8[1-9])/.test(cleaned)) {
    return 'rupay';
  }
  
  return 'unknown';
}

// Expiry Validation
function validateExpiry(month, year) {
  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  let expiryYear = parseInt(year, 10);
  
  // Handle 2-digit year
  if (year.length === 2) {
    expiryYear = 2000 + expiryYear;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Check if expiry is in the future or current month
  if (expiryYear > currentYear) {
    return true;
  } else if (expiryYear === currentYear && monthNum >= currentMonth) {
    return true;
  }

  return false;
}

module.exports = {
  validateVPA,
  luhnCheck,
  detectCardNetwork,
  validateExpiry,
};
