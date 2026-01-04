# Payment Gateway Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Payment Gateway                          │
│                    (Docker Compose Network)                      │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────┐          ┌──────────────┐       ┌──────────────┐
   │Dashboard│          │   Checkout   │       │   REST API   │
   │  (React)│          │    (React)   │       │  (Express)   │
   │ :3000   │          │   :3001      │       │   :8000      │
   └────┬────┘          └──────┬───────┘       └──────┬───────┘
        │                      │                      │
        │ HTTP Requests        │ HTTP Requests        │
        │ (Authenticated)      │ (Public Endpoints)   │
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                   ┌───────────▼───────────┐
                   │   PostgreSQL DB       │
                   │   :5432              │
                   │  payment_gateway     │
                   └───────────────────────┘
```

## Component Details

### 1. Frontend Services

#### Dashboard (Port 3000)
- **Technology**: React 18.2.0 + Nginx
- **Purpose**: Merchant management interface
- **Pages**:
  - Login: Authenticate merchants
  - Dashboard: Display API credentials and stats
  - Transactions: List all payments
- **Features**:
  - API key/secret display
  - Transaction history
  - Real-time stats (total orders, amount, success rate)

#### Checkout (Port 3001)
- **Technology**: React 18.2.0 + Nginx
- **Purpose**: Customer payment interface
- **Features**:
  - Order summary display
  - Payment method selection (UPI/Card)
  - Form validation
  - Real-time status polling
  - Success/failure states

### 2. Backend Service

#### Express.js API (Port 8000)
- **Technology**: Node.js 18-alpine + Express.js
- **Purpose**: Core business logic and payment processing
- **Structure**:
  ```
  backend/
  ├── src/
  │   ├── index.js           (Server entry point)
  │   ├── db.js              (Database connection & schema)
  │   ├── routes/
  │   │   └── api.js         (All API endpoints)
  │   ├── services/
  │   │   ├── orderService.js      (Order operations)
  │   │   └── paymentService.js    (Payment processing)
  │   ├── validators/
  │   │   └── paymentValidator.js  (VPA, Luhn, network detection)
  │   ├── middleware/
  │   │   └── auth.js        (API key/secret validation)
  │   └── utils/
  │       └── idGenerator.js (ID generation)
  ```

### 3. Database Layer

#### PostgreSQL (Port 5432)
- **Technology**: PostgreSQL 15-alpine
- **Database**: payment_gateway
- **Tables**:
  
  **merchants**
  ```
  id (UUID) [PK]
  name (string)
  email (string) [UNIQUE]
  api_key (string) [UNIQUE]
  api_secret (string)
  webhook_url (text, optional)
  is_active (boolean)
  created_at (timestamp)
  updated_at (timestamp)
  ```
  
  **orders**
  ```
  id (string) [PK] - format: order_[16 alphanumeric]
  merchant_id (UUID) [FK → merchants.id]
  amount (integer) - in paise
  currency (string) - default: INR
  receipt (string, optional)
  notes (JSON, optional)
  status (string) - default: created
  created_at (timestamp)
  updated_at (timestamp)
  
  [INDEX] merchant_id
  ```
  
  **payments**
  ```
  id (string) [PK] - format: pay_[16 alphanumeric]
  order_id (string) [FK → orders.id]
  merchant_id (UUID) [FK → merchants.id]
  amount (integer) - in paise
  currency (string) - default: INR
  method (string) - upi, card
  status (string) - processing, success, failed
  vpa (string, optional) - for UPI
  card_network (string, optional) - visa, mastercard, amex, rupay
  card_last4 (string, optional) - last 4 digits only
  error_code (string, optional)
  error_description (text, optional)
  created_at (timestamp)
  updated_at (timestamp)
  
  [INDEX] order_id
  [INDEX] status
  ```

---

## API Endpoints

### Authentication-Protected Endpoints
Require `X-Api-Key` and `X-Api-Secret` headers

```
POST   /api/v1/orders              - Create payment order
GET    /api/v1/orders/{id}         - Get order details
POST   /api/v1/payments            - Create payment
GET    /api/v1/payments/{id}       - Get payment status
```

### Public Endpoints
No authentication required

```
GET    /api/v1/orders/{id}/public       - Get order (checkout)
POST   /api/v1/payments/public          - Create payment (checkout)
GET    /api/v1/payments/{id}/public     - Check payment status (checkout)
GET    /api/v1/test/merchant            - Get test merchant info
GET    /health                          - Health check
```

---

## Data Flow Diagrams

### Order Creation Flow
```
Merchant Dashboard
      │
      ▼ (POST /api/v1/orders)
   API validates credentials
      │
      ▼
   Database creates order
      │
      ▼
   Returns order_id
      │
      ▼
   Merchant redirects customer to checkout
