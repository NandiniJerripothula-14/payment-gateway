# Video Demo Script (2-3 Minutes)

## Overview
This script guides you through recording a complete 2-3 minute video demonstration of the payment gateway working end-to-end. The video shows the entire flow from order creation to successful payment.

---

## Recording Setup

### Tools Needed
- **Screen Recorder**: 
  - Windows 10+: Win + G (Xbox Game Bar)
  - OBS Studio (free, professional)
  - ScreenFlow (Mac)
  - Any screen recording software

- **Browser**: Chrome, Firefox, or Edge
- **Terminal**: Windows PowerShell or Command Prompt
- **Text Editor**: Optional (for showing code)

### Settings
- **Resolution**: 1366x768 or 1920x1080 (full HD better)
- **FPS**: 30 fps (smooth playback)
- **Format**: MP4 (most compatible)
- **Audio**: Optional (narration adds value)

---

## Video Sections & Script

### Section 1: Introduction (10-15 seconds)

**What to show**:
- Desktop with VS Code or terminal open
- Project folder visible

**Script/Narration** (optional):
> "This is a demonstration of a complete Payment Gateway implementation with multi-method payment processing. I'll show you the entire system: backend API, database, dashboard frontend, and checkout page."

**Steps**:
1. Start screen recording
2. Show project folder structure in VS Code or file explorer
3. Optionally, show docker-compose.yml file (5-10 seconds)
4. Show README.md file (just the title, 5 seconds)

---

### Section 2: System Startup (20-30 seconds)

**What to show**:
- Running docker-compose up -d
- Services starting and becoming healthy
- Health check verification

**Script/Narration**:
> "The entire system runs in Docker. With a single command, all services start: PostgreSQL database, Express.js API, React dashboard, and React checkout page."

**Steps**:
1. Open PowerShell terminal
2. Navigate to project: `cd C:\Users\jerri\payment-gateway`
3. Run: `docker-compose up -d`
4. Wait 2-3 seconds for output
5. Run: `docker-compose ps`
6. Show all 4 services running:
   ```
   NAME              STATUS           PORTS
   pg_gateway        Up (healthy)     5432
   gateway_api       Up               8000:8000
   gateway_dashboard Up               3000:80
   gateway_checkout  Up               3001:80
   ```
7. Run: `curl http://localhost:8000/health`
8. Show response: `{"status":"healthy","database":"connected",...}`
9. Let recording run for 20-30 seconds total

---

### Section 3: Dashboard Demo (40-50 seconds)

**What to show**:
- Dashboard login page
- Successful authentication
- API credentials display
- Transactions page

**Script/Narration**:
> "First, let's look at the merchant dashboard. Merchants log in with their email to view their API credentials and transaction history."

**Steps**:
1. Open browser: http://localhost:3000
2. Show login page (5 seconds)
   - Highlight email and password fields
   - Mention data-test-id attributes
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `any password`
4. Click "Login" button
5. Wait for redirect (3-5 seconds) - show "Dashboard" page with:
   - Merchant name/title
   - API Key: `key_test_abc123`
   - API Secret: `secret_test_xyz789` (masked)
6. Scroll down to show stats section:
   - Total Transactions
   - Total Amount
   - Success Rate
7. Click on "Transactions" link/tab (10 seconds)
8. Show transactions table with columns:
   - Payment ID
   - Order ID
   - Amount
   - Method
   - Status
   - Created Date

---

### Section 4: API Call (30-40 seconds)

**What to show**:
- Creating an order via REST API
- API response with generated order ID
- Show the exact request and response

**Script/Narration**:
> "Merchants create payment orders via the REST API. The API requires authentication with API Key and Secret. Here's an example order creation request."

