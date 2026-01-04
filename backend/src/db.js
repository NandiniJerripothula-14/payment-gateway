const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS merchants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        api_key VARCHAR(64) NOT NULL UNIQUE,
        api_secret VARCHAR(64) NOT NULL,
        webhook_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        merchant_id UUID NOT NULL REFERENCES merchants(id),
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        receipt VARCHAR(255),
        notes JSONB,
        status VARCHAR(20) DEFAULT 'created',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(64) PRIMARY KEY,
        order_id VARCHAR(64) NOT NULL REFERENCES orders(id),
        merchant_id UUID NOT NULL REFERENCES merchants(id),
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'INR',
        method VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'processing',
        vpa VARCHAR(255),
        card_network VARCHAR(20),
        card_last4 VARCHAR(4),
        error_code VARCHAR(50),
        error_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_merchant_id ON orders(merchant_id);
      CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
      CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
    `);

    console.log('Database schema initialized');

    // Seed test merchant if it doesn't exist
    const testMerchantId = '550e8400-e29b-41d4-a716-446655440000';
    const testEmail = process.env.TEST_MERCHANT_EMAIL || 'test@example.com';
    const testApiKey = process.env.TEST_API_KEY || 'key_test_abc123';
    const testApiSecret = process.env.TEST_API_SECRET || 'secret_test_xyz789';

    const result = await client.query(
      'SELECT id FROM merchants WHERE email = $1',
      [testEmail]
    );

    if (result.rows.length === 0) {
      await client.query(
        `INSERT INTO merchants (id, name, email, api_key, api_secret, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [testMerchantId, 'Test Merchant', testEmail, testApiKey, testApiSecret, true]
      );
      console.log('Test merchant seeded successfully');
    } else {
      console.log('Test merchant already exists');
    }
  } finally {
    client.release();
  }
}

module.exports = { pool, initializeDatabase };
