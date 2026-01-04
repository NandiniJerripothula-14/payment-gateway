const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authenticateApiKey } = require('../middleware/auth');
const orderService = require('../services/orderService');
const paymentService = require('../services/paymentService');

// Health check endpoint (no auth required)
router.get('/health', async (req, res) => {
  try {
    // Check database connectivity
    const result = await pool.query('SELECT NOW()');
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.json({
      status: 'healthy',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

// Test merchant endpoint (no auth required)
router.get('/api/v1/test/merchant', async (req, res) => {
  try {
    const testEmail = process.env.TEST_MERCHANT_EMAIL || 'test@example.com';
    const result = await pool.query(
      'SELECT id, name, email, api_key FROM merchants WHERE email = $1',
      [testEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND_ERROR',
          description: 'Test merchant not found',
        },
      });
    }

    const merchant = result.rows[0];
    res.json({
      id: merchant.id,
      email: merchant.email,
      api_key: merchant.api_key,
      seeded: true,
    });
  } catch (error) {
    console.error('Test merchant error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      },
    });
  }
});

// Create Order (requires auth)
router.post('/api/v1/orders', authenticateApiKey, async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body;
    const order = await orderService.createOrder(req.merchant.id, {
      amount,
      currency,
      receipt,
      notes,
    });

    res.status(201).json(order);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          description: error.description,
        },
      });
    }
    console.error('Create order error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      },
    });
  }
});

// Get Order (requires auth)
router.get('/api/v1/orders/:order_id', authenticateApiKey, async (req, res) => {
  try {
    const order = await orderService.getOrder(req.params.order_id, req.merchant.id);
    res.json(order);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          description: error.description,
        },
      });
    }
    console.error('Get order error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      },
    });
  }
});

// Get Order (Public endpoint - no auth)
router.get('/api/v1/orders/:order_id/public', async (req, res) => {
  try {
    const order = await orderService.getOrderPublic(req.params.order_id);
    res.json(order);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          description: error.description,
        },
      });
    }
    console.error('Get order error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      },
    });
  }
});

// Create Payment (requires auth)
router.post('/api/v1/payments', authenticateApiKey, async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.merchant.id, req.body);
    res.status(201).json(payment);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          description: error.description,
        },
      });
    }
    console.error('Create payment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      },
    });
  }
});

// Create Payment (Public endpoint - no auth)
router.post('/api/v1/payments/public', async (req, res) => {
  try {
    // Validate that order exists
    const { pool } = require('../db');
    const orderResult = await pool.query(
      'SELECT merchant_id FROM orders WHERE id = $1',
      [req.body.order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND_ERROR',
          description: 'Order not found',
        },
      });
    }

    const merchantId = orderResult.rows[0].merchant_id;
    const payment = await paymentService.createPayment(merchantId, req.body);
    res.status(201).json(payment);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          description: error.description,
        },
      });
    }
    console.error('Create payment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      },
    });
  }
});

// Get Payment (requires auth)
router.get('/api/v1/payments/:payment_id', authenticateApiKey, async (req, res) => {
  try {
    const payment = await paymentService.getPayment(req.params.payment_id, req.merchant.id);
    res.json(payment);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          description: error.description,
        },
      });
    }
    console.error('Get payment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      },
    });
  }
});

// Get Payment (Public endpoint - no auth)
router.get('/api/v1/payments/:payment_id/public', async (req, res) => {
  try {
    const payment = await paymentService.getPaymentPublic(req.params.payment_id);
    res.json(payment);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({
        error: {
          code: error.code,
          description: error.description,
        },
      });
    }
    console.error('Get payment error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        description: 'Internal server error',
      },
    });
  }
});

module.exports = router;
