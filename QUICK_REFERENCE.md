# Payment Gateway - Quick Reference Guide

## 🚀 Getting Started (30 seconds)

```bash
cd c:\Users\jerri\payment-gateway
docker-compose up -d
```

**Verify all services running:**
```bash
docker-compose ps
```

---

## 📱 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:3000 | Merchant login & credentials |
| API | http://localhost:8000 | REST API endpoints |
| Checkout | http://localhost:3001/checkout?order_id=xxx | Customer payment form |

---

## 🔑 Test Credentials

```
Email: test@example.com
API Key: key_test_abc123
API Secret: secret_test_xyz789
Merchant ID: 550e8400-e29b-41d4-a716-446655440000
```

---

## 📝 API Quick Commands

### 1. Check Health
```bash
curl http://localhost:8000/health
```
Expected: `{"status":"healthy","database":"connected"}`

### 2. Get Test Merchant
```bash
curl http://localhost:8000/api/v1/test/merchant
```
Expected: Merchant details with `"seeded":true`

### 3. Create Order
```bash
curl -X POST http://localhost:8000/api/v1/orders \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000, "currency": "INR"}'
```
Expected: Order ID like `order_AbCdEfGhIjKlMnOp`

### 4. Get Order Details
```bash
curl http://localhost:8000/api/v1/orders/{order_id} \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789"
```

### 5. Create UPI Payment
```bash
curl -X POST http://localhost:8000/api/v1/payments \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "order_xyz",
    "method": "upi",
    "vpa": "user@paytm"
  }'
```
Expected: Payment ID like `pay_XyZaBcDeFgHiJkLm` with `"status":"processing"`

### 6. Create Card Payment
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
Expected: Payment ID with card details and `"status":"processing"`

### 7. Check Payment Status
```bash
curl http://localhost:8000/api/v1/payments/{payment_id} \
  -H "X-Api-Key: key_test_abc123" \
  -H "X-Api-Secret: secret_test_xyz789"
```
Expected: Payment with `"status":"success"` or `"status":"failed"` (after 5-10s delay)

---

## 🎮 Testing Workflow

### Option 1: Frontend Testing
1. Open http://localhost:3000 in browser
2. Login with test@example.com
3. Copy API Key and API Secret
4. Use API commands above to create order
5. Open http://localhost:3001/checkout?order_id=order_xyz in new tab
6. Select payment method and complete payment

### Option 2: API-Only Testing
1. Use curl commands above in sequence
2. Wait ~10 seconds between payment creation and status check
3. Verify final payment status

---

## 📊 Valid Test Data

### UPI VPAs (all valid)
- `user@paytm`
- `john.doe@okhdfcbank`
- `customer_123@phonepe`
- `merchant@ybl`

### Test Card Numbers
- **Visa**: `4111111111111111`
- **Mastercard**: `5555555555554444`
- **Amex**: `378282246310005`
- **RuPay**: `6522246310005`

### Test Expiry Dates
- Valid: `12/2025`, `01/2026`, `12/26`, `01/27`
- Invalid: `01/2024`, `12/24` (past dates)

### Test CVV
- Any 3-4 digits: `123`, `9876`, `000`

---

## 🔧 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View running containers
docker-compose ps

# View service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f dashboard
docker-compose logs -f checkout
docker-compose logs -f postgres

# Rebuild images
docker-compose build

# Rebuild and restart
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Services won't start | Check Docker is running: `docker --version` |
| Port already in use | Change docker-compose.yml ports or kill process using port |
| Database connection fails | Wait 10-15 seconds for PostgreSQL to start |
| API returns 401 | Verify headers: `X-Api-Key` and `X-Api-Secret` exactly match |
| Payment creates but never completes | It's processing - wait 5-10 seconds then check status |
| Checkout page shows error | Verify order_id exists and is in correct format |
| Frontend won't load | Clear browser cache or use incognito window |

---

## ✅ Success Indicators

✅ `docker-compose ps` shows 4 containers as "Up"
✅ Health endpoint returns 200 with healthy status
✅ Test merchant endpoint returns merchant details
✅ Order creation returns order ID in format `order_XXXXXXXXXXXXXXXX`
✅ Payment creation returns payment ID in format `pay_XXXXXXXXXXXXXXXX`
✅ Dashboard loads at http://localhost:3000
✅ Checkout page loads with order details

---

## 📊 Error Codes Reference

| Code | Meaning | When |
|------|---------|------|
| AUTHENTICATION_ERROR | Invalid API credentials | Missing/wrong headers |
| BAD_REQUEST_ERROR | Invalid input data | Amount < 100, invalid JSON |
| NOT_FOUND_ERROR | Resource not found | Non-existent order/payment |
| INVALID_VPA | VPA format invalid | Wrong UPI format |
| INVALID_CARD | Card number invalid | Luhn check failed |
| EXPIRED_CARD | Card expired | Expiry date in past |
| PAYMENT_FAILED | Payment processing failed | Random failure or server error |

---

## 📚 Documentation Links

- Full API docs: See [README.md](README.md)
- Architecture overview: See [README.md](README.md#architecture)
- Database schema: See [README.md](README.md#database-schema)
- Payment validation: See [README.md](README.md#payment-validation-rules)
- Deployment status: See [DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md)

---

## ✨ Key Features

✅ Multi-method payments (UPI & Card)
✅ Merchant authentication
✅ Full payment validation
✅ Professional UI/UX
✅ Real-time status updates
✅ Complete error handling
✅ Automated testing support
✅ Production-ready Docker setup

---

**Last Updated**: 2026-01-04
**Status**: ✅ All Services Running
**Ready for**: Evaluation & Testing
