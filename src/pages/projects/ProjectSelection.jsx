/* ============================================================
   Page: ProjectSelection.jsx
   Description: Open investment opportunities with apply/notify buttons
   ============================================================ */

import { useState } from 'react';
import { mockOpportunities } from '../../data/mockData';

/* ── Segment color map ─────────────────────── */
const segmentColors = {
  'Film Making':       { bg: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)', tag: '#059669', tagBg: '#ECFDF5', icon: '🎬' },
  'Music':             { bg: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)', tag: '#7C3AED', tagBg: '#F5F3FF', icon: '🎵' },
  'Distribution':      { bg: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)', tag: '#2563EB', tagBg: '#EFF6FF', icon: '🌐' },
  'Content IP Bank':   { bg: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)', tag: '#D97706', tagBg: '#FFFBEB', icon: '📚' },
  'Trading & Syndication': { bg: 'linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #F87171 100%)', tag: '#DC2626', tagBg: '#FEF2F2', icon: '📊' },
  'Film Exhibition':   { bg: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #22D3EE 100%)', tag: '#0891B2', tagBg: '#ECFEFF', icon: '🎥' },
};

const getSegmentStyle = (segment) => segmentColors[segment] || segmentColors['Film Making'];

export default function ProjectSelection() {
  const [applyModal, setApplyModal] = useState(null);
  const [amount, setAmount] = useState('');
  const [ackRisk, setAckRisk] = useState(false);

  const handleApply = () => { setApplyModal(null); setAmount(''); setAckRisk(false); };

  const openCount = mockOpportunities.filter(o => o.status === 'Open').length;

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Project Selection</h1>
          <p className="kfpl-page-subtitle">Explore new investment opportunities and apply</p>
        </div>
        <div className="kfpl-page-header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="kfpl-ps-stat-chip">
            <span className="kfpl-ps-stat-chip-dot kfpl-ps-stat-chip-dot--live"></span>
            <span>{openCount} Open</span>
          </div>
          <div className="kfpl-ps-stat-chip">
            <span style={{ fontSize: '0.875rem' }}>📋</span>
            <span>{mockOpportunities.length} Total</span>
          </div>
        </div>
      </div>

      <div className="kfpl-ps-grid">
        {mockOpportunities.map((opp, idx) => {
          const seg = getSegmentStyle(opp.segment);
          const slotPercent = Math.round((opp.slotsAvailable / opp.totalSlots) * 100);
          const isFull = opp.status === 'Slot Full';

          return (
            <div key={opp.id} className={`kfpl-ps-card${isFull ? ' kfpl-ps-card--full' : ''}`} style={{ animationDelay: `${idx * 0.08}s` }}>
              {/* Card Header / Image Area */}
              <div
                className="kfpl-ps-card-header"
                style={{ background: isFull ? 'linear-gradient(135deg, #4B5563 0%, #6B7280 50%, #9CA3AF 100%)' : seg.bg }}
              >
                <div className="kfpl-ps-card-header-pattern"></div>
                <div className="kfpl-ps-card-header-icon">{isFull ? '🔒' : seg.icon}</div>
                {isFull && <div className="kfpl-ps-card-ribbon">Slot Full</div>}
                {!isFull && <div className="kfpl-ps-card-ribbon kfpl-ps-card-ribbon--open">Open</div>}
              </div>

              {/* Card Body */}
              <div className="kfpl-ps-card-body">
                <span className="kfpl-ps-card-tag" style={{ color: seg.tag, background: seg.tagBg }}>
                  {opp.segment}
                </span>
                <h3 className="kfpl-ps-card-title">{opp.name}</h3>

                <div className="kfpl-ps-card-details">
                  <div className="kfpl-ps-card-detail-row">
                    <span className="kfpl-ps-card-detail-label">Min Investment</span>
                    <span className="kfpl-ps-card-detail-value">₹{(opp.minInvestment / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="kfpl-ps-card-detail-row">
                    <span className="kfpl-ps-card-detail-label">Risk / Reward</span>
                    <span className="kfpl-ps-card-detail-value">{opp.riskReward}</span>
                  </div>
                </div>

                {/* Slot Progress */}
                <div className="kfpl-ps-card-slots">
                  <div className="kfpl-ps-card-slots-header">
                    <span className="kfpl-ps-card-slots-label">Slots Available</span>
                    <span className="kfpl-ps-card-slots-count">
                      <strong>{opp.slotsAvailable}</strong> / {opp.totalSlots}
                    </span>
                  </div>
                  <div className="kfpl-ps-card-slots-bar">
                    <div
                      className={`kfpl-ps-card-slots-fill${isFull ? ' kfpl-ps-card-slots-fill--empty' : ''}`}
                      style={{ width: `${slotPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="kfpl-ps-card-footer">
                {opp.status === 'Open' ? (
                  <button className="kfpl-ps-apply-btn" onClick={() => setApplyModal(opp)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                    Apply Now
                  </button>
                ) : (
                  <button className="kfpl-ps-notify-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    Notify Me
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Apply Modal ─────────────────────── */}
      {applyModal && (() => {
        const seg = getSegmentStyle(applyModal.segment);
        return (
          <div className="kfpl-modal-overlay" onClick={() => setApplyModal(null)}>
            <div className="kfpl-ps-modal" onClick={e => e.stopPropagation()}>
              {/* Modal Top Banner */}
              <div className="kfpl-ps-modal-banner" style={{ background: seg.bg }}>
                <div className="kfpl-ps-modal-banner-pattern"></div>
                <div className="kfpl-ps-modal-banner-content">
                  <span className="kfpl-ps-modal-banner-icon">{seg.icon}</span>
                  <div>
                    <h2 className="kfpl-ps-modal-banner-title">Apply for {applyModal.name}</h2>
                    <span className="kfpl-ps-modal-banner-segment">{applyModal.segment}</span>
                  </div>
                </div>
                <button className="kfpl-ps-modal-close-btn" onClick={() => setApplyModal(null)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              {/* Project Quick Info */}
              <div className="kfpl-ps-modal-info-strip">
                <div className="kfpl-ps-modal-info-item">
                  <span className="kfpl-ps-modal-info-label">Min. Investment</span>
                  <span className="kfpl-ps-modal-info-value">₹{applyModal.minInvestment.toLocaleString()}</span>
                </div>
                <div className="kfpl-ps-modal-info-divider"></div>
                <div className="kfpl-ps-modal-info-item">
                  <span className="kfpl-ps-modal-info-label">Slots Left</span>
                  <span className="kfpl-ps-modal-info-value">{applyModal.slotsAvailable}/{applyModal.totalSlots}</span>
                </div>
                <div className="kfpl-ps-modal-info-divider"></div>
                <div className="kfpl-ps-modal-info-item">
                  <span className="kfpl-ps-modal-info-label">Risk / ROI</span>
                  <span className="kfpl-ps-modal-info-value">{applyModal.riskReward}</span>
                </div>
              </div>

              {/* Form Body */}
              <div className="kfpl-ps-modal-body">
                <div className="kfpl-input-group" style={{ marginBottom: '20px' }}>
                  <label className="kfpl-input-label">
                    Investment Amount (₹) <span className="required">*</span>
                  </label>
                  <div className="kfpl-ps-modal-input-wrap">
                    <span className="kfpl-ps-modal-input-prefix">₹</span>
                    <input
                      className="kfpl-input kfpl-ps-modal-input"
                      type="number"
                      placeholder={`Min: ${applyModal.minInvestment.toLocaleString()}`}
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <label className="kfpl-ps-modal-checkbox-label">
                  <input
                    type="checkbox"
                    className="kfpl-ps-modal-checkbox"
                    checked={ackRisk}
                    onChange={e => setAckRisk(e.target.checked)}
                  />
                  <span className="kfpl-ps-modal-checkbox-custom">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  <span className="kfpl-ps-modal-checkbox-text">
                    I acknowledge the risks associated with this investment and understand the risk-reward profile: <strong>{applyModal.riskReward}</strong>
                  </span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="kfpl-ps-modal-footer">
                <button className="kfpl-btn kfpl-btn--ghost" onClick={() => setApplyModal(null)}>Cancel</button>
                <button
                  className="kfpl-ps-submit-btn"
                  disabled={!amount || !ackRisk}
                  onClick={handleApply}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ============ END: ProjectSelection.jsx ============ */