**Steps**:
1. Open new terminal (keep browser visible)
2. Run PowerShell command to create order:
   ```powershell
   $headers = @{
     "X-Api-Key" = "key_test_abc123"
     "X-Api-Secret" = "secret_test_xyz789"
     "Content-Type" = "application/json"
   }
   
   $body = '{"amount": 50000}'
   
   $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/orders" `
     -Method POST -Headers $headers -Body $body
   
   $response | ConvertTo-Json
   ```

3. Show the API response:
   ```json
   {
     "id": "order_K557b5PWxfRgeMOF",
     "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
     "amount": 50000,
     "currency": "INR",
     "status": "created",
     "created_at": "2026-01-04T08:00:00.000Z"
   }
   ```

4. Narrate key points:
   - "Order created with ID: order_K557b5PWxfRgeMOF"
   - "Amount: 50000 paise (₹500)"
   - "Status: created"
5. Copy the order ID for next section

---

### Section 5: Checkout Page - UPI Payment (40-50 seconds)

**What to show**:
- Checkout page with order summary
- UPI payment form
- VPA validation
- Payment processing
- Success state

**Script/Narration**:
> "Now let's use the checkout page to complete a payment. Customers are redirected to this page with the order ID. They can choose between UPI and Card payment methods."

**Steps**:
1. In browser, open new tab
2. Navigate to checkout with created order:
   `http://localhost:3001/checkout?order_id=order_K557b5PWxfRgeMOF`

3. Show order summary (5 seconds):
   - "Complete Payment" header
   - Amount: ₹500.00
   - Order ID: order_K557b5PWxfRgeMOF

4. Show payment method buttons (2 seconds):
   - UPI button
   - Card button

5. Click UPI button (5 seconds)
6. Show UPI form with:
   - VPA input field
   - Pay button
7. Enter valid UPI: `user@paytm`
8. Click "Pay ₹500.00" button
9. Show processing state (5 seconds):
   - Spinner animation
   - "Processing payment..." message
10. Wait 10-15 seconds for payment processing
11. Show success state (5 seconds):
    - "Payment Successful!" header
    - Payment ID displayed (e.g., "pay_H8sK3jD9s2L1pQr")
    - Success message
12. Narrate: "UPI payment completed successfully in about 8 seconds, simulating actual bank processing time."

---

### Section 6: Checkout Page - Card Payment (40-50 seconds)

**What to show**:
- Card payment form
- Form validation
- Payment processing with card
- Failure scenario (optional)

**Script/Narration**:
> "We can also process card payments. The system validates card numbers using the Luhn algorithm and detects the card network. Let me demonstrate a card payment."

**Steps**:
1. Create another order (repeat Section 4 command)
2. Copy new order ID
3. Navigate to checkout with new order:
   `http://localhost:3001/checkout?order_id=NEW_ORDER_ID`

4. Show order summary (3 seconds)
5. Click "Card" button (2 seconds)
6. Show card form with fields:
   - Card Number
   - Expiry (MM/YY)
   - CVV
   - Cardholder Name

7. Enter test card details:
   - Card: `4111111111111111`
   - Expiry: `12/25`
   - CVV: `123`
   - Name: `John Doe`

8. Narrate while filling: "This is a test Visa card. The system validates the card number using Luhn algorithm and detects the network."

9. Click "Pay ₹500.00" button
10. Show processing state (5 seconds) while narrating:
    - "Processing..."
    - "The system adds a 5-10 second delay to simulate bank processing"

11. Wait for success state (10 seconds):
    - "Payment Successful!"
    - Show payment ID
    - Note the success

12. Optional: Show failure scenario:
    - Create one more order
    - Try invalid card: `4111111111111112` (fails Luhn check)
    - Show error state
    - Narrate about validation and error handling

---

### Section 7: Database Verification (20-30 seconds)

**What to show**:
- Querying database for payment records
- Showing actual stored data
- Table structure

**Script/Narration**:
> "All transactions are persisted in PostgreSQL database. Let me verify that our payments are stored correctly."

**Steps**:
1. Go to terminal
2. Query the database (optional - show if comfortable with psql):
   ```powershell
   # Using Docker exec to run SQL
   docker exec pg_gateway psql -U gateway_user -d payment_gateway -c "SELECT * FROM payments LIMIT 5;"
   ```

3. Show output showing:
   - Payment IDs (pay_*)
   - Order IDs (order_*)
   - Methods (upi, card)
   - Statuses (success, processing, failed)
   - Amounts
   - Timestamps

4. Narrate: "We can see the payment records in the database with all transaction details including ID, method, amount, status, and timestamps."

