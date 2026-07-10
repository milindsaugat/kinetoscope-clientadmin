/* ============================================================
   Page: PerksAndRecognition.jsx
   Description: Perks module with tier card, benefits, progress, history
   ============================================================ */

import { useState, useEffect } from 'react';
import { PERK_TIERS } from '../../constants';
import { apiRequest } from '../../config/apiHelper';

/* ── SVG Tier Icons ─────────────────────── */
const TierIcons = {
  Silver: (props = {}) => (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M9 18l3-6 3 6"/><path d="M8 22h8"/><path d="M12 18v4"/>
    </svg>
  ),
  Gold: (props = {}) => (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  Platinum: (props = {}) => (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M10 9l2-6 2 6"/><path d="M6 9l6 13 6-13"/>
    </svg>
  ),
  Diamond: (props = {}) => (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke={props.color || 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12l5-8h10l5 8-10 10L2 12z"/><path d="M7 4l5 8M17 4l-5 8M2 12h20"/>
    </svg>
  ),
};

/* ── Tier visual config ─────────────────────── */
const tierVisuals = {
  Silver:   { gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 50%, #D1D5DB 100%)', glow: 'rgba(156, 163, 175, 0.2)', accent: '#9CA3AF', iconColor: '#D1D5DB' },
  Gold:     { gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 50%, #F59E0B 100%)', glow: 'rgba(245, 158, 11, 0.2)', accent: '#F59E0B', iconColor: '#FDE68A' },
  Platinum: { gradient: 'linear-gradient(135deg, #334155 0%, #64748B 50%, #94A3B8 100%)', glow: 'rgba(148, 163, 184, 0.2)', accent: '#94A3B8', iconColor: '#CBD5E1' },
  Diamond:  { gradient: 'linear-gradient(135deg, #164E63 0%, #0891B2 50%, #06B6D4 100%)', glow: 'rgba(6, 182, 212, 0.2)', accent: '#06B6D4', iconColor: '#67E8F9' },
};

/* Timeline SVG icons */
const ArrowUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
);
const SparkleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18M5.63 5.63l12.73 12.73M18.36 5.63L5.63 18.36"/></svg>
);

export default function PerksAndRecognition() {
  const [perksData, setPerksData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerks = async () => {
      setLoading(true);
      try {
        const res = await apiRequest('/api/client/perks');
        
        // Normalize tier case (e.g. GOLD -> Gold, gold -> Gold)
        const rawTier = res.currentTier || res.tier || 'Silver';
        const currentTier = rawTier.charAt(0).toUpperCase() + rawTier.slice(1).toLowerCase();

        setPerksData({
          currentTier,
          nextTierAmount: res.nextTierAmount || 0,
          progressPercent: res.progressPercent !== undefined ? res.progressPercent : (res.upgradePercentage || 0),
          totalInvested: res.totalInvested || 0,
          history: (res.history || []).map(h => ({
            date: h.date || h.assignedAt || new Date().toISOString(),
            event: h.event || h.perkName || h.title || '',
            type: h.type || 'perk'
          }))
        });
      } catch (err) {
        console.error('Failed to fetch client perks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerks();
  }, []);

  const activePerksData = perksData || {
    currentTier: 'Silver',
    nextTierAmount: 2500000,
    progressPercent: 0,
    totalInvested: 0,
    history: []
  };

  const tier = PERK_TIERS[activePerksData.currentTier] || PERK_TIERS.Silver;
  const visual = tierVisuals[activePerksData.currentTier] || tierVisuals.Silver;
  const tierKeys = Object.keys(PERK_TIERS);
  const currentIdx = tierKeys.indexOf(activePerksData.currentTier);
  const nextTier = currentIdx < tierKeys.length - 1 ? PERK_TIERS[tierKeys[currentIdx + 1]] : null;
  const nextVisual = nextTier ? tierVisuals[tierKeys[currentIdx + 1]] : null;

  const upgradeAmountNeeded = activePerksData.nextTierAmount !== undefined
    ? activePerksData.nextTierAmount
    : (nextTier ? Math.max(0, nextTier.minAmount - activePerksData.totalInvested) : 0);

  const progressPercent = activePerksData.progressPercent !== undefined
    ? activePerksData.progressPercent
    : (nextTier ? Math.min(100, ((activePerksData.totalInvested - tier.minAmount) / (nextTier.minAmount - tier.minAmount)) * 100) : 100);

  const formatAmount = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const renderTierIcon = (tierName, size = 24, color) => {
    const Icon = TierIcons[tierName];
    return Icon ? <Icon size={size} color={color} /> : null;
  };

  if (loading) {
    return (
      <div className="kfpl-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div className="kfpl-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="kfpl-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Perks & Recognition</h1>
          <p className="kfpl-page-subtitle">Your loyalty rewards and tier benefits</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="kfpl-prk-current-badge" style={{ background: visual.gradient }}>
            {renderTierIcon(activePerksData.currentTier, 16, '#fff')}
            {tier.label}
          </span>
        </div>
      </div>

      {/* ── Hero Tier Banner ─────────────────────── */}
      <div className="kfpl-prk-hero" style={{ background: visual.gradient }}>
        <div className="kfpl-prk-hero-deco">
          <div className="kfpl-prk-hero-circle kfpl-prk-hero-circle--1"></div>
          <div className="kfpl-prk-hero-circle kfpl-prk-hero-circle--2"></div>
          <div className="kfpl-prk-hero-circle kfpl-prk-hero-circle--3"></div>
        </div>
        <div className="kfpl-prk-hero-content">
          <div className="kfpl-prk-hero-left">
            <div className="kfpl-prk-hero-icon">
              {renderTierIcon(activePerksData.currentTier, 48, visual.iconColor)}
            </div>
            <div>
              <h2 className="kfpl-prk-hero-title">{tier.label} Tier Member</h2>
              <p className="kfpl-prk-hero-subtitle">
                Based on your investment of <strong>{formatAmount(activePerksData.totalInvested)}</strong>
              </p>
            </div>
          </div>
          <div className="kfpl-prk-hero-stats">
            <div className="kfpl-prk-hero-stat">
              <span className="kfpl-prk-hero-stat-value">{tier.benefits.length}</span>
              <span className="kfpl-prk-hero-stat-label">Benefits</span>
            </div>
            <div className="kfpl-prk-hero-stat">
              <span className="kfpl-prk-hero-stat-value">{currentIdx + 1}/{tierKeys.length}</span>
              <span className="kfpl-prk-hero-stat-label">Tier Level</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Next Tier Progress ─────────────────────── */}
      {nextTier && (
        <div className="kfpl-prk-upgrade-card">
          <div className="kfpl-prk-upgrade-header">
            <div className="kfpl-prk-upgrade-info">
              <div className="kfpl-prk-upgrade-icon-wrap" style={{ background: nextVisual.glow, color: nextVisual.accent }}>
                {renderTierIcon(tierKeys[currentIdx + 1], 28, nextVisual.accent)}
              </div>
              <div>
                <h3 className="kfpl-prk-upgrade-title">
                  Upgrade to {tierKeys[currentIdx + 1]}
                </h3>
                <p className="kfpl-prk-upgrade-subtitle">
                  Invest <strong style={{ color: 'var(--color-gold-dark)' }}>{formatAmount(upgradeAmountNeeded)}</strong> more to unlock
                </p>
              </div>
            </div>
            <div className="kfpl-prk-upgrade-percent" style={{ color: nextVisual.accent }}>
              {progressPercent.toFixed(0)}%
            </div>
          </div>
          <div className="kfpl-prk-upgrade-track">
            <div className="kfpl-prk-upgrade-fill" style={{ width: `${progressPercent}%`, background: nextVisual.gradient }}></div>
          </div>
          <div className="kfpl-prk-upgrade-labels">
            <span>{formatAmount(tier.minAmount)}</span>
            <span>{formatAmount(nextTier.minAmount)}</span>
          </div>
        </div>
      )}

      {/* ── Benefits + History Grid ─────────────────────── */}
      <div className="kfpl-prk-grid">
        {/* Your Benefits */}
        <div className="kfpl-prk-benefits-card">
          <div className="kfpl-prk-benefits-header">
            <div className="kfpl-prk-benefits-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <h3 className="kfpl-prk-benefits-title">Your Benefits</h3>
            <span className="kfpl-prk-benefits-count">{tier.benefits.length}</span>
          </div>
          <div className="kfpl-prk-benefits-list">
            {tier.benefits.map((b, i) => (
              <div key={i} className="kfpl-prk-benefit-item" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="kfpl-prk-benefit-check">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recognition History */}
        <div className="kfpl-prk-history-card">
          <div className="kfpl-prk-history-header">
            <div className="kfpl-prk-history-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 className="kfpl-prk-history-title">Recognition History</h3>
          </div>
          <div className="kfpl-prk-timeline">
            {activePerksData.history.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                No recognition history found
              </div>
            ) : (
              activePerksData.history.map((item, i) => (
                <div key={i} className="kfpl-prk-timeline-item" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="kfpl-prk-timeline-track">
                    <div className={`kfpl-prk-timeline-dot ${item.type === 'tier' ? 'kfpl-prk-timeline-dot--tier' : ''}`}>
                      {item.type === 'tier' ? <ArrowUpIcon /> : <SparkleIcon />}
                    </div>
                    {i < activePerksData.history.length - 1 && <div className="kfpl-prk-timeline-line"></div>}
                  </div>
                  <div className="kfpl-prk-timeline-content">
                    <span className="kfpl-prk-timeline-date">
                      {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <p className="kfpl-prk-timeline-text">{item.event}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Tier Journey / Roadmap ─────────────────────── */}
      <div className="kfpl-prk-roadmap-card">
        <h3 className="kfpl-prk-roadmap-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          Tier Roadmap
        </h3>
        <div className="kfpl-prk-roadmap">
          {tierKeys.map((key, idx) => {
            const t = PERK_TIERS[key];
            const v = tierVisuals[key];
            const isCurrent = key === activePerksData.currentTier;
            const isUnlocked = idx <= currentIdx;
            const isNext = idx === currentIdx + 1;

            return (
              <div
                key={key}
                className={`kfpl-prk-roadmap-tier ${isCurrent ? 'kfpl-prk-roadmap-tier--current' : ''} ${isUnlocked ? 'kfpl-prk-roadmap-tier--unlocked' : ''} ${isNext ? 'kfpl-prk-roadmap-tier--next' : ''}`}
              >
                <div className="kfpl-prk-roadmap-tier-header" style={isCurrent ? { background: v.gradient } : {}}>
                  <span className="kfpl-prk-roadmap-tier-icon" style={{ color: isCurrent ? v.iconColor : v.accent }}>
                    {renderTierIcon(key, 24, isCurrent ? v.iconColor : v.accent)}
                  </span>
                  <div>
                    <span className="kfpl-prk-roadmap-tier-name">{key}</span>
                    <span className="kfpl-prk-roadmap-tier-range">
                      {formatAmount(t.minAmount)} – {t.maxAmount ? formatAmount(t.maxAmount) : '∞'}
                    </span>
                  </div>
                </div>
                <div className="kfpl-prk-roadmap-tier-body">
                  <div className="kfpl-prk-roadmap-tier-meta">
                    <span>{t.benefits.length} benefits</span>
                    {isCurrent && <span className="kfpl-badge kfpl-badge--active" style={{ fontSize: '0.625rem' }}>Current</span>}
                    {isUnlocked && !isCurrent && <span className="kfpl-badge kfpl-badge--inactive" style={{ fontSize: '0.625rem' }}>Unlocked</span>}
                    {!isUnlocked && <span className="kfpl-badge kfpl-badge--inactive" style={{ fontSize: '0.625rem' }}>Locked</span>}
                  </div>
                  <ul className="kfpl-prk-roadmap-benefits">
                    {t.benefits.slice(0, 3).map((b, bi) => (
                      <li key={bi}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={isUnlocked ? 'var(--color-gold)' : 'var(--color-border)'} stroke={isUnlocked ? 'var(--color-gold)' : 'var(--color-border)'} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {b}
                      </li>
                    ))}
                    {t.benefits.length > 3 && (
                      <li className="kfpl-prk-roadmap-more">+{t.benefits.length - 3} more</li>
                    )}
                  </ul>
                </div>
                {idx < tierKeys.length - 1 && (
                  <div className={`kfpl-prk-roadmap-connector ${isUnlocked ? 'kfpl-prk-roadmap-connector--active' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============ END: PerksAndRecognition.jsx ============ */
