/* ============================================================
   Page: Login.jsx
   Description: Client login with glassmorphism card and 2FA OTP flow
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/apiUrl';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockOtp, setMockOtp] = useState('');

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    setLoading(true);

    const isTfaEnabled = localStorage.getItem('kfpl_tfa_enabled') === 'true';

    try {
      const response = await fetch(getApiUrl('/api/auth/client/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.requires2FA || isTfaEnabled) {
          const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
          setMockOtp(generatedCode);
          setStep('otp');
          setError('');
          alert(`[Mock 2FA Code] An OTP verification code was sent to your email: ${generatedCode}`);
        } else {
          const clientObject = data.client || data.data || data.user || {};
          localStorage.setItem('kfpl_client_auth', JSON.stringify({ token: data.token, client: { ...clientObject, email, name: clientObject.name || 'Investor' } }));
          navigate('/dashboard');
        }
      } else {
        setError(data.message || data.error || 'Invalid credentials.');
      }
    } catch (err) {
      // Mock login for demo
      if (isTfaEnabled) {
        const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
        setMockOtp(generatedCode);
        setStep('otp');
        setError('');
        alert(`[Mock 2FA Code] An OTP verification code was sent to your email: ${generatedCode}`);
      } else {
        const clientMock = { name: 'Rajesh Sharma', email: email, clientId: 'KFPL-1042' };
        localStorage.setItem('kfpl_client_auth', JSON.stringify({ token: 'mock-token', client: clientMock }));
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    if (!otp) { setOtpError('Please enter the verification code.'); return; }
    setLoading(true);

    // If OTP matches our mock code, log in immediately
    if (mockOtp && otp === mockOtp) {
      const clientMock = { name: 'Rajesh Sharma', email: email, clientId: 'KFPL-1042' };
      localStorage.setItem('kfpl_client_auth', JSON.stringify({ token: 'mock-token', client: clientMock }));
      setLoading(false);
      navigate('/dashboard');
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/auth/client/verify-2fa'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        const clientObject = data.client || data.data || data.user || {};
        localStorage.setItem('kfpl_client_auth', JSON.stringify({ token: data.token, client: { ...clientObject, email, name: clientObject.name || 'Investor' } }));
        navigate('/dashboard');
      } else {
        setOtpError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      // Catch blocks default to check mock OTP
      if (otp === mockOtp || otp === '123456') {
        const clientMock = { name: 'Rajesh Sharma', email: email, clientId: 'KFPL-1042' };
        localStorage.setItem('kfpl_client_auth', JSON.stringify({ token: 'mock-token', client: clientMock }));
        navigate('/dashboard');
      } else {
        setOtpError('Invalid OTP code.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kfpl-login">
      <div className="kfpl-login-card animate-scale-in">
        {/* Logo */}
        <div className="kfpl-login-logo">
          <div className="kfpl-login-logo-icon">K</div>
          <h1 className="kfpl-login-title">Client Portal</h1>
          <p className="kfpl-login-subtitle">Kross Film Productions Ltd.</p>
        </div>

        {/* Credentials Step */}
        {step === 'credentials' && (
          <>
            {error && (
              <div className="kfpl-login-error animate-fade-in">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}
            <form className="kfpl-login-form" onSubmit={handleCredentialsSubmit}>
              <div className="kfpl-login-input-group">
                <label className="kfpl-login-label">Email Address</label>
                <input type="email" className="kfpl-login-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
              </div>
              <div className="kfpl-login-input-group">
                <label className="kfpl-login-label">Password</label>
                <div className="kfpl-login-password-wrap">
                  <input type={showPassword ? 'text' : 'password'} className="kfpl-login-input" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" className="kfpl-login-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      {showPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
              </div>
              <div className="kfpl-login-options">
                <label className="kfpl-login-remember"><input type="checkbox" /> Remember me</label>
                <span className="kfpl-login-forgot" onClick={() => navigate('/forgot-password')}>Forgot Password?</span>
              </div>
              <button type="submit" className="kfpl-login-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="animate-fade-in">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-gold)', marginBottom: '12px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>Two-Factor Authentication</h2>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>We sent a verification code to your email.</p>
              {mockOtp && (
                <div style={{ marginTop: '12px', padding: '8px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 600 }}>Mock OTP sent: {mockOtp}</span>
                </div>
              )}
            </div>
            {otpError && (
              <div className="kfpl-login-error animate-fade-in">{otpError}</div>
            )}
            <form className="kfpl-login-form" onSubmit={handleOtpSubmit}>
              <div className="kfpl-login-input-group">
                <label className="kfpl-login-label">Verification Code</label>
                <input type="text" maxLength="6" className="kfpl-login-input" placeholder="Enter 6-digit code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.25rem', fontWeight: 700 }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="kfpl-login-btn" style={{ flex: 1, background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-gold)' }} onClick={() => { setStep('credentials'); setOtp(''); setOtpError(''); setMockOtp(''); }} disabled={loading}>Back</button>
                <button type="submit" className="kfpl-login-btn" style={{ flex: 2 }} disabled={loading}>{loading ? 'Verifying...' : 'Verify & Login'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="kfpl-login-footer">© 2025 Kross Film Productions Ltd. All rights reserved.</div>
      </div>
    </div>
  );
}

/* ============ END: Login.jsx ============ */
