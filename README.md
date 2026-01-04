# Partnr - Payment Gateway Project

![Partnr Logo](https://www.partnr.ai/static/media/logo.png)

**Submitted by:** Nandini Jerripothula  
**Task:** Build Payment Gateway with Multi-Method Processing and Hosted Checkout  
**Status:** Ready for Submission

---

# Payment Gateway - Complete Implementation

A fully functional payment gateway similar to Razorpay or Stripe, with multi-method payment processing (UPI and Cards), merchant authentication, and a hosted checkout page.

## Project Overview

This project implements a complete payment gateway with:
- **RESTful API** with merchant authentication via API keys
- **PostgreSQL Database** with proper schema for merchants, orders, and payments
- **Dashboard Frontend** for merchants to view credentials and transactions
- **Hosted Checkout Page** for customers to complete payments
- **Docker Compose** for easy deployment of all services

## Architecture

```
payment-gateway/
├── docker-compose.yml          # Orchestrate all services
├── .env.example                # Environment configuration template
├── README.md                   # This file
├── backend/                    # Express.js API
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js            # Main application entry
│       ├── db.js               # Database initialization & connection
│       ├── middleware/         # Authentication middleware
│       ├── routes/             # API endpoints
│       ├── services/           # Business logic
│       ├── validators/         # Payment validation logic
│       └── utils/              # Utility functions
├── frontend/                   # React Dashboard
│   ├── Dockerfile
│   ├── package.json
│   ├── nginx.conf
│   └── src/
│       ├── pages/              # Login, Dashboard, Transactions
│       ├── services/           # API service layer
│       └── styles/             # CSS styling
├── checkout-page/              # React Checkout Page
│   ├── Dockerfile
│   ├── package.json
│   ├── nginx.conf
│   └── src/
│       ├── pages/              # Checkout page component
│       ├── services/           # API service layer
│       └── styles/             # CSS styling
├── screenshots/                # Visual documentation
│   ├── 01-dashboard-login.png
│   ├── 02-dashboard-home.png
│   ├── 03-dashboard-credentials.png
│   ├── 04-dashboard-transactions.png
│   ├── 05-checkout-summary.png
│   ├── 06-checkout-upi.png
│   ├── 07-checkout-card.png
│   ├── 08-checkout-processing.png
│   ├── 09-checkout-success.png
│   └── 10-checkout-failure.png
└── videos/                     # Video demonstrations
    └── payment-gateway-demo.mp4 # Complete payment flow demo
```

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- No additional dependencies needed (all contained in Docker)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd payment-gateway
   ```

2. **Create environment file (optional)**
   ```bash
   cp .env.example .env
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database (port 5432)
   - API server (port 8000)
   - Dashboard frontend (port 3000)
   - Checkout page (port 3001)

4. **Verify services are running**
   ```bash
   curl http://localhost:8000/health
   ```

### Access the Application

- **Dashboard**: http://localhost:3000
  - Email: `test@example.com`
  - Password: Any password (not validated in Deliverable 1)

- **API**: http://localhost:8000

- **Checkout Page**: http://localhost:3001/checkout?order_id=order_xyz

## Video Demo

📹 **[Watch Complete Payment Gateway Demo (3 minutes)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)**

This video demonstrates:
- ✅ System startup with Docker
- ✅ Merchant dashboard and API credentials
- ✅ Creating payment orders via API
- ✅ UPI payment flow with VPA validation
- ✅ Card payment flow with Luhn algorithm validation
- ✅ Success and failure states
- ✅ Database transaction storage

*To add your video URL: Replace `YOUR_VIDEO_ID` with your YouTube video ID or upload to YouTube and update this link.*

## Visual Documentation

### Screenshots

Screenshots of the complete system are available in the [screenshots/](screenshots/) directory:

**Dashboard Pages:**

#### Login Page
![Dashboard Login](screenshots/01-dashboard-login.png)
[View Full Screenshot](screenshots/01-dashboard-login.png) - Merchant authentication form

#### Dashboard Home
![Dashboard Home](screenshots/02-dashboard-home.png)
[View Full Screenshot](screenshots/02-dashboard-home.png) - Dashboard overview

#### API Credentials
![API Credentials](screenshots/03-dashboard-credentials.png)
[View Full Screenshot](screenshots/03-dashboard-credentials.png) - API key and secret display

#### Transactions Page
![Transactions Page](screenshots/04-dashboard-transactions.png)
[View Full Screenshot](screenshots/04-dashboard-transactions.png) - Transaction history

**Checkout Pages:**

#### Order Summary
![Checkout Summary](screenshots/05-checkout-summary.png)
[View Full Screenshot](screenshots/05-checkout-summary.png) - Order details and amount

#### UPI Payment Form
![UPI Payment Form](screenshots/06-checkout-upi.png)
[View Full Screenshot](screenshots/06-checkout-upi.png) - UPI payment method

#### Card Payment Form
![Card Payment Form](screenshots/07-checkout-card.png)
[View Full Screenshot](screenshots/07-checkout-card.png) - Card payment method

#### Processing State
![Processing State](screenshots/08-checkout-processing.png)
[View Full Screenshot](screenshots/08-checkout-processing.png) - Payment being processed

#### Success State
![Success State](screenshots/09-checkout-success.png)
[View Full Screenshot](screenshots/09-checkout-success.png) - Payment successful

#### Failure State
![Failure State](screenshots/10-checkout-failure.png)
[View Full Screenshot](screenshots/10-checkout-failure.png) - Payment failed

### Video Demo

Complete video demonstration available in [videos/](videos/) directory or on YouTube.

## API Endpoints

### Health Check
```
GET /health
```
Returns system health status including database connectivity.

### Create Order
```
POST /api/v1/orders
Headers:
  X-Api-Key: key_test_abc123
  X-Api-Secret: secret_test_xyz789
Body:
{
  "amount": 50000,
  "currency": "INR",
  "receipt": "receipt_123",
  "notes": {}
}
```

### Get Order
```
GET /api/v1/orders/{order_id}
```

### Get Order (Public)
```
GET /api/v1/orders/{order_id}/public
```
No authentication required.

### Create Payment
```
POST /api/v1/payments
Headers:
  X-Api-Key: key_test_abc123
  X-Api-Secret: secret_test_xyz789

For UPI:
{
  "order_id": "order_xyz",
  "method": "upi",
  "vpa": "user@paytm"
}

For Card:
{
  "order_id": "order_xyz",
  "method": "card",
  "card": {
    "number": "4111111111111111",
    "expiry_month": "12",
    "expiry_year": "2025",
    "cvv": "123",
    "holder_name": "John Doe"
  }
}
```

### Get Payment
```
GET /api/v1/payments/{payment_id}
```

### Get Payment (Public)
```
GET /api/v1/payments/{payment_id}/public
```
No authentication required.

### Test Merchant
```
GET /api/v1/test/merchant
```
Returns the pre-seeded test merchant details.

## Test Merchant Credentials

The system automatically seeds a test merchant on startup:
- **Email**: test@example.com
- **API Key**: key_test_abc123
- **API Secret**: secret_test_xyz789
- **ID**: 550e8400-e29b-41d4-a716-446655440000

## Features Implemented

### Backend API
- ✅ Health check endpoint
- ✅ Merchant authentication using API key/secret
- ✅ Order creation and retrieval
- ✅ Payment creation with multi-method support
- ✅ VPA validation for UPI
- ✅ Luhn algorithm for card validation
- ✅ Card network detection (Visa, Mastercard, Amex, RuPay)
- ✅ Expiry date validation
- ✅ Automatic test merchant seeding
- ✅ Public endpoints for checkout flow
- ✅ Proper error handling with standardized error codes

### Payment Processing
- ✅ Synchronous payment processing
- ✅ 5-10 second simulated delay
- ✅ Configurable success rates (90% UPI, 95% Card)
- ✅ Test mode for deterministic testing
- ✅ Proper state transitions (processing → success/failed)
- ✅ Card data security (only last 4 digits stored)

### Database
- ✅ PostgreSQL with proper schema
- ✅ Merchants table with API credentials
- ✅ Orders table with merchant relationships
- ✅ Payments table with order relationships
- ✅ Proper indexes for performance
- ✅ Automatic schema initialization

### Frontend - Dashboard
- ✅ Login page with test credentials
- ✅ Dashboard with API credentials display
- ✅ Statistics section (transactions, amount, success rate)
- ✅ Transaction history table
- ✅ Responsive design
- ✅ All required data-test-id attributes

### Frontend - Checkout
- ✅ Order details display
- ✅ Payment method selection (UPI/Card)
- ✅ UPI payment form with VPA validation
- ✅ Card payment form with full validation
- ✅ Processing state with spinner
- ✅ Success/failure states
- ✅ Payment status polling (2-second intervals)
- ✅ Retry functionality
- ✅ All required data-test-id attributes

## Payment Validation Rules

### VPA Validation
Valid format: `^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$`
- Example valid: `user@paytm`, `john.doe@okhdfcbank`, `user_123@phonepe`
- Example invalid: `user @paytm` (space), `@paytm` (missing username)

### Card Validation
- **Luhn Algorithm**: Validates card number checksum
- **Network Detection**:
  - Visa: Starts with 4
  - Mastercard: Starts with 51-55
  - Amex: Starts with 34 or 37
  - RuPay: Starts with 60, 65, or 81-89
- **Expiry**: Must be in future (supports MM/YY or MM/YYYY format)
- **CVV**: Stored securely, never persisted

## Environment Configuration

See `.env.example` for available configuration:

```env
# Database
DATABASE_URL=postgresql://gateway_user:gateway_pass@postgres:5432/payment_gateway

# Server
PORT=8000

# Payment simulation
UPI_SUCCESS_RATE=0.90
CARD_SUCCESS_RATE=0.95
PROCESSING_DELAY_MIN=5000
PROCESSING_DELAY_MAX=10000

# Test mode
TEST_MODE=false
TEST_PAYMENT_SUCCESS=true
TEST_PROCESSING_DELAY=1000
```

### Test Mode
When `TEST_MODE=true`:
- Payment outcomes are deterministic (controlled by `TEST_PAYMENT_SUCCESS`)
- Processing delay is fixed (controlled by `TEST_PROCESSING_DELAY`)
- Useful for automated testing

## Testing the API

### Using cURL

**Create Order:**
```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "currency": "INR"}'
```

**Create Payment (UPI):**
```bash
curl -X POST http://localhost:8000/api/v1/payments \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -H "Content-Type: application/json" \
  -d '{"order_id": "order_xyz", "method": "upi", "vpa": "user@paytm"}'
```

**Create Payment (Card):**
```bash
curl -X POST http://localhost:8000/api/v1/payments \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "order_xyz",
    "method": "card",
    "card": {
      "number": "4111111111111111",
      "expiry_month": "12",
      "expiry_year": "2025",
      "cvv": "123",
      "holder_name": "John Doe"
    }
  }'
```

### Using Postman
1. Import the provided API endpoints
2. Set `X-Api-Key` and `X-Api-Secret` headers
3. Use test merchant credentials
4. Create orders and process payments

## Database Schema

### Merchants Table
- `id` (UUID): Primary key
- `name` (VARCHAR): Merchant name
- `email` (VARCHAR): Unique email
- `api_key` (VARCHAR): Unique API key
- `api_secret` (VARCHAR): API secret
- `webhook_url` (TEXT): Optional webhook URL
- `is_active` (BOOLEAN): Active status
- `created_at`, `updated_at` (TIMESTAMP)

### Orders Table
- `id` (VARCHAR): "order_" + 16 alphanumeric chars
- `merchant_id` (UUID): Foreign key to merchants
- `amount` (INTEGER): Amount in paise
- `currency` (VARCHAR): Currency code (default: INR)
- `receipt` (VARCHAR): Optional receipt ID
- `notes` (JSONB): Optional metadata
- `status` (VARCHAR): Order status
- `created_at`, `updated_at` (TIMESTAMP)

### Payments Table
- `id` (VARCHAR): "pay_" + 16 alphanumeric chars
- `order_id` (VARCHAR): Foreign key to orders
- `merchant_id` (UUID): Foreign key to merchants
- `amount` (INTEGER): Amount in paise
- `currency` (VARCHAR): Currency code (default: INR)
- `method` (VARCHAR): "upi" or "card"
- `status` (VARCHAR): "processing", "success", or "failed"
- `vpa` (VARCHAR): UPI VPA (if method=upi)
- `card_network` (VARCHAR): Card network (if method=card)
- `card_last4` (VARCHAR): Last 4 digits of card
- `error_code`, `error_description` (TEXT): Error details if failed
- `created_at`, `updated_at` (TIMESTAMP)

## Payment Flow

### Create Order
1. Merchant calls POST `/api/v1/orders` with authentication
2. Validate amount (minimum 100 paise = ₹1.00)
3. Generate unique order ID (order_XXXXXXXXXXXXXXXX)
4. Store in database with status "created"
5. Return order details

### Create Payment
1. Merchant/Customer calls POST `/api/v1/payments`
2. Validate order exists and belongs to merchant
3. Validate payment method and details
4. Create payment record with status "processing"
5. Simulate bank processing (5-10 seconds delay)
6. Randomly determine success/failure
7. Update payment status to "success" or "failed"
8. Return payment details

### Payment Polling (Checkout Page)
1. Create payment (immediately returns with processing status)
2. Poll `/api/v1/payments/{payment_id}/public` every 2 seconds
3. When status changes to success/failed, update UI
4. Display appropriate state (success/error/retry)

## Troubleshooting

### Docker services won't start
- Check Docker is running: `docker --version`
- View logs: `docker-compose logs -f`
- Ensure ports are available: 5432, 8000, 3000, 3001

### Database connection errors
- Wait for PostgreSQL to be healthy (10-15 seconds)
- Check database URL in environment
- Verify postgres service is running: `docker-compose logs postgres`

### API returns 401 Unauthorized
- Verify X-Api-Key and X-Api-Secret headers
- Check headers are exactly: `key_test_abc123` and `secret_test_xyz789`
- Ensure test merchant was seeded: `curl http://localhost:8000/api/v1/test/merchant`

### Frontend won't load
- Clear browser cache
- Check frontend service is running: `docker-compose logs dashboard`
- Verify API URL is correct: http://localhost:8000

### Payment processing timeout
- Check processing is running in backend: `docker-compose logs api`
- Increase polling interval if needed
- Test mode disables random delay for faster testing

## Security Considerations

- ✅ API keys required for all endpoints (except health/public)
- ✅ Card numbers and CVV never stored in database
- ✅ Only last 4 digits of cards stored
- ✅ Proper input validation for all fields
- ✅ CORS enabled for cross-origin requests
- ✅ Environment variables for sensitive config

## Performance

- Order creation: < 100ms
- Payment creation: < 200ms (not including processing simulation)
- Payment polling: Every 2 seconds
- Database indexes on merchant_id, order_id, payment status
- Connection pooling for database efficiency

## Known Limitations (Deliverable 1)

- Payment processing is synchronous (Deliverable 2 adds async/webhook support)
- No merchant registration (test merchant only)
- No transaction filtering/search
- No refunds (added in Deliverable 2)
- Limited dashboard statistics
- No webhook support

## Future Enhancements (Deliverable 2)

- Async payment processing with job queue
- Webhook notifications for payment status
- Merchant registration and management
- Refund functionality
- Advanced transaction filtering
- Rate limiting
- Redis caching
- Payment retries

## Submission Checklist

- ✅ Repository contains docker-compose.yml that starts all services
- ✅ Test merchant automatically seeded with exact credentials
- ✅ All API endpoints return correct response formats
- ✅ Dashboard includes all required pages with data-test-id attributes
- ✅ Checkout page implements complete payment flow
- ✅ Payment validation logic correctly implemented
- ✅ README includes setup and architecture documentation
- ✅ All services accessible at specified ports
- ✅ Database properly initialized on startup
- ✅ No manual setup steps required

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check Docker logs: `docker-compose logs [service-name]`
4. Verify environment configuration

## License

MIT License - See repository for details
