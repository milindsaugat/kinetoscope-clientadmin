/* ============================================================
   Page: CompleteTransactionDetails.jsx
   Description: Client-facing read-only view of ROI / payout history
   ============================================================ */

import { useState, useEffect } from 'react';
import {
  mockClient,
  mockROIHistory,
  formatCurrency
} from '../../data/mockData';

export default function CompleteTransactionDetails() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Try reading from localStorage (same key super-admin writes)
    const localROI = localStorage.getItem('kfpl_client_roi');
    if (localROI) {
      const parsed = JSON.parse(localROI);
      // Filter to current mock client
      const clientRecords = parsed.filter(
        r => r.clientId === mockClient.clientId || r.investorName === mockClient.name
      );
      setRecords(clientRecords);
    } else {
      // Fallback to mockROIHistory
      const fallback = mockROIHistory.map((roi, idx) => ({
        id: idx + 1,
        investorName: mockClient.name,
        clientId: mockClient.clientId,
        month: roi.month,
        amount: roi.received > 0 ? roi.received : roi.expected,
        status: roi.status.toLowerCase(),
        paidAt: roi.status === 'Paid' ? '2025-04-15' : null,
        paymentMode: roi.status === 'Paid' ? 'Bank Transfer' : null,
        transactionRef: roi.status === 'Paid' ? `TXN-ROI-${idx + 1}` : null,
        roiPercentage: 12,
      }));
      setRecords(fallback);
    }
  }, []);

  const filteredRecords = records.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const haystack = [
        r.investorName, r.clientId, r.month,
        r.paymentMode, r.transactionRef
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const paidCount = records.filter(r => r.status === 'paid').length;
  const pendingCount = records.filter(r => r.status === 'pending').length;
  const totalPaid = records
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="kfpl-page animate-fade-slide-up">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h2 className="kfpl-page-title">Complete Transaction Details</h2>
          <p className="kfpl-page-subtitle">View your ROI payout history and status</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="kfpl-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Total Records</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{records.length}</div>
        </div>
        <div className="kfpl-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Paid Payouts</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success)' }}>{paidCount}</div>
        </div>
        <div className="kfpl-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Pending</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-warning)' }}>{pendingCount}</div>
        </div>
        <div className="kfpl-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Total Received</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gold-dark)' }}>{formatCurrency(totalPaid)}</div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="kfpl-filter-chips" style={{ marginBottom: '16px' }}>
        {['all', 'paid', 'pending'].map(f => (
          <span
            key={f}
            className={`kfpl-filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'paid' && ` (${paidCount})`}
            {f === 'pending' && ` (${pendingCount})`}
          </span>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--color-text-muted)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="kfpl-input"
            placeholder="Search by month, reference, payment mode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="kfpl-table-wrapper" style={{ marginTop: '24px' }}>
        <div className="kfpl-table-header">
          <div>
            <h3 className="kfpl-table-title" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Payout & Transaction Log</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>Detailed record of monthly payouts, expected ROI, and confirmation references</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="kfpl-badge kfpl-badge--active" style={{ fontSize: '0.72rem', padding: '4px 10px', textTransform: 'none' }}>
              Showing {filteredRecords.length} of {records.length} records
            </span>
          </div>
        </div>

        <div className="kfpl-table-container">
          <table className="kfpl-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '24px' }}>Month / Period</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Payment Mode / Reference</th>
                <th>Status</th>
                <th style={{ paddingRight: '24px' }}>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', background: 'var(--color-white)' }}>
                    No records found
                  </td>
                </tr>
              ) : filteredRecords.map((rec, idx) => (
                <tr key={rec.id || idx}>
                  <td style={{ paddingLeft: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', color: 'var(--color-navy-hover)' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{rec.month}</span>
                    </div>
                  </td>
                  <td className="font-bold" style={{ textAlign: 'right', fontSize: '0.9rem', color: rec.status === 'paid' ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                    {formatCurrency(rec.amount)}
                  </td>
                  <td>
                    {rec.paymentMode ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{rec.paymentMode}</span>
                        {rec.transactionRef && (
                          <span className="font-mono" style={{ fontSize: '0.72rem', background: 'var(--color-surface)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border-light)', width: 'fit-content', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                            {rec.transactionRef}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`kfpl-badge kfpl-badge--${rec.status.toLowerCase()}`}>
                      {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ paddingRight: '24px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {rec.paidAt || <span style={{ color: 'var(--color-text-muted)' }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
