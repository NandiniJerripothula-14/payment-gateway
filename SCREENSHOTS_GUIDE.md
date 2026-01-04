# Screenshots & Visual Documentation Guide

## Overview

This guide helps you capture professional screenshots for your submission. You'll need:
- Screenshots of Dashboard (3 pages)
- Screenshots of Checkout page (all states)
- Screenshots of API responses

Total screenshots needed: **8-10**

---

## Prerequisites

1. **Start the services**:
   ```powershell
   docker-compose up -d
   Start-Sleep -Seconds 120  # Wait for startup
   ```

2. **Verify services are running**:
   ```powershell
   docker-compose ps
   curl http://localhost:8000/health
   ```

3. **Tools needed**:
   - Web browser (Chrome, Firefox, Edge)
   - Screenshot tool (Windows Snipping Tool, ShareX, etc.)
   - Postman or similar for API screenshots

---

## Screenshot Checklist

| # | Page/Endpoint | Filename | Status |
|---|---|---|---|
| 1 | Dashboard Login | `01-dashboard-login.png` | □ |
| 2 | Dashboard Home | `02-dashboard-home.png` | □ |
| 3 | Dashboard Credentials | `03-dashboard-credentials.png` | □ |
| 4 | Dashboard Transactions | `04-dashboard-transactions.png` | □ |
| 5 | Checkout Order Summary | `05-checkout-summary.png` | □ |
| 6 | Checkout UPI Form | `06-checkout-upi.png` | □ |
| 7 | Checkout Card Form | `07-checkout-card.png` | □ |
| 8 | Checkout Processing | `08-checkout-processing.png` | □ |
| 9 | Checkout Success | `09-checkout-success.png` | □ |
| 10 | Checkout Failure | `10-checkout-failure.png` | □ |

---

## Detailed Screenshots Guide

### 1. Dashboard Login Page
**URL**: http://localhost:3000

**What to show**:
- Clean login form
- Email input field
- Password input field
- Login button
- Professional UI design

**Steps**:
1. Open http://localhost:3000 in browser
2. Screenshot the entire login form
3. Save as `01-dashboard-login.png`

**Check**:
- ✓ Form is visible and centered
- ✓ Input fields are clear
- ✓ Button is prominent
- ✓ Professional styling visible

---

### 2. Dashboard Home Page
**URL**: http://localhost:3000/dashboard

**What to show**:
- Logged-in state (after clicking login with test@example.com)
- Dashboard title
- Navigation elements

**Steps**:
1. On login page, enter:
   - Email: `test@example.com`
   - Password: `any password` (not validated)
2. Click Login button
3. Wait for redirect to dashboard
4. Screenshot the full dashboard
5. Save as `02-dashboard-home.png`

**Check**:
- ✓ User is authenticated
- ✓ Dashboard header/title visible
- ✓ Navigation menu shows (if present)
- ✓ Page layout is professional

---

### 3. Dashboard API Credentials Section
**URL**: http://localhost:3000/dashboard

**What to show**:
- API Key: `key_test_abc123`
- API Secret: `secret_test_xyz789` (masked with dots)
- Credential display panel

**Steps**:
1. Stay on dashboard home
2. Scroll to credentials section
3. Screenshot showing:
   - "API Key" label with value
   - "API Secret" label with masked value
4. Save as `03-dashboard-credentials.png`

**Check**:
- ✓ Both credentials visible
- ✓ Key is fully visible
- ✓ Secret is masked for security
- ✓ Clear labels

---

### 4. Dashboard Transactions Page
**URL**: http://localhost:3000/transactions

**What to show**:
- Transactions table
- Column headers
- Table structure (with or without data rows)

**Steps**:
1. On dashboard, click "Transactions" or navigate to `/transactions`
2. Screenshot the transactions table
3. Save as `04-dashboard-transactions.png`

**Check**:
- ✓ Table is visible
- ✓ Headers are clear (Payment ID, Order ID, Amount, Method, Status, Created)
- ✓ Table styling is professional
- ✓ Note: May be empty if no payments processed yet

---

### 5. Checkout Order Summary
**URL**: http://localhost:3001/checkout?order_id=order_K557b5PWxfRgeMOF

**What to show**:
- Order summary section
- Order ID displayed
- Amount displayed with currency
- Professional checkout design

**Steps**:
1. First, create an order via API:
   ```powershell
   $headers = @{
     "X-Api-Key" = "key_test_abc123"
     "X-Api-Secret" = "secret_test_xyz789"
     "Content-Type" = "application/json"
   }
   
   $body = '{"amount": 50000}'
   
   $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/orders" `
     -Method POST -Headers $headers -Body $body
   
   $orderId = $response.id
   Write-Host "Order ID: $orderId"
   ```

2. Use the returned order_id in checkout URL
3. Open: `http://localhost:3001/checkout?order_id=ORDER_ID_HERE`
4. Screenshot the order summary section
5. Save as `05-checkout-summary.png`

**Check**:
- ✓ Order ID visible
- ✓ Amount shown (₹500.00 or similar)
- ✓ Currency displayed
- ✓ Professional checkout header

---

### 6. Checkout UPI Form
**URL**: http://localhost:3001/checkout?order_id=order_K557b5PWxfRgeMOF

**What to show**:
- UPI payment method selected
- VPA input field visible
- Pay button
- Form styling

**Steps**:
1. On checkout page from step 5
2. Look for payment method buttons
3. Click on "UPI" button
4. UPI form should appear with:
   - VPA input field (placeholder: "username@bank")
   - Pay button
5. Screenshot the UPI form
6. Save as `06-checkout-upi.png`

**Check**:
- ✓ UPI button is highlighted/selected
- ✓ VPA input field is visible
- ✓ Pay button shows amount (e.g., "Pay ₹500")
- ✓ Form is properly styled

