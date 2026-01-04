const { pool } = require('../db');
const { generateOrderId } = require('../utils/idGenerator');

class OrderService {
  async createOrder(merchantId, { amount, currency, receipt, notes }) {
    if (!amount || amount < 100) {
      throw {
        status: 400,
        code: 'BAD_REQUEST_ERROR',
        description: 'amount must be at least 100',
      };
    }

    const orderId = generateOrderId();
    const finalCurrency = currency || 'INR';

    try {
      const result = await pool.query(
        `INSERT INTO orders (id, merchant_id, amount, currency, receipt, notes, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING id, merchant_id, amount, currency, receipt, notes, status, created_at, updated_at`,
        [orderId, merchantId, amount, finalCurrency, receipt || null, notes ? JSON.stringify(notes) : null, 'created']
      );

      const order = result.rows[0];
      return {
        id: order.id,
        merchant_id: order.merchant_id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes ? JSON.parse(order.notes) : {},
        status: order.status,
        created_at: order.created_at.toISOString(),
        updated_at: order.updated_at.toISOString(),
      };
    } catch (error) {
      console.error('Order creation error:', error);
      throw {
        status: 500,
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      };
    }
  }

  async getOrder(orderId, merchantId) {
    try {
      const result = await pool.query(
        'SELECT id, merchant_id, amount, currency, receipt, notes, status, created_at, updated_at FROM orders WHERE id = $1 AND merchant_id = $2',
        [orderId, merchantId]
      );

      if (result.rows.length === 0) {
        throw {
          status: 404,
          code: 'NOT_FOUND_ERROR',
          description: 'Order not found',
        };
      }

      const order = result.rows[0];
      return {
        id: order.id,
        merchant_id: order.merchant_id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes ? JSON.parse(order.notes) : {},
        status: order.status,
        created_at: order.created_at.toISOString(),
        updated_at: order.updated_at.toISOString(),
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Get order error:', error);
      throw {
        status: 500,
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      };
    }
  }

  async getOrderPublic(orderId) {
    try {
      const result = await pool.query(
        'SELECT id, merchant_id, amount, currency, status FROM orders WHERE id = $1',
        [orderId]
      );

      if (result.rows.length === 0) {
        throw {
          status: 404,
          code: 'NOT_FOUND_ERROR',
          description: 'Order not found',
        };
      }

      const order = result.rows[0];
      return {
        id: order.id,
        merchant_id: order.merchant_id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      };
    } catch (error) {
      if (error.status) throw error;
      console.error('Get order error:', error);
      throw {
        status: 500,
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      };
    }
  }
}

module.exports = new OrderService();
