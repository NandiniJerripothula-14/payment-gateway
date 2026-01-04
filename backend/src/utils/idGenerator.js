const crypto = require('crypto');

function generateAlphanumeric(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateOrderId() {
  return 'order_' + generateAlphanumeric(16);
}

function generatePaymentId() {
  return 'pay_' + generateAlphanumeric(16);
}

module.exports = {
  generateOrderId,
  generatePaymentId,
  generateAlphanumeric,
};