---

### 7. Checkout Card Form
**URL**: http://localhost:3001/checkout?order_id=order_K557b5PWxfRgeMOF

**What to show**:
- Card payment method selected
- All card input fields
- Form layout

**Steps**:
1. On same checkout page
2. Click "Card" button to switch to card form
3. Card form should show:
   - Card Number input
   - Expiry input (MM/YY)
   - CVV input
   - Cardholder Name input
   - Pay button
4. Screenshot all fields
5. Save as `07-checkout-card.png`

**Check**:
- ✓ Card button is highlighted/selected
- ✓ All 4 input fields visible
- ✓ Proper placeholders shown
- ✓ Pay button is prominent
- ✓ Professional form layout

---

### 8. Checkout Processing State
**URL**: http://localhost:3001/checkout?order_id=order_K557b5PWxfRgeMOF

**What to show**:
- Processing spinner/loader
- "Processing payment..." message
- Loading state UI

**Steps**:
1. On checkout page with card form visible
2. Enter test card details:
   - Card: `4111111111111111` (Visa)
   - Expiry: `12/25`
   - CVV: `123`
   - Holder: `John Doe`
3. Click "Pay ₹500" button
4. Immediately take screenshot (within 1 second of click)
5. Save as `08-checkout-processing.png`

**Check**:
- ✓ Spinner/loader animation visible
- ✓ "Processing payment..." text shown
- ✓ Form is hidden/disabled
- ✓ Professional loading state

---

### 9. Checkout Success State
**URL**: http://localhost:3001/checkout?order_id=order_K557b5PWxfRgeMOF

**What to show**:
- "Payment Successful!" message
- Payment ID displayed
- Success confirmation UI
- Green/positive styling

**Steps**:
1. Wait 10-15 seconds after clicking pay (payment processing takes 5-10s)
2. Screenshot should show success state with:
   - Success message (e.g., "Payment Successful!")
   - Payment ID (e.g., "pay_H8sK3jD9s2L1pQr")
   - Confirmation message
3. Save as `09-checkout-success.png`

**Check**:
- ✓ Success message prominently displayed
- ✓ Payment ID shown
- ✓ Green color scheme (if applicable)
- ✓ Professional success state

---

### 10. Checkout Failure State
**URL**: http://localhost:3001/checkout?order_id=order_K557b5PWxfRgeMOF

**What to show**:
- "Payment Failed" message
- Error message
- Retry button
- Failure state styling

**Steps**:
1. Create another order (same as step 5)
2. Go to checkout with new order_id
3. Enter invalid card details:
   - Card: `4111111111111112` (invalid Luhn check)
   - Or wait for random failure (5% chance for cards)
4. Click Pay
5. After 10-15 seconds, screenshot failure state:
   - Error message (e.g., "Payment could not be processed")
   - Retry button visible
6. Save as `10-checkout-failure.png`

**Alternative for guaranteed failure**:
- Use VPA validation failure:
  - Click UPI button
  - Enter invalid VPA: `invalid` (no @ symbol)
  - Click Pay
  - Screenshot error immediately

**Check**:
- ✓ Error message clearly displayed
- ✓ Retry button visible
- ✓ Red/warning color scheme (if applicable)
- ✓ Professional error state

---

## API Screenshot (Optional but Recommended)

### Health Check Response
**Tool**: Postman or Windows Terminal

```powershell
curl http://localhost:8000/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-01-04T08:00:00.000Z"
}
```

**Steps**:
1. Open Postman
2. Create GET request to `http://localhost:8000/health`
3. Click Send
4. Screenshot the response panel showing JSON
5. Save as `api-health-check.png`

---

## Organizing Screenshots

Create a `screenshots/` folder in your repository:

```
payment-gateway/
├── screenshots/
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
├── docker-compose.yml
├── README.md
└── ...
```

---

## Quality Checklist

For each screenshot, ensure:

- [ ] **Resolution**: 1366x768 or higher (standard laptop)
- [ ] **Clarity**: Text is readable, no blur
- [ ] **Completeness**: Full page visible (no partial cuts)
- [ ] **Naming**: Follows `##-description.png` format
- [ ] **Organization**: All in `screenshots/` folder
- [ ] **File format**: PNG (lossless quality)

---

## Tips for Professional Screenshots

1. **Clean Desktop**:
   - Close unnecessary tabs/windows
   - Maximize browser window
   - Hide taskbar if possible

2. **Timing**:
   - Take processing state very quickly (within 1 second)
   - Wait full 10-15 seconds for success/failure states

3. **Consistency**:
   - Same browser for all screenshots
   - Same resolution for all screenshots
   - Same zoom level (100%)

4. **Content**:
   - Include full page headers and footers
   - Show complete forms
   - Make data-test-ids are not visible (internal HTML attribute)

5. **Editing** (optional):
   - Add arrows pointing to important elements
   - Add boxes around key features
   - Use comments to explain what's shown

---

## Submission Notes

Include screenshots in your GitHub repository's `screenshots/` folder. Link them in README.md:

```markdown
## Visual Documentation

### Dashboard
- [Login Page](screenshots/01-dashboard-login.png)
- [Home Page](screenshots/02-dashboard-home.png)
- [API Credentials](screenshots/03-dashboard-credentials.png)
- [Transactions](screenshots/04-dashboard-transactions.png)

### Checkout
- [Order Summary](screenshots/05-checkout-summary.png)
- [UPI Form](screenshots/06-checkout-upi.png)
- [Card Form](screenshots/07-checkout-card.png)
- [Processing State](screenshots/08-checkout-processing.png)
- [Success State](screenshots/09-checkout-success.png)
- [Failure State](screenshots/10-checkout-failure.png)
```

---

Done! Move on to the video demo script next.