```

### Payment Processing Flow
```
Checkout Page (Customer)
      │
      ▼ (POST /api/v1/payments/public)
   API validates order & payment data
      │
      ▼
   Creates payment record (status: processing)
      │
      ▼
   Simulates 5-10s bank delay
      │
      ▼
   Randomly determines success/failure
      ├─ UPI: 90% success rate
      └─ Card: 95% success rate
      │
      ▼
   Updates payment status (success/failed)
      │
      ▼
   Checkout polls for status update (2s interval)
      │
      ▼
   Shows success/failure screen
```

---

## Security Architecture

### API Authentication
- X-Api-Key and X-Api-Secret header validation
- Middleware checks merchant existence and credentials
- Returns 401 Unauthorized if invalid

### Data Protection
- **Card Data**: Only last 4 digits stored, CVV never stored
- **Credentials**: API secrets stored in database (production should use hashing)
- **Transport**: All API calls via HTTP (production should use HTTPS)

### Validation Layers
1. **Input Validation**: Amount, format checks
2. **Business Logic**: VPA format, Luhn algorithm
3. **Authorization**: Merchant ownership verification

---

## Docker Compose Network

```
Services connect via internal network:
- api → postgres (DATABASE_URL)
- dashboard → api (API_BASE_URL: http://gateway_api:8000)
- checkout → api (API_BASE_URL: http://gateway_api:8000)

All services exposed to host:
- postgres:5432 (internal only)
- api:8000 (public)
- dashboard:3000 (public)
- checkout:3001 (public)
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│     Host Machine / Cloud Server          │
│  (docker-compose up -d)                  │
└─────────────────────┬────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌────────┐   ┌────────┐   ┌──────────┐
   │Docker  │   │Docker  │   │Docker    │
   │Network │   │Volume  │   │Image     │
   │        │   │(Data)  │   │Registry  │
   └────────┘   └────────┘   └──────────┘
        │
        ├─ Container: pg_gateway (PostgreSQL)
        ├─ Container: gateway_api (Express)
        ├─ Container: gateway_dashboard (React+Nginx)
        └─ Container: gateway_checkout (React+Nginx)
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Database | PostgreSQL | 15-alpine |
| Backend | Node.js | 18-alpine |
| Framework | Express.js | 4.x |
| Frontend | React | 18.2.0 |
| Web Server | Nginx | alpine |
| Container | Docker | Latest |
| Orchestration | Docker Compose | 3.8 |

---

## Key Design Decisions

1. **Synchronous Payment Processing** (Deliverable 1)
   - API waits 5-10s for payment result
   - Returns final status to client immediately
   - Production (Deliverable 2) would use async job queue

2. **Public Endpoints for Checkout**
   - `/api/v1/orders/{id}/public` - No auth required
   - `/api/v1/payments/public` - No auth required
   - Enables checkout without merchant credentials

3. **Single Database Schema**
   - All data in PostgreSQL
   - No external caching (Deliverable 2 adds Redis)

4. **Test Merchant Auto-seeding**
   - Automatically created on app startup
   - Enables immediate testing without setup

5. **ID Generation Strategy**
   - Order: `order_` + 16 alphanumeric characters
   - Payment: `pay_` + 16 alphanumeric characters
   - Ensures uniqueness without database sequences

---

## Scaling Considerations (Future)

- **Deliverable 2**: Add Redis for async job processing
- Implement webhook system for merchant notifications
- Add refund functionality
- Implement rate limiting and DDoS protection
- Database replication for high availability
- Load balancing across API instances

