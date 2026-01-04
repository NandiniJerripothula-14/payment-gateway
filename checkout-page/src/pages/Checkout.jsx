import React, { useState, useEffect } from 'react';
import { checkoutApiService } from '../services/checkoutApiService';
import '../styles/Checkout.css';

export default function Checkout() {
  // Parse query params from URL
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order_id');

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [vpa, setVpa] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // UI state
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'processing', 'success', 'failed'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [orderId]);

  // Poll payment status
  useEffect(() => {
    if (payment && (paymentStatus === 'processing' || paymentStatus === null)) {
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [payment, paymentStatus]);

  const fetchOrder = async () => {
    try {
      const orderData = await checkoutApiService.getOrder(orderId);
      setOrder(orderData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load order details');
      setLoading(false);
      console.error('Order fetch error:', err);
    }
  };

  const checkPaymentStatus = async () => {
    if (!payment) return;

    try {
      const paymentData = await checkoutApiService.getPayment(payment.id);
      if (paymentData.status === 'success') {
        setPaymentStatus('success');
        setPayment(paymentData);
      } else if (paymentData.status === 'failed') {
        setPaymentStatus('failed');
        setErrorMessage(paymentData.error_description || 'Payment failed');
        setPayment(paymentData);
      }
      // If still processing, keep polling
    } catch (err) {
      console.error('Payment status check error:', err);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMessage('');

    try {
      let paymentData = {
        method: selectedMethod,
      };

      if (selectedMethod === 'upi') {
        paymentData.vpa = vpa;
      } else if (selectedMethod === 'card') {
        paymentData.card = {
          number: cardNumber.replace(/\s/g, ''),
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          cvv: cvv,
          holder_name: cardholderName,
        };
      }

      const paymentResponse = await checkoutApiService.createPayment(orderId, paymentData);
      setPayment(paymentResponse);
      setPaymentStatus('processing');
    } catch (err) {
      const errorDesc =
        err.response?.data?.error?.description || 'Payment creation failed';
      setErrorMessage(errorDesc);
      console.error('Payment creation error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus(null);
    setPayment(null);
    setSelectedMethod(null);
    setVpa('');
    setCardNumber('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
    setCardholderName('');
    setErrorMessage('');
  };

  if (loading) {
    return <div className="checkout-loading">Loading order details...</div>;
  }

  if (error) {
    return <div className="checkout-error">{error}</div>;
  }

  const formattedAmount = order ? (order.amount / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) : '0.00';

  return (
    <div data-test-id="checkout-container" className="checkout-container">
      <div className="checkout-card">
        {/* Order Summary */}
        <div data-test-id="order-summary" className="order-summary">
          <h2>Complete Payment</h2>
          {order && (
            <>
              <div className="summary-item">
                <span>Amount: </span>
                <span data-test-id="order-amount" className="amount-value">
                  ₹{formattedAmount}
                </span>
              </div>
              <div className="summary-item">
                <span>Order ID: </span>
                <span data-test-id="order-id" className="order-id-value">
                  {order.id}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Payment Method Selection */}
        {!selectedMethod && paymentStatus !== 'processing' && paymentStatus !== 'success' && paymentStatus !== 'failed' && (
          <div data-test-id="payment-methods" className="payment-methods">
            <button
              data-test-id="method-upi"
              data-method="upi"
              className="method-button"
              onClick={() => setSelectedMethod('upi')}
            >
              UPI
            </button>
            <button
              data-test-id="method-card"
              data-method="card"
              className="method-button"
              onClick={() => setSelectedMethod('card')}
            >
              Card
            </button>
          </div>
        )}

        {/* UPI Payment Form */}
        {selectedMethod === 'upi' && paymentStatus !== 'processing' && paymentStatus !== 'success' && paymentStatus !== 'failed' && (
          <form data-test-id="upi-form" className="payment-form" onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <input
                data-test-id="vpa-input"
                placeholder="username@bank"
                type="text"
                value={vpa}
                onChange={(e) => setVpa(e.target.value)}
                required
              />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button data-test-id="pay-button" type="submit" className="pay-button" disabled={processing}>
              {processing ? 'Processing...' : `Pay ₹${formattedAmount}`}
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => setSelectedMethod(null)}
            >
              Back
            </button>
          </form>
        )}

        {/* Card Payment Form */}
        {selectedMethod === 'card' && paymentStatus !== 'processing' && paymentStatus !== 'success' && paymentStatus !== 'failed' && (
          <form data-test-id="card-form" className="payment-form" onSubmit={handlePaymentSubmit}>
            <div className="form-group">
              <input
                data-test-id="card-number-input"
                placeholder="Card Number"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 19))}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  data-test-id="expiry-input"
                  placeholder="MM/YY"
                  type="text"
                  value={`${expiryMonth}${expiryMonth && expiryYear ? '/' : ''}${expiryYear}`}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 4) {
                      setExpiryMonth(val.slice(0, 2));
                      setExpiryYear(val.slice(2, 4));
                    }
                  }}
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  data-test-id="cvv-input"
                  placeholder="CVV"
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength="4"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <input
                data-test-id="cardholder-name-input"
                placeholder="Name on Card"
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                required
              />
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button data-test-id="pay-button" type="submit" className="pay-button" disabled={processing}>
              {processing ? 'Processing...' : `Pay ₹${formattedAmount}`}
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => setSelectedMethod(null)}
            >
              Back
            </button>
          </form>
        )}

        {/* Processing State */}
        {paymentStatus === 'processing' && (
          <div data-test-id="processing-state" className="state-container">
            <div className="spinner"></div>
            <span data-test-id="processing-message" className="message">
              Processing payment...
            </span>
          </div>
        )}

        {/* Success State */}
        {paymentStatus === 'success' && payment && (
          <div data-test-id="success-state" className="state-container success">
            <h2>✓ Payment Successful!</h2>
            <div className="success-details">
              <div>
                <span>Payment ID: </span>
                <span data-test-id="payment-id">{payment.id}</span>
              </div>
              <div>
                <span>Status: </span>
                <span>{payment.status.toUpperCase()}</span>
              </div>
            </div>
            <span data-test-id="success-message" className="message">
              Your payment has been processed successfully
            </span>
          </div>
        )}

        {/* Error State */}
        {paymentStatus === 'failed' && (
          <div data-test-id="error-state" className="state-container error">
            <h2>✗ Payment Failed</h2>
            <span data-test-id="error-message" className="message">
              {errorMessage || 'Payment could not be processed'}
            </span>
            <button data-test-id="retry-button" className="retry-button" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
