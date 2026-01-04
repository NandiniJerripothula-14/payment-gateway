const { pool } = require('../db');
const { generatePaymentId } = require('../utils/idGenerator');
const { validateVPA, luhnCheck, detectCardNetwork, validateExpiry } = require('../validators/paymentValidator');

class PaymentService {
  async createPayment(merchantId, { order_id, method, vpa, card }) {
    // Verify order exists and belongs to merchant
    const orderResult = await pool.query(
      'SELECT id, amount, currency, merchant_id FROM orders WHERE id = $1',
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      throw {
        status: 404,
        code: 'NOT_FOUND_ERROR',
        description: 'Order not found',
      };
    }

    const order = orderResult.rows[0];

    if (order.merchant_id !== merchantId) {
      throw {
        status: 400,
        code: 'BAD_REQUEST_ERROR',
        description: 'Order does not belong to this merchant',
      };
    }

    const paymentId = generatePaymentId();
    let cardNetwork = null;
    let cardLast4 = null;
    let vpaValue = null;
    let errorCode = null;
    let errorDescription = null;

    // Validate based on payment method
    if (method === 'upi') {
      if (!vpa || !validateVPA(vpa)) {
        throw {
          status: 400,
          code: 'INVALID_VPA',
          description: 'Invalid VPA format. Expected format: username@bank',
        };
      }
      vpaValue = vpa;
    } else if (method === 'card') {
      if (!card || !card.number || !card.expiry_month || !card.expiry_year || !card.cvv || !card.holder_name) {
        throw {
          status: 400,
          code: 'BAD_REQUEST_ERROR',
          description: 'Missing required card fields',
        };
      }

      // Validate card number
      if (!luhnCheck(card.number)) {
        throw {
          status: 400,
          code: 'INVALID_CARD',
          description: 'Invalid card number',
        };
      }

      // Validate expiry
      if (!validateExpiry(card.expiry_month, card.expiry_year)) {
        throw {
          status: 400,
          code: 'EXPIRED_CARD',
          description: 'Card has expired',
        };
      }

      // Detect network and store last 4 digits
      cardNetwork = detectCardNetwork(card.number);
      cardLast4 = card.number.slice(-4);
    } else {
      throw {
        status: 400,
        code: 'BAD_REQUEST_ERROR',
        description: 'Invalid payment method. Must be upi or card',
      };
    }

    // Create payment record with processing status
    try {
      const insertResult = await pool.query(
        `INSERT INTO payments (id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4, error_code, error_description, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
         RETURNING id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4, error_code, error_description, created_at, updated_at`,
        [paymentId, order_id, merchantId, order.amount, order.currency, method, 'processing', vpaValue, cardNetwork, cardLast4, errorCode, errorDescription]
      );

      const payment = insertResult.rows[0];

      // Return response with processing status
      const response = {
        id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: payment.status,
        created_at: payment.created_at.toISOString(),
      };

      if (method === 'upi') {
        response.vpa = payment.vpa;
      } else if (method === 'card') {
        response.card_network = payment.card_network;
        response.card_last4 = payment.card_last4;
      }

      // Process payment asynchronously
      this.processPayment(paymentId, method);

      return response;
    } catch (error) {
      if (error.status) throw error;
      console.error('Payment creation error:', error);
      throw {
        status: 500,
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      };
    }
  }

  async processPayment(paymentId, method) {
    try {
      // Determine delay
      let delay;
      if (process.env.TEST_MODE === 'true') {
        delay = parseInt(process.env.TEST_PROCESSING_DELAY || '1000', 10);
      } else {
        const minDelay = parseInt(process.env.PROCESSING_DELAY_MIN || '5000', 10);
        const maxDelay = parseInt(process.env.PROCESSING_DELAY_MAX || '10000', 10);
        delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      }

      // Wait for processing delay
      await new Promise(resolve => setTimeout(resolve, delay));

      // Determine success/failure
      let isSuccess;
      if (process.env.TEST_MODE === 'true') {
        isSuccess = process.env.TEST_PAYMENT_SUCCESS !== 'false';
      } else {
        const successRate = method === 'upi'
          ? parseFloat(process.env.UPI_SUCCESS_RATE || '0.90')
          : parseFloat(process.env.CARD_SUCCESS_RATE || '0.95');
        isSuccess = Math.random() < successRate;
      }

      let newStatus = 'success';
      let errorCode = null;
      let errorDescription = null;

      if (!isSuccess) {
        newStatus = 'failed';
        errorCode = 'PAYMENT_FAILED';
        errorDescription = 'Payment processing failed. Please try again.';
      }

      // Update payment status
      await pool.query(
        `UPDATE payments SET status = $1, error_code = $2, error_description = $3, updated_at = NOW() WHERE id = $4`,
        [newStatus, errorCode, errorDescription, paymentId]
      );

      console.log(`Payment ${paymentId} processed: ${newStatus}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      // Update payment as failed
      await pool.query(
        `UPDATE payments SET status = $1, error_code = $2, error_description = $3, updated_at = NOW() WHERE id = $4`,
        ['failed', 'PAYMENT_FAILED', 'Payment processing error', paymentId]
      );
    }
  }

  async getPayment(paymentId, merchantId) {
    try {
      const result = await pool.query(
        `SELECT id, order_id, merchant_id, amount, currency, method, status, vpa, card_network, card_last4, error_code, error_description, created_at, updated_at
         FROM payments WHERE id = $1 AND merchant_id = $2`,
        [paymentId, merchantId]
      );

      if (result.rows.length === 0) {
        throw {
          status: 404,
          code: 'NOT_FOUND_ERROR',
          description: 'Payment not found',
        };
      }

      const payment = result.rows[0];
      return this.formatPaymentResponse(payment);
    } catch (error) {
      if (error.status) throw error;
      console.error('Get payment error:', error);
      throw {
        status: 500,
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      };
    }
  }

  async getPaymentPublic(paymentId) {
    try {
      const result = await pool.query(
        `SELECT id, order_id, amount, currency, method, status, vpa, card_network, card_last4, error_code, error_description, created_at, updated_at
         FROM payments WHERE id = $1`,
        [paymentId]
      );

      if (result.rows.length === 0) {
        throw {
          status: 404,
          code: 'NOT_FOUND_ERROR',
          description: 'Payment not found',
        };
      }

      const payment = result.rows[0];
      return this.formatPaymentResponse(payment);
    } catch (error) {
      if (error.status) throw error;
      console.error('Get payment error:', error);
      throw {
        status: 500,
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      };
    }
  }

  formatPaymentResponse(payment) {
    const response = {
      id: payment.id,
      order_id: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      created_at: payment.created_at.toISOString(),
      updated_at: payment.updated_at.toISOString(),
    };

    if (payment.method === 'upi' && payment.vpa) {
      response.vpa = payment.vpa;
    }

    if (payment.method === 'card' && payment.card_network) {
      response.card_network = payment.card_network;
      response.card_last4 = payment.card_last4;
    }

    if (payment.error_code) {
      response.error_code = payment.error_code;
      response.error_description = payment.error_description;
    }

    return response;
  }
}

module.exports = new PaymentService();