---

### Section 8: Conclusion (10-15 seconds)

**What to show**:
- System overview
- GitHub link (optional)
- Final thoughts

**Script/Narration**:
> "That completes the demonstration of the Payment Gateway system. Key highlights:
> 
> - Complete payment processing for UPI and Card methods
> - Robust validation with Luhn algorithm and VPA checks
> - Professional merchant dashboard
> - Secure API with authentication
> - PostgreSQL database for persistence
> - Everything containerized with Docker
>
> The entire system is available on GitHub and can be started with a single docker-compose up -d command."

**Steps**:
1. Show GitHub URL (if you have one):
   `https://github.com/USERNAME/payment-gateway`
2. Or show project folder
3. Let screen sit for 5 seconds
4. Stop recording

---

## Recording Tips

### Audio/Narration
- **Option 1**: Record without narration (silent)
- **Option 2**: Record narration separately, sync in editing
- **Option 3**: Record live with narration (most natural)

### Pacing
- Speak clearly and at moderate pace
- Pause for 2-3 seconds after major actions
- Let users see the UI for 5+ seconds at a time

### Timing
- Section 1: 15 seconds
- Section 2: 30 seconds
- Section 3: 50 seconds
- Section 4: 40 seconds
- Section 5: 50 seconds
- Section 6: 50 seconds
- Section 7: 30 seconds
- Section 8: 15 seconds
- **Total: ~280 seconds = 4.7 minutes**

Trim down if needed to stay under 5 minutes.

### Camera Settings
- Zoom to 100% (no scaling)
- Show full browser window
- Close unnecessary windows
- Disable notifications

### Files to Keep Running
- Docker services (docker-compose up -d)
- One browser window
- One terminal window
- Optional: VS Code with code visible

---

## Editing (Optional)

Use free video editing software:
- **Windows**: Photos app, Shotcut
- **Mac**: iMovie
- **Cross-platform**: DaVinci Resolve, OpenShot

Consider:
1. Adding title screen (2 seconds)
2. Trimming dead time
3. Adding text overlays showing:
   - API endpoint being called
   - Order/Payment IDs
   - Important values
4. Adding background music (optional, royalty-free)
5. Adding captions for clarity

---

## File Output

**Recommended settings**:
- Format: MP4
- Codec: H.264
- Resolution: 1920x1080 or 1366x768
- Bitrate: 5-8 Mbps
- FPS: 30

**File size**: ~200-400 MB for 3-5 minute video

---

## Submission

Upload video to one of:
1. **YouTube** (unlisted or public) - Best option
2. **Google Drive** - Share link
3. **Vimeo** - Professional option
4. **GitHub Releases** - Attached to repository

Add link in README.md:

```markdown
## Video Demo

[Watch Payment Gateway Demo (3 minutes)](https://youtu.be/YOUR_VIDEO_ID)

**Contents:**
- System startup with Docker
- Dashboard login and credentials
- API order creation
- UPI payment flow
- Card payment flow
- Database verification
```

---

## Final Checklist

- [ ] Recording quality is clear (readable text)
- [ ] All sections shown with proper pacing
- [ ] Audio (if narrated) is clear and easy to understand
- [ ] Video length is 2-4 minutes
- [ ] Video format is MP4 or similar
- [ ] Video is accessible (YouTube unlisted or shared link)
- [ ] Link is provided in README.md
- [ ] No personal information visible
- [ ] All services running correctly during recording
- [ ] Payment shows success (not failure) for demo

---

## Script Checklist Summary

- [ ] Intro: Show project folder (15s)
- [ ] Startup: Run docker-compose, show services (30s)
- [ ] Dashboard: Login, show credentials, transactions (50s)
- [ ] API: Show order creation request/response (40s)
- [ ] Checkout UPI: Show order, UPI form, successful payment (50s)
- [ ] Checkout Card: Show card form, successful payment (50s)
- [ ] Database: Query payments table (30s)
- [ ] Conclusion: Summary and GitHub link (15s)
- [ ] **Total: ~280 seconds (4.7 minutes)**

---

Done! All submission materials are ready. Now let's push everything to GitHub!
