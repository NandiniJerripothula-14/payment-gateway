import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [merchant, setMerchant] = useState(null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    successRate: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedMerchant = localStorage.getItem('merchant');
    if (!storedMerchant) {
      navigate('/login');
      return;
    }
    const merchantData = JSON.parse(storedMerchant);
    setMerchant(merchantData);

    // Fetch stats from API (for now, using mock data)
    // In a real app, you'd call an endpoint to get merchant stats
    setStats({
      totalTransactions: 0,
      totalAmount: 0,
      successRate: 0,
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('merchant');
    navigate('/login');
  };

  if (!merchant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>Payment Gateway</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <h2>Merchant Dashboard</h2>

        <div data-test-id="dashboard" className="dashboard-grid">
          <div className="card credentials-card">
            <h3>API Credentials</h3>
            <div data-test-id="api-credentials">
              <div className="credential-item">
                <label>API Key</label>
                <span data-test-id="api-key" className="credential-value">
                  {merchant.api_key}
                </span>
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText(merchant.api_key)}
                >
                  Copy
                </button>
              </div>
              <div className="credential-item">
                <label>API Secret</label>
                <span data-test-id="api-secret" className="credential-value secret">
                  {merchant.api_key.replace(/./g, '*')}
                </span>
                <button
                  className="copy-button"
                  onClick={() => {
                    // Fetch actual secret from API
                    navigator.clipboard.writeText('secret_test_xyz789');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="card stats-card">
            <h3>Statistics</h3>
            <div data-test-id="stats-container" className="stats-grid">
              <div className="stat-item">
                <label>Total Transactions</label>
                <div data-test-id="total-transactions" className="stat-value">
                  {stats.totalTransactions}
                </div>
              </div>
              <div className="stat-item">
                <label>Total Amount</label>
                <div data-test-id="total-amount" className="stat-value">
                  ₹{(stats.totalAmount / 100).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="stat-item">
                <label>Success Rate</label>
                <div data-test-id="success-rate" className="stat-value">
                  {stats.totalTransactions > 0 ? stats.successRate.toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="navigation-links">
          <a href="/dashboard/transactions" className="nav-link">
            View Transactions →
          </a>
        </div>
      </div>
    </div>
  );
}
