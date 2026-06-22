/* ============================================================
   Page: PaymentRequests.jsx
   Description: Deposit/Withdrawal request forms and history
   ============================================================ */

import { useState } from 'react';
import { mockPaymentRequests } from '../../data/mockData';

/* ── SVG Icons ─────────────────────── */
const DepositIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 7l-5-5-5 5"/><rect x="3" y="14" width="18" height="8" rx="2"/></svg>
);
const WithdrawIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V2"/><path d="M7 17l5 5 5-5"/><rect x="3" y="2" width="18" height="8" rx="2"/></svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
);
const CreditCardIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
);

export default function PaymentRequests() {
  const [activeTab, setActiveTab] = useState('deposit');
  const [form, setForm] = useState({ amount: '', mode: 'Bank Transfer', reference: '', note: '', reason: '' });

  const formatAmount = (num) => `₹${Number(num).toLocaleString('en-IN')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ amount: '', mode: 'Bank Transfer', reference: '', note: '', reason: '' });
  };

  const totalDeposits = mockPaymentRequests.filter(r => r.type === 'Deposit').reduce((s, r) => s + r.amount, 0);
  const totalWithdrawals = mockPaymentRequests.filter(r => r.type === 'Withdrawal').reduce((s, r) => s + r.amount, 0);
  const pendingCount = mockPaymentRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Payments</h1>
          <p className="kfpl-page-subtitle">Raise deposit or withdrawal requests</p>
        </div>
      </div>

      {/* ── Summary KPIs ─────────────────────── */}
      <div className="kfpl-pay-kpis">
        <div className="kfpl-pay-kpi">
          <div className="kfpl-pay-kpi-icon kfpl-pay-kpi-icon--deposit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
          </div>
          <div>
            <span className="kfpl-pay-kpi-label">Total Deposits</span>
            <span className="kfpl-pay-kpi-value">{formatAmount(totalDeposits)}</span>
          </div>
        </div>
        <div className="kfpl-pay-kpi">
          <div className="kfpl-pay-kpi-icon kfpl-pay-kpi-icon--withdraw">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>
          </div>
          <div>
            <span className="kfpl-pay-kpi-label">Total Withdrawals</span>
            <span className="kfpl-pay-kpi-value">{formatAmount(totalWithdrawals)}</span>
          </div>
        </div>
        <div className="kfpl-pay-kpi">
          <div className="kfpl-pay-kpi-icon kfpl-pay-kpi-icon--pending">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <span className="kfpl-pay-kpi-label">Pending</span>
            <span className="kfpl-pay-kpi-value">{pendingCount} request{pendingCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="kfpl-pay-grid">
        {/* ── Request Form ─────────────────────── */}
        <div className="kfpl-pay-form-card">
          <div className="kfpl-pay-tabs">
            <button
              className={`kfpl-pay-tab ${activeTab === 'deposit' ? 'kfpl-pay-tab--active' : ''}`}
              onClick={() => setActiveTab('deposit')}
            >
              <DepositIcon /> Deposit
            </button>
            <button
              className={`kfpl-pay-tab ${activeTab === 'withdrawal' ? 'kfpl-pay-tab--active' : ''}`}
              onClick={() => setActiveTab('withdrawal')}
            >
              <WithdrawIcon /> Withdrawal
            </button>
          </div>

          <form className="kfpl-form" onSubmit={handleSubmit}>
            <div className="kfpl-input-group">
              <label className="kfpl-input-label">Amount (₹) <span className="required">*</span></label>
              <div className="kfpl-ps-modal-input-wrap">
                <span className="kfpl-ps-modal-input-prefix">₹</span>
                <input className="kfpl-input kfpl-ps-modal-input" type="number" placeholder="Enter amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div className="kfpl-input-group">
              <label className="kfpl-input-label">Payment Mode</label>
              <select className="kfpl-select" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
                <option>Bank Transfer</option><option>NEFT</option><option>RTGS</option><option>UPI</option>
              </select>
            </div>
            {activeTab === 'deposit' && (
              <div className="kfpl-input-group">
                <label className="kfpl-input-label">Reference Number</label>
                <input className="kfpl-input" placeholder="Transaction reference (optional)" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
              </div>
            )}
            {activeTab === 'withdrawal' && (
              <div className="kfpl-input-group">
                <label className="kfpl-input-label">Reason <span className="required">*</span></label>
                <input className="kfpl-input" placeholder="Reason for withdrawal" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
              </div>
            )}
            <div className="kfpl-input-group">
              <label className="kfpl-input-label">Note</label>
              <textarea className="kfpl-textarea" placeholder="Any additional notes..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} rows={3}></textarea>
            </div>
            <button type="submit" className="kfpl-pay-submit-btn" disabled={!form.amount}>
              <SendIcon />
              Submit {activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'} Request
            </button>
          </form>
        </div>

        {/* ── Online Payment Coming Soon ─────────────────────── */}
        <div className="kfpl-pay-coming-soon">
          <div className="kfpl-pay-coming-soon-icon">
            <CreditCardIcon />
          </div>
          <h3 className="kfpl-pay-coming-soon-title">Online Payment</h3>
          <p className="kfpl-pay-coming-soon-text">PSP integration coming soon. You'll be able to make payments directly online.</p>
          <span className="kfpl-pay-coming-soon-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Coming Soon
          </span>
        </div>
      </div>

      {/* ── Request History Table ─────────────────────── */}
      <div className="kfpl-pay-history">
        <div className="kfpl-pay-history-header">
          <div className="kfpl-pay-history-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          </div>
          <h3 className="kfpl-pay-history-title">Request History</h3>
        </div>
        <div className="kfpl-pay-history-list">
          {mockPaymentRequests.map((req, i) => (
            <div key={req.id} className="kfpl-pay-history-item" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className={`kfpl-pay-history-type ${req.type === 'Deposit' ? 'kfpl-pay-history-type--deposit' : 'kfpl-pay-history-type--withdraw'}`}>
                {req.type === 'Deposit' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>
                )}
              </div>
              <div className="kfpl-pay-history-info">
                <span className="kfpl-pay-history-name">{req.type}</span>
                <span className="kfpl-pay-history-note">{req.note} · {req.mode}</span>
              </div>
              <div className="kfpl-pay-history-amount">
                <span className={req.type === 'Deposit' ? 'kfpl-pay-history-amount--positive' : 'kfpl-pay-history-amount--negative'}>
                  {req.type === 'Deposit' ? '+' : '-'}{formatAmount(req.amount)}
                </span>
                <span className="kfpl-pay-history-date">
                  {new Date(req.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <span className={`kfpl-badge kfpl-badge--${req.status.toLowerCase()}`}>{req.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ END: PaymentRequests.jsx ============ */
