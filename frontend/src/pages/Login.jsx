import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // For Deliverable 1, use test merchant credentials
      if (email === 'test@example.com') {
        const merchant = await apiService.getMerchant(email);
        // Store merchant info in localStorage
        localStorage.setItem('merchant', JSON.stringify(merchant));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Payment Gateway Dashboard</h1>
        <form data-test-id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              data-test-id="email-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              data-test-id="password-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button data-test-id="login-button" type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="hint">Use test@example.com to login</p>
      </div>
    </div>
  );
}
