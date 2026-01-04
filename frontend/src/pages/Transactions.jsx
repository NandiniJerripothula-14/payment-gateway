import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [merchant, setMerchant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMerchant = localStorage.getItem('merchant');
    if (!storedMerchant) {
      navigate('/login');
      return;
    }
    setMerchant(JSON.parse(storedMerchant));

    // For now, transactions list will be empty as we need backend endpoint
    // In Deliverable 2, this will fetch actual transactions
    setTransactions([]);
  }, [navigate]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="transactions-container">
      <nav className="navbar">
        <h1>Payment Gateway</h1>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="transactions-content">
        <h2>Transaction History</h2>

        <table data-test-id="transactions-table" className="transactions-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No transactions yet
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} data-test-id="transaction-row" data-payment-id={tx.id}>
                  <td data-test-id="payment-id">{tx.id}</td>
                  <td data-test-id="order-id">{tx.order_id}</td>
                  <td data-test-id="amount">
                    ₹{(tx.amount / 100).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td data-test-id="method">{tx.method.toUpperCase()}</td>
                  <td data-test-id="status" className={`status-${tx.status}`}>
                    {tx.status.toUpperCase()}
                  </td>
                  <td data-test-id="created-at">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
