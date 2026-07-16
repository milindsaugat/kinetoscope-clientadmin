/* ============================================================
   Page: Profile.jsx
   Description: Client profile with personal info, nominee, risk profile,
                security settings (Email/Pass change with OTP, 2FA toggle),
                and integrated Support Desk contacts/FAQs.
   ============================================================ */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockFAQs } from '../../data/mockData';
import { RISK_PROFILES, NOMINEE_RELATIONS } from '../../constants';
import { useToast } from '../../components/ui/Toast';
import { apiRequest } from '../../config/apiHelper';

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const tabParam = searchParams.get('tab') || 'details';
  const [activeTab, setActiveTab] = useState(tabParam);

  const [client, setClient] = useState(null);
  const [clientEmail, setClientEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- SWR Cache Initialization for Instant Load (0ms) ---
    try {
      const cacheData = localStorage.getItem('kfpl_client_profile_cache');
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        if (parsed.client) setClient(parsed.client);
        if (parsed.clientEmail) setClientEmail(parsed.clientEmail);
        setLoading(false);
      }
    } catch (e) {
      console.warn('Failed to parse client profile cache:', e);
    }

    const loadProfile = async () => {
      try {
        const [profileRes, advisorRes] = await Promise.all([
          apiRequest('/api/client/profile').catch(() => null),
          apiRequest('/api/client/wealth-advisor').catch(() => null)
        ]);

        if (profileRes) {
          const extractProfile = (res) => {
            if (!res) return null;
            if (res.profile) return res.profile;
            if (res.client) return res.client;
            if (res.user) return res.user;
            if (res.data) {
              if (res.data.profile) return res.data.profile;
              if (res.data.client) return res.data.client;
              if (res.data.user) return res.data.user;
              return res.data;
            }
            return res;
          };
          const formatClientID = (rawId) => {
            if (!rawId || rawId === '—') return '—';
            if (typeof rawId !== 'string') rawId = String(rawId);
            if (rawId.startsWith('KFPL-CL-') || rawId.startsWith('KFPL-')) return rawId;
            const digits = rawId.match(/\d+/);
            if (digits) {
              let val = parseInt(digits[0], 10);
              if (val < 1000) {
                val = 1000 + val;
              }
              return `KFPL-CL-${val}`;
            }
            return 'KFPL-CL-1001';
          };
          const rawProfile = extractProfile(profileRes);
          if (rawProfile) {
            const normalized = {
              ...rawProfile,
              name: rawProfile.fullName || rawProfile.name || '',
              clientId: formatClientID(rawProfile.clientCode || rawProfile.clientId || rawProfile.userId || rawProfile._id || ''),
              category: rawProfile.tier || rawProfile.category || 'Silver',
              status: rawProfile.status || 'Active',
              memberSince: rawProfile.joinDate || rawProfile.memberSince || rawProfile.createdAt || '',
              agentName: rawProfile.assignedAgentName || rawProfile.agentName || '',
              agentId: rawProfile.assignedAgentCode || rawProfile.assignedAgent || rawProfile.agentId || '',
              emergencyContact: rawProfile.emergencyContact || rawProfile.emergencyPhone || '—',
              riskProfile: rawProfile.riskProfile || 'Conservative',
              nominee: {
                name: rawProfile.nomineeName || rawProfile.nominee?.name || '',
                relation: rawProfile.nomineeRelation || rawProfile.nominee?.relation || '',
                contact: rawProfile.nomineePhone || rawProfile.nomineeContact || rawProfile.nominee?.phone || rawProfile.nominee?.contact || '',
                email: rawProfile.nomineeEmail || rawProfile.nominee?.email || '',
              }
            };

            if (advisorRes) {
              const rawAdv = advisorRes.advisor || advisorRes.agent || advisorRes.data?.advisor || advisorRes.data || advisorRes;
              if (rawAdv) {
                normalized.agentName = rawAdv.fullName || rawAdv.name || normalized.agentName || 'Wealth Advisor';
                normalized.agentId = rawAdv.agentCode || rawAdv.agentId || rawAdv._id || normalized.agentId || '';
                normalized.advisorPhone = rawAdv.phone || rawAdv.mobile || rawAdv.phoneNumber || '';
                normalized.advisorEmail = rawAdv.email || '';
              }
            }

            setClient(normalized);
            setClientEmail(normalized.email || '');
            localStorage.setItem('kfpl_client_profile_cache', JSON.stringify({
              client: normalized,
              clientEmail: normalized.email || ''
            }));
          }
        }
      } catch (err) {
        console.error('Failed to load client profile from API:', err);
        addToast('error', 'Error', 'Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const riskProfile = client ? RISK_PROFILES.find(r => r.id.toLowerCase() === client.riskProfile?.toLowerCase()) : null;

  // Sync tab with URL parameter changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };


  /* ── 2FA Toggle State ──────────────── */
  const [tfaEnabled, setTfaEnabled] = useState(
    localStorage.getItem('kfpl_tfa_enabled') === 'true'
  );

  const handleTfaToggle = () => {
    const nextState = !tfaEnabled;
    setTfaEnabled(nextState);
    localStorage.setItem('kfpl_tfa_enabled', String(nextState));
    if (nextState) {
      addToast('success', '2FA Enabled', 'Two-Factor Authentication is now enabled for your account.');
    } else {
      addToast('warning', '2FA Disabled', 'Two-Factor Authentication has been turned off.');
    }
  };



  /* ── Password Change States ────────── */
  const [passForm, setPassForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passOtpSent, setPassOtpSent] = useState(false);
  const [passOtpInput, setPassOtpInput] = useState('');
  const [passResendTimer, setPassResendTimer] = useState(0);

  // Password Timer effect
  useEffect(() => {
    let interval = null;
    if (passOtpSent && passResendTimer > 0) {
      interval = setInterval(() => {
        setPassResendTimer(prev => prev - 1);
      }, 1000);
    } else if (passResendTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [passOtpSent, passResendTimer]);

  const handleSendPassOtp = async () => {
    if (!passForm.currentPass || !passForm.newPass || !passForm.confirmPass) {
      addToast('error', 'Error', 'Please fill in all password fields.');
      return;
    }
    if (passForm.newPass !== passForm.confirmPass) {
      addToast('error', 'Error', 'New password and confirm password do not match.');
      return;
    }
    if (passForm.newPass.length < 8) {
      addToast('error', 'Error', 'New password must be at least 8 characters.');
      return;
    }

    try {
      console.log('Sending OTP request to backend...');
      await apiRequest('/api/client/settings/change-password/send-otp', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passForm.currentPass,
          newPassword: passForm.newPass,
          confirmPassword: passForm.confirmPass
        })
      });
      setPassOtpSent(true);
      setPassResendTimer(30);
      addToast('success', 'Verification Code Sent', 'An OTP code has been sent to your registered email.');
    } catch (err) {
      console.error('Error sending OTP to backend:', err);
      addToast('error', 'Failed to send OTP', err.message || 'Verification code could not be sent.');
    }
  };

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    if (passOtpInput.length !== 6) {
      addToast('error', 'Verification Failed', 'Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      console.log('Verifying OTP request at backend...');
      await apiRequest('/api/client/settings/change-password/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passForm.currentPass,
          newPassword: passForm.newPass,
          otp: passOtpInput
        })
      });
      setPassForm({ currentPass: '', newPass: '', confirmPass: '' });
      setPassOtpSent(false);
      setPassOtpInput('');
      addToast('success', 'Password Updated', 'Your security password has been changed successfully.');
    } catch (err) {
      console.error('Error verifying OTP at backend:', err);
      addToast('error', 'Verification Failed', err.message || 'Incorrect OTP. Please try again.');
    }
  };

  /* ── FAQ State ─────────────────────── */
  const [openFaq, setOpenFaq] = useState(null);

  if (loading) {
    return (
      <div className="kfpl-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div className="kfpl-loading-spinner" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="kfpl-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '16px' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Failed to load profile details.</p>
        <button className="kfpl-btn kfpl-btn--primary kfpl-btn--sm" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">My Profile</h1>
          <p className="kfpl-page-subtitle">View your details, adjust security configurations, or get support</p>
        </div>
        <div className="kfpl-page-header-actions">
          <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '16px', height: '16px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Agreement
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="kfpl-pay-tabs">
        <button
          className={`kfpl-pay-tab ${activeTab === 'details' ? 'kfpl-pay-tab--active' : ''}`}
          onClick={() => handleTabChange('details')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          Profile Details
        </button>
        <button
          className={`kfpl-pay-tab ${activeTab === 'security' ? 'kfpl-pay-tab--active' : ''}`}
          onClick={() => handleTabChange('security')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Security & 2FA
        </button>
        <button
          className={`kfpl-pay-tab ${activeTab === 'support' ? 'kfpl-pay-tab--active' : ''}`}
          onClick={() => handleTabChange('support')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Support Desk
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        {/* ==================== TAB 1: Profile Details ==================== */}
        {activeTab === 'details' && (
          <div className="kfpl-profile-grid">
            {/* Personal Information */}
            <div className="kfpl-card">
              <h3 style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Personal Information</h3>
              {[
                ['Full Name', client.name],
                ['Email Address', clientEmail],
                ['Phone Number', client.phone],
                ['Date of Birth', client.dob ? new Date(client.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                ['Address', client.address],
                ['Emergency Contact', client.emergencyContact],
              ].map(([label, value]) => (
                <div key={label} className="kfpl-profile-info-row">
                  <span className="kfpl-profile-info-label">{label}</span>
                  <span className="kfpl-profile-info-value">{value}</span>
                </div>
              ))}
            </div>

            {/* Account Details */}
            <div className="kfpl-card">
              <h3 style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Account Details</h3>
              {[
                ['Client ID', client.clientId, true],
                ['Category', client.category],
                ['Account Status', client.status],
                ['Member Since', client.memberSince ? new Date(client.memberSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
                ['Agent', client.agentName ? `${client.agentName} (${client.agentId})` : 'Direct Client'],
              ].map(([label, value, isMono]) => (
                <div key={label} className="kfpl-profile-info-row">
                  <span className="kfpl-profile-info-label">{label}</span>
                  <span className={`kfpl-profile-info-value ${isMono ? 'mono' : ''}`}>
                    {label === 'Account Status' ? <span className="kfpl-badge kfpl-badge--active">{value}</span> : value}
                  </span>
                </div>
              ))}
            </div>

            {/* Nominee Details */}
            <div className="kfpl-nominee-card">
              <div className="kfpl-nominee-card-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <h3 style={{ flex: 1 }}>Nominee Details</h3>
              </div>
              {[
                ['Nominee Name', client.nominee?.name],
                ['Relation', client.nominee?.relation],
                ['Contact', client.nominee?.contact],
                ['Email Address', client.nominee?.email || 'Not provided'],
              ].map(([label, value]) => (
                <div key={label} className="kfpl-profile-info-row">
                  <span className="kfpl-profile-info-label">{label}</span>
                  <span className="kfpl-profile-info-value">{value}</span>
                </div>
              ))}
            </div>

            {/* Risk Profile */}
            <div className="kfpl-card">
              <h3 style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Risk Profile</h3>
              {riskProfile && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{riskProfile.icon}</div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px' }}>{riskProfile.label}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>{riskProfile.description}</p>
                  {client.riskProfileLocked && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: '14px', height: '14px' }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Profile locked after initial selection
                    </div>
                  )}
                  <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => navigate('/service-requests/new')}>
                    Request Change
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: Security & 2FA ==================== */}
        {activeTab === 'security' && (
          <div className="kfpl-profile-grid">
            {/* 2FA Toggle */}
            <div className="kfpl-card">
              <h3 style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Two-Factor Authentication</h3>

              <div className="kfpl-tfa-toggle-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Secure Login with 2FA</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', maxWidth: '280px', lineHeight: 1.4 }}>
                    Require a verification OTP sent to your email whenever you sign in to your dashboard.
                  </p>
                </div>

                {/* Switch toggle control */}
                <label className="kfpl-switch">
                  <input type="checkbox" checked={tfaEnabled} onChange={handleTfaToggle} />
                  <span className="kfpl-switch-slider"></span>
                </label>
              </div>
            </div>
            <div className="kfpl-card">
              <h3 style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Change Password</h3>

              <div className="kfpl-form">
                <div className="kfpl-input-group">
                  <label className="kfpl-input-label">Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="kfpl-input"
                      type={showCurrentPass ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={passForm.currentPass}
                      disabled={passOtpSent}
                      onChange={e => setPassForm({ ...passForm, currentPass: e.target.value })}
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                        {showCurrentPass ? (
                          <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                        ) : (
                          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="kfpl-input-group">
                  <label className="kfpl-input-label">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="kfpl-input"
                      type={showNewPass ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={passForm.newPass}
                      disabled={passOtpSent}
                      onChange={e => setPassForm({ ...passForm, newPass: e.target.value })}
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                        {showNewPass ? (
                          <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                        ) : (
                          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="kfpl-input-group">
                  <label className="kfpl-input-label">Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="kfpl-input"
                      type={showConfirmPass ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      value={passForm.confirmPass}
                      disabled={passOtpSent}
                      onChange={e => setPassForm({ ...passForm, confirmPass: e.target.value })}
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                        {showConfirmPass ? (
                          <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                        ) : (
                          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {!passOtpSent ? (
                  <button
                    type="button"
                    className="kfpl-btn kfpl-btn--primary kfpl-btn--sm"
                    onClick={handleSendPassOtp}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Send OTP
                  </button>
                ) : (
                  <form onSubmit={handleVerifyPassword} className="kfpl-form" style={{ gap: '12px', marginTop: '4px' }}>
                    <div className="kfpl-input-group">
                      <label className="kfpl-input-label">Enter OTP <span className="required">*</span></label>
                      <input
                        className="kfpl-input"
                        type="text"
                        maxLength="6"
                        placeholder="6-digit code"
                        value={passOtpInput}
                        onChange={e => setPassOtpInput(e.target.value.replace(/\D/g, ''))}
                        style={{ letterSpacing: '2px', fontWeight: 600 }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <button type="submit" className="kfpl-btn kfpl-btn--primary kfpl-btn--sm">
                        Verify & Change Password
                      </button>

                      <button
                        type="button"
                        className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm"
                        disabled={passResendTimer > 0}
                        onClick={handleSendPassOtp}
                      >
                        {passResendTimer > 0 ? `Resend OTP in ${passResendTimer}s` : 'Resend OTP'}
                      </button>

                      <button
                        type="button"
                        className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm"
                        onClick={() => {
                          setPassOtpSent(false);
                          setPassOtpInput('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: Support Desk ==================== */}
        {activeTab === 'support' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Advisor & Contact Info Cards Row */}
            <div className="kfpl-support-grid">
              <a href="mailto:support@kfpl.com" className="kfpl-support-card">
                <div className="kfpl-support-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <h3>Email Support</h3>
                <p>support@kfpl.com</p>
              </a>

              <a href="tel:+919876543210" className="kfpl-support-card">
                <div className="kfpl-support-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <h3>Phone Support</h3>
                <p>+91 98765 43210</p>
              </a>

              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="kfpl-support-card">
                <div className="kfpl-support-card-icon" style={{ background: '#25D366', color: 'white' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                </div>
                <h3>WhatsApp Support</h3>
                <p>Chat with us instantly</p>
              </a>
            </div>

            {/* Manager Info panel & FAQs */}
            <div className="kfpl-profile-grid">

              {/* FAQ Section */}
              <div className="kfpl-card">
                <h3 style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Frequently Asked Questions</h3>
                {mockFAQs.map((faq, i) => (
                  <div key={i} className="kfpl-faq-item">
                    <div className={`kfpl-faq-question ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      {faq.q}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                    {openFaq === i && <div className="kfpl-faq-answer">{faq.a}</div>}
                  </div>
                ))}
              </div>

              {/* Wealth Advisor Advisor Widget */}
              <div className="kfpl-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', justifyContent: 'center' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dark) 100%)',
                  color: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: '800',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                  marginBottom: '16px'
                }}>
                  {client.agentName ? client.agentName.split(' ').map(n => n[0]).join('') : 'WA'}
                </div>

                <div>
                  <span className="kfpl-badge kfpl-badge--gold-tier" style={{ fontSize: '0.625rem', marginBottom: '8px' }}>Wealth Advisor</span>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>{client.agentName || 'Wealth Advisor'}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Senior Relationship Manager (ID: {client.agentId || '—'})</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '24px' }}>
                  <a href={`tel:${client.advisorPhone || ''}`} className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" style={{ flex: 1, padding: '10px 0' }}>
                    📞 Call Advisor
                  </a>
                  <a href={`https://wa.me/${client.advisorPhone || '919876543210'}`} target="_blank" rel="noopener noreferrer" className="kfpl-btn kfpl-btn--primary kfpl-btn--sm" style={{ flex: 1, padding: '10px 0', background: '#25D366', borderColor: '#25D366' }}>
                    💬 WhatsApp
                  </a>
                </div>

                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginTop: '16px', lineHeight: 1.4 }}>
                  Our advisory desk is available Mon - Sat, 10 AM to 6 PM IST. For urgent claims, raise a Service Request.
                </p>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

/* ============ END: Profile.jsx ============ */
