/* ============================================================
   Page: ForgotPassword.jsx
   Description: Email-based OTP password reset flow
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="kfpl-login">
      <div className="kfpl-login-card animate-scale-in">
        <div className="kfpl-login-logo">
          <div className="kfpl-login-logo-icon">K</div>
          <h1 className="kfpl-login-title">Reset Password</h1>
          <p className="kfpl-login-subtitle">We'll send you a reset link</p>
        </div>

        {!sent ? (
          <form className="kfpl-login-form" onSubmit={handleSubmit}>
            <div className="kfpl-login-input-group">
              <label className="kfpl-login-label">Email Address</label>
              <input type="email" className="kfpl-login-input" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
            </div>
            <button type="submit" className="kfpl-login-btn">Send Reset Link</button>
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <span className="kfpl-login-forgot" onClick={() => navigate('/login')}>← Back to Login</span>
            </div>
          </form>
        ) : (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-gold)', marginBottom: '16px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '28px', height: '28px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Check Your Email</h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px' }}>We've sent a password reset link to <strong style={{ color: 'var(--color-gold)' }}>{email}</strong></p>
            <button className="kfpl-login-btn" onClick={() => navigate('/login')}>Back to Login</button>
          </div>
        )}

        <div className="kfpl-login-footer">© 2025 Kross Film Productions Ltd. All rights reserved.</div>
      </div>
    </div>
  );
}

/* ============ END: ForgotPassword.jsx ============ */
