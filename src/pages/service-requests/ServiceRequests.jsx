/* ============================================================
   Page: ServiceRequests.jsx
   Description: List of client's service requests with status
   ============================================================ */

import { useNavigate } from 'react-router-dom';
import { mockServiceRequests } from '../../data/mockData';

/* Status config */
const statusConfig = {
  'Open':        { color: '#D97706', bg: 'rgba(245, 158, 11, 0.1)', icon: '●' },
  'In Progress': { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', icon: '◐' },
  'Resolved':    { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: '✓' },
  'Closed':      { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', icon: '—' },
};

const getStatusStyle = (status) => statusConfig[status] || statusConfig['Open'];

export default function ServiceRequests() {
  const navigate = useNavigate();

  const openCount = mockServiceRequests.filter(r => r.status === 'Open').length;
  const progressCount = mockServiceRequests.filter(r => r.status === 'In Progress').length;
  const resolvedCount = mockServiceRequests.filter(r => r.status === 'Resolved').length;

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Service Requests</h1>
          <p className="kfpl-page-subtitle">View and raise service requests to our support team</p>
        </div>
        <div className="kfpl-page-header-actions">
          <button className="kfpl-sr-new-btn" onClick={() => navigate('/service-requests/new')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Request
          </button>
        </div>
      </div>

      {/* ── Status Summary ─────────────────────── */}
      <div className="kfpl-sr-summary">
        <div className="kfpl-sr-summary-chip kfpl-sr-summary-chip--open">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span><strong>{openCount}</strong> Open</span>
        </div>
        <div className="kfpl-sr-summary-chip kfpl-sr-summary-chip--progress">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>
          <span><strong>{progressCount}</strong> In Progress</span>
        </div>
        <div className="kfpl-sr-summary-chip kfpl-sr-summary-chip--resolved">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span><strong>{resolvedCount}</strong> Resolved</span>
        </div>
      </div>

      {/* ── Request Cards ─────────────────────── */}
      <div className="kfpl-sr-list">
        {mockServiceRequests.map((req, i) => {
          const st = getStatusStyle(req.status);
          return (
            <div key={req.id} className="kfpl-sr-card" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => navigate(`/service-requests/${req.id}`)}>
              <div className="kfpl-sr-card-left">
                <div className="kfpl-sr-card-status-dot" style={{ background: st.color }}></div>
                <div className="kfpl-sr-card-info">
                  <div className="kfpl-sr-card-top">
                    <span className="kfpl-sr-card-id">{req.id}</span>
                    <span className="kfpl-sr-card-category">{req.category}</span>
                  </div>
                  <h4 className="kfpl-sr-card-subject">{req.subject}</h4>
                  <span className="kfpl-sr-card-date">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {new Date(req.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="kfpl-sr-card-right">
                <span className="kfpl-sr-card-status" style={{ color: st.color, background: st.bg }}>
                  {req.status}
                </span>
                <svg className="kfpl-sr-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </div>
          );
        })}
      </div>

      {mockServiceRequests.length === 0 && (
        <div className="kfpl-sr-empty">
          <div className="kfpl-sr-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 className="kfpl-sr-empty-title">No Service Requests</h3>
          <p className="kfpl-sr-empty-text">You haven't raised any service requests yet.</p>
          <button className="kfpl-sr-new-btn" onClick={() => navigate('/service-requests/new')} style={{ marginTop: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Your First Request
          </button>
        </div>
      )}
    </div>
  );
}

/* ============ END: ServiceRequests.jsx ============ */
