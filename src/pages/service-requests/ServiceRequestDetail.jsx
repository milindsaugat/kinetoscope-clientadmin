/* ============================================================
   Page: ServiceRequestDetail.jsx
   Description: Request detail with status timeline and admin notes
   ============================================================ */

import { useNavigate, useParams } from 'react-router-dom';
import { mockServiceRequestDetail } from '../../data/mockData';

export default function ServiceRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const req = mockServiceRequestDetail; // In real app, fetch by id

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Request {req.id}</h1>
          <p className="kfpl-page-subtitle">{req.category} — {req.subject}</p>
        </div>
        <div className="kfpl-page-header-actions">
          <button className="kfpl-btn kfpl-btn--ghost" onClick={() => navigate('/service-requests')}>← Back to Requests</button>
        </div>
      </div>

      <div className="kfpl-grid-2col">
        {/* Request Details */}
        <div className="kfpl-card">
          <h3 style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Request Details</h3>
          <div className="kfpl-profile-info-row"><span className="kfpl-profile-info-label">Request ID</span><span className="kfpl-profile-info-value mono">{req.id}</span></div>
          <div className="kfpl-profile-info-row"><span className="kfpl-profile-info-label">Category</span><span className="kfpl-profile-info-value">{req.category}</span></div>
          <div className="kfpl-profile-info-row"><span className="kfpl-profile-info-label">Subject</span><span className="kfpl-profile-info-value">{req.subject}</span></div>
          <div className="kfpl-profile-info-row"><span className="kfpl-profile-info-label">Status</span><span className="kfpl-profile-info-value"><span className={`kfpl-request-status ${req.status.toLowerCase().replace(' ', '-')}`}>{req.status}</span></span></div>
          <div className="kfpl-profile-info-row"><span className="kfpl-profile-info-label">Date Raised</span><span className="kfpl-profile-info-value">{new Date(req.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{req.description}</p>
          </div>
          {req.adminNotes && (
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'var(--color-gold-light)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-gold)' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold-dark)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Note</h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{req.adminNotes}</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="kfpl-card">
          <h3 style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>Status Timeline</h3>
          <div className="kfpl-timeline">
            {req.timeline.map((item, i) => (
              <div key={i} className="kfpl-timeline-item">
                <div className={`kfpl-timeline-dot ${i > 0 ? 'muted' : ''}`}></div>
                <div className="kfpl-timeline-content">
                  <div className="kfpl-timeline-date">{item.date}</div>
                  <div className="kfpl-timeline-text">{item.text}</div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ END: ServiceRequestDetail.jsx ============ */
